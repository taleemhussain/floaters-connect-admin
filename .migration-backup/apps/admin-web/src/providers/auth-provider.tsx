'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut as fbSignOut, User } from 'firebase/auth';
import { auth } from '../lib/firebase.js';
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
        // Keep mock user check
        if (user && user.uid === 'u1') {
          // Stay logged in as mock
          setLoading(false);
          return;
        }
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!loading) {
      if (!user && pathname !== '/login') {
        router.replace('/login');
      } else if (user && pathname === '/login') {
        router.replace('/dashboard');
      }
    }
  }, [user, loading, pathname, router]);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      // Mock account for local testing
      if (email === 'admin@floaters.com' && pass === 'password') {
        const mockUser = {
          uid: 'u1',
          email: 'admin@floaters.com',
          displayName: 'Admin Root',
          getIdToken: async () => 'mock-admin-token-12345',
        } as any;
        setUser(mockUser);
        setToken('mock-admin-token-12345');
        return mockUser;
      }
      const credential = await signInWithEmailAndPassword(auth, email, pass);
      return credential.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      try {
        await fbSignOut(auth);
      } catch {
        // Ignore mock logout failure
      }
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
