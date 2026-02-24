const sdk = require('node-appwrite');

const DATABASE_ID = '68d3d183000b0146b221';
const COLLECTION_ID = 'events';

const client = new sdk.Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT || '68d29c8100366fc856a6')
    .setKey(process.env.APPWRITE_API_KEY || 'standard_96f11899ef5e4ae0f02c9824aaf24568b97bf6623030ff8f484015a8254ffb2ee522be1c0d87ece8e322c93e6e0e1087313e17303a1970d0b550da02a024b3c8f06258ca5ea6b108d4ccab5c50402cb973998a42e1f44660e0d1c7058fa92010b0636b8313ce3d37eba29cf6dcc4c3b45fc6771d97e4295c3c3e3455cc3016e1');

const databases = new sdk.Databases(client);

async function main() {
    console.log('Starting schema update...');
    try {
        await databases.deleteIndex(DATABASE_ID, COLLECTION_ID, 'idx_category');
        console.log('Deleted index idx_category');
    } catch (e) { console.log('Index idx_category not found'); }

    try {
        await databases.deleteIndex(DATABASE_ID, COLLECTION_ID, 'idx_category_eventDate');
        console.log('Deleted index idx_category_eventDate');
    } catch (e) { console.log('Index idx_category_eventDate not found'); }

    try {
        await databases.deleteAttribute(DATABASE_ID, COLLECTION_ID, 'category');
        console.log('Deleted category attribute');
    } catch (e) {
        if (e.code !== 404) console.log('Error deleting attribute category:', e.message);
        else console.log('Attribute category not found');
    }

    console.log('Waiting for attribute deletion to reflect...');
    let deleted = false;
    for (let i = 0; i < 30; i++) {
        try {
            await databases.getAttribute(DATABASE_ID, COLLECTION_ID, 'category');
            await new Promise(r => setTimeout(r, 2000));
        } catch (e) {
            if (e.code === 404) {
                deleted = true;
                break;
            }
        }
    }

    if (deleted) {
        console.log('Attribute deleted. Creating updated category attribute (array=true)...');
        try {
            const NEW_CATEGORIES = [
                'Webinar', 'Hackathon', 'Workshop', 'Conference',
                'Cultural', 'Sports', 'Technical', 'Seminar', 'Competition', 'Symposium'
            ];
            // Changed from enum to string array to allow arbitrary categories or use enum with array: true
            await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'category', 100, true, null, true);
            console.log('Category attribute recreated as string array!');

            console.log('Waiting before recreating indexes...');
            await new Promise(r => setTimeout(r, 2000));
            let available = false;
            for (let i = 0; i < 30; i++) {
                try {
                    const attr = await databases.getAttribute(DATABASE_ID, COLLECTION_ID, 'category');
                    if (attr.status === 'available') { available = true; break; }
                } catch (e) { }
                await new Promise(r => setTimeout(r, 2000));
            }

            if (available) {
                await databases.createIndex(DATABASE_ID, COLLECTION_ID, 'idx_category', 'key', ['category'], ['ASC']);
                await databases.createIndex(DATABASE_ID, COLLECTION_ID, 'idx_category_eventDate', 'key', ['category', 'eventDate'], ['ASC', 'ASC']);
                console.log('Indexes recreated!');
            } else {
                console.log('Attribute did not become available in time to create indexes.');
            }
        } catch (e) {
            console.log('Error creating attribute', e);
        }
    } else {
        console.log('Timed out waiting for category deletion.');
    }
}

main().catch(console.error);
