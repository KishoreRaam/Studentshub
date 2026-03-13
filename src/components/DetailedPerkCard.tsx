import { useState, useRef } from "react";
import { Gift, Check, Clock, ArrowLeft, Bookmark, Users, Shield, Star, ExternalLink, Loader2, CheckCircle, X, Sparkles } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import { toast } from "sonner";
import type { Perk } from "@/pages/benfits/Perks";
import { useSavedItems } from "@/hooks/useSavedItems";
import { useAuth } from "@/contexts/AuthContext";
import { trackPerkClick, claimPerk as serviceClaimPerk } from "@/services/perkService";

interface DetailedPerkCardProps {
  perk: Perk | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveChange?: () => void; // Optional callback when save state changes
}

const categoryColors: Record<string, string> = {
  Developer:
    "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  Design:
    "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
  Productivity:
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  Entertainment:
    "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
  Education:
    "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
};

const renderBenefits = (perk: Perk) => {
  if (!perk.benefits || perk.benefits.length === 0) {
    return null;
  }

  return (
    <div className="px-6 py-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">What's included</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {perk.benefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-3"
          >
            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-card-foreground leading-relaxed">{benefit}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const renderRequirements = (perk: Perk) => {
  if (!perk.requirements || perk.requirements.length === 0) {
    return null;
  }

  return (
    <div className="px-6 py-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Requirements</h3>
      <div className="space-y-2">
        {perk.requirements.map((requirement, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
            <span className="text-card-foreground leading-relaxed">{requirement}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const renderVerification = (perk: Perk) => {
  const steps = perk.verificationSteps && perk.verificationSteps.length > 0
    ? perk.verificationSteps
    : perk.verification
      ? [perk.verification]
      : undefined;

  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <div className="px-6 py-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">How to get started</h3>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
              {index + 1}
            </div>
            <span className="text-card-foreground leading-relaxed pt-1">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const renderStatsRow = (perk: Perk) => {
  return (
    <div className="px-6 py-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center border border-blue-100 dark:border-blue-800">
          <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-sm text-blue-600 dark:text-blue-400">Valid Until</div>
          <div className="text-blue-900 dark:text-blue-300 font-medium">{perk.validity || 'End of studies'}</div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center border border-green-100 dark:border-green-800">
          <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <div className="text-sm text-green-600 dark:text-green-400">Used by</div>
          <div className="text-green-900 dark:text-green-300 font-medium">15M+ Students</div>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center border border-purple-100 dark:border-purple-800">
          <Shield className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <div className="text-sm text-purple-600 dark:text-purple-400">Verification</div>
          <div className="text-purple-900 dark:text-purple-300 font-medium">Instant</div>
        </div>
      </div>
    </div>
  );
};

// ─── Floating claim notification (rendered inside a Sonner toast.custom) ────

interface PerkClaimNotificationProps {
  toastId: string | number;
  perkName: string;
  partnerName: string;
  savedAmount: number;
  discount?: string;
  onClaim: () => Promise<void>;
  onDismiss: () => void;
}

function PerkClaimNotification({
  perkName,
  partnerName,
  savedAmount,
  discount,
  onClaim,
  onDismiss,
}: PerkClaimNotificationProps) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const handleClaim = async () => {
    setBusy(true);
    await onClaim();
    setDone(true);
    setBusy(false);
  };

  return (
    <div
      className="w-[340px] rounded-2xl overflow-hidden shadow-2xl"
      style={{
        background: '#1e2030',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
      }}
    >
      {/* Top gradient bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#1A56DB] to-[#00A63E]" />

      <div className="p-4">
        {done ? (
          /* ── Success state ── */
          <div className="flex items-center gap-3 py-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1A56DB]/20 to-[#00A63E]/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-[#00A63E]" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Savings recorded! 🎉</p>
              <p className="text-xs text-gray-400 mt-0.5">{perkName} marked as used</p>
            </div>
          </div>
        ) : (
          <>
            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1A56DB]/20 to-[#00A63E]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-[#1A56DB]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-snug">
                    Opened {partnerName}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Did you end up using this perk?
                  </p>
                </div>
              </div>
              <button
                onClick={onDismiss}
                className="text-gray-600 hover:text-gray-300 transition-colors flex-shrink-0 mt-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── Savings badge ── */}
            {(savedAmount > 0 || discount) && (
              <div
                className="rounded-xl px-3 py-2 mb-3 flex items-center gap-2"
                style={{ background: 'rgba(26, 86, 219, 0.12)', border: '1px solid rgba(26, 86, 219, 0.2)' }}
              >
                <Gift className="w-3.5 h-3.5 text-[#1A56DB] flex-shrink-0" />
                <span className="text-xs font-semibold text-[#1A56DB]">
                  {savedAmount > 0
                    ? `Save ₹${savedAmount.toLocaleString('en-IN')} with ${perkName}`
                    : discount
                    ? `${discount} with ${perkName}`
                    : perkName}
                </span>
              </div>
            )}

            {/* ── Action buttons ── */}
            <div className="flex gap-2">
              <button
                onClick={handleClaim}
                disabled={busy}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold text-white transition-opacity disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #1A56DB, #00A63E)' }}
              >
                {busy ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle className="w-3.5 h-3.5" />
                )}
                Yes, I used it!
              </button>
              <button
                onClick={onDismiss}
                disabled={busy}
                className="flex-1 rounded-xl py-2.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                Not this time
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Extract a numeric amount from strings like "50% off", "Free (₹5000 value)", "Save ₹500" */
function parseDiscountAmount(discount?: string): number {
  if (!discount) return 0;
  const match = discount.match(/[₹$][\s]*(\d[\d,]*)/);
  if (match) return parseFloat(match[1].replace(/,/g, ''));
  const plain = discount.match(/\b(\d{3,})\b/);
  if (plain) return parseFloat(plain[1]);
  return 0;
}

export function DetailedPerkCard({ perk, isOpen, onClose, onSaveChange }: DetailedPerkCardProps) {
  const { user } = useAuth();
  const { isSaved, toggleSave, isSaving } = useSavedItems('perk');

  const redemptionIdRef = useRef<string | null>(null);

  if (!perk) {
    return null;
  }

  /** Called when "Apply Now" is clicked — opens link + shows floating confirm popup */
  const handleApplyNow = () => {
    if (!perk.claimLink?.trim()) return;

    // Open partner site immediately
    window.open(perk.claimLink, '_blank', 'noopener,noreferrer');

    if (!user) return;

    // Fire-and-forget: record the click attempt
    const trackPromise = trackPerkClick({
      userId: user.$id,
      perkId: perk.id,
      perkName: perk.title,
      savedAmount: parseDiscountAmount(perk.discount),
      partnerName: perk.website || perk.title,
    });
    trackPromise
      .then(id => { redemptionIdRef.current = id; })
      .catch(err => console.error('[DetailedPerkCard] trackPerkClick failed:', err));

    // Show floating claim notification
    const toastId = `perk-claim-${perk.id}-${Date.now()}`;
    toast.custom(
      (id) => (
        <PerkClaimNotification
          toastId={id}
          perkName={perk.title}
          partnerName={perk.website || perk.title}
          savedAmount={parseDiscountAmount(perk.discount)}
          discount={perk.discount}
          onClaim={async () => {
            toast.dismiss(id);
            try {
              // Wait for redemptionId if not yet available
              const redemptionId = redemptionIdRef.current
                ?? await trackPromise.catch(() => null);
              if (redemptionId && user) {
                await serviceClaimPerk(redemptionId, user.$id);
                toast.success('Savings recorded!', {
                  description: `${perk.title} marked as used.`,
                });
              }
            } catch (err) {
              console.error('[DetailedPerkCard] claim failed:', err);
              toast.error('Could not record claim. Try again later.');
            }
          }}
          onDismiss={() => toast.dismiss(id)}
        />
      ),
      { id: toastId, duration: 30000 }
    );
  };

  const categoryClass =
    categoryColors[perk.category as keyof typeof categoryColors] ??
    "bg-muted text-muted-foreground";

  // Handle save button click - pass full perk data
  const handleSaveClick = async () => {
    if (perk) {
      await toggleSave({
        id: perk.id,
        title: perk.title,
        category: perk.category,
        description: perk.description,
        website: perk.website,
        logo: perk.logo,
        color: perk.color,
        discount: perk.discount,
        validUntil: perk.validity, // Map validity to validUntil for Appwrite
        claimLink: perk.claimLink,
      });

      // Notify parent component that save state changed
      if (onSaveChange) {
        onSaveChange();
      }
    }
  };

  // Get category-based color for button
  const getCategoryButtonColor = () => {
    const categoryColorMap: Record<string, string> = {
      'Productivity': 'bg-green-600 hover:bg-green-700 active:bg-green-800',
      'Entertainment': 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800',
      'Cloud': 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800',
      'Developer': 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800',
      'Design': 'bg-pink-600 hover:bg-pink-700 active:bg-pink-800',
      'Education': 'bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800',
      'Learning': 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800',
      'Food/Dining': 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800',
      'Hardware': 'bg-slate-600 hover:bg-slate-700 active:bg-slate-800',
      'Security': 'bg-red-600 hover:bg-red-700 active:bg-red-800',
      'Travel': 'bg-teal-600 hover:bg-teal-700 active:bg-teal-800',
      'Wellbeing': 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800',
    };
    return categoryColorMap[perk.category] || 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800';
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          redemptionIdRef.current = null;
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-4xl w-full mx-4 p-0 gap-0 bg-transparent rounded-2xl shadow-2xl border-0 max-h-[85vh] flex flex-col">
        <DialogTitle className="sr-only">{perk.title} Details</DialogTitle>
        <DialogDescription className="sr-only">
          Detailed information about {perk.title} including benefits, verification steps, and validity.
        </DialogDescription>

        {/* Background Image Overlay */}
        <div className="absolute inset-0 opacity-30 overflow-hidden pointer-events-none rounded-2xl">
          <ImageWithFallback
            src={perk.image}
            alt={`${perk.title} background`}
            className="w-full h-full object-cover scale-110 blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-green-500/20" />
        </div>

        {/* Content container with backdrop blur */}
        <div className="relative bg-card/95 backdrop-blur-sm flex flex-col rounded-2xl overflow-hidden max-h-[85vh]">
          {/* Header - Fixed at top */}
          <div className="flex-shrink-0 p-6 border-b border-border">
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden shadow-lg bg-muted flex-shrink-0">
                  <ImageWithFallback
                    src={perk.image}
                    alt={`${perk.title} logo`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <Badge variant="secondary" className={categoryClass}>
                      {perk.category}
                    </Badge>
                    {perk.isPopular && (
                      <div className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-current" />
                        <span>Popular</span>
                      </div>
                    )}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {perk.title}
                  </h2>
                  
                  {perk.discount && (
                    <div className="text-green-600 dark:text-green-400 text-xl font-semibold">
                      Save {perk.discount}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Scrollable Content - Takes remaining space */}
            <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent" style={{ maxHeight: 'calc(85vh - 300px)' }}>
              <div className="space-y-6 px-6 py-6">
                {/* Main Description */}
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">About this benefit</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {perk.description}
                  </p>
                </div>

                {/* Stats Row */}
                {renderStatsRow(perk)}

                {/* Benefits */}
                {renderBenefits(perk)}

                {/* Requirements */}
                {renderRequirements(perk)}

                {/* Verification Steps */}
                {renderVerification(perk)}
              </div>
            </div>

            {/* Action Buttons - Fixed at bottom, always visible */}
            <div className="flex-shrink-0 p-6 border-t-2 border-border bg-card backdrop-blur-sm shadow-lg">
              <div className="flex flex-col sm:flex-row gap-3">
                {perk.claimLink && perk.claimLink.trim() !== '' ? (
                  <button
                    onClick={handleApplyNow}
                    type="button"
                    className={`flex-1 ${getCategoryButtonColor()} text-white font-semibold h-16 text-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg flex items-center justify-center gap-2`}
                  >
                    <Gift className="w-6 h-6" />
                    <span>Apply Now</span>
                    <ExternalLink className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex-1 bg-gray-400 text-white font-semibold h-16 text-lg opacity-50 cursor-not-allowed rounded-lg flex items-center justify-center gap-2"
                    type="button"
                  >
                    <Gift className="w-6 h-6" />
                    <span>Apply Now</span>
                  </button>
                )}
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleSaveClick}
                  disabled={isSaving(perk.id)}
                  className={`flex-1 h-16 font-semibold border-2 transition-all duration-200 ${
                    isSaved(perk.id)
                      ? 'bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400 border-green-500 dark:border-green-600'
                      : 'bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                  type="button"
                >
                  {isSaving(perk.id) ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Saving...</>
                  ) : isSaved(perk.id) ? (
                    <><Bookmark className="w-5 h-5 mr-2 fill-current" />Saved ✓</>
                  ) : (
                    <><Bookmark className="w-5 h-5 mr-2" />Save for Later</>
                  )}
                </Button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors mt-4 w-full justify-center"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to all perks
              </button>
            </div>
          </div>
      </DialogContent>
    </Dialog>
  );
}
