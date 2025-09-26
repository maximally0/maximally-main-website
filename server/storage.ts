import { users, hackathons, type User, type InsertUser, type Hackathon, type InsertHackathon } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Hackathon methods
  getHackathon(slug: string): Promise<Hackathon | undefined>;
  getActiveHackathons(): Promise<Hackathon[]>;
  createHackathon(hackathon: InsertHackathon): Promise<Hackathon>;
  updateHackathon(slug: string, hackathon: Partial<InsertHackathon>): Promise<Hackathon | undefined>;
}

// rewrite MemStorage to DatabaseStorage (as per blueprint integration guidance)
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Hackathon methods
  async getHackathon(slug: string): Promise<Hackathon | undefined> {
    const [hackathon] = await db.select().from(hackathons).where(eq(hackathons.slug, slug));
    return hackathon || undefined;
  }

  async getActiveHackathons(): Promise<Hackathon[]> {
    return await db.select().from(hackathons).where(eq(hackathons.is_active, true));
  }

  async createHackathon(hackathon: InsertHackathon): Promise<Hackathon> {
    const [newHackathon] = await db
      .insert(hackathons)
      .values(hackathon)
      .returning();
    return newHackathon;
  }

  async updateHackathon(slug: string, hackathon: Partial<InsertHackathon>): Promise<Hackathon | undefined> {
    const [updatedHackathon] = await db
      .update(hackathons)
      .set(hackathon)
      .where(eq(hackathons.slug, slug))
      .returning();
    return updatedHackathon || undefined;
  }
}

export const storage = new DatabaseStorage();
