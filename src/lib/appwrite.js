// src/lib/appwrite.js
// ESM, Vite-friendly Appwrite client wrapper for browser usage.
// Uses import.meta.env.VITE_* variables  do NOT put secret keys here.

import { Client, Account, Databases, Storage, ID } from "appwrite";

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || "";
const project  = import.meta.env.VITE_APPWRITE_PROJECT || "";

// Create a client instance safe for bundlers (no server-only code)
const client = new Client()
  .setEndpoint(endpoint)
  .setProject(project);

// Export client pieces used by the frontend
const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);
const AppwriteID = ID;

// Database and collection IDs (populated from .env)
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID || "68d3d183000b0146b221";
const DATABASE_ID = databaseId; // Alias for compatibility

// Storage bucket IDs
const avatarsBucket = import.meta.env.VITE_APPWRITE_AVATAR_BUCKET || "avatars";
const profilePicturesBucket = import.meta.env.VITE_APPWRITE_BUCKET_PROFILE_PICTURES || "69376d25000b39c8273e";

// Collections configuration
const COLLECTIONS = {
  USERS: import.meta.env.VITE_APPWRITE_COLLECTION_USERS || "users",
  PERKS: import.meta.env.VITE_APPWRITE_COLLECTION_PERKS || "perks",
  SAVED_PERKS: import.meta.env.VITE_APPWRITE_COLLECTION_SAVED_PERKS || "saved_perks",
  RESOURCES: import.meta.env.VITE_APPWRITE_COLLECTION_RESOURCES || "resources",
  SAVED_RESOURCES: import.meta.env.VITE_APPWRITE_COLLECTION_SAVED_RESOURCES || "saved_resources",
  AI_TOOLS: import.meta.env.VITE_APPWRITE_COLLECTION_AI_TOOLS || "ai_tools",
  SAVED_AI_TOOLS: import.meta.env.VITE_APPWRITE_COLLECTION_SAVED_AI_TOOLS || "saved_ai_tools",
  EVENTS: import.meta.env.VITE_APPWRITE_COLLECTION_EVENTS || "events",
  SAVED_EVENTS: import.meta.env.VITE_APPWRITE_COLLECTION_SAVED_EVENTS || "saved_events",
  COLLEGE_REGISTRATIONS: import.meta.env.VITE_APPWRITE_COLLECTION_COLLEGE_REGISTRATIONS || "college_registrations",
};

// Lightweight oauth config object for frontend usage only
const OAUTH_CONFIG = {
  provider: "google",
  SUCCESS_URL: typeof window !== "undefined" ? `${window.location.origin}/dashboard` : "/dashboard",
  FAILURE_URL: typeof window !== "undefined" ? `${window.location.origin}/login?error=oauth_failed` : "/login?error=oauth_failed",
};

// Export named ESM bindings (all exports needed by the application)
export { 
  client, 
  account, 
  databases, 
  storage, 
  AppwriteID, 
  databaseId, 
  DATABASE_ID,
  avatarsBucket, 
  profilePicturesBucket,
  COLLECTIONS, 
  OAUTH_CONFIG 
};
export default client;
