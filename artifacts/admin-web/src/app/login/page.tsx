'use client';

import React, { useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { ShieldCheck } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 sm:px-6 lg:px-8 selection:bg-zinc-800 selection:text-zinc-100">
      <div className="w-full max-w-[400px] space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 shadow-sm shadow-zinc-900/50">
            <ShieldCheck className="h-6 w-6 stroke-[2]" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-50">
              Floaters CONNECT
            </h2>
            <p className="text-xs text-zinc-400">
              Platform Admin Operations & Match Console
            </p>
          </div>
        </div>

        {/* Shadcn Card structure */}
        <Card className="border-zinc-800 bg-zinc-900/80 backdrop-blur-sm shadow-xl rounded-xl">
          <CardHeader className="space-y-1.5 pb-4">
            <CardTitle className="text-lg font-semibold text-zinc-50">Login credentials</CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Enter your email and password to access the console
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-950/20 border border-red-900/30 p-3 text-xs text-red-400 leading-normal">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-zinc-300">
                  Email address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="admin@floaters.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-zinc-950 border-zinc-800 text-zinc-100 placeholder-zinc-600 focus-visible:ring-zinc-700 text-xs py-1.5"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-zinc-300">
                    Password
                  </Label>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-zinc-950 border-zinc-800 text-zinc-100 placeholder-zinc-600 focus-visible:ring-zinc-700 text-xs py-1.5"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-semibold py-1.5 rounded-lg shadow-sm transition-all mt-2"
              >
                {loading ? 'Authenticating...' : 'Access Console'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
