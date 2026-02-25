const fetch = require('node-fetch');
const pLimit = (require('p-limit').default || require('p-limit'));
const fs = require('fs-extra');
const Papa = require('papaparse');
const config = require('./config');
const { readCSV, generateReportPath, fuzzyMatch } = require('./utils');

const limit = pLimit(config.CONCURRENCY_LIMIT);

/**
 * Extract links from HTML using regex.
 * Filters out nav/asset links (images, css, js, anchors, etc).
 */
function extractLinks(html) {
  const linkRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  const links = [];
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1];
    const text = match[2].replace(/<[^>]*>/g, '').trim();

    // Filter out nav/asset/internal links
    if (
      !href.startsWith('http') ||
      !text ||
      text.length < 3 ||
      text.length > 100 ||
      /\.(png|jpg|jpeg|gif|svg|css|js|ico|woff|ttf)$/i.test(href) ||
      /^(home|about|contact|login|sign up|privacy|terms|cookie|menu|nav)/i.test(text)
    ) {
      continue;
    }

    links.push({ href, text });
  }

  return links;
}

/**
 * Fetch HTML from a source URL.
 */
async function fetchSource(source) {
  try {
    const res = await fetch(source.url, {
      timeout: config.REQUEST_TIMEOUT,
      follow: config.MAX_REDIRECTS,
      headers: { 'User-Agent': config.USER_AGENT },
    });

    if (!res.ok) {
      console.log(`  ${source.name}: HTTP ${res.status} (skipped)`);
      return [];
    }

    const html = await res.text();
    const links = extractLinks(html);
    console.log(`  ${source.name}: found ${links.length} links`);
    return links.map((l) => ({ ...l, source: source.name }));
  } catch (err) {
    console.log(`  ${source.name}: ${err.message} (skipped)`);
    return [];
  }
}

async function main() {
  console.log('=== New Perks Discovery ===\n');

  // Load existing perks
  const { data: existingPerks } = await readCSV(config.CSV_PATH);
  const existingTitles = existingPerks.map((p) => p.title);
  console.log(`Loaded ${existingPerks.length} existing perks\n`);

  // Fetch all sources
  console.log('Fetching sources...');
  const allLinks = [];

  const tasks = config.KNOWN_SOURCES.map((source) =>
    limit(async () => {
      const links = await fetchSource(source);
      allLinks.push(...links);
    })
  );

  await Promise.all(tasks);

  console.log(`\nTotal links extracted: ${allLinks.length}`);

  // Deduplicate against existing perks and against each other
  const seenHrefs = new Set();
  const newPerks = [];

  for (const link of allLinks) {
    // Skip if already in existing CSV (fuzzy title match)
    const isExisting = existingTitles.some((title) => fuzzyMatch(title, link.text));
    if (isExisting) continue;

    // Skip duplicate hrefs
    if (seenHrefs.has(link.href)) continue;
    seenHrefs.add(link.href);

    newPerks.push({
      title: link.text,
      category: '',
      description: '',
      DiscountOffer: 'See details',
      VerificationMethod: '',
      validity: '',
      claimlink: link.href,
      isActive: 'Pending',
      _source: link.source,
    });
  }

  console.log(`\nNew perks not in database: ${newPerks.length}`);

  // Write staging CSV if new perks found
  if (newPerks.length > 0) {
    const stagingColumns = [...config.CSV_COLUMNS, '_source'];
    const date = new Date().toISOString().slice(0, 10);
    const stagingPath = require('path').join(config.STAGING_DIR, `new-perks-${date}.csv`);

    await fs.ensureDir(config.STAGING_DIR);
    const csv = Papa.unparse(newPerks, { columns: stagingColumns });
    await fs.writeFile(stagingPath, csv + '\n', 'utf-8');
    console.log(`Staging file: ${stagingPath}`);

    newPerks.forEach((p) => console.log(`  - ${p.title} (${p._source})`));
  } else {
    console.log('No new perks to stage.');
  }

  // Generate discovery report
  const report = {
    date: new Date().toISOString(),
    sourcesChecked: config.KNOWN_SOURCES.length,
    totalLinksExtracted: allLinks.length,
    newPerksFound: newPerks.length,
    newPerks: newPerks.map((p) => ({ title: p.title, claimlink: p.claimlink, source: p._source })),
  };

  const reportPath = generateReportPath('discovery');
  await fs.ensureDir(config.REPORTS_DIR);
  await fs.writeJson(reportPath, report, { spaces: 2 });
  console.log(`Report saved: ${reportPath}`);

  console.log('\n=== Discovery Complete ===');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
