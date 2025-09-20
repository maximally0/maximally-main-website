import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

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

// Sample hackathon data with all existing and new hackathons
export const sampleHackathons: SelectHackathon[] = [
  {
    id: 'ai-shipathon-2025',
    name: 'AI Shipathon 2025',
    description: 'Build and ship AI-powered applications in 48 hours. From idea to deployment, create the next breakthrough AI tool that solves real-world problems.',
    startDate: new Date('2025-01-15T00:00:00Z'),
    endDate: new Date('2025-01-17T23:59:59Z'),
    location: 'Online',
    length: '48 hours',
    status: 'upcoming' as const,
    participants: 2847,
    prizes: '$50,000',
    tags: ['AI', 'Machine Learning', 'Web3', 'Startup'],
    registerUrl: '/blog/ai-shipathon-build-breakthrough-ai',
    detailsUrl: '/blog/ai-shipathon-build-breakthrough-ai',
    imageUrl: null,
    organizerName: 'Maximally',
    organizerUrl: 'https://maximally.org',
  },
  {
    id: 'startup-makeathon-2025',
    name: 'Startup Makeathon 2025',
    description: 'The world\'s premier startup simulation. Build a complete startup from idea to pitch deck in 7 days. Experience the full entrepreneurial journey with real mentors and investors.',
    startDate: new Date('2025-02-01T00:00:00Z'),
    endDate: new Date('2025-02-08T23:59:59Z'),
    location: 'Hybrid',
    length: '7 days',
    status: 'upcoming',
    participants: 1425,
    prizes: '$75,000',
    tags: ['Startup', 'Business', 'Pitch', 'Entrepreneurship'],
    registerUrl: '/makeathon',
    detailsUrl: '/makeathon',
    imageUrl: null,
    organizerName: 'Maximally',
    organizerUrl: 'https://maximally.org',
  },
  {
    id: 'project-codegen-2024',
    name: 'Project CodeGen',
    description: 'Revolutionize code generation with AI. Build tools that write, debug, and optimize code automatically. Shape the future of software development.',
    startDate: new Date('2024-11-10T00:00:00Z'),
    endDate: new Date('2024-11-12T23:59:59Z'),
    location: 'Online',
    length: '48 hours',
    status: 'completed',
    participants: 3247,
    prizes: '$40,000',
    tags: ['AI', 'Code Generation', 'Developer Tools', 'Automation'],
    registerUrl: '/blog/project-codegen-play-future',
    detailsUrl: '/blog/project-codegen-play-future',
    imageUrl: null,
    organizerName: 'Maximally',
    organizerUrl: 'https://maximally.org',
  },
  {
    id: 'hacktober-2024',
    name: 'Hacktober 2024',
    description: 'The spookiest month gets a tech twist! Build Halloween-themed apps, games, and tools. Combine creativity with code in this festive hackathon.',
    startDate: new Date('2024-10-25T00:00:00Z'),
    endDate: new Date('2024-10-27T23:59:59Z'),
    location: 'Online',
    length: '48 hours',
    status: 'completed',
    participants: 1876,
    prizes: '$25,000',
    tags: ['Halloween', 'Gaming', 'Creative', 'Web Development'],
    registerUrl: '/events',
    detailsUrl: '/events',
    imageUrl: null,
    organizerName: 'Maximally',
    organizerUrl: 'https://maximally.org',
  },
  {
    id: 'steal-a-thon-2024',
    name: 'Steal-A-Thon 2024',
    description: 'The most unconventional hackathon! "Steal" ideas from existing apps and make them 10x better. Innovation through iteration and improvement.',
    startDate: new Date('2024-09-15T00:00:00Z'),
    endDate: new Date('2024-09-17T23:59:59Z'),
    location: 'Online',
    length: '48 hours',
    status: 'completed',
    participants: 2134,
    prizes: '$35,000',
    tags: ['Innovation', 'Iteration', 'Product Design', 'UX/UI'],
    registerUrl: '/events',
    detailsUrl: '/events',
    imageUrl: null,
    organizerName: 'Maximally',
    organizerUrl: 'https://maximally.org',
  },
  {
    id: 'web3-revolution-2024',
    name: 'Web3 Revolution 2024',
    description: 'Build the decentralized future. Create DApps, DeFi protocols, and blockchain solutions that will reshape how we interact with technology.',
    startDate: new Date('2024-08-20T00:00:00Z'),
    endDate: new Date('2024-08-22T23:59:59Z'),
    location: 'Online',
    length: '48 hours',
    status: 'completed',
    participants: 2956,
    prizes: '$60,000',
    tags: ['Web3', 'Blockchain', 'DeFi', 'Smart Contracts'],
    registerUrl: '/events',
    detailsUrl: '/events',
    imageUrl: null,
    organizerName: 'Maximally',
    organizerUrl: 'https://maximally.org',
  },
  {
    id: 'green-tech-challenge-2024',
    name: 'Green Tech Challenge 2024',
    description: 'Technology for sustainability. Build solutions that address climate change, reduce waste, and create a more sustainable future for our planet.',
    startDate: new Date('2024-07-15T00:00:00Z'),
    endDate: new Date('2024-07-18T23:59:59Z'),
    location: 'Hybrid',
    length: '3 days',
    status: 'completed',
    participants: 1673,
    prizes: '$45,000',
    tags: ['Sustainability', 'Climate Tech', 'Green Energy', 'IoT'],
    registerUrl: '/events',
    detailsUrl: '/events',
    imageUrl: null,
    organizerName: 'Maximally',
    organizerUrl: 'https://maximally.org',
  },
  {
    id: 'global-gamedev-jam-2024',
    name: 'Global GameDev Jam 2024',
    description: 'Create the next viral game in 24 hours! From mobile to web, build games that entertain, educate, and engage players worldwide.',
    startDate: new Date('2024-06-01T00:00:00Z'),
    endDate: new Date('2024-06-02T23:59:59Z'),
    location: 'Online',
    length: '24 hours',
    status: 'completed',
    participants: 4521,
    prizes: '$30,000',
    tags: ['Gaming', 'Unity', 'Mobile', 'Entertainment'],
    registerUrl: '/events',
    detailsUrl: '/events',
    imageUrl: null,
    organizerName: 'Maximally',
    organizerUrl: 'https://maximally.org',
  }
];
