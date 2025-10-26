// Profile service for Appwrite database operations
// Uses client-side SDK with user session - NO API KEYS

import { databases, AppwriteID, account } from '../lib/appwrite';
import { UserProfile } from '../types/profile.types';
import { ID, Storage } from 'appwrite';

// Use environment variables for database IDs
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || '';
const PROFILES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PROFILES_COLLECTION_ID || '';
const STORAGE_BUCKET_ID = import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID || '';

// Get current user from session
export async function getCurrentUser() {
  try {
    return await account.get();
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
}

// Get user profile from database
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const response = await databases.getDocument(
      DATABASE_ID,
      PROFILES_COLLECTION_ID,
      userId
    );

    return {
      id: response.$id,
      name: response.name,
      email: response.email,
      university: response.university || '',
      stream: response.stream || '',
      avatar: response.avatar || '',
      verificationStatus: response.verificationStatus || 'pending',
      accountStatus: response.accountStatus || 'active',
      createdAt: new Date(response.$createdAt),
      lastLogin: new Date(),
      validityPeriod: {
        start: response.validityStart ? new Date(response.validityStart) : new Date(),
        end: response.validityEnd ? new Date(response.validityEnd) : new Date(Date.now() + 4 * 365 * 24 * 60 * 60 * 1000),
      },
      linkedAccounts: response.linkedAccounts || [],
    } as UserProfile;
  } catch (error: any) {
    // If document doesn't exist (404), return null
    if (error?.code === 404) {
      return null;
    }
    console.error('Error getting user profile:', error);
    throw error;
  }
}

// Create a new user profile
export async function createUserProfile(userId: string, data: {
  name: string;
  email: string;
  university?: string;
  stream?: string;
  avatar?: string;
}): Promise<UserProfile> {
  try {
    const now = new Date();
    const fourYearsLater = new Date(now.getTime() + 4 * 365 * 24 * 60 * 60 * 1000);

    const response = await databases.createDocument(
      DATABASE_ID,
      PROFILES_COLLECTION_ID,
      userId, // Use userId as document ID
      {
        name: data.name,
        email: data.email,
        university: data.university || '',
        stream: data.stream || '',
        avatar: data.avatar || '',
        verificationStatus: 'pending',
        accountStatus: 'active',
        validityStart: now.toISOString(),
        validityEnd: fourYearsLater.toISOString(),
        linkedAccounts: [],
      }
    );

    return {
      id: response.$id,
      name: response.name,
      email: response.email,
      university: response.university || '',
      stream: response.stream || '',
      avatar: response.avatar || '',
      verificationStatus: response.verificationStatus || 'pending',
      accountStatus: response.accountStatus || 'active',
      createdAt: new Date(response.$createdAt),
      lastLogin: new Date(),
      validityPeriod: {
        start: new Date(response.validityStart),
        end: new Date(response.validityEnd),
      },
      linkedAccounts: response.linkedAccounts || [],
    } as UserProfile;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  updates: {
    name?: string;
    university?: string;
    stream?: string;
    avatar?: string;
  }
): Promise<UserProfile> {
  try {
    const response = await databases.updateDocument(
      DATABASE_ID,
      PROFILES_COLLECTION_ID,
      userId,
      updates
    );

    return {
      id: response.$id,
      name: response.name,
      email: response.email,
      university: response.university || '',
      stream: response.stream || '',
      avatar: response.avatar || '',
      verificationStatus: response.verificationStatus || 'pending',
      accountStatus: response.accountStatus || 'active',
      createdAt: new Date(response.$createdAt),
      lastLogin: new Date(),
      validityPeriod: {
        start: new Date(response.validityStart),
        end: new Date(response.validityEnd),
      },
      linkedAccounts: response.linkedAccounts || [],
    } as UserProfile;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

// Upload avatar image
export async function uploadAvatar(file: File): Promise<string> {
  try {
    // Note: Storage requires proper setup in Appwrite console
    // For now, we'll use a placeholder. In production:
    // 1. Create a storage bucket in Appwrite
    // 2. Set proper permissions
    // 3. Uncomment the code below

    /*
    const storage = new Storage(client);
    const response = await storage.createFile(
      STORAGE_BUCKET_ID,
      ID.unique(),
      file
    );

    // Return the file URL
    return storage.getFileView(STORAGE_BUCKET_ID, response.$id).href;
    */

    // Placeholder: Convert to base64 data URL for now
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
}

// Get or create user profile (useful for new users)
export async function getOrCreateProfile(authUser: any): Promise<UserProfile> {
  try {
    // Try to get existing profile
    let profile = await getUserProfile(authUser.$id);

    if (!profile) {
      // Create new profile from auth data
      profile = await createUserProfile(authUser.$id, {
        name: authUser.name || authUser.email.split('@')[0],
        email: authUser.email,
        university: '',
        stream: '',
      });
    }

    return profile;
  } catch (error) {
    console.error('Error in getOrCreateProfile:', error);
    throw error;
  }
}
