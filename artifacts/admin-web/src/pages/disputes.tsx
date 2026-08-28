import React, { useState } from 'react';
import { Scale, CheckCircle2, AlertOctagon, HelpCircle } from 'lucide-react';
import { 
  useGetAdminDisputes, 
  useResolveAdminDispute,
  getGetAdminDisputesQueryKey
} from '@workspace/api-client-react';
import type { Dispute } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';

export default function DisputesPage() {
  const queryClient = useQueryClient();
  const { data: disputes, isLoading: loading, error: queryError } = useGetAdminDisputes();
  const resolveDispute = useResolveAdminDispute();

  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [resolutionText, setResolutionText] = useState('');

  const error = queryError ? 'Error fetching disputes.' : null;

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDispute || !resolutionText.trim()) return;

    resolveDispute.mutate({
      id: selectedDispute.id,
      data: { resolution: resolutionText }
    }, {
      onSuccess: () => {
        setSelectedDispute(null);
        setResolutionText('');
        queryClient.invalidateQueries({ queryKey: getGetAdminDisputesQueryKey() });
      },
      onError: (err: any) => alert(err.message || 'Failed to resolve dispute.')
    });
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Disputes Hub</h1>
        <p className="mt-2 text-sm text-slate-400">
          Review, arbitrate, and issue payouts/penalties for active matchmaking conflicts.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Main layout split (left list, right resolver) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500">
              Loading active disputes...
            </div>
          ) : !disputes || disputes.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500">
              No disputes reported on the platform.
            </div>
          ) : (
            disputes.map((dispute) => (
              <div
                key={dispute.id}
                data-testid={`card-dispute-${dispute.id}`}
                onClick={() => dispute.status === 'open' && setSelectedDispute(dispute)}
                className={`bg-slate-900 border p-6 rounded-2xl shadow-md transition flex flex-col justify-between ${
                  dispute.status === 'open' ? 'cursor-pointer' : ''
                } ${
                  selectedDispute?.id === dispute.id
                    ? 'border-red-500'
                    : dispute.status === 'resolved'
                    ? 'border-slate-800/80 opacity-75'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Dispute #{dispute.id.slice(0, 8)} · Gig Reference: {dispute.gigId.slice(0, 8)}
                    </span>
                    <h4 className="text-base font-semibold text-white mt-1">
                      Reporter: {dispute.reporterName} ({dispute.reporterRole}) vs {dispute.accusedName}
                    </h4>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    dispute.status === 'resolved'
                      ? 'bg-green-600/10 text-green-400 ring-1 ring-green-500/20'
                      : 'bg-yellow-600/10 text-yellow-400 ring-1 ring-yellow-500/20 animate-pulse'
                  }`}>
                    {dispute.status}
                  </span>
                </div>

                <p className="text-sm text-slate-300 my-3 leading-relaxed">
                  &ldquo;{dispute.reason}&rdquo;
                </p>

                {dispute.evidenceUrl && (
                  <div className="mb-4">
                    <span className="text-xs text-slate-500 block mb-1">Attached Evidence:</span>
                    <a
                      href={dispute.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-red-400 hover:underline inline-flex items-center"
                    >
                      View Evidence Image &rarr;
                    </a>
                  </div>
                )}

                {dispute.status === 'resolved' && dispute.resolution && (
                  <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 text-xs text-slate-400 mt-2">
                    <span className="font-semibold text-slate-300 block mb-1">Resolution Outcome:</span>
                    {dispute.resolution}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Dispute Resolution sidebar */}
        <div>
          {selectedDispute ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 sticky top-8 shadow-xl">
              <div className="flex items-center space-x-2">
                <Scale className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-semibold text-white">Issue Arbitration</h3>
              </div>

              <div>
                <span className="text-xs text-slate-500 font-medium">Resolving dispute for:</span>
                <p className="text-sm font-semibold text-white mt-0.5">
                  {selectedDispute.reporterName} ({selectedDispute.reporterRole})
                </p>
              </div>

              <form onSubmit={handleResolve} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Arbitrator Resolution Notes
                  </label>
                  <textarea
                    rows={4}
                    required
                    data-testid="textarea-resolution"
                    value={resolutionText}
                    onChange={(e) => setResolutionText(e.target.value)}
                    placeholder="Enter details of chargeback, warnings, penalty, or payout adjustments issued..."
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    type="submit"
                    disabled={resolveDispute.isPending}
                    data-testid="button-resolve"
                    className="flex-1 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-semibold py-2 transition cursor-pointer disabled:opacity-50"
                  >
                    {resolveDispute.isPending ? 'Resolving...' : 'Confirm Resolution'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDispute(null)}
                    disabled={resolveDispute.isPending}
                    data-testid="button-cancel-resolve"
                    className="px-3 rounded-lg border border-slate-700 bg-slate-850 hover:bg-slate-800 text-slate-300 text-sm font-semibold py-2 transition cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 border-dashed rounded-2xl p-8 text-center text-slate-500 sticky top-8">
              <HelpCircle className="mx-auto h-8 w-8 text-slate-600 mb-2" />
              <h4 className="font-semibold text-slate-400 text-sm">Select an Open Dispute</h4>
              <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                Click on any dispute marked as 'open' to launch the arbitration editor and resolve the conflict.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
