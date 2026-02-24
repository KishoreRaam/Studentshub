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

    async function waitForAttribute(key, maxAttempts = 30) {
        for (let i = 0; i < maxAttempts; i++) {
            try {
                const attr = await databases.getAttribute(DATABASE_ID, COLLECTION_ID, key);
                if (attr.status === 'available') return;
            } catch (_) {
            }
            await sleep(1000);
        }
        console.warn(`  Warning: attribute "${key}" did not reach 'available' status in time`);
    }

    async function syncAttribute(fn, key) {
        try {
            await fn();
            console.log(`Successfully created attribute: ${key}`);
            await waitForAttribute(key);
        } catch (err) {
            if (err.code === 409) {
                console.log(`Attribute already exists: ${key}`);
            } else if (err.code === 429) {
                console.log(`Rate limit hit for ${key}, waiting 3s...`);
                await sleep(3000);
                await syncAttribute(fn, key);
            } else {
                console.error(`Failed to create attribute ${key}:`, err.message);
            }
        }
    }

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

    for (const [key, size, required, defaultVal, array] of stringAttrs) {
        await syncAttribute(() =>
            databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, key, size, required, defaultVal, array),
            key
        );
    }

    const enumAttrs = [
        // [key, elements, required, defaultValue]
        ['category', ['Webinar', 'Hackathon', 'Workshop', 'Conference'], true, null],
        ['status', ['Live Now', 'Upcoming', 'Registration Open', 'Registration Closed', 'Completed'], true, 'Upcoming'],
        ['submitterType', ['student', 'college_admin', 'platform_admin'], false, 'student'],
    ];

    for (const [key, elements, required, defaultVal] of enumAttrs) {
        await syncAttribute(() =>
            databases.createEnumAttribute(DATABASE_ID, COLLECTION_ID, key, elements, required, defaultVal),
            key
        );
    }

    const integerAttrs = [
        // [key, required, min, max, defaultValue]
        ['participantCount', false, 0, null, 0],
        ['maxParticipants', false, 0, null, null],
    ];

    for (const [key, required, min, max, defaultVal] of integerAttrs) {
        await syncAttribute(() =>
            databases.createIntegerAttribute(DATABASE_ID, COLLECTION_ID, key, required, min, max, defaultVal),
            key
        );
    }

    const booleanAttrs = [
        // [key, required, defaultValue]
        ['isPopular', false, false],
        ['isFeatured', false, false],
        ['certificateOffered', false, false],
        ['isPaid', false, false],
        ['approved', false, false],
    ];

    for (const [key, required, defaultVal] of booleanAttrs) {
        await syncAttribute(() =>
            databases.createBooleanAttribute(DATABASE_ID, COLLECTION_ID, key, required, defaultVal),
            key
        );
    }

    const datetimeAttrs = [
        // [key, required, defaultValue]
        ['eventDate', true, null],
    ];

    for (const [key, required, defaultVal] of datetimeAttrs) {
        await syncAttribute(() =>
            databases.createDatetimeAttribute(DATABASE_ID, COLLECTION_ID, key, required, defaultVal),
            key
        );
    }

    // 3. Create Indexes
    console.log('Syncing indexes...');
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
            await databases.createIndex(DATABASE_ID, COLLECTION_ID, key, type, attributes, orders);
            console.log(`Successfully created index: ${key}`);
        } catch (e) {
            if (e.code === 409) {
                console.log(`Index already exists: ${key}`);
            } else {
                console.error(`Failed to create index ${key}:`, e.message);
            }
        }
    }

    console.log('Schema complete!');
}

main();
