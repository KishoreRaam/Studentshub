import { Bookmark, ExternalLink, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SavedAITool } from "@/types/dashboard";

type AIToolCardProps = {
  aiTool: SavedAITool;
  onAccessTool: (aiTool: SavedAITool) => void;
  onToggleSave: (aiToolId: string) => void;
};

export default function AIToolCard({ aiTool, onAccessTool, onToggleSave }: AIToolCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 p-6 relative group">
      {/* Bookmark Icon */}
      <button
        type="button"
        onClick={() => onToggleSave(aiTool.id)}
        className="absolute top-4 right-4 p-2 rounded-full bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
        aria-label="Toggle bookmark"
      >
        <Bookmark
          className={`w-5 h-5 ${
            aiTool.isSaved
              ? "fill-purple-600 text-purple-600 dark:fill-purple-400 dark:text-purple-400"
              : "text-purple-600 dark:text-purple-400"
          }`}
        />
      </button>

      {/* Icon with AI Sparkle */}
      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700 rounded-xl shadow-md flex items-center justify-center mb-4 relative">
        <span className="text-3xl">{aiTool.icon}</span>
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
          <Sparkles className="w-3 h-3 text-yellow-900" />
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-8">
            {aiTool.title}
          </h3>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-0">
            {aiTool.category}
          </Badge>
          <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-0">
            Saved
          </Badge>
          {aiTool.isPremium && (
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
              Premium
            </Badge>
          )}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {aiTool.description}
        </p>
      </div>

      {/* Action Button */}
      <Button
        onClick={() => onAccessTool(aiTool)}
        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-cyan-600 dark:to-blue-700 dark:hover:from-cyan-700 dark:hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all font-semibold"
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        Try AI Tool
      </Button>
    </div>
  );
}
