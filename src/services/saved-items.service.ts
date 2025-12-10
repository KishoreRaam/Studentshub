// Service for managing saved perks, resources, and AI tools
// Uses client-side Appwrite SDK with user session

import { databases, databaseId, COLLECTIONS, AppwriteID } from '../lib/appwrite';
import { Query, Permission, Role } from 'appwrite';

// ====== SAVED PERKS ======

// Get all saved perks for a user - returns data directly from SAVED_PERKS
export async function getSavedPerks(userId: string) {
  try {
    // Get all saved perk records for this user with full perk data
    const savedPerksResponse = await databases.listDocuments(
      databaseId,
      COLLECTIONS.SAVED_PERKS,
      [Query.equal('userID', userId)]
    );

    if (savedPerksResponse.documents.length === 0) {
      return [];
    }

    // Return saved perks with all their stored data
    return savedPerksResponse.documents.map(savedPerk => ({
      id: savedPerk.perkID,
      title: savedPerk.title || '',
      category: savedPerk.category || '',
      icon: savedPerk.logo || '💎',
      validity: savedPerk.validUntil || '',
      description: savedPerk.description || '',
      website: savedPerk.website || '',
      logo: savedPerk.logo || '',
      color: savedPerk.color || '#3B82F6',
      discount: savedPerk.discount || '',
      claimLink: savedPerk.claimLink || '',
      isSaved: true,
      claimed: savedPerk.claimed || false,
      claimedDate: savedPerk.claimedDate || null,
      savedId: savedPerk.$id, // Keep track of the saved_perks document ID
    }));
  } catch (error) {
    console.error('Error getting saved perks:', error);
    throw error;
  }
}

// Define the Perk type for saving
export interface PerkData {
  id: string;
  title: string;
  category: string;
  description: string;
  website?: string;
  logo?: string;
  color?: string;
  discount?: string;
  validUntil?: string;
  claimLink?: string;
}

// Save a perk for a user with full perk data
export async function savePerk(userId: string, perkData: PerkData) {
  try {
    // First, always check if already saved to avoid duplicate errors
    const existing = await databases.listDocuments(
      databaseId,
      COLLECTIONS.SAVED_PERKS,
      [
        Query.equal('userID', userId),
        Query.equal('perkID', perkData.id)
      ]
    );

    if (existing.documents.length > 0) {
      console.log('Perk already saved, returning existing:', existing.documents[0].$id);
      return existing.documents[0];
    }

    // Create new saved perk record with full perk data
    // Permissions handled by collection-level settings
    const response = await databases.createDocument(
      databaseId,
      COLLECTIONS.SAVED_PERKS,
      AppwriteID.unique(),
      {
        userID: userId,
        perkID: perkData.id,
        title: perkData.title,
        category: perkData.category,
        description: perkData.description,
        website: perkData.website || '',
        logo: perkData.logo || '',
        color: perkData.color || '#3B82F6',
        discount: perkData.discount || '',
        validUntil: perkData.validUntil || '',
        claimLink: perkData.claimLink || '',
        claimed: false,
        claimedDate: null,
      }
    );

    console.log('Successfully saved perk:', response.$id);
    return response;
  } catch (error: any) {
    // If document already exists (race condition), fetch and return it
    if (error.code === 409 || error.message?.includes('already exists') || error.message?.includes('Document with the requested ID already exists')) {
      console.log('Race condition detected: Document already exists, fetching existing document...');
      try {
        const existing = await databases.listDocuments(
          databaseId,
          COLLECTIONS.SAVED_PERKS,
          [
            Query.equal('userID', userId),
            Query.equal('perkID', perkData.id)
          ]
        );
        if (existing.documents.length > 0) {
          console.log('Successfully fetched existing perk:', existing.documents[0].$id);
          return existing.documents[0];
        }
      } catch (fetchError) {
        console.error('Error fetching existing document:', fetchError);
      }
    }
    console.error('Error saving perk:', error);
    throw error;
  }
}

// Unsave a perk
export async function unsavePerk(savedPerkId: string) {
  try {
    await databases.deleteDocument(
      databaseId,
      COLLECTIONS.SAVED_PERKS,
      savedPerkId
    );
  } catch (error) {
    console.error('Error unsaving perk:', error);
    throw error;
  }
}

// Mark a perk as claimed
export async function claimPerk(savedPerkId: string) {
  try {
    const response = await databases.updateDocument(
      databaseId,
      COLLECTIONS.SAVED_PERKS,
      savedPerkId,
      {
        claimed: true,
        claimedDate: new Date().toISOString(),
      }
    );
    return response;
  } catch (error) {
    console.error('Error claiming perk:', error);
    throw error;
  }
}

// ====== SAVED RESOURCES ======

