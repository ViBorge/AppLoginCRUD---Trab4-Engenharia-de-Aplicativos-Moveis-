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
  
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");

  const [loading, setLoading] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [erroMsg, setErroMsg] = useState("");

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

      const docRef = doc(db, "usuarios", user.uid);
      await updateDoc(docRef, { nome: nome.trim() });

      if (querTrocarSenha) {
        const credencial = EmailAuthProvider.credential(user.email, senhaAtual);
        await reauthenticateWithCredential(user, credencial);
        await updatePassword(user, novaSenha);
      }

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      router.back();

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
        <ActivityIndicator size="large" color="#FF0055" />
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
        placeholderTextColor="#71717A"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.sectionTitle}>Segurança (Opcional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Senha Atual"
        placeholderTextColor="#71717A"
        secureTextEntry
        value={senhaAtual}
        onChangeText={setSenhaAtual}
      />

      <TextInput
        style={styles.input}
        placeholder="Nova Senha"
        placeholderTextColor="#71717A"
        secureTextEntry
        value={novaSenha}
        onChangeText={setNovaSenha}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar Nova Senha"
        placeholderTextColor="#71717A"
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
          <ActivityIndicator color="#09090B" />
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
    backgroundColor: "#09090B",
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#09090B",
  },
  title: {
    fontSize: 38,
    fontWeight: "900",
    marginBottom: 30,
    marginTop: 20,
    textAlign: "center",
    color: "#FFFFFF",
    letterSpacing: 2,
    textTransform: "uppercase",
    textShadowColor: "#FF0055",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#E1E1E6",
    marginBottom: 10,
    marginTop: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  input: {
    borderWidth: 2,
    borderColor: "#333333",
    borderRadius: 4,
    padding: 14,
    marginBottom: 15,
    backgroundColor: "#121214",
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "#FF0055",
    textAlign: "center",
    marginBottom: 15,
    fontWeight: "bold",
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 15,
    borderWidth: 2,
    borderColor: "#FF0055",
  },
  buttonText: {
    color: "#09090B",
    fontWeight: "900",
    fontSize: 18,
    textTransform: "uppercase",
  },
  cancelButton: {
    padding: 16,
    borderRadius: 4,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});