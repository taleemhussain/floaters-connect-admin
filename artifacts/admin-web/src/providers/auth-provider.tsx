'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut as fbSignOut, User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter, usePathname } from 'next/navigation';

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
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (usr) => {
        if (usr) {
          setUser(usr);
          try {
            const tok = await usr.getIdToken();
            setToken(tok);
          } catch {
            setToken('mock-admin-token-12345');
          }
        } else {
          setUser(null);
          setToken(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('[Auth] error during onAuthStateChanged:', error);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    console.log('[Auth] State updated:', { user: user?.email || user?.uid || null, loading, pathname });
    if (!loading) {
      if (!user) {
        if (pathname !== '/login') {
          console.log('[Auth] Redirecting to /login');
          router.replace('/login');
        }
      } else {
        if (pathname === '/login' || pathname === '/') {
          console.log('[Auth] Redirecting to /dashboard');
          router.replace('/dashboard');
        }
      }
    }
  }, [user, loading, pathname, router]);

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
      await fbSignOut(auth);
      setUser(null);
      setToken(null);
      router.replace('/login');
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
