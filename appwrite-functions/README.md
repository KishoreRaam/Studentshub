# StudentPerks Authentication Backend

Complete authentication and verification system built with Appwrite Functions and SendGrid for StudentPerks platform.

## Features

✅ **College Email Verification** - Only allow students with verified college emails  
✅ **Automatic Role Assignment** - Auto-assign "student" role to verified users from allowed domains  
✅ **Rate-Limited Resends** - Prevent abuse with configurable rate limiting (3/hour default)  
✅ **Custom Email Templates** - Beautiful verification emails via SendGrid  
✅ **Password Reset Flow** - Secure password recovery  
✅ **Admin Management** - Endpoints for user management and monitoring  
✅ **Webhook Integration** - Handle email bounces and suppressions  
✅ **Comprehensive Audit Logs** - Track all authentication events  
✅ **Production Ready** - Retry logic, error handling, and logging  

## Quick Start

### 1. Clone and Install

```bash
cd appwrite-functions
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your credentials:

```env
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT=your_project_id
APPWRITE_API_KEY=your_api_key
SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_TEMPLATE_ID=d-xxxxx
ALLOWED_DOMAINS=sathyabama.ac.in,student.edu
```

### 3. Setup Database

```bash
# Follow DATABASE_SCHEMA.md for complete schema
appwrite databases create --databaseId studentperks_db --name "StudentPerks Database"
```

### 4. Deploy Functions

```bash
# Deploy all functions
./deploy-all.sh

# Or deploy individually
cd onUserUpdated && appwrite functions createDeployment --functionId onUserUpdated --code .
```

### 5. Test

```bash
npm test
```

## Architecture

### Functions

| Function | Type | Purpose | Trigger |
|----------|------|---------|---------|
| `onUserUpdated` | Event | Assign role on verification | `users.*.update` |
| `resendVerification` | HTTP | Resend verification email | POST |
| `sendVerificationCustom` | HTTP | Send custom SendGrid email | POST |
| `adminEndpoints` | HTTP | Admin management | GET/POST |
| `sendgridWebhook` | HTTP | Handle email events | POST |

### Database Collections

| Collection | Purpose | Documents |
|------------|---------|-----------|
| `users_meta` | User metadata and roles | ~10K |
| `audit_logs` | Authentication events | ~100K |
| `email_logs` | Email delivery tracking | ~50K |

## User Flow

```
1. User signs up with college email
   └── POST /account/create

2. Verification email sent
   └── account.createVerification()
   
3. User clicks verification link
   └── GET /verify-email?userId=xxx&secret=xxx
   
4. Appwrite marks emailVerification = true
   └── Event: users.*.update
   
5. onUserUpdated function triggered
   ├── Validate domain
   ├── Assign role: "student"
   └── Create audit log
   
6. User can access protected content
   └── Check role === "student"
```

## API Reference

### Resend Verification

```http
POST /functions/resendVerification/executions
X-Appwrite-JWT: <session_token>

Response:
{
  "ok": true,
  "remaining": 2,
  "message": "Verification email sent"
}
```

### Admin: Get User

```http
GET /functions/adminEndpoints/executions
X-Admin-API-Key: <admin_key>
Content-Type: application/json

{
  "path": "/admin/users/USER_ID"
}

Response:
{
  "ok": true,
  "user": {
    "id": "USER_ID",
    "email": "student@college.edu",
    "role": "student",
    "verified": true
  }
}
```

### Admin: Update Role

```http
POST /functions/adminEndpoints/executions
X-Admin-API-Key: <admin_key>
Content-Type: application/json

{
  "path": "/admin/users/USER_ID/role",
  "role": "admin"
}
```

### Admin: Get Stats

```http
GET /functions/adminEndpoints/executions
X-Admin-API-Key: <admin_key>

{
  "path": "/admin/stats"
}

