# Maximally

**The world's most serious builder ecosystem.**

Maximally is a full-stack hackathon and builder ecosystem platform where extraordinary operators, builders, and innovators converge. It provides end-to-end infrastructure for running hackathons, managing judges, organizing teams, and connecting serious builders with enterprise partners.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [Frontend Architecture](#frontend-architecture)
  - [Frontend Routes](#frontend-routes)
  - [Contexts & Providers](#contexts--providers)
  - [Custom Hooks](#custom-hooks)
  - [Component Library](#component-library)
- [Backend Architecture](#backend-architecture)
  - [API Endpoints](#api-endpoints)
  - [Middleware](#middleware)
  - [Services](#services)
- [Database Schema](#database-schema)
- [Deployment](#deployment)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | TailwindCSS, Radix UI, shadcn/ui |
| Routing | React Router v7 |
| State/Data | TanStack Query, React Context |
| Validation | Zod |
| Backend | Express.js, TypeScript |
| Runtime | tsx (development), esbuild (production) |
| Database | Supabase (PostgreSQL) |
| ORM | Drizzle ORM |
| Auth | Supabase Auth (OTP-based email verification) |
| Email | Resend |
| Testing | Vitest, fast-check (property-based) |
| Fonts | Space Grotesk (body/headings), Press Start 2P (logo) |
| Accent Color | Orange (#f97316) |

---

## Project Structure

```
maximally/
├── client/                          # React frontend (Vite)
│   ├── src/
│   │   ├── api/                     # API client modules (judge/organizer messages)
│   │   ├── components/              # React components (85+)
│   │   │   ├── ui/                  # shadcn/ui primitives (55 components)
│   │   │   ├── judges/              # Judge-specific (JudgeCard, TierBadge, etc.)
│   │   │   ├── organizers/          # Organizer-specific (OrganizerCard, etc.)
│   │   │   └── landing/             # Landing page sections (19 components)
│   │   │       └── sections/        # Hero, Credibility, Explore, Partners, etc.
│   │   ├── contexts/                # React Context providers
│   │   ├── data/                    # Static/fallback JSON data
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── lib/                     # Utilities (supabase client, auth, query client)
│   │   ├── pages/                   # Page components (50+)
│   │   ├── styles/                  # CSS (blog enhancements, datepicker)
│   │   └── types/                   # TypeScript type definitions
│   └── public/                      # Static assets, favicons, docs mirror
│
├── server/                          # Express backend
│   ├── routes/                      # API route handlers (30 modules)
│   ├── services/                    # Business logic (email, queue, scheduled tasks)
│   ├── middleware/                   # Express middleware (auth, rate limiting)
│   ├── migrations/                  # Database migrations
│   ├── utils/                       # Email templates, helpers
│   ├── index.ts                     # Server entry point (port 5000)
│   ├── routes.ts                    # Route registration hub
│   ├── storage.ts                   # Storage abstraction layer
│   ├── supabase-storage.ts          # Supabase storage implementation
│   ├── auto-migrate.ts              # Auto-migration runner
│   ├── env-check.ts                 # Environment variable validation
│   └── vite.ts                      # Vite dev server integration
│
├── shared/                          # Shared between client and server
│   ├── schema.ts                    # Drizzle ORM schema definitions
│   ├── hackathonState.ts            # Hackathon state machine logic
│   ├── profileRole.ts              # User role definitions
│   ├── judgeToken.ts               # Judge token authentication logic
│   ├── emailValidation.ts          # Email validation (disposable domain checking)
│   ├── dateValidation.ts           # Date/time validation
│   ├── judgeScoreValidation.ts     # Judge scoring rules
│   ├── submissionValidation.ts     # Project submission validation
│   ├── teamValidation.ts           # Team formation rules
│   └── userDeletionValidation.ts   # Account deletion rules
│
├── netlify/functions/               # Serverless functions (Netlify deployment)
│   ├── api.ts                       # Main API handler (all /api routes)
│   ├── judges.ts                    # Judge application endpoint
│   ├── newsletter-cron.ts           # Newsletter scheduler
│   ├── scheduled-tasks.ts           # Background task runner
│   ├── scheduled-deadline-reminders.ts
│   └── scheduled-starting-soon.ts
│
├── docs/                            # Public-facing documentation
│   ├── api/                         # API docs (auth, endpoints)
│   ├── getting-started/             # Onboarding (intro, quick-start, profile setup)
│   ├── guides/                      # How-to guides (creating hackathons, teams)
│   ├── organizers/                  # Organizer docs (judging, scoring, participants)
│   ├── participants/                # Participant docs (events, submissions, teams)
│   ├── platform/                    # Platform overview, user roles
│   ├── community/                   # Discord, success stories
│   ├── help/                        # FAQ, contact
│   └── DESIGN_SYSTEM.md            # UI/UX guidelines
│
├── scripts/                         # Build and validation scripts
│   ├── validate-routes.ts           # Route existence validation
│   ├── validate-admin-routes.ts     # Admin route validation
│   ├── check-orphaned-routes.ts     # Find unused routes
│   └── copy-docs.js                 # Documentation sync
│
├── tests/                           # Test suite
│   └── edgeCases.test.ts            # Edge case tests
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── tailwind.config.ts
├── drizzle.config.ts
├── postcss.config.js
└── replit.md                        # Project summary and preferences
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project with the required tables
- A Resend account for transactional email

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

This starts the Express server with Vite dev middleware on port 5000. The single server serves both the API and the React frontend.

### Production Build

```bash
npm run build
npm run start
```

The build step compiles the React client with Vite and bundles the server with esbuild.

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with tsx (hot reload) on port 5000 |
| `npm run build` | Validate routes, build client (Vite) + server (esbuild) |
| `npm run build:client` | Build only the Vite frontend |
| `npm run build:server` | Build only the Express server |
| `npm run start` | Start production server from dist/ |
| `npm run check` | Run TypeScript type checking |
| `npm run validate:routes` | Validate all routes exist and are valid |
| `npm run validate:admin-routes` | Validate admin-specific routes |
| `npm run check:orphaned-routes` | Find routes with no references |
| `npm run db:push` | Push Drizzle schema to database |
| `npm run test` | Run Vitest test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run copy-docs` | Sync docs/ to client/public/docs/ |

---

## Environment Variables

### Required (Client-Side)

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key |

### Required (Server-Side)

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (admin access) |
| `RESEND_API_KEY` | Resend email API key |
| `FROM_EMAIL` | Sender email address (e.g., `noreply@maximally.in`) |
| `PLATFORM_URL` | Public-facing platform URL |

### Optional

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Direct PostgreSQL connection string (for Drizzle) |
| `NODE_ENV` | `development` or `production` |
| `ADMIN_TOKEN` | Token for admin API endpoints |
| `RECAPTCHA_SECRET_KEY` | reCAPTCHA v3 server-side secret |

---

## Frontend Architecture

### Frontend Routes

**47 total routes** defined in `client/src/App.tsx`:

#### Public Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Index` | Landing page (hero, credibility, hackathons, explore, partners, newsletter) |
| `/about` | `About` | Positioning statement page (declaration, manifesto, three layers, the bar, founder) |
| `/explore` | `Explore` | Ecosystem discovery tiles |
| `/events` | `Events` | Hackathon and event listings |
| `/blog` | `Blog` | Supabase-powered blog listing |
| `/blog/:slug` | `BlogRouter` | Individual blog post |
| `/senior-council` | `SeniorCouncil` | Senior Council directory |
| `/mfhop` | `MFHOP` | Federation of Hackathon Organizers |
| `/partner` | `PartnerNetwork` | Partner With Us (hackathon services) |
| `/host-hackathon` | `HostHackathon` | Host a hackathon info page |
| `/become-a-supporter` | `BecomeASupporter` | Support the ecosystem |
| `/contact` | `Contact` | Contact form |
| `/analytics` | `PlatformAnalytics` | Public platform analytics |
| `/terms` | `Terms` | Terms of service |
| `/privacy` | `Privacy` | Privacy policy |
| `/thank-you` | `ThankYou` | Thank you confirmation |
| `/community` | `CommunityRedirect` | Redirects to Discord |

#### Authentication

| Route | Component | Description |
|-------|-----------|-------------|
| `/login` | `Login` | Email/password login |
| `/forgot-password` | `ForgotPassword` | Password reset request |
| `/reset-password` | `ResetPassword` | Password reset form |
| `/verify-email` | `VerifyEmail` | Email verification |
| `/test-email` | `TestEmailValidation` | Email validation testing |

#### User / Profile

| Route | Component | Description |
|-------|-----------|-------------|
| `/profile` | `MyProfileRedirect` | Redirect to own profile |
| `/profile/:username` | `Profile` | Public user profile |
| `/newsletter/unsubscribe` | `NewsletterUnsubscribe` | Unsubscribe from newsletter |

#### Hackathon Participation

| Route | Component | Description |
|-------|-----------|-------------|
| `/hackathon/:slug` | `PublicHackathon` | Public hackathon page |
| `/hackathon/:slug/submit` | `HackathonSubmit` | Project submission form |
| `/my-hackathons` | `ParticipantDashboard` | Participant dashboard |
| `/team/join/:token` | `JoinTeam` | Join team via invitation link |
| `/project/:projectId` | `ProjectDetail` | Project detail page |
| `/project/:source/:projectId` | `ProjectDetail` | Project detail (with source) |
| `/submissions/:slug` | `SubmissionDetail` | Submission detail page |
| `/certificates/verify/:certificate_id` | `CertificateVerification` | Certificate verification |

#### Organizer Dashboard

| Route | Component | Description |
|-------|-----------|-------------|
| `/create-hackathon` | `CreateHackathon` | Create new hackathon |
| `/organizer/dashboard` | `OrganizerDashboard` | Organizer overview |
| `/organizer/hackathons/:id` | `UnifiedHackathonDashboard` | Manage hackathon |
| `/organizer/hackathons/:hackathonId/manage` | `UnifiedHackathonDashboard` | Manage hackathon (alt) |
| `/organizer/apply` | `OrganizerApplicationForm` | Apply to become organizer |
| `/organizer/invite/:token` | `OrganizerInvite` | Accept organizer invitation |
| `/organizer/:username` | `OrganizerProfile` | Organizer public profile |
| `/organizer-inbox` | `OrganizerInbox` | Organizer messages |

#### Judge Interface

| Route | Component | Description |
|-------|-----------|-------------|
| `/judge-dashboard` | `JudgeDashboard` | Judge overview |
| `/judge-inbox` | `JudgeInbox` | Judge messages |
| `/judge/hackathons` | `JudgeHackathons` | Assigned hackathons |
| `/judge/hackathons/:hackathonId/submissions` | `JudgeSubmissions` | Submissions to judge |
| `/judge/:token` | `JudgeScoring` | Token-based scoring interface |

#### Catch-All

| Route | Component | Description |
|-------|-----------|-------------|
| `*` | `NotFound` | 404 page |

---

### Contexts & Providers

| Context | Hook | Description |
|---------|------|-------------|
| `AuthProvider` | `useAuth()` | User authentication, session, profile, moderation status. Supports email/password, Google, and GitHub auth. |
| `ThemeProvider` | `useTheme()` | Dark theme management (app defaults to dark). |
| `ConfirmContext` | — | Confirmation modal state for destructive actions. |

---

### Custom Hooks

| Hook | File | Description |
|------|------|-------------|
| `useAuth()` | `contexts/AuthContext.tsx` | Access user, session, profile, sign in/out methods, moderation status |
| `useBlogs(page, pageSize, search)` | `hooks/useBlog.ts` | Fetch paginated blog posts with search |
| `useBlog(slug)` | `hooks/useBlog.ts` | Fetch individual blog post by slug |
| `useModeration()` | `hooks/useModeration.ts` | Check moderation status: `canPost()`, `canParticipate()`, `canSubmit()`, `canJoinTeam()` |
| `useJudgeMessages(filters?)` | `hooks/useJudgeMessages.ts` | Judge inbox messages with filtering and pagination |
| `useJudgeUnreadCount(interval)` | `hooks/useJudgeMessages.ts` | Poll unread judge message count |
| `useOrganizerMessages(filters?)` | `hooks/useOrganizerMessages.ts` | Organizer messages with debounced search |
| `useOrganizerUnreadCount(interval)` | `hooks/useOrganizerMessages.ts` | Poll unread organizer message count |
| `useToast()` | `hooks/use-toast.ts` | Toast notification system |
| `useIsMobile()` | `hooks/use-mobile.tsx` | Mobile viewport detection (< 768px) |
| `useTouch()` | `hooks/use-touch.tsx` | Touch gesture / swipe detection |

---

### Component Library

**55 UI primitives** in `client/src/components/ui/` (shadcn/ui + Radix UI):

Accordion, Alert, AlertDialog, AspectRatio, Avatar, Badge, Breadcrumb, Button, Calendar, Card, Carousel, Chart, Checkbox, Collapsible, Command, ConfirmModal, ContextMenu, Dialog, Drawer, DropdownMenu, EmailInput, Form, HoverCard, Input, InputOTP, Label, Menubar, NavigationMenu, Pagination, PixelButton, PixelCard, PixelHeading, Popover, Progress, RadioGroup, Recaptcha, RecaptchaV3, Resizable, ScrollArea, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Sonner, Switch, Table, Tabs, Textarea, Toast, Toaster, Toggle, ToggleGroup, Tooltip

**85+ feature components** organized by domain:

- **Landing**: HeroSection, CredibilitySection, UpcomingHackathonsSection, SeniorCouncilSection, ExploreMaximallySection, ForOrganizersSection, PartnersSection, BlogFeedSection, PartnerLogoRow, DotNavigation, HackathonCard, ExploreCard, EventCard
- **Hackathon Management**: HackathonRegistration, HackathonDetailSheet, CollapsibleHackathonCard, HackathonAnnouncements, HackathonFeedback, HackathonSponsors, HackathonTracks, RecommendedHackathons
- **Judge**: JudgesManager, JudgeInvitations, JudgeProgressManager, JudgeScoreForm, JudgeSubmissionCard, JudgeCard, JudgeBadge, TierBadge, RequestToJudge
- **Teams**: TeamManagement, TeamModal, TeamTasks, SuggestedTeammates, JoinTeam
- **Projects**: ProjectSubmission, ProjectsGallery, ProjectDetail, SubmissionComments, SubmissionMilestones
- **Organizer**: OrganizerInsights, OrganizerFeedbackViewer, OrganizerInvitations, RegistrationAnalytics, MultiOrganizerManager, AnnouncementsManager, CustomQuestionsManager, TimelineManager, WinnersManager
- **Auth**: RequireAuth, ModerationGuard, PasswordSettings, UsernameSettings, OTPInput
- **Global**: SEO, Navbar, Footer, NewsletterSignup, CertificateGenerator, LoadingBar, SkeletonLoader

---

## Backend Architecture

The Express server runs on port 5000 and serves both the REST API (`/api/*`) and the React frontend (via Vite in dev, static files in production).

### Server Initialization Flow

1. Load environment variables (dotenv)
2. Initialize Express with CORS, security headers, request logging
3. Initialize Supabase admin client
4. Run auto-migrations (validate required tables)
5. Register all 30 route modules
6. Setup Vite (dev) or static file serving (production)
7. Listen on port 5000

---

### API Endpoints

**150+ endpoints** across 30 route modules. All routes are prefixed with `/api/` unless noted.

#### Authentication & Account

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup-request-otp` | Request OTP for signup |
| POST | `/api/auth/signup-verify-otp` | Verify OTP and create account |
| POST | `/api/auth/resend-otp` | Resend verification code |
| POST | `/api/auth/validate-email` | Validate email format and domain |
| GET | `/api/auth/check-password-status` | Check if user has password set |
| POST | `/api/auth/change-password` | Update password |
| POST | `/api/account/delete` | Delete account permanently |
| POST | `/api/admin/invite` | Send admin invitation |

#### User Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/profile/update` | Update profile (name, bio, socials, avatar) |
| GET | `/api/user/export-data` | Export user data as JSON |

#### System

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/notifications/unread-count` | Unread notification count |
| POST | `/api/verify-captcha` | Verify reCAPTCHA v3 token |

#### Organizer — Hackathon Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/organizer/hackathons` | Create hackathon (draft) |
| GET | `/api/organizer/hackathons` | List all owned/co-organized hackathons |
| GET | `/api/organizer/hackathons/:id` | Get hackathon details |
| PATCH | `/api/organizer/hackathons/:id` | Update hackathon |
| DELETE | `/api/organizer/hackathons/:id` | Delete hackathon |
| POST | `/api/organizer/hackathons/:id/request-publish` | Request publication review |
| POST | `/api/organizer/hackathons/:id/clone` | Clone hackathon |
| GET | `/api/organizer/hackathons/:id/winners` | Get winners |

#### Organizer — Analytics & Data

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/organizer/hackathons/:id/analytics` | Hackathon analytics |
| GET | `/api/organizer/hackathons/:id/registrations` | All registrations |
| GET | `/api/organizer/hackathons/:id/submissions` | All submissions |
| POST | `/api/organizer/hackathons/:id/export` | Export hackathon data |

#### Organizer — Announcements

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/organizer/hackathons/:id/announcements` | Get announcements |
| POST | `/api/organizer/hackathons/:id/announcements` | Create announcement |
| PUT | `/api/organizer/hackathons/:id/announcements/:aid` | Update announcement |
| DELETE | `/api/organizer/hackathons/:id/announcements/:aid` | Delete announcement |

#### Organizer — Judges

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/organizer/hackathons/:id/judges` | Get assigned judges |
| GET | `/api/organizer/hackathons/:id/judge-assignments` | Get judge assignments |
| GET | `/api/organizer/hackathons/:id/judge-requests` | Get judge requests |
| POST | `/api/organizer/hackathons/:id/invite-judge` | Invite judge |
| DELETE | `/api/organizer/hackathons/:id/judges/:aid` | Remove judge |
| GET | `/api/organizer/hackathons/:id/judging-progress` | Judging progress |
| GET | `/api/organizer/submissions/:sid/ratings` | Submission ratings |

#### Organizer — Certificates

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/organizer/hackathons/:id/certificates` | Get certificates |
| POST | `/api/organizer/hackathons/:id/certificates/generate` | Generate certificates |
| POST | `/api/organizer/hackathons/:id/certificates/check-existing` | Check existing |
| POST | `/api/organizer/certificates/:cid/send-email` | Send certificate email |
| POST | `/api/organizer/certificates/:cid/revoke` | Revoke certificate |

#### Organizer — Teams & Registrations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/organizer/hackathons/:id/teams` | Get all teams |
| GET | `/api/organizer/hackathons/:id/registrations/:rid/custom-answers` | Custom question answers |
| POST | `/api/organizer/registrations/:rid/check-in` | Check in participant |
| POST | `/api/organizer/registrations/:rid/notes` | Add registration notes |
| GET | `/api/organizer/registrations/:rid/notes` | Get registration notes |

#### Organizer — Tracks, Sponsors, Questions, Mentors

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/organizer/hackathons/:id/tracks` | Get tracks |
| GET | `/api/organizer/hackathons/:id/sponsors` | Get sponsors |
| GET | `/api/organizer/hackathons/:id/custom-questions` | Get custom questions |
| PUT | `/api/organizer/hackathons/:id/custom-questions` | Update custom questions |
| GET | `/api/organizer/hackathons/:id/mentors` | Get mentors |

#### Organizer — Messages

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/organizer/messages` | Get inbox messages |
| GET | `/api/organizer/messages/unread-count` | Unread count |
| POST | `/api/organizer/messages/:mid/read` | Mark as read |

#### Organizer — Profile & Applications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/organizer/profile` | Get own profile |
| GET | `/api/organizer/profile/:userId` | Get organizer profile |
| GET | `/api/organizer/my-profile` | Get authenticated profile |
| GET | `/api/organizer/:userId/hackathons` | Get user's hackathons |
| GET | `/api/organizer/applications` | Get applications |
| POST | `/api/organizer/apply` | Apply to become organizer |
| GET | `/api/organizer/invite/:token` | Get invite details |
| POST | `/api/organizer/invite/:token/accept` | Accept invitation |

#### Hackathon Registration

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/hackathons/:id/register` | Register for hackathon |
| DELETE | `/api/hackathons/:id/register` | Unregister |
| GET | `/api/hackathons/:id/my-registration` | Get own registration |
| GET | `/api/hackathons/:id/can-register` | Check registration open |
| GET | `/api/hackathons/:id/can-submit` | Check submission open |

#### Team Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/hackathons/:id/teams` | Create team |
| POST | `/api/teams/join/:token` | Join team via code |
| POST | `/api/teams/:tid/invite` | Invite member |
| DELETE | `/api/teams/:tid/members/:mid` | Remove member |
| POST | `/api/teams/:tid/leave` | Leave team |
| POST | `/api/teams/:tid/disband` | Disband team |
| POST | `/api/teams/:tid/tasks` | Create team task |

#### Public Hackathon

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hackathons/:slug` | Get hackathon by slug |
| GET | `/api/hackathons/by-id/:id` | Get hackathon by ID |
| GET | `/api/hackathons/id/:id` | Get hackathon by ID (alt) |
| GET | `/api/hackathons/:id/projects` | Get public projects |
| GET | `/api/hackathons/:id/winners` | Get winners |
| GET | `/api/hackathons/:id/announcements` | Get public announcements |
| GET | `/api/hackathons/:id/participant-announcements` | Participant announcements |
| GET | `/api/hackathons/:id/is-organizer` | Check organizer status |
| GET | `/api/hackathons/:id/judges` | Get judge list |

#### Submissions & Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hackathons/:id/my-submission` | Get own submission |
| GET | `/api/submissions/slug/:slug` | Get submission by slug |
| POST | `/api/submissions/:sid/upload-logo` | Upload project logo |
| DELETE | `/api/submissions/:sid/logo` | Delete project logo |
| POST | `/api/submissions/:sid/comments` | Add comment |
| GET | `/api/submissions/:sid/comments` | Get comments |
| POST | `/api/submissions/:sid/milestones` | Create milestone |
| DELETE | `/api/submissions/milestones/:mid` | Delete milestone |

#### Judge

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/judges` | Get all published judges |
| GET | `/api/judges/:username` | Get judge profile |
| POST | `/api/judges/apply` | Apply to become judge |
| GET | `/api/judge/profile` | Get authenticated judge profile |
| GET | `/api/judge/profile/:username` | Get judge profile by username |
| PUT | `/api/judge/profile` | Update judge profile |
| GET | `/api/judge/:token/info` | Get judge + hackathon info (token-based) |
| GET | `/api/judge/:token/submissions` | Get submissions to judge (token-based) |
| POST | `/api/judge/:token/score` | Submit score (token-based) |
| GET | `/api/judge/assigned-hackathons` | Get assigned hackathons |
| GET | `/api/judge/hackathons` | Get judge hackathons |
| GET | `/api/judge/hackathons/:id/submissions` | Get submissions for judging |
| POST | `/api/judge/submissions/:sid/rate` | Submit rating |
| GET | `/api/judge/requests` | Get judge requests |

#### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/judge-applications` | Get judge applications |
| POST | `/api/admin/judge-applications/:id/approve` | Approve judge |
| POST | `/api/admin/judge-applications/:id/reject` | Reject judge |
| POST | `/api/admin/judges/:id/promote` | Promote judge tier |
| POST | `/api/admin/judges/:id/calculate-tier` | Calculate tier |
| POST | `/api/admin/judges/calculate-all-tiers` | Calculate all tiers |
| GET | `/api/admin/organizer-applications` | Get organizer applications |
| POST | `/api/admin/organizer-applications/:id/approve` | Approve organizer |
| POST | `/api/admin/organizer-applications/:id/reject` | Reject organizer |
| DELETE | `/api/admin/organizer-applications/:id` | Delete application |
| GET | `/api/admin/hackathons` | Get all hackathons |
| GET | `/api/admin/hackathon-requests` | Get edit requests |
| DELETE | `/api/admin/hackathons/:id` | Delete hackathon |
| DELETE | `/api/admin/edit-requests/:id` | Delete edit request |

#### Moderation

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/moderation/report` | Report user/content |
| GET | `/api/moderation/status` | Get personal moderation status |
| GET | `/api/moderation/my-reports` | Get own reports |
| GET | `/api/moderation/health` | Moderation health check |
| GET | `/api/admin/moderation/reports` | Get all reports (admin) |
| GET | `/api/admin/moderation/stats` | Moderation stats (admin) |
| GET | `/api/admin/moderation/users` | Moderated users (admin) |
| GET | `/api/admin/moderation/users/:uid` | User moderation details (admin) |

#### Gallery

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/gallery/projects` | Get projects (paginated) |
| GET | `/gallery/projects/:id` | Get project details |
| POST | `/gallery/projects` | Create project |
| PUT | `/gallery/projects/:id` | Update project |
| DELETE | `/gallery/projects/:id` | Delete project |
| POST | `/gallery/projects/:id/like` | Like/unlike project |
| GET | `/gallery/my-projects` | Get own projects |
| GET | `/gallery/categories` | Get categories |
| GET | `/gallery/admin/projects` | Admin: all projects |
| POST | `/gallery/admin/projects/:id/moderate` | Admin: moderate project |
| GET | `/gallery/admin/stats` | Admin: gallery stats |

#### File Uploads

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/submissions/:sid/upload-logo` | Upload submission logo |
| POST | `/api/organizer/hackathons/:id/upload-logo` | Upload hackathon logo |
| POST | `/api/organizer/hackathons/:id/upload-image` | Upload hackathon image |
| DELETE | `/api/submissions/:sid/logo` | Delete submission logo |
| DELETE | `/api/organizer/hackathons/:id/logo` | Delete hackathon logo |

#### Blog & Content

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blogs` | Get all blogs (paginated) |
| GET | `/api/blogs/:slug` | Get blog post by slug |
| GET | `/api/featured-blogs` | Get featured blogs |
| GET | `/api/featured-hackathons` | Get featured hackathons |
| GET | `/api/events` | Get all events |

#### Newsletter

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/newsletter/subscribe` | Subscribe |
| POST | `/api/newsletter/unsubscribe` | Unsubscribe |
| POST | `/api/scheduler/deadline-reminders` | Trigger deadline reminders (cron) |
| POST | `/api/scheduler/starting-soon` | Trigger starting soon emails (cron) |

#### Feedback

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hackathons/:id/feedback-forms` | Get feedback forms |
| GET | `/api/hackathons/:id/feedback-forms/:fid/responses` | Get form responses |
| GET | `/api/hackathons/:id/participant-feedback` | Get feedback |
| GET | `/api/hackathons/:id/participant-feedback/all` | Get all feedback |
| GET | `/api/hackathons/:id/participant-feedback/my-feedback` | Get own feedback |

#### Custom Questions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hackathons/:id/custom-questions` | Get custom registration questions |

---

### Middleware

#### Judge Authentication (`server/middleware/judgeAuth.ts`)

Token-based authentication for judges — no login required. Judges receive unique scoring links with embedded tokens.

- Validates token format, expiration, and database existence
- Updates `last_accessed_at` on successful auth
- Used on all `/api/judge/:token/*` routes

#### Rate Limiter (`server/middleware/rateLimiter.ts`)

Token bucket algorithm (in-memory, serverless-compatible).

| Limiter | Limit | Window |
|---------|-------|--------|
| `otpRequest` | 5 requests | per hour per IP |
| `otpVerify` | 10 requests | per hour per IP |
| `emailValidate` | 20 requests | per minute per IP |
| `passwordChange` | 3 requests | per 5 minutes per user |
| `general` | 100 requests | per 15 minutes per IP |
| `registration` | 5 requests | per hour per IP |
| `submission` | 10 requests | per hour per user |

---

### Services

#### Email Service (`server/services/email.ts`)

Handles all transactional email via the Resend API. Contains 25+ email templates:

- Registration confirmation, submission confirmation, winner notification
- Deadline reminders, starting soon, hackathon ended
- Team creation, joined, invitation
- Judge invitation, scoring complete, judging complete
- Organizer promotion, co-organizer invitation
- Certificate delivery, OTP, welcome email
- Bulk email support

All templates use a consistent HTML design with the Maximally brand.

#### Email Queue (`server/services/emailQueue.ts`)

Rate-limited email queue to stay within Resend's API limits (2/sec).

- 600ms minimum gap between sends
- Priority queue (high/normal/low)
- Automatic retry (max 2 retries)
- Batch tracking for bulk operations
- Queue stats and monitoring

#### Scheduled Tasks (`server/services/scheduledTasks.ts`)

Background automation:

- **Auto-publish galleries**: Publishes hackathon project galleries after events end
- **Deadline reminders**: Sends 24-hour deadline reminder emails
- **Data cleanup**: Removes expired judge tokens, team invitations, and OTP codes

---

## Database Schema

The database runs on Supabase (PostgreSQL). There are **79 tables** total — 8 defined via Drizzle ORM, the rest managed directly in Supabase.

### Drizzle ORM Tables (`shared/schema.ts`)

| Table | Description |
|-------|-------------|
| `users` | User accounts (username, email, bio, skills, social links, avatar) |
| `user_hackathons` | User hackathon participation (status: registered/participated/completed) |
| `achievements` | User achievements and badges |
| `hackathons` | Hackathon listings (name, dates, status, prizes, tags) |
| `judges` | Judge profiles (expertise, tier, verification, credentials) |
| `judge_events` | Judge event history (event name, role, date, verification) |
| `organizer_hackathons` | Full hackathon management (slug, format, tracks, prizes, judging, status) |
| `organizer_profiles` | Organizer profiles (organization, verification, stats) |

### Key Supabase Tables

**Core:**
`profiles`, `users`, `signup_otps`

**Hackathon System:**
`organizer_hackathons`, `hackathon_registrations`, `hackathon_submissions`, `hackathon_teams`, `hackathon_judges`, `hackathon_organizers`, `hackathon_co_organizers`, `hackathon_announcements`, `hackathon_tracks`, `hackathon_sponsors`, `hackathon_winners`, `hackathon_mentors`, `hackathon_custom_questions`, `hackathon_custom_answers`, `hackathon_judging_criteria`, `hackathon_feedback_forms`, `hackathon_feedback_responses`, `hackathon_participant_feedback`

**Teams:**
`hackathon_team_tasks`, `hackathon_team_invitations`, `team_invitations`

**Registration:**
`hackathon_registration_analytics`, `hackathon_registration_notes`, `hackathon_registration_tags`, `hackathon_registration_tag_assignments`

**Submissions:**
`hackathon_submission_ratings`, `hackathon_submission_milestones`, `submissions`

**Judging:**
`judge_hackathon_assignments`, `judge_scoring_tokens`, `judge_scores`, `judge_hackathon_requests`, `judge_applications`, `judge_application_events`, `judge_invitations`, `judge_tokens`

**Gallery:**
`gallery_projects`, `gallery_project_likes`

**Organizer:**
`organizer_applications`, `organizer_profiles`, `organizer_messages`, `organizer_message_recipients`

**Newsletter:**
`newsletter_subscriptions`, `newsletter_emails`, `newsletter_schedule_settings`, `newsletter_send_logs`

**Moderation:**
`user_moderation_status`, `user_moderation_actions`, `user_reports`

**Certificates:**
`certificates`

**Content:**
`blogs`, `featured_blogs`, `featured_hackathons`, `doc_pages`, `doc_sections`

**Admin:**
`admin_roles`, `admin_activity_feed`, `audit_logs`

**Stats:**
`hackathon_experience_stats`, `hackathon_college_stats`

---

## Deployment

### Replit (Development)

The app runs on Replit with a single workflow:

```
npm run dev
```

This starts the Express server on port 5000, serving both the API and Vite-powered React frontend.

### Netlify (Production)

Production deployment uses Netlify with serverless functions:

- `netlify/functions/api.ts` — Main API handler (routes all `/api/*` requests)
- `netlify/functions/newsletter-cron.ts` — Scheduled newsletter processing
- `netlify/functions/scheduled-tasks.ts` — Background task runner
- `netlify/functions/scheduled-deadline-reminders.ts` — Deadline email automation
- `netlify/functions/scheduled-starting-soon.ts` — Starting soon notifications

The frontend is built with Vite (`npm run build:client`) and deployed as static files.

### Build Output

```
dist/
├── public/        # Vite-built React frontend
└── index.js       # esbuild-bundled Express server
```

---

## License

MIT
