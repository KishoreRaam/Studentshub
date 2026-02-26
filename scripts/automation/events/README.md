# StudentsHub Events Automation

Scrapes student events from Indian platforms and writes them directly to Appwrite as pending documents for admin review.

## Full Flow

```
Scraper → raw events → normalise-and-write.js → Appwrite (approved: false) → Admin Panel → approved: true → Live on /events
```

## Running Locally

```bash
# Run all scrapers
npm run events:scrape

# Run individual scrapers for testing
npm run events:devfolio
npm run events:unstop
npm run events:mlh
```

Set up a `.env` file with:
```
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-server-api-key
DATABASE_ID=your-database-id
EVENTS_COLLECTION_ID=your-collection-id
APPWRITE_BUCKET_EVENT_MEDIA=your-bucket-id
```

## Sources

| Source | URL | Method |
|--------|-----|--------|
| Devfolio | devfolio.co/hackathons | Playwright |
| Unstop | unstop.com/hackathons, unstop.com/competitions | Playwright |
| MLH | mlh.io/seasons/2025/events | HTTP fetch |
| Eventbrite | eventbrite.com/d/india/... | HTTP fetch |

## Image Upload Strategy

1. **Try to download** the event's poster image from the source platform
2. **Upload to Appwrite Storage** — sets `posterFileId` + `thumbnailUrl` (Appwrite preview URL)
3. **Fallback** — if download fails, sets `thumbnailUrl` to a category-matched Unsplash URL

## Deduplication

Events are skipped if an existing Appwrite document has:
- 80%+ trigram similarity on title, AND
- Event date within 7 days of the existing event

## Adding a New Source

1. Create `scrapers/your-source.js` exporting `async function scrapeYourSource()`
2. The function must return an array of raw event objects with these fields:
   - `title`, `description`, `startDate`, `endDate`, `location`
   - `registrationLink`, `organizerName`, `imageUrl`, `tags`, `maxParticipants`
   - `source` (string ID), `category` (array)
3. Import and add to `Promise.allSettled` in `run-scrapers.js`
4. Add npm script in `package.json`
