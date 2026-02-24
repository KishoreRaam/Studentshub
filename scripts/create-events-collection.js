#!/usr/bin/env node
/**
 * Appwrite Events Collection Setup Script
 *
 * Creates the "events" collection with all attributes and indexes
 * as specified in docs/events-collection-schema.md.
 *
 * Prerequisites:
 *   npm install node-appwrite
 *
 * Usage:
 *   APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1 \
 *   APPWRITE_PROJECT=<project-id> \
 *   APPWRITE_API_KEY=<server-api-key> \
 *   node scripts/create-events-collection.js
 *
 * The API key needs: databases.read, databases.write, collections.read,
 * collections.write, attributes.read, attributes.write, indexes.read,
 * indexes.write scopes.
 */

const sdk = require('node-appwrite');

const DATABASE_ID = '68d3d183000b0146b221';
const COLLECTION_ID = 'events';

async function main() {
  const client = new sdk.Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT || '68d29c8100366fc856a6')
    .setKey(process.env.APPWRITE_API_KEY || 'standard_96f11899ef5e4ae0f02c9824aaf24568b97bf6623030ff8f484015a8254ffb2ee522be1c0d87ece8e322c93e6e0e1087313e17303a1970d0b550da02a024b3c8f06258ca5ea6b108d4ccab5c50402cb973998a42e1f44660e0d1c7058fa92010b0636b8313ce3d37eba29cf6dcc4c3b45fc6771d97e4295c3c3e3455cc3016e1');

  const databases = new sdk.Databases(client);

  // Helper: wait for attribute to be available before creating the next one
  // Appwrite processes attributes asynchronously; we poll until status is 'available'.
  async function waitForAttribute(key, maxAttempts = 30) {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const attr = await databases.getAttribute(DATABASE_ID, COLLECTION_ID, key);
        if (attr.status === 'available') return;
      } catch (_) {
        // attribute may not exist yet
      }
      await new Promise(r => setTimeout(r, 1000));
    }
    console.warn(`  Warning: attribute "${key}" did not reach 'available' status in time`);
  }

  // ── 1. Create Collection ──────────────────────────────────────────────
  console.log('Creating collection...');
  try {
    await databases.createCollection(
      DATABASE_ID,
      COLLECTION_ID,
      'Events',
      undefined, // permissions (none at collection level)
      true,      // documentSecurity
      true       // enabled
    );
    console.log('  Collection "events" created.');
  } catch (e) {
    if (e.code === 409) {
      console.log('  Collection "events" already exists, continuing with attributes...');
    } else {
      throw e;
    }
  }

  // ── 2. Create Attributes ──────────────────────────────────────────────
  // Each attribute is created sequentially. We wait for availability before
  // creating the next to avoid race conditions on Appwrite Cloud.

  const stringAttrs = [
    // [key, size, required, defaultValue, array]
    ['title', 255, true, null, false],
    ['description', 5000, true, null, false],
    ['time', 50, true, null, false],
    ['duration', 50, false, null, false],
    ['organizer', 255, true, null, false],
    ['organizerLogo', 255, false, null, false],
    ['organizerWebsite', 255, false, null, false],
    ['registrationLink', 500, true, null, false],
    ['posterFileId', 255, false, null, false],
    ['thumbnailUrl', 500, false, null, false],
    ['location', 255, false, null, false],
    ['platform', 100, false, null, false],
    ['price', 50, false, null, false],
    ['speakersJson', 10000, false, null, false],
    ['resourcesJson', 10000, false, null, false],
    ['recordingUrl', 500, false, null, false],
    ['submittedBy', 255, true, null, false],
    // String arrays
    ['streams', 50, false, null, true],
    ['tags', 100, false, null, true],
    ['prerequisites', 500, false, null, true],
    ['requirements', 500, false, null, true],
    ['agenda', 500, false, null, true],
    ['benefits', 500, false, null, true],
  ];

  const enumAttrs = [
    // [key, elements, required, defaultValue]
    ['category', ['Webinar', 'Hackathon', 'Workshop', 'Conference'], true, null],
    ['status', ['Live Now', 'Upcoming', 'Registration Open', 'Registration Closed', 'Completed'], true, 'Upcoming'],
    ['submitterType', ['student', 'college_admin', 'platform_admin'], false, 'student'],
  ];

  const integerAttrs = [
    // [key, required, min, max, defaultValue]
    ['participantCount', false, 0, null, 0],
    ['maxParticipants', false, 0, null, null],
  ];

  const booleanAttrs = [
    // [key, required, defaultValue]
    ['isPopular', false, false],
    ['isFeatured', false, false],
    ['certificateOffered', false, false],
    ['isPaid', false, false],
    ['approved', false, false],
  ];

  const datetimeAttrs = [
    // [key, required, defaultValue]
    ['eventDate', true, null],
  ];

  console.log('Creating string attributes...');
  for (const [key, size, required, defaultVal, array] of stringAttrs) {
    try {
      console.log(`  ${key} (size=${size}, array=${array})`);
      await databases.createStringAttribute(
        DATABASE_ID, COLLECTION_ID, key, size, required, defaultVal, array
      );
      await waitForAttribute(key);
    } catch (e) {
      if (e.code === 409) {
        console.log(`    Already exists, skipping.`);
      } else {
        throw e;
      }
    }
  }

  console.log('Creating enum attributes...');
  for (const [key, elements, required, defaultVal] of enumAttrs) {
    try {
      console.log(`  ${key} (values=${elements.join(', ')})`);
      await databases.createEnumAttribute(
        DATABASE_ID, COLLECTION_ID, key, elements, required, defaultVal
      );
      await waitForAttribute(key);
    } catch (e) {
      if (e.code === 409) {
        console.log(`    Already exists, skipping.`);
      } else {
        throw e;
      }
    }
  }

  console.log('Creating integer attributes...');
  for (const [key, required, min, max, defaultVal] of integerAttrs) {
    try {
      console.log(`  ${key}`);
      await databases.createIntegerAttribute(
        DATABASE_ID, COLLECTION_ID, key, required, min, max, defaultVal
      );
      await waitForAttribute(key);
    } catch (e) {
      if (e.code === 409) {
        console.log(`    Already exists, skipping.`);
      } else {
        throw e;
      }
    }
  }

  console.log('Creating boolean attributes...');
  for (const [key, required, defaultVal] of booleanAttrs) {
    try {
      console.log(`  ${key}`);
      await databases.createBooleanAttribute(
        DATABASE_ID, COLLECTION_ID, key, required, defaultVal
      );
      await waitForAttribute(key);
    } catch (e) {
      if (e.code === 409) {
        console.log(`    Already exists, skipping.`);
      } else {
        throw e;
      }
    }
  }

  console.log('Creating datetime attributes...');
  for (const [key, required, defaultVal] of datetimeAttrs) {
    try {
      console.log(`  ${key}`);
      await databases.createDatetimeAttribute(
        DATABASE_ID, COLLECTION_ID, key, required, defaultVal
      );
      await waitForAttribute(key);
    } catch (e) {
      if (e.code === 409) {
        console.log(`    Already exists, skipping.`);
      } else {
        throw e;
      }
    }
  }

  // ── 3. Create Indexes ─────────────────────────────────────────────────
  console.log('Creating indexes...');

  const indexes = [
    // [key, type, attributes, orders]
    ['idx_eventDate', 'key', ['eventDate'], ['ASC']],
    ['idx_status', 'key', ['status'], ['ASC']],
    ['idx_status_eventDate', 'key', ['status', 'eventDate'], ['ASC', 'ASC']],
    ['idx_category', 'key', ['category'], ['ASC']],
    ['idx_category_eventDate', 'key', ['category', 'eventDate'], ['ASC', 'ASC']],
    ['idx_submittedBy', 'key', ['submittedBy'], ['ASC']],
    ['idx_approved_status_date', 'key', ['approved', 'status', 'eventDate'], ['ASC', 'ASC', 'ASC']],
    ['idx_isFeatured', 'key', ['isFeatured'], ['ASC']],
    ['idx_title_fulltext', 'fulltext', ['title'], ['ASC']],
  ];

  for (const [key, type, attributes, orders] of indexes) {
    try {
      console.log(`  ${key} (${type}: ${attributes.join(', ')})`);
      await databases.createIndex(
        DATABASE_ID, COLLECTION_ID, key, type, attributes, orders
      );
    } catch (e) {
      if (e.code === 409) {
        console.log(`    Already exists, skipping.`);
      } else {
        throw e;
      }
    }
  }

  console.log('\nDone! Events collection is ready.');
  console.log('  Database: ' + DATABASE_ID);
  console.log('  Collection: ' + COLLECTION_ID);
  console.log('  Attributes: 34');
  console.log('  Indexes: 9');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
