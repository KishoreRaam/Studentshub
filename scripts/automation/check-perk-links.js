const fetch = require('node-fetch');
const pLimit = (require('p-limit').default || require('p-limit'));
const fs = require('fs-extra');
const config = require('./config');
const { readCSV, writeCSV, generateReportPath } = require('./utils');

const limit = pLimit(config.CONCURRENCY_LIMIT);

/**
 * Check a single perk's claim link.
 * Returns { status, ok, finalUrl, suspicious, error }
 */
async function checkLink(url) {
  const opts = {
    method: 'HEAD',
    timeout: config.REQUEST_TIMEOUT,
    follow: config.MAX_REDIRECTS,
    headers: { 'User-Agent': config.USER_AGENT },
  };

  try {
    let res = await fetch(url, opts);

    // Some servers reject HEAD — fall back to GET
    if (res.status === 405) {
      res = await fetch(url, { ...opts, method: 'GET' });
    }

    const finalUrl = res.url || url;

    // Suspicious redirect: original URL had a specific path but landed on root
    const originalPath = new URL(url).pathname;
    const finalPath = new URL(finalUrl).pathname;
    const suspicious = originalPath.length > 1 && finalPath === '/';

    return {
      status: res.status,
      ok: res.status >= 200 && res.status < 400,
      finalUrl,
      suspicious,
      error: null,
    };
  } catch (err) {
    return {
      status: null,
      ok: false,
      finalUrl: null,
      suspicious: false,
      error: err.type === 'request-timeout' ? 'TIMEOUT' : err.message,
    };
  }
}

async function main() {
  console.log('=== Perk Link Health Check ===\n');

  const { data, fields } = await readCSV(config.CSV_PATH);
  const total = data.length;
  console.log(`Loaded ${total} perks from CSV\n`);

  let activeCount = 0;
  let newlyDisabled = 0;
  const suspiciousList = [];
  const results = [];

  const tasks = data.map((perk, index) =>
    limit(async () => {
      const num = index + 1;
      const title = perk.title;
      const url = perk.claimlink;

      if (!url || !url.startsWith('http')) {
        console.log(`Checking [${num}/${total}] ${title}... SKIP (no valid URL)`);
        results.push({ title, url, status: null, ok: false, error: 'INVALID_URL', suspicious: false });
        return;
      }

      const result = await checkLink(url);

      const wasActive = perk.isActive === 'True';
      const isNowActive = result.ok;

      if (isNowActive) {
        perk.isActive = 'True';
        activeCount++;
      } else {
        perk.isActive = 'False';
        if (wasActive) newlyDisabled++;
      }

      if (result.suspicious) {
        suspiciousList.push({ title, url, finalUrl: result.finalUrl });
      }

      const symbol = result.ok ? '\u2713' : '\u2717';
      const statusText = result.error || result.status;
      console.log(`Checking [${num}/${total}] ${title}... ${symbol} ${statusText}`);

      results.push({
        title,
        url,
        status: result.status,
        ok: result.ok,
        finalUrl: result.finalUrl,
        error: result.error,
        suspicious: result.suspicious,
      });
    })
  );

  await Promise.all(tasks);

  // Write updated CSV
  await writeCSV(config.CSV_PATH, data, config.CSV_COLUMNS);
  console.log(`\nCSV updated: ${config.CSV_PATH}`);

  // Generate report
  const report = {
    date: new Date().toISOString(),
    total,
    active: activeCount,
    inactive: total - activeCount,
    newlyDisabled,
    suspicious: suspiciousList,
    results,
  };

  const reportPath = generateReportPath('perk-health');
  await fs.ensureDir(config.REPORTS_DIR);
  await fs.writeJson(reportPath, report, { spaces: 2 });
  console.log(`Report saved: ${reportPath}`);

  // Summary
  console.log(`\n=== Summary ===`);
  console.log(`Total: ${total}`);
  console.log(`Active: ${activeCount}`);
  console.log(`Inactive: ${total - activeCount}`);
  console.log(`Newly disabled: ${newlyDisabled}`);
  if (suspiciousList.length > 0) {
    console.log(`Suspicious redirects: ${suspiciousList.length}`);
    suspiciousList.forEach((s) => console.log(`  - ${s.title}: ${s.url} -> ${s.finalUrl}`));
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
