import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useFocusEffect, router } from "expo-router";

import { auth, db } from "../../src/services/firebaseConfig";
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
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
      } else {
        Alert.alert("Aviso", "Dados do usuário não encontrados no banco.");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      carregarUsuario();
    }, [])
  );

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      await signOut(auth);
      router.replace("/");
    } catch {
      Alert.alert("Erro", "Não foi possível sair do aplicativo.");
      setIsLoggingOut(false);
    }
  }

  async function handleExcluirConta() {
    Alert.alert(
      "Excluir Conta",
      "Essa ação é irreversível. Tem certeza que deseja apagar todos os seus dados?",
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
              setIsDeleting(true);
              const user = auth.currentUser;

              if (!user) return;

              await deleteDoc(doc(db, "usuarios", user.uid));
              
              await deleteUser(user);

              Alert.alert("Sucesso", "Sua conta foi excluída para sempre.");
              router.replace("/");
            } catch (error: any) {
              
              if (error.code === 'auth/requires-recent-login') {
                Alert.alert("Aviso de Segurança", "Por segurança, você precisa fazer login novamente para excluir a conta.");
                await signOut(auth);
                router.replace("/");
              } else {
                Alert.alert("Erro", "Não foi possível excluir a conta no momento.");
              }
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.value}>
          {usuario?.nome || "Carregando..."}
        </Text>

        <Text style={styles.label}>E-mail</Text>
        <Text style={styles.value}>
          {usuario?.email || "Carregando..."}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => router.push("/(auth)/editar")}
        disabled={isDeleting || isLoggingOut}
      >
        <Text style={styles.buttonText}>Editar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleExcluirConta}
        disabled={isDeleting || isLoggingOut}
      >
        {isDeleting ? (
          <ActivityIndicator color="#FFF" size="small" />
        ) : (
          <Text style={styles.buttonText}>Excluir Conta</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        disabled={isDeleting || isLoggingOut}
      >
        {isLoggingOut ? (
           <ActivityIndicator color="#FFF" size="small" />
        ) : (
          <Text style={styles.buttonText}>Sair do Aplicativo</Text>
        )}
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
    marginTop: 40,
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  card: {
    backgroundColor: "#F9FAFB",
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  label: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 10,
    fontWeight: "500",
  },
  value: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 5,
  },
  editButton: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  deleteButton: {
    backgroundColor: "#DC2626",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  logoutButton: {
    backgroundColor: "#4B5563",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});