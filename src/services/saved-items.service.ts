// Service for managing saved perks, resources, and AI tools
// Uses client-side Appwrite SDK with user session

import { databases, databaseId, COLLECTIONS, AppwriteID } from '../lib/appwrite';
import { Query, Permission, Role } from 'appwrite';

// ====== SAVED PERKS ======

// Get all saved perks for a user with full perk details
export async function getSavedPerks(userId: string) {
  try {
    // First, get all saved perk records for this user
    const savedPerksResponse = await databases.listDocuments(
      databaseId,
      COLLECTIONS.SAVED_PERKS,
      [Query.equal('userID', userId)]
    );

    if (savedPerksResponse.documents.length === 0) {
      return [];
    }

    // Extract perk IDs
    const perkIds = savedPerksResponse.documents.map(doc => doc.perkID);

    // Fetch full perk details
    const perksResponse = await databases.listDocuments(
      databaseId,
      COLLECTIONS.PERKS,
      [
        Query.equal('$id', perkIds),
        Query.equal('isActive', true)
      ]
    );

    // Combine saved perk data with full perk details
    return savedPerksResponse.documents.map(savedPerk => {
      const perk = perksResponse.documents.find(p => p.$id === savedPerk.perkID);
      if (!perk) return null;

      return {
        id: perk.$id,
        title: perk.title || '',
        category: perk.category || '',
        icon: perk.icon || '💎',
        validity: perk.validity || '',
        description: perk.description || '',
        isSaved: true,
        claimed: savedPerk.claimed || false,
        claimedDate: savedPerk.claimedDate || null,
        savedId: savedPerk.$id, // Keep track of the saved_perks document ID
      };
    }).filter(Boolean);
  } catch (error) {
    console.error('Error getting saved perks:', error);
    throw error;
  }
}

