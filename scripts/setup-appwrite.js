#!/usr/bin/env node
/**
 * Perk Savings Tracker — Appwrite Collection Setup Script
 *
 * Creates two collections:
 *   1. perk_redemptions   — tracks every perk click & claim
 *   2. user_savings_summary — aggregated savings per user
 *
 * Prerequisites:
 *   APPWRITE_API_KEY env var must be set (Server API key with databases scope)
 *
 * Usage:
 *   APPWRITE_API_KEY=<key> node scripts/setup-appwrite.js
 */

const sdk = require('node-appwrite');

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || '68d3d183000b0146b221';
const ENDPOINT    = process.env.APPWRITE_ENDPOINT    || 'https://fra.cloud.appwrite.io/v1';
const PROJECT     = process.env.APPWRITE_PROJECT     || '68d29c8100366fc856a6';

const REDEMPTIONS_COLLECTION_ID = 'perk_redemptions';
const SUMMARY_COLLECTION_ID     = 'user_savings_summary';

async function main() {
  if (!process.env.APPWRITE_API_KEY) {
    console.error('Error: APPWRITE_API_KEY environment variable is required.');
    console.error('Create a Server API key in Appwrite Console → Settings → API Keys');
    console.error('Required scopes: databases.read, databases.write, collections.read,');
    console.error('                 collections.write, attributes.read, attributes.write, indexes.write');
    process.exit(1);
  }

  const client = new sdk.Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new sdk.Databases(client);

  /** Poll until an attribute reaches "available" status */
  async function waitForAttribute(collectionId, key, maxAttempts = 30) {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const attr = await databases.getAttribute(DATABASE_ID, collectionId, key);
        if (attr.status === 'available') return;
      } catch (_) {}
      await new Promise(r => setTimeout(r, 1000));
    }
    console.warn(`  Warning: attribute "${key}" did not reach 'available' status in time`);
  }

  /** Create a collection, skip if already exists */
  async function createCollection(id, name) {
    try {
      await databases.createCollection(
        DATABASE_ID,
        id,
        name,
        [
          sdk.Permission.read(sdk.Role.users()),
          sdk.Permission.create(sdk.Role.users()),
          sdk.Permission.update(sdk.Role.users()),
          sdk.Permission.delete(sdk.Role.users()),
        ],
        true,  // documentSecurity
        true   // enabled
      );
      console.log(`  Collection "${id}" created.`);
    } catch (e) {
      if (e.code === 409) {
        console.log(`  Collection "${id}" already exists, continuing...`);
      } else {
        throw e;
      }
    }
  }

  /** Create a string attribute, skip if already exists */
  async function createString(collectionId, key, size, required, defaultVal = null, array = false) {
    try {
      console.log(`  [string] ${key} (size=${size}, required=${required})`);
      await databases.createStringAttribute(DATABASE_ID, collectionId, key, size, required, defaultVal, array);
      await waitForAttribute(collectionId, key);
    } catch (e) {
      if (e.code === 409) { console.log(`    Already exists, skipping.`); }
      else { throw e; }
    }
  }

  /** Create a float attribute, skip if already exists */
  async function createFloat(collectionId, key, required, defaultVal = null) {
    try {
      console.log(`  [float] ${key} (required=${required})`);
      await databases.createFloatAttribute(DATABASE_ID, collectionId, key, required, undefined, undefined, defaultVal);
      await waitForAttribute(collectionId, key);
    } catch (e) {
      if (e.code === 409) { console.log(`    Already exists, skipping.`); }
      else { throw e; }
    }
  }

  /** Create an integer attribute, skip if already exists */
  async function createInteger(collectionId, key, required, defaultVal = null) {
    try {
      console.log(`  [integer] ${key} (required=${required})`);
      await databases.createIntegerAttribute(DATABASE_ID, collectionId, key, required, undefined, undefined, defaultVal);
      await waitForAttribute(collectionId, key);
    } catch (e) {
      if (e.code === 409) { console.log(`    Already exists, skipping.`); }
      else { throw e; }
    }
  }

  /** Create a datetime attribute, skip if already exists */
  async function createDatetime(collectionId, key, required) {
    try {
      console.log(`  [datetime] ${key} (required=${required})`);
      await databases.createDatetimeAttribute(DATABASE_ID, collectionId, key, required);
      await waitForAttribute(collectionId, key);
    } catch (e) {
      if (e.code === 409) { console.log(`    Already exists, skipping.`); }
      else { throw e; }
    }
  }

  /** Create an enum attribute, skip if already exists */
  async function createEnum(collectionId, key, elements, required, defaultVal = null) {
    try {
      console.log(`  [enum] ${key} (elements=${elements.join('|')})`);
      await databases.createEnumAttribute(DATABASE_ID, collectionId, key, elements, required, defaultVal);
      await waitForAttribute(collectionId, key);
    } catch (e) {
      if (e.code === 409) { console.log(`    Already exists, skipping.`); }
      else { throw e; }
    }
  }

  /** Create an index, skip if already exists */
  async function createIndex(collectionId, indexId, type, attributes, orders) {
    try {
      await databases.createIndex(DATABASE_ID, collectionId, indexId, type, attributes, orders);
      console.log(`  Index "${indexId}" created.`);
    } catch (e) {
      if (e.code === 409) { console.log(`  Index "${indexId}" already exists, skipping.`); }
      else { throw e; }
    }
  }

  // ══════════════════════════════════════════════════════════════════
  // 1. perk_redemptions
  // ══════════════════════════════════════════════════════════════════
  console.log('\n── Creating collection: perk_redemptions ──');
  await createCollection(REDEMPTIONS_COLLECTION_ID, 'Perk Redemptions');

  console.log('Creating attributes...');
  await createString(REDEMPTIONS_COLLECTION_ID,  'user_id',      100,  true);
  await createString(REDEMPTIONS_COLLECTION_ID,  'perk_id',      100,  true);
  await createString(REDEMPTIONS_COLLECTION_ID,  'perk_name',    255,  true);
  await createFloat(REDEMPTIONS_COLLECTION_ID,   'saved_amount',       true);
  await createEnum(REDEMPTIONS_COLLECTION_ID,    'status', ['attempted', 'claimed', 'skipped'], true);
  await createDatetime(REDEMPTIONS_COLLECTION_ID,'attempted_at',       true);
  await createDatetime(REDEMPTIONS_COLLECTION_ID,'claimed_at',         false);
  await createString(REDEMPTIONS_COLLECTION_ID,  'partner_name', 255,  false);

  console.log('Creating indexes...');
  await createIndex(REDEMPTIONS_COLLECTION_ID, 'idx_user_id',        'key',    ['user_id'],          ['ASC']);
  await createIndex(REDEMPTIONS_COLLECTION_ID, 'idx_user_status',    'key',    ['user_id', 'status'],['ASC', 'ASC']);
  await createIndex(REDEMPTIONS_COLLECTION_ID, 'idx_attempted_at',   'key',    ['attempted_at'],     ['DESC']);

  // ══════════════════════════════════════════════════════════════════
  // 2. user_savings_summary
  // ══════════════════════════════════════════════════════════════════
  console.log('\n── Creating collection: user_savings_summary ──');
  await createCollection(SUMMARY_COLLECTION_ID, 'User Savings Summary');

  console.log('Creating attributes...');
  await createString(SUMMARY_COLLECTION_ID,  'user_id',          100, true);
  await createFloat(SUMMARY_COLLECTION_ID,   'total_saved',           false, 0);
  await createInteger(SUMMARY_COLLECTION_ID, 'total_claimed',         false, 0);
  await createFloat(SUMMARY_COLLECTION_ID,   'saved_this_month',      false, 0);
  await createDatetime(SUMMARY_COLLECTION_ID,'last_updated',          false);

  console.log('Creating indexes...');
  await createIndex(SUMMARY_COLLECTION_ID, 'idx_user_id_unique', 'unique', ['user_id'], ['ASC']);

  // ══════════════════════════════════════════════════════════════════
  // Done
  // ══════════════════════════════════════════════════════════════════
  console.log('\n✓ Setup complete!');
  console.log('  Add these to your .env file:');
  console.log(`  VITE_APPWRITE_COLLECTION_PERK_REDEMPTIONS=${REDEMPTIONS_COLLECTION_ID}`);
  console.log(`  VITE_APPWRITE_COLLECTION_USER_SAVINGS_SUMMARY=${SUMMARY_COLLECTION_ID}`);
}

main().catch(err => {
  console.error('\nFatal error:', err.message || err);
  process.exit(1);
});
