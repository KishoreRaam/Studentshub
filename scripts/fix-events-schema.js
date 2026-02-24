const sdk = require('node-appwrite');

const DATABASE_ID = '68d3d183000b0146b221';
const COLLECTION_ID = 'events';

const apiKey = 'standard_96f11899ef5e4ae0f02c9824aaf24568b97bf6623030ff8f484015a8254ffb2ee522be1c0d87ece8e322c93e6e0e1087313e17303a1970d0b550da02a024b3c8f06258ca5ea6b108d4ccab5c50402cb973998a42e1f44660e0d1c7058fa92010b0636b8313ce3d37eba29cf6dcc4c3b45fc6771d97e4295c3c3e3455cc3016e1';

async function main() {
    const client = new sdk.Client()
        .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
        .setProject(process.env.APPWRITE_PROJECT || '68d29c8100366fc856a6')
        .setKey(apiKey);

    const databases = new sdk.Databases(client);

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    async function syncAttribute(fn) {
        try {
            await fn();
            console.log('Successfully created attribute');
            await sleep(2000);
        } catch (err) {
            if (err.code === 409) {
                console.log('Attribute already exists');
            } else if (err.code === 429) {
                console.log('Rate limit hit, waiting 3s...');
                await sleep(3000);
                await syncAttribute(fn);
            } else {
                console.error('Failed to create attribute:', err.message);
            }
        }
    }

    // 1. "category" ENUM
    await syncAttribute(() =>
        databases.createEnumAttribute(DATABASE_ID, COLLECTION_ID, 'category', ['Webinar', 'Hackathon', 'Workshop', 'Conference'], true, null)
    );

    // 2. "eventType" string
    await syncAttribute(() =>
        databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'eventType', 255, false, null, false)
    );

    // 3. "approved" boolean
    await syncAttribute(() =>
        databases.createBooleanAttribute(DATABASE_ID, COLLECTION_ID, 'approved', false, false)
    );

    // 4. "createdByUserId" string
    await syncAttribute(() =>
        databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'createdByUserId', 255, false, null, false)
    );

    console.log('Schema sync complete.');
}

main();
