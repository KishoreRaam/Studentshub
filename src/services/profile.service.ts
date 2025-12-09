// Profile service for Appwrite database operations
// Uses client-side SDK with user session - NO API KEYS

import { databases, account, storage, databaseId, COLLECTIONS, AppwriteID, profilePicturesBucket } from '../lib/appwrite';
import { UserProfile } from '../types/profile.types';
import { Permission, Role } from 'appwrite';

// Use environment variables for database and collection IDs
const USERS_COLLECTION = COLLECTIONS.USERS;
const PROFILE_PICTURES_BUCKET = import.meta.env.VITE_APPWRITE_BUCKET_PROFILE_PICTURES || profilePicturesBucket;

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
      avatar: getProfilePictureUrl(response.profilePicture || response.avatar || ''),
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
      avatar: getProfilePictureUrl(response.profilePicture || ''),
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
    
    // CRITICAL: Only store file ID in profilePicture (must be < 500 chars)
    if (updates.avatar !== undefined) {
      // Validate that we're only storing a file ID, not base64 or large data
      if (typeof updates.avatar === 'string') {
        if (updates.avatar.length > 500) {
          console.error('Avatar string too long (likely base64). Length:', updates.avatar.length);
          throw new Error('Invalid avatar data. Please upload a new image.');
        }
        docUpdates.profilePicture = updates.avatar;
      } else {
        console.error('Avatar must be a string (file ID), received:', typeof updates.avatar);
        throw new Error('Invalid avatar format. Expected file ID string.');
      }
    }

    // Mark onboarding as complete when user updates profile
    docUpdates.onboardingComplete = true;

    console.log('Updating user profile with:', docUpdates);

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
      avatar: getProfilePictureUrl(response.profilePicture || ''),
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
export async function uploadAvatar(file: File, userId?: string): Promise<string> {
  try {
    const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_PROFILE_PICTURES || PROFILE_PICTURES_BUCKET;
    
    if (!bucketId) {
      throw new Error('Profile pictures bucket not configured. Please set VITE_APPWRITE_BUCKET_PROFILE_PICTURES in your .env file.');
    }

    // Generate a unique file ID with timestamp for uniqueness
    const timestamp = Date.now();
    const fileId = userId ? `profile_${userId}_${timestamp}` : `profile_${timestamp}_${AppwriteID.unique()}`;
    
    console.log('Uploading file to bucket:', bucketId, 'with ID:', fileId);

    // Upload file to Appwrite Storage
    const response = await storage.createFile(
      bucketId,
      fileId,
      file,
      [
        Permission.read(Role.any()), // Anyone can view profile pictures
      ]
    );

    console.log('File uploaded successfully. File ID:', response.$id);

    // Return only the file ID (NOT base64, NOT File object, NOT full URL)
    // This ID string should be < 500 characters
    return response.$id;
  } catch (error: any) {
    console.error('Error uploading avatar:', error);
    throw new Error(`Failed to upload profile picture: ${error.message || 'Unknown error'}`);
  }
}

// Get profile picture URL from file ID
export function getProfilePictureUrl(fileId: string): string {
  if (!fileId) return '';
  
  // If it's already a full URL (legacy data), return as is
  if (fileId.startsWith('http://') || fileId.startsWith('https://') || fileId.startsWith('data:')) {
    return fileId;
  }

  // Generate view URL from file ID
  const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
  const projectId = import.meta.env.VITE_APPWRITE_PROJECT;
  const bucket = PROFILE_PICTURES_BUCKET;

  return `${endpoint}/storage/buckets/${bucket}/files/${fileId}/view?project=${projectId}`;
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
