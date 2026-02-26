'use strict';

/**
 * Unstop scraper — uses the public Unstop listing API.
 * No browser needed; same data that powers unstop.com/hackathons.
 */

const fetch = require('node-fetch');
const { USER_AGENT, REQUEST_DELAY_MS } = require('../config');

const sleep = ms => new Promise(r => setTimeout(r, ms));

// Base64 encoded filter: {"live":true} = open/upcoming only
const LIVE_FILTER = Buffer.from(JSON.stringify({ live: true })).toString('base64');

async function fetchUnstopPage(opportunity, page, perPage = 20) {
  const url = [
    'https://unstop.com/api/public/competition/listing',
    `?opportunity=${opportunity}`,
    `&page=${page}`,
    `&per_page=${perPage}`,
    `&filters=${encodeURIComponent(LIVE_FILTER)}`,
    '&listed_by=unstop',
  ].join('');

  const res = await fetch(url, {
    headers: {
      'Accept':       'application/json',
      'User-Agent':   USER_AGENT,
      'Referer':      'https://unstop.com/',
    },
    timeout: 15000,
  });
  if (!res.ok) throw new Error(`Unstop API HTTP ${res.status}`);
  return res.json();
}

function parseUnstopItem(item, defaultCategory) {
  const title = (item.title || item.competition_name || '').trim();
  if (!title || title.length < 3) return null;

  const startDate = item.start_date || item.startDate || item.event_start || '';
  const endDate   = item.end_date   || item.endDate   || item.event_end   || item.reg_last_date || '';

  const now = new Date();
  if (startDate) {
    const d = new Date(startDate);
    if (!isNaN(d.getTime()) && d < now) return null;
  }

  // Location / mode
  let location = 'Online';
  const mode = (item.competition_type || item.mode || item.location_type || '').toLowerCase();
  if (mode.includes('offline') || mode.includes('in-person') || mode.includes('on-site')) {
    location = item.city || item.venue || 'In-Person';
  } else if (mode.includes('hybrid')) {
    location = 'Hybrid';
  }

  // Organizer
  const organizerName = (
    item.organisation_name ||
    item.organization_name ||
    item.college_name      ||
    item.host_name         ||
    ''
  ).trim();

  // Registration link
  const slug = item.seo_url || item.slug || item.id || '';
  const registrationLink = item.url
    || item.register_url
    || (slug ? `https://unstop.com/${slug}` : '')
    || 'N/A';

  // Image
  const imageUrl = item.banner || item.poster || item.thumbnail || item.image || '';

  // Tags
  const tagSources = [
    ...(item.skills_required || []),
    ...(item.tags || []),
    ...(item.labels || []),
  ];
  const tags = tagSources
    .map(t => (typeof t === 'string' ? t : t.name || t.title || ''))
    .filter(Boolean)
    .slice(0, 6);

  const maxParticipants = parseInt(item.max_applications || item.team_size || 0) || 0;

  // Prize — append to description if present
  let description = (item.short_description || item.about || item.description || '').trim();
  const prize = item.prize_amount || item.total_prize_money;
  if (prize) description += (description ? '\n\nPrize: ₹' : 'Prize: ₹') + prize;

  return {
    title,
    description,
    startDate,
    endDate,
    location,
    registrationLink,
    organizerName,
    imageUrl,
    tags,
    maxParticipants,
    source:   'unstop',
    category: [defaultCategory],
  };
}

async function fetchOpportunity(opportunity, defaultCategory) {
  const events = [];
  const PAGES  = 2;

  for (let page = 1; page <= PAGES; page++) {
    let data;
    try {
      data = await fetchUnstopPage(opportunity, page);
    } catch (err) {
      console.warn(`  [Unstop] ${opportunity} page ${page} failed: ${err.message}`);
      break;
    }

    // Unstop nests the list in data.data or data.competitions or similar
    const items = (
      data.data?.data ||
      data.data       ||
      data.competitions||
      data.results    ||
      []
    );
    if (!Array.isArray(items) || items.length === 0) break;

    for (const item of items) {
      const parsed = parseUnstopItem(item, defaultCategory);
      if (parsed) events.push(parsed);
    }

    if (page < PAGES) await sleep(REQUEST_DELAY_MS);
  }

  console.log(`  [Unstop] ${opportunity}: ${events.length} events`);
  return events;
}

async function scrapeUnstop() {
  try {
    console.log('  [Unstop] Fetching via public API...');
    const hackathons   = await fetchOpportunity('hackathon',   'Hackathon');
    await sleep(REQUEST_DELAY_MS);
    const competitions = await fetchOpportunity('competition', 'Competition');
    const total = [...hackathons, ...competitions];
    console.log(`  [Unstop] Total: ${total.length} events`);
    return total;
  } catch (err) {
    console.error('  [Unstop] Scraper error:', err.message);
    return [];
  }
}

// Standalone test
if (require.main === module) {
  require('dotenv').config();
  const { loadEnv } = require('../utils');
  loadEnv();
  scrapeUnstop().then(events => {
    console.log(JSON.stringify(events, null, 2));
    console.log(`\nTotal: ${events.length}`);
  });
}

module.exports = { scrapeUnstop };
