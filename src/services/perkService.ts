// Perk Savings Tracker — service layer
// All DB operations use the Appwrite Databases SDK (client-side, user session).

import { databases, databaseId, COLLECTIONS, AppwriteID } from '@/lib/appwrite';
import { Query } from 'appwrite';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TrackPerkClickParams {
  userId: string;
  perkId: string;
  perkName: string;
  savedAmount: number;
  partnerName?: string;
}

export interface SavingsSummary {
  total_saved: number;
  total_claimed: number;
  saved_this_month: number;
}

export interface PerkRedemption {
  $id: string;
  user_id: string;
  perk_id: string;
  perk_name: string;
  saved_amount: number;
  status: 'attempted' | 'claimed' | 'skipped';
  attempted_at: string;
  claimed_at?: string;
  partner_name?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns an ISO-8601 datetime string N hours ago */
function hoursAgo(n: number): string {
  return new Date(Date.now() - n * 60 * 60 * 1000).toISOString();
}

/** Returns the first day of the current month as ISO-8601 */
function startOfCurrentMonth(): string {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

// ─── Service Functions ────────────────────────────────────────────────────────

/**
 * Record that a user clicked "Avail Perk".
 * Creates a perk_redemptions document with status "attempted".
 * If an identical attempt exists within the last 24 h, returns that doc
 * instead of creating a duplicate.
 *
 * @returns The Appwrite document ID of the redemption record.
 */
export async function trackPerkClick({
  userId,
  perkId,
  perkName,
  savedAmount,
  partnerName,
}: TrackPerkClickParams): Promise<string> {
  // Duplicate guard: same user + perk attempted in last 24 h
  const existing = await databases.listDocuments(
    databaseId,
    COLLECTIONS.PERK_REDEMPTIONS,
    [
      Query.equal('user_id', userId),
      Query.equal('perk_id', perkId),
      Query.equal('status', 'attempted'),
      Query.greaterThanEqual('attempted_at', hoursAgo(24)),
    ]
  );

  if (existing.documents.length > 0) {
    return existing.documents[0].$id;
  }

  const doc = await databases.createDocument(
    databaseId,
    COLLECTIONS.PERK_REDEMPTIONS,
    AppwriteID.unique(),
    {
      user_id: userId,
      perk_id: perkId,
      perk_name: perkName,
      saved_amount: savedAmount,
      status: 'attempted',
      attempted_at: new Date().toISOString(),
      ...(partnerName ? { partner_name: partnerName } : {}),
    }
  );

  return doc.$id;
}

/**
 * Mark a redemption as "claimed" and update the user's savings summary.
 *
 * @param redemptionId - The perk_redemptions document ID.
 * @param userId       - The authenticated user's ID.
 * @returns The updated redemption document.
 */
export async function claimPerk(redemptionId: string, userId: string) {
  // Fetch current doc to guard against double-claiming
  const current = await databases.getDocument(
    databaseId,
    COLLECTIONS.PERK_REDEMPTIONS,
    redemptionId
  ) as unknown as PerkRedemption;

  if (current.status === 'claimed') {
    return current;
  }

  const claimedAt = new Date().toISOString();

  const updated = await databases.updateDocument(
    databaseId,
    COLLECTIONS.PERK_REDEMPTIONS,
    redemptionId,
    { status: 'claimed', claimed_at: claimedAt }
  );

  // Also mark the corresponding saved_perks document as claimed so it
  // shows up in the dashboard's "Active Subscriptions" section.
  try {
    const savedPerksResult = await databases.listDocuments(
      databaseId,
      COLLECTIONS.SAVED_PERKS,
      [Query.equal('userID', userId), Query.equal('perkID', current.perk_id)]
    );
    if (savedPerksResult.documents.length > 0) {
      await databases.updateDocument(
        databaseId,
        COLLECTIONS.SAVED_PERKS,
        savedPerksResult.documents[0].$id,
        { claimed: true, claimedDate: claimedAt }
      );
    }
  } catch (err) {
    // Non-critical — don't block the claim if saved_perks update fails
    console.warn('[claimPerk] Could not sync saved_perks.claimed:', err);
  }

  await updateSavingsSummary(userId, current.saved_amount);

  return updated;
}

/**
 * Mark a redemption as "skipped". No savings update occurs.
 *
 * @param redemptionId - The perk_redemptions document ID.
 * @param userId       - The authenticated user's ID (used for ownership validation).
 * @returns The updated redemption document.
 */
export async function skipPerk(redemptionId: string, userId: string) {
  // Verify ownership
  const current = await databases.getDocument(
    databaseId,
    COLLECTIONS.PERK_REDEMPTIONS,
    redemptionId
  ) as unknown as PerkRedemption;

  if (current.user_id !== userId) {
    throw new Error('Unauthorized: redemption does not belong to this user.');
  }

  return databases.updateDocument(
    databaseId,
    COLLECTIONS.PERK_REDEMPTIONS,
    redemptionId,
    { status: 'skipped' }
  );
}

/**
 * Upsert the user's savings summary after a successful claim.
 * Recalculates saved_this_month from the database to stay accurate.
 *
 * @param userId      - The user whose summary to update.
 * @param savedAmount - The amount to add to totals.
 */
export async function updateSavingsSummary(userId: string, savedAmount: number): Promise<void> {
  // Calculate saved_this_month from claimed records
  const monthlyDocs = await databases.listDocuments(
    databaseId,
    COLLECTIONS.PERK_REDEMPTIONS,
    [
      Query.equal('user_id', userId),
      Query.equal('status', 'claimed'),
      Query.greaterThanEqual('claimed_at', startOfCurrentMonth()),
    ]
  );

  const savedThisMonth = monthlyDocs.documents.reduce(
    (sum, doc) => sum + ((doc as any).saved_amount ?? 0),
    0
  );

  // Try to fetch existing summary doc
  const summaryDocs = await databases.listDocuments(
    databaseId,
    COLLECTIONS.USER_SAVINGS_SUMMARY,
    [Query.equal('user_id', userId)]
  );

  if (summaryDocs.documents.length > 0) {
    const existing = summaryDocs.documents[0];
    await databases.updateDocument(
      databaseId,
      COLLECTIONS.USER_SAVINGS_SUMMARY,
      existing.$id,
      {
        total_saved: (existing.total_saved ?? 0) + savedAmount,
        total_claimed: (existing.total_claimed ?? 0) + 1,
        saved_this_month: savedThisMonth,
        last_updated: new Date().toISOString(),
      }
    );
  } else {
    try {
      await databases.createDocument(
        databaseId,
        COLLECTIONS.USER_SAVINGS_SUMMARY,
        AppwriteID.unique(),
        {
          user_id: userId,
          total_saved: savedAmount,
          total_claimed: 1,
          saved_this_month: savedThisMonth,
          last_updated: new Date().toISOString(),
        }
      );
    } catch (err: any) {
      // 409 = concurrent creation; fetch & update instead
      if (err.code === 409) {
        const concurrentDoc = await databases.listDocuments(
          databaseId,
          COLLECTIONS.USER_SAVINGS_SUMMARY,
          [Query.equal('user_id', userId)]
        );
        if (concurrentDoc.documents.length > 0) {
          const doc = concurrentDoc.documents[0];
          await databases.updateDocument(
            databaseId,
            COLLECTIONS.USER_SAVINGS_SUMMARY,
            doc.$id,
            {
              total_saved: (doc.total_saved ?? 0) + savedAmount,
              total_claimed: (doc.total_claimed ?? 0) + 1,
              saved_this_month: savedThisMonth,
              last_updated: new Date().toISOString(),
            }
          );
        }
      } else {
        throw err;
      }
    }
  }
}

/**
 * Fetch the savings summary for a user.
 * Returns zeroed object if no summary exists yet.
 */
export async function getUserSavingsSummary(userId: string): Promise<SavingsSummary> {
  const docs = await databases.listDocuments(
    databaseId,
    COLLECTIONS.USER_SAVINGS_SUMMARY,
    [Query.equal('user_id', userId)]
  );

  if (docs.documents.length === 0) {
    return { total_saved: 0, total_claimed: 0, saved_this_month: 0 };
  }

  const doc = docs.documents[0];
  return {
    total_saved: doc.total_saved ?? 0,
    total_claimed: doc.total_claimed ?? 0,
    saved_this_month: doc.saved_this_month ?? 0,
  };
}

/**
 * Return all claimed redemptions for a user, newest first.
 * Used to populate the Active Subscriptions section on the dashboard.
 */
export async function getClaimedRedemptions(userId: string): Promise<PerkRedemption[]> {
  const docs = await databases.listDocuments(
    databaseId,
    COLLECTIONS.PERK_REDEMPTIONS,
    [
      Query.equal('user_id', userId),
      Query.equal('status', 'claimed'),
      Query.orderDesc('claimed_at'),
      Query.limit(10),
    ]
  );
  return docs.documents as unknown as PerkRedemption[];
}

/**
 * Return all "attempted" redemptions for a user that are less than 7 days old.
 * These are perks the user clicked but hasn't confirmed or dismissed yet.
 */
export async function getPendingClaims(userId: string): Promise<PerkRedemption[]> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const docs = await databases.listDocuments(
    databaseId,
    COLLECTIONS.PERK_REDEMPTIONS,
    [
      Query.equal('user_id', userId),
      Query.equal('status', 'attempted'),
      Query.greaterThanEqual('attempted_at', sevenDaysAgo),
    ]
  );

  return docs.documents as unknown as PerkRedemption[];
}