// Save a perk for a user
export async function savePerk(userId: string, perkId: string) {
  try {
    // Check if already saved
    try {
      const existing = await databases.listDocuments(
        databaseId,
        COLLECTIONS.SAVED_PERKS,
        [
          Query.equal('userID', userId),
          Query.equal('perkID', perkId)
        ]
      );

      if (existing.documents.length > 0) {
        console.log('Perk already saved, returning existing:', existing.documents[0].$id);
        return existing.documents[0]; // Already saved
      }
    } catch (queryError) {
      console.warn('Error checking for existing perk, proceeding with save:', queryError);
      // Continue to create - might be a permission issue with query
    }

    // Create new saved perk record
    const response = await databases.createDocument(
      databaseId,
      COLLECTIONS.SAVED_PERKS,
      AppwriteID.unique(),
      {
        userID: userId,
        perkID: perkId,
        claimed: false,
        claimedDate: null,
      },
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    );

    return response;
  } catch (error: any) {
    // If document already exists, try to fetch and return it
    if (error.code === 409 || error.message?.includes('already exists')) {
      console.log('Document already exists, fetching existing document...');
      try {
        const existing = await databases.listDocuments(
          databaseId,
          COLLECTIONS.SAVED_PERKS,
          [
            Query.equal('userID', userId),
            Query.equal('perkID', perkId)
          ]
        );
        if (existing.documents.length > 0) {
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

// Get all saved resources for a user
export async function getSavedResources(userId: string) {
  try {
    // Get all saved resource records
    const savedResourcesResponse = await databases.listDocuments(
      databaseId,
      COLLECTIONS.SAVED_RESOURCES,
      [Query.equal('userID', userId)]
    );

    if (savedResourcesResponse.documents.length === 0) {
      return [];
    }

    // Extract resource IDs
    const resourceIds = savedResourcesResponse.documents.map(doc => doc.resourceID);

    // Fetch full resource details
    const resourcesResponse = await databases.listDocuments(
      databaseId,
      COLLECTIONS.RESOURCES,
      [
        Query.equal('$id', resourceIds),
        Query.equal('isActive', true)
      ]
    );

    // Combine saved resource data with full resource details
    return savedResourcesResponse.documents.map(savedResource => {
      const resource = resourcesResponse.documents.find(r => r.$id === savedResource.resourceID);
      if (!resource) return null;

      return {
        id: resource.$id,
        title: resource.title || '',
        category: resource.category || '',
        icon: resource.icon || '📚',
        description: resource.description || '',
        isPremium: resource.pricing?.toLowerCase().includes('premium') || resource.pricing?.toLowerCase().includes('paid') || false,
        isSaved: true,
        link: resource.link || '',
        savedId: savedResource.$id, // Keep track of saved_resources document ID
      };
    }).filter(Boolean);
  } catch (error) {
    console.error('Error getting saved resources:', error);
    throw error;
  }
}

// Save a resource
export async function saveResource(userId: string, resourceId: string) {
  try {
    // Check if already saved
    try {
      const existing = await databases.listDocuments(
        databaseId,
        COLLECTIONS.SAVED_RESOURCES,
        [
          Query.equal('userID', userId),
          Query.equal('resourceID', resourceId)
        ]
      );

      if (existing.documents.length > 0) {
        console.log('Resource already saved, returning existing:', existing.documents[0].$id);
        return existing.documents[0];
      }
    } catch (queryError) {
      console.warn('Error checking for existing resource, proceeding with save:', queryError);
    }

    // Create new saved resource record
    const response = await databases.createDocument(
      databaseId,
      COLLECTIONS.SAVED_RESOURCES,
      AppwriteID.unique(),
      {
        userID: userId,
        resourceID: resourceId,
      },
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    );

    return response;
  } catch (error: any) {
    // If document already exists, try to fetch and return it
    if (error.code === 409 || error.message?.includes('already exists')) {
      console.log('Document already exists, fetching existing document...');
      try {
        const existing = await databases.listDocuments(
          databaseId,
          COLLECTIONS.SAVED_RESOURCES,
          [
            Query.equal('userID', userId),
            Query.equal('resourceID', resourceId)
          ]
        );
        if (existing.documents.length > 0) {
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

// Get all saved AI tools for a user
export async function getSavedAITools(userId: string) {
  try {
    // Get all saved AI tool records
    const savedAIToolsResponse = await databases.listDocuments(
      databaseId,
      COLLECTIONS.SAVED_AI_TOOLS,
      [Query.equal('userID', userId)]
    );

    if (savedAIToolsResponse.documents.length === 0) {
      return [];
    }

    // Extract AI tool IDs
    const toolIds = savedAIToolsResponse.documents.map(doc => doc.toolID);

    // Fetch full AI tool details
    const aiToolsResponse = await databases.listDocuments(
      databaseId,
      COLLECTIONS.AI_TOOLS,
      [
        Query.equal('$id', toolIds),
        Query.equal('isActive', true)
      ]
    );

    // Combine saved AI tool data with full AI tool details
    return savedAIToolsResponse.documents.map(savedTool => {
      const tool = aiToolsResponse.documents.find(t => t.$id === savedTool.toolID);
      if (!tool) return null;

      return {
        id: tool.$id,
        title: tool.toolName || '',
        category: tool.category || '',
        icon: tool.icon || '🤖',
        description: tool.description || '',
        isPremium: tool.pricing?.toLowerCase().includes('premium') || tool.pricing?.toLowerCase().includes('paid') || false,
        isSaved: true,
        link: tool.websiteUrl || '',
        features: tool.features || [],
        savedId: savedTool.$id, // Keep track of saved_ai_tools document ID
      };
    }).filter(Boolean);
  } catch (error) {
    console.error('Error getting saved AI tools:', error);
    throw error;
  }
}

// Save an AI tool
export async function saveAITool(userId: string, toolId: string) {
  try {
    // Check if already saved
    try {
      const existing = await databases.listDocuments(
        databaseId,
        COLLECTIONS.SAVED_AI_TOOLS,
        [
          Query.equal('userID', userId),
          Query.equal('toolID', toolId)
        ]
      );

      if (existing.documents.length > 0) {
        console.log('AI tool already saved, returning existing:', existing.documents[0].$id);
        return existing.documents[0];
      }
    } catch (queryError) {
      console.warn('Error checking for existing AI tool, proceeding with save:', queryError);
    }

    // Create new saved AI tool record
    const response = await databases.createDocument(
      databaseId,
      COLLECTIONS.SAVED_AI_TOOLS,
      AppwriteID.unique(),
      {
        userID: userId,
        toolID: toolId,
      },
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    );

    return response;
  } catch (error: any) {
    // If document already exists, try to fetch and return it
    if (error.code === 409 || error.message?.includes('already exists')) {
      console.log('Document already exists, fetching existing document...');
      try {
        const existing = await databases.listDocuments(
          databaseId,
          COLLECTIONS.SAVED_AI_TOOLS,
          [
            Query.equal('userID', userId),
            Query.equal('toolID', toolId)
          ]
        );
        if (existing.documents.length > 0) {
          return existing.documents[0];
        }
      } catch (fetchError) {
        console.error('Error fetching existing document:', fetchError);
      }
    }
    console.error('Error saving AI tool:', error);
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
  } catch (error) {
    console.error('Error unsaving AI tool:', error);
    throw error;
  }
}
