# Appwrite Configuration Guide

## Environment Variables Setup

### Required Variables

Add these to your `.env` file (local development) and Vercel project settings (production):

```bash
# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT=68d29c8100366fc856a6

# Database Configuration
VITE_APPWRITE_DATABASE_ID=68d3d183000b0146b221
VITE_APPWRITE_COLLECTION_USERS=users

# Storage Bucket for Profile Pictures
VITE_APPWRITE_BUCKET_PROFILE_PICTURES=69376d25000b39c8273e
```

### Important Notes

- **All environment variables MUST be prefixed with `VITE_`** to be accessible in Vite
- After adding/changing env vars, **restart your dev server**: `npm run dev`
- For Vercel deployment, add these in: Project Settings → Environment Variables

## Usage in Your Code

### Importing Appwrite Services

```typescript
// Import what you need (named exports)
import { 
  client,           // Raw Appwrite client
  account,          // Account service
  databases,        // Database service
  storage,          // Storage service
  DATABASE_ID,      // Your database ID
  COLLECTIONS,      // All collection IDs
  profilePicturesBucket  // Profile pictures bucket ID
} from '@/lib/appwrite';
```

### Example: Database Operations

```typescript
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';

// Get a document
const user = await databases.getDocument(
  DATABASE_ID,
  COLLECTIONS.USERS,
  userId
);

// Update a document
await databases.updateDocument(
  DATABASE_ID,
  COLLECTIONS.USERS,
  userId,
  { name: 'New Name' }
);
```

### Example: Storage Operations

```typescript
import { storage, profilePicturesBucket, AppwriteID } from '@/lib/appwrite';

// Upload a file
const fileId = `profile_${userId}_${Date.now()}`;
const response = await storage.createFile(
  profilePicturesBucket,
  fileId,
  file
);

// Get file URL
const imageUrl = storage.getFileView(profilePicturesBucket, fileId);
```

### Example: Authentication

```typescript
import { account } from '@/lib/appwrite';

// Get current user
const user = await account.get();

// Create email session
await account.createEmailPasswordSession(email, password);

// Logout
await account.deleteSession('current');
```

## Available Exports

### Services
- `client` - Appwrite client instance
- `account` - Account service (auth operations)
- `databases` - Database service
- `storage` - Storage service
- `AppwriteID` - ID generator utility

### Configuration
- `DATABASE_ID` - Your main database ID
- `databaseId` - Alias of DATABASE_ID
- `profilePicturesBucket` - Profile pictures storage bucket ID
- `avatarsBucket` - Legacy avatars bucket (for backward compatibility)

### Collections
```typescript
COLLECTIONS = {
  USERS: 'users',
  PERKS: 'perks',
  SAVED_PERKS: 'saved_perks',
  RESOURCES: 'resources',
  SAVED_RESOURCES: 'saved_resources',
  AI_TOOLS: 'ai_tools',
  SAVED_AI_TOOLS: 'saved_ai_tools',
  EVENTS: 'events',
  SAVED_EVENTS: 'saved_events',
  COLLEGE_REGISTRATIONS: 'college_registrations'
}
```

### OAuth
- `OAUTH_CONFIG` - OAuth success/failure URLs

## Troubleshooting

### Error: "Project not found"
- Check `VITE_APPWRITE_PROJECT` in `.env`
- Verify project ID in Appwrite Console → Settings
- Restart dev server after changes

### Error: "Bucket not found"
- Check `VITE_APPWRITE_BUCKET_PROFILE_PICTURES` in `.env`
- Verify bucket ID in Appwrite Console → Storage
- Restart dev server after changes

### Environment variables not loading
1. Ensure variables are prefixed with `VITE_`
2. Restart dev server: `npm run dev`
3. Clear browser cache if needed
4. Check `.env` file is in project root

### Vercel deployment issues
1. Add ALL environment variables in Vercel project settings
2. Set environment to: Production, Preview, Development (all)
3. Redeploy after adding variables
