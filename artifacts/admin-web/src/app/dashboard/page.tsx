'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import {
  Users,
  Briefcase,
  AlertOctagon,
  Percent,
  CheckCircle2,
  Clock,
  ExternalLink,
  TrendingUp,
} from 'lucide-react';

export default function DashboardOverview() {
  const { token } = useAuth();
  const [usersCount, setUsersCount] = useState({ total: 0, drivers: 0, runners: 0 });
  const [disputesCount, setDisputesCount] = useState({ total: 0, open: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch users
        const usersRes = await fetch('/api/v1/admin/users', { headers });
        const users = await usersRes.json();

        // Fetch disputes
        const disputesRes = await fetch('/api/v1/admin/disputes', { headers });
        const disputes = await disputesRes.json();

        if (Array.isArray(users)) {
          const drivers = users.filter(u => u.role === 'driver').length;
          const runners = users.filter(u => u.role === 'runner').length;
          setUsersCount({ total: users.length, drivers, runners });
        }

        if (Array.isArray(disputes)) {
          const open = disputes.filter(d => d.status === 'open').length;
          const resolved = disputes.filter(d => d.status === 'resolved').length;
          setDisputesCount({ total: disputes.length, open, resolved });
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
    { title: 'Total Users', value: loading ? '...' : usersCount.total, desc: `${usersCount.drivers} Drivers · ${usersCount.runners} Runners`, icon: Users, color: 'text-foreground' },
    { title: 'Active Gigs', value: '18', desc: '14 matching · 4 executing', icon: Briefcase, color: 'text-foreground' },
    { title: 'Escalated Disputes', value: loading ? '...' : disputesCount.total, desc: `${disputesCount.open} open · ${disputesCount.resolved} resolved`, icon: AlertOctagon, color: disputesCount.open > 0 ? 'text-red-500' : 'text-foreground' },
    { title: 'Match Success Rate', value: '98.4%', desc: 'Avg meet time 4.5m', icon: Percent, color: 'text-foreground' },
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
            <h3 className="text-sm font-semibold text-foreground">Platform Activity Logs</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Audit log of system events</p>
          </div>
          <div className="space-y-3.5 pt-2">
            <div className="flex items-start space-x-3 text-xs leading-relaxed">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-muted-foreground mt-0.5 shrink-0">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              </div>
              <div className="flex-1">
                <p className="text-foreground/90">Smart Match Secured: Driver <span className="font-semibold text-foreground">Marcus V.</span> matched with Runner <span className="font-semibold text-foreground">Elena R.</span></p>
                <span className="text-[9px] text-muted-foreground font-medium">2 minutes ago</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-xs leading-relaxed">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-muted-foreground mt-0.5 shrink-0">
                <Clock className="h-3 w-3 text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="text-foreground/90">OTP PIN Confirmation generated for Meetpoint (PIN #5289)</p>
                <span className="text-[9px] text-muted-foreground font-medium">10 minutes ago</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-xs leading-relaxed">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-muted-foreground mt-0.5 shrink-0">
                <AlertOctagon className="h-3 w-3 text-red-500" />
              </div>
              <div className="flex-1">
                <p className="text-foreground/90">Dispute Escalated: <span className="font-semibold text-foreground">Sarah C.</span> submitted photo evidence for Gig #108</p>
                <span className="text-[9px] text-muted-foreground font-medium">24 minutes ago</span>
              </div>
            </div>
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
                <span>Verify ID/Documents</span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </a>

              <a
                href="/dashboard/disputes"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-background hover:bg-accent border border-border text-xs font-medium text-foreground/90 hover:text-foreground transition-all group"
              >
                <span>Resolve Open Cases</span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </a>

              <a
                href="/dashboard/tags"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-background hover:bg-accent border border-border text-xs font-medium text-foreground/90 hover:text-foreground transition-all group"
              >
                <span>Manage Skill Tags</span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </a>
            </div>
          </div>

          <div className="text-center text-[9px] text-muted-foreground font-mono pt-4 border-t border-border/40 select-none">
            v1.0.0 · system_live: 100%
          </div>
        </div>
      </div>
    </div>
  );
}
