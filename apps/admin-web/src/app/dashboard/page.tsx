'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import {
  Users,
  Briefcase,
  AlertOctagon,
  Percent,
  CheckCircle,
  Clock,
  ExternalLink,
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
    { title: 'Total Registered Users', value: loading ? '...' : usersCount.total, desc: `${usersCount.drivers} Drivers · ${usersCount.runners} Runners`, icon: Users, color: 'text-blue-500' },
    { title: 'Active Marketplace Gigs', value: '18', desc: '14 matching · 4 executing', icon: Briefcase, color: 'text-green-500' },
    { title: 'Escalated Disputes', value: loading ? '...' : disputesCount.total, desc: `${disputesCount.open} open · ${disputesCount.resolved} resolved`, icon: AlertOctagon, color: 'text-red-500' },
    { title: 'Smart Match Success Rate', value: '98.4%', desc: 'Avg meet time 4.5 mins', icon: Percent, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">System Overview</h1>
        <p className="mt-2 text-sm text-slate-400">
          Real-time metrics and operational pulse of Floaters CONNECT.
        </p>
      </div>

      {/* Grid Cards stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">{card.title}</span>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div className="mt-2">
                <span className="text-3xl font-bold text-white">{card.value}</span>
                <p className="mt-1 text-xs text-slate-500">{card.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Audit logs & quick actions split */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Activity feed list */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Platform Activity Logs</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 text-sm">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-slate-300">Smart Match Secured: Driver **Marcus V.** matches Runner **Elena R.**</p>
                <span className="text-[10px] text-slate-500">2 minutes ago</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-sm">
              <Clock className="h-5 w-5 text-yellow-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-slate-300">OTP Code Generated for Meet point physical confirmation (Secure PIN #5289)</p>
                <span className="text-[10px] text-slate-500">10 minutes ago</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-sm">
              <AlertOctagon className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-slate-300">Dispute Escalated: **Sarah C.** submitted photo evidence for Gig #108</p>
                <span className="text-[10px] text-slate-500">24 minutes ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shortcuts list */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Shortcuts</h3>
            <div className="space-y-2">
              <a
                href="/dashboard/users"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-sm font-medium transition"
              >
                <span>Verify ID/Documents</span>
                <ExternalLink className="h-4 w-4 text-slate-400" />
              </a>

              <a
                href="/dashboard/disputes"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-sm font-medium transition"
              >
                <span>Resolve Open Cases</span>
                <ExternalLink className="h-4 w-4 text-slate-400" />
              </a>

              <a
                href="/dashboard/tags"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-sm font-medium transition"
              >
                <span>Manage Skill Tags</span>
                <ExternalLink className="h-4 w-4 text-slate-400" />
              </a>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-[10px] text-slate-500">
            FC Admin Console v1.0.0 (Local Sandbox Mode)
          </div>
        </div>
      </div>
    </div>
  );
}