// Define the Resource type for saving
export interface ResourceData {
  id: string;
  provider: string;
  title: string;
  category: string;
  description: string;
  discountOfferINR?: string;
  validity?: string;
  verificationMethod?: string;
  claimLink?: string;
  badge?: string;
}

// Get all saved resources for a user - returns data directly from SAVED_RESOURCES
export async function getSavedResources(userId: string) {
  try {
    // Get all saved resource records for this user with full resource data
    const savedResourcesResponse = await databases.listDocuments(
      databaseId,
      COLLECTIONS.SAVED_RESOURCES,
      [Query.equal('userID', userId)]
    );

    if (savedResourcesResponse.documents.length === 0) {
      return [];
    }

    // Return saved resources with all their stored data
    return savedResourcesResponse.documents.map(savedResource => ({
      id: savedResource.resourceID,
      provider: savedResource.provider || '',
      title: savedResource.title || '',
      category: savedResource.category || '',
      description: savedResource.description || '',
      discountOfferINR: savedResource.discountOfferINR || '',
      validity: savedResource.validity || '',
      verificationMethod: savedResource.verificationMethod || '',
      claimLink: savedResource.claimLink || '',
      badge: savedResource.badge || '',
      isSaved: true,
      savedId: savedResource.$id, // Keep track of the saved_resources document ID
    }));
  } catch (error) {
    console.error('Error getting saved resources:', error);
    throw error;
  }
}

// Save a resource for a user with full resource data
export async function saveResource(userId: string, resourceData: ResourceData) {
  try {
    // First, always check if already saved to avoid duplicate errors
    const existing = await databases.listDocuments(
      databaseId,
      COLLECTIONS.SAVED_RESOURCES,
      [
        Query.equal('userID', userId),
        Query.equal('resourceID', resourceData.id)
      ]
    );

    if (existing.documents.length > 0) {
      console.log('Resource already saved, returning existing:', existing.documents[0].$id);
      return existing.documents[0];
    }

    // Create new saved resource record with full resource data
    // Permissions handled by collection-level settings
    const response = await databases.createDocument(
      databaseId,
      COLLECTIONS.SAVED_RESOURCES,
      AppwriteID.unique(),
      {
        userID: userId,
        resourceID: resourceData.id,
        provider: resourceData.provider,
        title: resourceData.title,
        category: resourceData.category,
        description: resourceData.description,
        discountOfferINR: resourceData.discountOfferINR || '',
        validity: resourceData.validity || '',
        verificationMethod: resourceData.verificationMethod || '',
        claimLink: resourceData.claimLink || '',
        badge: resourceData.badge || '',
      }
    );

    console.log('Successfully saved resource:', response.$id);
    return response;
  } catch (error: any) {
    // If document already exists (race condition), fetch and return it
    if (error.code === 409 || error.message?.includes('already exists') || error.message?.includes('Document with the requested ID already exists')) {
      console.log('Race condition detected: Document already exists, fetching existing document...');
      try {
        const existing = await databases.listDocuments(
          databaseId,
          COLLECTIONS.SAVED_RESOURCES,
          [
            Query.equal('userID', userId),
            Query.equal('resourceID', resourceData.id)
          ]
        );
        if (existing.documents.length > 0) {
          console.log('Successfully fetched existing resource:', existing.documents[0].$id);
          return existing.documents[0];
        }
      } catch (fetchError) {
        console.error('Error fetching existing document:', fetchError);
      }
    }
    console.error('Error saving resource:', error);
    throw error;
  }
}

// Unsave a resource
export async function unsaveResource(savedResourceId: string) {
  try {
    await databases.deleteDocument(
      databaseId,
      COLLECTIONS.SAVED_RESOURCES,
      savedResourceId
    );
  } catch (error) {
    console.error('Error unsaving resource:', error);
    throw error;
  }
}

// ====== SAVED AI TOOLS ======

// Define the AI Tool type for saving
export interface AIToolData {
  id: string;
  name: string;
  description: string;
  logo: string;
  logo_url?: string;
  logo_source?: string;
  category: string[];
  pricing: string;
  features: string[];
  link: string;
  isOpenSource?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  requiresVerification?: boolean;
}

