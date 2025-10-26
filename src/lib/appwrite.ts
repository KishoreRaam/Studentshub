import { Client, Account, Databases, Storage } from 'appwrite';

// Initialize Appwrite Client
const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '');

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Export client for advanced usage
export { client };

// Database and collection IDs (update these with your actual IDs from Appwrite console)
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || '';
export const COLLECTIONS = {
  USERS: import.meta.env.VITE_APPWRITE_COLLECTION_USERS || '',
  PERKS: import.meta.env.VITE_APPWRITE_COLLECTION_PERKS || '',
  SAVED_PERKS: import.meta.env.VITE_APPWRITE_COLLECTION_SAVED_PERKS || '',
};

// OAuth Configuration
export const OAUTH_CONFIG = {
  SUCCESS_URL: `${window.location.origin}/dashboard`,
  FAILURE_URL: `${window.location.origin}/login?error=oauth_failed`,
};
