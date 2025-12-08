# StudentPerks Authentication Backend - Complete Setup Guide

## Overview

This is a comprehensive authentication and verification system for StudentPerks built with Appwrite Functions and SendGrid. The system handles:

- ✅ College email-only signup with domain validation
- ✅ Email verification with custom SendGrid templates
- ✅ Automatic role assignment for verified students
- ✅ Rate-limited resend verification
- ✅ Password reset flow
- ✅ Admin management endpoints
- ✅ SendGrid webhook handling
- ✅ Comprehensive audit logging

## Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Frontend  │────────▶│   Appwrite   │────────▶│  Functions  │
│   (React)   │         │  (Auth/DB)   │         │  (Node.js)  │
└─────────────┘         └──────────────┘         └─────────────┘
                               │                         │
                               │                         │
                               ▼                         ▼
                        ┌──────────────┐         ┌─────────────┐
                        │  SendGrid    │         │  Database   │
                        │  (Emails)    │         │  (3 tables) │
                        └──────────────┘         └─────────────┘
```

## Directory Structure

```
appwrite-functions/
├── shared/
│   └── utils.js                    # Shared utilities
├── onUserUpdated/                  # Event-triggered function
│   ├── index.js
│   └── package.json
├── resendVerification/             # HTTP endpoint
│   ├── index.js
│   └── package.json
├── sendVerificationCustom/         # HTTP endpoint (SendGrid)
│   ├── index.js
│   └── package.json
├── adminEndpoints/                 # Admin management
│   ├── index.js
│   └── package.json
├── sendgridWebhook/               # Webhook handler
│   ├── index.js
│   └── package.json
├── DATABASE_SCHEMA.md             # Database design
├── DEPLOYMENT.md                  # This file
└── README.md                      # Complete documentation
```

## Prerequisites

1. **Appwrite Cloud Account** or self-hosted instance
2. **SendGrid Account** with API key
3. **Node.js 18+** for local development
4. **Appwrite CLI** installed

```bash
npm install -g appwrite-cli
```

## Step 1: Create Appwrite Project

1. Go to https://cloud.appwrite.io
2. Create new project: "StudentPerks"
3. Note your Project ID

## Step 2: Setup Database

Follow instructions in `DATABASE_SCHEMA.md` to create:
- Database: `studentperks_db`
- Collections: `users_meta`, `audit_logs`, `email_logs`

### Quick Setup Script

```bash
# Login to Appwrite
appwrite login

# Create database
appwrite databases create \
  --databaseId studentperks_db \
  --name "StudentPerks Database"

# Create collections (see DATABASE_SCHEMA.md for details)
```

## Step 3: Configure SendGrid

1. Create SendGrid account at https://sendgrid.com
2. Generate API key with "Mail Send" permissions
3. Create dynamic email template:
   - Template name: "Email Verification"
   - Add handlebars variables: `{{user_name}}`, `{{verification_link}}`
   - Note the Template ID (starts with `d-`)

4. Setup webhook (optional but recommended):
   - Go to Settings > Mail Settings > Event Webhook
   - URL: `https://your-appwrite-domain/v1/functions/sendgridWebhook/executions`
   - Select events: Bounce, Dropped, Spam Report, Unsubscribe, Delivered

## Step 4: Deploy Appwrite Functions

### Function 1: onUserUpdated (Event Trigger)

```bash
appwrite functions create \
  --functionId onUserUpdated \
  --name "On User Updated" \
  --runtime node-18.0 \
  --events "users.*.update" \
  --execute role:all

# Set environment variables
appwrite functions updateVariables \
  --functionId onUserUpdated \
  --key APPWRITE_ENDPOINT --value "https://cloud.appwrite.io/v1" \
  --key APPWRITE_PROJECT --value "YOUR_PROJECT_ID" \
  --key APPWRITE_API_KEY --value "YOUR_ADMIN_API_KEY" \
  --key ALLOWED_DOMAINS --value "sathyabama.ac.in,student.edu" \
  --key DB_ID --value "studentperks_db" \
  --key USERS_META_COLLECTION --value "users_meta" \
  --key AUDIT_LOG_COLLECTION --value "audit_logs"

# Deploy code
cd appwrite-functions/onUserUpdated
appwrite functions createDeployment \
  --functionId onUserUpdated \
  --activate true \
  --code .
```

### Function 2: resendVerification (HTTP)

```bash
appwrite functions create \
  --functionId resendVerification \
  --name "Resend Verification" \
  --runtime node-18.0 \
  --execute role:all \
  --method POST

# Set environment variables (similar to above plus:)
appwrite functions updateVariables \
  --functionId resendVerification \
  --key RATE_LIMIT_RESEND --value "3" \
  --key FRONTEND_URL --value "https://studentperks.me"

# Deploy
cd appwrite-functions/resendVerification
appwrite functions createDeployment \
  --functionId resendVerification \
  --activate true \
  --code .
```

### Function 3: sendVerificationCustom (HTTP)

```bash
appwrite functions create \
  --functionId sendVerificationCustom \
  --name "Send Verification Custom" \
  --runtime node-18.0 \
  --execute role:all \
  --method POST

# Set environment variables (add SendGrid):
appwrite functions updateVariables \
  --functionId sendVerificationCustom \
  --key SENDGRID_API_KEY --value "YOUR_SENDGRID_KEY" \
  --key SENDGRID_TEMPLATE_ID --value "d-xxxxx" \
  --key SENDER_EMAIL --value "no-reply@studentperks.me"

# Deploy
cd appwrite-functions/sendVerificationCustom
appwrite functions createDeployment \
  --functionId sendVerificationCustom \
  --activate true \
  --code .
```

