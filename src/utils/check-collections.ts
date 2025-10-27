// Utility to check and display Appwrite collection IDs
// You can call this from browser console or create a temporary page

import { databases, DATABASE_ID } from '../lib/appwrite';

export async function checkCollections() {
  console.log('🔍 Checking Appwrite Collections...\n');
  console.log('Database ID:', DATABASE_ID);

  try {
    const collections = await databases.listCollections(DATABASE_ID);

    if (collections.collections.length === 0) {
      console.error('❌ No collections found!');
      console.log('\nYou need to create these collections in Appwrite Console:');
      console.log('1. users (for user profiles)');
      console.log('2. perks (for perks data)');
      console.log('3. saved_perks (for saved perks)');
      return null;
    }

    console.log(`✅ Found ${collections.collections.length} collection(s):\n`);

    const collectionIds: { [key: string]: string } = {};

    collections.collections.forEach(col => {
      console.log(`📁 ${col.name}`);
      console.log(`   ID: ${col.$id}`);
      console.log(`   Attributes: ${col.attributes.length}\n`);

      collectionIds[col.name] = col.$id;
    });

    console.log('📋 Copy these to your .env file:');
    console.log('---');
    Object.entries(collectionIds).forEach(([name, id]) => {
      const envVar = `VITE_APPWRITE_COLLECTION_${name.toUpperCase()}`;
      console.log(`${envVar}=${id}`);
    });
    console.log('---\n');

    return collectionIds;

  } catch (error: any) {
    console.error('❌ Error:', error.message);

    if (error.code === 404) {
      console.log('\n⚠️ Database not found!');
      console.log('Make sure VITE_APPWRITE_DATABASE_ID in .env is correct');
    }

    return null;
  }
}

// Auto-run if in development
if (import.meta.env.DEV) {
  console.log('💡 Tip: Run checkCollections() in console to see your collection IDs');
}
