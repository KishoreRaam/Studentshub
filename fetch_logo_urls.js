#!/usr/bin/env node

/**
 * Logo URL Fetcher for AI Tools CSV
 *
 * This script processes the ai-tools-complete.csv file and fetches logo URLs
 * using multiple fallback strategies: Brandfetch CDN, favicon.ico, emoji SVG data URLs,
 * and transparent placeholder.
 *
 * Installation:
 *   npm install node-fetch@2 csv-parse csv-stringify fs-extra p-limit p-retry
 *
 * Usage:
 *   node fetch_logo_urls.js          # Process with existing logo_url preservation
 *   node fetch_logo_urls.js --force  # Force re-fetch all logo URLs
 */

const fetch = require('node-fetch');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');
const fs = require('fs-extra');
const pLimitModule = require('p-limit');
const pLimit = pLimitModule.default || pLimitModule;
const pRetryModule = require('p-retry');
const pRetry = pRetryModule.default || pRetryModule;
const { URL } = require('url');
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONCURRENCY = 5;
const MAX_RETRIES = 3;
const BRANDFETCH_CLIENT_ID = '1idHgzTH40svQnGmzjQ';
const INPUT_CSV = path.join(__dirname, 'public', 'assets', 'ai-tools-complete.csv');
const OUTPUT_CSV = path.join(__dirname, 'public', 'assets', 'ai-tools-complete.with-logo-urls.csv');
const BACKUP_CSV = path.join(__dirname, 'public', 'assets', 'ai-tools-complete.backup.csv');
const REPORT_JSON = path.join(__dirname, 'logo_url_fetch_report.json');

// Transparent 1x1 PNG data URL
const TRANSPARENT_PNG_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAucB9UyNCkoAAAAASUVORK5CYII=';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Extract domain from URL string
 * Tries to parse as URL, handles missing protocol
 */
function extractDomain(urlString) {
  if (!urlString) return null;

  try {
    // Add protocol if missing
    let normalizedUrl = urlString.trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    const url = new URL(normalizedUrl);
    let hostname = url.hostname.toLowerCase();

    // Remove www. prefix
    if (hostname.startsWith('www.')) {
      hostname = hostname.substring(4);
    }

    return hostname;
  } catch (error) {
    // If URL parsing fails, return null
    return null;
  }
}

/**
 * Guess domain from name by converting to lowercase and adding .com
 */
function guessDomainFromName(name) {
  if (!name) return null;

  // Convert to lowercase, remove non-alphanumeric chars, replace spaces with empty
  const sanitized = name.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '');

  return sanitized ? `${sanitized}.com` : null;
}

/**
 * Create SVG data URL from emoji
 */
function createEmojiDataUrl(emoji) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512'>
  <rect width='100%' height='100%' fill='transparent'/>
  <text x='50%' y='50%' text-anchor='middle' dominant-baseline='central' font-size='320px' font-family='Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif'>${emoji}</text>
