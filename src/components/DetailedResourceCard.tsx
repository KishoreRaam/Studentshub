import { Check, ExternalLink, Loader2, Shield, Calendar, DollarSign, Award } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { motion } from "motion/react";
import type { Resource } from "@/types/resource";
import { useSavedItems } from "@/hooks/useSavedItems";

interface DetailedResourceCardProps {
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveChange?: () => void;
}

const categoryColors: Record<string, string> = {
  Development:
    "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  Design:
    "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
  Business:
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  "AI & ML":
    "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800",
  Cloud:
    "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800",
  Productivity:
    "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
  "Data Science":
    "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
  Marketing:
    "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
};

const getBadgeColor = (badge: string) => {
  const lowerBadge = badge.toLowerCase();
  if (lowerBadge.includes('exclusive') || lowerBadge.includes('premium')) {
    return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
  }
  if (lowerBadge.includes('popular') || lowerBadge.includes('trending')) {
    return 'bg-gradient-to-r from-orange-500 to-red-500 text-white';
  }
  if (lowerBadge.includes('new')) {
    return 'bg-gradient-to-r from-blue-500 to-purple-500 text-white';
  }
  return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
};

const renderStatsRow = (resource: Resource) => {
  return (
    <div className="px-6 py-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center border border-green-100 dark:border-green-800">
          <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <div className="text-sm text-green-600 dark:text-green-400">Discount</div>
          <div className="text-green-900 dark:text-green-300 font-medium text-sm">{resource.discountOfferINR || 'N/A'}</div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center border border-blue-100 dark:border-blue-800">
          <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-sm text-blue-600 dark:text-blue-400">Validity</div>
          <div className="text-blue-900 dark:text-blue-300 font-medium text-sm">{resource.validity || 'Check website'}</div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center border border-purple-100 dark:border-purple-800">
          <Shield className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <div className="text-sm text-purple-600 dark:text-purple-400">Verification</div>
          <div className="text-purple-900 dark:text-purple-300 font-medium text-sm">{resource.verificationMethod || 'Student ID'}</div>
        </div>
      </div>
    </div>
  );
};

const renderDescription = (resource: Resource) => {
  if (!resource.description) {
    return null;
  }

  return (
    <div className="px-6 py-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">About this Resource</h3>
      <p className="text-card-foreground leading-relaxed whitespace-pre-line">
        {resource.description}
      </p>
    </div>
  );
};

export function DetailedResourceCard({ resource, isOpen, onClose, onSaveChange }: DetailedResourceCardProps) {
  const { isSaved, toggleSave, isSaving } = useSavedItems('resource');

  if (!resource) {
    return null;
  }

  const categoryClass =
    categoryColors[resource.category as keyof typeof categoryColors] ??
    categoryColors["Development"];

  const handleSaveClick = async () => {
    if (resource) {
      await toggleSave({
        id: resource.id,
        provider: resource.provider,
        title: resource.title,
        category: resource.category,
        description: resource.description,
        discountOfferINR: resource.discountOfferINR,
        validity: resource.validity,
        verificationMethod: resource.verificationMethod,
        claimLink: resource.claimLink,
        badge: resource.badge,
      });

      if (onSaveChange) {
        onSaveChange();
      }
    }
  };

  const handleClaimClick = () => {
    if (resource.claimLink) {
      window.open(resource.claimLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-4xl w-full mx-4 p-0 gap-0 bg-transparent rounded-2xl shadow-2xl border-0 max-h-[85vh] flex flex-col">
        <DialogTitle className="sr-only">{resource.title} Details</DialogTitle>
        <DialogDescription className="sr-only">
          Detailed information about {resource.title} from {resource.provider} including discount offers and validity.
        </DialogDescription>

        {/* Content container with backdrop blur */}
        <div className="relative bg-card/95 backdrop-blur-sm flex flex-col rounded-2xl overflow-hidden max-h-[85vh]">
          {/* Header - Fixed at top */}
          <div className="flex-shrink-0 p-6 border-b border-border">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-4xl">📚</span>
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2 flex-wrap gap-2">
                  <Badge variant="secondary" className={categoryClass}>
                    {resource.category}
                  </Badge>
                  {resource.badge && (
                    <Badge variant="secondary" className={getBadgeColor(resource.badge)}>
                      <Award className="w-3 h-3 mr-1" />
                      {resource.badge}
                    </Badge>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-foreground mb-1">
                  {resource.title}
                </h2>

                <p className="text-muted-foreground text-sm">
                  by {resource.provider}
                </p>

                {resource.discountOfferINR && (
                  <div className="text-green-600 dark:text-green-400 text-lg font-semibold mt-2">
                    {resource.discountOfferINR}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent" style={{ maxHeight: 'calc(85vh - 300px)' }}>
            <div className="divide-y divide-border">
              {/* Stats Row */}
              {renderStatsRow(resource)}

              {/* Description */}
              {renderDescription(resource)}
            </div>
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="flex-shrink-0 p-6 border-t border-border space-y-3">
            {/* Claim Resource Button */}
            <Button
              onClick={handleClaimClick}
              disabled={!resource.claimLink}
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ExternalLink className="w-6 h-6 mr-2" />
              {resource.claimLink ? 'Claim Resource' : 'No Link Available'}
            </Button>

            {/* Save for Later Button */}
            <Button
              onClick={handleSaveClick}
              disabled={isSaving(resource.id)}
              variant={isSaved(resource.id) ? "default" : "outline"}
              className={`w-full h-12 font-semibold transition-all duration-200 ${
                isSaved(resource.id)
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              }`}
            >
              {isSaving(resource.id) ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isSaved(resource.id) ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Saved to Dashboard
                </>
              ) : (
                <>
                  <Award className="w-5 h-5 mr-2" />
                  Save for Later
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
