# Events Collection Schema - Appwrite Database Design

> **Collection**: EVENTS (main event submissions)
> **Database ID**: `68d3d183000b0146b221`
> **Collection ID**: `events` (matches `COLLECTIONS.EVENTS` in `src/lib/appwrite.js`)
> **Platform**: Appwrite Cloud v21.2

---

## 1. Collection Configuration

| Property | Value |
|---|---|
| **Name** | Events |
| **Collection ID** | `events` |
| **Document Security** | `true` (document-level permissions enabled) |
| **Enabled** | `true` |

### Collection-Level Permissions

None set at collection level. All access is controlled via **document-level permissions** (see Section 4).

---

## 2. Attributes

### 2.1 Core Event Fields

| # | Key | Type | Size | Required | Default | Array | Notes |
|---|-----|------|------|----------|---------|-------|-------|
| 1 | `title` | string | 255 | Yes | - | No | Event name |
| 2 | `description` | string | 5000 | Yes | - | No | Full event description |
| 3 | `category` | enum | - | Yes | - | No | Values: `Webinar`, `Hackathon`, `Workshop`, `Conference` |
| 4 | `status` | enum | - | Yes | `Upcoming` | No | Values: `Live Now`, `Upcoming`, `Registration Open`, `Registration Closed`, `Completed` |
| 5 | `eventDate` | datetime | - | Yes | - | No | ISO 8601 datetime for event start |
| 6 | `time` | string | 50 | Yes | - | No | Display time string, e.g. "6:00 PM IST" |
| 7 | `duration` | string | 50 | No | - | No | e.g. "2 hours", "3 days" |

### 2.2 Organizer Fields

| # | Key | Type | Size | Required | Default | Array | Notes |
|---|-----|------|------|----------|---------|-------|-------|
| 8 | `organizer` | string | 255 | Yes | - | No | Organization or person name |
| 9 | `organizerLogo` | string | 255 | No | - | No | URL to organizer logo image |
| 10 | `organizerWebsite` | string | 255 | No | - | No | Organizer website URL |

### 2.3 Participation Fields

| # | Key | Type | Size | Required | Default | Array | Notes |
|---|-----|------|------|----------|---------|-------|-------|
| 11 | `participantCount` | integer | - | No | `0` | No | Current registered participant count |
| 12 | `maxParticipants` | integer | - | No | - | No | Capacity limit; null = unlimited |
| 13 | `registrationLink` | string | 500 | Yes | - | No | External registration URL |

### 2.4 Media / Storage Fields

| # | Key | Type | Size | Required | Default | Array | Notes |
|---|-----|------|------|----------|---------|-------|-------|
| 14 | `posterFileId` | string | 255 | No | - | No | Appwrite Storage file ID for poster image (references a file in a dedicated `event-posters` bucket) |
| 15 | `thumbnailUrl` | string | 500 | No | - | No | Pre-computed thumbnail URL or external image URL; used for backward compatibility with existing event card components |

### 2.5 Targeting & Classification

| # | Key | Type | Size | Required | Default | Array | Notes |
|---|-----|------|------|----------|---------|-------|-------|
| 16 | `streams` | string | 50 | No | - | **Yes** | Array of target student streams. Values: `All`, `CSE`, `Mechatronics`, `AI/ML`, `Data Science`, `Cybersecurity`, `Web Development`, `Mobile Development`, `DevOps`, `Design` |
| 17 | `tags` | string | 100 | No | - | **Yes** | Free-form tags for search/filter |
| 18 | `location` | string | 255 | No | - | No | "Online" or physical address |
| 19 | `platform` | string | 100 | No | - | No | e.g. "Zoom", "Google Meet", "In-person" |

### 2.6 Boolean Flags

| # | Key | Type | Size | Required | Default | Array | Notes |
|---|-----|------|------|----------|---------|-------|-------|
| 20 | `isPopular` | boolean | - | No | `false` | No | Admin-flagged popular event |
| 21 | `isFeatured` | boolean | - | No | `false` | No | Admin-flagged featured event |
| 22 | `certificateOffered` | boolean | - | No | `false` | No | Whether a certificate is issued |
| 23 | `isPaid` | boolean | - | No | `false` | No | Paid vs free event |

### 2.7 Pricing

| # | Key | Type | Size | Required | Default | Array | Notes |
|---|-----|------|------|----------|---------|-------|-------|
| 24 | `price` | string | 50 | No | - | No | e.g. "Free", "499 INR", "10 USD" |

### 2.8 Enhanced Data (Flattened from Nested Objects)

