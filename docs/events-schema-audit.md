# Events Collection Schema - Feasibility Audit Report

> **Auditor**: Feasibility Auditor (schema-auditor)
> **Date**: 2026-02-23
> **Schema Version**: Draft v1 by Database Architect
> **Platform**: Appwrite Cloud v21.2

---

## 1. APPROVED Items

### 1.1 Attribute Types (All Valid)
- **string** attributes (#1, #2, #6-10, #13-15, #18-19, #24, #29-32): Valid Appwrite type. Sizes are all reasonable (50-10000 bytes, well within 1GB max).
- **enum** attributes (#3 `category`, #4 `status`, #33 `submitterType`): Valid Appwrite type. All have fewer than 100 values.
- **datetime** attribute (#5 `eventDate`): Valid Appwrite type. Stores ISO 8601 strings natively. Enables range queries.
- **integer** attributes (#11 `participantCount`, #12 `maxParticipants`): Valid Appwrite type.
- **boolean** attributes (#20-23, #34): Valid Appwrite type. Default values of `false` are supported.
- **string array** attributes (#16-17, #25-28): Valid. Appwrite supports `string[]` as a native attribute type with `array: true`.

**Verdict**: All 34 attribute types are valid Appwrite Cloud attribute types.

### 1.2 Attribute Count
- 34 attributes is well within the practical limit (~200) and far below the hard limit (1600).

### 1.3 Default Values
- `status` default `Upcoming`: Supported for enum attributes.
- `participantCount` default `0`: Supported for integer attributes.
- `isPopular`, `isFeatured`, `certificateOffered`, `isPaid`, `approved` default `false`: Supported for boolean attributes.
- `submitterType` default `student`: Supported for enum attributes.

**Verdict**: All defaults are valid.

### 1.4 Indexes (9 total)
- 9 indexes is well within the 25-index limit (note: the schema doc says 64, but the actual Appwrite Cloud limit is 25 -- still fine at 9).
- All index types used (`key`, `fulltext`) are valid Appwrite index types.
- Compound indexes (`idx_status_eventDate`, `idx_category_eventDate`, `idx_approved_status`) each have 2 attributes, well within limits.
- `idx_title_fulltext` uses `fulltext` type on a string attribute -- valid.

### 1.5 Permission Model
- Document Security = `true` with document-level permissions is the correct approach.
- `Permission.read(Role.users())` for all authenticated users to read -- valid.
- `Permission.read/update/delete(Role.user(userId))` for submitter -- valid.
- Admin bypass via server SDK with API key -- correct pattern, no document-level permission needed.
- Matches the existing `saved-events.service.ts` pattern (lines 108-112).

### 1.6 TypeScript Interface
- The `EventDocument` interface correctly maps all 34 attributes with proper types.
- Optional fields match non-required attributes.
- Includes `$id`, `$createdAt`, `$updatedAt` Appwrite system fields.

### 1.7 Storage Bucket Design
- `event-posters` bucket with 5MB limit and image-only extensions is sensible.
- `posterFileId` referencing files by ID with `storage.getFilePreview()` is the standard Appwrite pattern.

### 1.8 JSON Stringification Decision (speakersJson/resourcesJson)
- The decision to use JSON strings instead of separate collections is pragmatically correct for Appwrite, which does not support nested object attributes.
- 10,000 characters is sufficient for typical event speaker/resource data.
- Data is always loaded with the parent event, never queried independently -- good justification.

### 1.9 Student + College Double User Flow
- `submittedBy` (user ID) + `submitterType` enum (`student`/`college_admin`/`platform_admin`) cleanly supports both user types.
- Both can create documents with the same permission pattern.
- `approved` flag allows differential moderation (students need approval, admins may auto-approve via server logic).

---

## 2. ISSUES FOUND

### ISSUE-1: Redundant `Permission.read(Role.user(userId))` [Severity: Info]

**Location**: Section 4 - Permission Strategy

The schema sets both:
- `Permission.read(Role.users())` -- all authenticated users can read
- `Permission.read(Role.user(userId))` -- submitter can read

The second permission is redundant because the submitter is already an authenticated user covered by `Role.users()`. This is not harmful, just unnecessary.

### ISSUE-2: `status` Enum Contains Spaces [Severity: Warning]

**Location**: Attribute #4

Values: `Live Now`, `Registration Open`, `Registration Closed`

Appwrite enum values with spaces are technically supported, but they can cause issues:
- URL encoding problems if ever used in query parameters
- Inconsistency with `submitterType` enum which uses snake_case

However, these values match the existing `EventStatus` type in `src/types/event.ts:5`, so changing them would break existing code. **Recommendation**: Keep as-is for backward compatibility, but document the inconsistency.

### ISSUE-3: Index Limit Documentation Error [Severity: Info]

**Location**: Section 3, below the index table

The schema states "Appwrite's limit of 64 per collection". The actual Appwrite Cloud limit is **25 indexes per collection**. The 9 proposed indexes are still well within this limit, so no functional issue, but the documentation should be corrected.

### ISSUE-4: No `idx_approved_eventDate` Compound Index for Primary Listing Query [Severity: Warning]

**Location**: Section 3 / Section 5.5

The design notes (Section 5.5) describe the primary public query as:
```typescript
Query.equal('approved', true),
Query.equal('status', 'Upcoming'),
Query.orderAsc('eventDate')
```

The existing `idx_approved_status` index covers `approved` + `status`, but the `orderAsc('eventDate')` sort would not be served by this index. For optimal query performance, a 3-attribute compound index `[approved, status, eventDate]` would be ideal. However, Appwrite compound indexes support a maximum of **3 attributes**, so this is feasible.

**Recommendation**: Replace `idx_approved_status` with `idx_approved_status_date` using attributes `[approved, status, eventDate]` to fully cover the primary listing query.

### ISSUE-5: `streams` Array Individual Element Size [Severity: Info]

**Location**: Attribute #16

The `streams` attribute is defined as `string[]` with size `50`. In Appwrite, for array string attributes, the `size` parameter refers to the maximum length of **each element** in the array. The values listed (e.g., "Web Development", "Mobile Development") are all under 50 chars, so this is fine. Just confirming the architect understood this correctly.

### ISSUE-6: MCP Server Limitation [Severity: Critical]

**Location**: Cross-cutting concern

The available Appwrite MCP server tools (`mcp__appwrite__users_*`) only expose **User management** operations. There are **no MCP tools** for:
- Creating databases or collections
- Creating attributes (string, enum, boolean, integer, datetime, array)
- Creating indexes
- Setting collection-level or document-level permissions
- Creating storage buckets

**This means the schema cannot be created directly via the MCP server.** Collection and attribute creation must be done via:
1. The Appwrite Console (web UI), OR
2. The Appwrite Server SDK (Node.js script), OR
3. The Appwrite CLI (`appwrite databases createStringAttribute ...`, etc.)

This does NOT block the schema design itself, but the team should be aware that "MCP-executable" creation is not possible with the current MCP toolset.

### ISSUE-7: `price` as String Instead of Float [Severity: Info]

**Location**: Attribute #24

Storing price as a string (e.g., "Free", "499 INR") prevents numeric comparisons or sorting by price. This is acceptable if price filtering/sorting is not a requirement. The mixed format (free-text with currency) makes a numeric type impractical anyway.

### ISSUE-8: No `endDate` / `eventEndDate` Attribute [Severity: Info]

**Location**: Attribute list

Multi-day events (e.g., "3 days" duration) have no explicit end date. The `duration` field is a display string, not machine-parseable. If date-range queries like "events happening this week" need to account for multi-day events, an `eventEndDate` datetime attribute would be needed. This is not critical for the initial schema but worth noting for future iterations.

---

## 3. RECOMMENDED CHANGES

### Change 1: Fix Index Documentation (Info)
**Line**: Section 3, after index table
**Current**: "Appwrite's limit of 64 per collection"
**Change to**: "Appwrite's limit of 25 per collection"

### Change 2: Add Compound Index for Primary Query (Warning)
**Current**: `idx_approved_status` with attributes `[approved, status]`
**Replace with**: `idx_approved_status_date` with attributes `[approved, status, eventDate]` and orders `[ASC, ASC, ASC]`

This fully covers the primary public listing query pattern described in Section 5.5 and eliminates the need for a separate sort step.

### Change 3: Remove Redundant Permission (Info - Optional)
**Current**:
```typescript
Permission.read(Role.users()),
Permission.read(Role.user(userId)),
```
**Change to**:
```typescript
Permission.read(Role.users()),
```
The `Role.user(userId)` read permission is already covered by `Role.users()`. Removing it simplifies the permission array. However, keeping it is harmless and provides explicit documentation of intent, so this is optional.

### Change 4: Acknowledge MCP Limitation in Schema Doc (Critical)
Add a note to the schema document stating that the Appwrite MCP server does not support database/collection/attribute creation. Specify the recommended creation method (Appwrite Console, Server SDK, or CLI).

---

## 4. FINAL VERDICT

### **Needs Minor Revision** -- Schema is Sound, MCP Creation Not Possible

**Summary**: The schema design is well-structured, all 34 attribute types are valid for Appwrite Cloud v21.2, the permission model is correctly designed, and the 9 indexes are within limits. The JSON stringification approach for speakers/resources is the right tradeoff for Appwrite's constraints.

**Two actionable items before finalization**:
1. **Replace `idx_approved_status` with a 3-attribute compound index** `[approved, status, eventDate]` to properly serve the primary listing query.
2. **Acknowledge that the MCP server cannot create collections/attributes** -- the available MCP tools are user-management only. Schema creation must be done via Appwrite Console, Server SDK, or CLI.

**After these two changes, the schema is production-ready for Appwrite Cloud v21.2.**

All attribute types, default values, array definitions, enum constraints, index configurations, and the permission model have been validated against Appwrite Cloud capabilities. The student + college admin double user flow is properly supported through the `submitterType` enum and document-level permissions.
