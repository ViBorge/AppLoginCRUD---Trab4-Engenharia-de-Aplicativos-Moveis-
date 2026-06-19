import React, { useEffect, useState } from "react";
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

import { auth, db } from "../../src/services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function EditarPerfilScreen() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function carregarDados() {
    try {
      const user = auth.currentUser;

      if (!user) {
        router.replace("/");
        return;
      }

      const docRef = doc(db, "usuarios", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const dados = docSnap.data();

        setNome(dados.nome || "");
        setEmail(dados.email || "");
      }
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível carregar os dados."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  async function salvarAlteracoes() {
    if (!nome.trim() || !email.trim()) {
      Alert.alert(
        "Erro",
        "Preencha todos os campos."
      );
      return;
    }

    try {
      setSaving(true);

      const user = auth.currentUser;

      if (!user) {
        router.replace("/");
        return;
      }

      await updateDoc(
        doc(db, "usuarios", user.uid),
        {
          nome,
          email,
        }
      );

      Alert.alert(
        "Sucesso",
        "Dados atualizados com sucesso!"
      );

      router.replace("/(auth)/perfil");
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível atualizar os dados."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Editar Perfil
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.saveButton}
        onPress={salvarAlteracoes}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>
            Salvar Alterações
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() =>
          router.replace("/(auth)/perfil")
        }
      >
        <Text style={styles.buttonText}>
          Cancelar
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#FFF",
    justifyContent: "center",
  },

  title: {
    fontSize: 30,
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

  saveButton: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },

  cancelButton: {
    backgroundColor: "#6B7280",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});