| # | Key | Type | Size | Required | Default | Array | Notes |
|---|-----|------|------|----------|---------|-------|-------|
| 25 | `prerequisites` | string | 500 | No | - | **Yes** | Array of prerequisite strings |
| 26 | `requirements` | string | 500 | No | - | **Yes** | Array of requirement strings |
| 27 | `agenda` | string | 500 | No | - | **Yes** | Array of agenda item strings |
| 28 | `benefits` | string | 500 | No | - | **Yes** | Array of benefit strings |
| 29 | `speakersJson` | string | 10000 | No | - | No | JSON string of `EventSpeaker[]` (see Design Notes) |
| 30 | `resourcesJson` | string | 10000 | No | - | No | JSON string of `EventResource[]` (see Design Notes) |
| 31 | `recordingUrl` | string | 500 | No | - | No | Recording link for completed events |

### 2.9 Submission / Tracking Fields

| # | Key | Type | Size | Required | Default | Array | Notes |
|---|-----|------|------|----------|---------|-------|-------|
| 32 | `submittedBy` | string | 255 | Yes | - | No | Appwrite user ID of the submitter |
| 33 | `submitterType` | enum | - | No | `student` | No | Values: `student`, `college_admin`, `platform_admin` |
| 34 | `approved` | boolean | - | No | `false` | No | Moderation flag; only approved events appear publicly |