</svg>`;

  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

/**
 * Check if response is an image based on content-type
 */
function isImageResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  return contentType.toLowerCase().startsWith('image/');
}

/**
 * Fetch with retry logic for transient failures
 */
async function fetchWithRetry(url, options = {}) {
  return pRetry(
    async () => {
      const response = await fetch(url, {
        ...options,
        redirect: 'follow'
      });

      // Retry on 429 (Too Many Requests) or 5xx errors
      if (response.status === 429 || response.status >= 500) {
        const retryAfter = response.headers.get('retry-after');
        if (retryAfter) {
          const delay = parseInt(retryAfter, 10) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        throw new Error(`HTTP ${response.status}`);
      }

      return response;
    },
    {
      retries: MAX_RETRIES
    }
  );
}

/**
 * Try to fetch logo from Brandfetch CDN with enhanced detection
 */
async function tryBrandfetch(domain) {
  try {
    const url = `https://cdn.brandfetch.io/${encodeURIComponent(domain)}?c=${BRANDFETCH_CLIENT_ID}&type=logo&theme=light&fallback=brandfetch`;
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
      'Accept': 'image/*,image/svg+xml,text/html;q=0.9,*/*;q=0.8'
    };

    const response = await fetchWithRetry(url, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      return null;
    }

    const contentType = (response.headers.get('content-type') || '').toLowerCase();

    // 1. Direct image or SVG
    if (contentType.includes('image/') || contentType.includes('svg')) {
      return response.url;
    }

    // 2. Parse HTML/text response for inline SVG or <img> tags
    const text = await response.text();
    const trimmed = text.trim();

    // Inline SVG directly
    if (trimmed.startsWith('<svg') || trimmed.startsWith('<?xml')) {
      const dataUrl = 'data:image/svg+xml;utf8,' + encodeURIComponent(text);
      return dataUrl;
    }

    // Extract <img src="...">
    const imgMatch = text.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch && imgMatch[1]) {
      let candidate = imgMatch[1];
      try {
        // Resolve relative URLs
        candidate = new URL(candidate, response.url).toString();
      } catch (e) {
        // Use as-is if URL parsing fails
      }
      return candidate;
    }

    // Meta refresh
    const metaMatch = text.match(/<meta[^>]+url=([^"'>]+)/i);
    if (metaMatch && metaMatch[1]) {
      try {
        const candidate = new URL(metaMatch[1], response.url).toString();
        return candidate;
      } catch (e) {
        // Ignore if URL parsing fails
      }
    }

    // No valid image found
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Try to fetch favicon.ico from domain
 */
async function tryFavicon(domain) {
  // Try HTTPS first
  try {
    let url = `https://${domain}/favicon.ico`;

    // Try HEAD request first (faster)
    let response;
    try {
      response = await fetchWithRetry(url, { method: 'HEAD' });
    } catch (headError) {
      // If HEAD fails or not supported, try GET
      response = await fetchWithRetry(url, { method: 'GET' });
    }

    if (response.ok && isImageResponse(response)) {
      return url;
    }
  } catch (error) {
    // HTTPS failed, try HTTP
    try {
      const url = `http://${domain}/favicon.ico`;
      const response = await fetchWithRetry(url, { method: 'GET' });

      if (response.ok && isImageResponse(response)) {
        return url;
      }
    } catch (httpError) {
      return null;
    }
  }

  return null;
}

/**
 * Main logo fetching function with fallback chain
 */
async function fetchLogoUrl(row, forceRefetch = false) {
  const { name, link, logo, logo_url: existingLogoUrl } = row;

  // Skip if logo_url already exists and not forcing
  if (existingLogoUrl && existingLogoUrl.trim() !== '' && !forceRefetch) {
    return {
      logo_url: existingLogoUrl,
      logo_source: row.logo_source || 'existing',
      skipped: true
    };
  }

  // Extract domain from link column
  let domain = extractDomain(link);
  let guessedDomain = false;

  // If no valid domain from link, try guessing from name
  if (!domain) {
    domain = guessDomainFromName(name);
    guessedDomain = true;
  }

  if (!domain) {
    // No valid domain, fallback to emoji or placeholder
    if (logo && logo.trim() !== '') {
      return {
        logo_url: createEmojiDataUrl(logo.trim()),
        logo_source: 'emoji-dataurl',
        guessedDomain: false
      };
    }

    return {
      logo_url: TRANSPARENT_PNG_DATA_URL,
      logo_source: 'placeholder',
      guessedDomain: false
    };
  }

  // Try Brandfetch CDN
  const brandfetchUrl = await tryBrandfetch(domain);
  if (brandfetchUrl) {
    return {
      logo_url: brandfetchUrl,
      logo_source: 'brandfetch',
      guessedDomain
    };
  }

  // Try favicon.ico
  const faviconUrl = await tryFavicon(domain);
  if (faviconUrl) {
    return {
      logo_url: faviconUrl,
      logo_source: 'favicon',
      guessedDomain
    };
  }

  // Try emoji data URL
  if (logo && logo.trim() !== '') {
    return {
      logo_url: createEmojiDataUrl(logo.trim()),
      logo_source: 'emoji-dataurl',
      guessedDomain
    };
  }

  // Final fallback: transparent placeholder
  return {
    logo_url: TRANSPARENT_PNG_DATA_URL,
    logo_source: 'placeholder',
    guessedDomain
  };
}

// ============================================================================
// MAIN PROCESSING FUNCTION
// ============================================================================

async function main() {
  const startTime = new Date().toISOString();
  const forceRefetch = process.argv.includes('--force');

  console.log('='.repeat(70));
  console.log('Logo URL Fetcher for AI Tools CSV');
  console.log('='.repeat(70));
  console.log(`Start time: ${startTime}`);
  console.log(`Force refetch: ${forceRefetch ? 'YES' : 'NO'}`);
  console.log(`Concurrency: ${CONCURRENCY}`);
  console.log(`Max retries: ${MAX_RETRIES}`);
  console.log('');

  // Check if input file exists
  if (!await fs.pathExists(INPUT_CSV)) {
    console.error(`ERROR: Input file not found: ${INPUT_CSV}`);
    process.exit(1);
  }

  // Create backup of original CSV
  console.log(`Creating backup: ${BACKUP_CSV}`);
  await fs.copy(INPUT_CSV, BACKUP_CSV, { overwrite: true });

  // Read and parse CSV
  console.log(`Reading CSV: ${INPUT_CSV}`);
  const csvContent = await fs.readFile(INPUT_CSV, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    trim: true
  });

  console.log(`Total rows to process: ${records.length}`);
  console.log('');

  // Stats tracking
  const stats = {
    total_rows: records.length,
    brandfetch_count: 0,
    favicon_count: 0,
    emoji_dataurl_count: 0,
    placeholder_count: 0,
    skipped_count: 0,
    existing_count: 0,
    errors: [],
    guessed_domains: []
  };

  // Create concurrency limiter
  const limit = pLimit(CONCURRENCY);

  // Process all rows with concurrency control
  const tasks = records.map((row, index) =>
    limit(async () => {
      try {
        const result = await fetchLogoUrl(row, forceRefetch);

        // Update row
        row.logo_url = result.logo_url;
        row.logo_source = result.logo_source;

        // Update stats
        if (result.skipped) {
          stats.skipped_count++;
        } else if (result.logo_source === 'brandfetch') {
          stats.brandfetch_count++;
        } else if (result.logo_source === 'favicon') {
          stats.favicon_count++;
        } else if (result.logo_source === 'emoji-dataurl') {
          stats.emoji_dataurl_count++;
        } else if (result.logo_source === 'placeholder') {
          stats.placeholder_count++;
        } else if (result.logo_source === 'existing') {
          stats.existing_count++;
        }

        if (result.guessedDomain) {
          stats.guessed_domains.push({
            index: index + 1,
            name: row.name,
            domain: extractDomain(row.link) || guessDomainFromName(row.name)
          });
        }

        // Log progress every 10 rows
        if ((index + 1) % 10 === 0) {
          const processed = index + 1;
          console.log(`Progress: ${processed}/${records.length} | Brandfetch: ${stats.brandfetch_count} | Favicon: ${stats.favicon_count} | Emoji: ${stats.emoji_dataurl_count} | Placeholder: ${stats.placeholder_count} | Skipped: ${stats.skipped_count + stats.existing_count} | Errors: ${stats.errors.length}`);
        }
      } catch (error) {
        // Log error and continue
        const errorInfo = {
          index: index + 1,
          name: row.name,
          domain: extractDomain(row.link) || guessDomainFromName(row.name),
          error: error.message
        };

        stats.errors.push(errorInfo);
        console.error(`ERROR [Row ${index + 1}]: ${row.name} - ${error.message}`);

        // Set placeholder on error
        row.logo_url = TRANSPARENT_PNG_DATA_URL;
        row.logo_source = 'placeholder';
        stats.placeholder_count++;
      }
    })
  );

  // Wait for all tasks to complete
  await Promise.all(tasks);

  console.log('');
  console.log('Processing complete!');
  console.log('');

  // Write updated CSV
  console.log(`Writing updated CSV: ${OUTPUT_CSV}`);
  const outputCsvContent = stringify(records, {
    header: true,
    quoted: true
  });
  await fs.writeFile(OUTPUT_CSV, outputCsvContent, 'utf-8');

  // Generate report
  const endTime = new Date().toISOString();
  const report = {
    ...stats,
    start_time: startTime,
    end_time: endTime,
    input_file: INPUT_CSV,
    output_file: OUTPUT_CSV,
    backup_file: BACKUP_CSV,
    force_refetch: forceRefetch,
    concurrency: CONCURRENCY,
    max_retries: MAX_RETRIES
  };

  console.log(`Writing report: ${REPORT_JSON}`);
  await fs.writeJson(REPORT_JSON, report, { spaces: 2 });

  // Print summary
  console.log('');
  console.log('='.repeat(70));
  console.log('SUMMARY');
  console.log('='.repeat(70));
  console.log(`Total rows:          ${stats.total_rows}`);
  console.log(`Brandfetch CDN:      ${stats.brandfetch_count}`);
  console.log(`Favicon:             ${stats.favicon_count}`);
  console.log(`Emoji Data URL:      ${stats.emoji_dataurl_count}`);
  console.log(`Placeholder:         ${stats.placeholder_count}`);
  console.log(`Skipped (existing):  ${stats.skipped_count + stats.existing_count}`);
  console.log(`Errors:              ${stats.errors.length}`);
  console.log(`Guessed domains:     ${stats.guessed_domains.length}`);
  console.log('');
  console.log(`Output CSV:  ${OUTPUT_CSV}`);
  console.log(`Report JSON: ${REPORT_JSON}`);
  console.log(`Backup CSV:  ${BACKUP_CSV}`);
  console.log('');
  console.log('Done! ✓');
  console.log('='.repeat(70));

  // Exit with error code if there were errors
  if (stats.errors.length > 0) {
    console.log('');
    console.warn(`⚠️  ${stats.errors.length} error(s) occurred. Check ${REPORT_JSON} for details.`);
    process.exit(1);
  }
}

// ============================================================================
// ENTRY POINT
// ============================================================================

main().catch(error => {
  console.error('FATAL ERROR:', error);
  process.exit(1);
});
