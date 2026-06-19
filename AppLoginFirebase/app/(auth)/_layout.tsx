import { Stack } from 'expo-router';
import React from 'react';
import { AuthProvider } from '../src/contexts/AuthContext'; 

export default function RootLayout() {
  return (
    // O AuthProvider envolve o app para sabermos se o usuário está logado
    <AuthProvider>
      {/* O Stack gerencia a transição de telas sem mostrar uma barra inferior */}
      <Stack screenOptions={{ headerShown: false }}>
        
        {/* Telas Públicas */}
        <Stack.Screen name="index" options={{ title: 'Login' }} />
        <Stack.Screen name="cadastro" options={{ title: 'Criar Conta' }} />
        
        {/* Você pode adicionar a tela de perfil aqui depois */}
        {/* <Stack.Screen name="perfil" /> */}
        
      </Stack>
    </AuthProvider>
  );
}