import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import Papa from 'papaparse';
import { parseAIToolsCSV } from '@/utils/csvParser';
import { performGlobalSearch, debounce } from '@/utils/searchUtils';
import type { SearchableItem, SearchContextType, SearchState, GroupedSearchResults } from '@/types/search';
import type { AITool } from '@/types/ai-tools';
import type { Resource } from '@/types/resource';

// CSV file paths
const PERKS_CSV = '/assets/Name-Category-Description-DiscountOfferINR-VerificationMethod-Validity-ClaimLink.csv';
const AI_TOOLS_CSV = '/assets/ai-tools-complete.csv';
const RESOURCES_CSV = '/assets/student_courses_resources.csv';

// Initial search state
const initialSearchState: SearchState = {
  query: '',
  results: {
    perks: [],
    tools: [],
    resources: [],
    total: 0,
  },
  loading: false,
  error: null,
};

// Create context
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Perk row type from CSV (handles both uppercase and lowercase headers)
interface CsvPerkRow {
  Name?: string;
  name?: string;
  title?: string;
  Category?: string;
  category?: string;
  Description?: string;
  description?: string;
  DiscountOfferINR?: string;
  discountOfferINR?: string;
  DiscountOffer?: string;
  VerificationMethod?: string;
  verificationMethod?: string;
  Validity?: string;
  validity?: string;
  ClaimLink?: string;
  claimLink?: string;
  claimlink?: string;
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchState, setSearchState] = useState<SearchState>(initialSearchState);
  const [allItems, setAllItems] = useState<SearchableItem[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Load all data on mount
  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [perks, tools, resources] = await Promise.all([
          loadPerks(),
          loadAITools(),
          loadResources(),
        ]);

        const combinedItems: SearchableItem[] = [
          ...perks,
          ...tools,
          ...resources,
        ];

        setAllItems(combinedItems);
        setIsDataLoaded(true);
      } catch (error) {
        console.error('Failed to load search data:', error);
        setSearchState(prev => ({
          ...prev,
          error: 'Failed to load search data. Please refresh the page.',
        }));
      }
    };

    loadAllData();
  }, []);

  // Load perks from CSV
  const loadPerks = async (): Promise<SearchableItem[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse<CsvPerkRow>(PERKS_CSV, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const perks: SearchableItem[] = results.data
            .map((row, index) => {
              // Handle both uppercase and lowercase CSV headers
              const title = row.Name || row.name || row.title || '';

              // Skip empty rows
              if (!title || title.trim() === '') {
                return null;
              }

              const category = row.Category || row.category || 'Other';
              const description = row.Description || row.description || '';
              const discount = row.DiscountOfferINR || row.discountOfferINR || row.DiscountOffer || '';
              const validity = row.Validity || row.validity || '';
              const verification = row.VerificationMethod || row.verificationMethod || '';
              const link = row.ClaimLink || row.claimLink || row.claimlink || '#';

              return {
                id: `perk-${index}`,
                type: 'perk' as const,
                title: title.trim(),
                description: description.trim(),
                category: category.trim(),
                link,
                discount,
                validity,
                verification,
                originalData: row,
              };
            })
            .filter((perk): perk is SearchableItem => perk !== null);

          console.log(`Loaded ${perks.length} perks for search`);
          resolve(perks);
        },
        error: (error) => {
          console.error('Failed to load perks:', error);
          resolve([]); // Return empty array on error to not break everything
        },
      });
    });
  };

  // Load AI tools from CSV
  const loadAITools = async (): Promise<SearchableItem[]> => {
    try {
      const tools = await parseAIToolsCSV(AI_TOOLS_CSV);
      const searchableTools = tools.map((tool: AITool) => ({
        id: tool.id,
        type: 'tool' as const,
        title: tool.name,
        description: tool.description,
        category: tool.category,
        logo: tool.logo,
        logo_url: tool.logo_url,
        link: tool.link,
        pricing: tool.pricing,
        features: tool.features,
        isPopular: tool.isPopular,
        isNew: tool.isNew,
        originalData: tool,
      }));
      console.log(`Loaded ${searchableTools.length} AI tools for search`);
      return searchableTools;
    } catch (error) {
      console.error('Failed to load AI tools:', error);
      return [];
    }
  };

  // Load resources from CSV
  const loadResources = async (): Promise<SearchableItem[]> => {
    try {
      const response = await fetch(RESOURCES_CSV);
      const csvText = await response.text();

      return new Promise((resolve, reject) => {
        Papa.parse<Resource>(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const resources: SearchableItem[] = results.data
              .map((resource, index) => {
                const title = resource.title || resource.provider || '';

                // Skip empty rows
                if (!title || title.trim() === '') {
                  return null;
                }

                return {
                  id: `resource-${index}`,
                  type: 'resource' as const,
                  title: title.trim(),
                  description: (resource.description || '').trim(),
                  category: (resource.category || 'Other').trim(),
                  provider: resource.provider,
                  link: resource.claimLink || '#',
                  discount: resource.discountOfferINR,
                  validity: resource.validity,
                  verification: resource.verificationMethod,
                  originalData: resource,
                };
              })
              .filter((resource): resource is SearchableItem => resource !== null);

            console.log(`Loaded ${resources.length} resources for search`);
            resolve(resources);
          },
          error: (error) => {
            console.error('Failed to load resources:', error);
            resolve([]);
          },
        });
      });
    } catch (error) {
      console.error('Failed to load resources:', error);
      return [];
    }
  };

  // Perform search
  const performSearch = useCallback((query: string) => {
    if (!query || query.trim().length < 2) {
      setSearchState(prev => ({
        ...prev,
        query,
        results: {
          perks: [],
          tools: [],
          resources: [],
          total: 0,
        },
        loading: false,
      }));
      return;
    }

    setSearchState(prev => ({ ...prev, loading: true, query }));

    // Perform the search
    const results = performGlobalSearch(allItems, query);

    setSearchState(prev => ({
      ...prev,
      results,
      loading: false,
      error: null,
    }));
  }, [allItems]);

  // Debounced search function (300ms delay)
  const debouncedSearch = useMemo(
    () => debounce(performSearch, 300),
    [performSearch]
  );

  // Search function to be called by components
  const search = useCallback((query: string) => {
    setSearchState(prev => ({ ...prev, query, loading: true }));
    debouncedSearch(query);
  }, [debouncedSearch]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchState(initialSearchState);
  }, []);

  const contextValue: SearchContextType = {
    searchState,
    search,
    clearSearch,
    isDataLoaded,
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
}

// Custom hook to use search context
export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
