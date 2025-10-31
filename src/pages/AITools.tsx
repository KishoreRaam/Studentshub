import { useState, useEffect, useMemo } from 'react';
import { Loader2, AlertCircle, X } from 'lucide-react';
import { AIToolsHero } from '@/components/ai-tools/AIToolsHero';
import { SearchAndFilters } from '@/components/ai-tools/SearchAndFilters';
import { ToolCard } from '@/components/ai-tools/ToolCard';
import { parseAIToolsCSV, extractUniqueStreams } from '@/utils/csvParser';
import type { AITool, SortOption, SecondaryFilter } from '@/types/ai-tools';
import { Button } from '@/components/ui/button';
import { useSavedItems } from '@/hooks/useSavedItems';

export default function AITools() {
  // State management
  const [tools, setTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStream, setSelectedStream] = useState('All Tools');
  const [selectedFilters, setSelectedFilters] = useState<SecondaryFilter[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('most-popular');

  // Use saved items hook for Appwrite integration
  const { isSaved, toggleSave, isSaving, loading: savedItemsLoading } = useSavedItems('aiTool');

  // Load tools from CSV
  useEffect(() => {
    const loadTools = async () => {
      try {
        setLoading(true);
        setError(null);
        const loadedTools = await parseAIToolsCSV('/assets/ai-tools-complete.csv');
        setTools(loadedTools);
      } catch (err) {
        console.error('Failed to load tools:', err);
        setError(err instanceof Error ? err.message : 'Failed to load AI tools. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadTools();
  }, []);

  // Extract unique streams
  const streams = useMemo(() => extractUniqueStreams(tools), [tools]);

  // Toggle save/unsave tool - now using Appwrite with full tool data
  const handleToggleSave = async (toolId: string) => {
    // Find the tool by ID to get full data
    const tool = tools.find(t => t.id === toolId);
    if (!tool) {
      console.error('Tool not found:', toolId);
      return;
    }

    // Pass full tool data to save
    const toolData = {
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
    };

    await toggleSave(toolData);
  };

  // Filter and sort tools
  const filteredAndSortedTools = useMemo(() => {
    let filtered = [...tools];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tool => {
        return (
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.features.some(f => f.toLowerCase().includes(query)) ||
          tool.category.some(c => c.toLowerCase().includes(query))
        );
      });
    }

    // Stream filter
    if (selectedStream !== 'All Tools') {
      filtered = filtered.filter(tool =>
        tool.category.includes(selectedStream)
      );
    }

    // Secondary filters
    if (selectedFilters.length > 0) {
      filtered = filtered.filter(tool => {
        return selectedFilters.every(filter => {
          switch (filter) {
            case 'Free':
              return tool.pricing === 'Free';
            case 'Freemium':
              return tool.pricing === 'Freemium';
            case 'Student Discount':
              return tool.pricing === 'Student Discount';
            case 'Paid':
              return tool.pricing === 'Paid';
            case 'Open Source':
              return tool.isOpenSource;
            case 'Most Popular':
              return tool.isPopular;
            case 'Recently Added':
              return tool.isNew;
            default:
              return true;
          }
        });
      });
    }

    // Sort
    switch (sortBy) {
      case 'most-popular':
        filtered.sort((a, b) => {
          if (a.isPopular && !b.isPopular) return -1;
          if (!a.isPopular && b.isPopular) return 1;
          return 0;
        });
        break;
      case 'recently-added':
        filtered.sort((a, b) => {
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return 0;
        });
        break;
      case 'a-z':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'best-student-discounts':
        filtered.sort((a, b) => {
          if (a.pricing === 'Student Discount' && b.pricing !== 'Student Discount') return -1;
          if (a.pricing !== 'Student Discount' && b.pricing === 'Student Discount') return 1;
          if (a.pricing === 'Free' && b.pricing !== 'Free' && b.pricing !== 'Student Discount') return -1;
          if (a.pricing !== 'Free' && b.pricing === 'Free' && a.pricing !== 'Student Discount') return 1;
          return 0;
        });
        break;
      case 'free-first':
        filtered.sort((a, b) => {
          const pricingOrder = { 'Free': 0, 'Freemium': 1, 'Student Discount': 2, 'Paid': 3 };
          return pricingOrder[a.pricing] - pricingOrder[b.pricing];
        });
        break;
      default:
        break;
    }

    return filtered;
  }, [tools, searchQuery, selectedStream, selectedFilters, sortBy]);

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedStream('All Tools');
    setSelectedFilters([]);
    setSortBy('most-popular');
  };

  // Retry loading
  const retryLoad = () => {
    window.location.reload();
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <p className="text-lg text-gray-600 dark:text-gray-400">Loading AI tools...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
        <div className="flex flex-col items-center justify-center py-32 px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Failed to Load AI Tools
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
            {error}
          </p>
          <Button
            onClick={retryLoad}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      {/* Hero Section */}
      <AIToolsHero
        toolsCount={tools.length}
        streamsCount={streams.length}
        usersCount="1.5 Lakh"
      />

      {/* Search and Filters */}
      <SearchAndFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStream={selectedStream}
        onStreamChange={setSelectedStream}
        streams={streams}
        selectedFilters={selectedFilters}
        onFiltersChange={setSelectedFilters}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results count and active filters */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredAndSortedTools.length}</span> tools
            </p>

            {(searchQuery || selectedStream !== 'All Tools' || selectedFilters.length > 0) && (
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200"
              >
                <X className="w-4 h-4" />
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Empty state */}
        {filteredAndSortedTools.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-4">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No tools found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
              We couldn't find any tools matching your filters. Try adjusting your search or filters.
            </p>
            <Button
              onClick={clearAllFilters}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedTools.map(tool => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onToggleSave={handleToggleSave}
                isSaved={isSaved(tool.id)}
                isSaving={isSaving(tool.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