Response:
{
  "ok": true,
  "stats": {
    "totalUsers": 1250,
    "byRole": {
      "student": 1100,
      "guest": 150
    },
    "verified": 1100,
    "unverified": 150
  }
}
```

## Configuration

### Allowed Domains

Add allowed college domains to `ALLOWED_DOMAINS` env variable:

```env
ALLOWED_DOMAINS=sathyabama.ac.in,mit.edu,stanford.edu,ac.in
```

Domain validation happens in `onUserUpdated` function.

### Rate Limiting

Configure resend rate limit:

```env
RATE_LIMIT_RESEND=3  # 3 resends per hour
```

### Email Templates

Create SendGrid dynamic template with these variables:

- `{{user_name}}` - User's name
- `{{verification_link}}` - Verification URL
- `{{project_name}}` - "StudentPerks"
- `{{support_email}}` - Support email

## Security

### Best Practices

✅ **API Keys**: Never expose admin keys to frontend  
✅ **Session Validation**: All protected endpoints validate JWT  
✅ **Domain Validation**: Server-side domain checks  
✅ **Rate Limiting**: Prevent abuse  
✅ **Webhook Verification**: Verify SendGrid signatures  
✅ **HTTPS Only**: Enforce secure connections  
✅ **Audit Logging**: Track all sensitive operations  

### Permissions

```javascript
// users_meta collection
{
  "read": ["user:{userId}"],  // Users can read their own
  "create": [],                // Only functions can create
  "update": [],                // Only functions can update
  "delete": []                 // Nobody can delete
}
```

## Monitoring

### Key Metrics

Monitor these in Appwrite Console:

- Function execution count
- Function error rate
- Average execution time
- Database document count

### Audit Logs

Query audit logs for insights:

```javascript
// Get recent role assignments
databases.listDocuments('studentperks_db', 'audit_logs', [
  Query.equal('event', 'role_assigned'),
  Query.limit(100),
  Query.orderDesc('timestamp')
]);

// Get failed verifications
databases.listDocuments('studentperks_db', 'audit_logs', [
  Query.equal('event', 'verified_non_allowed_domain'),
  Query.equal('needsReview', true)
]);
```

### Email Logs

Track email delivery:

```javascript
// Get recent bounces
databases.listDocuments('studentperks_db', 'email_logs', [
  Query.equal('status', 'bounced'),
  Query.limit(50)
]);
```

## Troubleshooting

### Issue: Verification email not received

1. Check SendGrid API key is valid
2. Verify sender email is authenticated in SendGrid
3. Check `email_logs` collection for errors
4. Test SendGrid connectivity

### Issue: Role not assigned after verification

1. Verify domain is in `ALLOWED_DOMAINS`
2. Check `audit_logs` for the event
3. Ensure `onUserUpdated` function is active
4. Review function logs in Appwrite Console

### Issue: Rate limit errors

1. Check `lastVerificationResend` in `users_meta`
2. Adjust `RATE_LIMIT_RESEND` if needed
3. Clear rate limit: update `resendCountWindow` to 0

### Issue: Webhook not receiving events

1. Verify webhook URL in SendGrid settings
2. Check function is deployed and active
3. Test with SendGrid webhook tester
4. Review `sendgridWebhook` function logs

## Development

### Local Testing

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run specific test
npm test -- tests/utils.test.js

# Watch mode
npm test -- --watch
```

### Debug Mode

Enable debug logging:

```env
LOG_LEVEL=debug
```

### Manual Testing

Use the included Postman collection:

```bash
# Import postman/studentperks-auth.json to Postman
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

### Quick Deploy

```bash
# Deploy all functions
./deploy-all.sh

# Or use CI/CD
# See .github/workflows/deploy.yml
```

## Support

- **Documentation**: See `DATABASE_SCHEMA.md` and `DEPLOYMENT.md`
- **Issues**: Open GitHub issue
- **Email**: support@studentperks.me

## License

MIT License - see LICENSE file

## Contributors

Built with ❤️ for StudentPerks

---

**Last Updated**: December 2025  
**Version**: 1.0.0
