'use strict';

const fetch = require('node-fetch');
const { Storage, ID } = require('node-appwrite');
const { FALLBACK_IMAGES, VALID_CATEGORIES, MAX_DESCRIPTION_LENGTH } = require('./config');

// Load .env and remap VITE_ prefixed vars for local development
function loadEnv() {
  require('dotenv').config();
  // In CI the vars are set directly; locally .env uses VITE_ prefix — remap them
  const mappings = {
    APPWRITE_ENDPOINT:           'VITE_APPWRITE_ENDPOINT',
    APPWRITE_PROJECT_ID:         'VITE_APPWRITE_PROJECT',
    DATABASE_ID:                 'VITE_APPWRITE_DATABASE_ID',
    EVENTS_COLLECTION_ID:        'VITE_APPWRITE_COLLECTION_EVENTS',
    APPWRITE_BUCKET_EVENT_MEDIA: 'VITE_APPWRITE_BUCKET_EVENT_MEDIA',
  };
  for (const [target, source] of Object.entries(mappings)) {
    if (!process.env[target] && process.env[source]) {
      process.env[target] = process.env[source];
    }
  }
}

// Strip HTML tags and decode common entities
function stripHtml(str) {
  if (!str) return '';
  return str
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// Truncate at sentence boundary up to MAX_DESCRIPTION_LENGTH
function truncateDescription(str) {
  if (!str) return '';
  const clean = stripHtml(str);
  if (clean.length <= MAX_DESCRIPTION_LENGTH) return clean;
  const truncated = clean.slice(0, MAX_DESCRIPTION_LENGTH);
  const lastPeriod = Math.max(
    truncated.lastIndexOf('. '),
    truncated.lastIndexOf('! '),
    truncated.lastIndexOf('? ')
  );
  if (lastPeriod > MAX_DESCRIPTION_LENGTH * 0.7) {
    return truncated.slice(0, lastPeriod + 1).trim();
  }
  return truncated.trim() + '...';
}

// Parse various date strings to ISO 8601 with +05:30 offset
function parseToISO(dateStr) {
  if (!dateStr) return null;
  try {
    // Already ISO
    if (/^\d{4}-\d{2}-\d{2}T/.test(dateStr)) {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) return d.toISOString();
    }
    // Try direct parse
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d.toISOString();
    // Try common Indian formats: "15 Mar 2025", "March 15, 2025", "15/03/2025"
    const ddMMYYYY = dateStr.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if (ddMMYYYY) {
      const [, dd, mm, yyyy] = ddMMYYYY;
      const d2 = new Date(`${yyyy}-${mm.padStart(2,'0')}-${dd.padStart(2,'0')}T09:00:00.000Z`);
      if (!isNaN(d2.getTime())) return d2.toISOString();
    }
    return null;
  } catch {
    return null;
  }
}

// Keyword-based category guesser
function guessCategory(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  if (/hackathon|hack\s*fest|code\s*sprint/.test(text)) return 'Hackathon';
  if (/workshop|hands.?on|bootcamp/.test(text)) return 'Workshop';
  if (/webinar|online\s*seminar|zoom\s*session/.test(text)) return 'Webinar';
  if (/competition|contest|challenge|olympiad/.test(text)) return 'Competition';
  if (/conference|summit|fest|convention/.test(text)) return 'Conference';
  if (/technical|tech\s*talk|coding|programming/.test(text)) return 'Technical';
  if (/seminar|lecture|talk/.test(text)) return 'Seminar';
  if (/cultural|music|art|dance|drama/.test(text)) return 'Cultural';
  if (/sports|game|tournament|athletic/.test(text)) return 'Sports';
  if (/symposium|colloquium/.test(text)) return 'Symposium';
  return 'Technical';
}

