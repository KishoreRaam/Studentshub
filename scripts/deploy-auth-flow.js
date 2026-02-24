const sdk = require('node-appwrite');

const DATABASE_ID = '68d3d183000b0146b221';
const USERS_META_COLLECTION_ID = 'users_meta';
const EVENTS_COLLECTION_ID = 'events';

const client = new sdk.Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('68d29c8100366fc856a6')
    .setKey('standard_96f11899ef5e4ae0f02c9824aaf24568b97bf6623030ff8f484015a8254ffb2ee522be1c0d87ece8e322c93e6e0e1087313e17303a1970d0b550da02a024b3c8f06258ca5ea6b108d4ccab5c50402cb973998a42e1f44660e0d1c7058fa92010b0636b8313ce3d37eba29cf6dcc4c3b45fc6771d97e4295c3c3e3455cc3016e1');

const databases = new sdk.Databases(client);
const users = new sdk.Users(client);

// Helper function to wait for attribute status
async function waitForAttribute(dbId, collId, key) {
    for (let i = 0; i < 30; i++) {
        try {
            const attr = await databases.getAttribute(dbId, collId, key);
            if (attr.status === 'available') return;
        } catch (e) { }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

async function main() {
    console.log('--- Setting up Auth & Admin Flow ---');

    // 1. Setup users_meta Collection
    try {
        await databases.createCollection(
            DATABASE_ID,
            USERS_META_COLLECTION_ID,
            'Users Meta',
            [
                sdk.Permission.read(sdk.Role.users()),
                sdk.Permission.create(sdk.Role.users()),
                sdk.Permission.update(sdk.Role.users()),
            ],
            true, true
        );
        console.log('[x] Created users_meta collection.');
    } catch (e) {
        if (e.code === 409) console.log('[-] users_meta collection already exists.');
        else throw e;
    }

    // Set attributes
    const attrs = [
        { key: 'role', size: 50, required: true, defaultVal: null },
        { key: 'displayName', size: 255, required: false, defaultVal: null },
        { key: 'email', size: 255, required: false, defaultVal: null },
    ];
    for (const a of attrs) {
        try {
            await databases.createStringAttribute(DATABASE_ID, USERS_META_COLLECTION_ID, a.key, a.size, a.required, a.defaultVal, false);
            await waitForAttribute(DATABASE_ID, USERS_META_COLLECTION_ID, a.key);
            console.log(`[x] Created attribute ${a.key}`);
        } catch (e) { if (e.code !== 409) throw e; }
    }

    // 2. Determine User to promote to Admin 
    const userListResponse = await users.list();
    if (userListResponse.users.length === 0) {
        console.log('[!] No users found in Appwrite Project. Please log in or create an account via the UI first!');
    } else {
        // Make ALL currently registered users admins (or just the first one)
        for (const user of userListResponse.users) {
            console.log(`\nPromoting user to ADMIN: ${user.name || user.email} (${user.$id})`);
            try {
                await databases.createDocument(
                    DATABASE_ID,
                    USERS_META_COLLECTION_ID,
                    user.$id,
                    { role: 'admin', displayName: user.name, email: user.email },
                    [
                        sdk.Permission.read(sdk.Role.user(user.$id)),
                        sdk.Permission.update(sdk.Role.user(user.$id)),
                        sdk.Permission.read(sdk.Role.users()),
                    ]
                );
                console.log(`[x] Created admin document for user ${user.$id}.`);
            } catch (e) {
                if (e.code === 409) {
                    await databases.updateDocument(
                        DATABASE_ID, USERS_META_COLLECTION_ID, user.$id,
                        { role: 'admin', displayName: user.name, email: user.email }
                    );
                    console.log(`[x] Updated existing admin document for user ${user.$id}.`);
                }
            }
        }
    }

    // 3. Update Events Collection Permissions
    console.log('\n--- Updating Events Collection Permissions ---');
    try {
        await databases.updateCollection(
            DATABASE_ID,
            EVENTS_COLLECTION_ID,
            'Events', // Name
            [
                sdk.Permission.read(sdk.Role.any()), // Anyone can view events
                sdk.Permission.create(sdk.Role.users()), // logged-in users can subimt
                sdk.Permission.update(sdk.Role.users()), // required for organizers, admins
                sdk.Permission.delete(sdk.Role.users())
            ],
            true, // docSecurity
            true  // enabled
        );
        console.log('[x] Updated events collection permissions successfully.');
    } catch (e) {
        console.error('Failed to update events collection:', e);
    }

    console.log('\n✅ Setup completed successfully!');
}

main().catch(console.error);
