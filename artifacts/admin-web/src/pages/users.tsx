import React, { useState } from 'react';
import { UserCheck, ShieldAlert, Ban, Search, Filter } from 'lucide-react';
import { 
  useGetAdminUsers, 
  useToggleAdminUserBan, 
  useVerifyAdminUser,
  getGetAdminUsersQueryKey
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';

export default function UsersPage() {
  const queryClient = useQueryClient();
  const { data: users, isLoading: loading, error: queryError } = useGetAdminUsers();
  const toggleBan = useToggleAdminUserBan();
  const verifyUser = useVerifyAdminUser();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'driver' | 'runner'>('all');

  const error = queryError ? 'Error fetching user directory.' : null;

  const handleToggleBan = (uid: string) => {
    toggleBan.mutate({ uid }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetAdminUsersQueryKey() });
      },
      onError: (err: any) => alert(err.message || 'Failed to update ban state.')
    });
  };

  const handleVerify = (uid: string) => {
    verifyUser.mutate({ uid }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetAdminUsersQueryKey() });
      },
      onError: (err: any) => alert(err.message || 'Failed to verify user.')
    });
  };

  const filteredUsers = (users || []).filter((u) => {
    const matchesSearch =
      (u.displayName?.toLowerCase().includes(search.toLowerCase()) || false) ||
      (u.email?.toLowerCase().includes(search.toLowerCase()) || false) ||
      u.uid.includes(search);
    const matchesRole = roleFilter === 'all' ? true : u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">User Directory</h1>
          <p className="mt-2 text-sm text-slate-400">
            Review registration documents, roles, and status of all network operators.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
          <input
            type="text"
            data-testid="input-search-users"
            placeholder="Search by name, email, or UID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-slate-500" />
          <select
            value={roleFilter}
            data-testid="select-role-filter"
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-300 py-2 px-3 focus:outline-none focus:border-red-500 cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="driver">Drivers Only</option>
            <option value="runner">Runners Only</option>
          </select>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* User Table Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading operators...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No users match your criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-850/40 text-slate-400 text-xs font-semibold uppercase">
                  <th className="px-6 py-4">Name / Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Onboarding Status</th>
                  <th className="px-6 py-4">KYC / Ban Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                {filteredUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-slate-800/50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{user.displayName || 'Unnamed User'}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'driver'
                          ? 'bg-blue-600/10 text-blue-400 ring-1 ring-blue-500/20'
                          : 'bg-red-600/10 text-red-400 ring-1 ring-red-500/20'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-400 font-mono text-xs">{user.onboardingStatus}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {user.isBanned ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-950 text-red-400 ring-1 ring-red-500/30">
                            Banned
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-950 text-green-400 ring-1 ring-green-500/30">
                            Active
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {user.onboardingStatus !== 'registered' && (
                        <button
                          onClick={() => handleVerify(user.uid)}
                          disabled={verifyUser.isPending}
                          data-testid={`button-verify-${user.uid}`}
                          className="inline-flex items-center justify-center p-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-green-600 hover:text-white text-slate-300 transition cursor-pointer disabled:opacity-50"
                          title="Verify / Approve KYC"
                        >
                          <UserCheck className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleBan(user.uid)}
                        disabled={toggleBan.isPending}
                        data-testid={`button-toggle-ban-${user.uid}`}
                        className={`inline-flex items-center justify-center p-1.5 rounded-lg border cursor-pointer disabled:opacity-50 ${
                          user.isBanned
                            ? 'bg-red-600 border-red-500 text-white hover:bg-red-500'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-red-950 hover:text-red-400'
                        } transition`}
                        title={user.isBanned ? 'Lift Ban' : 'Restrict Account'}
                      >
                        {user.isBanned ? <ShieldAlert className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
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
