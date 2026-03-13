const { Client, Storage } = require('node-appwrite');
require('dotenv').config();

const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
    .setProject(process.env.VITE_APPWRITE_PROJECT)
    .setKey(process.env.APPWRITE_API_KEY);

const storage = new Storage(client);

async function updateBucket() {
    if (!process.env.APPWRITE_API_KEY) {
        console.error("❌ ERROR: APPWRITE_API_KEY is missing in your .env file.");
        console.error("Please go to Appwrite Console -> Overview -> Integrate with your server -> API Keys.");
        console.error("Create a new API Key with 'storage.read' and 'storage.write' scopes, and add it to `.env` as APPWRITE_API_KEY=your_key");
        process.exit(1);
    }
    
    const bucketId = process.env.VITE_APPWRITE_BUCKET_EVENT_VIDEOS || 'event_videos';
    
    try {
        console.log(`🔍 Fetching current configuration for bucket: ${bucketId}...`);
        const bucket = await storage.getBucket(bucketId);
        
        console.log(`📁 Current Allowed Extensions:`, bucket.allowedFileExtensions.length ? bucket.allowedFileExtensions : '[All]');
        
        const newExtensions = ['mp4', 'webm', 'mov', 'quicktime'];
        // Merge existing combinations without duplicates
        const updatedExtensions = [...new Set([...bucket.allowedFileExtensions, ...newExtensions])];
        
        console.log(`🚀 Updating allowed extensions to include video formats...`);
        
        await storage.updateBucket({
            bucketId: bucket.$id,
            name: bucket.name,
            permissions: bucket.$permissions,
            fileSecurity: bucket.fileSecurity,
            enabled: bucket.enabled,
            maximumFileSize: bucket.maximumFileSize,
            allowedFileExtensions: updatedExtensions,
            compression: bucket.compression,
            encryption: bucket.encryption,
            antivirus: bucket.antivirus
        });
        
        console.log("✅ Bucket updated successfully! You can now upload promo videos correctly.");
    } catch (error) {
        console.error("❌ Failed to update bucket:", error.message);
    }
}

updateBucket();
