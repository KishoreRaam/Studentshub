'use strict';

const path = require('path');
const fs   = require('fs');

const {
  loadEnv, downloadImageBuffer, uploadImageToAppwrite,
  searchUnsplashImage,
} = require('./utils');

// Load env FIRST before requiring appwrite-client
loadEnv();

const { databases, DATABASE_ID, COLLECTION_ID } = require('./appwrite-client');
const { FALLBACK_IMAGES } = require('./config');

let Query;
try {
  Query = require('node-appwrite').Query;
} catch {
  Query = {
    isNull:   f => `isNull(${f})`,
    limit:    n => `limit(${n})`,
    offset:   n => `offset(${n})`,
  };
}

// CLI flags
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const limitIdx = args.indexOf('--limit');
const LIMIT = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : 45;

const STATIC_URLS = new Set(Object.values(FALLBACK_IMAGES));

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchAllNeedingImages() {
  const docs = [];
  let offset = 0;
  const pageSize = 100;

  while (true) {
    const { documents, total } = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [
        Query.isNull('posterFileId'),
        Query.limit(pageSize),
        Query.offset(offset),
      ]
    );
    docs.push(...documents);
    offset += documents.length;
    if (offset >= total || documents.length === 0) break;
  }

  // Client-side filter: skip if thumbnailUrl is set and is NOT a static fallback
  return docs.filter(doc => {
    if (doc.posterFileId) return false;
    if (!doc.thumbnailUrl) return true;
    return STATIC_URLS.has(doc.thumbnailUrl);
  });
}

async function main() {
  if (!process.env.UNSPLASH_ACCESS_KEY) {
    console.error('ERROR: UNSPLASH_ACCESS_KEY environment variable is not set.');
    process.exit(1);
  }
  if (!DATABASE_ID || !COLLECTION_ID) {
    console.error('ERROR: DATABASE_ID or EVENTS_COLLECTION_ID is not set.');
    process.exit(1);
  }

  const runDate = new Date().toISOString().slice(0, 10);
  const report = {
    runDate,
    dryRun: DRY_RUN,
    processed: 0,
    updated: 0,
    skipped: 0,
    errors: [],
  };

  console.log('\n══════════════════════════════════════════');
  console.log('  StudentsHub — Fix Event Images');
  console.log(`  Mode: ${DRY_RUN ? 'DRY RUN (no writes)' : 'LIVE'}`);
  console.log(`  Limit: ${LIMIT}`);
  console.log('══════════════════════════════════════════\n');

  console.log('Fetching events with missing images...');
  let candidates;
  try {
    candidates = await fetchAllNeedingImages();
  } catch (err) {
    console.error('Failed to fetch events:', err.message);
    process.exit(1);
  }

  console.log(`Found ${candidates.length} events needing images. Processing up to ${LIMIT}.\n`);
  const toProcess = candidates.slice(0, LIMIT);

  for (const doc of toProcess) {
    report.processed++;
    const query = `${doc.title} ${doc.eventType || 'event'}`;

    try {
      const photoUrl = await searchUnsplashImage(query);

      if (!photoUrl) {
        console.log(`  ~ No Unsplash result for: "${doc.title}"`);
        report.skipped++;
        await sleep(1100);
        continue;
      }

      if (DRY_RUN) {
        console.log(`  [dry-run] Would update: "${doc.title}"`);
        console.log(`            Unsplash URL: ${photoUrl}`);
        report.updated++;
        await sleep(1100);
        continue;
      }

      const buffer = await downloadImageBuffer(photoUrl);
      if (!buffer) {
        console.warn(`  ~ Image download failed for: "${doc.title}"`);
        report.skipped++;
        await sleep(1100);
        continue;
      }

      const result = await uploadImageToAppwrite(buffer, 'poster.jpg');
      if (!result) {
        console.warn(`  ~ Upload failed for: "${doc.title}"`);
        report.skipped++;
        await sleep(1100);
        continue;
      }

      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        posterFileId: result.posterFileId,
        thumbnailUrl: result.thumbnailUrl,
      });

      report.updated++;
      console.log(`  ✓ Updated: "${doc.title}"`);

    } catch (err) {
      report.errors.push({ id: doc.$id, title: doc.title, error: err.message });
      console.error(`  ✗ Error for "${doc.title}": ${err.message}`);
    }

    await sleep(1100); // ~1 req/sec to stay under Unsplash 50 req/hr
  }

  // Write report
  const reportsDir = path.join(__dirname, '..', 'reports');
  fs.mkdirSync(reportsDir, { recursive: true });
  const reportPath = path.join(reportsDir, `image-fix-${runDate}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log('\n══════════════════════════════════════════');
  console.log('  Image Fix Complete');
  console.log('══════════════════════════════════════════');
  console.log(`  Processed:  ${report.processed}`);
  console.log(`  Updated:    ${report.updated}`);
  console.log(`  Skipped:    ${report.skipped}`);
  console.log(`  Errors:     ${report.errors.length}`);
  console.log(`  Report:     ${reportPath}`);
  console.log('══════════════════════════════════════════\n');
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
