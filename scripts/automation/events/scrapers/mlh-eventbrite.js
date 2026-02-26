'use strict';

const fetch = require('node-fetch');
const { USER_AGENT, REQUEST_DELAY_MS } = require('../config');

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── MLH ──────────────────────────────────────────────────────────────────────

async function scrapeMLH() {
  const events = [];
  try {
    console.log('  [MLH] Fetching https://mlh.io/seasons/2026/events ...');
    const res = await fetch('https://mlh.io/seasons/2026/events', {
      headers: { 'User-Agent': USER_AGENT, 'Accept': 'text/html' },
      timeout: 15000,
    });
    if (!res.ok) {
      console.warn(`  [MLH] HTTP ${res.status} — skipping`);
      return [];
    }
    const html = await res.text();

    // Extract event blocks using regex patterns
    // MLH uses <div class="event"> blocks
    const eventBlockRegex = /<div[^>]+class="[^"]*event[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi;
    const blocks = [];
    let match;
    while ((match = eventBlockRegex.exec(html)) !== null) {
      blocks.push(match[1]);
    }

    // Fallback: look for anchor tags pointing to event pages
    const linkRegex = /<a[^>]+href="([^"]*mlh\.io[^"]*)"[^>]*>([^<]+)<\/a>/gi;
    const titleDateRegex = /<h3[^>]*class="[^"]*event-name[^"]*"[^>]*>([^<]+)<\/h3>/gi;
    const dateRegex = /<p[^>]*class="[^"]*event-date[^"]*"[^>]*>([^<]+)<\/p>/gi;
    const locationRegex = /<p[^>]*class="[^"]*event-location[^"]*"[^>]*>([^<]+)<\/p>/gi;
    const linkHrefRegex = /<a[^>]+href="([^"]+)"[^>]*class="[^"]*event-link[^"]*"/gi;

    const titles    = [...html.matchAll(/<h3[^>]*class="[^"]*event-name[^"]*"[^>]*>\s*([^<]+)\s*<\/h3>/gi)].map(m => m[1].trim());
    const dates     = [...html.matchAll(/<p[^>]*class="[^"]*event-date[^"]*"[^>]*>\s*([^<]+)\s*<\/p>/gi)].map(m => m[1].trim());
    const locations = [...html.matchAll(/<p[^>]*class="[^"]*event-location[^"]*"[^>]*>\s*([^<]+)\s*<\/p>/gi)].map(m => m[1].trim());
    const links     = [...html.matchAll(/<a[^>]+href="(https:\/\/[^"]*)"[^>]*class="[^"]*event-[^"]*"/gi)].map(m => m[1]);

    // Build events from extracted arrays
    const count = Math.max(titles.length, 0);
    for (let i = 0; i < count; i++) {
      const title = titles[i];
      if (!title) continue;
      const dateStr = dates[i] || '';
      const locationText = locations[i] || 'Online';
      const link = links[i] || 'https://mlh.io/seasons/2025/events';

      // Parse date range: "January 10 - 12, 2025" or "Jan 10, 2025"
      let startDate = dateStr;
      let endDate   = '';
      const rangeMatch = dateStr.match(/(\w+ \d{1,2})\s*[-–]\s*(\d{1,2}),?\s*(\d{4})/);
      if (rangeMatch) {
        const [, start, endDay, year] = rangeMatch;
        startDate = `${start}, ${year}`;
        endDate   = `${start.split(' ')[0]} ${endDay}, ${year}`;
      }

      const now = new Date();
      const parsedDate = new Date(startDate);
      if (!isNaN(parsedDate.getTime()) && parsedDate < now) continue;

      events.push({
        title,
        description: `MLH Hackathon: ${title}. ${locationText.includes('Digital') ? 'Online event.' : `In-person at ${locationText}.`}`,
        startDate,
        endDate,
        location: locationText.toLowerCase().includes('digital') ? 'Online' : locationText,
        registrationLink: link,
        organizerName: 'MLH',
        imageUrl: '',
        tags: ['Hackathon', 'MLH', 'Student'],
        maxParticipants: 0,
        source: 'mlh',
        category: ['Hackathon'],
      });
    }

    // If regex parsing got nothing, try a simpler approach
    if (events.length === 0) {
      console.warn('  [MLH] Regex parsing found 0 events — MLH may have changed their HTML structure');
    }

    console.log(`  [MLH] Found ${events.length} events`);
    return events;
  } catch (err) {
    if (err.name === 'AbortError' || err.code === 'ECONNRESET' || err.message.includes('403') || err.message.includes('429')) {
      console.warn(`  [MLH] Rate limited or blocked: ${err.message}`);
      return [];
    }
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
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml',
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

    // Extract JSON-LD structured data which Eventbrite embeds
    const jsonLdMatches = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
    for (const m of jsonLdMatches) {
      try {
        const data = JSON.parse(m[1]);
        const items = Array.isArray(data) ? data : data['@graph'] ? data['@graph'] : [data];
        for (const item of items) {
          if (!item || (item['@type'] !== 'Event' && item['@type'] !== 'SocialEvent')) continue;
          const title = item.name || '';
          if (!title) continue;

          const startDate = item.startDate || '';
          const endDate   = item.endDate   || '';
          const now = new Date();
          if (startDate) {
            const d = new Date(startDate);
            if (!isNaN(d.getTime()) && d < now) continue;
          }

          const locationData = item.location || {};
          let location = 'Online';
          if (locationData['@type'] === 'VirtualLocation') location = 'Online';
          else if (locationData.name) location = locationData.name;
          else if (locationData.address) {
            const addr = locationData.address;
            location = [addr.addressLocality, addr.addressRegion, addr.addressCountry].filter(Boolean).join(', ') || 'In-Person';
          }

          const registrationLink = item.url || item['@id'] || '';
          const organizer = item.organizer ? (item.organizer.name || '') : '';

          // Try to get image from og:image
          const ogImageMatch = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i);
          const imageUrl = ogImageMatch ? ogImageMatch[1] : '';

          events.push({
            title,
            description: item.description || `${defaultCategory} event: ${title}`,
            startDate,
            endDate,
            location,
            registrationLink,
            organizerName: organizer,
            imageUrl,
            tags: [defaultCategory, 'India', 'Student'],
            maxParticipants: 0,
            source: 'eventbrite',
            category: [defaultCategory],
          });
        }
      } catch (_) {}
    }

    // Fallback: parse HTML cards if JSON-LD gave nothing
    if (events.length === 0) {
      const titleMatches = [...html.matchAll(/<a[^>]+class="[^"]*event-title[^"]*"[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/gi)];
      for (const [, href, title] of titleMatches) {
        if (!title.trim()) continue;
        events.push({
          title: title.trim(),
          description: `${defaultCategory} event: ${title.trim()}`,
          startDate: '',
          endDate: '',
          location: 'India',
          registrationLink: href,
          organizerName: '',
          imageUrl: '',
          tags: [defaultCategory, 'India', 'Student'],
          maxParticipants: 0,
          source: 'eventbrite',
          category: [defaultCategory],
        });
      }
    }

    console.log(`  [Eventbrite] Found ${events.length} events on ${url}`);
    return events;
  } catch (err) {
    if (err.status === 403 || err.status === 429 || err.message.includes('403') || err.message.includes('429')) {
      console.warn(`  [Eventbrite] Rate limited: ${err.message}`);
      return [];
    }
    console.error(`  [Eventbrite] Error for ${url}:`, err.message);
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
  require('dotenv').config();
  scrapeMLHAndEventbrite().then(events => {
    console.log(JSON.stringify(events, null, 2));
    console.log(`Total: ${events.length}`);
  });
}

module.exports = { scrapeMLHAndEventbrite, scrapeMLH, scrapeEventbrite };