// Get all saved AI tools for a user - returns data directly from SAVED_AI_TOOLS
export async function getSavedAITools(userId: string) {
  try {
    // Get all saved AI tool records for this user with full tool data
    const savedAIToolsResponse = await databases.listDocuments(
      databaseId,
      COLLECTIONS.SAVED_AI_TOOLS,
      [Query.equal('userID', userId)]
    );

    if (savedAIToolsResponse.documents.length === 0) {
      return [];
    }

    // Return saved AI tools with all their stored data
    return savedAIToolsResponse.documents.map(savedTool => ({
      id: savedTool.toolID,
      name: savedTool.name || '',
      description: savedTool.description || '',
      logo: savedTool.logo || '',
      logo_url: savedTool.logo_url || '',
      logo_source: savedTool.logo_source || '',
      category: savedTool.category ? (typeof savedTool.category === 'string' ? JSON.parse(savedTool.category) : savedTool.category) : [],
      pricing: savedTool.pricing || 'Free',
      features: savedTool.features ? (typeof savedTool.features === 'string' ? JSON.parse(savedTool.features) : savedTool.features) : [],
      link: savedTool.link || '',
      isOpenSource: savedTool.isOpenSource || false,
      isPopular: savedTool.isPopular || false,
      isNew: savedTool.isNew || false,
      requiresVerification: savedTool.requiresVerification || false,
      isSaved: true,
      savedId: savedTool.$id, // Keep track of the saved_ai_tools document ID
    }));
  } catch (error) {
    console.error('Error getting saved AI tools:', error);
    throw error;
  }
}

// Save an AI tool for a user with full tool data
export async function saveAITool(userId: string, toolData: AIToolData) {
  try {
    console.log('[saveAITool] Attempting save', { userId, toolId: toolData.id });
    // First, check if already saved - if so, delete it first (toggle behavior)
    const existing = await databases.listDocuments(
      databaseId,
      COLLECTIONS.SAVED_AI_TOOLS,
      [
        Query.equal('userID', userId),
        Query.equal('toolID', toolData.id)
      ]
    );

    if (existing.documents.length > 0) {
      console.log('[saveAITool] AI tool already exists, deleting before re-save:', existing.documents[0].$id);
      // Delete the existing document first
      await databases.deleteDocument(
        databaseId,
        COLLECTIONS.SAVED_AI_TOOLS,
        existing.documents[0].$id
      );
      console.log('[saveAITool] Deleted existing document, proceeding with fresh save');
    }

    // Create new saved AI tool record with full tool data
    // Permissions handled by collection-level settings
    const response = await databases.createDocument(
      databaseId,
      COLLECTIONS.SAVED_AI_TOOLS,
      AppwriteID.unique(),
      {
        userID: userId,
        toolID: toolData.id,
        name: toolData.name,
        description: toolData.description,
        logo: toolData.logo,
        logo_url: toolData.logo_url || '',
        logo_source: toolData.logo_source || '',
        category: JSON.stringify(toolData.category),
        pricing: toolData.pricing,
        features: JSON.stringify(toolData.features),
        link: toolData.link,
        isOpenSource: toolData.isOpenSource || false,
        isPopular: toolData.isPopular || false,
        isNew: toolData.isNew || false,
        requiresVerification: toolData.requiresVerification || false,
      }
    );

    console.log('[saveAITool] Successfully saved AI tool:', response.$id);
    return response;
  } catch (error: any) {
    // If document already exists (race condition), fetch and return it
    if (error.code === 409 || error.message?.includes('already exists') || error.message?.includes('Document with the requested ID already exists')) {
      console.warn('[saveAITool] 409 conflict: document exists. Fetching existing...');
      try {
        const existing = await databases.listDocuments(
          databaseId,
          COLLECTIONS.SAVED_AI_TOOLS,
          [
            Query.equal('userID', userId),
            Query.equal('toolID', toolData.id)
          ]
        );
        if (existing.documents.length === 0) {
          const existingByUser = await databases.listDocuments(
            databaseId,
            COLLECTIONS.SAVED_AI_TOOLS,
            [Query.equal('userID', userId)]
          );
          console.warn('[saveAITool] No doc found by user+tool after 409.', {
            docsForUser: existingByUser.documents.length,
            toolIdAttempted: toolData.id,
            existingToolIds: existingByUser.documents.map(doc => doc.toolID),
            rawDocs: existingByUser.documents
          });
        }
        if (existing.documents.length > 0) {
          console.log('[saveAITool] Fetched existing AI tool:', existing.documents[0].$id);
          return existing.documents[0];
        }
      } catch (fetchError) {
        console.error('[saveAITool] Error fetching existing document:', fetchError);
      }
    }
    console.error('[saveAITool] Error saving AI tool:', error);
    throw error;
  }
}

// Unsave an AI tool
export async function unsaveAITool(savedToolId: string) {
  try {
    await databases.deleteDocument(
      databaseId,
      COLLECTIONS.SAVED_AI_TOOLS,
      savedToolId
    );
    console.log('[unsaveAITool] Deleted saved AI tool document:', savedToolId);
  } catch (error) {
    console.error('[unsaveAITool] Error unsaving AI tool:', error);
    throw error;
  }
}
