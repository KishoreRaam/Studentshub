import { useRef } from "react";
import { Heart, ExternalLink, Check } from "lucide-react";
import type { SavedAITool } from "@/types/dashboard";

const getPricingColor = (pricing: string) => {
  switch (pricing) {
    case 'Free':             return 'bg-green-100/70 dark:bg-green-900/30 text-green-700 dark:text-green-400';
    case 'Freemium':         return 'bg-blue-100/70 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
    case 'Student Discount': return 'bg-purple-100/70 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
    case 'Paid':             return 'bg-orange-100/70 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
    default:                 return 'bg-gray-100/70 dark:bg-gray-700/30 text-gray-700 dark:text-gray-400';
  }
};

type AIToolCardProps = {
  aiTool: SavedAITool;
  onAccessTool: (aiTool: SavedAITool) => void;
  onToggleSave: (aiToolId: string) => void;
};

export default function AIToolCard({ aiTool, onAccessTool, onToggleSave }: AIToolCardProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleAccess = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple-wave';
      ripple.style.cssText = `width:60px;height:60px;left:${e.clientX - rect.left - 30}px;top:${e.clientY - rect.top - 30}px;background:radial-gradient(circle,rgba(147,51,234,0.4) 0%,transparent 70%);`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    }
    onAccessTool(aiTool);
  };

  return (
    <div className="nm-flat-hover rounded-2xl p-6">
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          {aiTool.isNew && (
            <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              NEW
            </span>
          )}
          {aiTool.isPopular && (
            <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-orange-500 to-red-500 text-white">
              POPULAR
            </span>
          )}
        </div>
        <button
          onClick={() => onToggleSave(aiTool.id)}
          className="nm-btn w-9 h-9 rounded-full flex items-center justify-center"
          aria-label="Remove from saved"
        >
          <Heart className="w-4 h-4 fill-red-500 text-red-500" />
        </button>
      </div>

      {/* Logo — floats */}
      <div className="flex justify-center mb-4">
        <div className="nm-inset w-16 h-16 rounded-xl flex items-center justify-center text-3xl overflow-hidden float-bob">
          {aiTool.logo_url ? (
            <img
              src={aiTool.logo_url}
              alt={aiTool.name}
              className="w-full h-full object-contain p-2"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <span className={aiTool.logo_url ? 'hidden' : ''}>{aiTool.logo || '🤖'}</span>
        </div>
      </div>

      <h3 className="text-base font-semibold text-gray-900 dark:text-white text-center mb-2">{aiTool.name}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4 line-clamp-2 min-h-[40px]">
        {aiTool.description}
      </p>

      {/* Categories */}
      <div className="flex flex-wrap gap-1.5 justify-center mb-4 min-h-[28px]">
        {(aiTool.category || []).slice(0, 3).map((cat, i) => (
          <span key={i} className="px-2 py-0.5 rounded-lg text-xs font-medium bg-blue-50/80 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
            {cat}
          </span>
        ))}
      </div>

      {/* Features */}
      <div className="space-y-1.5 mb-4">
        {(aiTool.features || []).slice(0, 2).map((feature, i) => (
          <div key={i} className="flex items-start gap-2">
            <Check className="w-3.5 h-3.5 text-[#00A63E] mt-0.5 flex-shrink-0" />
            <span className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">{feature}</span>
          </div>
        ))}
      </div>

      {/* Pricing */}
      <div className="flex justify-center mb-5">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPricingColor(aiTool.pricing)}`}>
          {aiTool.pricing || 'Free'}
        </span>
      </div>

      {/* Action */}
      <button
        ref={btnRef}
        onClick={handleAccess}
        className="nm-btn relative overflow-hidden w-full py-3 rounded-xl text-sm font-semibold text-purple-700 dark:text-purple-400 flex items-center justify-center gap-2 cursor-pointer"
      >
        <ExternalLink className="w-4 h-4" />
        Visit Tool
      </button>
    </div>
  );
}
