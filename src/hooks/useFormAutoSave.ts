import { useEffect, useRef, useCallback } from 'react';
import { UseFormWatch } from 'react-hook-form';

interface UseFormAutoSaveOptions<T> {
  watch: UseFormWatch<T>;
  storageKey: string;
  debounceMs?: number;
  onSave?: (data: T) => void;
}

/**
 * Custom hook for auto-saving form data to localStorage
 * Implements debouncing to avoid excessive saves
 */
export function useFormAutoSave<T extends Record<string, any>>({
  watch,
  storageKey,
  debounceMs = 2000, // Default: save every 2 seconds after last change
  onSave,
}: UseFormAutoSaveOptions<T>) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>('');

  const saveToLocalStorage = useCallback(
    (data: T) => {
      try {
        const serialized = JSON.stringify({
          data,
          savedAt: new Date().toISOString(),
        });

        // Only save if data has changed
        if (serialized !== lastSavedRef.current) {
          localStorage.setItem(storageKey, serialized);
          lastSavedRef.current = serialized;
          onSave?.(data);
          console.log('[AutoSave] Form data saved to localStorage');
        }
      } catch (error) {
        console.error('[AutoSave] Failed to save form data:', error);
      }
    },
    [storageKey, onSave]
  );

  useEffect(() => {
    const subscription = watch((data) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout for debounced save
      timeoutRef.current = setTimeout(() => {
        saveToLocalStorage(data as T);
      }, debounceMs);
    });

    // Cleanup function
    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [watch, saveToLocalStorage, debounceMs]);

  return {
    clearDraft: useCallback(() => {
      try {
        localStorage.removeItem(storageKey);
        lastSavedRef.current = '';
        console.log('[AutoSave] Draft cleared from localStorage');
      } catch (error) {
        console.error('[AutoSave] Failed to clear draft:', error);
      }
    }, [storageKey]),
  };
}

/**
 * Load saved form draft from localStorage
 */
export function loadFormDraft<T>(storageKey: string): { data: Partial<T>; savedAt: string } | null {
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return null;

    const parsed = JSON.parse(saved);

    // Validate the saved data structure
    if (parsed && typeof parsed === 'object' && 'data' in parsed && 'savedAt' in parsed) {
      return parsed;
    }

    return null;
  } catch (error) {
    console.error('[AutoSave] Failed to load draft:', error);
    return null;
  }
}

/**
 * Check if a draft exists and is recent (within last 7 days)
 */
export function hasDraft(storageKey: string, maxAgeDays = 7): boolean {
  const draft = loadFormDraft(storageKey);
  if (!draft) return false;

  const savedDate = new Date(draft.savedAt);
  const now = new Date();
  const daysDiff = (now.getTime() - savedDate.getTime()) / (1000 * 60 * 60 * 24);

  return daysDiff <= maxAgeDays;
}

/**
 * Format the saved date for display
 */
export function formatSavedDate(savedAt: string): string {
  const date = new Date(savedAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
