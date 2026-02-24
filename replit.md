# Maximally - Builder Ecosystem Platform

## Overview
A full-stack hackathon/builder ecosystem platform ("Maximally") built with React (Vite) frontend and Express backend, using Supabase as the database/auth provider. The app serves both API and client from a single Express server on port 5000. Positioned as "the world's most serious builder ecosystem."

## Recent Changes
- 2026-02-24: Major codebase cleanup
  - Removed all teen/student/youth wording site-wide; replaced with builder/participant/creator language
  - Removed ~30 unused pages: old event pages (CodeHypothesis, Protocol404, ProjectCodeGen, PromptStorm, StealAThon, Codepocalypse, GrandTechAssembly, Hacktober, Makeathon), event reports (MakeathonReport, ShipathonReport), dead pages (People*, Gallery*, Docs*, Bootcamps, Allies, Careers, Sponsor, Partnership, Support, Resources, Judges, JudgeApplicationForm)
  - Removed all static blog posts (47 BlogPost + 17 blog files) - platform uses only Supabase-powered dynamic blogs now
  - Cleaned App.tsx: removed all commented-out imports/routes, dead routes, unused imports
  - Deleted unused components (MaximallyDocs, DocsRenderer)
- 2026-02-24: Comprehensive website redesign
  - New positioning: "The world's most serious builder ecosystem" (from youth-focused hackathon platform)
  - Visual: Space Grotesk font for body/headings, Press Start 2P pixel font for logo only
  - Visual: Single accent color (orange) replacing 4-color palette
  - Visual: Increased whitespace, removed decorative sparkles/icons
  - Navbar: Center links (Hackathons, Senior Council, Explore), dual CTAs (Join the Ecosystem + Partner With Us)
  - Hero: New headline, dual CTAs, stat strip
  - New Senior Council feature: Homepage teaser section + full standalone page (/senior-council)
  - SEO: Updated all meta tags for new positioning
- 2026-02-24: About page complete redesign
  - Transformed from feature-listing page to positioning statement page
  - Six sections: Opening Statement, Manifesto, Three Layers, The Bar, Founder, Dual CTAs
  - Follows brand positioning doc voice/tone precisely
  - No cards, icons, or feature grids — typography-driven, sparse layout
- 2026-02-24: Site-wide SEO audit and update
  - Updated SEO.tsx defaults (title, description, organization structured data) to match new positioning
  - Updated SEO on /explore, /mfhop, /host-hackathon, /about, BecomeASupporter pages
  - All public pages now use "serious builder ecosystem" positioning language
- 2026-02-24: Initial Replit import and setup

## Project Architecture
- **Frontend**: React 18 + TypeScript, Vite, TailwindCSS, Radix UI, shadcn/ui components
- **Backend**: Express (TypeScript), served via `tsx`
- **Database/Auth**: Supabase (external, requires env vars)
- **Email**: Resend API
- **Build**: Vite for client, esbuild for server
- **Port**: 5000 (single server serves both API and client)
- **Fonts**: Space Grotesk (body/headings), Press Start 2P (logo/minimal accents)
- **Accent Color**: Orange (#f97316) as single accent

### Directory Structure
```
client/           - React frontend (Vite)
  src/            - Source code (components, pages, hooks, contexts, api)
  public/         - Static assets
server/           - Express backend
  routes/         - API route handlers
  services/       - Business logic services
  middleware/     - Express middleware
  migrations/     - Database migrations
shared/           - Shared types/schemas between client and server
docs/             - Documentation
```

### Active Pages
- `/` - Landing page (Hero, Credibility, Hackathons, Senior Council teaser, Explore, For Companies, Newsletter)
- `/senior-council` - Senior Council directory
- `/explore` - Explore Maximally tiles
- `/events` - Events listing
- `/blog` - Blog (Supabase-powered)
- `/mfhop` - Federation of Hackathon Organizers
- `/partner` - Partner With Us (hackathon services page, inspired by AngelHack)
- `/host-hackathon` - Host a hackathon
- `/about` - About/positioning statement page (6 sections: declaration, manifesto, three layers, the bar, founder, dual CTAs)
- `/login`, `/profile/:username`, `/contact` - Standard pages
- `/hackathon/:slug` - Public hackathon pages
- `/organizer/*` - Organizer dashboard pages
- `/judge/*` - Judge dashboard pages
- `/my-hackathons` - Participant dashboard

### Key Scripts
- `npm run dev` - Start development server (tsx)
- `npm run build` - Build client (Vite) + server (esbuild)
- `npm run start` - Start production server

### Environment Variables Required
- `VITE_SUPABASE_URL` - Supabase project URL (client-side)
- `VITE_SUPABASE_ANON_KEY` - Supabase anon key (client-side)
- `SUPABASE_URL` - Supabase project URL (server-side)
- `SUPABASE_ANON_KEY` - Supabase anon key (server-side)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side)
- `RESEND_API_KEY` - Resend email API key
- `FROM_EMAIL` - Sender email address
- `PLATFORM_URL` - Public platform URL

## User Preferences
- Design: Clean sans-serif typography (Space Grotesk), single orange accent, increased whitespace
- Positioning: "serious builder ecosystem" targeting builders and enterprise partners
- No teen/student/youth language anywhere - use builder/participant/creator instead
- Dual CTAs: "Join the Ecosystem" (builders) + "Partner With Us" (companies)
