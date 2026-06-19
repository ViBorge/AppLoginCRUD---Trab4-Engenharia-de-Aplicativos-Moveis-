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

  async function handleCadastro() {
    if (!nome || !email || !senha || !confirmarSenha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    if (senha.length < 6) {
      Alert.alert(
        "Erro",
        "A senha deve possuir pelo menos 6 caracteres."
      );
      return;
    }

    try {
      setLoading(true);

      // Cria usuário no Authentication
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          senha
        );

      const uid = userCredential.user.uid;

      // Salva informações no Firestore
      await setDoc(doc(db, "usuarios", uid), {
        uid,
        nome,
        email,
        criadoEm: new Date(),
      });

      Alert.alert(
        "Sucesso",
        "Usuário cadastrado com sucesso!"
      );

      router.replace("/(auth)/perfil");
    } catch (error: any) {
      let mensagem = "Erro ao cadastrar usuário.";

      switch (error.code) {
        case "auth/email-already-in-use":
          mensagem = "Este e-mail já está cadastrado.";
          break;

        case "auth/invalid-email":
          mensagem = "E-mail inválido.";
          break;

        case "auth/weak-password":
          mensagem = "Senha muito fraca.";
          break;
      }

      Alert.alert("Cadastro", mensagem);
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
        placeholder="Senha"
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

      <TouchableOpacity
        style={styles.button}
        onPress={handleCadastro}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>
            Cadastrar
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.back()}
      >
        <Text style={styles.link}>
          Já possui uma conta? Entrar
        </Text>
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