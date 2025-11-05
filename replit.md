# Maximally - Global Hackathon League for Teen Builders

## Overview

Maximally is the boldest hackathon ecosystem for teen founders, coders, and creators worldwide. Born in India but built for the world, we host high-stakes innovation events, chaos sprints, and public launch challenges designed for ambitious teenagers (ages 13-19). The platform focuses exclusively on hackathons and innovation competitions - no lectures, no theory, just real proof-of-work events.

## System Architecture

### Full-Stack Monolith Architecture
The application follows a modern full-stack monolith approach with clear separation between client and server components:

- **Frontend**: React 18 with TypeScript, using Vite as the build tool
- **Backend**: Node.js with Express server
- **Database**: PostgreSQL with Drizzle ORM
- **Deployment**: Replit with autoscale configuration

### Technology Stack Rationale
- **Vite over Create React App**: Chosen for faster development builds and better performance
- **Drizzle ORM**: Type-safe database interactions with excellent TypeScript integration
- **Neon Database**: Serverless PostgreSQL for scalability without infrastructure management
- **ESM Modules**: Modern JavaScript module system for better tree-shaking and performance

## Key Components

### Frontend Architecture
- **Component Library**: Radix UI with shadcn/ui for accessible, unstyled components
- **Styling**: Tailwind CSS with custom design system featuring "maximally" brand colors
- **State Management**: TanStack Query for server state management
- **Routing**: React Router for client-side navigation
- **Forms**: React Hook Form with Zod validation
- **SEO**: React Helmet for dynamic meta tags and structured data

### Backend Architecture
- **API Design**: RESTful endpoints with `/api` prefix
- **Storage Layer**: Abstracted storage interface supporting both memory and database implementations
- **Session Management**: Express sessions with PostgreSQL store
- **Development Mode**: Vite middleware integration for hot reloading
- **Production Build**: ESBuild for server bundling with external packages

### Design System
- **Typography**: Custom pixel fonts (Press Start 2P, VT323, JetBrains Mono)
- **Color Palette**: Brand colors including maximally-red, maximally-blue, maximally-green
- **Animations**: Custom CSS animations for floating elements and glowing effects
- **Responsive Design**: Mobile-first approach with touch-friendly interfaces

## Data Flow

### User Journey
1. **Discovery**: Landing page with SEO-optimized content and clear value proposition
2. **Application**: Tally form integration for event applications
3. **Community**: Discord integration for ongoing engagement
4. **Content**: Blog system with detailed guides and success stories

### Content Management
- **Static Content**: React components for pages and blog posts
- **Dynamic Forms**: Tally integration for applications and contact forms
- **Media Assets**: Optimized images and custom graphics for brand consistency

## External Dependencies

### Third-Party Integrations
- **Tally Forms**: Application and contact form handling
- **WhatsApp API**: Community group integration
- **Discord**: Community server access
- **Email Services**: Contact and sponsorship inquiries
- **Social Media**: Instagram, Twitter integration for content promotion

### Development Tools
- **TypeScript**: Type safety across the full stack
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Replit Extensions**: Development environment enhancements

## Deployment Strategy

### Production Environment
- **Platform**: Replit with autoscale deployment
- **Build Process**: 
  - Frontend: Vite build outputs to `dist/public`
  - Backend: ESBuild bundles server to `dist/index.js`
- **Environment Variables**: Database URL and other secrets managed through Replit secrets
- **Port Configuration**: Internal port 5000 mapped to external port 80

### Development Workflow
- **Hot Reloading**: Vite middleware integration for instant updates
- **Database Migrations**: Drizzle Kit for schema management
- **Development Server**: tsx for TypeScript execution without compilation

### Scalability Considerations
- **Database**: Neon serverless PostgreSQL scales automatically
- **Static Assets**: Served efficiently through Vite's optimized build process
- **Session Storage**: PostgreSQL-backed sessions for horizontal scaling

## Changelog

- November 5, 2025. **JUDGE SYSTEM IMPLEMENTATION**: Built complete judge system for Maximally platform
  - Created judge database schema with public/private fields (profile photo, expertise, stats, NDA agreement)
  - Implemented judge tier progression system: Starter → Verified → Senior → Chief → Legacy
  - Built comprehensive API endpoints: GET /api/judges (list), GET /api/judges/:username (profile), POST /api/judges/apply (application)
  - Created judge browse page (/people/judges) with search, filtering, and tier tabs
  - Built individual judge profile pages (/people/judges/:username) with public/private info sections
  - Implemented comprehensive judge application form (/judges/apply) with:
    - Public Info section: username, bio, expertise, achievements, languages
    - Private Info section: contact details, compensation preference, NDA agreement
    - Dynamic top events array with add/remove functionality
    - React Hook Form + Zod validation for all fields
    - Comma-separated languages input that converts to array
  - Fixed router compatibility (Wouter → React Router) for consistent navigation
  - All judge pages integrated with backend storage and proper loading states
