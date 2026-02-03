
# StudentsHub — Student Perks Platform

Comprehensive monorepo for a student-centric platform featuring perks, events, resources, AI tools, and a College Portal with domain availability checks and Appwrite-powered authentication.

This README provides a deep, LLM-friendly overview: architecture, data flows, APIs, functions, environment, setup, and operational guidance.

**Key Goals**
- Unified student experience: perks, events, resources, courses, AI tools
- Secure auth with email verification and Google OAuth
- College Portal: validate institutional domains with DNS checks
- Production-ready patterns: rate limits, logging, analytics, and serverless APIs

**Primary Entry Points**
- Frontend SPA: [src/App.tsx](src/App.tsx), [src/main.tsx](src/main.tsx)
- API (serverless/local): [api/check-domain.js](api/check-domain.js)
- Auth functions (Appwrite): [appwrite-functions/](appwrite-functions/README.md)


**Table of Contents**
- Overview
- Architecture
- Features
- Data & Assets
- Authentication & Identity
- College Portal Domain Check
- APIs
- Appwrite Functions
- Configuration & Environment
- Setup & Development
- Deployment
- Security & Privacy
- Analytics & Monitoring
- Limitations & Future Work
- Troubleshooting


**Overview**
- SPA built with Vite + React 18 and modern component libs (Radix UI, Lucide)
- Secure authentication backed by Appwrite services and email verification
- DNS-based institutional domain availability checking for College Portal onboarding
- Rich content sourced from curated CSV/JSON datasets served from `public/`
- Production deploy target: Vercel (SPA rewrites) + serverless API for domain checks


**Architecture**
- **Frontend (SPA)**
   - React + Vite + SWC: [vite.config.ts](vite.config.ts), [src/main.tsx](src/main.tsx)
   - Routing: [react-router-dom] configured in [src/App.tsx](src/App.tsx)
   - Theming & UI: Radix UI primitives, `next-themes`, custom components
   - Analytics: GA4 via `react-ga4`
- **API**
   - Domain availability check endpoint: [api/check-domain.js](api/check-domain.js)
   - Local dev: Express bootstrap; Serverless: Vercel function handler signature
- **Authentication Backend (Appwrite Functions)**
   - Modular functions: [appwrite-functions/](appwrite-functions/README.md)
   - Shared utilities: [appwrite-functions/shared/utils.js](appwrite-functions/shared/utils.js)
- **Build & Deploy**
   - SPA build to `build/`: [vite.config.ts](vite.config.ts)
   - Vercel rewrites: [vercel.json](vercel.json)
- **Scripts**
   - `dev`, `build`, `api`, `dev:full`: [package.json](package.json)


**Features**
- **Perks, Events, Resources, Courses, AI Tools**: Rich content pages pulling from curated datasets
- **Authentication**: Email/password + Google OAuth; session checks; protected routes
- **Email Verification**: Appwrite-driven flow; role assignment on verification
- **College Portal**: Domain availability checks with animations and suggestions
- **Profile**: Preferences persisted in Appwrite; optional profile picture storage
- **Analytics**: GA4 pageview tracking across routes


**Data & Assets**
- Public datasets (served by the SPA):
   - [public/assets/ai-tools-complete.csv](public/assets/ai-tools-complete.csv)
   - [public/assets/ai-tools-complete.with-logo-urls.csv](public/assets/ai-tools-complete.with-logo-urls.csv)
   - [public/assets/colleges_merged.json](public/assets/colleges_merged.json)
   - [public/assets/student_courses_resources.csv](public/assets/student_courses_resources.csv)
   - [public/assets/student_events_2024_2025.csv](public/assets/student_events_2024_2025.csv)
   - [public/assets/Name-Category-Description-DiscountOfferINR-VerificationMethod-Validity-ClaimLink.csv](public/assets/Name-Category-Description-DiscountOfferINR-VerificationMethod-Validity-ClaimLink.csv)
- Build outputs mirror public assets: [build/assets/](build/assets/)
- Logos and colleges imagery: [public/assets/Logos/](public/assets/Logos/), [public/assets/Colleges/](public/assets/Colleges/)
- Styling entry: [src/index.css](src/index.css)


