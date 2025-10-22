import { Gift, Check, Calendar, Clock, ArrowLeft, Bookmark } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { ImageWithFallback } from "./figma/ImageWithFallback";
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
    <div className="px-6 py-4">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
        <Gift className="w-5 h-5 mr-2 text-blue-600" />
        What You Get
      </h3>
      <ul className="space-y-3">
        {perk.benefits.map((benefit, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-card-foreground leading-relaxed">{benefit}</span>
          </li>
        ))}
      </ul>
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
    <div className="px-6 py-4 bg-muted/50">
      <h3 className="text-lg font-semibold text-foreground mb-4">How to Verify</h3>
      <ol className="space-y-3">
        {steps.map((step, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{index + 1}</span>
            </div>
            <span className="text-card-foreground leading-relaxed">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

const renderValidity = (perk: Perk) => {
  if (!perk.validity) {
    return null;
  }

  const Icon = perk.validityType === "date" ? Calendar : Clock;

  return (
    <div className="px-6 py-4">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
        <Icon className="w-5 h-5 mr-2 text-purple-600" />
        Validity
      </h3>
      <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
        <p className="text-purple-800 dark:text-purple-300 font-medium">{perk.validity}</p>
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

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-2xl w-full mx-4 p-0 gap-0 bg-card rounded-2xl shadow-2xl border-0 max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">{perk.title} Details</DialogTitle>
        <DialogDescription className="sr-only">
          Detailed information about {perk.title} including benefits, verification steps, and validity.
        </DialogDescription>

        <Card className="border-0 shadow-none rounded-2xl overflow-hidden">
          <div className="relative p-6 pb-4">
            <div className="flex items-start gap-6 pr-12">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                <ImageWithFallback
                  src={perk.image}
                  alt={`${perk.title} logo`}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h2 className="text-2xl font-bold text-foreground">{perk.title}</h2>
                  {perk.isPopular ? (
                    <Badge className="bg-gradient-to-r from-blue-500 to-green-500 text-white border-0 animate-pulse">
                      Most Popular
                    </Badge>
                  ) : null}
                </div>

                <Badge variant="outline" className={`text-sm mb-3 ${categoryClass}`}>
                  {perk.category}
                </Badge>

                {perk.discount ? (
                  <div className="mb-3">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
                      <Gift className="w-4 h-4 mr-2" />
                      {perk.discount}
                    </span>
                  </div>
                ) : null}

                <p className="text-muted-foreground leading-relaxed">{perk.description}</p>
              </div>
            </div>
          </div>

          {renderBenefits(perk)}
          {renderVerification(perk)}
          {renderValidity(perk)}

          <div className="p-6 bg-muted/50 border-t border-border">
            <div className="flex flex-col sm:flex-row gap-3">
              {perk.claimLink ? (
                <Button
                  asChild
                  className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white border-0 h-12"
                >
                  <a href={perk.claimLink} target="_blank" rel="noopener noreferrer">
                    Claim Benefit
                  </a>
                </Button>
              ) : (
                <Button
                  disabled
                  className="flex-1 bg-gradient-to-r from-blue-600/60 to-green-600/60 text-white border-0 h-12"
                >
                  Claim Benefit
                </Button>
              )}
              <Button variant="outline" className="flex-1 h-12 border-border hover:bg-accent" type="button">
                <Bookmark className="w-4 h-4 mr-2" />
                Save for Later
              </Button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-600 transition-colors mt-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all perks
            </button>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
