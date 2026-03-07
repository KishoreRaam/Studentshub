import { useRef } from "react";
import { Bookmark, ExternalLink } from "lucide-react";
import type { SavedResource } from "@/types/dashboard";
import { getLogoUrl } from "@/utils/logoUtils";

type ResourceCardProps = {
  resource: SavedResource;
  onAccessResource: (resource: SavedResource) => void;
  onToggleSave: (resourceId: string) => void;
};

export default function ResourceCard({ resource, onAccessResource, onToggleSave }: ResourceCardProps) {
  const logoUrl = getLogoUrl(resource.provider || resource.title, resource.claimLink);
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleAccess = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple-wave';
      ripple.style.cssText = `width:60px;height:60px;left:${e.clientX - rect.left - 30}px;top:${e.clientY - rect.top - 30}px;background:radial-gradient(circle,rgba(0,166,62,0.4) 0%,transparent 70%);`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    }
    onAccessResource(resource);
  };

  return (
    <div className="nm-flat-hover rounded-2xl p-6 relative">
      {/* Bookmark */}
      <button
        type="button"
        onClick={() => onToggleSave(resource.id)}
        className="nm-btn absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center"
        aria-label="Toggle bookmark"
      >
        <Bookmark
          className={`w-4 h-4 ${resource.isSaved ? 'fill-[#1A56DB] text-[#1A56DB]' : 'text-gray-500 dark:text-gray-400'}`}
        />
      </button>

      {/* Logo */}
      <div className="nm-inset w-16 h-16 rounded-xl flex items-center justify-center mb-4 overflow-hidden">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={resource.title}
            className="w-full h-full object-contain p-2"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <span className={`text-3xl ${logoUrl ? 'hidden' : ''}`}>📚</span>
      </div>

      {/* Content */}
      <div className="mb-5">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white pr-8 mb-2">{resource.title}</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-2 py-1 rounded-lg text-xs font-medium bg-blue-100/70 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
            {resource.category}
          </span>
          {resource.badge && (
            <span className="px-2 py-1 rounded-lg text-xs font-medium bg-green-100/70 dark:bg-green-900/30 text-green-700 dark:text-green-400">
              {resource.badge}
            </span>
          )}
        </div>
        {resource.provider && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">by {resource.provider}</p>
        )}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{resource.description}</p>
      </div>

      {/* Action */}
      <button
        ref={btnRef}
        onClick={handleAccess}
        className="nm-btn relative overflow-hidden w-full py-3 rounded-xl text-sm font-semibold text-[#00A63E] dark:text-green-400 flex items-center justify-center gap-2 cursor-pointer"
      >
        <ExternalLink className="w-4 h-4" />
        Access Resource
      </button>
    </div>
  );
}
