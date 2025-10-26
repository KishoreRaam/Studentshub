# Profile Page Setup Guide

## Overview
The profile page displays user information with real-time authentication integration, including:
- User avatar, name, and university information from logged-in session
- Account information with validity period
- Edit profile functionality with validation
- Avatar upload support (with 5MB size limit)
- Responsive, classy design matching Figma specifications

## Features Implemented

### ✅ Real Authentication Integration
- Uses `useAuth()` hook to get logged-in user data
- Automatically creates profile for new users
- Fetches existing profile from Appwrite database
- Shows loading states and error handling

### ✅ Profile Components
1. **ProfileHeader** - Displays user avatar, name, badges, and university
2. **AccountInfoCard** - Shows email, validity period, account status, linked accounts
3. **EditProfileModal** - Edit profile with inline validation

### ✅ Form Validation
- Name: Required, max 200 characters
- University: Required, max 200 characters
- Stream/Major: Optional, max 200 characters
- Avatar: Max 5MB, image files only

### ✅ Security
- No API keys in client code
- Uses Appwrite client SDK with user session
- All operations scoped to authenticated user
- File upload validation

## Appwrite Setup

### 1. Create Database and Collection

In your Appwrite console:

1. **Create a Database** (if not exists)
   - Name: `StudentHub`
   - Note the Database ID

2. **Create Profiles Collection**
   - Name: `profiles`
   - Permissions: Document level
   - Note the Collection ID

3. **Add Collection Attributes**:

```
name: String, Size: 200, Required
email: String, Size: 320, Required
university: String, Size: 200, Default: ""
stream: String, Size: 200, Default: ""
avatar: String, Size: 2048, Default: ""
verificationStatus: Enum [pending, approved, denied], Default: "pending"
accountStatus: Enum [active, inactive, suspended], Default: "active"
validityStart: DateTime, Required
validityEnd: DateTime, Required
linkedAccounts: String, Size: 10000, Array, Default: []
```

4. **Set Collection Permissions**:
   - Read access: `user:*` (any authenticated user can read their own)
   - Create access: `user:*` (any authenticated user can create)
   - Update access: `user:*` (any authenticated user can update their own)
   - Delete access: None (or admin only)

5. **Create Storage Bucket** (for avatars):
   - Name: `avatars`
   - Max file size: 5MB
   - Allowed file extensions: `jpg, jpeg, png, gif, webp`
   - Permissions:
     - Read: `user:*`
     - Create: `user:*`
     - Update: `user:*`
     - Delete: `user:*`
   - Note the Bucket ID

### 2. Configure Environment Variables

Update your `.env` file:

```env
VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT=your_project_id_here
VITE_APPWRITE_DATABASE_ID=your_database_id_here
VITE_APPWRITE_PROFILES_COLLECTION_ID=your_profiles_collection_id_here
VITE_APPWRITE_STORAGE_BUCKET_ID=your_storage_bucket_id_here
```

### 3. Test Authentication

Make sure Google OAuth is set up:
1. Go to Appwrite Console → Auth → Settings
2. Enable Google OAuth provider
3. Add OAuth credentials
4. Set success URL: `http://localhost:3001/dashboard`
5. Set failure URL: `http://localhost:3001/login?error=oauth_failed`

## Testing Checklist

### Manual Test Steps:

#### 1. **Without Login (Unauthenticated)**
```bash
npm run dev
```
- Visit http://localhost:3001
- Click profile button (bottom-left)
- ✅ Should redirect to `/login` page

#### 2. **Sign In**
- Click "Sign In" button
- Complete Google OAuth
- ✅ Should redirect to dashboard
- ✅ User session should be created

#### 3. **View Profile**
- Click profile button (bottom-left)
- ✅ Should redirect to `/profile` page
- ✅ Should show loading spinner initially
- ✅ Should display user's name from Google account
- ✅ Should display user's email
- ✅ Avatar should show initials if no photo uploaded
- ✅ Should show "Student" badge
- ✅ Should show validity period (today + 4 years)

#### 4. **Edit Profile**
- Click "Edit Profile" button
- ✅ Modal should open with current data pre-filled
- ✅ Try submitting with empty name → should show error
- ✅ Try submitting with 201+ character name → should show error
- ✅ Try uploading 6MB image → should show error
- ✅ Try uploading .pdf file → should show error
- ✅ Upload valid image (< 5MB) → should show preview
- ✅ Update name, university, stream → save
- ✅ Should show "Saving..." state
- ✅ Modal should close on success
- ✅ Profile should update with new data
- ✅ Avatar should display if uploaded