- November 5, 2025. **GITHUB IMPORT SETUP**: Successfully configured fresh GitHub import for Replit environment
  - Installed all npm dependencies (616 packages)
  - Configured Vite development server to run on 0.0.0.0:5000 with strictPort for Replit proxy compatibility
  - Set up workflow "Start application" to run on port 5000 with webview output
  - Configured autoscale deployment with build and start scripts
  - Verified application runs successfully without Supabase (optional external service)
  - PostgreSQL database available via DATABASE_URL environment variable (helium database)
  - Frontend displaying correctly with hero section, navigation, and branding
  - Hot module reloading working with Vite development server
- September 30, 2025. **REPLIT ENVIRONMENT SETUP**: Configured application for Replit environment
  - Made Supabase integration optional to allow app to run without external database credentials
  - Modified `supabaseClient.ts` to gracefully handle missing environment variables
  - Added null checks in `useBlog.ts` to return empty results when Supabase is not configured
  - Configured workflow "Start application" to run on port 5000 with webview output
  - Verified deployment configuration with autoscale deployment target
  - All pages (Home, Events, About, Resources, Contact) working correctly
  - Hot module reloading working with Vite development server
- July 12, 2025. **BLOG CONTENT EXPANSION & FEATURED UPDATES**: Added comprehensive AI Shipathon blog content for SEO
  - Created 4 new AI Shipathon focused blog posts with rich content and proper formatting
  - Added routes and navigation for all new blog posts
  - Integrated featured AI Shipathon section on homepage for better visibility
  - Enhanced SEO with proper meta tags, structured data, and keyword targeting
  - All posts focus on AI hackathons, no-code tools, and beginner-friendly content
  - Updated /featured page with new industry professionals and mentors
  - Removed LinkedIn references from all featured page entries
- July 12, 2025. **GLOBAL TRANSFORMATION & SEO OPTIMIZATION**: Complete rebranding from India-specific to global platform
  - **Content Globalization**: Replaced all "India" references with global terminology across entire website
    - Homepage: "Born in India. Built for the World." → "Built Global. Made for Builders."
    - About page: "India's most powerful network" → "the world's most powerful network"
    - Allies page: "India's boldest student-led organizations" → "the world's boldest student-led organizations"
    - Makeathon page: "India's #1 startup simulation" → "The world's premier startup simulation"
    - Blog posts: Updated AI Shipathon content to global scope
    - Footer: Updated description to "global hackathon league"
  - **SEO Optimization**: Updated all meta descriptions to focus on "teen hackathons," "global," "startup makeathons," "AI shipathon," "Gen Z builders"
  - Added proper Open Graph and Twitter metadata for social media previews
  - Implemented structured data for organization and events with global positioning
  - Added favicon.ico and proper meta charset/viewport tags
  - Enhanced Footer with comprehensive page links organized in 5 categories
  - All titles under 60 characters, descriptions under 160 characters for SEO best practices
- July 3, 2025. **MAJOR TRANSFORMATION**: Converted Maximally from bootcamp platform to global hackathon league
  - Completely rebuilt homepage with new "Welcome to the Maximally League" branding
  - Removed all India-specific references, now global-first approach
  - Updated all pages to reflect hackathon-only focus (no more bootcamps/courses)
  - Updated Footer navigation and SEO to align with new positioning
  - Archived Summer 2025 Makeathon page with proper banners and redirects
  - **MESSAGING UPDATE**: Replaced all teen-specific language with inclusive builder-focused messaging
    - Updated Homepage: "for builders worldwide" instead of "for teen builders"
    - Updated Events page: "ambitious builders across all disciplines" 
    - Updated Community page: "1000+ active builders" instead of "entrepreneurs"
    - Updated About page: "Global Innovators" instead of "Young Innovators"
    - Updated Hackathon page: "Global Innovation Challenge" instead of "Teen Hackathon"
    - Updated all SEO titles and descriptions to remove teen-specific language
    - Navigation cleaned up: removed /hackathon, /sponsor, /careers routes
- June 15, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.