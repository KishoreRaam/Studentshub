import { Gift, Check, Calendar, Clock, ArrowLeft, Bookmark, Users, Shield, Star, ExternalLink } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import type { Perk } from "@/pages/benfits/Perks";

interface DetailedPerkCardProps {
  perk: Perk | null;
  isOpen: boolean;
  onClose: () => void;
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

export function DetailedPerkCard({ perk, isOpen, onClose }: DetailedPerkCardProps) {
  if (!perk) {
    return null;
  }

  const categoryClass =
    categoryColors[perk.category as keyof typeof categoryColors] ??
    "bg-muted text-muted-foreground";

  // Handle claim perk with proper validation
  const handleClaimPerk = () => {
    if (perk.claimLink && perk.claimLink.trim() !== '') {
      // Open in new tab with security features
      window.open(perk.claimLink, '_blank', 'noopener,noreferrer');
    } else {
      console.error('No claim link available for:', perk.title);
      alert('Claim link not available for this perk. Please try again later.');
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
    };
    return categoryColorMap[perk.category] || 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800';
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
      <DialogContent className="max-w-4xl w-full mx-4 p-0 gap-0 bg-card rounded-2xl shadow-2xl border-0 max-h-[90vh] overflow-hidden">
        <DialogTitle className="sr-only">{perk.title} Details</DialogTitle>
        <DialogDescription className="sr-only">
          Detailed information about {perk.title} including benefits, verification steps, and validity.
        </DialogDescription>

        <Card className="border-0 shadow-none rounded-2xl overflow-hidden relative">
          {/* Background Image Overlay */}
          <div className="absolute inset-0 opacity-30 overflow-hidden pointer-events-none">
            <ImageWithFallback
              src={perk.image}
              alt={`${perk.title} background`}
              className="w-full h-full object-cover scale-110 blur-sm"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-green-500/20" />
          </div>

          {/* Content with backdrop blur */}
          <div className="relative bg-card/95 backdrop-blur-sm">
            {/* Header */}
            <div className="p-6 border-b border-border">
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

            {/* Scrollable Content */}
            <div className="max-h-[60vh] overflow-y-auto">
              <div className="space-y-6">
                {/* Main Description */}
                <div className="px-6 pt-6">
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

            {/* Action Buttons */}
            <div className="p-6 border-t border-border bg-muted/30">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleClaimPerk}
                  disabled={!perk.claimLink || perk.claimLink.trim() === ''}
                  size="lg"
                  className={`flex-1 ${getCategoryButtonColor()} text-white font-semibold h-16 text-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400`}
                  type="button"
                >
                  <Gift className="w-6 h-6 mr-2" />
                  Claim Perk
                  <ExternalLink className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 h-16 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200"
                  type="button"
                >
                  <Bookmark className="w-5 h-5 mr-2" />
                  Save for Later
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
        </Card>
      </DialogContent>
    </Dialog>
  );
}
