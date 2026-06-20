import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";

import { auth, db } from "../../src/services/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";

export default function EditarPerfilScreen() {
  const [nome, setNome] = useState("");
  
  // Estados para a troca de senha (opcionais)
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");

  const [loading, setLoading] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [erroMsg, setErroMsg] = useState("");

  // Carrega o nome atual do usuário assim que a tela abre
  useEffect(() => {
    async function carregarDados() {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setNome(docSnap.data().nome);
        }
      } catch (error) {
        Alert.alert("Erro", "Falha ao carregar seus dados.");
      } finally {
        setCarregandoDados(false);
      }
    }
    carregarDados();
  }, []);

  async function handleSalvar() {
    setErroMsg("");

    if (!nome.trim()) {
      setErroMsg("O campo nome não pode ficar vazio.");
      return;
    }

    // Lógica condicional: O usuário quer trocar a senha?
    const querTrocarSenha = novaSenha.trim() !== "" || confirmarNovaSenha.trim() !== "";

    if (querTrocarSenha) {
      if (!senhaAtual.trim()) {
        setErroMsg("Para alterar a senha, digite sua senha atual.");
        return;
      }
      if (novaSenha !== confirmarNovaSenha) {
        setErroMsg("As novas senhas não coincidem.");
        return;
      }
      if (novaSenha.length < 6) {
        setErroMsg("A nova senha deve possuir pelo menos 6 caracteres.");
        return;
      }
    }

    try {
      setLoading(true);
      const user = auth.currentUser;

      if (!user || !user.email) throw new Error("Usuário não encontrado");

      // 1. Atualiza o Nome no Firestore (Sempre executa)
      const docRef = doc(db, "usuarios", user.uid);
      await updateDoc(docRef, { nome: nome.trim() });

      // 2. Atualiza a Senha no Authentication (Apenas se solicitado)
      if (querTrocarSenha) {
        // Cria a credencial para provar ao Firebase que o dono da conta está presente
        const credencial = EmailAuthProvider.credential(user.email, senhaAtual);
        
        // Reautentica o usuário nos bastidores
        await reauthenticateWithCredential(user, credencial);
        
        // Aplica a nova senha
        await updatePassword(user, novaSenha);
      }

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      router.back(); // Retorna para a tela de perfil

    } catch (error: any) {
      let mensagem = "Erro inesperado ao atualizar perfil.";

      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
          mensagem = "A Senha Atual digitada está incorreta.";
          break;
        case "auth/too-many-requests":
          mensagem = "Muitas tentativas. Aguarde e tente novamente.";
          break;
        case "auth/network-request-failed":
          mensagem = "Sem conexão com a internet.";
          break;
      }
      setErroMsg(mensagem);
    } finally {
      setLoading(false);
    }
  }

  if (carregandoDados) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      <Text style={styles.sectionTitle}>Dados Pessoais</Text>
      <TextInput
        style={styles.input}
        placeholder="Seu Nome"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.sectionTitle}>Segurança (Opcional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Senha Atual"
        secureTextEntry
        value={senhaAtual}
        onChangeText={setSenhaAtual}
      />

      <TextInput
        style={styles.input}
        placeholder="Nova Senha"
        secureTextEntry
        value={novaSenha}
        onChangeText={setNovaSenha}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar Nova Senha"
        secureTextEntry
        value={confirmarNovaSenha}
        onChangeText={setConfirmarNovaSenha}
      />

      {erroMsg !== "" && <Text style={styles.errorText}>{erroMsg}</Text>}

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSalvar}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Salvar Alterações</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.back()}
        disabled={loading}
      >
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#FFF",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
    marginTop: 20,
    textAlign: "center",
    color: "#333",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4B5563",
    marginBottom: 10,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 14,
    marginBottom: 15,
    backgroundColor: "#F9FAFB",
    fontSize: 16,
  },
  errorText: {
    color: "#DC2626",
    textAlign: "center",
    marginBottom: 15,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#6B7280",
    fontWeight: "bold",
    fontSize: 16,
  },
});