**Total attributes: 34** (well within Appwrite's limit of ~800 per collection)

---

## 3. Indexes

| # | Key | Type | Attributes | Orders | Notes |
|---|-----|------|------------|--------|-------|
| 1 | `idx_eventDate` | key | `eventDate` | ASC | Sort events chronologically |
| 2 | `idx_status` | key | `status` | ASC | Filter by event status |
| 3 | `idx_status_eventDate` | key | `status`, `eventDate` | ASC, ASC | Compound: filter by status + sort by date (primary listing query) |
| 4 | `idx_category` | key | `category` | ASC | Filter by event category |
| 5 | `idx_category_eventDate` | key | `category`, `eventDate` | ASC, ASC | Compound: filter category + sort by date |
| 6 | `idx_submittedBy` | key | `submittedBy` | ASC | Look up events created by a specific user |
| 7 | `idx_approved_status_date` | key | `approved`, `status`, `eventDate` | ASC, ASC, ASC | Public listing: approved events filtered by status, sorted by date |
| 8 | `idx_isFeatured` | key | `isFeatured` | ASC | Quick lookup for featured events on homepage |
| 9 | `idx_title_fulltext` | fulltext | `title` | - | Full-text search on event title |

**Total indexes: 9** (well within Appwrite's limit of 64 per collection)

---

## 4. Permission Strategy

### Document-Level Permissions (Document Security = `true`)

When a new event is created, the following permissions are set on the document:

```typescript
// For student/college-admin submitted events:
[
  Permission.read(Role.users()),          // All authenticated users can read
  Permission.read(Role.user(userId)),     // Submitter can always read their own
  Permission.update(Role.user(userId)),   // Only submitter can update
  Permission.delete(Role.user(userId)),   // Only submitter can delete
]
```

### Permission Rationale

| Actor | Read | Update | Delete | How |
|-------|------|--------|--------|-----|
| **Any authenticated user** | Yes | No | No | `Permission.read(Role.users())` on every document |
| **Submitter (student or college admin)** | Yes | Yes | Yes | `Permission.read/update/delete(Role.user(userId))` |
| **Platform admin** | Yes | Yes | Yes | Via Appwrite server SDK with API key (bypasses document permissions) |
| **Guest (unauthenticated)** | No | No | No | No `Role.any()` permission set |

### Why This Model

- Matches the existing pattern in `saved-events.service.ts` (document-level permissions per user).
- `Role.users()` for read ensures all logged-in students can browse events without needing to know document owners.
- Admin operations (approving events, editing any event) run through server-side functions using the Appwrite server SDK, which bypasses document permissions entirely.
- If public (unauthenticated) event browsing is desired later, add `Permission.read(Role.any())` to documents or use a server function to proxy the listing.

---

## 5. Design Notes

### 5.1 Why `speakersJson` and `resourcesJson` are JSON Strings

Appwrite does not support nested object attributes or typed arrays of objects. The options were:

1. **Separate collections with relationships** - Higher complexity, requires additional queries per event load, relationship management overhead.
2. **JSON string attributes** - Simple, single-document read fetches everything. Parsing is trivial in TypeScript (`JSON.parse()`).

**Decision**: JSON strings. Speakers and resources are always loaded alongside the event and never queried independently. The 10,000-character limit accommodates ~15-20 speakers or resources per event, which is more than sufficient.

Serialization pattern:
```typescript
// Writing
speakersJson: JSON.stringify(speakers)

// Reading
const speakers: EventSpeaker[] = JSON.parse(doc.speakersJson || '[]')
```

### 5.2 `eventDate` (datetime) vs `date` (string)

The existing `Event` interface uses `date: string` (ISO format). The schema uses Appwrite's native `datetime` type for `eventDate` because:
- Enables date range queries with `Query.greaterThan()` / `Query.lessThan()`
- Proper chronological sorting via indexes
- The `time` field is kept as a separate display string (e.g. "6:00 PM IST") since Appwrite datetime is UTC and display time needs timezone context.

### 5.3 `posterFileId` Integration with Appwrite Storage

- A new storage bucket `event-posters` should be created in Appwrite.
- The `posterFileId` attribute stores the file ID returned by `storage.createFile()`.
- To generate the image URL: `storage.getFilePreview(bucketId, posterFileId)` or `storage.getFileView(bucketId, posterFileId)`.
- `thumbnailUrl` is kept separately for backward compatibility with existing components that expect a direct URL string.

### 5.4 `submitterType` Enum

Distinguishes between:
- `student` - Individual student submissions
- `college_admin` - College portal admin submissions (from COLLEGE_REGISTRATIONS flow)
- `platform_admin` - Platform-wide admin submissions

This enables filtering by submission source and applying different moderation rules.

### 5.5 `approved` Flag for Moderation

Student-submitted events default to `approved: false` and require admin review before appearing in public listings. Admin-submitted events can default to `approved: true` via server logic. The `idx_approved_status_date` 3-attribute compound index supports the primary public query without requiring a separate index scan for the sort:

```typescript
Query.equal('approved', true),
Query.equal('status', 'Upcoming'),
Query.orderAsc('eventDate')
```

### 5.6 Array Attributes

`streams`, `tags`, `prerequisites`, `requirements`, `agenda`, and `benefits` all use Appwrite's native string array support (`array: true`). This enables:
- `Query.contains('streams', ['CSE'])` for filtering events by target stream
- `Query.contains('tags', ['react'])` for tag-based filtering

No separate collections needed for these simple list values.

---

## 6. Storage Bucket Configuration

A new storage bucket is recommended:

| Property | Value |
|---|---|
| **Bucket ID** | `event-posters` |
| **Name** | Event Posters |
| **Maximum File Size** | 5 MB |
| **Allowed Extensions** | `jpg`, `jpeg`, `png`, `webp`, `gif` |
| **Enabled** | `true` |
| **File Security** | `true` |

Bucket permissions:
- `Permission.read(Role.users())` - Any authenticated user can view posters
- `Permission.create(Role.users())` - Any authenticated user can upload (for event submission)
- `Permission.update/delete` - Only via server SDK (admins)

---

## 7. Implementation Note

The Appwrite MCP server available in this project only exposes **user-management tools** (users_create, users_update, etc.). It does **not** provide database, collection, or attribute creation capabilities. Therefore, this schema must be provisioned through one of the following methods:

- **Setup script (recommended)** - Run `scripts/create-events-collection.js` with the Appwrite Server SDK. See usage instructions at the top of the script file. This creates the collection, all 34 attributes, and all 9 indexes idempotently (safe to re-run).
- **Appwrite Console** (web UI) - Manual creation at the Appwrite Cloud dashboard.
- **Appwrite CLI** - Via `appwrite databases createCollection` and related commands.

The schema document serves as the authoritative specification for whichever provisioning method is used.

---

## 8. TypeScript Interface (Appwrite Document)

For use in the codebase alongside the existing `Event` interface:

```typescript
// Appwrite document shape for the EVENTS collection
export interface EventDocument {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  title: string;
  description: string;
  category: 'Webinar' | 'Hackathon' | 'Workshop' | 'Conference';
  status: 'Live Now' | 'Upcoming' | 'Registration Open' | 'Registration Closed' | 'Completed';
  eventDate: string;           // ISO 8601 datetime
  time: string;
  duration?: string;
  organizer: string;
  organizerLogo?: string;
  organizerWebsite?: string;
  participantCount: number;
  maxParticipants?: number;
  registrationLink: string;
  posterFileId?: string;
  thumbnailUrl?: string;
  streams?: string[];
  tags?: string[];
  location?: string;
  platform?: string;
  isPopular: boolean;
  isFeatured: boolean;
  certificateOffered: boolean;
  isPaid: boolean;
  price?: string;
  prerequisites?: string[];
  requirements?: string[];
  agenda?: string[];
  benefits?: string[];
  speakersJson?: string;       // JSON string of EventSpeaker[]
  resourcesJson?: string;      // JSON string of EventResource[]
  recordingUrl?: string;
  submittedBy: string;
  submitterType: 'student' | 'college_admin' | 'platform_admin';
  approved: boolean;
}
```
