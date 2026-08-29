'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { UserCheck, ShieldAlert, Ban, Search, Filter, RefreshCw } from 'lucide-react';

type UserProfile = {
  uid: string;
  email: string;
  displayName: string;
  role: 'driver' | 'runner';
  onboardingStatus: string;
  isBanned: boolean;
  createdAt?: string;
};

export default function UsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'driver' | 'runner'>('all');
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setError('Invalid response from server.');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching user directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleToggleBan = async (uid: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/v1/admin/users/${uid}/toggle-ban`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to update ban state.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating user ban state.');
    }
  };

  const handleVerify = async (uid: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/v1/admin/users/${uid}/verify`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to verify user.');
      }
    } catch (err) {
      console.error(err);
      alert('Error verifying user.');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.displayName?.toLowerCase().includes(search.toLowerCase()) || false) ||
      (u.email?.toLowerCase().includes(search.toLowerCase()) || false) ||
      u.uid.includes(search);
    const matchesRole = roleFilter === 'all' ? true : u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">User Directory</h1>
          <p className="text-xs text-muted-foreground">
            Review registration documents, roles, and status of all network operators.
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
          title="Reload Directory"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 bg-card border border-border p-3.5 rounded-xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email, or UID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border border-border hover:border-border/80 rounded-lg text-xs text-foreground placeholder-muted-foreground focus:border-border focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="bg-background border border-border rounded-lg text-xs text-foreground py-2 px-3 focus:outline-none focus:border-border transition-colors"
          >
            <option value="all">All Roles</option>
            <option value="driver">Drivers Only</option>
            <option value="runner">Runners Only</option>
          </select>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="rounded-lg bg-red-950/20 border border-red-900/30 p-3.5 text-xs text-red-400">
          {error}
        </div>
      )}

      {/* User Table Card */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-xs text-muted-foreground font-medium">Loading operators...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted-foreground font-medium">No users match your criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-muted-foreground text-[10px] font-semibold uppercase tracking-wider select-none">
                  <th className="px-5 py-3">Name / Email</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Onboarding Status</th>
                  <th className="px-5 py-3">KYC / Ban Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs text-foreground/90">
                {filteredUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-foreground">{user.displayName || 'Unnamed User'}</div>
                      <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{user.email}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium tracking-wide uppercase ${
                        user.role === 'driver'
                          ? 'bg-blue-950/30 text-blue-400 border border-blue-900/20'
                          : 'bg-muted text-muted-foreground border border-border'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-muted-foreground font-mono text-[11px]">{user.onboardingStatus}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div>
                        {user.isBanned ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-red-950/40 text-red-400 border border-red-900/30">
                            Banned
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-950/40 text-emerald-400 border border-emerald-900/30">
                            Active
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1.5">
                      {user.onboardingStatus !== 'registered' && (
                        <button
                          onClick={() => handleVerify(user.uid)}
                          className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-border hover:border-border-hover bg-card hover:bg-emerald-950/30 hover:text-emerald-400 text-muted-foreground transition-all shadow-sm cursor-pointer"
                          title="Verify / Approve KYC"
                        >
                          <UserCheck className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleBan(user.uid)}
                        className={`inline-flex items-center justify-center h-7 w-7 rounded-lg border transition-all shadow-sm cursor-pointer ${
                          user.isBanned
                            ? 'bg-red-950/40 border-red-900/30 text-red-400 hover:bg-red-900 hover:text-white'
                            : 'bg-card border-border text-muted-foreground hover:border-red-900/50 hover:text-red-500'
                        }`}
                        title={user.isBanned ? 'Lift Ban' : 'Restrict Account'}
                      >
                        {user.isBanned ? <ShieldAlert className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
