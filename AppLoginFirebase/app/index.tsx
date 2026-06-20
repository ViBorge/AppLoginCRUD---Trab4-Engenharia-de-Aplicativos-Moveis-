import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '../src/services/firebaseConfig';
import { CustomInput } from '../src/components/CustomInput';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [erroMsg, setErroMsg] = useState('');

  async function handleLogin() {
    setErroMsg('');

    // Mensagem de erro: Campos incompletos
    if (!email.trim() || !senha.trim()) {
      setErroMsg("Campos incompletos. Preencha e-mail e senha.");
      return;
    }

    try {
      setLoading(true);
      
      await signInWithEmailAndPassword(auth, email.trim(), senha);
      
      setEmail('');
      setSenha('');
      router.replace('/(auth)/perfil');

    } catch (error: any) {
      // Mensagem de erro: Erro inesperado (Fallback padrão)
      let mensagem = "Erro inesperado ao tentar fazer login.";
      
      switch (error.code) {
        case 'auth/user-not-found':
          // Mensagem de erro: Login não cadastrado
          mensagem = "Login não cadastrado.";
          break;
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          // Mensagem de erro: Senha ou email incorreto
          mensagem = "Senha ou e-mail incorreto.";
          break;
        case 'auth/invalid-email':
          mensagem = "O formato do e-mail digitado é inválido.";
          break;
        case 'auth/network-request-failed':
          mensagem = "Sem conexão com a internet.";
          break;
        case 'auth/too-many-requests':
          mensagem = "Muitas tentativas falhas. Tente mais tarde.";
          break;
      }

      setErroMsg(mensagem);
    } finally {
      setLoading(false);
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

      {erroMsg !== '' && (
        <Text style={styles.errorText}>{erroMsg}</Text>
      )}

      <TouchableOpacity 
        style={styles.loginButton} 
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" size="small" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>

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
  errorText: {
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#2563EB',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
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