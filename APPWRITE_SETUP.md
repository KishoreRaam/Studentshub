# Appwrite Setup Guide

## Issue: Profile Page Not Loading (404 Errors)

The 404 errors occur because the collection IDs in your `.env` file are incorrect. They should be alphanumeric IDs from Appwrite, not simple names like "users".

## Quick Fix Steps

### 1. Get Your Collection IDs from Appwrite Console

1. Go to [Appwrite Console](https://cloud.appwrite.io/console)
2. Select your project: **68d29c8100366fc856a6**
3. Navigate to **Databases** in the left sidebar
4. Click on your database (ID: **68d3d183000b0146b221**)
5. You should see a list of collections

### 2. Find or Create These Collections

You need **3 collections** with specific attributes:

#### Collection 1: **users** (User Profiles)

**Attributes:**
- `name` (String, required)
- `email` (String, required)
- `university` (String, optional)
- `stream` (String, optional)
- `avatar` (String, optional)
- `verificationStatus` (String, optional, default: "pending")
- `accountStatus` (String, optional, default: "active")
- `validityStart` (DateTime, optional)
- `validityEnd` (DateTime, optional)
- `linkedAccounts` (String array, optional)

**Permissions:**
- Role: Any → Create, Read, Update
- Or better: Create specific permissions for authenticated users

#### Collection 2: **perks** (Perks Data)

**Attributes:**
- `name` (String, required)
- `category` (String, required)
- `description` (String, optional)
- `logo` (String, optional)
- `claimLink` (String, optional)
- `validity` (String, optional)
- `discount` (String, optional)

**Permissions:**
- Role: Any → Read
- Admin only → Create, Update, Delete

#### Collection 3: **saved_perks** (User's Saved Perks)

**Attributes:**
- `userId` (String, required)
- `perkId` (String, required)
- `savedAt` (DateTime, required)

**Permissions:**
- Role: Any → Create, Read, Update, Delete
- Or better: User-specific permissions

### 3. Copy Collection IDs

After creating each collection:
1. Click on the collection name
2. Look at the URL or the collection details page
3. Copy the **Collection ID** (looks like: `68d3418abc123def456`)

### 4. Update Your .env File

Open `.env` and replace these lines:

```env
# BEFORE (❌ Wrong - these are names, not IDs)
VITE_APPWRITE_COLLECTION_USERS=users
VITE_APPWRITE_COLLECTION_PERKS=perks
VITE_APPWRITE_COLLECTION_SAVED_PERKS=saved_perks

# AFTER (✅ Correct - actual collection IDs from Appwrite)
VITE_APPWRITE_COLLECTION_USERS=68d3418abc123def456  # Replace with your actual ID
VITE_APPWRITE_COLLECTION_PERKS=68d3419xyz789ghi012  # Replace with your actual ID
VITE_APPWRITE_COLLECTION_SAVED_PERKS=68d341axyz789  # Replace with your actual ID
```

### 5. Restart Your Dev Server

After updating the .env file:

```bash
npm run dev
```

## Alternative: Use the Check Script

Run this command to see your current Appwrite setup:

```bash
node scripts/check-appwrite-setup.js
```

This will show you all available databases and collections with their IDs.

## Still Having Issues?

If collections don't exist:
1. You need to create them in Appwrite Console
2. Set up the attributes as described above
3. Configure proper permissions
4. Copy the collection IDs to your .env file

If you see other errors:
- Check that your `VITE_APPWRITE_PROJECT` is correct
- Verify database permissions in Appwrite Console
- Make sure you're logged in (authentication is required)
