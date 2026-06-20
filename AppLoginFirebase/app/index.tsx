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
      let mensagem = "Erro inesperado ao tentar fazer login.";
      
      switch (error.code) {
        case 'auth/user-not-found':
          mensagem = "Login não cadastrado.";
          break;
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
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
          <ActivityIndicator color="#09090B" size="small" />
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

// O StyleSheet fica sempre de fora e no final do arquivo
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#09090B', // Fundo super escuro (Dark Mode puro)
  },
  
  title: {
    fontSize: 38, // Ajustado para não quebrar a linha em telas menores
    fontWeight: '900', // Fonte bem grossa para dar o estilo grafite
    textAlign: 'center',
    marginBottom: 40,
    color: '#FFFFFF', // Letra branca
    letterSpacing: 2,
    textTransform: 'uppercase',
    // --- O HACK DO CONTORNO DE GRAFITE ---
    textShadowColor: '#FF0055', // Cor do contorno (Rosa Choque/Spray)
    textShadowOffset: { width: 3, height: 3 }, // Deslocamento do contorno
    textShadowRadius: 1, // Quase zero para ficar um traço sólido
  },

  errorText: {
    color: '#FF0055', 
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: 'bold',
    fontSize: 15,
  },

  loginButton: {
    backgroundColor: '#FFFFFF', // Botão branco
    padding: 16,
    borderRadius: 4, // Borda levemente quadrada (estilo mais bruto)
    alignItems: 'center',
    marginTop: 15,
    borderWidth: 2,
    borderColor: '#FF0055', // Borda do botão acompanhando o tema
  },

  buttonText: {
    color: '#09090B', // Letra preta no fundo branco do botão
    fontWeight: '900',
    fontSize: 18,
    textTransform: 'uppercase',
  },

  linkButton: {
    marginTop: 25,
    alignItems: 'center',
  },

  linkText: {
    color: '#FFFFFF', // Texto branco
    fontSize: 15,
    fontWeight: 'bold',
    textDecorationLine: 'underline', // Sublinhado para destacar
  }
});