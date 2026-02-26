'use strict';

/**
 * Unstop scraper — Playwright-based (Angular SPA requires JS execution).
 * Uses domcontentloaded + explicit wait for Angular to fetch and render cards.
 */

const { chromium } = require('playwright');
const { USER_AGENT, SCRAPER_TIMEOUT_MS } = require('../config');

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function scrapeUnstopPage(page, url, defaultCategory) {
  const events = [];
  console.log(`  [Unstop] Navigating to ${url} ...`);

  try {
    // domcontentloaded is immediate; Angular will then fetch data asynchronously
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: SCRAPER_TIMEOUT_MS });
  } catch (err) {
    console.warn(`  [Unstop] Navigation failed: ${err.message}`);
    return [];
  }

  // Wait for Angular to bootstrap + make API calls + render cards
  // Unstop uses Angular Universal; cards appear after ~3-5 seconds
  console.log('  [Unstop] Waiting for cards to render...');
  let cardsFound = false;

  const cardSelectors = [
    'app-competition-card',
    '[class*="competition_card"]',
    '[class*="hackathon_card"]',
    '.competition-listing__item',
    '[id*="competition"]',
    'article',
    '.ng-star-inserted[class*="card"]',
    '[class*="listing"] [class*="card"]',
    '[class*="Card_card"]',
  ];

  for (const sel of cardSelectors) {
    try {
      await page.waitForSelector(sel, { timeout: 8000 });
      cardsFound = true;
      console.log(`  [Unstop] Cards found with selector: ${sel}`);
      break;
    } catch (_) {}
  }

  if (!cardsFound) {
    // Angular might still be bootstrapping — wait a bit more and try generic content
    await sleep(4000);
    const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 200));
    console.warn(`  [Unstop] No specific card selector matched. Body: ${bodyText}`);
  }

  // Scroll to trigger lazy loading
  await page.evaluate(() => window.scrollBy(0, 1500));
  await sleep(2000);
  await page.evaluate(() => window.scrollBy(0, 1500));
  await sleep(2000);

  // Extract card data from rendered DOM
  const rawCards = await page.evaluate(() => {
    const results = [];

    // Try broad selectors in order of specificity
    const cardSelectors = [
      'app-competition-card',
      '[class*="competition_card"]',
      '[class*="hackathon_card"]',
      '.competition-listing__item',
      'article',
      '[class*="card"]',
    ];

    let cards = [];
    for (const sel of cardSelectors) {
      const found = document.querySelectorAll(sel);
      if (found.length >= 3) { cards = found; break; }
    }

    if (cards.length === 0) {
      // Last resort: look for any element that has a title + date
      cards = document.querySelectorAll('[class*="item"], [class*="row"], li');
    }

    cards.forEach(card => {
      try {
        // Title
        const titleEl = card.querySelector('h2, h3, h4, [class*="title"], [class*="name"], strong');
        const title = titleEl ? titleEl.innerText.trim() : '';
        if (!title || title.length < 3 || title.length > 200) return;

        // Skip navigation/filter elements
        if (['Hackathons', 'Competitions', 'Filter', 'Sort'].includes(title)) return;

        // Description
        const descEl = card.querySelector('p, [class*="desc"], [class*="about"], [class*="tagline"]');
        const description = descEl ? descEl.innerText.trim() : '';

        // Organizer
        const orgEl = card.querySelector('[class*="org"], [class*="college"], [class*="company"], [class*="host"], [class*="organiz"]');
        const organizerName = orgEl ? orgEl.innerText.trim() : '';

        // Dates
        const dateEls = card.querySelectorAll('[class*="date"], time, [class*="deadline"], [class*="start"], [class*="end"]');
        let startDate = '', endDate = '';
        if (dateEls.length >= 2) {
          startDate = dateEls[0].innerText.replace(/[^\w\s,\-/:]/g, '').trim();
          endDate   = dateEls[1].innerText.replace(/[^\w\s,\-/:]/g, '').trim();
        } else if (dateEls.length === 1) {
          startDate = dateEls[0].innerText.replace(/[^\w\s,\-/:]/g, '').trim();
        }

        // Location/mode
        const modeEl = card.querySelector('[class*="mode"], [class*="location"], [class*="online"], [class*="offline"], [class*="type"]');
        let location = 'Online';
        if (modeEl) {
          const t = modeEl.innerText.trim().toLowerCase();
          if (t.includes('offline') || t.includes('in-person') || t.includes('on-site')) location = 'In-Person';
          else if (t.includes('hybrid')) location = 'Hybrid';
          else location = modeEl.innerText.trim() || 'Online';
        }

        // Link
        const linkEl = card.querySelector('a[href*="unstop.com"], a[href^="/"]');
        let registrationLink = '';
        if (linkEl) {
          registrationLink = linkEl.href || linkEl.getAttribute('href') || '';
          if (registrationLink && !registrationLink.startsWith('http')) {
            registrationLink = 'https://unstop.com' + registrationLink;
          }
        }
        // Fallback: any ancestor anchor
        if (!registrationLink) {
          let el = card;
          while (el && el.tagName !== 'A') el = el.parentElement;
          if (el && el.tagName === 'A') registrationLink = el.href || '';
        }

        // Image
        const imgEl = card.querySelector('img[src*="cloudfront"], img[src*="unstop"], img[src]:not([src=""])');
        const imageUrl = imgEl ? (imgEl.src || imgEl.getAttribute('data-src') || '') : '';

        // Tags
        const tagEls = card.querySelectorAll('[class*="tag"], [class*="skill"], [class*="category"], [class*="label"]');
        const tags = [...tagEls].map(t => t.innerText.trim()).filter(Boolean).slice(0, 6);

        // Max participants
        const partEl = card.querySelector('[class*="team"], [class*="participant"], [class*="registr"], [class*="applic"]');
        const maxParticipants = partEl ? parseInt(partEl.innerText.replace(/\D/g, '')) || 0 : 0;

        // Prize
        const prizeEl = card.querySelector('[class*="prize"], [class*="reward"], [class*="winning"]');
        let finalDesc = description;
        if (prizeEl) finalDesc += (finalDesc ? '\n\nPrize: ' : 'Prize: ') + prizeEl.innerText.trim();

        results.push({ title, description: finalDesc, organizerName, startDate, endDate, location, registrationLink, imageUrl, tags, maxParticipants });
      } catch (_) {}
    });

    return results;
  });

  const now = new Date();
  for (const card of rawCards) {
    if (!card.title) continue;
    if (card.startDate) {
      const d = new Date(card.startDate);
      if (!isNaN(d.getTime()) && d < now) continue;
    }
    events.push({ ...card, source: 'unstop', category: [defaultCategory] });
  }

  console.log(`  [Unstop] Found ${events.length} events on ${url}`);
  return events;
}

async function scrapeUnstop() {
  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    });
    const context = await browser.newContext({
      userAgent: USER_AGENT,
      locale: 'en-US',
    });
    const page = await context.newPage();
    page.setDefaultTimeout(SCRAPER_TIMEOUT_MS);

    const hackathons   = await scrapeUnstopPage(page, 'https://unstop.com/hackathons?activeTab=open', 'Hackathon');
    await sleep(2000);
    const competitions = await scrapeUnstopPage(page, 'https://unstop.com/competitions?activeTab=open', 'Competition');

    const total = [...hackathons, ...competitions];
    console.log(`  [Unstop] Total: ${total.length} events`);
    return total;
  } catch (err) {
    console.error('  [Unstop] Scraper error:', err.message);
    return [];
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}

// Standalone test
if (require.main === module) {
  const { loadEnv } = require('../utils');
  loadEnv();
  scrapeUnstop().then(events => {
    console.log(JSON.stringify(events, null, 2));
    console.log(`\nTotal: ${events.length}`);
  });
}

module.exports = { scrapeUnstop };
