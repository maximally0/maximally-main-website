# Maximally - Global Hackathon League for Teen Builders

## Overview
Maximally is a global hackathon ecosystem designed for ambitious teenagers (ages 13-19) worldwide. It focuses on hosting high-stakes innovation events, chaos sprints, and public launch challenges, emphasizing real proof-of-work rather than theoretical learning. The platform aims to be the boldest hackathon league for teen founders, coders, and creators globally.

## Recent Changes (November 2025)

### Events Page Redesign
- Expanded from hackathon-only to broader "Tech Events" platform covering hackathons, conferences, workshops, meetups, bootcamps, and demo days
- Created `client/src/data/techEvents.json` config with event categories, featured events, and type-based styling
- New `EventCard.tsx` component with type-based gradients and icons
- Purple cosmic theme matching homepage aesthetics (radial gradients, floating pixels, grid pattern)
- Category filter tabs with icons for quick event type filtering
- Updated SEO for broader tech events scope

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