import { Client, Account, Databases, Storage, ID } from 'appwrite';

// Initialize Appwrite Client
const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT || '');

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const AppwriteID = ID;

// Export client for advanced usage
export { client };

// Database and collection IDs
export const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID || '';
export const avatarsBucket = import.meta.env.VITE_APPWRITE_AVATAR_BUCKET || 'avatars';
export const DATABASE_ID = databaseId; // Legacy export for compatibility
export const COLLECTIONS = {
  USERS: import.meta.env.VITE_APPWRITE_COLLECTION_USERS || '',
  PERKS: import.meta.env.VITE_APPWRITE_COLLECTION_PERKS || '',
  SAVED_PERKS: import.meta.env.VITE_APPWRITE_COLLECTION_SAVED_PERKS || '',
  RESOURCES: import.meta.env.VITE_APPWRITE_COLLECTION_RESOURCES || '',
  SAVED_RESOURCES: import.meta.env.VITE_APPWRITE_COLLECTION_SAVED_RESOURCES || '',
  AI_TOOLS: import.meta.env.VITE_APPWRITE_COLLECTION_AI_TOOLS || '',
  SAVED_AI_TOOLS: import.meta.env.VITE_APPWRITE_COLLECTION_SAVED_AI_TOOLS || '',
};

// OAuth Configuration
export const OAUTH_CONFIG = {
  SUCCESS_URL: typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : '/dashboard',
  FAILURE_URL: typeof window !== 'undefined' ? `${window.location.origin}/login?error=oauth_failed` : '/login?error=oauth_failed',
};
