// useSavedItems.js
// Production-ready hooks for managing saved perks, resources, and AI tools
// Uses Appwrite JS SDK with proper authentication and error handling

import { useState, useEffect, useCallback } from 'react';
import { account, databases, databaseId, COLLECTIONS, AppwriteID } from '../lib/appwrite';
import { Query, Permission, Role } from 'appwrite';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Ensure compatibility: re-export the TS hook so consumers importing
// from useSavedItems.js can access `useSavedItems` as expected.
// This avoids changing other pages while keeping a single source of truth.
export { useSavedItems } from './useSavedItems.ts';

/**
 * Helper function to get the current authenticated user
 * Redirects to login if session is invalid (401 error)
 */
async function getCurrentUser(navigate) {
  try {
    const user = await account.get();
    return user;
  } catch (error) {
    if (error.code === 401) {
      console.error('Session invalid, redirecting to login...');
      toast.error('Please log in to continue');
      navigate('/login');
      return null;
    }
    throw error;
  }
}

/**
 * Get collection name based on type
 */
function getCollectionByType(type) {
  const collections = {
    perk: COLLECTIONS.SAVED_PERKS,
    resource: COLLECTIONS.SAVED_RESOURCES,
    aiTool: COLLECTIONS.SAVED_AI_TOOLS,
  };
  return collections[type];
}

/**
 * Get item ID field name based on type
 */
function getItemIdField(type) {
  const fields = {
    perk: 'perkID',
    resource: 'resourceID',
    aiTool: 'aiToolID',
  };
  return fields[type];
}

// ====== CORE SAVE/UNSAVE FUNCTIONS ======

/**
 * Save an item (perk, resource, or AI tool) for the current user
 * @param {string} userId - Current user ID
 * @param {string} itemId - ID of the item to save
 * @param {object} itemData - Full data of the item
 * @param {string} type - Type: 'perk', 'resource', or 'aiTool'
 * @returns {Promise<object>} Created document
 */
async function saveItem(userId, itemId, itemData, type) {
  const collection = getCollectionByType(type);
  const itemIdField = getItemIdField(type);

  try {
    // Check if already saved to avoid duplicates
    const existing = await databases.listDocuments(
      databaseId,
      collection,
      [
        Query.equal('userID', userId),
        Query.equal(itemIdField, itemId)
      ]
    );

    if (existing.documents.length > 0) {
      console.log(`${type} already saved, returning existing:`, existing.documents[0].$id);
      return existing.documents[0];
    }

    // Prepare document data based on type
    let documentData = {
      userID: userId,
      [itemIdField]: itemId,
    };

    // Add type-specific fields
    if (type === 'perk') {
      documentData = {
        ...documentData,
        title: itemData.title || '',
        category: itemData.category || '',
        description: itemData.description || '',
        website: itemData.website || '',
        logo: itemData.logo || '',
        color: itemData.color || '#3B82F6',
        discount: itemData.discount || '',
        validUntil: itemData.validUntil || '',
        claimLink: itemData.claimLink || '',
        claimed: false,
        claimedDate: null,
      };
    } else if (type === 'resource') {
      documentData = {
        ...documentData,
        title: itemData.title || '',
        category: itemData.category || '',
        description: itemData.description || '',
        link: itemData.link || '',
        type: itemData.type || '',
        provider: itemData.provider || '',
      };
    } else if (type === 'aiTool') {
      documentData = {
        ...documentData,
        title: itemData.title || '',
        category: itemData.category || '',
        description: itemData.description || '',
        link: itemData.link || '',
        pricing: itemData.pricing || '',
        logo: itemData.logo || '',
      };
    }

    // Create document with user-specific permissions
    const response = await databases.createDocument(
      databaseId,
      collection,
      AppwriteID.unique(),
      documentData,
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    );

    console.log(`Successfully saved ${type}:`, response.$id);
    return response;
  } catch (error) {
    // Handle race condition (document already exists)
    if (error.code === 409 || error.message?.includes('already exists')) {
      console.log(`Race condition: ${type} already exists, fetching...`);
      const existing = await databases.listDocuments(
        databaseId,
        collection,
        [
          Query.equal('userID', userId),
          Query.equal(itemIdField, itemId)
        ]
      );
      if (existing.documents.length > 0) {
        return existing.documents[0];
      }
    }

    // Handle 401 authentication errors
    if (error.code === 401) {
      throw new Error('UNAUTHORIZED');
    }

    console.error(`Error saving ${type}:`, error);
    throw error;
  }
}

