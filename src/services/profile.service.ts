// Profile service for Appwrite database operations
// Uses client-side SDK with user session - NO API KEYS

import { databases, account, storage, databaseId, COLLECTIONS, AppwriteID, avatarsBucket } from '../lib/appwrite';
import { UserProfile } from '../types/profile.types';
import { Permission, Role } from 'appwrite';

// Use environment variables for database and collection IDs
const USERS_COLLECTION = COLLECTIONS.USERS;
const STORAGE_BUCKET_ID = import.meta.env.VITE_APPWRITE_AVATAR_BUCKET || avatarsBucket;

// Get current user from session
export async function getCurrentUser() {
  try {
    return await account.get();
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
}

// Helper to check if error is 404
function isNotFoundError(err: any): boolean {
  if (!err) return false;
  if (err.code === 404) return true;
  const msg = err.message || '';
  return typeof msg === 'string' && msg.toLowerCase().includes('not found');
}

// Get user profile from database
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const response = await databases.getDocument(
      databaseId,
      USERS_COLLECTION,
      userId
    );

    return {
      id: response.$id,
      name: response.name || '',
      email: response.email || '',
      // Map database fields to profile fields
      university: response.institution || response.university || '',
      stream: response.stream || '',
      avatar: response.profilePicture || response.avatar || '',
      verificationStatus: response.sheeridstatus || response.verificationStatus || 'pending',
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
    if (isNotFoundError(error)) {
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

    // Build document data - use fields that exist in the database
    const docData: any = {
      name: data.name,
      email: data.email,
      logintype: 'email', // Default login type
      sheeridstatus: 'pending', // Maps to verificationStatus
      institution: data.university || '', // Maps to university
      onboardingComplete: false, // Initially false
    };

    // Add optional fields if they exist in schema
    if (data.stream) docData.stream = data.stream;
    if (data.avatar) docData.profilePicture = data.avatar;

    // Set permissions - user and admins can read/write
    const permissions = [
      Permission.read(Role.user(userId)),
      Permission.update(Role.user(userId)),
      Permission.delete(Role.user(userId)),
    ];

    const response = await databases.createDocument(
      databaseId,
      USERS_COLLECTION,
      userId, // Use userId as document ID
      docData,
      permissions
    );

    return {
      id: response.$id,
      name: response.name || '',
      email: response.email || '',
      university: response.institution || '',
      stream: response.stream || '',
      avatar: response.profilePicture || '',
      verificationStatus: response.sheeridstatus || 'pending',
      accountStatus: 'active',
      createdAt: new Date(response.$createdAt),
      lastLogin: new Date(),
      validityPeriod: {
        start: now,
        end: fourYearsLater,
      },
      linkedAccounts: [],
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
    // Map frontend fields to database fields
    const docUpdates: any = {};
    if (updates.name !== undefined) docUpdates.name = updates.name;
    if (updates.university !== undefined) docUpdates.institution = updates.university;
    if (updates.stream !== undefined) docUpdates.stream = updates.stream;
    if (updates.avatar !== undefined) docUpdates.profilePicture = updates.avatar;

    const response = await databases.updateDocument(
      databaseId,
      USERS_COLLECTION,
      userId,
      docUpdates
    );

    return {
      id: response.$id,
      name: response.name || '',
      email: response.email || '',
      university: response.institution || '',
      stream: response.stream || '',
      avatar: response.profilePicture || '',
      verificationStatus: response.sheeridstatus || 'pending',
      accountStatus: 'active',
      createdAt: new Date(response.$createdAt),
      lastLogin: new Date(),
      validityPeriod: {
        start: new Date(),
        end: new Date(Date.now() + 4 * 365 * 24 * 60 * 60 * 1000),
      },
      linkedAccounts: [],
    } as UserProfile;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

// Upload avatar image to Appwrite Storage
export async function uploadAvatar(file: File): Promise<string> {
  try {
    // If no storage bucket is configured, fall back to base64
    if (!STORAGE_BUCKET_ID || STORAGE_BUCKET_ID === 'avatars') {
      console.warn('Storage bucket not configured, using base64 fallback');
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    // Upload file to Appwrite Storage
    const fileId = AppwriteID.unique();
    const response = await storage.createFile(
      STORAGE_BUCKET_ID,
      fileId,
      file,
      [
        Permission.read(Role.any()), // Anyone can view avatars
      ]
    );

    // Get the file view URL
    const fileUrl = storage.getFileView(STORAGE_BUCKET_ID, response.$id);
    return fileUrl.href;
  } catch (error: any) {
    console.error('Error uploading avatar:', error);

    // If storage upload fails, fall back to base64
    if (error.code === 404 || error.message?.includes('bucket')) {
      console.warn('Storage bucket not found, falling back to base64');
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    throw error;
  }
}

// Get or create user profile (useful for new users)
export async function getOrCreateProfile(authUser: any): Promise<UserProfile> {
  try {
    const userId = authUser.$id;

    // Try to get existing profile
    let profile = await getUserProfile(userId);

    if (!profile) {
      console.log('Profile not found, creating new profile for user:', userId);
      // Create new profile from auth data
      profile = await createUserProfile(userId, {
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
