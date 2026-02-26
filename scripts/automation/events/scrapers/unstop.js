'use strict';

const { chromium } = require('playwright');
const { USER_AGENT, SCRAPER_TIMEOUT_MS, REQUEST_DELAY_MS } = require('../config');

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function scrapeUnstopPage(page, url, defaultCategory) {
  const events = [];
  console.log(`  [Unstop] Navigating to ${url} ...`);

  let loaded = false;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: SCRAPER_TIMEOUT_MS });
      loaded = true;
      break;
    } catch (err) {
      console.warn(`  [Unstop] Load attempt ${attempt + 1} failed: ${err.message}`);
      if (attempt === 0) await sleep(3000);
    }
  }
  if (!loaded) {
    console.warn(`  [Unstop] Could not load ${url}`);
    return [];
  }

  // Scroll to load more
  for (let i = 0; i < 2; i++) {
    await page.evaluate(() => window.scrollBy(0, 2000));
    await sleep(REQUEST_DELAY_MS);
  }

  // Wait for listing cards
  try {
    await page.waitForSelector('[class*="card"], [class*="listing"], .competition-card, [class*="Card"]', { timeout: 10000 });
  } catch {
    console.warn(`  [Unstop] No cards found on ${url}`);
    return [];
  }

  const rawCards = await page.evaluate((defaultCat) => {
    const results = [];
    const cardSelectors = [
      '[class*="competition-card"]',
      '[class*="card__"]',
      '[class*="listing-card"]',
      '[class*="Card_card"]',
      'li[class*="card"]',
      'article',
    ];

    let cards = [];
    for (const sel of cardSelectors) {
      cards = document.querySelectorAll(sel);
      if (cards.length > 0) break;
    }

    cards.forEach(card => {
      try {
        const titleEl = card.querySelector('h2, h3, h4, [class*="title"], [class*="name"]');
        const title = titleEl ? titleEl.innerText.trim() : '';
        if (!title || title.length < 3) return;

        const descEl = card.querySelector('p, [class*="desc"], [class*="about"], [class*="detail"]');
        const description = descEl ? descEl.innerText.trim() : '';

        // Organizer
        const orgEl = card.querySelector('[class*="org"], [class*="college"], [class*="company"], [class*="organiz"]');
        const organizerName = orgEl ? orgEl.innerText.trim() : '';

        // Dates
        const dateEls = card.querySelectorAll('[class*="date"], time, [class*="deadline"], [class*="Date"]');
        let startDate = '', endDate = '', registrationDeadline = '';
        if (dateEls.length >= 2) {
          startDate = dateEls[0].innerText.trim();
          endDate   = dateEls[1].innerText.trim();
        } else if (dateEls.length === 1) {
          startDate = dateEls[0].innerText.trim();
        }

        // Location/mode
        const modeEl = card.querySelector('[class*="mode"], [class*="location"], [class*="online"], [class*="offline"]');
        let location = 'Online';
        if (modeEl) {
          const modeText = modeEl.innerText.trim().toLowerCase();
          if (modeText.includes('offline') || modeText.includes('in-person')) location = 'In-Person';
          else if (modeText.includes('hybrid')) location = 'Hybrid';
          else location = modeEl.innerText.trim() || 'Online';
        }

        // Venue (city) for offline events
        const venueEl = card.querySelector('[class*="venue"], [class*="city"], [class*="place"]');
        if (venueEl && location !== 'Online') {
          location = venueEl.innerText.trim() || location;
        }

        // Registration link
        const linkEl = card.querySelector('a[href]');
        let registrationLink = linkEl ? (linkEl.href || linkEl.getAttribute('href')) : '';
        if (registrationLink && !registrationLink.startsWith('http')) {
          registrationLink = 'https://unstop.com' + registrationLink;
        }

        // Image
        const imgEl = card.querySelector('img');
        let imageUrl = '';
        if (imgEl) imageUrl = imgEl.src || imgEl.getAttribute('data-src') || '';

        // Tags
        const tagEls = card.querySelectorAll('[class*="tag"], [class*="category"], [class*="skill"]');
        const tags = [...tagEls].map(t => t.innerText.trim()).filter(Boolean);

        // Participants / teams
        const partEl = card.querySelector('[class*="team"], [class*="participant"], [class*="registr"]');
        const participantsText = partEl ? partEl.innerText : '';
        const maxParticipants = parseInt(participantsText.replace(/\D/g, '')) || 0;

        // Prize
        const prizeEl = card.querySelector('[class*="prize"], [class*="reward"], [class*="winning"]');
        let prizeMoney = '';
        if (prizeEl) prizeMoney = prizeEl.innerText.trim();

        let finalDesc = description;
        if (prizeMoney) finalDesc += (finalDesc ? '\n\nPrize: ' : 'Prize: ') + prizeMoney;

        results.push({
          title,
          description: finalDesc,
          organizerName,
          startDate,
          endDate,
          registrationDeadline,
          location,
          registrationLink,
          imageUrl,
          tags,
          maxParticipants,
        });
      } catch (_) {
        // skip bad card
      }
    });
    return results;
  }, defaultCategory);

  const now = new Date();
  for (const card of rawCards) {
    if (!card.title) continue;
    if (card.startDate) {
      const d = new Date(card.startDate);
      if (!isNaN(d.getTime()) && d < now) continue;
    }
    events.push({
      ...card,
      source: 'unstop',
      category: [defaultCategory],
    });
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
    const context = await browser.newContext({ userAgent: USER_AGENT });
    const page = await context.newPage();
    page.setDefaultTimeout(SCRAPER_TIMEOUT_MS);

    const hackathons  = await scrapeUnstopPage(page, 'https://unstop.com/hackathons?activeTab=open', 'Hackathon');
    await sleep(REQUEST_DELAY_MS);
    const competitions = await scrapeUnstopPage(page, 'https://unstop.com/competitions?activeTab=open', 'Competition');

    return [...hackathons, ...competitions];
  } catch (err) {
    console.error('  [Unstop] Scraper error:', err.message);
    return [];
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}

// Allow running standalone
if (require.main === module) {
  require('dotenv').config();
  scrapeUnstop().then(events => {
    console.log(JSON.stringify(events, null, 2));
    console.log(`Total: ${events.length}`);
  });
}

module.exports = { scrapeUnstop };
