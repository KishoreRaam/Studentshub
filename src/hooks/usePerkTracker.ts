// Custom hook for the perk savings tracker
// Wraps perkService functions and manages loading/state for components.

import { useState, useEffect, useCallback } from 'react';
import {
  trackPerkClick as serviceTrackClick,
  claimPerk as serviceClaimPerk,
  skipPerk as serviceSkipPerk,
  getUserSavingsSummary,
  getPendingClaims,
  getClaimedRedemptions,
  SavingsSummary,
  PerkRedemption,
  TrackPerkClickParams,
} from '@/services/perkService';

interface UsePerkTrackerResult {
  /** Call when the user clicks "Avail Perk". Fire-and-forget safe — never blocks redirect. */
  trackClick: (params: Omit<TrackPerkClickParams, 'userId'>) => void;
  /** Call when the user confirms they used a perk. */
  claimPerk: (redemptionId: string) => Promise<void>;
  /** Call when the user dismisses a pending perk. */
  skipPerk: (redemptionId: string) => Promise<void>;
  /** Aggregated savings figures for the current user. */
  savings: SavingsSummary;
  /** Perks clicked but not yet confirmed or dismissed (< 7 days old). */
  pendingClaims: PerkRedemption[];
  /** Perks the user has confirmed using — for Active Subscriptions. */
  claimedRedemptions: PerkRedemption[];
  loading: boolean;
}

export function usePerkTracker(userId: string | null | undefined): UsePerkTrackerResult {
  const [savings, setSavings] = useState<SavingsSummary>({
    total_saved: 0,
    total_claimed: 0,
    saved_this_month: 0,
  });
  const [pendingClaims, setPendingClaims] = useState<PerkRedemption[]>([]);
  const [claimedRedemptions, setClaimedRedemptions] = useState<PerkRedemption[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial data on mount (or when userId changes)
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      try {
        const [summaryData, pendingData, claimedData] = await Promise.all([
          getUserSavingsSummary(userId!),
          getPendingClaims(userId!),
          getClaimedRedemptions(userId!),
        ]);
        if (!cancelled) {
          setSavings(summaryData);
          setPendingClaims(pendingData);
          setClaimedRedemptions(claimedData);
        }
      } catch (err) {
        console.error('[usePerkTracker] Error fetching initial data:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [userId]);

  /**
   * Fire-and-forget click tracker. Never blocks the redirect.
   * Errors are logged but swallowed so the UX is not disrupted.
   */
  const trackClick = useCallback(
    (params: Omit<TrackPerkClickParams, 'userId'>) => {
      if (!userId) return;

      serviceTrackClick({ ...params, userId }).catch(err => {
        console.error('[usePerkTracker] trackClick failed (non-blocking):', err);
      });
    },
    [userId]
  );

  /** Confirm a perk was used; refreshes savings & removes from pendingClaims. */
  const claimPerk = useCallback(
    async (redemptionId: string) => {
      if (!userId) return;

      await serviceClaimPerk(redemptionId, userId);

      // Refresh summary + claimed list
      const [updated, claimed] = await Promise.all([
        getUserSavingsSummary(userId),
        getClaimedRedemptions(userId),
      ]);
      setSavings(updated);
      setClaimedRedemptions(claimed);

      // Remove from pending list
      setPendingClaims(prev => prev.filter(p => p.$id !== redemptionId));
    },
    [userId]
  );

  /** Dismiss a perk as "skipped"; removes from pendingClaims. */
  const skipPerk = useCallback(
    async (redemptionId: string) => {
      if (!userId) return;

      await serviceSkipPerk(redemptionId, userId);
      setPendingClaims(prev => prev.filter(p => p.$id !== redemptionId));
    },
    [userId]
  );

  return { trackClick, claimPerk, skipPerk, savings, pendingClaims, claimedRedemptions, loading };
}
