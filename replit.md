# Maximally - Builder Ecosystem Platform

## Overview
A full-stack hackathon/builder ecosystem platform ("Maximally") built with React (Vite) frontend and Express backend, using Supabase as the database/auth provider. The app serves both API and client from a single Express server on port 5000. Positioned as "the world's most serious builder ecosystem."

## Recent Changes
- 2026-02-24: Comprehensive website redesign
  - New positioning: "The world's most serious builder ecosystem" (from youth-focused hackathon platform)
  - Visual: Space Grotesk font for body/headings, Press Start 2P pixel font for logo only
  - Visual: Single accent color (orange) replacing 4-color palette
  - Visual: Increased whitespace, removed decorative sparkles/icons
  - Navbar: Center links (Hackathons, Senior Council, Explore), dual CTAs (Join the Ecosystem + Partner With Us)
  - Hero: New headline, dual CTAs, stat strip
  - CredibilitySection: "Judges, mentors, and partners from" label
  - UpcomingHackathonsSection: OPEN NOW label, new copy
  - ExploreMaximallySection: 6-tile grid
  - ForOrganizersSection: Updated headlines/copy for enterprise
  - New Senior Council feature: Homepage teaser section + full standalone page (/senior-council)
  - Newsletter, Footer: Simplified with new brand statement
  - DotNavigation: Updated labels and orange accent color
  - SEO: Updated all meta tags (index.html, App.tsx, Index.tsx) for new positioning
- 2026-02-24: Initial Replit import and setup
  - Removed X-Frame-Options SAMEORIGIN header to allow Replit iframe proxy
  - Opened CORS to allow Replit proxy origin
  - Added guard for missing Supabase env vars in newsletter routes
  - Installed missing `nanoid` dependency

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

### Key Pages
- `/` - Landing page (Hero, Credibility, Hackathons, Senior Council teaser, Explore, For Companies, Newsletter)
- `/senior-council` - Full Senior Council directory page
- `/login`, `/profile`, `/blog`, `/contact`, `/about` - Standard pages

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
- Dual CTAs: "Join the Ecosystem" (builders) + "Partner With Us" (companies)
