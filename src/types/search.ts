// Unified search types for global search across Perks, AI Tools, and Resources

export type SearchItemType = 'perk' | 'tool' | 'resource';

// Unified searchable item interface
export interface SearchableItem {
  id: string;
  type: SearchItemType;
  title: string;
  description: string;
  category: string | string[]; // Can be single string or array
  logo?: string;
  logo_url?: string;
  link: string; // Could be claimLink or external link

  // Optional fields that may vary by type
  discount?: string;
  pricing?: string;
  features?: string[];
  provider?: string;
  validity?: string;
  verification?: string;
  isPopular?: boolean;
  isNew?: boolean;

  // Original data for detailed view
  originalData: unknown;
}

// Search results grouped by type
export interface GroupedSearchResults {
  perks: SearchableItem[];
  tools: SearchableItem[];
  resources: SearchableItem[];
  total: number;
}

// Search state interface
export interface SearchState {
  query: string;
  results: GroupedSearchResults;
  loading: boolean;
  error: string | null;
}

// Search context interface
export interface SearchContextType {
  searchState: SearchState;
  search: (query: string) => void;
  clearSearch: () => void;
  isDataLoaded: boolean;
}
