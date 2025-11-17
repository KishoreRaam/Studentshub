/**
 * Setup script for College Portal Appwrite collection
 * Run this script to automatically create the college_registrations collection
 *
 * Prerequisites:
 * 1. Set up your .env file with Appwrite credentials
 * 2. Install dependencies: npm install
 * 3. Run: node scripts/setup-college-portal.js
 */

const { Client, Databases, ID, Permission, Role } = require('node-appwrite');
require('dotenv').config();

const client = new Client();
const databases = new Databases(client);

// Configuration
const endpoint = process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const projectId = process.env.VITE_APPWRITE_PROJECT;
const databaseId = process.env.VITE_APPWRITE_DATABASE_ID;
const apiKey = process.env.APPWRITE_API_KEY; // Server API key with admin permissions

const COLLECTION_ID = 'college_registrations';

// Initialize client
client
  .setEndpoint(endpoint)
  .setProject(projectId);

if (apiKey) {
  client.setKey(apiKey);
}

/**
 * Create the college_registrations collection
 */
async function createCollection() {
  try {
    console.log('Creating college_registrations collection...');

    const collection = await databases.createCollection(
      databaseId,
      COLLECTION_ID,
      'College Registrations',
      [
        Permission.read(Role.any()),
        Permission.create(Role.any()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );

    console.log('✅ Collection created successfully!');
    return collection;
  } catch (error) {
    if (error.code === 409) {
      console.log('ℹ️  Collection already exists');
      return null;
    }
    throw error;
  }
}

/**
 * Create collection attributes
 */
async function createAttributes() {
  console.log('\nCreating collection attributes...');

  const attributes = [
    // String attributes
    { type: 'string', key: 'institutionName', size: 255, required: true },
    { type: 'string', key: 'institutionType', size: 100, required: true },
    { type: 'string', key: 'state', size: 100, required: true },
    { type: 'string', key: 'district', size: 100, required: true },
    { type: 'string', key: 'principalName', size: 255, required: true },
    { type: 'email', key: 'officialEmail', required: true },
    { type: 'string', key: 'phoneNumber', size: 15, required: true },
    { type: 'string', key: 'preferredDomain', size: 100, required: false },
    { type: 'string', key: 'timeline', size: 50, required: true },
    { type: 'string', key: 'currentEmailSystem', size: 100, required: false },
    { type: 'string', key: 'comments', size: 1000, required: false },
    { type: 'string', key: 'status', size: 50, required: true, default: 'pending' },

    // Integer attributes
    { type: 'integer', key: 'studentStrength', required: true },
    { type: 'integer', key: 'departments', required: true },

    // Datetime attribute
    { type: 'datetime', key: 'submittedAt', required: true },
  ];

  for (const attr of attributes) {
    try {
      if (attr.type === 'string') {
        await databases.createStringAttribute(
          databaseId,
          COLLECTION_ID,
          attr.key,
          attr.size,
          attr.required,
          attr.default,
          false
        );
      } else if (attr.type === 'email') {
        await databases.createEmailAttribute(
          databaseId,
          COLLECTION_ID,
          attr.key,
          attr.required,
          attr.default,
          false
        );
      } else if (attr.type === 'integer') {
        await databases.createIntegerAttribute(
          databaseId,
          COLLECTION_ID,
          attr.key,
          attr.required,
          null,
          null,
          attr.default
        );
      } else if (attr.type === 'datetime') {
        await databases.createDatetimeAttribute(
          databaseId,
          COLLECTION_ID,
          attr.key,
          attr.required,
          attr.default,
          false
        );
      }
      console.log(`  ✅ Created attribute: ${attr.key}`);

      // Wait a bit between attribute creation to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      if (error.code === 409) {
        console.log(`  ℹ️  Attribute already exists: ${attr.key}`);
      } else {
        console.error(`  ❌ Error creating attribute ${attr.key}:`, error.message);
      }
    }
  }

  console.log('\n✅ All attributes created/verified!');
}

/**
 * Create indexes for better performance
 */
async function createIndexes() {
  console.log('\nCreating indexes...');

  const indexes = [
    { key: 'status_idx', type: 'key', attributes: ['status'] },
    { key: 'submittedAt_idx', type: 'key', attributes: ['submittedAt'], orders: ['DESC'] },
    { key: 'state_idx', type: 'key', attributes: ['state'] },
    { key: 'email_idx', type: 'unique', attributes: ['officialEmail'] },
  ];

  for (const index of indexes) {
    try {
      await databases.createIndex(
        databaseId,
        COLLECTION_ID,
        index.key,
        index.type,
        index.attributes,
        index.orders
      );
      console.log(`  ✅ Created index: ${index.key}`);

      // Wait a bit between index creation
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      if (error.code === 409) {
        console.log(`  ℹ️  Index already exists: ${index.key}`);
      } else {
        console.error(`  ❌ Error creating index ${index.key}:`, error.message);
      }
    }
  }

  console.log('\n✅ All indexes created/verified!');
}

/**
 * Main setup function
 */
async function setup() {
  console.log('🚀 Starting College Portal Appwrite Setup\n');
  console.log(`Endpoint: ${endpoint}`);
  console.log(`Project ID: ${projectId}`);
  console.log(`Database ID: ${databaseId}\n`);

  if (!projectId || !databaseId) {
    console.error('❌ Error: Missing environment variables');
    console.error('Please set VITE_APPWRITE_PROJECT and VITE_APPWRITE_DATABASE_ID in your .env file');
    process.exit(1);
  }

  if (!apiKey) {
    console.warn('⚠️  Warning: APPWRITE_API_KEY not set');
    console.warn('This script requires a server API key with admin permissions');
    console.warn('You can create one in Appwrite Console → Settings → API Keys\n');
  }

  try {
    await createCollection();
    await createAttributes();
    await createIndexes();

    console.log('\n✅ College Portal setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Verify the collection in Appwrite Console');
    console.log('2. Test the registration form at http://localhost:3000/college-portal');
    console.log('3. Check submitted registrations in Appwrite Console → Databases → college_registrations');
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run setup
setup();
