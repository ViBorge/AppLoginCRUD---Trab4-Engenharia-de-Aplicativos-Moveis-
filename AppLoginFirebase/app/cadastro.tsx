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
  const [erroMsg, setErroMsg] = useState("");

  async function handleCadastro() {
    setErroMsg("");

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

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        senha
      );

      const uid = userCredential.user.uid;

      await setDoc(doc(db, "usuarios", uid), {
        uid,
        nome: nome.trim(),
        email: email.trim(),
        criadoEm: new Date(),
      });

      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
      router.replace("/(auth)/perfil");

    } catch (error: any) {
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
        placeholderTextColor="#71717A"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#71717A"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha (mínimo 6 caracteres)"
        placeholderTextColor="#71717A"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        placeholderTextColor="#71717A"
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
      />

      {erroMsg !== "" && (
        <Text style={styles.errorText}>{erroMsg}</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleCadastro}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#09090B" />
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
    backgroundColor: "#09090B",
  },
  title: {
    fontSize: 38,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 30,
    color: "#FFFFFF",
    letterSpacing: 2,
    textTransform: "uppercase",
    textShadowColor: "#FF0055",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 1,
  },
  input: {
    borderWidth: 2,
    borderColor: "#333333",
    borderRadius: 4,
    padding: 16,
    marginBottom: 15,
    backgroundColor: "#121214",
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "#FF0055",
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
    fontSize: 15,
  },
  button: {
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
  link: {
    marginTop: 25,
    textAlign: "center",
    color: "#FFFFFF",
    fontWeight: "bold",
    textDecorationLine: "underline",
    fontSize: 15,
  },
});