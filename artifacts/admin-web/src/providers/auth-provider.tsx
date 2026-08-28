import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { useLocation } from 'wouter';
import {
  setAuthTokenGetter,
  setUnauthorizedHandler,
} from '@workspace/api-client-react';
import { auth } from '@/lib/firebase';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  token: string | null;
  login: (email: string, pass: string) => Promise<User>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    setAuthTokenGetter(async () => auth.currentUser?.getIdToken() ?? null);
    setUnauthorizedHandler(() => {
      void firebaseSignOut(auth);
      setUser(null);
      setToken(null);
      setLocation('/login');
    });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      try {
        setToken(firebaseUser ? await firebaseUser.getIdToken() : null);
      } catch {
        setToken(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      setAuthTokenGetter(null);
      setUnauthorizedHandler(null);
    };
  }, [setLocation]);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, pass);
      return credential.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setToken(null);
      setLocation('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
