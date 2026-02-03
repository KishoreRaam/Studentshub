# 🚀 Quick Start Guide - Domain Check Feature

## One-Command Setup

```powershell
.\setup-domain-check.ps1
```

## Manual Setup (3 Steps)

```bash
# 1. Install API dependencies
cd api && npm install && cd ..

# 2. Start both servers
npm run dev:full

# 3. Open browser
# http://localhost:3000
```

## What You'll See

### ✅ Available Domain
```
Input field: [mycollegename] [.edu.in] [Check ✓]
             ↑ Green glow + green border

✓ Domain appears available
  Your institutional email domain will be:
  @mycollegename.edu.in
```

### ❌ Unavailable Domain
```
Input field: [google] [.edu.in] [Check ✗]
             ↑ Red glow + red border + shake

✗ Domain already in use
  Suggestions: Try google-edu, google2024, or new-google
```

## Testing

**Try these:**
- ✅ `testcollege12345` → Available
- ❌ `google` → Taken
- ⚠️  `admin` → Reserved

## Ports

- Frontend: **3000**
- API: **3001**

## Files to Know

- API: `api/check-domain.js`
- Component: `src/components/college-portal/DomainChecker.tsx`
- Form: `src/components/college-portal/RegistrationForm.tsx`
- Styles: `src/index.css` (search for "Domain Check Animations")

## Common Issues

**API not responding?**
```bash
cd api
npm start
```

**Frontend not loading?**
```bash
npm run dev
```

**Both at once?**
```bash
npm run dev:full
```

## Full Documentation

- Setup: `DOMAIN_CHECK_IMPLEMENTATION.md`
- API: `api/README.md`
- Summary: `IMPLEMENTATION_COMPLETE.md`

---

**That's it!** The domain check feature is ready to use. 🎉
