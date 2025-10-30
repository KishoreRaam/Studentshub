// Custom hook for managing saved items (perks, resources, AI tools)
// Provides save/unsave functionality with Appwrite integration

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  savePerk,
  unsavePerk,
  saveResource,
  unsaveResource,
  saveAITool,
  unsaveAITool,
  getSavedPerks,
  getSavedResources,
  getSavedAITools,
  PerkData,
} from '@/services/saved-items.service';
import {
  saveEvent,
  unsaveEvent,
  getSavedEvents,
  EventData,
} from '@/services/saved-events.service';
import { toast } from 'sonner';

type ItemType = 'perk' | 'resource' | 'aiTool' | 'event';

interface SavedItem {
  id: string;
  savedId: string; // The saved_* collection document ID
}

export function useSavedItems(itemType: ItemType) {
  const { user } = useAuth();
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingStates, setSavingStates] = useState<Record<string, boolean>>({});

  // Load saved items on mount
  useEffect(() => {
    const loadSavedItems = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userId = user.$id;
        let items: any[] = [];

        switch (itemType) {
          case 'perk':
            items = await getSavedPerks(userId);
            break;
          case 'resource':
            items = await getSavedResources(userId);
            break;
          case 'aiTool':
            items = await getSavedAITools(userId);
            break;
          case 'event':
            items = await getSavedEvents(userId);
            break;
        }

        // Extract IDs and savedIds
        setSavedItems(items.map(item => ({
          id: item.id,
          savedId: item.savedId,
        })));
      } catch (error) {
        console.error('Error loading saved items:', error);
        // Don't show error toast on initial load - just log it
      } finally {
        setLoading(false);
      }
    };

    loadSavedItems();
  }, [user, itemType]);

  // Check if an item is saved
  const isSaved = useCallback((itemId: string) => {
    return savedItems.some(item => item.id === itemId);
  }, [savedItems]);

  // Get saved item (includes savedId for unsaving)
  const getSavedItem = useCallback((itemId: string) => {
    return savedItems.find(item => item.id === itemId);
  }, [savedItems]);

  // Check if an item is currently being saved/unsaved
  const isSaving = useCallback((itemId: string) => {
    return savingStates[itemId] || false;
  }, [savingStates]);

  // Save an item (accepts full item data for perks and events)
  const saveItem = useCallback(async (itemIdOrData: string | PerkData | EventData) => {
    if (!user) {
      toast.error('Please sign in to save items');
      return false;
    }

    // Get the item ID from either a string or the data object
    const itemId = typeof itemIdOrData === 'string' ? itemIdOrData : itemIdOrData.id;

    if (isSaved(itemId)) {
      console.log('Item already saved locally, skipping');
      return true; // Already saved
    }

    // Set saving state
    setSavingStates(prev => ({ ...prev, [itemId]: true }));

    try {
      const userId = user.$id;
      let response;

      switch (itemType) {
        case 'perk':
          // For perks, pass full data if available, otherwise just ID (backward compatibility)
          if (typeof itemIdOrData === 'object') {
            response = await savePerk(userId, itemIdOrData as PerkData);
          } else {
            // Fallback for backward compatibility - convert string ID to minimal PerkData
            response = await savePerk(userId, {
              id: itemIdOrData,
              title: 'Unknown Perk',
              category: 'Other',
              description: '',
            });
          }
          break;
        case 'event':
          // For events, pass full data if available
          if (typeof itemIdOrData === 'object') {
            response = await saveEvent(userId, itemIdOrData as EventData);
          } else {
            // Fallback - convert string ID to minimal EventData
            response = await saveEvent(userId, {
              id: itemIdOrData,
              title: 'Unknown Event',
              category: 'Webinar',
              description: '',
              date: new Date().toISOString(),
              time: '',
            });
          }
          break;
        case 'resource':
          response = await saveResource(userId, itemId);
          break;
        case 'aiTool':
          response = await saveAITool(userId, itemId);
          break;
      }

      // Check if already in saved items (might have been added during save)
      const alreadyInState = savedItems.some(item => item.id === itemId);
      if (!alreadyInState) {
        // Add to saved items
        setSavedItems(prev => [...prev, { id: itemId, savedId: response.$id }]);
      } else {
        console.log('Item already in local state, updating savedId if needed');
        setSavedItems(prev => prev.map(item =>
          item.id === itemId ? { ...item, savedId: response.$id } : item
        ));
      }

      // Show success toast
      const itemTypeLabel = itemType === 'aiTool' ? 'AI tool' : itemType === 'event' ? 'Event' : itemType;
      toast.success(`${itemTypeLabel.charAt(0).toUpperCase() + itemTypeLabel.slice(1)} saved!`, {
        description: 'You can find it in your dashboard',
      });

      return true;
    } catch (error: any) {
      console.error('Error saving item:', error);

      // Don't show error toast for duplicate documents - it means item was already saved
      if (error.code === 409 || error.message?.includes('already exists')) {
        console.log('Item already exists in database, treating as success');
        // Reload saved items to get the correct state
        const userId = user.$id;
        try {
          let items: any[] = [];
          switch (itemType) {
            case 'perk':
              items = await getSavedPerks(userId);
              break;
            case 'resource':
              items = await getSavedResources(userId);
              break;
            case 'aiTool':
              items = await getSavedAITools(userId);
              break;
            case 'event':
              items = await getSavedEvents(userId);
              break;
          }
          setSavedItems(items.map(item => ({
            id: item.id,
            savedId: item.savedId,
          })));
        } catch (reloadError) {
          console.error('Error reloading saved items:', reloadError);
        }
        return true;
      }

      toast.error('Failed to save', {
        description: error.message || 'Please try again later',
      });
      return false;
    } finally {
      setSavingStates(prev => ({ ...prev, [itemId]: false }));
    }
  }, [user, itemType, isSaved, savedItems]);

  // Unsave an item
  const unsaveItem = useCallback(async (itemId: string) => {
    if (!user) {
      toast.error('Please sign in');
      return false;
    }

    const savedItem = getSavedItem(itemId);
    if (!savedItem) {
      return true; // Not saved
    }

    // Set saving state
    setSavingStates(prev => ({ ...prev, [itemId]: true }));

    try {
      switch (itemType) {
        case 'perk':
          await unsavePerk(savedItem.savedId);
          break;
        case 'event':
          await unsaveEvent(savedItem.savedId);
          break;
        case 'resource':
          await unsaveResource(savedItem.savedId);
          break;
        case 'aiTool':
          await unsaveAITool(savedItem.savedId);
          break;
      }

      // Remove from saved items
      setSavedItems(prev => prev.filter(item => item.id !== itemId));

      // Show success toast
      const itemTypeLabel = itemType === 'aiTool' ? 'AI tool' : itemType === 'event' ? 'Event' : itemType;
      toast.success(`${itemTypeLabel.charAt(0).toUpperCase() + itemTypeLabel.slice(1)} removed`, {
        description: 'Removed from your dashboard',
      });

      return true;
    } catch (error: any) {
      console.error('Error unsaving item:', error);
      toast.error('Failed to remove', {
        description: error.message || 'Please try again later',
      });
      return false;
    } finally {
      setSavingStates(prev => ({ ...prev, [itemId]: false }));
    }
  }, [user, itemType, getSavedItem]);

  // Toggle save state (accepts either item ID or full item data for perks and events)
  const toggleSave = useCallback(async (itemIdOrData: string | PerkData | EventData) => {
    const itemId = typeof itemIdOrData === 'string' ? itemIdOrData : itemIdOrData.id;

    if (isSaved(itemId)) {
      return await unsaveItem(itemId);
    } else {
      return await saveItem(itemIdOrData);
    }
  }, [isSaved, saveItem, unsaveItem]);

  return {
    savedItems,
    loading,
    isSaved,
    isSaving,
    saveItem,
    unsaveItem,
    toggleSave,
  };
}
