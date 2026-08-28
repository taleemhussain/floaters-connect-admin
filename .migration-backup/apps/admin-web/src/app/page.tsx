'use client';

import { useAuth } from '@/providers/auth-provider';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { loading } = useAuth();

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-slate-400">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-red-500 mb-2" />
        <p className="text-sm font-medium">Securing session...</p>
      </div>
    </div>
  );
}