// Build 3-6 relevant tags
function buildTags(title, description, category) {
  const tags = new Set();
  if (Array.isArray(category)) category.forEach(c => tags.add(c));
  else tags.add(category);

  const text = `${title} ${description}`.toLowerCase();
  const keywords = [
    ['python','Python'],['javascript','JavaScript'],['react','React'],
    ['ai','AI'],['ml','Machine Learning'],['data science','Data Science'],
    ['web dev','Web Development'],['mobile','Mobile'],['blockchain','Blockchain'],
    ['cloud','Cloud'],['devops','DevOps'],['cybersecurity','Cybersecurity'],
    ['open source','Open Source'],['startup','Startup'],['innovation','Innovation'],
    ['india','India'],['student','Student'],['college','College'],
    ['coding','Coding'],['design','Design'],['ux','UX'],['api','API'],
  ];
  for (const [kw, tag] of keywords) {
    if (text.includes(kw)) tags.add(tag);
    if (tags.size >= 6) break;
  }
  // always include Student if not already 6 tags
  if (tags.size < 3) tags.add('Student');
  if (tags.size < 3) tags.add('India');
  return [...tags].slice(0, 6);
}

// Download image buffer from URL, returns Buffer or null
async function downloadImageBuffer(url) {
  if (!url || !url.startsWith('http')) return null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) return null;
    const buffer = await res.buffer();
    if (buffer.length > 5 * 1024 * 1024) return null; // skip >5MB
    return buffer;
  } catch {
    return null;
  }
}

// Upload image buffer to Appwrite Storage
async function uploadImageToAppwrite(buffer, filename) {
  try {
    const { Storage, ID, InputFile } = require('node-appwrite');
    const { Client } = require('node-appwrite');
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);
    const storage = new Storage(client);
    const BUCKET_ID = process.env.APPWRITE_BUCKET_EVENT_MEDIA;
    const fileId = ID.unique();
    await storage.createFile(
      BUCKET_ID,
      fileId,
      InputFile.fromBuffer(buffer, filename || 'poster.jpg'),
    );
    const ENDPOINT   = process.env.APPWRITE_ENDPOINT;
    const PROJECT_ID = process.env.APPWRITE_PROJECT_ID;
    const thumbnailUrl = `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/preview?width=800&height=400&project=${PROJECT_ID}`;
    return { posterFileId: fileId, thumbnailUrl };
  } catch (err) {
    console.warn('Image upload failed:', err.message);
    return null;
  }
}

// Return fallback Unsplash image URL for a category
function getFallbackImage(category) {
  return FALLBACK_IMAGES[category] || FALLBACK_IMAGES.default;
}

// Search Unsplash for a relevant image; returns URL string or null
async function searchUnsplashImage(query) {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return null;
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&per_page=3`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Authorization: `Client-ID ${key}` },
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`Unsplash HTTP ${res.status}`);
    const data = await res.json();
    return data.results?.[0]?.urls?.regular || null;
  } catch (err) {
    console.warn('Unsplash search failed:', err.message);
    return null;
  }
}

// Fuzzy duplicate check: same title (80% similarity) + date within 7 days
function isDuplicate(title, eventDate, existingEvents) {
  if (!title) return false;
  const normalise = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const normTitle = normalise(title);
  const eventTime = eventDate ? new Date(eventDate).getTime() : null;
  const sevenDays = 7 * 24 * 60 * 60 * 1000;

  for (const ev of existingEvents) {
    const evTitle = normalise(ev.title || '');
    // Jaccard-like similarity on trigrams
    const similarity = trigramSimilarity(normTitle, evTitle);
    if (similarity >= 0.8) {
      if (!eventTime || !ev.eventDate) return true;
      const evTime = new Date(ev.eventDate).getTime();
      if (Math.abs(eventTime - evTime) <= sevenDays) return true;
    }
  }
  return false;
}

function trigramSimilarity(a, b) {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const trigrams = s => {
    const set = new Set();
    for (let i = 0; i < s.length - 2; i++) set.add(s.slice(i, i + 3));
    return set;
  };
  const ta = trigrams(a);
  const tb = trigrams(b);
  let intersection = 0;
  for (const t of ta) if (tb.has(t)) intersection++;
  return (2 * intersection) / (ta.size + tb.size);
}

module.exports = {
  loadEnv,
  stripHtml,
  truncateDescription,
  parseToISO,
  guessCategory,
  buildTags,
  downloadImageBuffer,
  uploadImageToAppwrite,
  getFallbackImage,
  searchUnsplashImage,
  isDuplicate,
};
