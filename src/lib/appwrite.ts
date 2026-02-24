import { Client, Account, Databases, Storage, ID, Functions } from 'appwrite';

/**
 * Appwrite Client Configuration
 * 
 * Required Environment Variables (add to .env.local and Vercel project settings):
 * - VITE_APPWRITE_ENDPOINT: Your Appwrite API endpoint (e.g., https://fra.cloud.appwrite.io/v1)
 * - VITE_APPWRITE_PROJECT: Your Appwrite project ID
 * - VITE_APPWRITE_DATABASE_ID: Your database ID
 * - VITE_APPWRITE_COLLECTION_USERS: Users collection ID (default: "users")
 * - VITE_APPWRITE_BUCKET_PROFILE_PICTURES: Storage bucket ID for profile pictures
 * 
 * All environment variables MUST be prefixed with VITE_ to be accessible in Vite.
 * After adding/changing env vars, restart your dev server: npm run dev
 */

// Initialize Appwrite Client
const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT || '');

// Initialize Appwrite services (named exports for clean imports)
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);
export const AppwriteID = ID;

// Export client for advanced usage
export { client };

// Database and collection IDs (read from environment variables)
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || '';
export const databaseId = DATABASE_ID; // Alias for compatibility
export const profilePicturesBucket = import.meta.env.VITE_APPWRITE_BUCKET_PROFILE_PICTURES || '';

// Legacy bucket exports (kept for backward compatibility)
export const avatarsBucket = import.meta.env.VITE_APPWRITE_AVATAR_BUCKET || 'avatars';
export const eventMediaBucket = import.meta.env.VITE_APPWRITE_BUCKET_EVENT_MEDIA || 'event_media';

// Collections configuration (named exports for easy importing)
export const COLLECTIONS = {
  USERS: import.meta.env.VITE_APPWRITE_COLLECTION_USERS || 'users',
  PERKS: import.meta.env.VITE_APPWRITE_COLLECTION_PERKS || 'perks',
  SAVED_PERKS: import.meta.env.VITE_APPWRITE_COLLECTION_SAVED_PERKS || 'saved_perks',
  RESOURCES: import.meta.env.VITE_APPWRITE_COLLECTION_RESOURCES || 'resources',
  SAVED_RESOURCES: import.meta.env.VITE_APPWRITE_COLLECTION_SAVED_RESOURCES || 'saved_resources',
  AI_TOOLS: import.meta.env.VITE_APPWRITE_COLLECTION_AI_TOOLS || 'ai_tools',
  SAVED_AI_TOOLS: import.meta.env.VITE_APPWRITE_COLLECTION_SAVED_AI_TOOLS || 'saved_ai_tools',
  EVENTS: import.meta.env.VITE_APPWRITE_COLLECTION_EVENTS || 'events',
  SAVED_EVENTS: import.meta.env.VITE_APPWRITE_COLLECTION_SAVED_EVENTS || 'saved_events',
  COLLEGE_REGISTRATIONS: import.meta.env.VITE_APPWRITE_COLLECTION_COLLEGE_REGISTRATIONS || 'college_registrations',
  USERS_META: import.meta.env.VITE_APPWRITE_COLLECTION_USERS_META || 'users_meta',
};

// OAuth Configuration
export const OAUTH_CONFIG = {
  SUCCESS_URL: typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.host}/dashboard`
    : 'https://studentperks.in/dashboard',
  FAILURE_URL: typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.host}/login?error=oauth_failed`
    : 'https://studentperks.in/login?error=oauth_failed',
};
