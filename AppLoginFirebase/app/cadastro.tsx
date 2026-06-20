import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { auth, db } from "../src/services/firebaseConfig";

export default function CadastroScreen() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  
  const [loading, setLoading] = useState(false);
  // 1. Criamos o estado de erro para manter a consistência com a tela de Login
  const [erroMsg, setErroMsg] = useState("");

  async function handleCadastro() {
    // 2. Limpa erros antigos a cada nova tentativa
    setErroMsg("");

    // 3. Validações Locais com feedback visual direto
    if (!nome.trim() || !email.trim() || !senha.trim() || !confirmarSenha.trim()) {
      setErroMsg("Preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErroMsg("As senhas não coincidem.");
      return;
    }

    if (senha.length < 6) {
      setErroMsg("A senha deve possuir pelo menos 6 caracteres.");
      return;
    }

    try {
      setLoading(true);

      // Cria usuário no Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        senha
      );

      const uid = userCredential.user.uid;

      // Salva informações no banco de dados Firestore
      await setDoc(doc(db, "usuarios", uid), {
        uid,
        nome: nome.trim(),
        email: email.trim(),
        criadoEm: new Date(),
      });

      // Mantemos o Alert nativo APENAS para o caso de sucesso, 
      // pois ele serve como uma confirmação positiva antes da troca de tela.
      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
      
      router.replace("/(auth)/perfil");

    } catch (error: any) {
      // 4. Captura e tradução de erros vindos do servidor do Firebase
      let mensagem = "Erro inesperado ao realizar cadastro.";

      switch (error.code) {
        case "auth/email-already-in-use":
          mensagem = "Este e-mail já está cadastrado no sistema.";
          break;
        case "auth/invalid-email":
          mensagem = "O formato do e-mail digitado é inválido.";
          break;
        case "auth/weak-password":
          mensagem = "Sua senha é muito fraca. Tente uma mais complexa.";
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha (mínimo 6 caracteres)"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
      />

      {/* 5. Exibição da mensagem de erro em vermelho logo acima do botão */}
      {erroMsg !== "" && (
        <Text style={styles.errorText}>{erroMsg}</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleCadastro}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Cadastrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Já possui uma conta? Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 14,
    marginBottom: 15,
  },
  errorText: {
    color: '#DC2626', // Vermelho forte
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#2563EB",
    fontWeight: "600",
  },
});