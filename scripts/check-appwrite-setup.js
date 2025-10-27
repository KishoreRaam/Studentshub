// Script to check Appwrite setup and get collection IDs
// Run this script to verify your Appwrite configuration

import { Client, Databases } from 'appwrite';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const client = new Client();
const databases = new Databases(client);

client
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT || '');

async function checkSetup() {
  console.log('\n🔍 Checking Appwrite Setup...\n');
  console.log('Endpoint:', process.env.VITE_APPWRITE_ENDPOINT);
  console.log('Project ID:', process.env.VITE_APPWRITE_PROJECT);
  console.log('Database ID:', process.env.VITE_APPWRITE_DATABASE_ID);
  console.log('\n---\n');

  try {
    // List all databases
    console.log('📦 Fetching databases...');
    const dbList = await databases.list();

    if (dbList.databases.length === 0) {
      console.log('❌ No databases found! Please create a database in Appwrite console.');
      console.log('\nSteps:');
      console.log('1. Go to https://cloud.appwrite.io/console');
      console.log('2. Navigate to Databases');
      console.log('3. Create a new database');
      console.log('4. Copy the Database ID and update .env file\n');
      return;
    }

    console.log(`✅ Found ${dbList.databases.length} database(s):\n`);
    dbList.databases.forEach(db => {
      console.log(`  - Name: ${db.name}`);
      console.log(`    ID: ${db.$id}`);
    });

    // Check collections in the configured database
    const databaseId = process.env.VITE_APPWRITE_DATABASE_ID;

    if (!databaseId) {
      console.log('\n⚠️  No database ID configured in .env file');
      console.log('Please update VITE_APPWRITE_DATABASE_ID with one of the IDs above');
      return;
    }

    console.log(`\n📂 Fetching collections from database: ${databaseId}...\n`);

    try {
      const collections = await databases.listCollections(databaseId);

      if (collections.collections.length === 0) {
        console.log('❌ No collections found!');
        console.log('\n📝 You need to create these collections:');
        console.log('  1. users (for user profiles)');
        console.log('  2. perks (for perks data)');
        console.log('  3. saved_perks (for saved perks)');
        console.log('\nSee README for collection schema details.\n');
        return;
      }

      console.log(`✅ Found ${collections.collections.length} collection(s):\n`);
      collections.collections.forEach(col => {
        console.log(`  - Name: ${col.name}`);
        console.log(`    ID: ${col.$id}`);
        console.log(`    Attributes: ${col.attributes.length}`);
        console.log('');
      });

      console.log('\n📋 Update your .env file with these IDs:');
      console.log('---');

      collections.collections.forEach(col => {
        const name = col.name.toUpperCase().replace(/[^A-Z0-9]/g, '_');
        console.log(`VITE_APPWRITE_COLLECTION_${name}=${col.$id}`);
      });
      console.log('---\n');

    } catch (error) {
      if (error.code === 404) {
        console.log('❌ Database not found! The configured database ID might be incorrect.');
        console.log('Available databases are listed above.');
      } else {
        throw error;
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Verify your VITE_APPWRITE_PROJECT ID is correct');
    console.log('2. Make sure you have proper permissions');
    console.log('3. Check if your API endpoint is correct');
  }
}

checkSetup();
