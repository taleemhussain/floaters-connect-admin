'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { Scale, CheckCircle2, AlertOctagon, HelpCircle, RefreshCw, FileText } from 'lucide-react';

type Dispute = {
  id: string;
  gigId: string;
  reporterName: string;
  reporterRole: string;
  accusedName: string;
  reason: string;
  status: 'open' | 'resolved';
  resolution?: string;
  createdAt: string;
  evidenceUrl?: string;
};

export default function DisputesPage() {
  const { token } = useAuth();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [resolutionText, setResolutionText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchDisputes = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/disputes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setDisputes(data);
      } else {
        setError('Invalid response from server.');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching disputes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, [token]);

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedDispute || !resolutionText.trim()) return;

    try {
      const res = await fetch(`/api/v1/admin/disputes/${selectedDispute.id}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ resolution: resolutionText })
      });

      if (res.ok) {
        setSelectedDispute(null);
        setResolutionText('');
        fetchDisputes();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to resolve dispute.');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting resolution.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Disputes Hub</h1>
          <p className="text-xs text-muted-foreground">
            Review, arbitrate, and issue payouts/penalties for active matchmaking conflicts.
          </p>
        </div>
        <button
          onClick={fetchDisputes}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
          title="Reload Disputes"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-950/20 border border-red-900/30 p-3.5 text-xs text-red-400">
          {error}
        </div>
      )}

      {/* Main layout split (left list, right resolver) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          {loading ? (
            <div className="bg-card border border-border rounded-xl p-12 text-center text-xs text-muted-foreground font-medium">
              Loading active disputes...
            </div>
          ) : disputes.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-12 text-center text-xs text-muted-foreground font-medium">
              No disputes reported on the platform.
            </div>
          ) : (
            disputes.map((dispute) => (
              <div
                key={dispute.id}
                onClick={() => dispute.status === 'open' && setSelectedDispute(dispute)}
                className={`bg-card border p-5 rounded-xl shadow-sm transition-all duration-200 flex flex-col justify-between ${
                  dispute.status === 'open' ? 'cursor-pointer' : 'cursor-default'
                } ${
                  selectedDispute?.id === dispute.id
                    ? 'border-foreground/40 bg-card/80 shadow-md'
                    : dispute.status === 'resolved'
                    ? 'border-border/60 opacity-70'
                    : 'border-border hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-accent/10'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-muted-foreground/80">
                      Dispute #{dispute.id} · Gig Ref: {dispute.gigId}
                    </span>
                    <h4 className="text-sm font-semibold text-foreground">
                      Reporter: {dispute.reporterName} ({dispute.reporterRole}) vs {dispute.accusedName}
                    </h4>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium tracking-wide uppercase ${
                    dispute.status === 'resolved'
                      ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30'
                      : 'bg-amber-950/40 text-amber-400 border border-amber-900/30 animate-pulse'
                  }`}>
                    {dispute.status}
                  </span>
                </div>

                <p className="text-xs text-foreground/90 my-3 leading-relaxed italic bg-background/50 p-3 rounded-lg border border-border/30 font-medium">
                  &ldquo;{dispute.reason}&rdquo;
                </p>

                {dispute.evidenceUrl && (
                  <div className="mb-2 flex items-center space-x-1.5 text-[11px]">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">Attached Evidence:</span>
                    <a
                      href={dispute.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground underline font-medium transition-colors"
                    >
                      View Image &rarr;
                    </a>
                  </div>
                )}

                {dispute.status === 'resolved' && dispute.resolution && (
                  <div className="rounded-lg bg-background/80 p-3 border border-border text-[11px] text-muted-foreground mt-2">
                    <span className="font-semibold text-foreground/80 block mb-1">Resolution Outcome</span>
                    {dispute.resolution}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Dispute Resolution sidebar */}
        <div className="lg:col-span-1">
          {selectedDispute ? (
            <div className="bg-card border border-border rounded-xl p-5 space-y-5 sticky top-20 shadow-md">
              <div className="flex items-center space-x-2">
                <Scale className="h-4.5 w-4.5 text-foreground" />
                <h3 className="text-sm font-semibold text-foreground">Arbitration Panel</h3>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Resolving conflict for</span>
                <p className="text-xs font-semibold text-foreground">
                  {selectedDispute.reporterName} ({selectedDispute.reporterRole})
                </p>
              </div>

              <form onSubmit={handleResolve} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Arbitration Notes
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={resolutionText}
                    onChange={(e) => setResolutionText(e.target.value)}
                    placeholder="Enter warning notes, penalties, or payouts issued..."
                    className="w-full rounded-lg bg-background border border-border p-3 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-border transition-colors"
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold py-2 transition-all shadow-sm cursor-pointer"
                  >
                    Resolve Dispute
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDispute(null);
                      setResolutionText('');
                    }}
                    className="px-3.5 rounded-lg border border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground text-xs font-semibold py-2 transition-all shadow-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-card border border-border border-dashed rounded-xl p-8 text-center text-muted-foreground sticky top-20">
              <HelpCircle className="mx-auto h-6 w-6 text-muted-foreground/60 mb-2" />
              <h4 className="font-semibold text-foreground/90 text-xs">Select Open Conflict</h4>
              <p className="text-[10px] text-muted-foreground mt-1 max-w-xs mx-auto leading-relaxed">
                Click on any dispute marked as 'open' to launch the arbitration notes editor and resolve the dispute.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
