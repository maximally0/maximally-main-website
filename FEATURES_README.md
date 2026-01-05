# 🚀 Maximally Platform - Complete Feature Guide

> **Welcome to the Hackathon Universe** - A comprehensive platform for hosting, participating in, and judging hackathons.

This document outlines all features of the Maximally platform for video documentation purposes. Features marked with **🆕 NEW** were introduced with the user-hosted hackathons system.

---

## 📋 Table of Contents

1. [Platform Overview](#platform-overview)
2. [User Authentication & Profiles](#user-authentication--profiles)
3. [Hackathon Discovery & Participation](#hackathon-discovery--participation)
4. [🆕 User-Hosted Hackathons (Organizer System)](#-user-hosted-hackathons-organizer-system)
5. [🆕 Judge System](#-judge-system)
6. [🆕 Team Management](#-team-management)
7. [🆕 Project Submission System](#-project-submission-system)
8. [🆕 Project Gallery](#-project-gallery)
9. [🆕 Certificate System](#-certificate-system)
10. [🆕 Announcements & Communication](#-announcements--communication)
11. [🆕 Analytics & Insights](#-analytics--insights)
12. [🆕 Moderation System](#-moderation-system)
13. [Blog & Content](#blog--content)
14. [Community & Partnerships](#community--partnerships)
15. [Technical Stack](#technical-stack)

---

## Platform Overview

Maximally is a **hackathon universe** - a platform where:
- **Participants** discover and join hackathons
- **Organizers** create and manage their own hackathons
- **Judges** evaluate submissions with detailed scoring
- **Everyone** showcases their projects in a global gallery

### Core Value Propositions
- 🎮 **Retro-gaming aesthetic** with pixel art design
- 🌐 **Global reach** for hackathon discovery
- 🏆 **End-to-end hackathon management**
- 📊 **Data-driven insights** for organizers

---

## User Authentication & Profiles

### Authentication Features
- **Email/Password signup** with OTP verification
- **Google OAuth** integration
- **Password reset** via email
- **Email verification** with disposable email detection
- **Rate limiting** for security

### User Profiles
- Customizable username and display name
- Bio, location, and avatar
- Skills tags
- Social links (GitHub, LinkedIn, Twitter, Website)
- **🆕 Role-based access**: User, Judge, Organizer, Admin

### Profile Features
- Public profile pages (`/profile/:username`)
- **🆕 Hackathon participation history**
- **🆕 Certificates earned display**
- **🆕 Projects submitted showcase**

---

## Hackathon Discovery & Participation

### Hackathon Listings
- Browse upcoming, ongoing, and completed hackathons
- Filter by format (Online/Offline/Hybrid)
- Search functionality
- **🆕 User-created hackathons alongside official events**

### Official Maximally Hackathons
- **Code Hypothesis** - 24-hour wild ideas hackathon
- **Protocol 404** - 48-hour system-breaking hackathon
- **Project CodeGen** - 48-hour playful coding hackathon
- **PromptStorm** - 24-hour AI prompt engineering hackathon
- **Maximally Hacktober** - Month-long hackathon
- **Steal-A-Thon** - Remix culture hackathon
- **Grand Tech Assembly** - 7-day GTA-themed hackathon

### Participant Dashboard
- View registered hackathons
- Track active vs past hackathons
- **🆕 See submission status**
- **🆕 View team information**
- **🆕 Access certificates**

---

## 🆕 User-Hosted Hackathons (Organizer System)

> **This is the major new feature** - Users can now create and host their own hackathons on Maximally!

### Becoming an Organizer
- Apply via `/organizer/apply`
- Profile verification process
- **Organizer Tiers**:
  - 🟢 **Starter Organizer** - Entry-level
  - 🔵 **Verified Organizer** - Proven track record
  - 🟣 **Senior Organizer** - Extensive experience
  - 🟡 **Chief Organizer** - Industry leader
  - 🔴 **Legacy Organizer** - Distinguished contributions

### Creating a Hackathon
- **Basic Info**: Name, slug, tagline, description
- **Schedule**: Start/end dates, registration deadline
- **Format**: Online, Offline, or Hybrid
- **Venue** (for offline/hybrid)
- **Participation Settings**:
  - Eligibility criteria
  - Team size (min/max)
  - Registration fee
  - Max participants
  - Communication channels (Discord, WhatsApp)

### 🆕 Hackathon Tracks
- Create multiple themed tracks
- Track-specific prizes
- Participants choose track during submission
- Filter submissions by track

### 🆕 Prize Configuration
- Total prize pool display
- Prize breakdown by position
- Custom prize categories
- Perks and swag configuration

### 🆕 Hackathon Timeline Management
- Registration period control
- Building phase control
- Submission deadline control
- Judging period control
- **Manual override options**: Auto, Force Open, Force Closed

### 🆕 Organizer Dashboard
- View all created hackathons
- Draft, Pending Review, Published, Ended states
- Clone hackathons for quick setup
- **Analytics per hackathon**:
  - Views count
  - Registrations count
  - Submissions count

### 🆕 Registration Management
- View all registrations
- Search and filter participants
- Bulk actions:
  - Bulk check-in
  - Bulk unregister
- Export to CSV
- Individual participant actions:
  - Check-in
  - Unregister
  - Block user

### 🆕 Sponsors Management
- Add hackathon sponsors
- Sponsor tiers (Title, Gold, Silver, Bronze)
- Logo and website links
- Display on hackathon page

### 🆕 Custom Registration Questions
- Add custom questions to registration form
- Question types: Text, Select, Checkbox
- Required/optional settings
- View responses in dashboard

---

## 🆕 Judge System

### Becoming a Judge
- Apply via `/judges/apply`
- Detailed profile with expertise areas
- **Judge Tiers**:
  - 🟢 **Starter Judge** - Building experience
  - 🔵 **Verified Judge** - Proven expertise
  - 🟣 **Senior Judge** - Established leader
  - 🟡 **Chief Judge** - Industry leader
  - 🔴 **Legacy Judge** - Exceptional contributions

### Judge Profile
- Full name, headline, bio
- Current role and company
- Primary and secondary expertise areas
- Languages spoken
- Mentorship statement
- Availability status
- **Verified statistics**:
  - Events judged
  - Teams evaluated
  - Mentorship hours
  - Average feedback rating

### Judge Dashboard
- Overview of judging statistics
- Assigned hackathons
- **Judge Events** - Track past judging experience
- Invitations management
- **Inbox** for organizer messages

### 🆕 Judge Invitations
- Organizers can invite judges to hackathons
- Accept/decline invitations
- View hackathon details before accepting

### 🆕 Judging Interface
- View all submissions for assigned hackathon
- Filter by track
- **Criteria-based scoring**:
  - Innovation (0-100)
  - Technical (0-100)
  - Design (0-100)
  - Presentation (0-100)
  - Impact (0-100)
- Written feedback for each submission
- Overall score calculation
- Edit scores during judging period

### 🆕 Judging Period Control
- Organizers control when judging opens/closes
- Judges can only score during open period
- Clear status indicators

---

## 🆕 Team Management

### Team Formation
- **Solo or Team** registration options
- Create new team with custom name
- Auto-generated team codes
- Join existing team via code

### Team Features
- Team leader designation
- Invite members via email
- View team members
- Remove members (leader only)
- Leave team
- Disband team (leader only)

### 🆕 Team Tasks
- Create tasks for team members
- Assign tasks
- Track completion status
- Collaborative project management

---

## 🆕 Project Submission System

### Submission Process
- Project name and tagline
- Detailed description
- Track selection (if applicable)
- **Links**:
  - GitHub repository
  - Live demo URL
  - Video demo URL
  - Presentation URL
- Technologies used (tags)
- Save as draft or submit

### Submission Features
- Edit submissions before deadline
- View submission status
- See scores and feedback (after judging)
- **Prize won** display for winners

### Submission Deadline Control
- Auto-close based on timeline
- Manual override by organizer
- Clear deadline display

---

## 🆕 Project Gallery

### Global Gallery (`/gallery`)
- Browse all submitted projects
- Search by name
- Filter by category
- Sort by: Newest, Most Liked, Most Viewed
- **Hackathon projects only** filter
- Grid and list view modes

### Project Details
- Full project description
- Technologies used
- Team/creator info
- Links to demo, code, video
- **Like** projects
- **View count** tracking
- Comments section

### Gallery Submission
- Submit projects outside of hackathons
- Showcase personal projects
- Category selection
- Cover image upload

### 🆕 Recommended Projects
- Personalized project recommendations
- Based on user interests and skills

---

## 🆕 Certificate System

### Certificate Types
- **Participation Certificate** - For all confirmed participants
- **Winner Certificate** - For prize winners
- **Judge Certificate** - For judges
- **Mentor Certificate** - For mentors

### Certificate Features
- Auto-generated with hackathon details
- Unique certificate ID
- **Public verification** (`/certificates/verify/:id`)
- PDF and JPG formats
- Email delivery option

### Certificate Generation (Organizers)
- Select recipients by type
- Bulk generation
- Send via email option
- Track generated certificates

### Certificate Verification
- Public verification page
- Shows:
  - Participant name
  - Hackathon name
  - Certificate type
  - Position (for winners)
  - Issue date
- Valid/Invalid/Revoked status

---

## 🆕 Announcements & Communication

### Hackathon Announcements
- Organizers create announcements
- Types: General, Important, Urgent
- Visible to all registered participants
- Timestamp display

### 🆕 Organizer-Judge Messaging
- Direct messaging between organizers and judges
- Inbox system for judges
- Unread count indicators
- Message history

### 🆕 Participant Notifications
- Registration confirmation emails
- Submission confirmation emails
- Winner notification emails
- Deadline reminder emails
- Hackathon starting soon emails

---

## 🆕 Analytics & Insights

### Registration Analytics (Organizers)
- Total registrations over time
- Registration by type (Solo vs Team)
- Registration by status
- Experience level distribution
- College/university breakdown
- Daily registration trends

### 🆕 Organizer Insights
- Domain analytics
- Participant demographics
- Engagement metrics
- Conversion rates

### 🆕 Platform Analytics (`/analytics`)
- Global platform statistics
- Active hackathons
- Total participants
- Projects submitted

---

## 🆕 Moderation System

### User Moderation
- Report users for violations
- Admin review process
- **Moderation statuses**:
  - Good standing
  - Warning
  - Restricted
  - Banned

### Moderation Actions
- Restrict participation
- Restrict submissions
- Restrict team joining
- Full ban

### Banned User Experience
- Clear banned page display
- Reason for ban
- Appeal information

---

## Blog & Content

### Blog System
- SEO-optimized blog posts
- Categories and tags
- Featured images
- Related posts

### Blog Categories
- Hackathon guides
- Success stories
- Tech tutorials
- Platform updates
- Partnership announcements

### Static Event Pages
- Code Hypothesis
- Protocol 404
- Project CodeGen
- PromptStorm
- Hacktober
- Steal-A-Thon
- Grand Tech Assembly

---

## Community & Partnerships

### Partner Network (`/partner`)
- MFHOP (Maximally Federation of Hackathon Organizers & Partners)
- Partner organization listings
- Collaboration opportunities

### Become a Supporter (`/become-a-supporter`)
- Sponsorship opportunities
- Partnership tiers
- Benefits breakdown

### Community Links
- Discord community redirect
- Social media links
- Contact forms

### People Directory
- Core team (`/people/core`)
- Judges directory (`/people/judges`)
- Organizers directory (`/people/organizers`)

---

## Technical Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **TailwindCSS** for styling
- **Radix UI** components
- **React Router** for navigation
- **TanStack Query** for data fetching
- **Framer Motion** for animations

### Backend
- **Express.js** server
- **Supabase** for database and auth
- **Drizzle ORM** for database queries
- **Resend** for email delivery

### Design System
- **Press Start 2P** font for headings
- **JetBrains Mono** font for body text
- Purple/Pink gradient color scheme
- Pixel art aesthetic
- Dark mode by default

### Deployment
- **Netlify** hosting
- Serverless functions
- Edge caching

---

## Feature Summary by User Role

### Participants Can:
- Browse and register for hackathons
- Form or join teams
- Submit projects
- View scores and feedback
- Earn certificates
- Showcase projects in gallery

### 🆕 Organizers Can:
- Create and manage hackathons
- Configure tracks, prizes, and sponsors
- Manage registrations
- Invite and manage judges
- Send announcements
- Generate certificates
- View analytics
- Announce winners

### 🆕 Judges Can:
- Accept hackathon invitations
- Score submissions with detailed criteria
- Provide written feedback
- Track judging history
- Build public judge profile

### Admins Can:
- Review hackathon submissions
- Moderate users
- Manage platform settings
- Access all analytics

---

## Quick Links

| Feature | URL |
|---------|-----|
| Home | `/` |
| Events | `/events` |
| Explore | `/explore` |
| Gallery | `/gallery` |
| Blog | `/blog` |
| Judges Directory | `/judges` |
| Apply as Judge | `/judges/apply` |
| Apply as Organizer | `/organizer/apply` |
| Organizer Dashboard | `/organizer/dashboard` |
| Judge Dashboard | `/judge-dashboard` |
| My Hackathons | `/my-hackathons` |
| Create Hackathon | `/create-hackathon` |
| Partner Network | `/partner` |
| About | `/about` |

---

*Last Updated: December 2025*
*Platform Version: 2.0 (User-Hosted Hackathons Release)*