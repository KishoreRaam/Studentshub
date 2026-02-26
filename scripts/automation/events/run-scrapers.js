'use strict';

const path = require('path');
const fs   = require('fs');

// Load env first (loadEnv also remaps VITE_ prefixed vars for local dev)
const { loadEnv } = require('./utils');
loadEnv();

const { scrapeDevfolio }          = require('./scrapers/devfolio');
const { scrapeUnstop }            = require('./scrapers/unstop');
const { scrapeMLHAndEventbrite }  = require('./scrapers/mlh-eventbrite');
const { normaliseAndWrite }       = require('./normalize-and-write');

const TEMP_DIR = path.join(__dirname, 'temp');

async function main() {
  console.log('\n══════════════════════════════════════════');
  console.log('  StudentsHub Events Scraper Starting...');
  console.log(`  Run time: ${new Date().toISOString()}`);
  console.log('══════════════════════════════════════════\n');

  // Create temp dir
  fs.mkdirSync(TEMP_DIR, { recursive: true });

  // Run all scrapers in parallel
  console.log('Running scrapers in parallel...\n');
  const [devfolioResult, unstopResult, mlhEbResult] = await Promise.allSettled([
    scrapeDevfolio(),
    scrapeUnstop(),
    scrapeMLHAndEventbrite(),
  ]);

  const scraperNames = ['devfolio', 'unstop', 'mlh-eventbrite'];
  const results = [devfolioResult, unstopResult, mlhEbResult];
  const sourceCounts = {};
  let allEvents = [];
  let successCount = 0;

  for (let i = 0; i < results.length; i++) {
    const name = scraperNames[i];
    const result = results[i];
    if (result.status === 'fulfilled') {
      const events = result.value || [];
      console.log(`✓ ${name}: ${events.length} events`);
      // Write to temp file
      const tempFile = path.join(TEMP_DIR, `${name}.json`);
      fs.writeFileSync(tempFile, JSON.stringify(events, null, 2));
      allEvents = allEvents.concat(events);
      // Source counts split by actual source field
      if (name === 'mlh-eventbrite') {
        sourceCounts.mlh        = events.filter(e => e.source === 'mlh').length;
        sourceCounts.eventbrite = events.filter(e => e.source === 'eventbrite').length;
      } else {
        sourceCounts[name] = events.length;
      }
      successCount++;
    } else {
      console.warn(`⚠ ${name} scraper failed: ${result.reason?.message || result.reason}`);
      // Write empty array to temp file so normalize-and-write still works
      const tempFile = path.join(TEMP_DIR, `${name}.json`);
      fs.writeFileSync(tempFile, '[]');
      if (name === 'mlh-eventbrite') {
        sourceCounts.mlh = 0;
        sourceCounts.eventbrite = 0;
      } else {
        sourceCounts[name] = 0;
      }
    }
  }

  console.log(`\nScrapers complete: ${successCount}/${scraperNames.length} succeeded`);
  console.log(`Total raw events collected: ${allEvents.length}\n`);

  // If ALL scrapers failed and we have nothing, exit with error
  if (successCount === 0 && allEvents.length === 0) {
    console.error('All scrapers failed. No events to process. Exiting with code 1.');
    cleanup();
    process.exit(1);
  }

  // Normalise and write to Appwrite
  let stats;
  try {
    stats = await normaliseAndWrite(allEvents, sourceCounts);
  } catch (err) {
    console.error('Fatal error in normalise-and-write:', err.message);
    cleanup();
    process.exit(1);
  }

  cleanup();

  // Exit 0 if at least some success
  process.exit(0);
}

function cleanup() {
  try {
    if (fs.existsSync(TEMP_DIR)) {
      fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    }
  } catch {
    // ignore cleanup errors
  }
}

main().catch(err => {
  console.error('Unhandled error in main:', err);
  cleanup();
  process.exit(1);
});
