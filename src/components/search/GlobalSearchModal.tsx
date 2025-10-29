import { useEffect, useRef, useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useSearch } from '@/contexts/SearchContext';
import { SearchResults } from './SearchResults';

interface GlobalSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalSearchModal({ open, onOpenChange }: GlobalSearchModalProps) {
  const { searchState, search, clearSearch, isDataLoaded } = useSearch();
  const [localQuery, setLocalQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      // Small delay to ensure dialog is fully rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // Clear search when modal closes
  useEffect(() => {
    if (!open) {
      setLocalQuery('');
      clearSearch();
    }
  }, [open, clearSearch]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setLocalQuery(query);
    search(query);
  };

  // Handle clear button
  const handleClear = () => {
    setLocalQuery('');
    clearSearch();
    inputRef.current?.focus();
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(true);
      }

      // ESC to close
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] sm:w-[85vw] md:w-[80vw] lg:w-[75vw] max-w-5xl h-[90vh] sm:h-[85vh] md:max-h-[90vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-3 sm:p-4 pb-0 space-y-0">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search perks, AI tools, and resources..."
              value={localQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-20 h-12 text-base border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-blue-500"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              {searchState.loading && (
                <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
              )}
              {localQuery && (
                <button
                  onClick={handleClear}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
              <kbd className="hidden md:inline-flex items-center px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 rounded border border-gray-200 dark:border-gray-700">
                ESC
              </kbd>
            </div>
          </div>

          {/* Loading data message */}
          {!isDataLoaded && (
            <div className="py-2 px-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm rounded-md flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading search data...</span>
            </div>
          )}
        </DialogHeader>

        {/* Search results */}
        <div className="overflow-y-auto px-3 sm:px-4 pb-4 h-[calc(90vh-140px)] sm:h-[calc(85vh-140px)] md:max-h-[calc(90vh-140px)]">
          {isDataLoaded ? (
            <SearchResults
              results={searchState.results}
              query={searchState.query}
              loading={searchState.loading}
            />
          ) : (
            <div className="py-16 text-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Loading search data...
              </p>
            </div>
          )}
        </div>

        {/* Keyboard shortcut hint */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span className="hidden md:inline">
                <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                  {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+K
                </kbd>{' '}
                to open
              </span>
              <span>
                <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                  ESC
                </kbd>{' '}
                to close
              </span>
            </div>
            {searchState.results.total > 0 && (
              <span className="text-gray-600 dark:text-gray-400">
                Click any item to open
              </span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