#### 5. **Database Check**
- Open Appwrite Console
- Navigate to Database → profiles collection
- ✅ Should see document with user ID
- ✅ Document should contain updated profile data
- ✅ Check timestamps (createdAt, updatedAt)

#### 6. **Persistence Check**
- Refresh the page
- ✅ Profile data should persist (loaded from database)
- ✅ Avatar should display correctly

#### 7. **Logout & Login Again**
- Sign out
- Sign back in
- ✅ Profile data should still be there
- ✅ No duplicate documents created

## Technical Notes

### Client-Side Security
✅ **No API keys in client code** - Uses `import.meta.env.VITE_*` placeholders only
✅ **Session-based auth** - All operations use user session from `account.get()`
✅ **No secrets exposed** - Server API key should only be in Appwrite Functions (if needed)

### Validation Summary
- ✅ Display name: <= 200 chars, required
- ✅ University: <= 200 chars, required
- ✅ Stream: <= 200 chars, optional
- ✅ Avatar: < 5MB, image/* types only
- ✅ Inline field errors before Appwrite calls
- ✅ Save button disabled while saving

### Error Handling
- ✅ Loading states for async operations
- ✅ Error messages for failed operations
- ✅ Retry functionality on errors
- ✅ Form validation before submission
- ✅ File upload validation

## File Structure

```
src/
├── components/
│   └── profile/
│       ├── ProfileHeader.tsx           # User info header with avatar
│       ├── AccountInfoCard.tsx         # Account details card
│       ├── EditProfileModal.tsx        # Edit modal with validation
│       ├── BenefitsGrid.tsx           # Benefits display
│       ├── BenefitsStats.tsx          # Stats card
│       ├── ActivityCard.tsx           # Recent activity
│       └── NotificationsCard.tsx      # Notifications
├── pages/
│   ├── Profile.tsx                    # Route wrapper
│   └── ProfilePage.tsx                # Main profile page with auth integration
├── services/
│   └── profile.service.ts             # Appwrite profile operations
├── types/
│   └── profile.types.ts               # TypeScript interfaces
└── contexts/
    └── AuthContext.tsx                # Auth state management
```

## Styling Approach

Using **Tailwind CSS** with:
- Gradient backgrounds for premium feel
- Card-based layout with rounded corners
- Smooth transitions and animations (Framer Motion)
- Responsive design (mobile-first)
- Dark mode support
- Blue-green gradient accent colors

## Known Limitations

1. **Avatar Storage**: Currently uses base64 data URLs as placeholder. To use full Appwrite Storage:
   - Uncomment storage code in `profile.service.ts:uploadAvatar()`
   - Ensure storage bucket is properly configured
   - Update file permissions in Appwrite console

2. **Profile Fields**: Basic fields only (name, university, stream)
   - Can be extended with bio, phone, social links, etc.
   - Add corresponding attributes in Appwrite collection

3. **Mock Data**: Benefits, activities, and notifications still use mock data
   - Can be integrated with real perk claiming system later

## Troubleshooting

### Profile doesn't load
- Check browser console for errors
- Verify Appwrite connection (endpoint, project ID)
- Check authentication state in AuthContext
- Verify database/collection IDs in .env

### Can't save profile changes
- Check Appwrite collection permissions
- Verify user is authenticated
- Check network tab for API errors
- Ensure validation passes before save

### Avatar upload fails
- Verify file size < 5MB
- Check file type is image/*
- Ensure storage bucket exists (or using base64 fallback)
- Check storage permissions

## Summary of Changes

### New Files Created
1. `src/components/profile/EditProfileModal.tsx` - Profile editing modal
2. `src/services/profile.service.ts` - Appwrite profile operations
3. `PROFILE_SETUP.md` - This setup guide

### Modified Files
1. `src/components/profile/ProfileHeader.tsx` - Redesigned header
2. `src/components/profile/AccountInfoCard.tsx` - Cleaner card design
3. `src/pages/ProfilePage.tsx` - Integrated real auth data
4. `.env.example` - Added profile-related variables

### Why These Changes
- **Authentication Integration**: Profile now shows real logged-in user data
- **Database Integration**: Profile data persists in Appwrite
- **Better UX**: Loading states, error handling, validation
- **Security**: No API keys, proper session-based auth
- **Design**: Matches Figma specifications with classy, modern look
- **Maintainability**: Separation of concerns (services, components, types)
