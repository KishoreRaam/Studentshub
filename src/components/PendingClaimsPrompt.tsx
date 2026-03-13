// Pending Claims Prompt — neumorphic dark theme to match the dashboard

import { useState } from 'react';
import { toast } from 'sonner';
import { CheckCircle, X, Gift } from 'lucide-react';
import type { PerkRedemption } from '@/services/perkService';

interface PendingClaimsPromptProps {
  claims: PerkRedemption[];
  onClaim: (redemptionId: string) => Promise<void>;
  onSkip: (redemptionId: string) => Promise<void>;
}

export function PendingClaimsPrompt({ claims, onClaim, onSkip }: PendingClaimsPromptProps) {
  const [busyIds, setBusyIds] = useState<Record<string, boolean>>({});
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());

  const visible = claims.filter(c => !resolvedIds.has(c.$id));
  if (visible.length === 0) return null;

  async function handleAction(id: string, action: () => Promise<void>) {
    setBusyIds(prev => ({ ...prev, [id]: true }));
    try {
      await action();
      setResolvedIds(prev => new Set([...prev, id]));
      const remaining = visible.length - resolvedIds.size - 1;
      if (remaining === 0) {
        toast.success('Your savings have been updated!', {
          description: 'Thanks for letting us know.',
        });
      }
    } catch (err) {
      console.error('[PendingClaimsPrompt] action failed:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setBusyIds(prev => ({ ...prev, [id]: false }));
    }
  }

  return (
    <div className="nm-flat rounded-2xl p-5 mb-8 fade-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="nm-inset w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0">
          <Gift className="w-4 h-4 text-[#1A56DB] dark:text-blue-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            Did you use these perks?
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {visible.length} perk{visible.length !== 1 ? 's' : ''} waiting for your confirmation
          </p>
        </div>
      </div>

      {/* Claim cards */}
      <div className="space-y-3">
        {visible.map(claim => {
          const busy = busyIds[claim.$id] ?? false;
          return (
            <div
              key={claim.$id}
              className={`nm-inset rounded-xl px-4 py-3 flex items-center justify-between gap-4 transition-opacity ${
                busy ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              {/* Info */}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {claim.perk_name}
                </p>
                {claim.partner_name && (
                  <p className="text-xs text-gray-400 dark:text-gray-500">{claim.partner_name}</p>
                )}
                {claim.saved_amount > 0 && (
                  <p className="text-xs font-semibold text-[#00A63E] dark:text-green-400 mt-0.5">
                    Save ₹{claim.saved_amount.toLocaleString('en-IN')}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleAction(claim.$id, () => onClaim(claim.$id))}
                  disabled={busy}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#1A56DB] to-[#00A63E] text-white hover:opacity-90 transition-opacity"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Yes, used it
                </button>
                <button
                  onClick={() => handleAction(claim.$id, () => onSkip(claim.$id))}
                  disabled={busy}
                  className="nm-btn w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
