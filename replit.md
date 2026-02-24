# Maximally - Hackathon Platform

## Overview
A full-stack hackathon platform ("Maximally") built with React (Vite) frontend and Express backend, using Supabase as the database/auth provider. The app serves both API and client from a single Express server on port 5000.

## Recent Changes
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
- (none recorded yet)
