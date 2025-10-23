import { Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SavedPerk } from "@/types/dashboard";

type PerkCardProps = {
  perk: SavedPerk;
  onViewDetails: (perk: SavedPerk) => void;
  onToggleSave: (perkId: string) => void;
};

export default function PerkCard({ perk, onViewDetails, onToggleSave }: PerkCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 p-6 relative group">
      {/* Bookmark Icon */}
      <button
        type="button"
        onClick={() => onToggleSave(perk.id)}
        className="absolute top-4 right-4 p-2 rounded-full bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
        aria-label="Toggle bookmark"
      >
        <Bookmark
          className={`w-5 h-5 ${
            perk.isSaved
              ? "fill-blue-600 text-blue-600 dark:fill-blue-400 dark:text-blue-400"
              : "text-blue-600 dark:text-blue-400"
          }`}
        />
      </button>

      {/* Icon */}
      <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 dark:from-cyan-600 dark:to-blue-700 rounded-xl shadow-md flex items-center justify-center mb-4">
        <span className="text-3xl">{perk.icon}</span>
      </div>

      {/* Content */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-8">
            {perk.title}
          </h3>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-0">
            {perk.category}
          </Badge>
          <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-0">
            Saved
          </Badge>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {perk.validity}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {perk.description}
        </p>
      </div>

      {/* Action Button */}
      <Button
        onClick={() => onViewDetails(perk)}
        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-cyan-600 dark:to-blue-700 dark:hover:from-cyan-700 dark:hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all font-semibold"
      >
        View Details
      </Button>
    </div>
  );
}
