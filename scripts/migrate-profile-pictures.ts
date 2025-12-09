/**
 * Migration Script: Clean Invalid ProfilePicture Data
 * 
 * This script identifies and fixes Users collection documents where 
 * profilePicture contains invalid data (base64 strings > 500 chars)
 * 
 * SAFETY MODE: By default, sets invalid profilePicture to null.
 * To enable upload mode, set UPLOAD_MODE=true (more complex, requires base64 decoding)
 */

import { Client, Databases, Query } from 'node-appwrite';
import * as dotenv from 'dotenv';

dotenv.config();

// Configuration from environment variables
const APPWRITE_ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.VITE_APPWRITE_PROJECT || '';
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY || ''; // Server API key needed for migration
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || '';
const USERS_COLLECTION = process.env.VITE_APPWRITE_COLLECTION_USERS || 'users';

// Safety mode: just clear invalid data (set to null)
const UPLOAD_MODE = false; // Set to true if you want to decode base64 and re-upload (not recommended)

async function migrateProfilePictures() {
  console.log('🚀 Starting profilePicture migration...\n');

  // Validate configuration
  if (!APPWRITE_PROJECT_ID || !APPWRITE_API_KEY || !DATABASE_ID) {
    console.error('❌ Missing required environment variables:');
    console.error('   - VITE_APPWRITE_PROJECT');
    console.error('   - APPWRITE_API_KEY (server key for migration)');
    console.error('   - VITE_APPWRITE_DATABASE_ID');
    process.exit(1);
  }

  // Initialize Appwrite client
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

  const databases = new Databases(client);

  try {
    console.log(`📊 Scanning Users collection: ${USERS_COLLECTION}\n`);

    // Fetch all documents (paginated)
    let offset = 0;
    const limit = 100;
    let totalScanned = 0;
    let invalidCount = 0;
    let fixedCount = 0;

    while (true) {
      const response = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION,
        [Query.limit(limit), Query.offset(offset)]
      );

      if (response.documents.length === 0) break;

      for (const doc of response.documents) {
        totalScanned++;
        const profilePicture = doc.profilePicture;

        // Check if profilePicture is invalid (too long, likely base64)
        if (profilePicture && typeof profilePicture === 'string') {
          if (profilePicture.length > 500) {
            invalidCount++;
            console.log(`⚠️  Found invalid profilePicture in user: ${doc.$id}`);
            console.log(`   Length: ${profilePicture.length} chars (limit: 500)`);
            console.log(`   Preview: ${profilePicture.substring(0, 50)}...`);

            try {
              // SAFETY MODE: Just clear the field
              await databases.updateDocument(
                DATABASE_ID,
                USERS_COLLECTION,
                doc.$id,
                { profilePicture: null }
              );
              fixedCount++;
              console.log(`✅ Cleared profilePicture for user: ${doc.$id}\n`);
            } catch (error: any) {
              console.error(`❌ Failed to update user ${doc.$id}:`, error.message);
            }
          }
        }
      }

      offset += limit;
      
      // Break if we've processed all documents
      if (response.documents.length < limit) break;
    }

    console.log('\n📈 Migration Summary:');
    console.log(`   Total users scanned: ${totalScanned}`);
    console.log(`   Invalid profilePictures found: ${invalidCount}`);
    console.log(`   Successfully fixed: ${fixedCount}`);
    console.log(`   Failed: ${invalidCount - fixedCount}`);
    console.log('\n✅ Migration complete!');

    if (fixedCount > 0) {
      console.log('\n💡 Next steps:');
      console.log('   1. Users with cleared profilePicture should re-upload their profile photos');
      console.log('   2. New uploads will use proper file IDs from Appwrite Storage');
    }

  } catch (error: any) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run migration
migrateProfilePictures().catch(console.error);
