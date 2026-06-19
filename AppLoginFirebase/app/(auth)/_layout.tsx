import { Stack } from 'expo-router';
import React from 'react';
import { AuthProvider } from '../src/contexts/AuthContext'; 

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        
        {/* Telas Públicas (Área deslogada) */}
        <Stack.Screen name="index" options={{ title: 'Login' }} />
        <Stack.Screen name="cadastro" options={{ title: 'Criar Conta' }} />
        
        {/* Telas Protegidas (Grupo de rotas da pasta auth) */}
        {/* É estritamente necessário registrar o grupo aqui para que o replace funcione */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        
      </Stack>
    </AuthProvider>
  );
}