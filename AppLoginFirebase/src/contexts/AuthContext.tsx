import React, { createContext, useState, ReactNode } from 'react';

interface AuthContextData {
  user: { email: string } | null;
  signIn: (email: string) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null);

  function signIn(email: string) {
    setUser({ email });
  }

  function signOut() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}