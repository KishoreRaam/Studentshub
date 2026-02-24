#!/usr/bin/env node
/**
 * Appwrite Event Media Bucket Setup Script
 *
 * Creates a storage bucket for event poster images and videos.
 *
 * Prerequisites:
 *   npm install node-appwrite
 *
 * Usage:
 *   APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1 \
 *   APPWRITE_PROJECT=68d29c8100366fc856a6 \
 *   APPWRITE_API_KEY=<your-server-api-key> \
 *   node scripts/create-event-media-bucket.js
 *
 * The API key needs: buckets.read, buckets.write, files.read, files.write scopes.
 */

const sdk = require('node-appwrite');

const BUCKET_ID = 'event_media';
const BUCKET_NAME = 'Event Media';

async function main() {
  const apiKey = 'standard_96f11899ef5e4ae0f02c9824aaf24568b97bf6623030ff8f484015a8254ffb2ee522be1c0d87ece8e322c93e6e0e1087313e17303a1970d0b550da02a024b3c8f06258ca5ea6b108d4ccab5c50402cb973998a42e1f44660e0d1c7058fa92010b0636b8313ce3d37eba29cf6dcc4c3b45fc6771d97e4295c3c3e3455cc3016e1';

  const client = new sdk.Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT || '68d29c8100366fc856a6')
    .setKey(apiKey);

  const storageService = new sdk.Storage(client);

  console.log('Creating event media storage bucket...');
  try {
    await storageService.createBucket(
      BUCKET_ID,
      BUCKET_NAME,
      [
        sdk.Permission.read(sdk.Role.any()),          // Anyone can view images
        sdk.Permission.create(sdk.Role.users()),       // Logged-in users can upload
        sdk.Permission.update(sdk.Role.users()),       // Logged-in users can update
        sdk.Permission.delete(sdk.Role.users()),       // Logged-in users can delete
      ],
      false,       // fileSecurity (false = use bucket-level permissions)
      true,        // enabled
      50 * 1024 * 1024, // maxFileSize: 50MB (for videos)
      [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'video/mp4',
        'video/webm',
        'video/quicktime',
      ],
      undefined,   // compression
      true,        // encryption
      true         // antivirus
    );
    console.log(`  Bucket "${BUCKET_NAME}" (${BUCKET_ID}) created successfully!`);
  } catch (e) {
    if (e.code === 409) {
      console.log(`  Bucket "${BUCKET_ID}" already exists. No action needed.`);
    } else {
      throw e;
    }
  }

  console.log('\nDone! Add this to your .env file:');
  console.log(`  VITE_APPWRITE_BUCKET_EVENT_MEDIA=${BUCKET_ID}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
