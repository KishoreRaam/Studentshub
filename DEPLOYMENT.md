# Deployment Guide - StudentHub with Appwrite

This guide will help you deploy your StudentHub application to Vercel with Appwrite backend integration.

## Prerequisites

- Vercel account (sign up at https://vercel.com)
- Appwrite project set up (https://cloud.appwrite.io)
- Git repository connected to Vercel

## 1. Appwrite Configuration

### Enable Google OAuth Provider

1. Log in to your Appwrite Console: https://cloud.appwrite.io
2. Navigate to your project: `68d29c8100366fc856a6`
3. Go to **Auth** → **Settings** → **OAuth2 Providers**
4. Click on **Google** and enable it
5. Configure OAuth credentials:
   - **Client ID**: Get from Google Cloud Console
   - **Client Secret**: Get from Google Cloud Console
   - **Redirect URIs**: Add these URLs:
     - `http://localhost:3002/dashboard` (for local development)
     - `https://your-app.vercel.app/dashboard` (replace with your Vercel domain)

### Configure Platform Settings

1. In Appwrite Console, go to **Settings** → **Platforms**
2. Add a new **Web App** platform:
   - **Name**: StudentHub Production
   - **Hostname**: `your-app.vercel.app` (your Vercel domain)
3. Add another platform for local development:
   - **Name**: StudentHub Local
   - **Hostname**: `localhost`

### Get Your Database IDs

1. In Appwrite Console, go to **Databases**
2. Click on your database
3. Copy the **Database ID** (you'll need this for environment variables)
4. For each collection you've created, copy the **Collection ID**:
   - Users collection ID
   - Perks collection ID
   - Saved Perks collection ID

## 2. Vercel Deployment

### Step 1: Connect Your Repository

1. Log in to Vercel: https://vercel.com
2. Click **"Add New"** → **"Project"**
3. Import your Git repository
4. Select the repository containing your StudentHub code

### Step 2: Configure Environment Variables

In the Vercel project settings, add the following environment variables:

```
VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=68d29c8100366fc856a6
VITE_APPWRITE_DATABASE_ID=your_database_id_here
VITE_APPWRITE_COLLECTION_USERS=your_users_collection_id_here
VITE_APPWRITE_COLLECTION_PERKS=your_perks_collection_id_here
VITE_APPWRITE_COLLECTION_SAVED_PERKS=your_saved_perks_collection_id_here
```

**Important**: Replace the placeholder values with your actual IDs from Appwrite Console.

### Step 3: Configure Build Settings

Vercel should auto-detect these settings, but verify:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete
3. Once deployed, copy your production URL (e.g., `https://your-app.vercel.app`)

### Step 5: Update Appwrite with Production URL

1. Go back to Appwrite Console
2. Update the OAuth redirect URLs with your production URL:
   - Add: `https://your-app.vercel.app/dashboard`
3. Update the Platform hostname to match your Vercel domain

## 3. Testing Your Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Click **"Sign In"** or **"Sign Up"**
3. Click **"Continue with Google"**
4. You should be redirected to Google for authentication
5. After successful login, you should be redirected to `/dashboard`

## 4. Troubleshooting

### OAuth Not Working

**Problem**: Getting "Invalid OAuth redirect URI" error

**Solution**:
- Verify the redirect URI in Appwrite matches your Vercel domain exactly
- Make sure the URI includes `/dashboard` path: `https://your-app.vercel.app/dashboard`
- Check that you've added the domain to Platforms in Appwrite

### CORS Errors

**Problem**: Getting CORS errors when accessing Appwrite

**Solution**:
- Add your Vercel domain to Platforms in Appwrite Console
- Make sure the hostname matches exactly (no trailing slashes)
- Clear browser cache and try again

### Environment Variables Not Working

**Problem**: App can't connect to Appwrite backend

**Solution**:
- Verify all environment variables are set correctly in Vercel
- Make sure variable names start with `VITE_` prefix
- Redeploy after adding/updating environment variables
- Check Vercel deployment logs for any build errors

### Google OAuth Configuration

**Problem**: Google OAuth not configured

**Solution**:
1. Go to Google Cloud Console: https://console.cloud.google.com
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Add authorized redirect URIs:
   - `https://fra.cloud.appwrite.io/v1/account/sessions/oauth2/callback/google/68d29c8100366fc856a6`
6. Copy Client ID and Secret to Appwrite Console

## 5. Local Development

### Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env`
4. Update `.env` with your Appwrite credentials
5. Run development server: `npm run dev`

### Important Notes

- Always use `localhost` in Appwrite platforms for local development
- Update OAuth redirect URLs to include `http://localhost:3002/dashboard`
- Never commit `.env` file to version control

## 6. Security Best Practices

1. **API Keys**: Never expose your Appwrite API key in frontend code
2. **Environment Variables**: Always use environment variables for sensitive data
3. **CORS**: Only add trusted domains to Appwrite platforms
4. **OAuth**: Regularly rotate OAuth credentials
5. **Session Management**: Sessions expire after 1 year by default in Appwrite

## 7. Next Steps

After successful deployment, consider:

1. **Custom Domain**: Add a custom domain in Vercel settings
2. **Analytics**: Set up Vercel Analytics for usage insights
3. **Monitoring**: Configure error tracking (e.g., Sentry)
4. **Database Migration**: Move perks data from CSV to Appwrite database
5. **User Profiles**: Create user profile collection and populate on first login
6. **Saved Perks**: Implement saved perks functionality

## 8. Support

- **Appwrite Documentation**: https://appwrite.io/docs
- **Vercel Documentation**: https://vercel.com/docs
- **Project Issues**: Create an issue in your GitHub repository

---

## Quick Reference

### Required Appwrite Setup:
- ✅ Google OAuth provider enabled
- ✅ Production domain added to Platforms
- ✅ OAuth redirect URLs configured
- ✅ Database and collections created

### Required Vercel Setup:
- ✅ Repository connected
- ✅ Environment variables configured
- ✅ Build settings verified
- ✅ Deployed successfully

### Testing Checklist:
- [ ] Homepage loads correctly
- [ ] Login with Google works
- [ ] Redirects to dashboard after login
- [ ] Protected routes require authentication
- [ ] Logout functionality works
- [ ] Profile page accessible when logged in
