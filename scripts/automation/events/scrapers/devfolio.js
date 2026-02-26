'use strict';

const { chromium } = require('playwright');
const { USER_AGENT, SCRAPER_TIMEOUT_MS, REQUEST_DELAY_MS } = require('../config');

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function scrapeDevfolio() {
  const events = [];
  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    });
    const context = await browser.newContext({ userAgent: USER_AGENT });
    const page = await context.newPage();
    page.setDefaultTimeout(SCRAPER_TIMEOUT_MS);

    console.log('  [Devfolio] Navigating to https://devfolio.co/hackathons ...');
    let loaded = false;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        await page.goto('https://devfolio.co/hackathons', { waitUntil: 'networkidle', timeout: SCRAPER_TIMEOUT_MS });
        loaded = true;
        break;
      } catch (err) {
        console.warn(`  [Devfolio] Load attempt ${attempt + 1} failed: ${err.message}`);
        if (attempt === 0) await sleep(3000);
      }
    }
    if (!loaded) {
      console.error('  [Devfolio] Could not load page after 2 attempts');
      return [];
    }

    // Scroll to load more cards
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, 2000));
      await sleep(REQUEST_DELAY_MS);
    }

    // Wait for hackathon cards
    try {
      await page.waitForSelector('a[href*="/hackathon/"]', { timeout: 10000 });
    } catch {
      console.warn('  [Devfolio] Card selector timeout — trying alternate selector');
      try {
        await page.waitForSelector('[class*="hackathon"]', { timeout: 5000 });
      } catch {
        console.warn('  [Devfolio] No cards found');
        return [];
      }
    }

    // Extract card data
    const rawCards = await page.evaluate(() => {
      const results = [];
      // Try multiple selectors Devfolio has used over time
      const cardSelectors = [
        'a[href*="/hackathon/"]',
        '[class*="HackathonCard"]',
        '[data-testid*="hackathon"]',
        '.sc-hackathon-card',
      ];
      let cards = [];
      for (const sel of cardSelectors) {
        cards = document.querySelectorAll(sel);
        if (cards.length > 0) break;
      }

      cards.forEach(card => {
        try {
          const titleEl = card.querySelector('h2, h3, [class*="title"], [class*="name"]');
          const title = titleEl ? titleEl.innerText.trim() : '';
          if (!title) return;

          const descEl = card.querySelector('p, [class*="tagline"], [class*="description"], [class*="subtitle"]');
          const description = descEl ? descEl.innerText.trim() : '';

          // Date elements
          const dateEls = card.querySelectorAll('[class*="date"], time, [class*="Date"]');
          let startDate = '', endDate = '';
          if (dateEls.length >= 2) {
            startDate = dateEls[0].innerText.trim();
            endDate   = dateEls[1].innerText.trim();
          } else if (dateEls.length === 1) {
            startDate = dateEls[0].innerText.trim();
          }

          // Location
          const locEl = card.querySelector('[class*="location"], [class*="Location"], [class*="venue"]');
          const location = locEl ? locEl.innerText.trim() : 'Online';

          // Registration link
          let registrationLink = card.href || card.getAttribute('href') || '';
          if (registrationLink && !registrationLink.startsWith('http')) {
            registrationLink = 'https://devfolio.co' + registrationLink;
          }

          // Organizer
          const orgEl = card.querySelector('[class*="organizer"], [class*="host"], [class*="by"]');
          const organizerName = orgEl ? orgEl.innerText.trim() : '';

          // Image
          const imgEl = card.querySelector('img');
          let imageUrl = '';
          if (imgEl) {
            imageUrl = imgEl.src || imgEl.getAttribute('data-src') || '';
          }
          if (!imageUrl) {
            // Check background-image style
            const styledEl = card.querySelector('[style*="background-image"]');
            if (styledEl) {
              const match = styledEl.getAttribute('style').match(/url\(["']?([^"')]+)["']?\)/);
              if (match) imageUrl = match[1];
            }
          }

          // Tags
          const tagEls = card.querySelectorAll('[class*="tag"], [class*="skill"], [class*="label"]');
          const tags = [...tagEls].map(t => t.innerText.trim()).filter(Boolean);

          // Team/participant size
          const teamEl = card.querySelector('[class*="team"], [class*="participant"], [class*="size"]');
          const maxParticipants = teamEl ? parseInt(teamEl.innerText.replace(/\D/g, '')) || 0 : 0;

          results.push({
            title, description, startDate, endDate, location,
            registrationLink, organizerName, imageUrl, tags, maxParticipants,
          });
        } catch (_) {
          // skip bad card
        }
      });
      return results;
    });

    const now = new Date();
    for (const card of rawCards) {
      if (!card.title) continue;
      // Only future events
      if (card.startDate) {
        const d = new Date(card.startDate);
        if (!isNaN(d.getTime()) && d < now) continue;
      }
      events.push({
        ...card,
        source: 'devfolio',
        category: ['Hackathon'],
      });
    }

    console.log(`  [Devfolio] Found ${events.length} upcoming events`);
    return events;
  } catch (err) {
    console.error('  [Devfolio] Scraper error:', err.message);
    return [];
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}

// Allow running standalone for testing
if (require.main === module) {
  require('dotenv').config();
  scrapeDevfolio().then(events => {
    console.log(JSON.stringify(events, null, 2));
    console.log(`Total: ${events.length}`);
  });
}

module.exports = { scrapeDevfolio };
