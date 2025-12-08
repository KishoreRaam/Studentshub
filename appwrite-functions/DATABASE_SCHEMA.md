# Appwrite Database Schema for StudentPerks

## Database: `studentperks_db`

### Collection: `users_meta`

**Collection ID**: `users_meta`
**Purpose**: Store additional user metadata and role information

#### Attributes:

| Attribute | Type | Size | Required | Default | Array | Description |
|-----------|------|------|----------|---------|-------|-------------|
| role | string | 50 | Yes | guest | No | User role (guest, student, admin) |
| verified | boolean | - | Yes | false | No | Email verification status |
| email | email | 320 | Yes | - | No | User email address |
| signupSource | string | 50 | No | email | No | Signup method (email, google, oauth) |
| createdAt | datetime | - | Yes | - | No | Account creation timestamp |
| verifiedAt | datetime | - | No | - | No | Email verification timestamp |
| lastVerificationResend | datetime | - | No | - | No | Last resend timestamp |
| resendCountWindow | integer | - | Yes | 0 | No | Resend count in current window |
| notes | string | 1000 | No | - | No | Admin notes |
| emailDeliverability | string | 50 | No | ok | No | Email status (ok, bounced, suppressed) |
| emailOptOut | boolean | - | Yes | false | No | User opted out of emails |

#### Indexes:

1. **email_index**: 
   - Type: Key
   - Attributes: email (ASC)
   - Orders: ASC

2. **role_index**:
   - Type: Key
   - Attributes: role (ASC)
   - Orders: ASC

3. **verified_index**:
   - Type: Key
   - Attributes: verified (ASC)
   - Orders: ASC

#### Permissions:

```json
{
  "read": [
    "user:{userId}"
  ],
  "create": [],
  "update": [],
  "delete": []
}
```

**Note**: Only server-side functions can write. Users can read their own document.

---

### Collection: `audit_logs`

**Collection ID**: `audit_logs`
**Purpose**: Track all authentication and role-related events

#### Attributes:

| Attribute | Type | Size | Required | Default | Array | Description |
|-----------|------|------|----------|---------|-------|-------------|
| userId | string | 100 | Yes | - | No | User ID reference |
| email | email | 320 | No | - | No | User email |
| event | string | 100 | Yes | - | No | Event type |
| role | string | 50 | No | - | No | Role (if applicable) |
| domain | string | 255 | No | - | No | Email domain |
| timestamp | integer | - | Yes | - | No | Unix timestamp |
| createdAt | datetime | - | Yes | - | No | ISO datetime |
| metadata | string | 5000 | No | - | No | JSON metadata |
| needsReview | boolean | - | Yes | false | No | Requires manual review |

#### Indexes:

1. **userId_index**:
   - Type: Key
   - Attributes: userId (ASC)
   - Orders: ASC

2. **event_index**:
   - Type: Key
   - Attributes: event (ASC)
   - Orders: ASC

3. **timestamp_index**:
   - Type: Key
   - Attributes: timestamp (DESC)
   - Orders: DESC

#### Permissions:

```json
{
  "read": [],
  "create": [],
  "update": [],
  "delete": []
}
```

**Note**: Only server-side functions can access this collection.

---

### Collection: `email_logs`

**Collection ID**: `email_logs`
**Purpose**: Log all email send attempts for debugging and monitoring

#### Attributes:

| Attribute | Type | Size | Required | Default | Array | Description |
|-----------|------|------|----------|---------|-------|-------------|
| userId | string | 100 | Yes | - | No | User ID reference |
| email | email | 320 | Yes | - | No | Recipient email |
| type | string | 50 | Yes | - | No | Email type (verification, recovery, etc) |
| provider | string | 50 | Yes | - | No | Email provider (sendgrid, appwrite) |
| templateId | string | 100 | No | - | No | Template ID used |
| status | string | 50 | Yes | - | No | Status (sent, failed, bounced) |
| sentAt | datetime | - | Yes | - | No | Send timestamp |
| error | string | 1000 | No | - | No | Error message if failed |
| metadata | string | 5000 | No | - | No | JSON metadata |

#### Indexes:

1. **userId_index**:
   - Type: Key
   - Attributes: userId (ASC)
   - Orders: ASC

2. **email_index**:
   - Type: Key
   - Attributes: email (ASC)
   - Orders: ASC

3. **status_index**:
   - Type: Key
   - Attributes: status (ASC)
   - Orders: ASC

4. **sentAt_index**:
   - Type: Key
   - Attributes: sentAt (DESC)
   - Orders: DESC

#### Permissions:

```json
{
  "read": [],
  "create": [],
  "update": [],
  "delete": []
}
```

**Note**: Only server-side functions can access this collection.

---

## Setup Instructions

### 1. Create Database

```bash
# Using Appwrite CLI
appwrite databases create \
  --databaseId studentperks_db \
  --name "StudentPerks Database"
```

### 2. Create Collections

```bash
# Users Meta Collection
appwrite databases createCollection \
  --databaseId studentperks_db \
  --collectionId users_meta \
  --name "Users Metadata" \
  --permissions "read(\"user:{userId}\")"

# Audit Logs Collection
appwrite databases createCollection \
  --databaseId studentperks_db \
  --collectionId audit_logs \
  --name "Audit Logs"

# Email Logs Collection
appwrite databases createCollection \
  --databaseId studentperks_db \
  --collectionId email_logs \
  --name "Email Logs"
```

### 3. Create Attributes

See detailed attribute creation commands in the `setup-collections.sh` script.

### 4. Environment Variables

Set these in your Appwrite Function settings:

```env
# Appwrite
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT=your_project_id
APPWRITE_API_KEY=your_admin_api_key

# Database
DB_ID=studentperks_db
USERS_META_COLLECTION=users_meta
AUDIT_LOG_COLLECTION=audit_logs
EMAIL_LOG_COLLECTION=email_logs

# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_TEMPLATE_ID=d-xxxxxxxxxxxxx
SENDER_EMAIL=no-reply@studentperks.me

# Configuration
ALLOWED_DOMAINS=sathyabama.ac.in,student.edu,ac.in
RATE_LIMIT_RESEND=3
FRONTEND_URL=https://studentperks.me
LOG_LEVEL=info
```

### 5. Security Rules

- All collections should have strict permissions
- Only server-side functions (with API key) can write
- Users can only read their own `users_meta` document
- Admin endpoints require additional authentication
