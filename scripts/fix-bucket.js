const sdk = require('node-appwrite');

const BUCKET_ID = 'event_media';

const apiKey = 'standard_96f11899ef5e4ae0f02c9824aaf24568b97bf6623030ff8f484015a8254ffb2ee522be1c0d87ece8e322c93e6e0e1087313e17303a1970d0b550da02a024b3c8f06258ca5ea6b108d4ccab5c50402cb973998a42e1f44660e0d1c7058fa92010b0636b8313ce3d37eba29cf6dcc4c3b45fc6771d97e4295c3c3e3455cc3016e1';

async function main() {
    const client = new sdk.Client()
        .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
        .setProject(process.env.APPWRITE_PROJECT || '68d29c8100366fc856a6')
        .setKey(apiKey);

    const storageService = new sdk.Storage(client);

    console.log('Updating event media storage bucket extensions...');
    try {
        const bucket = await storageService.getBucket(BUCKET_ID);
        await storageService.updateBucket(
            BUCKET_ID,
            bucket.name,
            bucket.$permissions,
            bucket.fileSecurity,
            bucket.enabled,
            bucket.maximumFileSize,
            ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'mp4', 'mov', 'webm'],
            bucket.compression,
            bucket.encryption,
            bucket.antivirus
        );
        console.log(`Bucket "${bucket.name}" updated with proper file extensions!`);
    } catch (e) {
        if (e.code === 404) {
            console.log(`Bucket "${BUCKET_ID}" not found.`);
        } else {
            console.error(e);
            throw e;
        }
    }
}

main();
