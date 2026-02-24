#!/usr/bin/env node
/**
 * Appwrite users_meta Collection Setup Script
 *
 * Creates the "users_meta" collection with a "role" attribute.
 * Also creates the first admin document for a given user ID.
 *
 * Prerequisites:
 *   npm install node-appwrite  (already installed)
 *
 * Usage:
 *   node scripts/create-users-meta-collection.js
 *
 * To also create an admin user:
 *   ADMIN_USER_ID=<user-id> node scripts/create-users-meta-collection.js
 *
 * The script reads APPWRITE_ENDPOINT, APPWRITE_PROJECT, APPWRITE_API_KEY
 * from environment variables or falls back to project defaults.
 */

const sdk = require('node-appwrite');

const DATABASE_ID = '68d3d183000b0146b221';
const COLLECTION_ID = 'users_meta';

async function main() {
  const client = new sdk.Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT || '68d29c8100366fc856a6')
    .setKey(process.env.APPWRITE_API_KEY);

  if (!process.env.APPWRITE_API_KEY) {
    console.error('Error: APPWRITE_API_KEY environment variable is required.');
    console.error('Create a Server API key in Appwrite Console → Settings → API Keys');
    console.error('Required scopes: databases.read, databases.write, collections.read, collections.write, attributes.read, attributes.write');
    process.exit(1);
  }

  const databases = new sdk.Databases(client);

  // Helper: wait for attribute to be available
  async function waitForAttribute(key, maxAttempts = 30) {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const attr = await databases.getAttribute(DATABASE_ID, COLLECTION_ID, key);
        if (attr.status === 'available') return;
      } catch (_) {}
      await new Promise(r => setTimeout(r, 1000));
    }
    console.warn(`  Warning: attribute "${key}" did not reach 'available' status in time`);
  }

  // ── 1. Create Collection ──────────────────────────────────────────────
  console.log('Creating users_meta collection...');
  try {
    await databases.createCollection(
      DATABASE_ID,
      COLLECTION_ID,
      'Users Meta',
      [
        sdk.Permission.read(sdk.Role.users()),
        sdk.Permission.create(sdk.Role.users()),
        sdk.Permission.update(sdk.Role.users()),
      ],
      true,  // documentSecurity
      true   // enabled
    );
    console.log('  Collection "users_meta" created.');
  } catch (e) {
    if (e.code === 409) {
      console.log('  Collection "users_meta" already exists, continuing...');
    } else {
      throw e;
    }
  }

  // ── 2. Create Attributes ──────────────────────────────────────────────
  console.log('Creating attributes...');

  const attrs = [
    { key: 'role', size: 50, required: true, defaultVal: 'user' },
    { key: 'displayName', size: 255, required: false, defaultVal: null },
    { key: 'email', size: 255, required: false, defaultVal: null },
  ];

  for (const { key, size, required, defaultVal } of attrs) {
    try {
      console.log(`  ${key} (size=${size})`);
      await databases.createStringAttribute(
        DATABASE_ID, COLLECTION_ID, key, size, required, defaultVal, false
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
  try {
    await databases.createIndex(
      DATABASE_ID, COLLECTION_ID, 'idx_role', 'key', ['role'], ['ASC']
    );
    console.log('  idx_role created.');
  } catch (e) {
    if (e.code === 409) {
      console.log('  idx_role already exists, skipping.');
    } else {
      throw e;
    }
  }

  // ── 4. Create admin document (optional) ───────────────────────────────
  const adminUserId = process.env.ADMIN_USER_ID;
  if (adminUserId) {
    console.log(`\nCreating admin document for user: ${adminUserId}`);
    try {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        adminUserId, // use user's ID as document ID for easy lookup
        { role: 'admin' },
        [
          sdk.Permission.read(sdk.Role.user(adminUserId)),
          sdk.Permission.update(sdk.Role.user(adminUserId)),
          sdk.Permission.read(sdk.Role.users()),
        ]
      );
      console.log('  Admin document created.');
    } catch (e) {
      if (e.code === 409) {
        console.log('  Admin document already exists, skipping.');
      } else {
        throw e;
      }
    }
  } else {
    console.log('\nTip: To create an admin user, run:');
    console.log('  ADMIN_USER_ID=<user-id> APPWRITE_API_KEY=<key> node scripts/create-users-meta-collection.js');
  }

  console.log('\nDone! users_meta collection is ready.');
  console.log('  Database:', DATABASE_ID);
  console.log('  Collection:', COLLECTION_ID);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
