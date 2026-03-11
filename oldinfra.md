# Maximally Platform -- Infrastructure Audit and Migration Plan

Document Type: Architecture Audit and Migration Proposal (v2)
Date: March 11, 2026
Scope: Full codebase analysis, current infrastructure documentation, and migration plan to The Operating System for Competitions

---

## 1. Repository Overview

### What the System Is

Maximally is a hackathon management platform built for the Indian teen builder ecosystem. It allows organizers to create, publish, and manage hackathons, participants to register and submit projects, and judges to score submissions via tokenized links. The platform also hosts a blog, a judge directory, certificate generation, and basic analytics.

### What Problem It Solves

The platform solves the operational overhead of running online hackathons: event creation, participant registration, team formation, project submission, judge assignment, scoring, winner selection, certificate generation, and email notifications. It is currently scoped exclusively to hackathons.

### Current Product Scope

- Hackathon creation and lifecycle management (draft, pending_review, published, ended)
- Participant registration with custom questions
- Team formation with invite codes and email invitations
- Project submission with GitHub, demo URL, video, and file uploads
- Judge onboarding via applications and tokenized scoring links
- Winner selection and certificate generation
- Organizer dashboard with registration analytics
- Blog and newsletter system
- Basic content moderation and user banning
- Email notifications (Resend) for lifecycle events

### The Core Problem

The entire data model, API, UI, and business logic assume the event type is a hackathon. The table is called organizer_hackathons. The routes are /api/organizer/hackathons/:id. The state machine has three states: draft, live, ended. Every field on the creation form is hardcoded for hackathons.

The vision is to become The Operating System for Competitions -- generic infrastructure that supports hackathons, startup competitions, design contests, research conferences, innovation challenges, accelerator programs, and grant competitions. This requires a fundamental abstraction shift.

---

## 2. Current Architecture

### System Overview

```
Browser (React SPA)
    |
    +-- Supabase Auth (client-side, OAuth + email/password)
    |
    +-- Express API Server (port 5000)
            |
            +-- Route Modules (server/routes/*.ts)
            |       |
            |       +-- Supabase Admin Client (service-role key)
            |               |
            |               +-- Supabase PostgreSQL Database
            |
            +-- Email Service (Resend API)
            |       +-- Email Queue (in-memory, rate-limited)
            |
            +-- Storage Layer (server/storage.ts)
                    +-- SupabaseStorage (production)
                    +-- MemStorage (fallback/dev)
```

### Frontend Architecture

Framework: React 18 with TypeScript
Build Tool: Vite 5
Styling: Tailwind CSS 3 with tailwindcss-animate
UI Components: Radix UI primitives with shadcn/ui patterns
State Management: TanStack React Query for server state; React Context for auth state
Routing: React Router DOM v7
Animation: Framer Motion
Charts: Recharts
Forms: React Hook Form with Zod resolvers

The frontend is a single-page application served from client/src/. Path aliases: @/ maps to client/src/, @shared/ maps to shared/.

- client/src/pages/ -- 50+ page components (Index, Dashboard, EditHackathon, JudgeScoring, etc.)
- client/src/components/ -- 86+ reusable components across 4 subdirectories (judges/, landing/, organizers/, ui/)
- client/src/contexts/ -- AuthContext (Supabase auth wrapper)
- client/src/hooks/ -- 11 custom hooks (useApiHackathons, useJudgeMessages, useModeration, etc.)
- client/src/lib/ -- Utility modules (apiClient, supabaseClient, auth helpers, feature flags)
- client/src/data/ -- Static JSON data files (blogPosts, hackathons, partners, techEvents)

Critical frontend issue: No service layer. Components directly call fetch/Supabase inline. This makes API refactoring extremely expensive because every component is a coupling point.

### Backend Architecture

Runtime: Node.js 18 with Express 4
Language: TypeScript (compiled via tsx for dev, esbuild for production)
Database: PostgreSQL via Supabase (accessed through @supabase/supabase-js, not an ORM for most queries)
ORM (partial): Drizzle ORM is configured (drizzle.config.ts, shared/schema.ts) but production queries use the Supabase client directly. Drizzle schema serves primarily as type definitions and validation schemas.
Authentication: Supabase Auth (JWT bearer tokens verified server-side via supabaseAdmin.auth.getUser)
Email: Resend API with an in-memory email queue (rate-limited at ~1.67 emails/sec)
File Storage: Supabase Storage (avatars, uploads)
CAPTCHA: Google reCAPTCHA v3

Backend structure:

- server/index.ts -- Express app setup, CORS, security headers, Supabase admin client initialization
- server/routes.ts -- Main route registration file (imports all route modules, plus inline auth/OTP/profile routes)
- server/routes/ -- 27 route module files covering all API domains
- server/services/ -- Email service, email queue, scheduled tasks
- server/middleware/ -- Judge auth middleware, rate limiter
- server/utils/ -- Email templates
- server/storage.ts -- Storage interface with MemStorage and SupabaseStorage implementations

Critical backend issue: No domain-driven service layer. Business logic lives directly in route handlers. Route files are 500-1200 lines of mixed validation, authorization, business logic, and database queries. This makes it impossible to reuse logic across routes or test business rules independently.

### Deployment Architecture

