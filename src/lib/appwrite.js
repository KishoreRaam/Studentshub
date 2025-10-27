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

// Database and collection IDs
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID || "";
const avatarsBucket = import.meta.env.VITE_APPWRITE_AVATAR_BUCKET || "avatars";
const COLLECTIONS = {
  USERS: import.meta.env.VITE_APPWRITE_COLLECTION_USERS || "",
  PERKS: import.meta.env.VITE_APPWRITE_COLLECTION_PERKS || "",
  SAVED_PERKS: import.meta.env.VITE_APPWRITE_COLLECTION_SAVED_PERKS || "",
};

// Lightweight oauth config object for frontend usage only
const OAUTH_CONFIG = {
  provider: "google",
  successUrl: typeof window !== "undefined" ? `${window.location.origin}/dashboard` : "/dashboard",
  failureUrl: typeof window !== "undefined" ? `${window.location.origin}/login?error=oauth_failed` : "/login?error=oauth_failed",
};

// Export named ESM bindings
export { client, account, databases, storage, AppwriteID, databaseId, avatarsBucket, COLLECTIONS, OAUTH_CONFIG };
export default client;
