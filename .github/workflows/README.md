# GitHub Actions Workflows

## update-events.yml — Daily Events Scraper

Runs every day at 7:00 AM IST (01:30 UTC). Scrapes Indian student event platforms and writes new events to Appwrite with `approved: false` for admin review.

### Required GitHub Secrets

Add these in **Settings → Secrets and variables → Actions → Repository secrets**:

| Secret Name | Description |
|---|---|
| `VITE_APPWRITE_ENDPOINT` | Appwrite API endpoint URL |
| `VITE_APPWRITE_PROJECT` | Appwrite Project ID |
| `APPWRITE_API_KEY` | Appwrite server-side API key (never expose client-side) |
| `VITE_APPWRITE_DATABASE_ID` | Appwrite Database ID |
| `VITE_APPWRITE_COLLECTION_EVENTS` | Appwrite Events Collection ID |
| `VITE_APPWRITE_BUCKET_EVENT_MEDIA` | Appwrite Storage Bucket ID for event images |

### Manual Trigger

1. Go to **Actions** tab in GitHub
2. Select **Daily Events Scraper** from the left sidebar
3. Click **Run workflow** → **Run workflow**

### Adding a New Scraper Source

1. Create `scripts/automation/events/scrapers/your-source.js` exporting `async function scrapeYourSource()`
2. Add it to `run-scrapers.js` in the `Promise.allSettled` array
3. Add a new `npm` script in `package.json`
4. Update sourceCounts in the orchestrator
