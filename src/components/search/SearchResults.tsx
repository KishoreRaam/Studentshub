import { Gift, Wrench, BookOpen, Search } from 'lucide-react';
import { SearchResultItem } from './SearchResultItem';
import type { GroupedSearchResults } from '@/types/search';

interface SearchResultsProps {
  results: GroupedSearchResults;
  query: string;
  loading: boolean;
}

export function SearchResults({ results, query, loading }: SearchResultsProps) {
  const { perks, tools, resources, total } = results;

  // Show loading state
  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Searching...</p>
      </div>
    );
  }

  // Show empty state if no query
  if (!query || query.trim().length < 2) {
    return (
      <div className="py-16 text-center">
        <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Start Searching
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Search across perks, AI tools, and resources
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          Try searching for "computer science", "design", or "free"
        </p>
      </div>
    );
  }

  // Show no results state
  if (total === 0) {
    return (
      <div className="py-16 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No Results Found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          We couldn't find anything matching "{query}"
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          Try different keywords or check your spelling
        </p>
      </div>
    );
  }

  // Show grouped results
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Results summary */}
      <div className="sticky top-0 bg-white dark:bg-gray-900 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700 z-10">
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          Found <span className="font-semibold text-gray-900 dark:text-white">{total}</span> results
          {perks.length > 0 && (
            <span className="ml-1 sm:ml-2">
              • <span className="font-medium">{perks.length}</span> Perks
            </span>
          )}
          {tools.length > 0 && (
            <span className="ml-1 sm:ml-2">
              • <span className="font-medium">{tools.length}</span> Tools
            </span>
          )}
          {resources.length > 0 && (
            <span className="ml-1 sm:ml-2">
              • <span className="font-medium">{resources.length}</span> Resources
            </span>
          )}
        </p>
      </div>

      {/* Perks section */}
      {perks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Gift className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Perks ({perks.length})
            </h2>
          </div>
          <div className="space-y-3">
            {perks.map((item) => (
              <SearchResultItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* AI Tools section */}
      {tools.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Wrench className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              AI Tools ({tools.length})
            </h2>
          </div>
          <div className="space-y-3">
            {tools.map((item) => (
              <SearchResultItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Resources section */}
      {resources.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Resources ({resources.length})
            </h2>
          </div>
          <div className="space-y-3">
            {resources.map((item) => (
              <SearchResultItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
