import React, { createContext, useState, ReactNode } from 'react';

// Define o formato das informações que estarão disponíveis para o app
interface AuthContextData {
  user: { email: string } | null;
  signIn: (email: string) => void;
  signOut: () => void;
}

// Cria o contexto (inicialmente vazio)
export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// O "Provedor" que vai abraçar o aplicativo e distribuir a informação
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null);

  // Função falsa de login apenas para testar a troca de telas
  function signIn(email: string) {
    setUser({ email });
  }

  // Função de logout
  function signOut() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}