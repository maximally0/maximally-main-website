import { pgTable, text, serial, integer, boolean, timestamp, jsonb, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Blogs table for dynamic content
export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  published: boolean("published").default(false),
  cover_image: text("cover_image"),
  excerpt: text("excerpt"),
  tags: jsonb("tags"), // Array of tags
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Judges table for hackathon judges
export const judges = pgTable("judges", {
  id: serial("id").primaryKey(),
  hackathon_id: integer("hackathon_id"),
  name: text("name").notNull(),
  role: text("role"),
  bio: text("bio"),
  company: text("company"),
  image: text("image"),
  linkedin: text("linkedin"),
  twitter: text("twitter"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Enhanced hackathons table with relations
export const hackathons = pgTable("hackathons", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  tagline: text("tagline").notNull(),
  
  // Hero section
  badge_text: text("badge_text"),
  description: text("description").notNull(),
  registration_url: text("registration_url"),
  cover_image: text("cover_image"),
  
  // Fast facts
  start_date: text("start_date").notNull(),
  end_date: text("end_date").notNull(), 
  duration: text("duration").notNull(),
  format: text("format").notNull(),
  team_size: text("team_size").notNull(),
  judging_type: text("judging_type").notNull(),
  results_date: text("results_date").notNull(),
  
  // Content sections
  what_it_is: text("what_it_is").notNull(),
  the_idea: text("the_idea").notNull(),
  
  // Lists (stored as JSON arrays)
  who_joins: jsonb("who_joins").notNull(), // Array of strings
  tech_rules: jsonb("tech_rules").notNull(), // Array of strings
  fun_awards: jsonb("fun_awards").notNull(), // Array of strings
  perks: jsonb("perks").notNull(), // Array of strings
  
  // Prizes
  cash_pool: text("cash_pool"),
  prize_pool: jsonb("prize_pool"), // Detailed prize structure
  
  // Judging details
  judging_description: text("judging_description").notNull(),
  judging_criteria: text("judging_criteria").notNull(),
  
  // Submission requirements
  required_submissions: jsonb("required_submissions").notNull(), // Array of strings
  optional_submissions: jsonb("optional_submissions"), // Array of strings
  
  // Additional text content fields for enhanced content management
  announcements: text("announcements"), // Important updates and news
  event_highlights: text("event_highlights"), // Key features and selling points
  sponsor_message: text("sponsor_message"), // Message from sponsors
  faq_content: text("faq_content"), // Frequently asked questions
  timeline_details: text("timeline_details"), // Detailed timeline information
  special_instructions: text("special_instructions"), // Any special notes or instructions
  
  // Theme and styling - comprehensive theming system
  theme_config: jsonb("theme_config"), // Complete theme configuration
  theme_color_primary: text("theme_color_primary").notNull(), // Backward compatibility
  theme_color_secondary: text("theme_color_secondary").notNull(),
  theme_color_accent: text("theme_color_accent").notNull(),
  
  // Status
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Define relationships
export const hackathonRelations = relations(hackathons, ({ many }) => ({
  judges: many(judges),
}));

export const judgeRelations = relations(judges, ({ one }) => ({
  hackathon: one(hackathons, {
    fields: [judges.hackathon_id],
    references: [hackathons.id],
  }),
}));

// Validation schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBlogSchema = createInsertSchema(blogs).extend({
  title: z.string().trim().min(1, 'Title is required'),
  slug: z.string().trim().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and dashes'),
  content: z.string().trim().min(1, 'Content is required'),
  author: z.string().trim().min(1, 'Author is required'),
  published: z.boolean().default(false),
  cover_image: z.string().transform(v => v?.trim() || undefined).optional(),
  excerpt: z.string().transform(v => v?.trim() || undefined).optional(),
  tags: z.array(z.string().trim().min(1, 'Each tag must be non-empty')).optional().default([]),
});

export const insertJudgeSchema = createInsertSchema(judges).extend({
  hackathon_id: z.number().int().positive('Valid hackathon ID is required').optional(),
  name: z.string().trim().min(1, 'Name is required'),
  role: z.string().transform(v => v?.trim() || undefined).optional(),
  bio: z.string().transform(v => v?.trim() || undefined).optional(),
  company: z.string().transform(v => v?.trim() || undefined).optional(),
  image: z.string().transform(v => v?.trim() || undefined).optional(),
  linkedin: z.string().transform(v => v?.trim() || undefined).optional(),
  twitter: z.string().transform(v => v?.trim() || undefined).optional(),
});

export const insertHackathonSchema = createInsertSchema(hackathons).extend({
  slug: z.string().trim().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and dashes'),
  title: z.string().trim().min(1, 'Title is required'),
  tagline: z.string().trim().min(1, 'Tagline is required'),
  description: z.string().trim().min(1, 'Description is required'),
  start_date: z.string().trim().min(1, 'Start date is required'),
  end_date: z.string().trim().min(1, 'End date is required'),
  duration: z.string().trim().min(1, 'Duration is required'),
  format: z.string().trim().min(1, 'Format is required'),
  team_size: z.string().trim().min(1, 'Team size is required'),
  judging_type: z.string().trim().min(1, 'Judging type is required'),
  results_date: z.string().trim().min(1, 'Results date is required'),
  what_it_is: z.string().trim().min(1, 'What it is description is required'),
  the_idea: z.string().trim().min(1, 'The idea description is required'),
  judging_description: z.string().trim().min(1, 'Judging description is required'),
  judging_criteria: z.string().trim().min(1, 'Judging criteria is required'),
  who_joins: z.array(z.string().trim().min(1, 'Each participant type must be non-empty')).min(1, 'At least one participant type is required'),
  tech_rules: z.array(z.string().trim().min(1, 'Each tech rule must be non-empty')).min(1, 'At least one tech rule is required'),
  fun_awards: z.array(z.string().trim().min(1, 'Each fun award must be non-empty')).min(1, 'At least one fun award is required'),
  perks: z.array(z.string().trim().min(1, 'Each perk must be non-empty')).min(1, 'At least one perk is required'),
  required_submissions: z.array(z.string().trim().min(1, 'Each required submission must be non-empty')).min(1, 'At least one required submission is required'),
  optional_submissions: z.array(z.string().trim().min(1, 'Each optional submission must be non-empty')).optional().default([]),
  theme_color_primary: z.string().trim().min(1, 'Primary color is required'),
  theme_color_secondary: z.string().trim().min(1, 'Secondary color is required'),
  theme_color_accent: z.string().trim().min(1, 'Accent color is required'),
  // Optional fields that can be empty
  subtitle: z.string().transform(v => v?.trim() || undefined).optional(),
  badge_text: z.string().transform(v => v?.trim() || undefined).optional(),
  registration_url: z.union([z.string().url(), z.literal('')]).transform(v => v?.trim() || undefined).optional(),
  cash_pool: z.string().transform(v => v?.trim() || undefined).optional(),
  cover_image: z.string().transform(v => v?.trim() || undefined).optional(),
  prize_pool: z.array(z.object({
    title: z.string(),
    amount: z.string(),
    description: z.string().optional(),
  })).optional().default([]),
  // New optional text content fields
  announcements: z.string().transform(v => v?.trim() || undefined).optional(),
  event_highlights: z.string().transform(v => v?.trim() || undefined).optional(),
  sponsor_message: z.string().transform(v => v?.trim() || undefined).optional(),
  faq_content: z.string().transform(v => v?.trim() || undefined).optional(),
  timeline_details: z.string().transform(v => v?.trim() || undefined).optional(),
  special_instructions: z.string().transform(v => v?.trim() || undefined).optional(),
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertBlog = z.infer<typeof insertBlogSchema>;
export type Blog = typeof blogs.$inferSelect;
export type InsertJudge = z.infer<typeof insertJudgeSchema>;
export type Judge = typeof judges.$inferSelect;
export type InsertHackathon = z.infer<typeof insertHackathonSchema>;
export type Hackathon = typeof hackathons.$inferSelect;
