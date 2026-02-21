# StudentsHub

> A comprehensive platform helping students discover perks, discounts, AI tools, and educational resources — all in one place.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?logo=tailwindcss&logoColor=white)
![Appwrite](https://img.shields.io/badge/Appwrite-21.x-FD366E?logo=appwrite&logoColor=white)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Pages & Routes](#pages--routes)
- [Backend & Database](#backend--database)
- [Authentication Flow](#authentication-flow)
- [Appwrite Cloud Functions](#appwrite-cloud-functions)
- [Contributing](#contributing)

---

## Overview

**StudentsHub** is a full-stack web application built for students to explore and take advantage of curated perks, discounts, AI tools, and educational resources. The platform features:

- A geo-location based interactive **map** showing nearby deals and discounts
- A personalized **dashboard** with saved items and activity
- A **college portal** for institution-based verification and access control
- Complete **authentication** with college email verification (`.edu`/`.edu.in` domains)
- A curated **AI tools** directory tailored for academic use
- A **vendor/partner** portal for organizations offering student benefits

---

## Features

| Feature | Description |
|---|---|
| **Perks Discovery** | Browse and filter curated student discounts and benefits |
| **Interactive Map** | Geo-based deal discovery with Mapbox GL |
| **Personalized Dashboard** | Saved items, activity stats, and personalized content |
| **AI Tools Directory** | Curated list of AI tools categorized for students |
| **Educational Resources** | Guides, FAQs, and resource tabs |
| **Courses Listing** | Course discovery with filtering |
| **College Portal** | Domain-based college verification system |
| **Vendor Landing** | Dedicated portal for vendors and partners |
| **Business Model Calculator** | Financial modeling tool for student projects |
| **Global Search** | Fuzzy search with command palette (⌘K) |
| **Dark Mode** | Full light/dark theme support |
| **Onboarding Flow** | Multi-step onboarding (department, specialization, summary) |
| **Email Verification** | SendGrid-powered college email verification |

---

## Tech Stack

### Frontend

| Category | Technology |
|---|---|
| Framework | React 18.3 + TypeScript |
| Build Tool | Vite 6.3 (SWC compiler) |
| Routing | React Router DOM 7.9 |
| Styling | Tailwind CSS + CVA |
| UI Components | Radix UI (30+ primitives) |
| Icons | Lucide React |
| Forms | React Hook Form + Zod |
| Animation | GSAP + Motion |
| Charts | Recharts |
| Maps | Mapbox GL 3.x |
| Search | Fuse.js (fuzzy search) |
| Notifications | Sonner (toasts) |
| Carousel | Embla Carousel |
| Analytics | React GA4 |
| Theme | next-themes |

### Backend & Services

| Category | Technology |
|---|---|
| BaaS | Appwrite 21.x |
| Serverless Functions | Appwrite Cloud Functions |
| Email Delivery | SendGrid |
| API Server | Node.js (Vercel Serverless) |
| Data Parsing | PapaParse + csv-parse |

---

## Project Structure

```
Studentshub/
├── src/
│   ├── components/              # 130+ React components
│   │   ├── ui/                 # Radix UI wrappers (50+ components)
│   │   ├── map/                # MapCanvas, MapNavBar, deal filters
│   │   ├── dashboard/          # Dashboard card components
│   │   ├── college-portal/     # College portal UI
│   │   ├── courses/            # Course components
│   │   ├── onboarding/         # Multi-step onboarding modal
│   │   ├── profile/            # User profile components
│   │   ├── search/             # Global search modal
│   │   ├── ai-tools/           # AI tools section components
│   │   └── home/               # Landing page sections
│   │
│   ├── pages/                  # 20+ route-level page components
│   │   ├── Home.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Perks.tsx
│   │   ├── MapPage.tsx
│   │   ├── Profile.tsx
│   │   ├── ResourcesPage.tsx
│   │   ├── CoursesPage.tsx
│   │   ├── AITools.tsx
│   │   ├── BusinessModel.tsx
│   │   ├── CollegePortal.tsx
│   │   ├── VendorLanding.tsx
│   │   └── [auth pages]        # Login, SignUp, Reset, Verify
│   │
│   ├── contexts/               # React Contexts
│   │   ├── AuthContext.tsx     # Global auth state
│   │   └── SearchContext.tsx   # Global search state
│   │
│   ├── hooks/                  # Custom hooks
│   │   ├── useMapState.ts
│   │   ├── useSavedItems.ts
│   │   ├── useFormAutoSave.ts
│   │   └── useScrollTracking.ts
│   │
│   ├── services/               # Appwrite service layer
│   │   ├── profile.service.ts
│   │   ├── saved-items.service.ts
│   │   └── saved-events.service.ts
│   │
│   ├── utils/                  # Utility functions
│   │   ├── csvParser.ts
│   │   ├── collegeUtils.ts
│   │   ├── searchUtils.ts
│   │   └── streamUtils.ts
│   │
│   ├── data/                   # Static datasets
│   │   ├── onboardingData.ts
│   │   └── discountLocations.ts
│   │
│   ├── types/                  # TypeScript type definitions
│   │   ├── ai-tools.ts
│   │   ├── collegePortal.ts
│   │   ├── dashboard.ts
│   │   ├── event.ts
│   │   ├── profile.types.ts
│   │   ├── resource.ts
│   │   └── search.ts
│   │
│   ├── App.tsx                 # Root app with routing
│   ├── main.tsx                # React entry point
│   └── index.css               # Global styles + animations
│
├── api/
│   └── check-domain.js         # Vercel serverless — .edu domain checker
│
├── appwrite-functions/         # Appwrite cloud functions
│   ├── onUserUpdated/          # Post-verification role assignment
│   ├── resendVerification/     # Rate-limited email resend
│   ├── sendVerificationCustom/ # SendGrid email sender
│   ├── adminEndpoints/         # Admin management API
│   ├── sendgridWebhook/        # Email event webhook handler
│   ├── DATABASE_SCHEMA.md      # Full DB schema documentation
│   ├── DEPLOYMENT.md           # Function deployment guide
│   └── README.md               # Functions overview
│
├── scripts/                    # Utility/data scripts
├── public/                     # Static assets
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** v18+ and npm
- An **Appwrite** instance (cloud or self-hosted)
- A **Mapbox** account and API token
- A **SendGrid** account for transactional email
- A **Google Analytics** tracking ID (optional)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/studentshub.git
cd studentshub

# 2. Install dependencies
npm install

# 3. Copy and configure environment variables
cp .env.example .env
# Fill in your values (see Environment Variables section below)

# 4. Start the full development stack
npm run dev:full
# OR run just the frontend
npm run dev
```

| Script | Description |
|---|---|
| `npm run dev` | Start the frontend dev server at `localhost:3000` |
| `npm run api` | Start the Node.js API server at `localhost:3001` |
| `npm run dev:full` | Start both frontend and API simultaneously |
| `npm run build` | Create a production build in `build/` |

---

## Environment Variables

Create a `.env` file at the project root with the following:

```env
# Appwrite
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=studentperks_db

# Mapbox
VITE_MAPBOX_TOKEN=your_mapbox_public_token

# Google Analytics
VITE_GA_TRACKING_ID=G-XXXXXXXXXX

# API (used by the api/ server)
SENDGRID_API_KEY=your_sendgrid_api_key
APPWRITE_API_KEY=your_appwrite_server_key
```

> Appwrite Cloud Functions require additional environment variables. See [`appwrite-functions/DEPLOYMENT.md`](./appwrite-functions/DEPLOYMENT.md) for the complete guide.

---

## Pages & Routes

| Route | Page | Auth Required |
|---|---|---|
| `/` | Home — landing page | No |
| `/dashboard` | Personalized user dashboard | Yes |
| `/perks` | Perks & discounts catalog | No |
| `/map` | Interactive geo-based deal map | No |
| `/profile` | User profile & settings | Yes |
| `/resources` | Educational resources & FAQs | No |
| `/courses` | Course discovery & filtering | No |
| `/tools` | AI tools directory | No |
| `/business-model` | Financial modeling calculator | No |
| `/college-portal` | College domain checker | No |
| `/vendors` | Vendor / partner platform | No |
| `/login` | Login | Guest only |
| `/signup` | Sign up | Guest only |
| `/forgot-password` | Password reset request | Guest only |
| `/reset-password` | Set new password | Guest only |
| `/verify-email` | Email verification | Guest only |

---

## Backend & Database

StudentsHub uses **Appwrite** as its backend-as-a-service.

**Database ID:** `studentperks_db`

### Collections

| Collection | Purpose |
|---|---|
| `users_meta` | User metadata, roles, and verification status |
| `audit_logs` | Authentication event tracking (signup, login, verify) |
| `email_logs` | Email delivery status per user |

For the full schema including field types, permissions, and indexes, see [`appwrite-functions/DATABASE_SCHEMA.md`](./appwrite-functions/DATABASE_SCHEMA.md).

### Domain Checker API

A lightweight Node.js serverless function at `/api/check-domain.js` performs DNS-based validation of `.edu` / `.edu.in` domains submitted during college portal registration.

- **Endpoint:** `POST /api/check-domain`
- **Runs on:** Port 3001 locally / Vercel in production

---

## Authentication Flow

```
User signs up with college email
        │
        ▼
Verification email sent via SendGrid
        │
        ▼
User clicks verification link
        │
        ▼
Appwrite marks emailVerification = true
        │
        ▼
onUserUpdated cloud function triggers
        ├── Validates college email domain
        ├── Assigns "student" role in users_meta
        └── Creates an audit log entry
        │
        ▼
User gains full access to protected content
```

Protected routes are guarded via `AuthContext`. Unauthenticated users attempting to access protected pages are redirected to `/login`.

---

## Appwrite Cloud Functions

All serverless logic lives in `appwrite-functions/`. Each function is independently deployable.

| Function | Trigger | Purpose |
|---|---|---|
| `onUserUpdated` | Appwrite event (user update) | Assigns role after email verification |
| `resendVerification` | HTTP | Rate-limited resend of verification email |
| `sendVerificationCustom` | HTTP | Sends branded verification email via SendGrid |
| `adminEndpoints` | HTTP | Admin management — user stats, overrides |
| `sendgridWebhook` | HTTP | Handles email bounces and suppressions from SendGrid |

See [`appwrite-functions/README.md`](./appwrite-functions/README.md) for deployment instructions and individual function documentation.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make your changes following the existing code style
4. Commit using conventional commits: `git commit -m "feat: add new feature"`
5. Push and open a Pull Request against `main`

**Code conventions:**
- TypeScript strict mode — no `any`
- Components go in `src/components/`, pages in `src/pages/`
- Use the service layer in `src/services/` for all Appwrite calls
- Prefer Radix UI primitives from `src/components/ui/` for new UI elements
- Run `npm run build` and ensure it passes before submitting a PR
