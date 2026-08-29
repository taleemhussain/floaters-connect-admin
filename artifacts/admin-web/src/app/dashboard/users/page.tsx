'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { UserCheck, ShieldAlert, Ban, Search, Filter, RefreshCw, Eye, Loader2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

type UserProfile = {
  uid: string;
  email: string;
  displayName: string;
  role: 'driver' | 'runner' | 'admin' | 'unset';
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

  // Profile Sheet state
  const [selectedUserUid, setSelectedUserUid] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // If sheet is open and banned user matches, update the profile sheet too
        if (isProfileOpen && selectedUserUid === uid) {
          viewProfile(uid);
        }
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
        if (isProfileOpen && selectedUserUid === uid) {
          viewProfile(uid);
        }
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to verify user.');
      }
    } catch (err) {
      console.error(err);
      alert('Error verifying user.');
    }
  };

  const viewProfile = async (uid: string) => {
    setSelectedUserUid(uid);
    setIsProfileOpen(true);
    setLoadingProfile(true);
    setSelectedProfile(null);
    try {
      const res = await fetch(`/api/v1/admin/users/${uid}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedProfile(data);
      } else {
        console.error('Failed to retrieve profile data');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProfile(false);
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
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
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
            className="bg-background border border-border rounded-lg text-xs text-foreground py-2 px-3 focus:outline-none focus:border-border transition-colors cursor-pointer"
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
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide uppercase border ${
                        user.role === 'driver'
                          ? 'bg-blue-100 dark:bg-blue-950/30 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
                          : user.role === 'runner'
                          ? 'bg-indigo-100 dark:bg-indigo-950/30 text-indigo-800 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20'
                          : user.role === 'admin'
                          ? 'bg-amber-100 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                          : 'bg-slate-100 dark:bg-muted/50 text-slate-800 dark:text-muted-foreground border-slate-200 dark:border-border'
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
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-500/20">
                            Banned
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border bg-emerald-100 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20">
                            Active
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => viewProfile(user.uid)}
                        className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-all shadow-sm cursor-pointer"
                        title="View Firestore Profile"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
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

      {/* Profile Detail Slide-out Sheet */}
      <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <SheetContent className="sm:max-w-md overflow-y-auto bg-card border-l border-border text-foreground">
          <SheetHeader className="space-y-1.5 pb-4 border-b border-border/60">
            <SheetTitle className="text-base font-bold text-foreground">Operator Profile</SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              Live Firestore metadata records for this account
            </SheetDescription>
          </SheetHeader>

          {loadingProfile ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground font-medium">Fetching details from Firestore...</span>
            </div>
          ) : !selectedProfile || !selectedProfile.user ? (
            <div className="py-8 text-center text-xs text-muted-foreground font-medium">
              Failed to load profile record.
            </div>
          ) : (
            <div className="space-y-6 py-5">
              {/* Profile Card Header */}
              <div className="flex items-center space-x-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                  {selectedProfile.user.displayName ? selectedProfile.user.displayName.slice(0, 2).toUpperCase() : 'FC'}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">{selectedProfile.user.displayName || 'Unnamed User'}</h4>
                  <p className="text-[10px] text-muted-foreground font-mono truncate max-w-[260px]">{selectedProfile.user.email}</p>
                </div>
              </div>

              {/* Status Section */}
              <div className="bg-background rounded-xl p-4 border border-border/80 space-y-2.5">
                <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Account Credentials</h5>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground text-[10px]">Onboarding Status</span>
                    <p className="font-semibold text-foreground font-mono text-[11px] mt-0.5 capitalize">
                      {selectedProfile.user.onboardingStatus}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px]">Account Lock Status</span>
                    <p className="font-semibold mt-0.5">
                      {selectedProfile.user.isBanned ? (
                        <span className="text-red-500 font-semibold font-mono text-[11px]">BANNED / RESTRICTED</span>
                      ) : (
                        <span className="text-emerald-500 font-semibold font-mono text-[11px]">ACTIVE / UNLOCKED</span>
                      )}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground text-[10px]">Firestore Document ID (UID)</span>
                    <p className="font-mono text-[10px] text-foreground bg-card/60 px-2 py-1 rounded border border-border/30 mt-0.5 break-all select-all">
                      {selectedProfile.user.uid}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Profiles Section */}
              {selectedProfile.user.role === 'driver' && (
                <div className="space-y-4">
                  <div className="bg-background rounded-xl p-4 border border-border/80 space-y-3">
                    <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Driver Profile Info</h5>
                    {selectedProfile.profile ? (
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-muted-foreground text-[10px]">Phone Number</span>
                          <p className="font-semibold text-foreground font-mono mt-0.5">
                            {selectedProfile.profile.phoneNumber || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-[10px]">License Plate</span>
                          <p className="font-semibold text-foreground font-mono mt-0.5">
                            {selectedProfile.profile.licensePlate || 'N/A'}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-muted-foreground text-[10px]">Vehicle Description</span>
                          <p className="font-medium text-foreground mt-0.5 capitalize">
                            {[
                              selectedProfile.profile.vehicleYear,
                              selectedProfile.profile.vehicleColor,
                              selectedProfile.profile.vehicleMakeModel
                            ].filter(Boolean).join(' ') || 'N/A'}
                          </p>
                        </div>
                        {selectedProfile.profile.sectors && (
                          <div className="col-span-2">
                            <span className="text-muted-foreground text-[10px]">Registered Sectors</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedProfile.profile.sectors.map((s: string) => (
                                <span key={s} className="px-1.5 py-0.5 bg-card border border-border text-[9px] font-mono rounded capitalize">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">No matching driver_profiles Firestore document found.</p>
                    )}
                  </div>

                  {/* Documents Checklist */}
                  {selectedProfile.profile?.vehiclePhoto && (
                    <div className="bg-background rounded-xl p-4 border border-border/80 space-y-2">
                      <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Document Checklist</h5>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between bg-card/60 p-2 rounded border border-border/30">
                          <span className="text-muted-foreground">Vehicle Photo Status</span>
                          <span className="font-semibold text-[10px] text-primary capitalize">
                            {selectedProfile.profile.vehiclePhoto.status || 'uploaded'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedProfile.user.role === 'runner' && (
                <div className="space-y-4">
                  <div className="bg-background rounded-xl p-4 border border-border/80 space-y-3">
                    <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Runner Profile Info</h5>
                    {selectedProfile.profile ? (
                      <div className="space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="text-muted-foreground text-[10px]">Phone Number</span>
                            <p className="font-semibold text-foreground font-mono mt-0.5">
                              {selectedProfile.profile.phoneNumber || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-[10px]">Registration Dial Code</span>
                            <p className="font-semibold text-foreground font-mono mt-0.5">
                              {selectedProfile.profile.countryDialCode || 'N/A'}
                            </p>
                          </div>
                        </div>
                        {selectedProfile.profile.skills && (
                          <div>
                            <span className="text-muted-foreground text-[10px]">Skills & Qualifications</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedProfile.profile.skills.map((s: string) => (
                                <span key={s} className="px-1.5 py-0.5 bg-card border border-border text-[9px] font-mono rounded">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">No matching runner_profiles Firestore document found.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Unset Profile info */}
              {selectedProfile.user.role !== 'driver' && selectedProfile.user.role !== 'runner' && (
                <div className="bg-background rounded-xl p-4 border border-border/80 text-center py-6">
                  <p className="text-xs text-muted-foreground italic">This user does not have a Driver or Runner role assigned.</p>
                </div>
              )}

              {/* Agreements Verification */}
              {selectedProfile.profile && (
                <div className="bg-background rounded-xl p-4 border border-border/80 space-y-2.5">
                  <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Agreements Status</h5>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-card/50 p-2 rounded border border-border/20 flex flex-col justify-between">
                      <span className="text-muted-foreground text-[10px]">Terms accepted</span>
                      <p className="font-bold text-foreground text-[10px] mt-1">
                        {selectedProfile.profile.termsAccepted ? '✅ ACCEPTED' : '❌ PENDING'}
                      </p>
                    </div>
                    <div className="bg-card/50 p-2 rounded border border-border/20 flex flex-col justify-between">
                      <span className="text-muted-foreground text-[10px]">Privacy policy</span>
                      <p className="font-bold text-foreground text-[10px] mt-1">
                        {selectedProfile.profile.privacyAccepted ? '✅ ACCEPTED' : '❌ PENDING'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
