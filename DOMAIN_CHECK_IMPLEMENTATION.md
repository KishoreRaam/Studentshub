# Domain Availability Check - Setup & Usage Guide

## Overview

This implementation adds DNS-based domain availability checking to the College Portal registration form with professional animations.

## Features Implemented

### Backend (API)
- ✅ Node.js API using built-in DNS module
- ✅ DNS record checking (A, MX, NS records)
- ✅ Returns JSON response: `{ available: true/false }`
- ✅ No domain registrar integration (probabilistic check only)

### Frontend
- ✅ Manual check triggered by "Check" button
- ✅ Domain validation before checking
- ✅ Professional animations for both states:

#### Available Domain
- Animated green checkmark with spring-based rotation
- "Domain appears available" message in green
- 1.2-second glow effect on input field (green)
- Green border highlighting on input
- Smooth AnimatePresence transitions

#### Unavailable Domain
- Animated red X with spring rotation
- Shake effect on message container
- "Domain already in use" message in red
- 1.2-second glow effect on input field (red)
- Red border highlighting on input
- Domain suggestions displayed

## Setup Instructions

### 1. Install API Dependencies

```bash
cd api
npm install
```

This installs:
- express
- body-parser
- cors

### 2. Start the API Server

From the `api` directory:
```bash
npm start
```

Or from the root directory:
```bash
npm run api
```

The API will run on `http://localhost:3001`

### 3. Start the Frontend

In a new terminal, from the root directory:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### 4. Run Both Simultaneously (Recommended)

From the root directory:
```bash
npm run dev:full
```

This starts both the API server and Vite dev server.

## How to Use

1. Navigate to the College Portal registration page
2. Fill in the "Preferred Domain" field (e.g., `mycollegename`)
3. Click the "Check" button
4. Watch the animations:
   - **Loading**: Blue spinning loader
   - **Available**: Green checkmark with glow effect
   - **Taken**: Red X with shake animation

## Technical Details

### API Logic

The API checks for DNS records using Node.js's `dns.promises` module:

```javascript
// Check for A, MX, and NS records
const checks = await Promise.allSettled([
  dns.resolve4(fullDomain),    // A records
  dns.resolveMx(fullDomain),   // MX records
  dns.resolveNs(fullDomain),   // NS records
]);

// If any records exist → domain is NOT available
// If no records exist → domain is AVAILABLE
```

### Frontend Flow

1. User enters domain name
2. Format validation runs (alphanumeric, hyphens only)
3. Reserved domain check runs (admin, api, www, etc.)
4. User clicks "Check" button
5. API call made to `/api/check-domain`
6. Response triggers animations:
   - Input field glow (green/red)
   - Border color change
   - Message with icon animation
   - Suggestions (if unavailable)

### Animation Details

#### Keyframe Animations (CSS)

```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}

@keyframes glowGreen {
  0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
  50% { box-shadow: 0 0 0 8px rgba(34, 197, 94, 0.3); }
  100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}

@keyframes glowRed {
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
  50% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0.3); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}
```

#### Framer Motion Animations

- **Icon entrance**: Spring animation with rotation
- **Message container**: Fade and slide transitions
- **Result cards**: Scale and opacity animations

## Files Modified/Created

### New Files
- `api/check-domain.js` - DNS checking API
- `api/package.json` - API dependencies
- `api/README.md` - API documentation

### Modified Files
- `src/components/college-portal/DomainChecker.tsx`
  - Added manual check trigger
  - Added professional animations
  - Updated API integration
  
- `src/components/college-portal/RegistrationForm.tsx`
  - Added check button handler
  - Added input glow state management
  - Added border color state management
  
- `src/index.css`
  - Added shake animation
  - Added glow animations (green/red)
  
- `vite.config.ts`
  - Added API proxy configuration
  
- `package.json`
  - Added API server scripts

## Testing the Implementation

### Test Available Domain

1. Enter domain: `testcollege123xyz`
2. Click "Check"
3. Should show: ✓ "Domain appears available" (green)

### Test Unavailable Domain

Try domains that likely have DNS records:
- `google` → Shows as taken
- `mit` → Shows as taken
- `stanford` → Shows as taken

### Test Invalid Format

- `test domain` (spaces) → Shows format error
- `test@college` (special chars) → Shows format error
- `admin` (reserved) → Shows reserved error

## Deployment

### Vercel (Recommended)

The API is designed as a Vercel serverless function:

1. Deploy to Vercel
2. API endpoint: `https://yourdomain.vercel.app/api/check-domain`
3. Update frontend API calls to use production URL

### Environment Variables

For production, you may want to add:
```
API_URL=https://yourdomain.vercel.app/api
```

## Troubleshooting

### API Not Responding

1. Check if API server is running: `http://localhost:3001`
2. Check console for errors
3. Verify CORS is enabled

### Animations Not Working

1. Check browser console for errors
2. Verify Framer Motion is installed
3. Check CSS animations are loaded

### DNS Checks Failing

1. Check internet connection
2. Some corporate firewalls block DNS queries
3. Try different domain names

## Academic Design Rationale

The animations are intentionally:
- **Professional**: Clean, smooth transitions
- **Minimal**: No playful or excessive effects
- **Informative**: Clear visual feedback
- **Accessible**: Respects reduced motion preferences
- **Academic**: Color scheme (green-50/200, red-50/200)

## Next Steps

### Optional Enhancements

1. Add rate limiting to API
2. Add authentication for API calls
3. Cache DNS results (TTL-based)
4. Add more detailed error messages
5. Add analytics tracking
6. Add domain suggestion algorithm

## Support

For issues or questions:
1. Check API logs in terminal
2. Check browser console for errors
3. Review API README in `/api` directory
