import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { ShieldCheck } from 'lucide-react';
import { useLocation } from 'wouter';

export default function LoginPage() {
  const { login, loading, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user && !loading) {
      setLocation('/dashboard');
    }
  }, [user, loading, setLocation]);

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
    <div className="flex min-h-screen flex-col justify-center bg-slate-950 py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-600/10 text-red-500 mb-4 ring-1 ring-red-500/20">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Floaters CONNECT
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Admin Operations & Match Console
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 border border-slate-800 px-4 py-8 shadow-2xl rounded-2xl sm:px-10">
          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="input-email"
                className="mt-1 block w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="input-password"
                className="mt-1 block w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 sm:text-sm"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                data-testid="button-login"
                className="flex w-full justify-center rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50 transition cursor-pointer"
              >
                {loading ? 'Authenticating...' : 'Access Console'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
