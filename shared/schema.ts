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
  status: text('status', { enum: ['upcoming', 'ongoing', 'completed'] }).notNull(),
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
  status: z.enum(['upcoming', 'ongoing', 'completed']),
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

// Helper function to calculate hackathon status based on dates
export function calculateHackathonStatus(startDate: Date, endDate: Date): 'upcoming' | 'ongoing' | 'completed' {
  const now = new Date();
  
  if (now < startDate) {
    return 'upcoming';
  } else if (now >= startDate && now <= endDate) {
    return 'ongoing';
  } else {
    return 'completed';
  }
}

// Grand Indian Hackathon Season - Real hackathon data from individual pages
// Note: Status is calculated dynamically based on dates to prevent drift
const createHackathonEntry = (data: Omit<SelectHackathon, 'status'>) => ({
  ...data,
  status: calculateHackathonStatus(data.startDate, data.endDate)
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
