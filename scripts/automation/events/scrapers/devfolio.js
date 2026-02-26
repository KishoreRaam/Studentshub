'use strict';

/**
 * Devfolio scraper — uses the public Devfolio REST API.
 * No browser needed; the same API that powers devfolio.co/hackathons.
 */

const fetch = require('node-fetch');
const { USER_AGENT, REQUEST_DELAY_MS } = require('../config');

const sleep = ms => new Promise(r => setTimeout(r, ms));

const API_PAGES  = 3;   // fetch first 3 pages (24 events each)
const PAGE_SIZE  = 24;

async function fetchPage(page) {
  // Public Devfolio API — no auth required
  const url = `https://api.devfolio.co/api/hackathons?count=${PAGE_SIZE}&page=${page}`;
  const res = await fetch(url, {
    headers: {
      'Accept':     'application/json',
      'User-Agent': USER_AGENT,
    },
    timeout: 15000,
  });
  if (!res.ok) throw new Error(`Devfolio API HTTP ${res.status}`);
  return res.json();
}

async function scrapeDevfolio() {
  const events = [];
  const now = new Date();

  try {
    console.log('  [Devfolio] Fetching via public API...');

    for (let page = 0; page < API_PAGES; page++) {
      let data;
      try {
        data = await fetchPage(page);
      } catch (err) {
        console.warn(`  [Devfolio] Page ${page} failed: ${err.message}`);
        break;
      }

      const hackathons = data.hackathons || data.results || data.data || [];
      if (!hackathons.length) break;   // no more pages

      for (const h of hackathons) {
        try {
          const title = (h.name || h.title || '').trim();
          if (!title) continue;

          // Date fields (ISO strings from the API)
          const startDate = h.starts_at || h.start_date || h.startDate || '';
          const endDate   = h.ends_at   || h.end_date   || h.endDate   || '';

          // Skip past events
          if (startDate) {
            const d = new Date(startDate);
            if (!isNaN(d.getTime()) && d < now) continue;
          }

          // Location
          const locType = (h.location_type || h.mode || '').toLowerCase();
          let location = 'Online';
          if (locType === 'in_person' || locType === 'offline') location = 'In-Person';
          else if (locType === 'hybrid') location = 'Hybrid';
          if (h.city || h.venue) location = `${h.city || h.venue}${h.country ? ', ' + h.country : ''}`.trim() || location;

          // Registration link
          const slug = h.slug || h.id || '';
          const registrationLink = h.url || h.apply_url
            || (slug ? `https://devfolio.co/hackathons/${slug}/apply` : '')
            || 'N/A';

          // Organizer
          const organizerName = (h.organization_name || h.organizer || h.org_name || '').trim();

          // Image
          const imageUrl = h.banner || h.cover || h.logo || h.thumbnail || '';

          // Tags / skills
          const tags = Array.isArray(h.skills)
            ? h.skills.map(s => (typeof s === 'string' ? s : s.title || s.name || '')).filter(Boolean)
            : [];

          const maxParticipants = parseInt(h.max_registrations || h.participant_limit || 0) || 0;

          events.push({
            title,
            description: (h.tagline || h.description || '').trim(),
            startDate,
            endDate,
            location,
            registrationLink,
            organizerName,
            imageUrl,
            tags,
            maxParticipants,
            source:   'devfolio',
            category: ['Hackathon'],
          });
        } catch (_) {
          // skip bad entry
        }
      }

      if (page < API_PAGES - 1) await sleep(REQUEST_DELAY_MS);
    }

    console.log(`  [Devfolio] Found ${events.length} upcoming events`);
    return events;
  } catch (err) {
    console.error('  [Devfolio] Scraper error:', err.message);
    return [];
  }
}

// Standalone test
if (require.main === module) {
  require('dotenv').config();
  const { loadEnv } = require('../utils');
  loadEnv();
  scrapeDevfolio().then(events => {
    console.log(JSON.stringify(events, null, 2));
    console.log(`\nTotal: ${events.length}`);
  });
}

module.exports = { scrapeDevfolio };
