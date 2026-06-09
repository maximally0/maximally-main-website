# Maximally — Infrastructure for Serious Builders

The platform powering competitions, mentorship, and evaluation for the builder ecosystem.

**Live:** [maximally.org](https://maximally.org)  
**Stack:** React 18 + TypeScript + Vite 5 + Tailwind CSS (frontend) | Express 4 + Supabase PostgreSQL (backend) | Netlify (deployment)

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Frontend Pages](#frontend-pages)
- [Backend API Routes](#backend-api-routes)
- [Role System](#role-system)
- [Admin Panel](#admin-panel)
- [Mentorship System](#mentorship-system)
- [Judge Evaluation System](#judge-evaluation-system)
- [Resources / Content System](#resources--content-system)
- [Deployment](#deployment)
- [Design System](#design-system)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Vite + React)                  │
│  client/src/pages/     → Page components                 │
│  client/src/components/→ Shared UI components            │
│  client/src/lib/       → API clients, auth, utilities    │
│  client/src/hooks/     → React Query hooks               │
│  client/src/contexts/  → Auth context provider           │
└────────────────────────────┬────────────────────────────┘
                             │ HTTP (fetch)
┌────────────────────────────▼────────────────────────────┐
│                   SERVER (Express 4)                      │
│  server/index.ts         → Entry point                   │
│  server/routes.ts        → Route registration            │
│  server/routes/          → 27+ route modules             │
│  server/middleware/      → Auth + role middleware         │
│  server/services/        → Email, scheduled tasks        │
│  server/db.ts            → Supabase client (service key) │
└────────────────────────────┬────────────────────────────┘
                             │ Supabase JS Client
┌────────────────────────────▼────────────────────────────┐
│              SUPABASE (PostgreSQL + Auth)                 │
│  20+ tables (profiles, mentors, judges, hackathons...)   │
│  Auth (email/password + OAuth)                           │
│  Storage (avatars, uploads)                              │
└─────────────────────────────────────────────────────────┘
```

**Dual deployment:**
- **Dev:** Express serves both API + Vite dev server on port 5000
- **Prod:** Client → Netlify CDN static | API → Netlify Functions (`netlify/functions/api.ts`)

---

## Getting Started

```bash
# 1. Clone
git clone https://github.com/maximally0/maximally-main-website.git
cd maximally-main-website

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Fill in your Supabase credentials (see Environment Variables below)

# 4. Set up database
# Run supabase-schema.sql in your Supabase SQL Editor
# Or use the Supabase MCP server to apply migrations

# 5. Run dev server
npm run dev
# → http://localhost:5000
```

---

## Environment Variables

| Variable | Where | Description |
|----------|-------|-------------|
| `VITE_SUPABASE_URL` | Client | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Client | Supabase anon/public key |
| `SUPABASE_URL` | Server | Same as above |
| `SUPABASE_ANON_KEY` | Server | Same as above |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | Service role key (full DB access) |
| `NODE_ENV` | Server | `development` or `production` |
| `SKIP_EMAIL_OTP` | Server | Set `true` to bypass email verification in dev |
| `RESEND_API_KEY` | Server | For sending emails (optional) |
| `FROM_EMAIL` | Server | Sender email address |
| `VITE_ADMIN_PANEL_URL` | Client | External admin panel URL (optional) |

---

## Database Schema

**20+ tables in Supabase PostgreSQL:**

### Core
| Table | Purpose |
|-------|---------|
| `profiles` | User profiles (extends auth.users) — username, role, bio, avatar |
| `admin_roles` | Separate admin role assignments |
| `role_audit_logs` | Audit trail for role changes |

### Competitions
| Table | Purpose |
|-------|---------|
| `organizer_hackathons` | Hackathon/competition definitions |
| `hackathon_registrations` | Participant registrations |
| `hackathon_submissions` | Project submissions |
| `certificates` | Generated certificates |

### Mentorship
| Table | Purpose |
|-------|---------|
| `mentors` | Mentor profiles (skills, availability, hours, status) |
| `mentorship_sessions` | Help request sessions (pending → active → completed) |
| `mentor_help_request_inbox` | In-app notifications for mentors |

### Judging
| Table | Purpose |
|-------|---------|
| `judges` | Judge profiles (expertise, tier, history) |
| `judge_events` | Judging history entries |
| `judge_evaluations` | Evaluation assignments + scores |
| `judge_requests` | Organizer ↔ judge invitations |

### Content
| Table | Purpose |
|-------|---------|
| `blogs` | Blog posts |
| `podcasts` | Podcast episodes |
| `interviews` | Interview entries |
| `builder_stories` | Builder story profiles |
| `newsletter_subscribers` | Email subscribers |

### Auth trigger
A `handle_new_user()` trigger auto-creates a profile row when a user signs up.  
A `create_user_profile()` function is called by the signup API as a fallback.

---

## Frontend Pages

### Public Pages
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Index.tsx` | Landing page (hero, events, council, infrastructure, CTA) |
| `/events` | `Events.tsx` | Browse all hackathons |
| `/hackathon/:slug` | `PublicHackathon.tsx` | Individual hackathon page |
| `/platform` | `Platform.tsx` | Platform infrastructure overview |
| `/host-hackathon` | `HostHackathon.tsx` | Competition hosting landing page |
| `/network` | `Network.tsx` | Network overview (council + community) |
| `/senior-council` | `SeniorCouncil.tsx` | Senior Council directory + criteria |
| `/mentors` | `MentorGallery.tsx` | Public mentor gallery with filters |
| `/mentors/:id` | `MentorPublicProfile.tsx` | Individual mentor profile |
| `/judges` | `JudgeGallery.tsx` | Public judge gallery |
| `/judges/:username` | `JudgePublicProfile.tsx` | Individual judge profile |
| `/blog` | `Blog.tsx` | Blog listing with categories |
| `/blog/:slug` | `BlogRouter.tsx` | Individual blog post |
| `/resources` | `Resources.tsx` | Resources hub |
| `/resources/podcasts` | `ResourcesPodcasts.tsx` | Podcast episodes |
| `/resources/interviews` | `ResourcesInterviews.tsx` | Interview entries |
| `/resources/stories` | `ResourcesStories.tsx` | Builder stories |
| `/contact` | `Contact.tsx` | Contact form |

### Auth Pages
| Route | Component |
|-------|-----------|
| `/login` | `Login.tsx` |
| `/forgot-password` | `ForgotPassword.tsx` |
| `/reset-password` | `ResetPassword.tsx` |
| `/auth/callback` | `AuthCallback.tsx` |

### Protected Pages (Role-Based)
| Route | Role Required | Description |
|-------|---------------|-------------|
| `/pokemon` | admin | Full admin CMS panel |
| `/mentor/dashboard` | mentor/admin | Mentor session management |
| `/judging/dashboard` | judge | Judge assignments + scoring |
| `/judging/evaluate/:id` | judge | Split-screen evaluation form |
| `/organizer/dashboard` | organizer/admin | Organizer hackathon management |
| `/create-hackathon` | organizer/admin | Create new hackathon |
| `/my-hackathons` | participant | Participant's registered events |
| `/my-mentor` | authenticated | View assigned mentor |

---

## Backend API Routes

### Auth
- `POST /api/auth/signup-direct` — Email/password signup
- `POST /api/auth/login` — Login
- `GET /api/auth/session` — Get current session

### Mentors (`server/routes/mentors.ts`)
- `GET /api/mentors` — Public gallery (filters: skill, status, availability)
- `GET /api/mentors/:id` — Public mentor profile
- `GET /api/mentors/current` — Authenticated mentor's data
- `PATCH /api/mentors/current/profile` — Update own profile
- `POST /api/mentors/:id/request` — Request mentorship session
- `POST /api/mentors/sessions/:id/accept` — Accept session
- `POST /api/mentors/sessions/:id/complete` — Complete session (increments hours)
- `POST /api/mentors/sessions/:id/cancel` — Cancel session

### Judges (`server/routes/judge-evaluations.ts`)
- `GET /api/judging/assignments` — Judge's assigned evaluations
- `POST /api/judging/evaluations/:id/save` — Save draft scores
- `POST /api/judging/evaluations/:id/submit` — Submit final evaluation

### Resources (`server/routes/resources.ts`)
- `GET /api/podcasts` — List published podcasts
- `POST /api/podcasts` — Create (admin)
- `PATCH /api/podcasts/:id` — Update (admin)
- `DELETE /api/podcasts/:id` — Delete (admin)
- `GET /api/interviews` — List published interviews
- `POST /api/interviews` — Create (admin)
- `PATCH /api/interviews/:id` — Update (admin)
- `DELETE /api/interviews/:id` — Delete (admin)
- `GET /api/builder-stories` — List published stories
- `POST /api/builder-stories` — Create (admin)
- `PATCH /api/builder-stories/:id` — Update (admin)
- `DELETE /api/builder-stories/:id` — Delete (admin)

### Roles (`server/routes/roles.ts`)
- `GET /api/roles/current` — Current user's role + permissions
- `POST /api/roles/assign` — Assign role (admin)
- `POST /api/roles/revoke` — Revoke role (admin)
- `POST /api/admin/users/:id/assign-role` — Admin role assignment
- `PATCH /api/admin/mentors/:id/toggle-active` — Toggle mentor active status
- `GET /api/admin/users` — List all users (admin)

### Blogs (`server/routes/blogs.ts`)
- `GET /api/blogs` — List published blogs
- `POST /api/blogs` — Create (admin)
- `PATCH /api/blogs/:id` — Update (admin)
- `DELETE /api/blogs/:id` — Delete (admin)

### Hackathons (`server/routes/core-routes.ts`)
- `GET /api/events` — List all events
- `GET /api/featured-hackathons` — Featured events for homepage
- `POST /api/hackathons` — Create hackathon (organizer)
- `GET /api/hackathon/:slug` — Public hackathon details

---

## Role System

### Roles
| Role | Access |
|------|--------|
| `participant` | Browse events, register, submit projects, request mentorship |
| `mentor` | Mentor dashboard, manage availability, accept sessions |
| `judge` | Judge dashboard, evaluate submissions, score projects |
| `organizer` | Create/manage hackathons, invite judges, view analytics |
| `admin` | Full platform access, manage roles, admin panel (`/pokemon`) |

### Admin Levels
| Level | Permissions |
|-------|-------------|
| `super_admin` | Everything (wildcard) |
| `admin` | Manage roles, users, hackathons, content, analytics |
| `moderator` | Moderate content, manage submissions, view reports |
| `viewer` | View analytics and reports only |

### How roles work
- Server: `server/middleware/roleAuth.ts` validates roles on protected endpoints
- Client: `WithRoleProtection` and `ProtectedRoute` components guard routes
- `client/src/lib/roleManager.ts` provides `useRole()` hook for permission checks

---

## Admin Panel

**Route:** `/pokemon` (hidden, not linked in navigation)  
**Access:** Admin role only

### Features
| Tab | What you can do |
|-----|-----------------|
| Blogs | Create, edit, delete blog posts |
| Podcasts | Manage podcast episodes |
| Interviews | Manage interview entries |
| Builder Stories | Manage builder story profiles |
| Hackathons | View/manage competition events |
| Users & Roles | See all users, change roles |

---

## Mentorship System

### Flow
1. Participant visits `/mentors` → browses mentor gallery
2. Clicks "Request Help" → fills problem description + team ID
3. Mentor receives notification (in-app inbox + optional email/Slack)
4. Mentor accepts → session becomes "active"
5. Mentor completes → `total_mentorship_hours` increments automatically
6. Participant can view their mentor at `/my-mentor`

### Mentor Dashboard (`/mentor/dashboard`)
- Overview stats (total hours, this month, pending, active)
- Sessions tab (accept/decline/complete)
- Availability tab (add/remove time slots, toggle status)
- Profile tab (edit bio, skills, booking URL)

---

## Judge Evaluation System

### Flow
1. Organizer assigns judge to hackathon submissions
2. Judge sees assignments on `/judging/dashboard` with traffic-light status
3. Judge clicks into `/judging/evaluate/:id` → split-screen view
4. Left: submission details (name, description, demo, repo, video links)
5. Right: scoring form (1-10 per rubric criterion + comments)
6. "Save Draft" persists progress, "Submit" finalizes evaluation

### Status System
- 🔴 Not Started — judge hasn't opened it
- 🟡 In Progress — draft saved
- 🟢 Submitted — final scores locked

---

## Resources / Content System

All content is stored in Supabase and managed via the admin panel or API.

| Content Type | API | Frontend |
|-------------|-----|----------|
| Blog posts | `/api/blogs` | `/blog` |
| Podcasts | `/api/podcasts` | `/resources/podcasts` |
| Interviews | `/api/interviews` | `/resources/interviews` |
| Builder Stories | `/api/builder-stories` | `/resources/stories` |

Each page fetches from the API on mount, supports category filtering and search.  
Empty states show gracefully when no content exists yet.

---

## Deployment

### Development
```bash
npm run dev  # Express + Vite on port 5000
```

### Production (Netlify)
```bash
npm run build  # Builds client (Vite) + server (esbuild)
```

- Client builds to `dist/public/` → served by Netlify CDN
- Server builds to `dist/index.js` → wrapped by `netlify/functions/api.ts`
- All `/api/*` requests route to the serverless function
- `netlify.toml` configures redirects and function settings

### Environment on Netlify
Set all env vars in Netlify Dashboard → Site Settings → Environment Variables.

---

## Design System

| Element | Value |
|---------|-------|
| Background | `bg-black` (#000) |
| Grid pattern | `rgba(255,255,255,0.02)` 60px grid |
| Accent | Orange (`orange-400` to `orange-600`) |
| Typography | `font-space` (Space Grotesk) |
| Cards | `bg-gray-900/40 border border-gray-800` |
| Hover | `hover:border-orange-500/25` + shadow |
| Buttons | Gradient `from-orange-600 to-orange-500` |
| Text hierarchy | White (h1-h3) → `gray-400` (body) → `gray-500` (meta) |

### Animation Libraries
- `framer-motion` — section reveals, hover effects, stagger animations
- `react-type-animation` — rotating text in heroes
- `react-fast-marquee` — scrolling credibility strips

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 5000) |
| `npm run build` | Build for production |
| `npm run check` | TypeScript type check |
| `npm run test` | Run tests (Vitest) |
| `npm run validate:routes` | Validate route registration |

---

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── pages/           # All page components
│   │   ├── components/      # Shared components
│   │   │   └── landing/     # Landing page sections
│   │   ├── contexts/        # React contexts (Auth)
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilities, API clients
│   │   └── App.tsx          # Router + providers
│   └── index.html
├── server/
│   ├── routes/              # 27+ route modules
│   ├── middleware/          # Auth + role middleware
│   ├── services/            # Email, scheduled tasks
│   ├── db.ts               # Supabase client
│   ├── routes.ts           # Route registration
│   └── index.ts            # Express entry point
├── netlify/
│   └── functions/api.ts    # Serverless wrapper
├── supabase-schema.sql     # Full database schema
├── .env                    # Environment variables (gitignored)
└── package.json
```

---

## Key Decisions

- **Supabase over raw Postgres** — auth, realtime, storage, and JS client out of the box
- **Express over Next.js** — existing codebase, simpler serverless deployment on Netlify
- **No ORM** — Supabase JS client provides the query builder directly
- **Role-based access** — single `role` column on profiles, middleware validates server-side
- **Hidden admin panel** — `/pokemon` route, no nav link, admin-only access
- **Dark theme** — consistent across all pages, orange accent, Space Grotesk font
- **Content from DB** — all resources (blogs, podcasts, interviews, stories) are dynamic, not hardcoded

---

## Contributing

1. Create a feature branch
2. Make changes
3. Run `npm run check` to verify types
4. Push and create a PR against `main`

Never push secrets or `.env` files. The `.gitignore` covers these.
