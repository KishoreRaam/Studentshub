import { useState, useEffect } from 'react';
import { Heart, ExternalLink, Check, Lock, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AITool } from '@/types/ai-tools';

interface ToolCardProps {
  tool: AITool;
  onToggleSave: (toolId: string) => void;
  isSaved: boolean;
}

export function ToolCard({ tool, onToggleSave, isSaved }: ToolCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Get pricing badge color
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

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSave(tool.id);
  };

  const handleVisitClick = () => {
    window.open(tool.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6">
        {/* Top row: Badges and Save button */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {tool.isNew && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold">
                NEW
              </span>
            )}
            {tool.isPopular && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold">
                POPULAR
              </span>
            )}
          </div>
          <button
            onClick={handleSaveClick}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label={isSaved ? 'Remove from saved' : 'Save tool'}
          >
            <Heart
              className={`w-5 h-5 transition-all duration-200 ${
                isSaved
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-400 hover:text-red-500'
              }`}
            />
          </button>
        </div>

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center text-3xl overflow-hidden">
            {tool.logo_url ? (
              <img
                src={tool.logo_url}
                alt={`${tool.name} logo`}
                className="w-full h-full object-contain p-2"
                onError={(e) => {
                  // Fallback to emoji if image fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <span className={tool.logo_url ? 'hidden' : ''}>
              {tool.logo}
            </span>
          </div>
        </div>

        {/* Name */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
          {tool.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4 line-clamp-2 min-h-[40px]">
          {tool.description}
        </p>

        {/* Stream tags */}
        <div className="flex flex-wrap gap-2 justify-center mb-4 min-h-[28px]">
          {tool.category.slice(0, 3).map((cat, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-medium"
            >
              {cat}
            </span>
          ))}
          {tool.category.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium">
              +{tool.category.length - 3} more
            </span>
          )}
        </div>

        {/* Features */}
        <div className="space-y-2 mb-4">
          {tool.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300 line-clamp-1">
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing badge */}
        <div className="flex justify-center mb-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getPricingColor(tool.pricing)}`}>
            {tool.pricing}
          </span>
        </div>

        {/* Additional badges */}
        <div className="flex flex-wrap gap-2 justify-center mb-4 min-h-[24px]">
          {tool.requiresVerification && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs">
              <Lock className="w-3 h-3" />
              Verification
            </span>
          )}
          {tool.isOpenSource && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 text-xs">
              <Code className="w-3 h-3" />
              Open Source
            </span>
          )}
        </div>

        {/* Visit Tool button */}
        <Button
          onClick={handleVisitClick}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          Visit Tool
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
