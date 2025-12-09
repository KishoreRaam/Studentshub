# Migration Scripts Guide

## Profile Pictures Migration Script

This script cleans up invalid `profilePicture` data in your Users collection (base64 strings > 500 chars).

### Prerequisites

1. **Install Dependencies:**
   ```bash
   npm install -D node-appwrite dotenv tsx
   ```

2. **Get Server API Key:**
   - Go to [Appwrite Console](https://fra.cloud.appwrite.io)
   - Navigate to: Your Project → Settings → API Keys
   - Click "Create API Key"
   - Name: "Migration Script"
   - Scopes: Enable `databases.read` and `databases.write`
   - Copy the generated key

3. **Add API Key to .env:**
   ```bash
   # Add this line to your .env file (DO NOT COMMIT)
   APPWRITE_API_KEY=your_server_api_key_here
   ```

### Running the Migration

```bash
# From project root
npx tsx scripts/migrate-profile-pictures.ts
```

### What It Does

1. Scans all documents in the Users collection
2. Identifies `profilePicture` fields with invalid data (> 500 chars)
3. Sets invalid entries to `null` (users will need to re-upload)
4. Provides a summary report

### Configuration

The script is pre-populated with your project IDs:
- **Endpoint:** https://fra.cloud.appwrite.io/v1
- **Project:** 68d29c8100366fc856a6
- **Database:** 68d3d183000b0146b221
- **Collection:** users

### Safety

- **SAFETY MODE** is enabled by default (just clears bad data)
- Dry run first: Check console output before confirming
- Only affects documents with `profilePicture` > 500 chars

### After Migration

Users with cleared profile pictures should:
1. Log in to their account
2. Navigate to Profile → Edit Profile
3. Upload a new profile picture
4. New uploads will use proper Appwrite Storage file IDs

## Troubleshooting

### "Missing required environment variables"
- Ensure `.env` file exists in project root
- Verify all `VITE_APPWRITE_*` variables are set
- Make sure you added `APPWRITE_API_KEY`

### "Invalid API key"
- Check the API key in Appwrite Console
- Ensure it has `databases.read` and `databases.write` scopes
- Make sure it's for the correct project

### "Collection not found"
- Verify `VITE_APPWRITE_COLLECTION_USERS=users` in `.env`
- Check collection name in Appwrite Console → Databases

### TypeScript/Module Errors
```bash
# Install missing dependencies
npm install -D node-appwrite dotenv tsx
```
