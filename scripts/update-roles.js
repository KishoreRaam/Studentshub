const sdk = require('node-appwrite');

const DATABASE_ID = '68d3d183000b0146b221';
const USERS_META_COLLECTION_ID = 'users_meta';

const client = new sdk.Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('68d29c8100366fc856a6')
    .setKey('standard_96f11899ef5e4ae0f02c9824aaf24568b97bf6623030ff8f484015a8254ffb2ee522be1c0d87ece8e322c93e6e0e1087313e17303a1970d0b550da02a024b3c8f06258ca5ea6b108d4ccab5c50402cb973998a42e1f44660e0d1c7058fa92010b0636b8313ce3d37eba29cf6dcc4c3b45fc6771d97e4295c3c3e3455cc3016e1');

const databases = new sdk.Databases(client);
const users = new sdk.Users(client);

async function main() {
    const adminIds = ['68ff4c5816bf5338810a', '68fe7498057792229b3d'];

    const userListResponse = await users.list();
    for (const user of userListResponse.users) {
        const role = adminIds.includes(user.$id) ? 'admin' : 'student';
        console.log(`Setting role ${role} for user ${user.$id} (${user.name})`);
        try {
            await databases.updateDocument(
                DATABASE_ID, USERS_META_COLLECTION_ID, user.$id,
                { role }
            );
        } catch (e) {
            if (e.code === 404) {
                // Document doesn't exist, create it
                await databases.createDocument(
                    DATABASE_ID,
                    USERS_META_COLLECTION_ID,
                    user.$id,
                    { role, displayName: user.name, email: user.email },
                    [
                        sdk.Permission.read(sdk.Role.user(user.$id)),
                        sdk.Permission.update(sdk.Role.user(user.$id)),
                        sdk.Permission.read(sdk.Role.users()),
                    ]
                );
            } else {
                console.error(e);
            }
        }
    }
}
main();