**Authentication & Identity**
- Frontend Appwrite client wrapper: [src/lib/appwrite.js](src/lib/appwrite.js)
   - Exposes `client`, `account`, `databases`, `storage`, `AppwriteID`, `OAUTH_CONFIG`
   - Reads environment: `VITE_APPWRITE_ENDPOINT`, `VITE_APPWRITE_PROJECT`, database/bucket/collection IDs
- Auth context: [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx)
   - `loginWithGoogle()` via `account.createOAuth2Session()` with `OAUTH_CONFIG`
   - `signupWithEmail()` creates account, logs in, updates preferences, triggers verification link
   - `loginWithEmail()`, `logout()`, `checkSession()` maintain SPA session state
- Protected routing: `ProtectedRoute` used in [src/App.tsx](src/App.tsx) to gate `Dashboard`, `Profile`
- Post-verification role assignment handled by Appwrite function `onUserUpdated` (see functions section)


**College Portal Domain Check**
- Purpose: Validate availability of institutional email domains (e.g., `mycollege.edu.in`)
- UX: Professional animations for success/failure, glow, shake effects, suggestions
- Frontend integration (see documentation):
   - Component paths referenced in docs: DomainChecker & RegistrationForm
   - Proxy for local dev: `/api` → `http://localhost:3001` in [vite.config.ts](vite.config.ts)
- Developer guides:
   - Quick start: [QUICK_START_DOMAIN_CHECK.md](QUICK_START_DOMAIN_CHECK.md)
   - Full implementation: [DOMAIN_CHECK_IMPLEMENTATION.md](DOMAIN_CHECK_IMPLEMENTATION.md)


**APIs**
- Domain Availability Endpoint: [api/check-domain.js](api/check-domain.js)
   - Method: `POST /api/check-domain`
   - Body: `{ "domain": "mycollegename", "extension": ".edu.in" }`
   - Valid extensions: `.edu.in`, `.ac.in`, `.edu`, `.org`, `.in`
   - Logic: DNS A/MX/NS resolution via Node `dns.promises`
   - Response: `{ "available": true | false }` or `{ "error": "message" }`
   - CORS enabled; preflight handled
   - Local dev bootstraps Express for `/api/check-domain`
   - Serverless export compatible with Vercel
   - API docs: [api/README.md](api/README.md)


**Appwrite Functions**
- Overview: [appwrite-functions/README.md](appwrite-functions/README.md)
- Functions:
   - `onUserUpdated`: Assign role on email verification; validate domains; log audit
   - `resendVerification`: Rate-limited resends to prevent abuse
   - `sendVerificationCustom`: SendGrid-powered custom verification email
   - `adminEndpoints`: Admin user management and stats
   - `sendgridWebhook`: Ingest email delivery events (bounces, suppressions)
- Shared utilities: [appwrite-functions/shared/utils.js](appwrite-functions/shared/utils.js)
   - `isAllowedDomain(email, ALLOWED_DOMAINS)`
   - `checkRateLimit(lastResend, resendCount, rateLimitPerHour)`
   - `retryWithBackoff(fn)` with exponential backoff
   - `validateSession(req, appwriteClient)` for JWT validation
   - `createAuditLog(...)` to centralize auditing
- Suggested collections (from docs): `users_meta`, `audit_logs`, `email_logs`
- Testing scaffold: [appwrite-functions/tests/](appwrite-functions/tests/)


**Configuration & Environment**
- Env (frontend): set in Vite `import.meta.env`
   - `VITE_APPWRITE_ENDPOINT`, `VITE_APPWRITE_PROJECT`
   - `VITE_APPWRITE_DATABASE_ID`, collection IDs, bucket IDs
- Vite dev server: [vite.config.ts](vite.config.ts)
   - Port `3000`, proxy `/api` to `3001`, build to `build/`
- Deployment rewrites: [vercel.json](vercel.json)
   - SPA rewrites all routes to `/index.html`
   - Build command: `npm run build`, output: `build/`


**Setup & Development**
- Prerequisites
   - Node.js 18+
   - npm
- Install dependencies
  
   ```bash
   npm install
   ```

- Start frontend only
  
   ```bash
   npm run dev
   ```

