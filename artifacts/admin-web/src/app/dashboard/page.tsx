'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import {
  Users,
  Briefcase,
  AlertCircle,
  ExternalLink,
  TrendingUp,
  UserPlus,
  UserCheck,
} from 'lucide-react';

type UserProfile = {
  uid: string;
  email: string;
  displayName: string;
  role: 'driver' | 'runner' | 'unset';
  onboardingStatus: string;
  isBanned: boolean;
  createdAt?: string;
};

export default function DashboardOverview() {
  const { token } = useAuth();
  const [usersCount, setUsersCount] = useState({ total: 0, drivers: 0, runners: 0, pending: 0 });
  const [recentUsers, setRecentUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch users
        const usersRes = await fetch('/api/v1/admin/users', { headers });
        const users = await usersRes.json();

        if (Array.isArray(users)) {
          const drivers = users.filter(u => u.role === 'driver').length;
          const runners = users.filter(u => u.role === 'runner').length;
          const pending = users.filter(u => u.onboardingStatus !== 'registered' && u.onboardingStatus !== 'verified').length;
          setUsersCount({ total: users.length, drivers, runners, pending });

          // Sort by creation date or mock order
          const sorted = [...users].sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          });
          setRecentUsers(sorted.slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const cards = [
    { title: 'Total Registered', value: loading ? '...' : usersCount.total, desc: 'Registered user documents', icon: Users, color: 'text-foreground' },
    { title: 'Active Drivers', value: loading ? '...' : usersCount.drivers, desc: 'With driver_profiles in Firestore', icon: Briefcase, color: 'text-foreground' },
    { title: 'Active Runners', value: loading ? '...' : usersCount.runners, desc: 'With runner_profiles in Firestore', icon: UserCheck, color: 'text-foreground' },
    { title: 'Pending Onboarding', value: loading ? '...' : usersCount.pending, desc: 'Requires document verification', icon: AlertCircle, color: usersCount.pending > 0 ? 'text-red-500' : 'text-foreground' },
  ];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="space-y-0.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Overview</h1>
        <p className="text-xs text-muted-foreground">
          Real-time metrics and operational pulse of Floaters CONNECT.
        </p>
      </div>

      {/* Grid Cards stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-2 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center justify-between space-y-0">
                <span className="text-xs font-medium text-muted-foreground tracking-wide">{card.title}</span>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
              <div className="space-y-1">
                <span className="text-2xl font-bold tracking-tight text-foreground">{card.value}</span>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3 text-muted-foreground" />
                  <p className="text-[10px] text-muted-foreground font-medium">{card.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Audit logs & quick actions split */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Activity feed list */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Recent Registrations</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Latest user accounts added to Firestore</p>
          </div>
          <div className="space-y-3.5 pt-2">
            {loading ? (
              <p className="text-xs text-muted-foreground">Loading recent users...</p>
            ) : recentUsers.length === 0 ? (
              <p className="text-xs text-muted-foreground">No users found in database.</p>
            ) : (
              recentUsers.map((u) => (
                <div key={u.uid} className="flex items-start space-x-3 text-xs leading-relaxed">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-muted-foreground mt-0.5 shrink-0">
                    <UserPlus className="h-3 w-3 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground/90">
                      New <span className="font-semibold text-foreground capitalize">{u.role || 'unset'}</span> signed up:{' '}
                      <span className="font-semibold text-foreground">{u.displayName || u.email || 'Anonymous'}</span>
                    </p>
                    {u.createdAt && (
                      <span className="text-[9px] text-muted-foreground font-medium">
                        {new Date(u.createdAt).toLocaleDateString()} at {new Date(u.createdAt).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Shortcuts list */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">Common operations shortcuts</p>
            </div>
            <div className="space-y-1.5">
              <a
                href="/dashboard/users"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-background hover:bg-accent border border-border text-xs font-medium text-foreground/90 hover:text-foreground transition-all group"
              >
                <span>Verify User Documents & Profiles</span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </a>
            </div>
          </div>

          <div className="text-center text-[9px] text-muted-foreground font-mono pt-4 border-t border-border/40 select-none">
            v1.0.0 · firebase_live: 100%
          </div>
        </div>
      </div>
    </div>
  );
}