/**
 * Unsave an item by deleting its saved document
 * @param {string} userId - Current user ID
 * @param {string} itemId - ID of the item to unsave
 * @param {string} type - Type: 'perk', 'resource', or 'aiTool'
 */
async function unsaveItem(userId, itemId, type) {
  const collection = getCollectionByType(type);
  const itemIdField = getItemIdField(type);

  try {
    // Find the saved document
    const saved = await databases.listDocuments(
      databaseId,
      collection,
      [
        Query.equal('userID', userId),
        Query.equal(itemIdField, itemId)
      ]
    );

    if (saved.documents.length === 0) {
      console.log(`${type} not found in saved items`);
      return;
    }

    // Delete the document
    await databases.deleteDocument(
      databaseId,
      collection,
      saved.documents[0].$id
    );

    console.log(`Successfully unsaved ${type}:`, itemId);
  } catch (error) {
    // Handle 401 authentication errors
    if (error.code === 401) {
      throw new Error('UNAUTHORIZED');
    }

    console.error(`Error unsaving ${type}:`, error);
    throw error;
  }
}

/**
 * Check if an item is saved for the current user
 * @param {string} userId - Current user ID
 * @param {string} itemId - ID of the item to check
 * @param {string} type - Type: 'perk', 'resource', or 'aiTool'
 * @returns {Promise<boolean>} True if saved, false otherwise
 */
async function getSavedStatus(userId, itemId, type) {
  const collection = getCollectionByType(type);
  const itemIdField = getItemIdField(type);

  try {
    const saved = await databases.listDocuments(
      databaseId,
      collection,
      [
        Query.equal('userID', userId),
        Query.equal(itemIdField, itemId)
      ]
    );

    return saved.documents.length > 0;
  } catch (error) {
    console.error(`Error checking saved status for ${type}:`, error);
    return false;
  }
}

/**
 * Get count of saved items for a specific type
 * @param {string} userId - Current user ID
 * @param {string} type - Type: 'perk', 'resource', or 'aiTool'
 * @returns {Promise<number>} Count of saved items
 */
async function getSavedItemsCount(userId, type) {
  const collection = getCollectionByType(type);

  try {
    const saved = await databases.listDocuments(
      databaseId,
      collection,
      [Query.equal('userID', userId)]
    );

    return saved.documents.length;
  } catch (error) {
    console.error(`Error getting saved ${type} count:`, error);
    return 0;
  }
}

// ====== REACT HOOKS ======

/**
 * Hook for saving/unsaving perks
 * @returns {object} savePerk, unsavePerk, isSaving, error
 */
