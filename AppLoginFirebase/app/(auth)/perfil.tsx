import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";

import { auth, db } from "../../src/services/firebase";

import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { deleteUser, signOut } from "firebase/auth";

interface Usuario {
  uid: string;
  nome: string;
  email: string;
}

export default function PerfilScreen() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  async function carregarUsuario() {
    try {
      const user = auth.currentUser;

      if (!user) {
        router.replace("/");
        return;
      }

      const docRef = doc(db, "usuarios", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUsuario(docSnap.data() as Usuario);
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarUsuario();
  }, []);

  async function handleLogout() {
    try {
      await signOut(auth);
      router.replace("/");
    } catch {
      Alert.alert("Erro", "Não foi possível sair.");
    }
  }

  async function handleExcluirConta() {
    Alert.alert(
      "Excluir Conta",
      "Tem certeza que deseja excluir sua conta?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const user = auth.currentUser;

              if (!user) return;

              await deleteDoc(
                doc(db, "usuarios", user.uid)
              );

              await deleteUser(user);

              Alert.alert(
                "Sucesso",
                "Conta excluída com sucesso."
              );

              router.replace("/");
            } catch (error: any) {
              Alert.alert(
                "Erro",
                "Faça login novamente para excluir a conta."
              );
            }
          },
        },
      ]
    );
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
      <Text style={styles.title}>Meu Perfil</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.value}>
          {usuario?.nome}
        </Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>
          {usuario?.email}
        </Text>

        <Text style={styles.label}>UID</Text>
        <Text style={styles.uid}>
          {usuario?.uid}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => router.push("/(auth)/editar")}
      >
        <Text style={styles.buttonText}>
          Editar Perfil
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleExcluirConta}
      >
        <Text style={styles.buttonText}>
          Excluir Conta
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>
          Sair
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
  },

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 20,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#F5F5F5",
    padding: 20,
    borderRadius: 10,
    marginBottom: 25,
  },

  label: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
  },

  value: {
    fontSize: 18,
    fontWeight: "600",
  },

  uid: {
    fontSize: 12,
    color: "#666",
  },

  editButton: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },

  deleteButton: {
    backgroundColor: "#DC2626",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },

  logoutButton: {
    backgroundColor: "#6B7280",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});