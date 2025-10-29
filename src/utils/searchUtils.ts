import Fuse from 'fuse.js';
import type { SearchableItem, GroupedSearchResults } from '@/types/search';

// Fuse.js configuration for fuzzy search
const fuseOptions: Fuse.IFuseOptions<SearchableItem> = {
  keys: [
    { name: 'title', weight: 3 }, // Title is most important
    { name: 'description', weight: 2 },
    { name: 'category', weight: 1.5 },
    { name: 'features', weight: 1 },
    { name: 'provider', weight: 1 },
  ],
  threshold: 0.4, // Lower = more strict, Higher = more fuzzy (0.0 to 1.0)
  distance: 100,
  minMatchCharLength: 2,
  includeScore: true,
  useExtendedSearch: false,
};

/**
 * Performs fuzzy search across all searchable items
 * @param items - Array of searchable items to search through
 * @param query - Search query string
 * @returns Grouped search results by type
 */
export function performGlobalSearch(
  items: SearchableItem[],
  query: string
): GroupedSearchResults {
  // If query is empty, return empty results
  if (!query || query.trim().length < 2) {
    return {
      perks: [],
      tools: [],
      resources: [],
      total: 0,
    };
  }

  // Initialize Fuse with all items
  const fuse = new Fuse(items, fuseOptions);

  // Perform search
  const searchResults = fuse.search(query);

  // Extract items from Fuse results (sorted by relevance)
  const matchedItems = searchResults.map((result) => result.item);

  // Group results by type
  const groupedResults: GroupedSearchResults = {
    perks: matchedItems.filter((item) => item.type === 'perk'),
    tools: matchedItems.filter((item) => item.type === 'tool'),
    resources: matchedItems.filter((item) => item.type === 'resource'),
    total: matchedItems.length,
  };

  return groupedResults;
}

/**
 * Debounce function to limit search calls
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Normalizes category to always be an array
 * @param category - Category string or array
 * @returns Array of categories
 */
export function normalizeCategory(category: string | string[]): string[] {
  return Array.isArray(category) ? category : [category];
}

/**
 * Formats category for display (takes first category if multiple)
 * @param category - Category string or array
 * @returns Single category string
 */
export function formatCategoryForDisplay(category: string | string[]): string {
  const categories = normalizeCategory(category);
  return categories[0] || 'Other';
}

/**
 * Truncates text to specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}
