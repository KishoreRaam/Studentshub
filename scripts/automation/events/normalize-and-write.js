'use strict';

const path = require('path');
const fs   = require('fs');

const {
  loadEnv, stripHtml, truncateDescription, parseToISO,
  guessCategory, buildTags, downloadImageBuffer,
  uploadImageToAppwrite, getFallbackImage, isDuplicate,
} = require('./utils');

// Load env FIRST before requiring appwrite-client (which reads env vars at require-time)
loadEnv();

const { databases, ID, DATABASE_ID, COLLECTION_ID } = require('./appwrite-client');

// node-appwrite Query
let Query;
try {
  Query = require('node-appwrite').Query;
} catch {
  Query = { limit: n => `limit(${n})`, orderDesc: f => `orderDesc(${f})` };
}

const REQUIRED_ENV = [
  'APPWRITE_ENDPOINT', 'APPWRITE_PROJECT_ID', 'APPWRITE_API_KEY',
  'DATABASE_ID', 'EVENTS_COLLECTION_ID', 'APPWRITE_BUCKET_EVENT_MEDIA',
];

function verifyEnv() {
  const missing = REQUIRED_ENV.filter(k => !process.env[k]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

function normaliseLocation(raw) {
  if (!raw) return 'Online';
  const lower = raw.toLowerCase();
  if (lower.includes('online') || lower.includes('virtual') || lower.includes('remote') || lower.includes('digital')) return 'Online';
  if (lower.includes('in-person') || lower.includes('offline') || lower.includes('on-site')) return 'In-Person';
  return raw.trim().slice(0, 200);
}

function isValidUrl(str) {
  if (!str) return false;
  try {
    const u = new URL(str);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

async function normaliseAndWrite(allRawEvents, sourceCounts) {
  verifyEnv();

  const startTime = Date.now();
  const stats = {
    runDate: new Date().toISOString().slice(0, 10),
    sourceCounts: sourceCounts || {},
    totalScraped: allRawEvents.length,
    duplicatesSkipped: 0,
    eventsAdded: 0,
    imageUploaded: 0,
    imageFallback: 0,
    errors: [],
    durationSeconds: 0,
  };

  console.log(`\nNormalising ${allRawEvents.length} raw events...`);

  // Load existing events for deduplication
  let existingEvents = [];
  try {
    const { documents } = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.limit(500), Query.orderDesc('$createdAt')]
    );
    existingEvents = documents;
    console.log(`Loaded ${existingEvents.length} existing events for dedup check`);
  } catch (err) {
    console.warn('Could not load existing events for dedup:', err.message);
  }

  const now = new Date();

  for (const raw of allRawEvents) {
    try {
      if (!raw.title || raw.title.trim().length < 3) continue;

      // Parse dates
      const eventDate = parseToISO(raw.startDate);
      if (!eventDate) {
        // No valid date — use 30 days from now as placeholder only if title suggests future
        console.warn(`  Skipping "${raw.title}" — no parseable date`);
        continue;
      }
      if (new Date(eventDate) < now) {
        console.warn(`  Skipping past event: "${raw.title}" (${eventDate})`);
        continue;
      }

      // Dedup check
      if (isDuplicate(raw.title, eventDate, existingEvents)) {
        stats.duplicatesSkipped++;
        console.log(`  Dup skipped: ${raw.title}`);
        continue;
      }

      // end date: raw.endDate or +48h
      let endDate = parseToISO(raw.endDate);
      if (!endDate) {
        const d = new Date(eventDate);
        d.setHours(d.getHours() + 48);
        endDate = d.toISOString();
      }

      // Category
      const rawCat = Array.isArray(raw.category) && raw.category.length
        ? raw.category
        : [guessCategory(raw.title, raw.description || '')];
      const category = rawCat;
      const eventType = category[0];

      // Description
      const description = truncateDescription(stripHtml(raw.description || ''));

      // Location
      const location = normaliseLocation(raw.location);

      // Registration link
      const registrationLink = isValidUrl(raw.registrationLink) ? raw.registrationLink : 'N/A';

      // Tags
      const tags = (raw.tags && raw.tags.length > 0)
        ? [...new Set([...raw.tags.slice(0, 3), ...buildTags(raw.title, raw.description || '', category)])].slice(0, 6)
        : buildTags(raw.title, raw.description || '', category);

      // Max participants
      const maxParticipants = parseInt(raw.maxParticipants) || 0;

      // Build payload (without image fields yet)
      const payload = {
        title:            raw.title.trim().slice(0, 200),
        description:      description || `${eventType} event: ${raw.title.trim()}`,
        category,
        eventType,
        status:           'Upcoming',
        eventDate,
        time:             endDate,
        organizer:        (raw.organizerName || 'Unknown Organizer').trim().slice(0, 200),
        location,
        registrationLink,
        submittedBy:      'automation-bot',
        createdByUserId:  'automation-bot',
        submitterType:    'student',
        approved:         false,
        participantCount: 0,
        maxParticipants,
        tags,
        thumbnailUrl:     '',
        // posterFileId intentionally omitted until we have one
      };

      // Image handling
      let imageUploaded = false;
      if (raw.imageUrl && isValidUrl(raw.imageUrl)) {
        const buffer = await downloadImageBuffer(raw.imageUrl);
        if (buffer) {
          const uploadResult = await uploadImageToAppwrite(buffer, 'poster.jpg');
          if (uploadResult) {
            payload.posterFileId = uploadResult.posterFileId;
            payload.thumbnailUrl = uploadResult.thumbnailUrl;
            imageUploaded = true;
            stats.imageUploaded++;
          }
        }
      }
      if (!imageUploaded) {
        payload.thumbnailUrl = getFallbackImage(category[0]);
        stats.imageFallback++;
      }

      // Write to Appwrite
      await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), payload);
      stats.eventsAdded++;
      // Add to existingEvents to prevent within-run duplicates
      existingEvents.push({ title: payload.title, eventDate: payload.eventDate });
      console.log(`  ✓ Added: ${payload.title} (${eventType})`);

    } catch (err) {
      const errInfo = { title: raw.title || '(unknown)', error: err.message };
      stats.errors.push(errInfo);
      console.error(`  ✗ Error for "${raw.title}": ${err.message}`);
    }
  }

  stats.durationSeconds = Math.round((Date.now() - startTime) / 1000);

  // Write report
  const reportsDir = path.join(__dirname, '..', 'reports');
  fs.mkdirSync(reportsDir, { recursive: true });
  const reportPath = path.join(reportsDir, `events-update-${stats.runDate}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(stats, null, 2));
  console.log(`\nReport written to ${reportPath}`);

  // Print summary
  console.log('\n══════════════════════════════════════════');
  console.log('  StudentsHub Events Automation');
  console.log('══════════════════════════════════════════');
  console.log(`  Sources checked:     ${Object.keys(stats.sourceCounts).length} / 4`);
  console.log(`  Total scraped:       ${stats.totalScraped}`);
  console.log(`  Duplicates skipped:  ${stats.duplicatesSkipped}`);
  console.log(`  New events added:    ${stats.eventsAdded}`);
  console.log(`  Images uploaded:     ${stats.imageUploaded}`);
  console.log(`  Fallback images:     ${stats.imageFallback}`);
  console.log(`  Errors:              ${stats.errors.length}`);
  console.log('══════════════════════════════════════════');
  console.log('  Check admin panel: /admin/events');
  console.log('══════════════════════════════════════════\n');

  return stats;
}

module.exports = { normaliseAndWrite };
