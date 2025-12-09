# Profile Picture Upload - Environment Setup Guide

## Required Environment Variables

Add these variables to your `.env` file (locally) and Vercel (production):

```bash
# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT=68d29c8100366fc856a6

# Database & Collections
VITE_APPWRITE_DATABASE_ID=68d3d183000b0146b221
VITE_APPWRITE_COLLECTION_USERS=users

# Storage Bucket for Profile Pictures
VITE_APPWRITE_BUCKET_PROFILE_PICTURES=69376d25000b39c8273e
```

## Local Development Setup

1. **Create/Update `.env` file** in project root:
   ```bash
   # Copy from .env.example or create new
   cp .env.example .env
   ```

2. **Add the variables** listed above to your `.env` file

3. **Restart dev server** to load new environment variables:
   ```bash
   npm run dev
   ```

4. **Verify in code** - Variables are accessed via:
   ```typescript
   const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
   const projectId = import.meta.env.VITE_APPWRITE_PROJECT;
   const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_PROFILE_PICTURES;
   ```

## Vercel Deployment Setup

1. **Go to your Vercel project** → Settings → Environment Variables

2. **Add each variable**:
   - Name: `VITE_APPWRITE_ENDPOINT`
   - Value: `https://fra.cloud.appwrite.io/v1`
   - Environment: All (Production, Preview, Development)

3. **Repeat for all variables** listed above

4. **Redeploy** to apply changes:
   - Go to Deployments → Latest Deployment → ⋯ Menu → Redeploy

## Migration: Fix Existing Invalid Data

If you have existing users with invalid `profilePicture` data (base64 strings), run the migration script:

### Prerequisites

1. **Get Server API Key** from Appwrite Console:
   - Go to Appwrite Console → Your Project → Settings → API Keys
   - Create new key with `databases.read` and `databases.write` scopes
   - Copy the key

2. **Add to `.env`** (DO NOT commit this):
   ```bash
   APPWRITE_API_KEY=your_server_api_key_here
   ```

### Run Migration

```bash
# Install dependencies if needed
npm install node-appwrite dotenv

# Compile TypeScript (if needed)
npx ts-node scripts/migrate-profile-pictures.ts

# Or if using tsx:
npx tsx scripts/migrate-profile-pictures.ts
```

The script will:
- Scan all users in the Users collection
- Find documents where `profilePicture` > 500 characters
- Clear invalid data (set to `null`)
- Report summary of changes

## Database Schema Requirements

Your Appwrite Users collection must have:

| Attribute | Type | Size | Required |
|-----------|------|------|----------|
| `profilePicture` | String | ≤ 500 chars | No |

**IMPORTANT:** The `profilePicture` field stores **only the file ID** from Appwrite Storage, NOT:
- ❌ Base64 encoded images
- ❌ Full URLs
- ❌ File objects

**Example valid value:** `profile_user123_1733789456789`

## Storage Bucket Setup

1. **Create Storage Bucket** in Appwrite Console:
   - Go to Storage → Create Bucket
   - Name: "Profile Pictures"
   - Max File Size: 5 MB
   - Allowed File Extensions: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`

2. **Set Permissions**:
   - Read: `Any` (public viewing)
   - Create: `Users` (authenticated users can upload)
   - Update: `Users` (users can update their own)
   - Delete: `Users` (users can delete their own)

3. **Copy Bucket ID** and add to `.env`:
   ```bash
   VITE_APPWRITE_BUCKET_PROFILE_PICTURES=your_bucket_id_here
   ```

## Troubleshooting

### Error: "Invalid document structure: Attribute profilePicture has invalid type"

**Cause:** Trying to store File object or base64 string instead of file ID

**Fix:**
1. Verify `uploadAvatar()` returns only `response.$id` (not full URL or File)
2. Verify `updateUserProfile()` receives string file ID (not File object)
3. Run migration script to clean existing bad data

### Error: "Bucket not found"

**Cause:** `VITE_APPWRITE_BUCKET_PROFILE_PICTURES` not set or incorrect

**Fix:**
1. Check bucket ID in Appwrite Console → Storage
2. Update `.env` with correct bucket ID
3. Restart dev server

### Error: "Project not found"

**Cause:** `VITE_APPWRITE_PROJECT` not set or incorrect

**Fix:**
1. Check project ID in Appwrite Console → Settings
2. Update `.env` with correct project ID
3. Restart dev server

## Testing the Upload Flow

1. **Local test**:
   ```bash
   npm run dev
   ```

2. **Navigate to Profile** → Edit Profile

3. **Upload an image**:
   - Select an image file
   - Should see preview immediately
   - Click "Save Changes"
   - Should see success toast

4. **Verify in Appwrite Console**:
   - Go to Databases → Your Database → Users Collection
   - Find your user document
   - Check `profilePicture` field contains short file ID (e.g., `profile_123_1733789456789`)
   - Go to Storage → Profile Pictures bucket
   - Verify uploaded file appears

5. **Refresh page** - Profile picture should display from storage

## Code Integration Example

```typescript
// Read environment variables
const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const projectId = import.meta.env.VITE_APPWRITE_PROJECT;
const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_PROFILE_PICTURES;

// Initialize client (already done in src/lib/appwrite.ts)
import { storage, databases } from '@/lib/appwrite';

// Upload file
const fileId = `profile_${userId}_${Date.now()}`;
const response = await storage.createFile(bucketId, fileId, file);

// Store only file ID
await databases.updateDocument(
  databaseId,
  collectionId,
  documentId,
  { profilePicture: response.$id } // Just the ID string!
);

// Display image
const imageUrl = `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
```

## Summary

✅ **DO:**
- Store only file IDs in `profilePicture` field
- Use `storage.createFile()` for uploads
- Read config from environment variables
- Run migration script to clean bad data

❌ **DON'T:**
- Store base64 strings in database
- Store File objects in database
- Hardcode Appwrite configuration
- Store full URLs when file ID is sufficient
