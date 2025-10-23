import { useState, useRef, useEffect } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import type { SortOption, SecondaryFilter } from '@/types/ai-tools';

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStream: string;
  onStreamChange: (stream: string) => void;
  streams: string[];
  selectedFilters: SecondaryFilter[];
  onFiltersChange: (filters: SecondaryFilter[]) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SECONDARY_FILTERS: SecondaryFilter[] = [
  'Free',
  'Freemium',
  'Student Discount',
  'Paid',
  'Open Source',
  'Most Popular',
  'Recently Added'
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'most-popular', label: 'Most Popular' },
  { value: 'recently-added', label: 'Recently Added' },
  { value: 'a-z', label: 'A-Z' },
  { value: 'best-student-discounts', label: 'Best Student Discounts' },
  { value: 'free-first', label: 'Free First' }
];

export function SearchAndFilters({
  searchQuery,
  onSearchChange,
  selectedStream,
  onStreamChange,
  streams,
  selectedFilters,
  onFiltersChange,
  sortBy,
  onSortChange
}: SearchAndFiltersProps) {
  const [isSticky, setIsSticky] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const streamScrollRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Handle sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterToggle = (filter: SecondaryFilter) => {
    if (selectedFilters.includes(filter)) {
      onFiltersChange(selectedFilters.filter(f => f !== filter));
    } else {
      onFiltersChange([...selectedFilters, filter]);
    }
  };

  const clearSearch = () => {
    onSearchChange('');
  };

  const allStreams = ['All Tools', ...streams];

  return (
    <div
      className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        isSticky ? 'sticky top-0 z-40 shadow-md' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Bar and Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search AI tools by name, description, or features..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative" ref={sortDropdownRef}>
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="w-full md:w-48 flex items-center justify-between gap-2 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <span className="text-sm font-medium">
                {SORT_OPTIONS.find(opt => opt.value === sortBy)?.label}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showSortDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showSortDropdown && (
              <div className="absolute top-full right-0 mt-2 w-full md:w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-50">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onSortChange(option.value);
                      setShowSortDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors duration-200 ${
                      sortBy === option.value
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stream Filter Pills - Horizontally Scrollable */}
        <div className="mb-4">
          <div
            ref={streamScrollRef}
            className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {allStreams.map((stream) => (
              <button
                key={stream}
                onClick={() => onStreamChange(stream)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  selectedStream === stream
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {stream}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filters - Multi-select */}
        <div className="flex flex-wrap gap-2">
          {SECONDARY_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterToggle(filter)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                selectedFilters.includes(filter)
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-2 border-blue-500 dark:border-blue-600'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
