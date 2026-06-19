import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '../src/services/firebaseConfig';
import { CustomInput } from '../src/components/CustomInput';
import { CustomButton } from '../src/components/CustomButton';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function handleLogin() {
    if (!email.trim() || !senha.trim()) {
      Alert.alert("Aviso", "Preencha todos os campos.");
      return;
    }

    try {
      // Tenta autenticar o usuário no Firebase
      await signInWithEmailAndPassword(auth, email, senha);
      
      // Se o login for um sucesso, redireciona para a tela de Perfil
      router.replace('/(auth)/perfil');
    } catch (error) {
      Alert.alert("Erro", "E-mail ou senha incorretos.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acesso ao Sistema</Text>

      <CustomInput 
        placeholder="Digite seu e-mail" 
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <CustomInput 
        placeholder="Digite sua senha" 
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <CustomButton title="Entrar" onPress={handleLogin} />

      <TouchableOpacity 
        style={styles.linkButton} 
        onPress={() => router.push('/cadastro')}
      >
        <Text style={styles.linkText}>Não tem uma conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: 'bold',
  }
});