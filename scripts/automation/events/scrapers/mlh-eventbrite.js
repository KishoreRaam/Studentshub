'use strict';

/**
 * MLH scraper  — parses microdata (schema.org/Event) from mlh.io/seasons/2026/events
 * Eventbrite   — parses JSON-LD structured data from Eventbrite search pages
 */

const fetch = require('node-fetch');
const { USER_AGENT, REQUEST_DELAY_MS } = require('../config');

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── MLH ───────────────────────────────────────────────────────────────────────

async function scrapeMLH() {
  const events = [];
  try {
    console.log('  [MLH] Fetching https://mlh.io/seasons/2026/events ...');
    const res = await fetch('https://mlh.io/seasons/2026/events', {
      headers: { 'User-Agent': USER_AGENT, 'Accept': 'text/html' },
      timeout: 20000,
    });
    if (!res.ok) {
      console.warn(`  [MLH] HTTP ${res.status} — skipping`);
      return [];
    }
    const html = await res.text();

    // All microdata fields are arrays ordered by event index
    // Event names: <span itemprop="name">...</span> INSIDE an <h3> tag
    // Location names also use itemprop="name" inside the location div — filtered by:
    //   - location spans contain React HTML comment markers like "<!-- -->"
    //   - event name spans do NOT contain HTML comment characters

    // Strategy: match all itemprop="name" spans that have clean text (no < or !)
    const nameMatches = [
      ...html.matchAll(/<span[^>]+itemprop="name"[^>]*>([^<!]+)<\/span>/gi),
    ].map(m => m[1].trim()).filter(n => n.length > 2);

    const startDates = [...html.matchAll(/itemprop="startDate"[^>]+content="([^"]+)"/gi)].map(m => m[1]);
    const endDates   = [...html.matchAll(/itemprop="endDate"[^>]+content="([^"]+)"/gi)].map(m => m[1]);
    const eventUrls  = [...html.matchAll(/itemprop="url"[^>]+content="([^"]+)"/gi)].map(m => m[1]);
    const imgUrls    = [...html.matchAll(/itemprop="image"[^>]+content="([^"]+)"/gi)].map(m => m[1]);
    const localities = [...html.matchAll(/itemprop="addressLocality"[^>]+content="([^"]+)"/gi)].map(m => m[1]);

    console.log(`  [MLH] Parsed: ${nameMatches.length} names, ${startDates.length} dates, ${eventUrls.length} urls`);

    const now = new Date();
    const count = Math.min(nameMatches.length, startDates.length, eventUrls.length);

    for (let i = 0; i < count; i++) {
      const title = nameMatches[i];
      if (!title) continue;

      const startDate = startDates[i] || '';
      const endDate   = endDates[i]   || '';
      const url       = eventUrls[i]  || 'https://mlh.io/seasons/2026/events';
      const imageUrl  = imgUrls[i]    || '';
      const city      = localities[i] || '';

      // Skip past events
      if (startDate) {
        const d = new Date(startDate);
        if (!isNaN(d.getTime()) && d < now) continue;
      }

      const location = city ? city : 'Online';

      events.push({
        title,
        description: `MLH Hackathon: ${title}. ${city ? `In-person at ${city}.` : 'Online/Digital event.'}`,
        startDate,
        endDate,
        location,
        registrationLink: url,
        organizerName: 'MLH',
        imageUrl,
        tags: ['Hackathon', 'MLH', 'Student'],
        maxParticipants: 0,
        source:   'mlh',
        category: ['Hackathon'],
      });
    }

    console.log(`  [MLH] Found ${events.length} upcoming events`);
    return events;
  } catch (err) {
    console.error('  [MLH] Error:', err.message);
    return [];
  }
}

// ── Eventbrite ────────────────────────────────────────────────────────────────

async function scrapeEventbritePage(url, defaultCategory) {
  try {
    console.log(`  [Eventbrite] Fetching ${url} ...`);
    const res = await fetch(url, {
      headers: {
        'User-Agent':      USER_AGENT,
        'Accept':          'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 15000,
    });
    if (!res.ok) {
      console.warn(`  [Eventbrite] HTTP ${res.status} for ${url} — skipping`);
      return [];
    }
    const html = await res.text();
    const events = [];
    const now = new Date();

    // Eventbrite embeds JSON-LD structured data
    const jsonLdMatches = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
    for (const m of jsonLdMatches) {
      try {
        const raw  = JSON.parse(m[1]);
        const items = Array.isArray(raw) ? raw : raw['@graph'] ? raw['@graph'] : [raw];
        for (const item of items) {
          if (!item || (item['@type'] !== 'Event' && item['@type'] !== 'SocialEvent')) continue;
          const title = (item.name || '').trim();
          if (!title) continue;

          const startDate = item.startDate || '';
          const endDate   = item.endDate   || '';

          if (startDate) {
            const d = new Date(startDate);
            if (!isNaN(d.getTime()) && d < now) continue;
          }

          const locData = item.location || {};
          let location  = 'Online';
          if (locData['@type'] === 'VirtualLocation') location = 'Online';
          else if (locData.name) location = locData.name;
          else if (locData.address) {
            const a = locData.address;
            location = [a.addressLocality, a.addressRegion, a.addressCountry].filter(Boolean).join(', ') || 'In-Person';
          }

          const registrationLink = item.url || item['@id'] || '';
          const organizer = item.organizer ? (item.organizer.name || '') : '';
          const ogImg = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i);

          events.push({
            title,
            description: (item.description || `${defaultCategory} event: ${title}`).slice(0, 1000),
            startDate,
            endDate,
            location,
            registrationLink,
            organizerName: organizer,
            imageUrl: ogImg ? ogImg[1] : '',
            tags: [defaultCategory, 'India', 'Student'],
            maxParticipants: 0,
            source:   'eventbrite',
            category: [defaultCategory],
          });
        }
      } catch (_) {}
    }

    console.log(`  [Eventbrite] Found ${events.length} events on ${url}`);
    return events;
  } catch (err) {
    console.warn(`  [Eventbrite] Error for ${url}: ${err.message}`);
    return [];
  }
}

async function scrapeEventbrite() {
  const hackEvents = await scrapeEventbritePage(
    'https://www.eventbrite.com/d/india/student-hackathon/?page=1',
    'Hackathon'
  );
  await sleep(REQUEST_DELAY_MS);
  const workshopEvents = await scrapeEventbritePage(
    'https://www.eventbrite.com/d/india/coding-workshop/?page=1',
    'Workshop'
  );
  return [...hackEvents, ...workshopEvents];
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function scrapeMLHAndEventbrite() {
  const mlh = await scrapeMLH();
  await sleep(REQUEST_DELAY_MS);
  const eb  = await scrapeEventbrite();
  return [...mlh, ...eb];
}

if (require.main === module) {
  const { loadEnv } = require('../utils');
  loadEnv();
  scrapeMLHAndEventbrite().then(events => {
    console.log(JSON.stringify(events, null, 2));
    console.log(`\nTotal: ${events.length}`);
  });
}

module.exports = { scrapeMLHAndEventbrite, scrapeMLH, scrapeEventbrite };
