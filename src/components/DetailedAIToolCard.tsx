import { Check, Star, ExternalLink, Loader2, Sparkles, Code, Lock, DollarSign } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { motion } from "motion/react";
import type { AITool } from "@/types/ai-tools";
import { useSavedItems } from "@/hooks/useSavedItems";

interface DetailedAIToolCardProps {
  tool: AITool | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveChange?: () => void;
}

const categoryColors: Record<string, string> = {
  "All Tools":
    "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800",
  "Computer Science & Engineering":
    "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  "Arts & Humanities":
    "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
  "Business & Management":
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  "Information Technology":
    "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800",
};

const getPricingColor = (pricing: AITool['pricing']) => {
  switch (pricing) {
    case 'Free':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'Freemium':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'Student Discount':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    case 'Paid':
      return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  }
};

const renderFeatures = (tool: AITool) => {
  if (!tool.features || tool.features.length === 0) {
    return null;
  }

  return (
    <div className="px-6 py-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Key Features</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tool.features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-3"
          >
            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-card-foreground leading-relaxed">{feature}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const renderCategories = (tool: AITool) => {
  if (!tool.category || tool.category.length === 0) {
    return null;
  }

  return (
    <div className="px-6 py-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Categories</h3>
      <div className="flex flex-wrap gap-2">
        {tool.category.map((cat, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-medium"
          >
            {cat}
          </Badge>
        ))}
      </div>
    </div>
  );
};

const renderStatsRow = (tool: AITool) => {
  return (
    <div className="px-6 py-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center border border-green-100 dark:border-green-800">
          <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <div className="text-sm text-green-600 dark:text-green-400">Pricing</div>
          <div className="text-green-900 dark:text-green-300 font-medium">{tool.pricing}</div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center border border-blue-100 dark:border-blue-800">
          <Code className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-sm text-blue-600 dark:text-blue-400">Open Source</div>
          <div className="text-blue-900 dark:text-blue-300 font-medium">{tool.isOpenSource ? 'Yes' : 'No'}</div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center border border-purple-100 dark:border-purple-800">
          <Lock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <div className="text-sm text-purple-600 dark:text-purple-400">Verification</div>
          <div className="text-purple-900 dark:text-purple-300 font-medium">{tool.requiresVerification ? 'Required' : 'None'}</div>
        </div>
      </div>
    </div>
  );
};

export function DetailedAIToolCard({ tool, isOpen, onClose, onSaveChange }: DetailedAIToolCardProps) {
  const { isSaved, toggleSave, isSaving } = useSavedItems('aiTool');

  if (!tool) {
    return null;
  }

  const primaryCategory = tool.category[0] || "All Tools";
  const categoryClass =
    categoryColors[primaryCategory as keyof typeof categoryColors] ??
    categoryColors["All Tools"];

  const handleSaveClick = async () => {
    if (tool) {
      await toggleSave({
        id: tool.id,
        name: tool.name,
        description: tool.description,
        logo: tool.logo,
        logo_url: tool.logo_url,
        logo_source: tool.logo_source,
        category: tool.category,
        pricing: tool.pricing,
        features: tool.features,
        link: tool.link,
        isOpenSource: tool.isOpenSource,
        isPopular: tool.isPopular,
        isNew: tool.isNew,
        requiresVerification: tool.requiresVerification,
      });

      if (onSaveChange) {
        onSaveChange();
      }
    }
  };

  const handleVisitClick = () => {
    window.open(tool.link, '_blank', 'noopener,noreferrer');
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
        <DialogTitle className="sr-only">{tool.name} Details</DialogTitle>
        <DialogDescription className="sr-only">
          Detailed information about {tool.name} including features, pricing, and categories.
        </DialogDescription>

        {/* Content container with backdrop blur */}
        <div className="relative bg-card/95 backdrop-blur-sm flex flex-col rounded-2xl overflow-hidden max-h-[85vh]">
          {/* Header - Fixed at top */}
          <div className="flex-shrink-0 p-6 border-b border-border">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center flex-shrink-0">
                {tool.logo_url ? (
                  <img
                    src={tool.logo_url}
                    alt={`${tool.name} logo`}
                    className="w-full h-full object-contain p-2"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <span className={`text-4xl ${tool.logo_url ? 'hidden' : ''}`}>
                  {tool.logo}
                </span>
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2 flex-wrap gap-2">
                  <Badge variant="secondary" className={categoryClass}>
                    {primaryCategory}
                  </Badge>
                  <Badge variant="secondary" className={getPricingColor(tool.pricing)}>
                    {tool.pricing}
                  </Badge>
                  {tool.isPopular && (
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span>Popular</span>
                    </div>
                  )}
                  {tool.isNew && (
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>New</span>
                    </div>
                  )}
                  {tool.isOpenSource && (
                    <Badge variant="secondary" className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400">
                      <Code className="w-3 h-3 mr-1" />
                      Open Source
                    </Badge>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {tool.name}
                </h2>

                <p className="text-muted-foreground">
                  {tool.description}
                </p>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent" style={{ maxHeight: 'calc(85vh - 300px)' }}>
            <div className="divide-y divide-border">
              {/* Stats Row */}
              {renderStatsRow(tool)}

              {/* Features */}
              {renderFeatures(tool)}

              {/* Categories */}
              {renderCategories(tool)}
            </div>
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="flex-shrink-0 p-6 border-t border-border space-y-3">
            {/* Visit Tool Button */}
            <Button
              onClick={handleVisitClick}
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
            >
              <ExternalLink className="w-6 h-6 mr-2" />
              Visit Tool
            </Button>

            {/* Save for Later Button */}
            <Button
              onClick={handleSaveClick}
              disabled={isSaving(tool.id)}
              variant={isSaved(tool.id) ? "default" : "outline"}
              className={`w-full h-12 font-semibold transition-all duration-200 ${
                isSaved(tool.id)
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              }`}
            >
              {isSaving(tool.id) ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isSaved(tool.id) ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Saved to Dashboard
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
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
