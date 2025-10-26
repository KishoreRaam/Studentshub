# Appwrite Integration Setup Guide

## Overview

StudentHub now uses Appwrite as its backend service for authentication, user management, and data storage. This guide will help you get started with the Appwrite integration.

## Current Implementation Status

### ✅ Completed Features

1. **Authentication System**
   - Google OAuth integration
   - Session management
   - Protected routes
   - Login/Signup pages with Appwrite integration
   - Logout functionality

2. **User Interface**
   - Dynamic auth buttons (show login/signup or profile/logout based on auth state)
   - Loading states during authentication
   - Automatic redirects for authenticated users

3. **Security**
   - Protected routes for Dashboard and Profile pages
   - Environment variable configuration for sensitive data
   - Proper error handling

## Architecture

### File Structure

```
src/
├── lib/
│   └── appwrite.ts              # Appwrite client configuration
├── contexts/
│   └── AuthContext.tsx          # Authentication state management
├── components/
│   ├── ProtectedRoute.tsx       # Route protection wrapper
│   └── AuthButtons.tsx          # Dynamic auth UI component
└── pages/
    ├── Login/
    │   └── index.tsx            # Login page with OAuth
    └── SignUp.tsx               # Signup page with OAuth
```

### Authentication Flow

1. **Login/Signup**:
   - User clicks "Continue with Google"
   - Redirects to Google OAuth
   - Google authenticates and redirects back
   - Appwrite creates session
   - User redirected to `/dashboard`

2. **Session Management**:
   - AuthContext checks for existing session on app load
   - User object stored in context
   - All components can access auth state via `useAuth()` hook

3. **Protected Routes**:
   - ProtectedRoute component wraps sensitive pages
   - Checks if user is authenticated
   - Redirects to `/login` if not authenticated
   - Shows loading state during auth check

## Environment Variables

Required environment variables (add to `.env` file):

```env
# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=68d29c8100366fc856a6

# Database Configuration (Get these from Appwrite Console)
VITE_APPWRITE_DATABASE_ID=your_database_id_here
VITE_APPWRITE_COLLECTION_USERS=your_users_collection_id_here
VITE_APPWRITE_COLLECTION_PERKS=your_perks_collection_id_here
VITE_APPWRITE_COLLECTION_SAVED_PERKS=your_saved_perks_collection_id_here
```

## Usage Examples

### Using the Auth Hook

```tsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return (
      <div>
        <p>Welcome, {user.name}!</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return <div>Please log in</div>;
}
```

### Protecting a Route

```tsx
import { ProtectedRoute } from '../components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
```

### Accessing Appwrite Services

```tsx
import { account, databases, storage } from '../lib/appwrite';

// Get current user
const user = await account.get();

// Query database
const response = await databases.listDocuments(
  DATABASE_ID,
  COLLECTIONS.PERKS
);

// Upload file
const file = await storage.createFile(
  BUCKET_ID,
  ID.unique(),
  fileToUpload
);
```

## Next Steps for Full Integration

### 1. User Profile Management

**Goal**: Store user profile data in Appwrite database

**Implementation**:
1. Create user profile document on first login
2. Store additional user info (institution, student status, etc.)
3. Update profile page to display and edit data from Appwrite

### 2. Perks Database Migration

**Goal**: Move perks data from CSV to Appwrite database

**Steps**:
1. Design perks collection schema in Appwrite
2. Create migration script to import CSV data
3. Update Perks page to fetch from Appwrite
4. Add admin functionality to manage perks

**Schema Example**:
```json
{
  "name": "string",
  "category": "string",
  "description": "string",
  "discount": "string",
  "logo": "string",
  "claimLink": "string",
  "requirements": "array",
  "benefits": "array",
  "verificationSteps": "array",
  "validity": "string",
  "usersCount": "integer"
}
```

### 3. Saved Perks Feature

**Goal**: Allow users to save and track their favorite perks

**Implementation**:
1. Create saved_perks collection
2. Add save/unsave buttons to perk cards
3. Create "My Saved Perks" page
4. Track which perks user has claimed

**Schema Example**:
```json
{
  "userId": "string",
  "perkId": "string",
  "savedAt": "datetime",
  "claimed": "boolean",
  "claimedAt": "datetime"
}
```

### 4. User Verification Status

**Goal**: Track student verification status

**Implementation**:
1. Add verification status field to user profile
2. Integrate SheerID or similar service
3. Show verified badge on profile
4. Gate premium perks behind verification

## Appwrite Collections Schema

### Users Collection
```
- userId (string, unique)
- email (string)
- name (string)
- institution (string)
- studentEmail (string)
- verified (boolean)
- verificationDate (datetime)
- createdAt (datetime)
```

### Perks Collection
```
- perkId (string, unique)
- name (string)
- category (string)
- description (string)
- discount (string)
- logo (string)
- claimLink (string)
- requirements (array)
- benefits (array)
- verificationSteps (array)
- validity (string)
- usersCount (integer)
- featured (boolean)
- active (boolean)
```

### Saved Perks Collection
```
- userId (string)
- perkId (string)
- savedAt (datetime)
- claimed (boolean)
- claimedAt (datetime)
- notes (string)
```

## Security Considerations

### Current Security Measures

1. **Environment Variables**: All sensitive data in environment variables
2. **No API Keys in Frontend**: Only using client-side SDK with proper scopes
3. **Protected Routes**: Dashboard and Profile require authentication
4. **Session Management**: Appwrite handles session tokens securely

### Additional Recommendations

1. **Implement Rate Limiting**: Add rate limits in Appwrite for API calls
2. **Email Verification**: Require email verification for accounts
3. **Student Email Validation**: Verify .edu emails or use SheerID
4. **Data Permissions**: Set proper read/write permissions in Appwrite collections
5. **HTTPS Only**: Always use HTTPS in production

## Database Permissions Setup

### For Users Collection:
- **Create**: Any authenticated user
- **Read**: Owner only (user can only read their own profile)
- **Update**: Owner only
- **Delete**: No one (require admin intervention)

### For Perks Collection:
- **Create**: Admin only
- **Read**: Any user (including guests)
- **Update**: Admin only
- **Delete**: Admin only

### For Saved Perks Collection:
- **Create**: Owner only
- **Read**: Owner only
- **Update**: Owner only
- **Delete**: Owner only

## Troubleshooting

### Common Issues

1. **OAuth Not Working**:
   - Check Google OAuth credentials in Appwrite
   - Verify redirect URLs are configured correctly
   - Ensure domain is added to Platforms in Appwrite

2. **Environment Variables Not Loading**:
   - Make sure variables start with `VITE_` prefix
   - Restart dev server after changing .env
   - Check .env file is in project root

3. **CORS Errors**:
   - Add your domain to Platforms in Appwrite Console
   - Check endpoint URL is correct
   - Clear browser cache

4. **Session Expired**:
   - Sessions last 1 year by default
   - User needs to re-authenticate
   - Call `checkSession()` to refresh

## Resources

- **Appwrite Documentation**: https://appwrite.io/docs
- **Appwrite Web SDK**: https://appwrite.io/docs/sdks#client
- **Authentication Guide**: https://appwrite.io/docs/products/auth
- **Database Guide**: https://appwrite.io/docs/products/databases
- **React Integration**: https://appwrite.io/docs/quick-starts/react

## Support

For issues or questions:
1. Check the DEPLOYMENT.md file for deployment-specific help
2. Review Appwrite documentation
3. Check browser console for error messages
4. Verify environment variables are set correctly
