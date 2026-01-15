// @ts-nocheck
import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  bio: text("bio"),
  location: text("location"),
  email: text("email"),
  skills: text("skills").array().default([]),
  github: text("github"),
  linkedin: text("linkedin"),
  twitter: text("twitter"),
  website: text("website"),
  avatarUrl: text("avatar_url"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const updateProfileSchema = createInsertSchema(users).pick({
  name: true,
  bio: true,
  location: true,
  email: true,
  skills: true,
  github: true,
  linkedin: true,
  twitter: true,
  website: true,
  avatarUrl: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;
export type User = typeof users.$inferSelect;

// User hackathon registrations
export const userHackathons = pgTable('user_hackathons', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  hackathonId: text('hackathon_id').notNull(),
  status: text('status', { enum: ['registered', 'participated', 'completed'] }).notNull().default('registered'),
  placement: text('placement'),
  projectName: text('project_name'),
  projectDescription: text('project_description'),
  registeredAt: timestamp('registered_at').notNull().defaultNow(),
});

export const insertUserHackathonSchema = createInsertSchema(userHackathons).omit({ id: true });
export type InsertUserHackathon = z.infer<typeof insertUserHackathonSchema>;
export type UserHackathon = typeof userHackathons.$inferSelect;

// User achievements
export const achievements = pgTable('achievements', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  icon: text('icon').notNull(),
  earnedAt: timestamp('earned_at').notNull().defaultNow(),
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({ id: true });
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;

// Hackathon table schema
export const hackathons = pgTable('hackathons', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  location: text('location').notNull(),
  length: text('length').notNull(),
  status: text('status', { enum: ['draft', 'live', 'ended'] }).notNull(),
  hackathon_status: text('hackathon_status', { enum: ['draft', 'live', 'ended'] }),
  participants: integer('participants').notNull().default(0),
  prizes: text('prizes').notNull(),
  tags: text('tags').array().notNull().default([]),
  registerUrl: text('register_url').notNull(),
  detailsUrl: text('details_url').notNull(),
  imageUrl: text('image_url'),
  organizerName: text('organizer_name'),
  organizerUrl: text('organizer_url'),
});

// Insert schema with validation
export const insertHackathonSchema = createInsertSchema(hackathons, {
  name: z.string().min(1, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(1, "Location is required"),
  length: z.string().min(1, "Length is required"),
  status: z.enum(['draft', 'live', 'ended']),
  participants: z.number().min(0, "Participants must be non-negative"),
  prizes: z.string().min(1, "Prize information is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  registerUrl: z.string().min(1, "Register URL is required"),
  detailsUrl: z.string().min(1, "Details URL is required"),
  imageUrl: z.string().url().optional(),
  organizerUrl: z.string().url().optional(),
}).omit({ id: true });

// Types
export type InsertHackathon = z.infer<typeof insertHackathonSchema>;
export type SelectHackathon = typeof hackathons.$inferSelect;

// Helper function to calculate hackathon display state based on dates
// Uses the simplified 3-state model: draft, live, ended
import { getHackathonDisplayState, type HackathonDisplayState } from './hackathonState';

export function calculateHackathonStatus(startDate: Date, endDate: Date, status?: string | null): HackathonDisplayState {
  return getHackathonDisplayState({
    status: status || 'published',
    end_date: endDate.toISOString(),
  });
}

// Grand Indian Hackathon Season - Real hackathon data from individual pages
// Note: Status is calculated dynamically based on dates to prevent drift
const createHackathonEntry = (data: Omit<SelectHackathon, 'status' | 'hackathon_status'>) => ({
  ...data,
  status: calculateHackathonStatus(data.startDate, data.endDate, 'published'),
  hackathon_status: calculateHackathonStatus(data.startDate, data.endDate, 'published'),
});

export const grandIndianHackathonSeason: SelectHackathon[] = [
  createHackathonEntry({
    id: 'code-hypothesis-2025',
    name: 'Code Hypothesis',
    description: 'A 24-hour hackathon for wild ideas. Test theories instead of pitching. This is where code meets graffiti - build chaos, utility, and speed.',
    startDate: new Date('2025-09-28T00:00:00Z'),
    endDate: new Date('2025-09-28T23:59:59Z'),
    location: 'Online',
    length: '24 hours',
    participants: 0, // TBD - will be updated with actual registration data
    prizes: 'TBD',
    tags: ['Chaos', 'Utility', 'Wild Ideas', 'Hacker Culture'],
    registerUrl: '/codehypothesis',
    detailsUrl: '/codehypothesis',
    imageUrl: null,
    organizerName: 'Maximally',
    organizerUrl: 'https://maximally.org',
  }),
  createHackathonEntry({
    id: 'protocol-404-2025',
    name: 'Protocol 404',
    description: 'Break the system. Build yours. A 48-hour hackathon where the system is already broken. You\'re not fixing it — you\'re building in the wreckage.',
    startDate: new Date('2025-10-04T00:00:00Z'),
    endDate: new Date('2025-10-05T23:59:59Z'),
    location: 'Online',
    length: '48 hours',
    participants: 0, // TBD - will be updated with actual registration data
    prizes: '₹5000+',
    tags: ['System Breaking', 'Chaos', 'Utility', 'Indie Hackers'],
    registerUrl: 'https://protocol404.devpost.com',
    detailsUrl: '/protocol-404',
    imageUrl: null,
    organizerName: 'Maximally',
    organizerUrl: 'https://maximally.org',
  }),
  createHackathonEntry({
    id: 'project-codegen-2025',
    name: 'Project CodeGen',
    description: 'Build like you\'re 6. Ship like you\'re 16. A 48-hour hackathon for builders who play. Focus on playful, creative coding and fun projects.',
    startDate: new Date('2025-10-11T00:00:00Z'),
    endDate: new Date('2025-10-12T23:59:59Z'),
    location: 'Online',
    length: '48 hours',
    participants: 0, // TBD - will be updated with actual registration data
    prizes: '₹5000+',
    tags: ['Playful', 'Creative', 'Teen Builders', 'Fun Programming'],
    registerUrl: 'https://projectcodegen.devpost.com',
    detailsUrl: '/project-codegen',
    imageUrl: null,
    organizerName: 'Maximally',
    organizerUrl: 'https://maximally.org',
  }),
  createHackathonEntry({
    id: 'promptstorm-2025',
    name: 'PromptStorm',
    description: '24-hour AI prompt-engineering hackathon. When in doubt, prompt harder. Make prompts the core of your build and iterate fast.',
    startDate: new Date('2025-10-25T00:00:00Z'),
    endDate: new Date('2025-10-26T23:59:59Z'),
    location: 'Online',
    length: '24 hours',
    participants: 0, // TBD - will be updated with actual registration data
    prizes: '₹3000+',
    tags: ['AI', 'Prompt Engineering', 'Machine Learning', 'Creativity'],
    registerUrl: '/promptstorm',
    detailsUrl: '/promptstorm',
    imageUrl: null,
    organizerName: 'Maximally',
    organizerUrl: 'https://maximally.org',
  }),
  createHackathonEntry({
    id: 'hacktober-2025',
    name: 'Maximally Hacktober',
    description: 'Build slow. Build loud. Finish strong. A month-long hackathon for builders who won\'t quit. Take your time and build something meaningful.',
    startDate: new Date('2025-10-01T00:00:00Z'),
    endDate: new Date('2025-10-31T23:59:59Z'),
    location: 'Online',
    length: '1 month',
    participants: 0, // TBD - will be updated with actual registration data
    prizes: '₹5000+',
    tags: ['Month-long', 'Autumn', 'Persistence', 'Long-form Building'],
    registerUrl: '/hacktober',
    detailsUrl: '/hacktober',
    imageUrl: null,
    organizerName: 'Maximally',
    organizerUrl: 'https://maximally.org',
  }),
  createHackathonEntry({
    id: 'steal-a-thon-2025',
    name: 'Maximally Steal-A-Thon',
    description: 'The only hackathon where original ideas are banned. Find a project, make it better, rename it, and ship. Remix culture at its finest.',
    startDate: new Date('2025-11-09T00:00:00Z'),
    endDate: new Date('2025-11-10T23:59:59Z'),
    location: 'Online',
    length: '24 hours',
    participants: 0, // TBD - will be updated with actual registration data
    prizes: '₹3000 Grand Prize',
    tags: ['Remix Culture', 'Improvement', 'Iteration', 'Creativity'],
    registerUrl: '/steal-a-thon',
    detailsUrl: '/steal-a-thon',
    imageUrl: null,
    organizerName: 'Maximally',
    organizerUrl: 'https://maximally.org',
  }),
  createHackathonEntry({
    id: 'grand-tech-assembly-2025',
    name: 'Grand Tech Assembly',
    description: 'A 7-day GTA-themed hackathon with mission tracks. Pick your hustle: The Heist, Street Hustle, Chaos Mode, Rise to Power, or Vice Streets.',
    startDate: new Date('2025-11-01T00:00:00Z'),
    endDate: new Date('2025-11-07T23:59:59Z'),
    location: 'Online',
    length: '7 days',
    participants: 0, // TBD - will be updated with actual registration data
    prizes: 'TBD',
    tags: ['GTA Theme', 'Mission Tracks', 'Gaming', 'Multiple Categories'],
    registerUrl: '/grand-tech-assembly',
    detailsUrl: '/grand-tech-assembly',
    imageUrl: null,
    organizerName: 'Maximally',
    organizerUrl: 'https://maximally.org',
  })
];

// Export as sampleHackathons for backward compatibility
export const sampleHackathons = grandIndianHackathonSeason;

export const judges = pgTable('judges', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  
  fullName: text('full_name').notNull(),
  profilePhoto: text('profile_photo'),
  headline: text('headline').notNull(),
  shortBio: text('short_bio').notNull(),
  location: text('judge_location').notNull(),
  currentRole: text('role_title').notNull(),
  company: text('company').notNull(),
  
  primaryExpertise: text('primary_expertise').array().notNull(),
  secondaryExpertise: text('secondary_expertise').array().notNull().default([]),
  
  totalEventsJudged: integer('total_events_judged').notNull().default(0),
  totalTeamsEvaluated: integer('total_teams_evaluated').notNull().default(0),
  totalMentorshipHours: integer('total_mentorship_hours').notNull().default(0),
  yearsOfExperience: integer('years_of_experience').notNull().default(0),
  averageFeedbackRating: integer('average_feedback_rating'),
  
  eventsJudgedVerified: boolean('events_judged_verified').notNull().default(false),
  teamsEvaluatedVerified: boolean('teams_evaluated_verified').notNull().default(false),
  mentorshipHoursVerified: boolean('mentorship_hours_verified').notNull().default(false),
  feedbackRatingVerified: boolean('feedback_rating_verified').notNull().default(false),
  
  linkedin: text('linkedin').notNull(),
  github: text('github'),
  twitter: text('twitter'),
  website: text('website'),
  
  languagesSpoken: text('languages_spoken').array().notNull().default([]),
  publicAchievements: text('public_achievements'),
  mentorshipStatement: text('mentorship_statement').notNull(),
  availabilityStatus: text('availability_status', { enum: ['available', 'not-available', 'seasonal'] }).notNull().default('available'),
  
  tier: text('tier', { enum: ['starter', 'verified', 'senior', 'chief', 'legacy'] }).notNull().default('starter'),
  isPublished: boolean('is_published').notNull().default(false),
  
  email: text('email').notNull(),
  phone: text('phone'),
  resume: text('resume'),
  proofOfJudging: text('proof_of_judging'),
  timezone: text('timezone'),
  calendarLink: text('calendar_link'),
  compensationPreference: text('compensation_preference', { enum: ['volunteer', 'paid', 'negotiable'] }),
  references: text('judge_references'),
  conflictOfInterest: text('conflict_of_interest'),
  agreedToNDA: boolean('agreed_to_nda').notNull().default(false),
  address: text('address'),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const judgeEvents = pgTable('judge_events', {
  id: serial('id').primaryKey(),
  judgeId: integer('judge_id').notNull(),
  eventName: text('event_name').notNull(),
  role: text('event_role').notNull(),
  date: text('event_date').notNull(),
  link: text('event_link'),
  verified: boolean('verified').notNull().default(false),
});

export const insertJudgeSchema = createInsertSchema(judges, {
  username: z.string().min(3, "Maximally username is required (minimum 3 characters)").max(30, "Username must be less than 30 characters"),
  fullName: z.string().min(1, "Full name is required"),
  headline: z.string().min(1, "Headline is required"),
  shortBio: z.string().min(10, "Short bio must be at least 10 characters"),
  location: z.string().min(1, "Location is required"),
  currentRole: z.string().min(1, "Current role is required"),
  company: z.string().min(1, "Company is required"),
  primaryExpertise: z.array(z.string()).min(1, "At least one primary expertise is required"),
  linkedin: z.string().url("Valid LinkedIn URL is required"),
  github: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  email: z.string().email("Valid email is required"),
  mentorshipStatement: z.string().min(20, "Mentorship statement must be at least 20 characters"),
  agreedToNDA: z.boolean().refine(val => val === true, "You must agree to the NDA"),
}).omit({ id: true, createdAt: true });

export const insertJudgeEventSchema = createInsertSchema(judgeEvents).omit({ id: true });

export type InsertJudge = z.infer<typeof insertJudgeSchema>;
export type Judge = typeof judges.$inferSelect;
export type InsertJudgeEvent = z.infer<typeof insertJudgeEventSchema>;
export type JudgeEvent = typeof judgeEvents.$inferSelect;

// Organizer Hackathons - User-created hackathons
export const organizerHackathons = pgTable('organizer_hackathons', {
  id: serial('id').primaryKey(),
  organizerId: text('organizer_id').notNull(), // Supabase user ID
  organizerEmail: text('organizer_email').notNull(),
  
  // Basic Info
  hackathonName: text('hackathon_name').notNull(),
  slug: text('slug').notNull().unique(),
  tagline: text('tagline'),
  description: text('description'),
  
  // Schedule & Format
  startDate: timestamp('start_date', { withTimezone: true }).notNull(),
  endDate: timestamp('end_date', { withTimezone: true }).notNull(),
  format: text('format', { enum: ['online', 'offline', 'hybrid'] }).notNull(),
  venue: text('venue'),
  registrationDeadline: timestamp('registration_deadline', { withTimezone: true }),
  duration: text('duration'),
  
  // Participation
  eligibility: text('eligibility').array().default([]),
  teamSizeMin: integer('team_size_min').default(1),
  teamSizeMax: integer('team_size_max').default(4),
  registrationFee: integer('registration_fee').default(0),
  maxParticipants: integer('max_participants'),
  expectedParticipants: integer('expected_participants'),
  communicationChannel: text('communication_channel'),
  communicationLink: text('communication_link'),
  
  // Tracks / Themes (stored as JSON)
  tracks: text('tracks').default('[]'), // JSON string
  openInnovation: boolean('open_innovation').default(false),
  
  // Prizes & Perks
  totalPrizePool: text('total_prize_pool'),
  prizeBreakdown: text('prize_breakdown').default('[]'), // JSON string
  perks: text('perks').array().default([]),
  
  // Judging & Evaluation
  judgingCriteria: text('judging_criteria').default('[]'), // JSON string
  judgesMentors: text('judges_mentors').default('[]'), // JSON string
  
  // Community & Links
  discordLink: text('discord_link'),
  whatsappLink: text('whatsapp_link'),
  websiteUrl: text('website_url'),
  submissionPlatform: text('submission_platform').default('maximally'),
  submissionPlatformLink: text('submission_platform_link'),
  contactEmail: text('contact_email'),
  
  // Rules & Guidelines
  keyRules: text('key_rules'),
  codeOfConduct: text('code_of_conduct'),
  
  // Visual/Media
  promoVideoLink: text('promo_video_link'),
  galleryImages: text('gallery_images').array().default([]),
  coverImage: text('cover_image'),
  
  // Visibility & Verification
  featuredBadge: boolean('featured_badge').default(false),
  verificationDocs: text('verification_docs').array().default([]),
  status: text('status', { enum: ['draft', 'pending_review', 'published', 'rejected', 'ended'] }).notNull().default('draft'),
  
  // Publishing workflow
  publishRequestedAt: timestamp('publish_requested_at', { withTimezone: true }),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  reviewedBy: text('reviewed_by'),
  rejectionReason: text('rejection_reason'),
  adminNotes: text('admin_notes'),
  
  // Analytics
  viewsCount: integer('views_count').default(0),
  registrationsCount: integer('registrations_count').default(0),
  
  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const insertOrganizerHackathonSchema = createInsertSchema(organizerHackathons, {
  hackathonName: z.string().min(3, "Hackathon name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  startDate: z.date(),
  endDate: z.date(),
  format: z.enum(['online', 'offline', 'hybrid']),
  organizerEmail: z.string().email(),
}).omit({ id: true, createdAt: true, updatedAt: true });

export type InsertOrganizerHackathon = z.infer<typeof insertOrganizerHackathonSchema>;
export type OrganizerHackathon = typeof organizerHackathons.$inferSelect;

// Organizer Profiles - Extended profile data for organizers
export const organizerProfiles = pgTable('organizer_profiles', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().unique(), // Supabase user ID
  
  // Public Profile
  displayName: text('display_name'),
  organizationName: text('organization_name'),
  organizationType: text('organization_type', { enum: ['individual', 'student_club', 'company', 'nonprofit', 'community'] }),
  bio: text('bio'),
  location: text('location'),
  website: text('website'),
  logoUrl: text('logo_url'),
  
  // Social Links
  linkedin: text('linkedin'),
  twitter: text('twitter'),
  instagram: text('instagram'),
  
  // Organizer Stats (Public)
  totalHackathonsHosted: integer('total_hackathons_hosted').default(0),
  totalParticipantsReached: integer('total_participants_reached').default(0),
  totalPrizeMoneyDistributed: text('total_prize_money_distributed'),
  verifiedOrganizer: boolean('verified_organizer').default(false),
  
  // Private Analytics
  totalViews: integer('total_views').default(0),
  totalRegistrations: integer('total_registrations').default(0),
  averageRating: text('average_rating'), // Store as text to avoid precision issues
  
  // Verification
  verificationStatus: text('verification_status', { enum: ['unverified', 'pending', 'verified'] }).default('unverified'),
  verificationDocs: text('verification_docs').array().default([]),
  verifiedAt: timestamp('verified_at', { withTimezone: true }),
  verifiedBy: text('verified_by'),
  
  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const insertOrganizerProfileSchema = createInsertSchema(organizerProfiles).omit({ id: true, createdAt: true, updatedAt: true });

export type InsertOrganizerProfile = z.infer<typeof insertOrganizerProfileSchema>;
export type OrganizerProfile = typeof organizerProfiles.$inferSelect;
