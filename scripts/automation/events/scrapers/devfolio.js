'use strict';

/**
 * Devfolio scraper — parses __NEXT_DATA__ embedded in devfolio.co/hackathons
 * No API auth needed; the full list is SSR'd into the page HTML.
 */

const fetch = require('node-fetch');
const { USER_AGENT } = require('../config');

async function scrapeDevfolio() {
  const events = [];
  const now = new Date();

  try {
    console.log('  [Devfolio] Fetching https://devfolio.co/hackathons ...');
    const res = await fetch('https://devfolio.co/hackathons', {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept':     'text/html',
        'Referer':    'https://devfolio.co',
      },
      timeout: 20000,
    });

    if (!res.ok) {
      console.warn(`  [Devfolio] HTTP ${res.status}`);
      return [];
    }

    const html = await res.text();

    // Extract __NEXT_DATA__ which contains all hackathon data pre-rendered
    const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    if (!match) {
      console.warn('  [Devfolio] __NEXT_DATA__ not found in page');
      return [];
    }

    let pageData;
    try {
      pageData = JSON.parse(match[1]);
    } catch (e) {
      console.warn('  [Devfolio] Failed to parse __NEXT_DATA__:', e.message);
      return [];
    }

    // Path: props.pageProps.dehydratedState.queries[0].state.data
    const queries = pageData?.props?.pageProps?.dehydratedState?.queries || [];
    const hackathonQuery = queries.find(q => q.queryKey === 'fetchAllHackathonTypes') || queries[0];
    const data = hackathonQuery?.state?.data;

    if (!data) {
      console.warn('  [Devfolio] No hackathon data found in __NEXT_DATA__');
      return [];
    }

    // Take open and upcoming (skip past, skip featured to avoid duplicates)
    const sections = ['open_hackathons', 'upcoming_hackathons'];
    const seen = new Set();

    for (const section of sections) {
      const hackathons = data[section] || [];
      for (const h of hackathons) {
        if (!h.slug || seen.has(h.slug)) continue;
        seen.add(h.slug);

        const title = (h.name || '').trim();
        if (!title) continue;

        const startDate = h.starts_at || '';
        const endDate   = h.ends_at   || '';

        // Only future events
        if (startDate) {
          const d = new Date(startDate);
          if (!isNaN(d.getTime()) && d < now) continue;
        }

        const isOnline = h.is_online === false ? false : true;
        const location = isOnline ? 'Online' : 'In-Person';

        // Build the registration / apply URL
        const registrationLink = `https://${h.slug}.devfolio.co/apply`;

        // Themes array → tags
        const tags = Array.isArray(h.themes)
          ? h.themes.map(t => (typeof t === 'string' ? t : t.name || '')).filter(Boolean)
          : [];

        const maxParticipants = parseInt(h.participants_count || h.max_participants || 0) || 0;

        events.push({
          title,
          description: `Hackathon hosted on Devfolio. ${isOnline ? 'Online event.' : 'In-person event.'}`,
          startDate,
          endDate,
          location,
          registrationLink,
          organizerName: '',
          imageUrl: '',     // not available in listing endpoint; fallback used
          tags,
          maxParticipants,
          source:   'devfolio',
          category: ['Hackathon'],
        });
      }
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
  const { loadEnv } = require('../utils');
  loadEnv();
  scrapeDevfolio().then(events => {
    console.log(JSON.stringify(events, null, 2));
    console.log(`\nTotal: ${events.length}`);
  });
}

module.exports = { scrapeDevfolio };
