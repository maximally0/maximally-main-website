# Maximally - Global Hackathon League for Teen Builders

## Overview
Maximally is a global hackathon ecosystem designed for ambitious teenagers (ages 13-19) worldwide. It focuses on hosting high-stakes innovation events, chaos sprints, and public launch challenges, emphasizing real proof-of-work rather than theoretical learning. The platform aims to be the boldest hackathon league for teen founders, coders, and creators globally.

## Recent Changes (November 2025)

### Events Page Redesign (Hackathons Focus)
- Refocused from "Tech Events" to "Discover Hackathons" - hackathons are now the primary attraction
- Hero section with "BUILD. SHIP. WIN." badge and hackathon-focused messaging
- Stats badges: hackathon count, prize money, global access
- Hackathons displayed in primary grid with filters (format, status, topics)
- "Other Cool Stuff" collapsible section for non-hackathon events (conferences, workshops, meetups, bootcamps, demo days)
- Purple cosmic theme matching homepage aesthetics (radial gradients, floating pixels, grid pattern)
- `EventCard.tsx` component with type-based gradients and icons
- CTA linking to host-hackathon page for organizers
- Updated SEO for hackathons focus

### Footer Redesign (Cosmic Purple Theme)
- Updated from red/maximally-red theme to purple cosmic theme matching landing page
- Radial gradients with purple, pink, cyan accent colors
- Floating animated pixels with colored glow effects
- Section cards use gradient backgrounds (cyan/pink/green/amber/purple)
- "BUILD. SHIP. WIN." badge at top, MAXIMALLY title with gradient text
- Social icons with gradient backgrounds and colored icons

### Explore Page Updates
- Removed "Jobs & Internships" section from exploreCards.json
- Added "Maximally Judge Network" card with amber styling, award icon, and "New" badge

### About Page Updates
- Added "Explore Maximally" to "What We're Building" section (cyan styling, links to /explore)
- Added NexFellow as permanent Media Partner in partners section (purple gradient styling)

### Host Hackathon Page Redesign
- Complete visual overhaul with purple cosmic theme (radial gradients, floating pixels, grid overlays)
- Hero section with gradient title "HOST YOUR OWN HACKATHON" and animated elements
- Stats badges with cyan/pink/green accent colors
- Benefits grid with 6 cards using type-based gradient colors and hover effects
- "How It Works" 4-step process with purple styling
- Initiatives section (Partner Network, MFHOP Federation) with gradient cards
- Final CTA section with cosmic gradient background
- Preserved all auth checking and navigation functionality

### About Page Redesign
- Purple cosmic hero section with floating pixels matching Events page
- "What We're Building" section with 5 building blocks using gradient cards
- People/Team section with dynamic Supabase data loading (preserved)
- Featured Judges section with amber accent colors
- Partners section with rose/amber/green gradient cards
- Contact CTA section with email and Discord links
- All Supabase data fetching logic preserved with graceful fallbacks

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Full-Stack Monolith Architecture
The application uses a modern full-stack monolith architecture with clear separation between client and server components:
- **Frontend**: React 18 with TypeScript, using Vite.
- **Backend**: Node.js with Express server.
- **Database**: PostgreSQL with Drizzle ORM.
- **Deployment**: Replit with autoscale configuration.

### Technology Stack Rationale
- **Vite**: For faster development builds and performance.
- **Drizzle ORM**: For type-safe database interactions and TypeScript integration.
- **Neon Database**: Serverless PostgreSQL for scalability.
- **ESM Modules**: Modern JavaScript module system.

### Key Components

#### Frontend Architecture
- **Component Library**: Radix UI with shadcn/ui.
- **Styling**: Tailwind CSS with a custom design system and "maximally" brand colors.
- **State Management**: TanStack Query for server state.
- **Routing**: React Router for client-side navigation.
- **Forms**: React Hook Form with Zod validation.
- **SEO**: React Helmet for dynamic meta tags.

#### Backend Architecture
- **API Design**: RESTful endpoints (`/api` prefix).
- **Storage Layer**: Abstracted storage interface (memory and database).
- **Session Management**: Express sessions with PostgreSQL store.
- **Development Mode**: Vite middleware for hot reloading.
- **Production Build**: ESBuild for server bundling.

#### Design System
- **Typography**: Custom pixel fonts (Press Start 2P, VT323, JetBrains Mono).
- **Color Palette**: Brand colors including maximally-red, maximally-blue, maximally-green.
- **Animations**: Custom CSS animations for floating elements and glowing effects.
- **Responsive Design**: Mobile-first approach.

#### Data Flow
- **User Journey**: Discovery (landing page), Application (Tally integration), Community (Discord), Content (Blog).
- **Content Management**: Static content (React components), Dynamic forms (Tally), Media assets (optimized images).

### Deployment Strategy
- **Production Environment**: Replit with autoscale deployment, Vite frontend build (`dist/public`), ESBuild backend bundle (`dist/index.js`), Replit secrets for environment variables, internal port 5000 mapped to external port 80.
- **Development Workflow**: Hot reloading via Vite, Drizzle Kit for database migrations, `tsx` for TypeScript execution.
- **Scalability**: Neon serverless PostgreSQL and optimized static asset serving.

## External Dependencies

### Third-Party Integrations
- **Tally Forms**: For applications and contact forms.
- **WhatsApp API**: For community group integration.
- **Discord**: For community server access.
- **Email Services**: For contact and sponsorship inquiries.
- **Social Media**: Instagram, Twitter for content promotion.

### Development Tools
- **TypeScript**: For type safety.
- **ESLint**: For code quality.
- **Prettier**: For code formatting.
- **Replit Extensions**: For development environment enhancements.