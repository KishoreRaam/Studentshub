/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APPWRITE_ENDPOINT: string
  readonly VITE_APPWRITE_PROJECT: string
  readonly VITE_APPWRITE_DATABASE_ID: string
  readonly VITE_APPWRITE_BUCKET_PROFILE_PICTURES: string
  readonly VITE_APPWRITE_AVATAR_BUCKET: string
  readonly VITE_APPWRITE_COLLECTION_USERS: string
  readonly VITE_APPWRITE_COLLECTION_PERKS: string
  readonly VITE_APPWRITE_COLLECTION_SAVED_PERKS: string
  readonly VITE_APPWRITE_COLLECTION_RESOURCES: string
  readonly VITE_APPWRITE_COLLECTION_SAVED_RESOURCES: string
  readonly VITE_APPWRITE_COLLECTION_AI_TOOLS: string
  readonly VITE_APPWRITE_COLLECTION_SAVED_AI_TOOLS: string
  readonly VITE_APPWRITE_COLLECTION_EVENTS: string
  readonly VITE_APPWRITE_COLLECTION_SAVED_EVENTS: string
  readonly VITE_APPWRITE_COLLECTION_COLLEGE_REGISTRATIONS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
