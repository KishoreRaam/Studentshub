<div align="center">

# 🎓 StudentsHub

### Everything a student needs — one platform.

Discover student discounts, AI tools, courses, events, and campus resources — all verified, curated, and free.

<br />

![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Appwrite](https://img.shields.io/badge/Appwrite-FD366E?style=for-the-badge&logo=appwrite&logoColor=white)
![Mapbox](https://img.shields.io/badge/Mapbox-000000?style=for-the-badge&logo=mapbox&logoColor=white)

<br />

[Live Site](#) · [Report Bug](../../issues) · [Request Feature](../../issues)

</div>

<br />

---

<br />

## 🧭 What is StudentsHub?

**StudentsHub** is a one-stop platform that helps college students **save money, learn smarter, and stay connected** with everything their student life needs.

Too many student benefits go unclaimed simply because students don't know they exist. StudentsHub fixes that by bringing together:

- **🏷️ Student Discounts & Perks** — Verified deals from 35+ brands like GitHub, Figma, Apple, JetBrains, Spotify, and more. Filter by category, search instantly, and claim with one click.

- **🤖 AI Tools Directory** — A curated, searchable database of AI tools useful for assignments, research, coding, and productivity — categorized and rated for students.

- **📚 Courses & Learning Resources** — Free and discounted courses, certifications, and study material from platforms like Coursera, Udemy, and LinkedIn Learning.

- **🗺️ Interactive Deals Map** — A Mapbox-powered map showing nearby student discounts — food, shopping, travel, entertainment — based on your location.

- **📅 Campus Events** — Discover, register for, and even create events. Includes an event creator dashboard and admin moderation panel.

- **🏫 College Portal** — Institutions can register and verify their student email domains so their students get automatic access.

- **🤝 Vendor Portal** — Businesses and brands can apply to list their student offers on the platform.

<br />

> **Who is it for?** College students in India (and beyond) who want to unlock every benefit their `.edu` email can get them.

<br />

---

<br />

## ✨ Feature Highlights

<table>
<tr>
<td width="50%">

### 🔍 Smart Search
Global fuzzy search with a command palette (<kbd>⌘</kbd><kbd>K</kbd>). Find any perk, tool, course, or event instantly.

</td>
<td width="50%">

### 🌙 Dark Mode
Full light and dark theme support. Follows your system preference or toggle manually — persists across sessions.

</td>
</tr>
<tr>
<td>

### 📊 Personal Dashboard
A protected dashboard showing your saved perks, bookmarked tools, upcoming events, and activity stats.

</td>
<td>

### 🛡️ College Email Verification
Sign up with your college email. Automatic domain validation + SendGrid verification ensures only real students get access.

</td>
</tr>
<tr>
<td>

### 🗓️ Event Management
Full event lifecycle — students can browse, register, and create events. Admins moderate submissions before they go live.

</td>
<td>

### 📈 Google Analytics
Page-level analytics tracking built in. Every route change fires a pageview so you can understand user behavior.

</td>
</tr>
<tr>
<td>

### 🧮 Business Model Calculator
A financial modeling tool for student entrepreneurs to plan and validate their startup ideas.

</td>
<td>

### 💬 Email Inquiry Widget
A floating contact widget on every page lets users reach out with questions, feedback, or partnership inquiries.

</td>
</tr>
</table>

<br />

---

<br />

## 🛠️ Tech Stack

### Frontend

| | Technology | Purpose |
|:--|:--|:--|
| ⚛️ | **React 18** + TypeScript | UI framework with type safety |
| ⚡ | **Vite 6** (SWC) | Lightning-fast dev server & bundler |
| 🎨 | **Tailwind CSS** + **shadcn/ui** | Utility-first styling with 30+ Radix UI primitives |
| 🧭 | **React Router v7** | Client-side routing (20+ routes) |
| 📝 | **React Hook Form** + **Zod** | Form handling with schema validation |
| 🎞️ | **GSAP** + **Framer Motion** | Smooth animations & page transitions |
| 🗺️ | **Mapbox GL** | Interactive geolocation-based map |
| 📊 | **Recharts** | Dashboard charts and data visualization |
| 🔎 | **Fuse.js** | Client-side fuzzy search |
| 🔔 | **Sonner** | Toast notifications |
| 🎠 | **Embla Carousel** | Responsive carousels |

### Backend & Services

| | Technology | Purpose |
|:--|:--|:--|
| ☁️ | **Appwrite** | Auth, database, storage, serverless functions |
| 📧 | **SendGrid** | Transactional verification & newsletter emails |
| 🌐 | **Node.js API** (Vercel) | College domain validation endpoint |
| 📋 | **PapaParse** | CSV parsing for bulk data (perks, tools, events) |
| 📈 | **React GA4** | Google Analytics integration |

<br />

---

<br />

## 🗂️ Project Structure

```
StudentsHub/
│
├── 📄 index.html                  # HTML entry point
├── 📦 package.json                # Dependencies & scripts
├── ⚙️ vite.config.ts              # Vite bundler config
├── 🎨 postcss.config.js           # Tailwind CSS processing
├── 🔒 .env                        # Environment variables (not committed)
│
├── src/
│   ├── App.tsx                    # 🧭 Root — all routing lives here
│   ├── main.tsx                   # 🚀 React entry point + AuthProvider
│   ├── index.css                  # 🎨 Global styles, fonts, animations
│   │
│   ├── pages/                     # 📄 Full-page route components
│   │   ├── Home.tsx               #    Landing page
│   │   ├── Dashboard.tsx          #    User dashboard (protected)
│   │   ├── Perks.tsx              #    Student discounts catalog
│   │   ├── AITools.tsx            #    AI tools directory
│   │   ├── MapPage.tsx            #    Interactive deals map
│   │   ├── EventsLanding.tsx      #    Events discovery
│   │   ├── CollegePortal.tsx      #    College registration
│   │   ├── VendorLanding.tsx      #    Vendor/partner portal
│   │   └── ...                    #    Auth pages, Profile, Courses, etc.
│   │
│   ├── components/                # 🧩 54 reusable UI components
│   │   ├── Header.tsx             #    Site-wide navigation bar
│   │   ├── Footer.tsx             #    Site-wide footer
│   │   ├── Hero.tsx               #    Landing page hero section
│   │   ├── ui/                    #    shadcn/ui primitives (Button, Dialog, etc.)
│   │   ├── map/                   #    Map canvas, controls, info cards
│   │   ├── dashboard/             #    Dashboard cards & stats
│   │   ├── college-portal/        #    Registration form, domain checker
│   │   ├── onboarding/            #    Multi-step new user onboarding
│   │   └── search/                #    Global search modal
│   │
│   ├── contexts/                  # 🔄 Global state
│   │   ├── AuthContext.tsx         #    User auth (login, logout, session)
│   │   └── SearchContext.tsx       #    Site-wide search state
│   │
│   ├── hooks/                     # 🪝 Custom React hooks
│   ├── services/                  # 📡 Appwrite API service layer
│   ├── utils/                     # 🔧 Helpers (CSV parser, search, etc.)
│   ├── types/                     # 📐 TypeScript type definitions
│   ├── data/                      # 📊 Static datasets
│   └── styles/                    # 🎨 CSS variables & theme tokens
│       └── globals.css            #    ← Change site colors here
│
├── api/
│   └── check-domain.js            # 🌐 College domain validation API
│
├── appwrite-functions/            # ☁️ Serverless backend functions
│   ├── sendVerificationCustom/    #    Sends branded verification email
│   ├── resendVerification/        #    Rate-limited email resend
│   ├── onUserUpdated/             #    Post-verification role assignment
│   ├── adminEndpoints/            #    Admin user management API
│   ├── sendgridWebhook/           #    Email bounce/unsubscribe handler
│   ├── subscribeNewsletter/       #    Newsletter subscription
│   └── shared/utils.js            #    Shared helper functions
│
├── scripts/                       # 🔨 Setup & maintenance scripts
│
└── public/assets/                 # 📁 Static data & images
    ├── Logos/                     #    38 brand logos
    ├── Colleges/                  #    Indian college CSV datasets
    ├── ai-tools-complete.csv      #    AI tools database
    └── student_events_*.csv       #    Events data
```

<br />

---

<br />

## 🗺️ Pages & Routes

| Route | Page | Protected? | What it shows |
|:--|:--|:--:|:--|
| `/` | Home | | Landing page with hero, features, testimonials, FAQ |
| `/perks` | Perks | | Browse & filter 35+ student discounts |
| `/tools` | AI Tools | | Searchable directory of AI tools |
| `/resources` | Resources | | Free learning materials & guides |
| `/courses` | Courses | | Course discovery with filtering |
| `/map` | Map | | Interactive Mapbox map of nearby deals |
| `/events` | Events | | Browse and discover campus events |
| `/events/register` | Event Register | | Submit a new event |
| `/events/dashboard` | Creator Dashboard | | Manage your created events |
| `/college-portal` | College Portal | | Register your institution |
| `/vendors` | Vendor Portal | | Partner/vendor application page |
| `/business-model` | Business Model | | Financial calculator for student startups |
| `/dashboard` | Dashboard | 🔒 | Personal saved items, stats, activity |
| `/profile` | Profile | 🔒 | Account settings & preferences |
| `/admin/events` | Admin Moderation | 🔒 | Approve or reject submitted events |
| `/login` | Login | | Email/password + Google OAuth |
| `/signup` | Sign Up | | Create account with college email |

<br />

---

<br />

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────┐
│  Student signs up with college email    │
└──────────────────┬──────────────────────┘
                   ▼
┌─────────────────────────────────────────┐
│  Verification email sent via SendGrid   │
│  (branded template with confirm link)   │
└──────────────────┬──────────────────────┘
                   ▼
┌─────────────────────────────────────────┐
│  Student clicks verification link       │
└──────────────────┬──────────────────────┘
                   ▼
┌─────────────────────────────────────────┐
│  Appwrite marks emailVerification=true  │
└──────────────────┬──────────────────────┘
                   ▼
┌─────────────────────────────────────────┐
│  onUserUpdated() cloud function fires:  │
│  ├── Validates college email domain     │
│  ├── Assigns "student" role             │
│  └── Creates audit log entry            │
└──────────────────┬──────────────────────┘
                   ▼
┌─────────────────────────────────────────┐
│  ✅ Student gets full platform access   │
└─────────────────────────────────────────┘
```

Login methods: **Google OAuth** and **Email + Password**. Protected routes redirect unauthenticated users to `/login`.

<br />

---

<br />

## ☁️ Appwrite Cloud Functions

Each function in `appwrite-functions/` is independently deployable:

| Function | Trigger | What it does |
|:--|:--|:--|
| `sendVerificationCustom` | HTTP | Sends branded verification email via SendGrid |
| `resendVerification` | HTTP | Rate-limited resend (max 3/hour) |
| `onUserUpdated` | Appwrite Event | Auto-assigns student role after email verification |
| `adminEndpoints` | HTTP | Admin APIs — user stats, role overrides, audit logs |
| `sendgridWebhook` | HTTP | Handles email bounces and unsubscribes from SendGrid |
| `subscribeNewsletter` | HTTP | Adds email to newsletter mailing list |

See [`appwrite-functions/DEPLOYMENT.md`](./appwrite-functions/DEPLOYMENT.md) for setup instructions.

<br />

---

<br />

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- An [Appwrite](https://appwrite.io) project (cloud or self-hosted)
- A [Mapbox](https://www.mapbox.com) access token
- A [SendGrid](https://sendgrid.com) API key
- (Optional) Google Analytics tracking ID

### Install & Run

```bash
# Clone the repo
git clone https://github.com/your-username/studentshub.git
cd studentshub

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your API keys (see below)

# Start the dev server
npm run dev
```

### Available Scripts

| Command | Description |
|:--|:--|
| `npm run dev` | Start frontend dev server |
| `npm run api` | Start the domain-check API server |
| `npm run dev:full` | Start both frontend + API together |
| `npm run build` | Production build → `build/` |

<br />

---

<br />

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
# Appwrite
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT=your_project_id
VITE_APPWRITE_DATABASE_ID=studentperks_db
VITE_APPWRITE_COLLECTION_USERS=users
VITE_APPWRITE_BUCKET_PROFILE_PICTURES=profile_pictures

# Mapbox
VITE_MAPBOX_TOKEN=pk.your_mapbox_token

# Google Analytics (optional)
VITE_GA_TRACKING_ID=G-XXXXXXXXXX

# Backend (for cloud functions)
SENDGRID_API_KEY=SG.your_sendgrid_key
APPWRITE_API_KEY=your_appwrite_server_key
```

> All client-side variables must be prefixed with `VITE_` to be accessible in Vite.

<br />

---

<br />

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feat/amazing-feature`
3. **Commit** with conventional commits: `git commit -m "feat: add amazing feature"`
4. **Push** and open a **Pull Request** against `main`

**Code style guidelines:**
- TypeScript strict mode — avoid `any`
- Components → `src/components/`, Pages → `src/pages/`
- Use the service layer in `src/services/` for all Appwrite calls
- Prefer Radix UI primitives from `src/components/ui/` for new UI
- Run `npm run build` before submitting PRs

<br />

---

<br />

<div align="center">

**Built with ❤️ for students, by  a student.**

</div>