export function useSavePerk() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const savePerk = useCallback(async (perkId, perkData) => {
    setIsSaving(true);
    setError(null);

    try {
      const user = await getCurrentUser(navigate);
      if (!user) return null;

      const result = await saveItem(user.$id, perkId, perkData, 'perk');
      toast.success('Perk saved successfully!');
      return result;
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        navigate('/login');
        return null;
      }
      setError(err.message);
      toast.error('Failed to save perk');
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [navigate]);

  const unsavePerk = useCallback(async (perkId) => {
    setIsSaving(true);
    setError(null);

    try {
      const user = await getCurrentUser(navigate);
      if (!user) return;

      await unsaveItem(user.$id, perkId, 'perk');
      toast.success('Perk removed from saved items');
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        navigate('/login');
        return;
      }
      setError(err.message);
      toast.error('Failed to unsave perk');
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [navigate]);

  return { savePerk, unsavePerk, isSaving, error };
}

/**
 * Hook for saving/unsaving resources
 * @returns {object} saveResource, unsaveResource, isSaving, error
 */
export function useSaveResource() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const saveResource = useCallback(async (resourceId, resourceData) => {
    setIsSaving(true);
    setError(null);

    try {
      const user = await getCurrentUser(navigate);
      if (!user) return null;

      const result = await saveItem(user.$id, resourceId, resourceData, 'resource');
      toast.success('Resource saved successfully!');
      return result;
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        navigate('/login');
        return null;
      }
      setError(err.message);
      toast.error('Failed to save resource');
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [navigate]);

  const unsaveResource = useCallback(async (resourceId) => {
    setIsSaving(true);
    setError(null);

    try {
      const user = await getCurrentUser(navigate);
      if (!user) return;

      await unsaveItem(user.$id, resourceId, 'resource');
      toast.success('Resource removed from saved items');
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        navigate('/login');
        return;
      }
      setError(err.message);
      toast.error('Failed to unsave resource');
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [navigate]);

  return { saveResource, unsaveResource, isSaving, error };
}

/**
 * Hook for saving/unsaving AI tools
 * @returns {object} saveAITool, unsaveAITool, isSaving, error
 */
export function useSaveAITool() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const saveAITool = useCallback(async (aiToolId, aiToolData) => {
    setIsSaving(true);
    setError(null);

    try {
      const user = await getCurrentUser(navigate);
      if (!user) return null;

      const result = await saveItem(user.$id, aiToolId, aiToolData, 'aiTool');
      toast.success('AI Tool saved successfully!');
      return result;
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        navigate('/login');
        return null;
      }
      setError(err.message);
      toast.error('Failed to save AI tool');
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [navigate]);

  const unsaveAITool = useCallback(async (aiToolId) => {
    setIsSaving(true);
    setError(null);

    try {
      const user = await getCurrentUser(navigate);
      if (!user) return;

      await unsaveItem(user.$id, aiToolId, 'aiTool');
      toast.success('AI Tool removed from saved items');
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        navigate('/login');
        return;
      }
      setError(err.message);
      toast.error('Failed to unsave AI tool');
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [navigate]);

  return { saveAITool, unsaveAITool, isSaving, error };
}

/**
 * Universal toggle save hook - works with any item type
 * @param {string} type - 'perk', 'resource', or 'aiTool'
 * @returns {object} toggleSave, isSaved, isLoading, error
 */
export function useToggleSave(itemId, type) {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check initial saved status
  useEffect(() => {
    async function checkStatus() {
      try {
        const user = await getCurrentUser(navigate);
        if (!user) {
          setIsLoading(false);
          return;
        }

        const status = await getSavedStatus(user.$id, itemId, type);
        setIsSaved(status);
      } catch (err) {
        console.error('Error checking saved status:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (itemId) {
      checkStatus();
    }
  }, [itemId, type, navigate]);

  const toggleSave = useCallback(async (itemData) => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await getCurrentUser(navigate);
      if (!user) return;

      if (isSaved) {
        // Unsave the item
        await unsaveItem(user.$id, itemId, type);
        setIsSaved(false);
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} removed from saved items`);
      } else {
        // Save the item
        await saveItem(user.$id, itemId, itemData, type);
        setIsSaved(true);
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} saved successfully!`);
      }
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        navigate('/login');
        return;
      }
      setError(err.message);
      toast.error(`Failed to ${isSaved ? 'unsave' : 'save'} ${type}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [itemId, type, isSaved, navigate]);

  return { toggleSave, isSaved, isLoading, error };
}

/**
 * Hook to get counts of all saved items
 * @returns {object} counts, isLoading, refresh
 */
export function useSavedCounts() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    perks: 0,
    resources: 0,
    aiTools: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const user = await getCurrentUser(navigate);
      if (!user) {
        setIsLoading(false);
        return;
      }

      const [perks, resources, aiTools] = await Promise.all([
        getSavedItemsCount(user.$id, 'perk'),
        getSavedItemsCount(user.$id, 'resource'),
        getSavedItemsCount(user.$id, 'aiTool'),
      ]);

      setCounts({
        perks,
        resources,
        aiTools,
        total: perks + resources + aiTools,
      });
    } catch (err) {
      console.error('Error fetching saved counts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { counts, isLoading, refresh };
}

// Export helper functions for direct use
export { getSavedStatus, getSavedItemsCount };
