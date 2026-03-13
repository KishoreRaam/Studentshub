#!/usr/bin/env node
/**
 * Add Promo Video Attributes to Events Collection
 *
 * Adds two new optional string attributes to the events Appwrite collection:
 *   - promoVideoFileId  (string, optional) — Appwrite storage file ID in event_videos bucket
 *   - promoVideoUrl     (string, optional) — Resolved view URL for the promo video
 *
 * Run AFTER create-event-videos-bucket.js.
 *
 * Usage:
 *   node scripts/add-promo-video-schema.js
 */

const sdk = require('node-appwrite');

const DATABASE_ID = '68d3d183000b0146b221';
const COLLECTION_ID = 'events';

const apiKey = 'standard_96f11899ef5e4ae0f02c9824aaf24568b97bf6623030ff8f484015a8254ffb2ee522be1c0d87ece8e322c93e6e0e1087313e17303a1970d0b550da02a024b3c8f06258ca5ea6b108d4ccab5c50402cb973998a42e1f44660e0d1c7058fa92010b0636b8313ce3d37eba29cf6dcc4c3b45fc6771d97e4295c3c3e3455cc3016e1';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function syncAttribute(label, fn) {
  try {
    await fn();
    console.log(`  ✓ "${label}" created`);
    await sleep(2000); // Appwrite needs a moment between attribute creations
  } catch (err) {
    if (err.code === 409) {
      console.log(`  — "${label}" already exists, skipping`);
    } else if (err.code === 429) {
      console.log(`  Rate limit hit, retrying "${label}" in 3s...`);
      await sleep(3000);
      await syncAttribute(label, fn);
    } else {
      console.error(`  ✗ Failed to create "${label}":`, err.message);
    }
  }
}

async function main() {
  const client = new sdk.Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT || '68d29c8100366fc856a6')
    .setKey(apiKey);

  const databases = new sdk.Databases(client);

  console.log(`Adding promo video attributes to "${COLLECTION_ID}" collection...`);

  // promoVideoFileId — the raw Appwrite file ID stored in the event_videos bucket
  await syncAttribute('promoVideoFileId', () =>
    databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'promoVideoFileId', 255, false, null, false)
  );

  // promoVideoUrl — the resolved /view URL for the video (stored for quick access)
  await syncAttribute('promoVideoUrl', () =>
    databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'promoVideoUrl', 2048, false, null, false)
  );

  console.log('\nSchema update complete.');
  console.log('Restart your dev server (npm run dev) to pick up the new .env variable.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