- Start API only
  
   ```bash
   cd api
   npm install
   npm start
   ```

- Start both (recommended for College Portal work)
  
   ```bash
   npm run dev:full
   ```

- Quick College Portal setup (Windows PowerShell)
  
   ```powershell
   .\setup-domain-check.ps1
   ```


**Deployment**
- Vercel (SPA + serverless API)
   - Ensure `vercel.json` rewrites exist
   - Place API in `/api` (supported by Vercel)
   - Configure environment variables for Appwrite in project settings
   - Deploy frontend and functions separately (Appwrite via Appwrite CLI)
- Build locally
  
   ```bash
   npm run build
   ```
   - Outputs to [build/](build/)


**Security & Privacy**
- Frontend never stores admin or server-side secrets
- Email verification mandatory; role assignment on verified, allowed domains
- Rate limits for resend flows
- CORS enabled on API; validate domain input shape
- HTTPS recommended everywhere; sessions via Appwrite JWT
- Audit logs and email logs for traceability (functions backend)


**Analytics & Monitoring**
- GA4 setup: [src/main.tsx](src/main.tsx) initializes `ReactGA.initialize("G-JQ9B5W0GPL")`
- Pageview tracking via [src/App.tsx](src/App.tsx) `useEffect` on route changes
- Appwrite Console metrics for functions (execution count, error rate, timing)
- Audit and email logs for auth and email deliverability analysis


**Limitations & Future Work**
- Domain availability is probabilistic (DNS-only); does not query registrars
- Tailwind config is minimal: [tailwind.config.js](tailwind.config.js)
- Consider caching DNS results with TTL and adding registrar integrations
- Strengthen admin endpoints with RBAC and audit dashboards
- Expand dataset ingestion tooling and validation


**Troubleshooting**
- Frontend not loading
   - Ensure dev server on port 3000; check [vite.config.ts](vite.config.ts)
   - Reinstall deps if module resolution fails
- API not responding
   - Start API on `3001` (see [QUICK_START_DOMAIN_CHECK.md](QUICK_START_DOMAIN_CHECK.md))
   - Use `npm run dev:full` to run both
- OAuth issues
   - Verify `VITE_APPWRITE_ENDPOINT`, `VITE_APPWRITE_PROJECT`
   - Check `OAUTH_CONFIG` in [src/lib/appwrite.js](src/lib/appwrite.js)
- Email verification not received
   - Check SendGrid setup and function logs (see [appwrite-functions/README.md](appwrite-functions/README.md))


**LLM Orientation**
- Entities
   - `User`, `Role`, `AuditLog`, `EmailLog`, `Perk`, `Event`, `Resource`, `AITool`, `CollegeRegistration`
- Primary Operations
   - Auth: sign up, login (email/OAuth), verify email, logout, session check
   - Content: list/search datasets for perks, events, resources, AI tools
   - College Portal: check domain availability, register with preferred domain
   - Admin: fetch user, update role, get stats (via functions)
- Integration Points
   - Frontend ↔ Appwrite (`account`, `databases`, `storage`)
   - Frontend ↔ API (`/api/check-domain` with proxy in dev)
   - Functions ↔ SendGrid (webhooks and transactional emails)


**File Map (Selected)**
- Frontend entry: [src/main.tsx](src/main.tsx)
- Routing and pages: [src/App.tsx](src/App.tsx)
- Auth glue: [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx), [src/lib/appwrite.js](src/lib/appwrite.js)
- Vite config: [vite.config.ts](vite.config.ts)
- API: [api/check-domain.js](api/check-domain.js), [api/README.md](api/README.md)
- Functions: [appwrite-functions/README.md](appwrite-functions/README.md), [appwrite-functions/shared/utils.js](appwrite-functions/shared/utils.js)
- Assets: [public/assets/](public/assets/)


**Quick Commands**
- Install
  
   ```bash
   npm install
   ```
- Run frontend
  
   ```bash
   npm run dev
   ```
- Run API
  
   ```bash
   cd api && npm install && npm start
   ```
- Run both
  
   ```bash
   npm run dev:full
   ```
- Build
  
   ```bash
   npm run build
   ```