Production Host: Netlify
Build Output: dist/public (Vite-built SPA)
Serverless Functions: netlify/functions/ -- Express API wrapped via serverless-http
API Routing: /api/* redirects to /.netlify/functions/:splat via netlify.toml
Development: Express serves both API and Vite dev server on port 5000
CI/CD: GitHub Actions for route validation on PRs; Netlify auto-deploys from main branch

Critical deployment issue: Routes must be registered in both server/routes.ts (local dev) and netlify/functions/api.ts (production). This dual-registration has already caused drift (backup files exist: api-old-backup.ts, api.ts.backup).

### Database (Supabase PostgreSQL)

Tables are created via SQL migrations in the Supabase SQL Editor. The Drizzle schema in shared/schema.ts defines TypeScript types for only 4 of 25+ tables. There is no single source of truth for the database schema.

Key database tables (inferred from code):

- profiles -- User profiles (id, username, full_name, avatar_url, bio, role)
- organizer_hackathons -- Hackathon definitions created by organizers
- organizer_profiles -- Extended organizer profile data (org name, tier, stats)
- hackathon_registrations -- Participant registrations
- hackathon_submissions -- Project submissions
- hackathon_judges -- Judges assigned to hackathons
- judge_scores -- Individual judge scores for submissions
- hackathon_teams -- Teams formed within hackathons
- hackathon_team_members -- Team membership records
- hackathon_tracks -- Competition tracks/categories
- hackathon_sponsors -- Sponsor information per hackathon
- hackathon_announcements -- Organizer announcements
- hackathon_organizers -- Co-organizer assignments with permissions
- hackathon_custom_questions -- Custom registration form questions
- hackathon_timeline -- Timeline/schedule entries
- judge_applications -- Judge application submissions
- judge_application_events -- Events listed in judge applications
- judges -- Approved judge directory entries
- judge_events -- Events associated with approved judges
- certificates -- Generated certificates
- blogs -- Blog posts
- newsletter_subscribers -- Newsletter email list
- gallery_projects -- Public project gallery entries

### Integrations

- Supabase Auth: Authentication (email/password, OAuth, OTP) via client-side SDK + server-side admin client
- Supabase Database: PostgreSQL via server-side admin client (service-role key)
- Supabase Storage: File uploads (avatars, documents)
- Resend: Transactional email via server-side API with in-memory queue
- Google reCAPTCHA v3: Bot protection on forms
- Devpost: External hackathon registration links (URL redirects only)

---

## 3. Current Feature Coverage

### 3.1 Hackathon Creation and Management

How it works: Organizers with the organizer role create hackathons via POST /api/organizer/hackathons. A hackathon starts as draft, can be submitted for review (pending_review), and is published by an admin (published). After the end date passes, it becomes ended.

Components: CreateHackathon, EditHackathon, UnifiedHackathonDashboard, OrganizerDashboard
Routes: server/routes/organizer.ts (CRUD), server/routes/admin-hackathons.ts (admin review/publish)
Logic: shared/hackathonState.ts (state machine: draft/live/ended), shared/dateValidation.ts

Capabilities:
- Create hackathon with name, slug, dates, format (online/offline/hybrid)
- Edit all fields including after publication (no approval workflow needed)
- Request publication (admin review required)
- Delete hackathons (blocked if registrations or submissions exist)
- Co-organizer management with role-based permissions
- Tracks/categories configuration
- Sponsor management
- Custom registration questions
- Timeline/schedule management
- Announcements to participants
- Cover image and gallery images

### 3.2 Participant Registration

How it works: Authenticated users register for published hackathons. Registration captures user details, custom question responses, and assigns a status.

Components: HackathonRegistration, HackathonRegistrations (organizer view), RegistrationAnalytics
Routes: server/routes/hackathon-registration.ts

Capabilities:
- Register with profile data and custom question responses
- Registration status management (confirmed, checked_in, rejected)
- Bulk status updates by organizers
- Registration analytics (counts, trends)
- Registration milestone emails (at 10, 25, 50, 100, etc.)

### 3.3 Team Formation

How it works: Registered participants create teams with a leader, unique team code, and configurable size limits. Members join via invite email or team code.

Components: TeamManagement, TeamModal, JoinTeam, TeamTasks, SuggestedTeammates
Routes: Team endpoints within hackathon-features and organizer-advanced routes
Logic: shared/teamValidation.ts (creation, join, leave, disband, leadership transfer, size limits)

Capabilities:
- Create teams, invite via email, join via team code
- Leader can remove members and transfer leadership
- Team task management
- Team size enforcement (min/max from hackathon config)

### 3.4 Project Submission

How it works: Participants submit projects during the submission window (between start_date and end_date). Submissions include project name, description, demo URL, GitHub repo, video URL, and optional file uploads.

Components: ProjectSubmission, HackathonSubmit, SubmissionDetail, SubmissionMilestones, SubmissionComments
Routes: Submission endpoints within hackathon-features routes
Logic: shared/submissionValidation.ts (URL validation, timing, file uploads, team permissions)

Capabilities:
- Submit projects with metadata (name, description, links)
- File uploads via Supabase Storage
- Track assignment, update before deadline, versioning
- Submission comments, milestones, video pitch support
- Submission moderation (admin review)

Critical limitation: Submission fields are hardcoded. There is no way for an organizer to define what a submission should contain.

### 3.5 Judging and Scoring

How it works: Organizers invite judges who receive unique tokenized links via email. Judges access submissions through this link without needing a platform account. They score on a numeric scale with optional notes.

Components: JudgeScoreForm, JudgeSubmissionCard, JudgeScoring, JudgeSubmissions, JudgeDashboard, JudgeProgressManager
Routes: server/routes/judge-scoring.ts, server/routes/judging.ts, server/routes/judge-invitations.ts, server/routes/judge-reminders.ts
Middleware: server/middleware/judgeAuth.ts (token-based auth)
Logic: shared/judgeScoreValidation.ts (score validation, criterion validation, normalization)

Capabilities:
- Invite judges via email with tokenized links
- Token-based judge authentication (no account required)
- Score submissions with numeric scores and notes
- Score validation, judge progress tracking, reminder emails

Critical limitation: Single numeric score per submission per judge. No rubric enforcement. No judge-track assignment. No conflict-of-interest rules. No multi-round judging.

### 3.6 Winner Selection and Certificates

How it works: Organizers manually select winners. The platform generates certificates with unique IDs (CERT-XXXXXX). Certificates can be verified via a public page.

Components: WinnerManagement, WinnersManager, CertificateGenerator, CertificateVerification
Routes: server/routes/certificates.ts

Capabilities:
- Select winners by position (1st, 2nd, 3rd, honorable mention)
- Generate certificates (participation, winner, judge, mentor types)
- Public certificate verification, email delivery, revocation

### 3.7 Judge Directory

How it works: Judges apply to join the platform directory. Admin reviews. Approved judges get public profiles with expertise, stats, and event history. Tiers: starter, verified, senior, chief, legacy.

Components: JudgeProfile, RequestToJudge
Routes: server/routes/judge-profile.ts, server/routes/simplified-judges.ts
Schema: judges and judge_events tables in shared/schema.ts

### 3.8 Organizer Features

How it works: Users apply to become organizers. Admins approve and set role to organizer. Organizers get a dashboard with hackathons, analytics, and management tools.

Components: OrganizerDashboard, OrganizerProfile, OrganizerApplicationForm, OrganizerInsights, MultiOrganizerManager
Routes: server/routes/organizer.ts, server/routes/organizer-advanced.ts, server/routes/organizer-applications.ts, server/routes/organizer-messages.ts

Capabilities:
- Organizer application and approval workflow
- Organizer profiles with organization details and tiers
- Co-organizer invitations with role-based permissions
- Organizer messaging/inbox
- Registration analytics, bulk management, announcement broadcasting

### 3.9 Email Notifications

Service: server/services/email.ts (25+ email functions), server/services/emailQueue.ts
Templates: server/utils/email-templates.ts

Email types: Welcome, OTP verification, registration confirmation, submission confirmation, deadline reminders (24h, 6h), hackathon starting soon (24h, 2h), winner notification, judge invitation/reminder/scoring link, team created/joined/invitation, co-organizer invitation, hackathon approved/rejected, registration milestones, results published, certificate delivery.

### 3.10 Other Features

- Blog: Static JSON + database-backed posts (server/routes/blogs.ts)
- Moderation: User banning, content moderation, admin review (server/routes/moderation.ts)
- Project Gallery: Public gallery of submitted projects (server/routes/gallery.ts)
- Newsletter: Signup and unsubscribe (server/routes/newsletter.ts)
- User Data Export: JSON export of all user data (/api/user/export-data)
- Account Deletion: Full account and data deletion (/api/account/delete)
- Platform Analytics: Public analytics page
- SEO: React Helmet, sitemap.xml, robots.txt
- Scheduled Tasks: Auto-publish galleries, deadline reminders, data cleanup (Netlify scheduled functions)

---

## 4. Current Data Model

### Entity Relationship Summary

```
User (profiles)
  |-- 1:N --> OrganizerProfile
  |-- 1:N --> HackathonRegistration
  |-- 1:N --> HackathonSubmission
  |-- 1:N --> TeamMembership
  |-- 1:N --> Certificate

OrganizerHackathon
  |-- N:1 --> User (organizer_id)
  |-- 1:N --> HackathonRegistration
  |-- 1:N --> HackathonSubmission
  |-- 1:N --> HackathonJudge
  |-- 1:N --> HackathonTeam
  |-- 1:N --> HackathonTrack
  |-- 1:N --> HackathonSponsor
  |-- 1:N --> HackathonAnnouncement
  |-- 1:N --> HackathonOrganizer (co-organizers)
  |-- 1:N --> Certificate
  |-- 1:N --> JudgeScore

HackathonJudge
  |-- N:1 --> OrganizerHackathon
  |-- 1:N --> JudgeScore

HackathonSubmission
  |-- N:1 --> OrganizerHackathon
  |-- N:1 --> User
  |-- N:1 --> HackathonTeam (optional)
  |-- 1:N --> JudgeScore

HackathonTeam
  |-- N:1 --> OrganizerHackathon
  |-- 1:N --> TeamMember
  |-- 1:1 --> HackathonSubmission (optional)

Judge (directory)
  |-- 1:N --> JudgeEvent
```

### Key Entities

User (profiles table):
- id (UUID from Supabase Auth), username, full_name, email, avatar_url
- bio, location, skills (array)
- Social links (github, linkedin, twitter, website)
- role (user, organizer, admin)
- Moderation fields (is_banned, ban_reason)

OrganizerHackathon (organizer_hackathons table):
- id (serial), organizer_id (UUID), organizer_email
- hackathon_name, slug (unique), tagline, description
- start_date, end_date, format (online/offline/hybrid), venue, duration
- registration_deadline, eligibility (array), team_size_min/max
- registration_fee, max_participants, expected_participants
- tracks (JSON string), open_innovation (boolean)
- total_prize_pool, prize_breakdown (JSON string), perks (array)
- judging_criteria (JSON string), judges_mentors (JSON string)
- Community links (discord, whatsapp, website, contact_email)
- key_rules, code_of_conduct
- cover_image, gallery_images (array), promo_video_link
- status (draft, pending_review, published, rejected, ended)
- Publishing workflow fields (publish_requested_at, reviewed_at, reviewed_by, rejection_reason)
- Analytics (views_count, registrations_count)
- Timestamps (created_at, updated_at)

HackathonSubmission (hackathon_submissions table):
- id, hackathon_id, user_id
- project_name, description, demo_url, github_repo, video_url
- track assignment, status (draft, submitted), timestamps

JudgeScore (judge_scores table):
- id, judge_id, hackathon_id, submission_id
- score (numeric), notes, scored_at

HackathonTeam (hackathon_teams table):
- id, hackathon_id, team_name, team_code (unique), team_leader_id

Certificate (certificates table):
- id, certificate_id (CERT-XXXXXX), participant_name, participant_email
- hackathon_name, type (participation, winner, judge, mentor), position
- status (active, revoked), pdf_url, jpg_url

Judge Directory (judges table, Drizzle-defined):
- id, username, full_name, email, headline, short_bio, location, current_role, company
- primary_expertise (array), secondary_expertise (array)
- Stats with verification flags
- tier (starter, verified, senior, chief, legacy)
- is_published, availability_status

---

## 5. Current Limitations

### 5.1 Hackathon-Specific Assumptions Baked Into Every Layer

The table is organizer_hackathons. The routes are /api/organizer/hackathons/:id. Every field is hackathon-specific. There is no concept of competition type or event template. Supporting startup competitions, design contests, or research conferences would require either duplicating the entire stack or performing a deep abstraction refactor.

### 5.2 No Stage/Pipeline Engine

Flat lifecycle: draft to published to ended. No concept of stages (application round, submission round, review round, finals). The submission window is simply between start_date and end_date. No way to define multi-stage pipelines where different actions are available at different stages, different deadlines apply, and participants advance or are eliminated.

### 5.3 Rigid Submission Model (No Artifact Abstraction)

Submissions are hardcoded to: project_name, description, demo_url, github_repo, video_url. There is no generic artifact concept. An organizer cannot define what a submission should contain. The submission form is identical for every hackathon. Non-hackathon competitions (pitch competitions, design contests, paper submissions) cannot define their own artifact requirements.

The correct abstraction is Artifact, not Submission. An artifact could be a project, pitch deck, research paper, design file, prototype, dataset, or essay. The universal model is: Competition -> Participant -> Artifact -> Evaluation.

### 5.4 Tracks Are Not First-Class Infrastructure

Tracks are stored as a JSON string on the hackathon record. They are not a separate entity with their own relationships. Judges cannot be assigned to tracks. Submissions reference tracks by name string, not by ID. Results cannot be calculated per-track. Tracks should be core infrastructure that integrates with artifacts, judges, scoring, and results.

### 5.5 Weak Judging Infrastructure

Single numeric score per submission per judge with optional notes. No rubric-based scoring. The judging_criteria field is stored but not enforced in the scoring interface. No judge-track assignment. No conflict-of-interest enforcement. No multi-round judging. No workload balancing.

### 5.6 No Results Engine

Winner selection is manual. No automated ranking from aggregate scores. No leaderboard generation. No public results pages auto-generated from judging data. The gap between judging complete and results published requires significant manual work.

### 5.7 Participant Model Limited to Individuals and Teams

No concept of registering as a startup, organization, or other entity type. The team model is flat (leader + members) with no role differentiation beyond leader/member.

### 5.8 No Audit Trail

No logging of important events: score changes, submission updates, hackathon approvals, result calculations. Only created_at and updated_at timestamps. Competition integrity cannot be verified.

### 5.9 Dual Deployment Architecture Creates Drift

Routes must be registered in both server/routes.ts (local dev) and netlify/functions/api.ts (production). Backup files already exist. Every new feature requires changes in two places.

### 5.10 In-Memory State in a Serverless Environment

Email queue, rate limiter buckets, and OTP store are all in-memory. In Netlify Functions, each invocation is a separate process. Rate limiting and email queuing are effectively non-functional in production.

### 5.11 No Competition Templates

Every hackathon is created from scratch. No templates for common competition types. Templates are the primary onboarding mechanism -- without them, organizers must manually configure stages, submission schemas, and judging criteria every time.

### 5.12 No Frontend Service Layer

Components directly call fetch/Supabase inline. No API abstraction. Refactoring the API requires touching dozens of components.

### 5.13 No Domain-Driven Backend Services

Business logic lives in route handlers (500-1200 line files mixing validation, auth, business logic, and database queries). No reusable service layer. Cannot test business rules independently.

### 5.14 Schema Defined in Two Places

Drizzle schema defines 4 of 25+ tables. The rest are only in Supabase, referenced by string name in code. No single source of truth.

### 5.15 No Revenue-Generating Competition Types

The platform only supports hackathons, which typically do not pay for infrastructure. The system does not support accelerators, innovation programs, grant competitions, or university competitions -- the competition types that actually pay for tooling.

---

## 6. Target Architecture: The Operating System for Competitions

### Vision

The platform must evolve from a hackathon-specific tool into generic competition infrastructure supporting the full lifecycle:

Competition Setup --> Participants --> Artifacts --> Evaluation --> Results

The universal data model is:

Competition -> Participant -> Artifact -> Evaluation

This model works for every competition type: hackathons, startup competitions, design contests, research conferences, innovation challenges, accelerator programs, and grant competitions.

### Product Experience Goal

The platform should feel like:

Create Competition --> Choose Template --> Configure Stages --> Launch

If launching a competition takes 10 minutes, the platform wins. Templates are the primary onboarding mechanism. Without simple setup, infrastructure products die regardless of how good the architecture is.

### 6.1 Clean Data Model (competitions, not patched organizer_hackathons)

The target is a clean table structure, not columns bolted onto organizer_hackathons:

```
competitions                  -- The event itself
competition_templates         -- Pre-configured competition types
competition_stages            -- Multi-stage pipeline
competition_tracks            -- First-class tracks/categories
competition_participants      -- Registered participants (any entity type)
participant_members           -- Team/startup/org members
competition_artifacts         -- What participants produce (not submissions)
evaluation_assignments        -- Judge-to-track/artifact assignments
evaluation_scores             -- Rubric-based scores
competition_results           -- Calculated rankings and outcomes
audit_log                     -- Event log for integrity
```

The organizer_hackathons table is migrated into competitions. Old data is preserved. A view provides backward compatibility during transition.

### 6.2 Competition Definition

competitions table:
- id (UUID), organizer_id (UUID), name, slug (unique), tagline, description, cover_image
- competition_type: hackathon, startup_competition, design_contest, research_conference, innovation_challenge, accelerator, grant_program, custom
- template_id (UUID, references competition_templates)
- start_date, end_date, timezone
- format: online, offline, hybrid. venue (text)
- participant_type: individual, team, startup, organization, mixed
- team_size_min, team_size_max, max_participants, registration_fee
- eligibility (JSONB)
- artifact_schema (JSONB) -- Organizer-defined artifact requirements. Example: [{"field": "pitch_deck", "type": "file", "required": true, "label": "Pitch Deck (PDF)", "accept": ".pdf"}, {"field": "demo_url", "type": "url", "required": false, "label": "Demo Link"}]
- judging_type: rubric, ranking, pass_fail, peer_review, custom
- judging_criteria (JSONB, structured and enforced) -- Example: [{"name": "Innovation", "weight": 30, "max_score": 10, "description": "How novel is the approach?"}, {"name": "Feasibility", "weight": 25, "max_score": 10}]
- total_prize_pool, prize_breakdown (JSONB), rules, code_of_conduct
- community_links (JSONB), website_url
- status: draft, pending_review, published, ended, archived
- views_count, registrations_count
- created_at, updated_at

The critical fields are:
- competition_type -- What kind of competition this is
- template_id -- Which template was used to create it
- artifact_schema -- What participants must produce (replaces hardcoded submission fields)
- judging_criteria -- Structured rubric enforced in the scoring UI
- participant_type -- What kind of entities participate

### 6.3 Competition Templates (Primary Onboarding Mechanism)

Templates are how organizers actually adopt the product. They are not a nice-to-have -- they are the product experience.

competition_templates table:
- id (UUID), name, description, icon, category (tech, business, design, research, general)
- default_stages (JSONB): Pre-configured stage pipeline
- default_artifact_schema (JSONB): Pre-configured artifact fields
- default_judging_criteria (JSONB): Pre-configured rubric
- default_participant_type
- is_system (boolean): System templates vs user-created
- created_at

Required system templates:

Hackathon:
- Stages: Registration (14d) -> Hacking (2d) -> Judging (3d) -> Results (1d)
- Artifacts: GitHub repo, demo URL, video, description
- Judging: Innovation (25%), Technical (25%), Design (25%), Impact (25%)
- Participant: Team

Startup Competition:
- Stages: Application (21d) -> Pitch Deck (14d) -> Screening (7d) -> Demo Day (1d) -> Finals (1d)
- Artifacts: Pitch deck PDF, demo link, business plan
- Judging: Market Opportunity (25%), Team (20%), Traction (20%), Innovation (20%), Scalability (15%)
- Participant: Startup

Design Contest:
- Stages: Registration (14d) -> Submission (21d) -> Review (7d) -> Exhibition (3d)
- Artifacts: Design files, case study, process documentation
- Judging: Aesthetics (25%), Usability (25%), Creativity (25%), Execution (25%)
- Participant: Individual

Research Conference:
- Stages: Abstract Submission (30d) -> Peer Review (21d) -> Acceptance (7d) -> Presentation (3d)
- Artifacts: Research paper PDF, abstract, dataset link
- Judging: Novelty (30%), Methodology (30%), Significance (25%), Clarity (15%)
- Participant: Individual

Innovation Challenge:
- Stages: Application (14d) -> Proposal (21d) -> Prototype (30d) -> Pitch (7d) -> Selection (3d)
- Artifacts: Proposal document, prototype demo, pitch video
- Judging: Feasibility (25%), Impact (25%), Scalability (25%), Innovation (25%)
- Participant: Mixed

Accelerator Program:
- Stages: Application (30d) -> Screening (14d) -> Interview (7d) -> Cohort Selection (3d)
- Artifacts: Application form, pitch deck, financial projections, team bios
- Judging: Team (30%), Market (25%), Product (25%), Traction (20%)
- Participant: Startup

Grant Program:
- Stages: Proposal Submission (45d) -> Review (30d) -> Shortlist (14d) -> Award (7d)
- Artifacts: Grant proposal, budget breakdown, impact assessment
- Judging: Impact (30%), Feasibility (25%), Budget Efficiency (25%), Innovation (20%)
- Participant: Organization

### 6.4 Workflow / Stage Engine

competition_stages table:
- id (UUID), competition_id (UUID), name, description
- stage_order (integer): 1, 2, 3, ...
- stage_type: registration, submission, review, presentation, selection, custom
- starts_at, ends_at (timestamps)
- who_can_act: participants, judges, organizers, public
- allowed_actions (JSONB): [submit, edit, score, vote, present]
- advancement_type: all, top_n, top_percent, manual, score_threshold
- advancement_threshold (JSONB): {"top_n": 10} or {"min_score": 7.0} or {"top_percent": 20}
- status: upcoming, active, completed
- created_at

Stage Engine is a backend service (server/services/stageEngine.ts) that:
1. Determines the current active stage based on timestamps
2. Enforces what actions are allowed in the current stage via middleware
3. Handles advancement between stages (which participants move forward)
4. Sends stage transition notifications

Stage-aware middleware (server/middleware/stageGuard.ts) wraps API endpoints to reject actions outside their allowed stage with clear error messages.

### 6.5 Competition Tracks (First-Class Infrastructure)

Tracks are not a JSON string on the competition. They are a separate entity with relationships.

competition_tracks table:
- id (UUID), competition_id (UUID)
- name, description, icon, color
- track_order (integer)
- max_artifacts (integer, optional) -- Cap artifacts per track
- judging_criteria_override (JSONB, optional) -- Track-specific rubric if different from competition default
- created_at

Track relationships:
- Artifacts reference a track_id (not a track name string)
- Judges are assigned to tracks via evaluation_assignments
- Results are calculated per-track
- Public result pages show per-track rankings

### 6.6 Participant Management Layer

competition_participants table:
- id (UUID), competition_id (UUID), user_id (UUID)
- participant_type: individual, team, startup, organization
- entity_name (text): Team name, startup name, org name
- entity_metadata (JSONB): Flexible metadata per type
- status: pending, approved, rejected, withdrawn, advanced, eliminated
- current_stage_id (UUID)
- advanced_stages (integer[]): Array of stage orders passed
- custom_responses (JSONB): Custom registration question answers
- tags (text[]): Organizer-defined tags
- registered_at, approved_at

participant_members table (for team/startup/org participants):
- id (UUID), participant_id (UUID), user_id (UUID)
- role: leader, member, mentor, advisor
- joined_at

### 6.7 Artifact System (Not Submissions)

The correct abstraction is Artifact, not Submission. An artifact is anything a participant produces for evaluation. It could be a project, pitch deck, research paper, design file, prototype, dataset, or essay.

competition_artifacts table:
- id (UUID), competition_id (UUID), participant_id (UUID)
- stage_id (UUID): Which stage this artifact belongs to
- track_id (UUID): Which track this artifact is in
- artifact_data (JSONB): Matches competition.artifact_schema. Example: {"pitch_deck": "https://storage.../deck.pdf", "demo_url": "https://...", "description": "Our startup..."}
- version (integer, default 1)
- previous_version_id (UUID): Link to previous version
- status: draft, submitted, under_review, accepted, rejected
- submitted_at
- created_at, updated_at

The artifact_data JSONB field stores key-value pairs matching the artifact_schema defined on the competition. The frontend dynamically renders the artifact form based on the schema. Validation is performed against the schema at submission time.

### 6.8 Evaluation Infrastructure

evaluation_assignments table:
- id (UUID), competition_id (UUID), stage_id (UUID), judge_id (UUID)
- track_id (UUID, optional): If assigned to a specific track
- participant_ids (UUID[], optional): If assigned to specific participants
- max_evaluations (integer), completed_evaluations (integer, default 0)
- excluded_participant_ids (UUID[], default {}): Conflict of interest
- created_at

evaluation_scores table:
- id (UUID), assignment_id (UUID), competition_id (UUID), stage_id (UUID)
- judge_id (UUID), artifact_id (UUID), participant_id (UUID)
- criterion_scores (JSONB): Matches competition.judging_criteria. Example: [{"criterion": "Innovation", "score": 8, "max": 10, "weight": 30}, {"criterion": "Feasibility", "score": 7, "max": 10, "weight": 25}]
- weighted_total (numeric, computed)
- notes (text), feedback_to_participant (text, optional public feedback)
- status: draft, submitted, finalized
- scored_at, created_at

Evaluation Engine capabilities:
- Rubric-based scoring with weighted criteria (enforced, not optional)
- Judge-track assignment (judges only see artifacts in their assigned track)
- Judge workload balancing (max evaluations per judge, even distribution)
- Conflict-of-interest exclusions
- Multi-round evaluation (different judges/criteria per stage)
- Score aggregation: average, weighted average, median (configurable)
- Anomaly detection (flag outlier scores)
- Ranking generation

### 6.9 Results Engine

competition_results table:
- id (UUID), competition_id (UUID), stage_id (UUID)
- track_id (UUID, optional): Per-track results
- result_type: ranking, winners, advancement
- rankings (JSONB): [{"rank": 1, "participant_id": "...", "score": 9.2, "position": "Winner"}, ...]
- calculation_method: weighted_average, median, manual
- calculated_at, published_at
- is_public (boolean, default false)
- created_at

Results Engine capabilities:
- Automatic ranking calculation from evaluation scores
- Per-track rankings
- Per-stage results (for multi-round competitions)
- Public results pages (auto-generated, SEO-friendly)
- Leaderboard views
- Downloadable reports (CSV, PDF)
- Winner, finalist, honorable mention designations

### 6.10 Organizer Dashboard (Mission Control)

Panels:
- Overview: Registration count, artifact count, judging progress, current stage
- Stage Pipeline: Visual pipeline showing all stages, current stage highlighted, advancement status
- Participants: Participant list with filters, bulk actions, export
- Artifacts: Artifact list with status, track, scores
- Judging: Judge assignments, progress per judge, score distribution
- Results: Rankings, winner selection, publish controls
- Communications: Announcement broadcasting, email history
- Settings: Competition configuration, track editor, artifact schema editor, judging criteria editor

### 6.11 Communication (Email Only)

Keep email-only notifications. Do NOT add chat, DMs, or social features.

Required notifications:
- Registration confirmation
- Stage transition notifications (Submission round is now open)
- Deadline reminders (configurable per stage)
- Judge assignment notifications
- Advancement/elimination notifications
- Results published notifications

### 6.12 Audit Trail

audit_log table:
- id (UUID), competition_id (UUID)
- actor_id (UUID), actor_type: organizer, judge, participant, admin, system
- action: artifact.created, score.submitted, result.calculated, participant.advanced, stage.transitioned
- entity_type: artifact, score, participant, competition, stage, track
- entity_id (UUID)
- details (JSONB): Old values, new values, context
- ip_address, created_at

Events to log: Artifact CRUD, score submission/update, result calculation/publication, participant status changes, competition status changes, stage transitions, judge assignment/removal, winner selection.

### 6.13 Data Export

Organizer export endpoints:
- GET /api/competitions/:id/export/participants -- CSV (name, email, team, status, registration date, custom responses)
- GET /api/competitions/:id/export/artifacts -- CSV + artifact links (project details, track, submission date)
- GET /api/competitions/:id/export/scores -- CSV (artifact, judge, criterion scores, weighted total, notes)
- GET /api/competitions/:id/export/results -- CSV (rankings, scores, positions, track results)

### 6.14 Public Pages

Auto-generated public pages per competition:
- /competition/:slug -- Competition landing page
- /competition/:slug/results -- Overall results with rankings
- /competition/:slug/results/:track -- Per-track results
- /competition/:slug/leaderboard -- Live leaderboard (if enabled)
- /competition/:slug/gallery -- Public artifact gallery

SEO-friendly, shareable, embeddable.

### 6.15 Payments Layer (Future)

Not required for initial migration. When implemented:
- competition_payments table with type (registration_fee, sponsorship, prize_distribution), amount, currency, status, payment_provider, payment_reference

---

## 7. Domain-Driven Backend Services

The backend must evolve from route-handler-as-business-logic to a proper domain-driven service layer. Each service owns its domain logic and is independently testable.

```
server/services/
    competitionService.ts    -- Competition CRUD, status transitions, template application
    stageEngine.ts           -- Stage lifecycle, action enforcement, advancement
    trackService.ts          -- Track CRUD, track-artifact-judge relationships
    participantService.ts    -- Registration, approval, entity management, advancement tracking
    artifactService.ts       -- Artifact CRUD, schema validation, versioning, deadline enforcement
    evaluationEngine.ts      -- Judge assignment, rubric scoring, aggregation, anomaly detection
    resultsEngine.ts         -- Ranking calculation, result publication, leaderboard generation
    auditService.ts          -- Event logging, audit trail queries
    exportService.ts         -- CSV/PDF generation for all export types
    emailService.ts          -- (exists) Email sending with queue
    templateService.ts       -- Template CRUD, template application to new competitions
```

Route handlers become thin: parse request, call service, return response. All business logic, validation, and database queries live in services.

This enables:
- Independent unit testing of business rules
- Reuse across routes (e.g., stageEngine used by artifact, evaluation, and participant routes)
- Clear ownership of domain logic
- Easier refactoring when APIs change

---

## 8. Detailed Migration Plan

The migration is incremental, safe, and realistic for a production codebase with active users. Each phase deploys independently. No phase breaks existing functionality.

### Phase 0: Foundation Cleanup (Week 1-2)

Goal: Fix architectural debt before building new features.

0.1 Unify the deployment model:
- Consolidate all routes into the Netlify function (netlify/functions/api.ts)
- server/routes.ts becomes a dev-mode proxy that imports from the same route modules
- Eliminate the dual-registration problem
- One source of truth for all API routes

0.2 Establish a single schema source of truth:
- Extend shared/schema.ts to define ALL 25+ tables using Drizzle
- Use drizzle-kit generate for migration management
- This does NOT change the database -- it documents what already exists

0.3 Create a frontend API service layer:
- Create client/src/services/ directory
- Extract all inline fetch calls into service modules: competitionService.ts, registrationService.ts, artifactService.ts, judgingService.ts, teamService.ts, authService.ts
- Components call service functions instead of raw fetch
- Single point of change when APIs evolve

0.4 Move in-memory state to persistent storage:
- Replace in-memory OTP store with a Supabase table (otp_codes)
- Replace in-memory rate limiter with Supabase or Redis
- Email queue can remain in-memory (processes within single invocation)

0.5 Create backend service layer skeleton:
- Create server/services/ modules for each domain (competition, stage, track, participant, artifact, evaluation, results, audit)
- Start by extracting existing business logic from route handlers into services
- Route handlers become thin wrappers

### Phase 1: Generalize the Competition Model (Week 3-5)

Goal: Migrate from organizer_hackathons to competitions without breaking existing hackathons.

1.1 Database migration:
- Create the competitions table with all fields from Section 6.2
- Migrate all data from organizer_hackathons into competitions (one-time migration script)
- Create a view: CREATE VIEW organizer_hackathons AS SELECT * FROM competitions (backward compatibility)
- Add competition_type (default hackathon), template_id, participant_type (default team), artifact_schema (default hackathon fields), judging_type (default rubric), timezone

1.2 Create competition_tracks table:
- Migrate existing tracks JSON strings into proper competition_tracks rows
- Update all track references to use track_id instead of track name strings

1.3 API layer:
- Create server/routes/competitions.ts with new /api/competitions/* endpoints
- Old /api/organizer/hackathons/* routes continue to work via the view
- Both route sets use competitionService.ts

1.4 Frontend -- Dynamic artifact form:
- Create DynamicArtifactForm component that reads artifact_schema from the competition
- Renders form fields dynamically (text, textarea, url, file, select)
- Validates against the schema
- For existing hackathons, the default schema produces the same form as before

1.5 Create competition_templates table:
- Seed with 7 system templates (Hackathon, Startup Competition, Design Contest, Research Conference, Innovation Challenge, Accelerator, Grant Program)
- Create template selection UI in competition creation flow
- When a template is selected, pre-populate stages, artifact schema, judging criteria, and participant type

### Phase 2: Stage Engine (Week 6-8)

Goal: Add multi-stage pipeline support.

2.1 Create competition_stages table (schema from Section 6.4)
- Migration creates default stages for all existing competitions:
  - Stage 1: Registration (start_date - 14 days to start_date)
  - Stage 2: Building/Submission (start_date to end_date)
  - Stage 3: Judging (end_date to end_date + 3 days)

2.2 Build stageEngine service:
- getCurrentStage(competitionId) -- Active stage based on timestamps
- getStageActions(stageId, actorType) -- Allowed actions
- canPerformAction(competitionId, actorType, action) -- Boolean check
- advanceParticipants(stageId, method, threshold) -- Move participants to next stage
- transitionStage(stageId) -- Mark stage as completed, activate next

2.3 Stage-aware middleware (server/middleware/stageGuard.ts):
- Wraps API endpoints to check if the requested action is allowed in the current stage
- Returns 403 with clear message if action is not allowed

2.4 Stage pipeline UI:
- StagePipelineEditor component for organizers to define/edit stages
- StagePipelineView component showing current stage progress
- Integrate into organizer dashboard

2.5 Backward compatibility:
- Existing competitions get auto-generated stages
- Flat lifecycle (draft/live/ended) maps to stage progression
- Stage engine is opt-in: competitions without custom stages use default pipeline

### Phase 3: Artifact System and Evaluation Infrastructure (Week 9-12)

Goal: Replace hardcoded submissions with artifacts and flat scoring with rubric evaluation.

3.1 Create competition_artifacts table (schema from Section 6.7):
- Migrate existing hackathon_submissions data into competition_artifacts
- artifact_data populated from existing project_name, description, demo_url, github_repo, video_url fields
- Old hackathon_submissions table kept as view for backward compatibility

3.2 Create evaluation tables (evaluation_assignments, evaluation_scores from Section 6.8):
- Migrate existing judge_scores into evaluation_scores with single criterion

3.3 Build artifactService:
- Create, update, submit artifacts
- Schema validation against competition.artifact_schema
- Version management
- Deadline enforcement via stageEngine

3.4 Build evaluationEngine:
- assignJudges(competitionId, stageId, trackId) -- Distribute artifacts evenly
- scoreArtifact(assignmentId, artifactId, criterionScores) -- Validate against rubric
- aggregateScores(competitionId, stageId, method) -- Calculate rankings
- getJudgeProgress(competitionId, judgeId) -- Completion stats
- detectAnomalies(competitionId) -- Flag outlier scores

3.5 Rubric scoring UI:
- RubricScoringForm component reads judging_criteria from competition
- One slider/input per criterion with name, description, weight, max score
- Calculates weighted total in real-time
- Replaces existing JudgeScoreForm

3.6 Judge assignment UI:
- JudgeAssignmentManager component for organizers
- Assign judges to tracks, set max evaluations, flag conflicts
- Visual workload distribution

### Phase 4: Results Engine and Public Pages (Week 13-14)

Goal: Automate result generation and create public pages.

4.1 Build resultsEngine:
- calculateResults(competitionId, stageId, trackId?) -- Generate rankings from scores
- publishResults(competitionId, stageId) -- Make results public
- generateLeaderboard(competitionId) -- Create leaderboard data

4.2 Create competition_results table (schema from Section 6.9)

4.3 Public result pages:
- /competition/:slug/results -- Overall results
- /competition/:slug/results/:track -- Per-track results
- /competition/:slug/leaderboard -- Live leaderboard
- /competition/:slug/gallery -- Public artifact gallery
- SEO-friendly with meta tags

4.4 Data export endpoints:
- GET /api/competitions/:id/export/participants -- CSV
- GET /api/competitions/:id/export/artifacts -- CSV + links
- GET /api/competitions/:id/export/scores -- CSV with criterion scores
- GET /api/competitions/:id/export/results -- CSV rankings

### Phase 5: Audit Trail and Participant Model Extension (Week 15-17)

Goal: Add audit logging and support diverse participant types.

5.1 Create audit_log table (schema from Section 6.12):
- Build auditService.ts with logEvent(event) function
- Instrument all key operations (artifact CRUD, scoring, results, status changes)
- Audit log viewer in organizer dashboard (read-only, filterable)

5.2 Extend participant model:
- Create competition_participants and participant_members tables (schema from Section 6.6)
- Migrate existing hackathon_registrations into competition_participants
- Dynamic registration forms based on competition.participant_type

5.3 Entity registration UI:
- For startup competitions: startup name, founding date, team members, pitch
- For organization competitions: org name, representative, org details
- Dynamic form rendering based on participant_type

### Migration Safety Rules

1. No table drops. Old tables become views pointing to new tables. Views are maintained until all code references are updated.
2. No column renames in production. Add new columns, backfill, update code, then deprecate old columns.
3. Feature flags. Each new capability is behind a feature flag (client/src/lib/featureFlags.ts already exists). New features disabled by default, enabled per-competition or globally.
4. API versioning. New endpoints use /api/v2/ prefix. Old endpoints continue to work with deprecation warnings.
5. Database migrations are idempotent. Every migration checks if the change already exists.
6. Rollback plan. Each phase includes rollback procedure (drop new tables, disable feature flags, revert to old endpoints).
7. Data migration scripts are reversible. Every migration script has a corresponding rollback script.

---

## 9. Business and Product Priorities

### Revenue-Generating Competition Types

Hackathons typically do not pay for infrastructure. The platform must secretly prioritize support for competition types that generate revenue:

- Accelerator programs (cohort selection, multi-month pipelines)
- Innovation programs (corporate-sponsored challenges)
- Grant competitions (government/foundation funded)
- University competitions (institutional budgets)
- Startup competitions (sponsor-funded, registration fees)

These competition types share the same infrastructure (stages, artifacts, evaluation, results) but have higher willingness to pay for tooling. The template system should make these competition types as easy to launch as a hackathon.

### Onboarding is the Product

The biggest risk is not architecture. It is whether organizers will actually use the system. Infrastructure products die if onboarding is hard, setup takes hours, or configuration is confusing.

The product experience must be:

1. Create Competition (name, dates)
2. Choose Template (Hackathon, Startup Competition, Design Contest, etc.)
3. Configure (stages, tracks, artifact requirements, judging criteria -- all pre-populated from template)
4. Launch

If this flow takes more than 10 minutes, the platform loses. Templates are not a feature -- they are the product.

### Template Quality Matters More Than Feature Count

A well-designed Startup Competition template that pre-configures 5 stages, a pitch deck artifact schema, a market/team/traction rubric, and startup participant type is worth more than 10 new features. Each template should be opinionated and complete -- an organizer should be able to launch with zero configuration changes.

---

## 10. Summary

### Current State

The Maximally platform is a functional hackathon management system with solid coverage of the core hackathon lifecycle: creation, registration, team formation, submission, judging, winner selection, and certificates. The codebase is well-structured with clear separation between frontend (React SPA), backend (Express API), and database (Supabase PostgreSQL).

The primary architectural limitation is that every layer assumes the event type is a hackathon. The data model, API routes, UI components, and business logic all use hackathon-specific terminology and structures.

### What Must Change

Six architectural additions are required:

1. A clean competitions table with configurable artifact schemas and judging criteria (not patches on organizer_hackathons)
2. A stage/pipeline engine for multi-round competitions
3. First-class tracks that integrate with artifacts, judges, scoring, and results
4. Rubric-based evaluation with judge-track assignment and workload balancing
5. An automated results engine with public result pages
6. An audit trail for competition integrity

Two product additions are critical:

7. Competition templates as the primary onboarding mechanism (7 system templates covering hackathons through grant programs)
8. A domain-driven backend service layer that makes the system maintainable as it grows

### Migration Approach

The migration is designed over 17 weeks in 6 phases, each deployable independently and backward compatible. Old tables become views. Old API endpoints continue to work. Feature flags control rollout. The plan prioritizes the competition model (Phase 1) and stage engine (Phase 2) as highest-impact, followed by the artifact system and evaluation infrastructure (Phase 3), and results automation (Phase 4).

### The Real Test

The platform succeeds if an organizer can go from zero to launched competition in 10 minutes by choosing a template and clicking Launch. Everything else is infrastructure in service of that experience.

---

End of document.