### Function 4: adminEndpoints (HTTP)

```bash
appwrite functions create \
  --functionId adminEndpoints \
  --name "Admin Endpoints" \
  --runtime node-18.0 \
  --execute role:all \
  --method GET,POST

# Set environment variables (add admin key):
appwrite functions updateVariables \
  --functionId adminEndpoints \
  --key ADMIN_API_KEY --value "your-secure-admin-key-here"

# Deploy
cd appwrite-functions/adminEndpoints
appwrite functions createDeployment \
  --functionId adminEndpoints \
  --activate true \
  --code .
```

### Function 5: sendgridWebhook (HTTP)

```bash
appwrite functions create \
  --functionId sendgridWebhook \
  --name "SendGrid Webhook" \
  --runtime node-18.0 \
  --execute role:all \
  --method POST

# Set environment variables:
appwrite functions updateVariables \
  --functionId sendgridWebhook \
  --key SENDGRID_WEBHOOK_SECRET --value "your-webhook-secret"

# Deploy
cd appwrite-functions/sendgridWebhook
appwrite functions createDeployment \
  --functionId sendgridWebhook \
  --activate true \
  --code .
```

## Step 5: Frontend Integration

### Install Appwrite SDK

```bash
npm install appwrite
```

### Initialize Appwrite Client

```typescript
// src/lib/appwrite.ts
import { Client, Account, Databases } from 'appwrite';

export const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

export const account = new Account(client);
export const databases = new Databases(client);
```

### Signup Flow

```typescript
// src/services/auth.service.ts
import { account } from '../lib/appwrite';

export async function signupWithEmail(email: string, password: string, name: string) {
  try {
    // Create account
    const user = await account.create('unique()', email, password, name);
    
    // Send verification email
    const redirectUrl = `${window.location.origin}/verify-email`;
    await account.createVerification(redirectUrl);
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error };
  }
}
```

### Resend Verification

```typescript
export async function resendVerification(sessionToken: string) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APPWRITE_ENDPOINT}/functions/resendVerification/executions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-JWT': sessionToken
        }
      }
    );
    
    return await response.json();
  } catch (error) {
    return { success: false, error };
  }
}
```

### Check User Role

```typescript
import { databases } from '../lib/appwrite';

export async function getUserRole(userId: string) {
  try {
    const userMeta = await databases.getDocument(
      'studentperks_db',
      'users_meta',
      userId
    );
    
    return userMeta.role;
  } catch (error) {
    return 'guest';
  }
}
```

## Step 6: Environment Variables

### Backend (.env for Appwrite Functions)

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
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_TEMPLATE_ID=d-xxxxx
SENDER_EMAIL=no-reply@studentperks.me
SENDGRID_WEBHOOK_SECRET=your_webhook_secret

# Configuration
ALLOWED_DOMAINS=sathyabama.ac.in,student.edu,ac.in
RATE_LIMIT_RESEND=3
FRONTEND_URL=https://studentperks.me

# Admin
ADMIN_API_KEY=secure_admin_key_here

# Logging
LOG_LEVEL=info
```

### Frontend (.env)

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT=your_project_id
VITE_FRONTEND_URL=https://studentperks.me
```

## Step 7: Testing

### Test Signup Flow

1. Go to `/signup`
2. Enter college email (e.g., `student@sathyabama.ac.in`)
3. Check email for verification link
4. Click verification link
5. Should be redirected to success page
6. Check user role in database (should be "student")

### Test Rate Limiting

1. Try resending verification email 4 times within an hour
2. 4th attempt should return rate limit error

### Test Admin Endpoints

```bash
# Get user details
curl -X GET \
  https://your-appwrite-domain/v1/functions/adminEndpoints/executions \
  -H "X-Admin-API-Key: your_admin_key" \
  -d '{"path": "/admin/users/USER_ID"}'

# Update user role
curl -X POST \
  https://your-appwrite-domain/v1/functions/adminEndpoints/executions \
  -H "X-Admin-API-Key: your_admin_key" \
  -d '{"path": "/admin/users/USER_ID/role", "role": "admin"}'
```

## Security Checklist

- [ ] Admin API key is strong and secure
- [ ] Appwrite API keys are not exposed to frontend
- [ ] HTTPS is enforced for all endpoints
- [ ] SendGrid webhook signature verification is enabled
- [ ] Rate limiting is configured appropriately
- [ ] Allowed domains list is updated
- [ ] Database permissions are restrictive
- [ ] Audit logging is enabled

## Monitoring

1. **Appwrite Console**: Monitor function executions and errors
2. **SendGrid Dashboard**: Track email delivery rates
3. **Database**: Query `audit_logs` and `email_logs` regularly
4. **Admin Endpoint**: Use `/admin/stats` for system overview

## Troubleshooting

### Verification emails not sending
- Check SendGrid API key
- Verify template ID is correct
- Check email logs collection for errors

### Role not assigned after verification
- Check `ALLOWED_DOMAINS` environment variable
- Review `audit_logs` for domain validation failures
- Ensure `onUserUpdated` function is active

### Rate limit issues
- Adjust `RATE_LIMIT_RESEND` value
- Check `lastVerificationResend` timestamp in user_meta

## Support

For issues or questions:
- Check logs in Appwrite Console
- Review audit_logs and email_logs collections
- Contact support at support@studentperks.me
