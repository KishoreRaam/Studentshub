#!/usr/bin/env node
/**
 * Appwrite Event Videos Bucket Setup Script
 *
 * Creates a dedicated storage bucket for event promo videos (MP4, MOV, WebM).
 * Max file size is set to 500MB to accommodate high-resolution edited promo videos.
 *
 * NOTE: Appwrite Cloud free tier caps individual file uploads at 30MB.
 *       Upgrade to a paid plan to unlock larger uploads up to this limit.
 *
 * Prerequisites:
 *   npm install node-appwrite
 *
 * Usage:
 *   node scripts/create-event-videos-bucket.js
 *
 * The API key needs: buckets.read, buckets.write, files.read, files.write scopes.
 */

const sdk = require('node-appwrite');

const BUCKET_ID = 'event_videos';
const BUCKET_NAME = 'Event Promo Videos';
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

const apiKey = 'standard_96f11899ef5e4ae0f02c9824aaf24568b97bf6623030ff8f484015a8254ffb2ee522be1c0d87ece8e322c93e6e0e1087313e17303a1970d0b550da02a024b3c8f06258ca5ea6b108d4ccab5c50402cb973998a42e1f44660e0d1c7058fa92010b0636b8313ce3d37eba29cf6dcc4c3b45fc6771d97e4295c3c3e3455cc3016e1';

async function main() {
  const client = new sdk.Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT || '68d29c8100366fc856a6')
    .setKey(apiKey);

  const storageService = new sdk.Storage(client);

  console.log('Creating event promo videos storage bucket...');
  try {
    await storageService.createBucket(
      BUCKET_ID,
      BUCKET_NAME,
      [
        sdk.Permission.read(sdk.Role.any()),       // Public read — needed for <video src> to work
        sdk.Permission.create(sdk.Role.users()),   // Logged-in users can upload
        sdk.Permission.update(sdk.Role.users()),
        sdk.Permission.delete(sdk.Role.users()),
      ],
      false,          // fileSecurity — use bucket-level permissions
      true,           // enabled
      MAX_FILE_SIZE,  // 500MB per file
      [
        'video/mp4',
        'video/webm',
        'video/quicktime', // .mov files
      ],
      undefined,      // compression — skip (video is already compressed)
      true,           // encryption
      true,           // antivirus
    );
    console.log(`  ✓ Bucket "${BUCKET_NAME}" (${BUCKET_ID}) created successfully!`);
  } catch (e) {
    if (e.code === 409) {
      console.log(`  Bucket "${BUCKET_ID}" already exists — no action needed.`);
    } else {
      throw e;
    }
  }

  console.log('\nDone! Add this to your .env file:');
  console.log(`  VITE_APPWRITE_BUCKET_EVENT_VIDEOS=${BUCKET_ID}`);
  console.log('\nThen run:');
  console.log('  node scripts/add-promo-video-schema.js');
  console.log('\nto add the promoVideoUrl / promoVideoFileId attributes to the events collection.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
