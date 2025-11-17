// @ts-nocheck
import { users, type User, type InsertUser, judges, type Judge, type InsertJudge, judgeEvents, type JudgeEvent, type InsertJudgeEvent } from "@shared/schema";
import { SupabaseStorage } from "./supabase-storage";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getJudges(): Promise<Judge[]>;
  getPublishedJudges(): Promise<Judge[]>;
  getJudgeByUsername(username: string): Promise<Judge | undefined>;
  createJudge(judge: InsertJudge): Promise<Judge>;
  getJudgeEvents(judgeId: number): Promise<JudgeEvent[]>;
  createJudgeEvent(event: InsertJudgeEvent): Promise<JudgeEvent>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private judges: Map<number, Judge>;
  private judgeEvents: Map<number, JudgeEvent>;
  currentId: number;
  currentJudgeId: number;
  currentJudgeEventId: number;

  constructor() {
    this.users = new Map();
    this.judges = new Map();
    this.judgeEvents = new Map();
    this.currentId = 1;
    this.currentJudgeId = 1;
    this.currentJudgeEventId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id,
      email: null,
      name: null,
      bio: null,
      location: null,
      skills: null,
      github: null,
      linkedin: null,
      twitter: null,
      website: null,
      avatarUrl: null
    };
    this.users.set(id, user);
    return user;
  }

  async getJudges(): Promise<Judge[]> {
    return Array.from(this.judges.values());
  }

  async getPublishedJudges(): Promise<Judge[]> {
    return Array.from(this.judges.values()).filter(judge => judge.isPublished);
  }

  async getJudgeByUsername(username: string): Promise<Judge | undefined> {
    return Array.from(this.judges.values()).find(
      (judge) => judge.username === username,
    );
  }

  async createJudge(insertJudge: InsertJudge): Promise<Judge> {
    const id = this.currentJudgeId++;
    const judge: Judge = {
      ...insertJudge,
      id,
      createdAt: new Date(),
      tier: insertJudge.tier ?? 'starter',
      github: insertJudge.github ?? null,
      twitter: insertJudge.twitter ?? null,
      website: insertJudge.website ?? null,
      profilePhoto: insertJudge.profilePhoto ?? null,
      phone: insertJudge.phone ?? null,
      resume: insertJudge.resume ?? null,
      proofOfJudging: insertJudge.proofOfJudging ?? null,
      timezone: insertJudge.timezone ?? null,
      calendarLink: insertJudge.calendarLink ?? null,
      compensationPreference: insertJudge.compensationPreference ?? null,
      references: insertJudge.references ?? null,
      conflictOfInterest: insertJudge.conflictOfInterest ?? null,
      address: insertJudge.address ?? null,
      publicAchievements: insertJudge.publicAchievements ?? null,
      averageFeedbackRating: insertJudge.averageFeedbackRating ?? null,
      secondaryExpertise: insertJudge.secondaryExpertise ?? [],
      totalEventsJudged: insertJudge.totalEventsJudged ?? 0,
      totalTeamsEvaluated: insertJudge.totalTeamsEvaluated ?? 0,
      totalMentorshipHours: insertJudge.totalMentorshipHours ?? 0,
      yearsOfExperience: insertJudge.yearsOfExperience ?? 0,
      languagesSpoken: insertJudge.languagesSpoken ?? [],
      eventsJudgedVerified: insertJudge.eventsJudgedVerified ?? false,
      teamsEvaluatedVerified: insertJudge.teamsEvaluatedVerified ?? false,
      mentorshipHoursVerified: insertJudge.mentorshipHoursVerified ?? false,
      feedbackRatingVerified: insertJudge.feedbackRatingVerified ?? false,
      availabilityStatus: insertJudge.availabilityStatus ?? 'available',
      isPublished: insertJudge.isPublished !== undefined ? insertJudge.isPublished : true,
    };
    this.judges.set(id, judge);
    return judge;
  }

  async getJudgeEvents(judgeId: number): Promise<JudgeEvent[]> {
    return Array.from(this.judgeEvents.values()).filter(
      (event) => event.judgeId === judgeId,
    );
  }

  async createJudgeEvent(insertEvent: InsertJudgeEvent): Promise<JudgeEvent> {
    const id = this.currentJudgeEventId++;
    const event: JudgeEvent = {
      ...insertEvent,
      id,
      link: insertEvent.link ?? null,
      verified: insertEvent.verified ?? false,
    };
    this.judgeEvents.set(id, event);
    return event;
  }
}

// Simple storage initialization that happens after environment variables are loaded
let _storage: IStorage | null = null;

function getStorage(): IStorage {
  if (_storage) {
    return _storage;
  }

  try {
    
    
    
    
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      
      _storage = new SupabaseStorage();
      
    } else {
      
      _storage = new MemStorage();
    }
  } catch (error) {
    
    _storage = new MemStorage();
  }

  return _storage;
}

export const storage = {
  getUser: (id: number) => getStorage().getUser(id),
  getUserByUsername: (username: string) => getStorage().getUserByUsername(username),
  createUser: (user: InsertUser) => getStorage().createUser(user),
  getJudges: () => getStorage().getJudges(),
  getPublishedJudges: () => getStorage().getPublishedJudges(),
  getJudgeByUsername: (username: string) => getStorage().getJudgeByUsername(username),
  createJudge: (judge: InsertJudge) => getStorage().createJudge(judge),
  getJudgeEvents: (judgeId: number) => getStorage().getJudgeEvents(judgeId),
  createJudgeEvent: (event: InsertJudgeEvent) => getStorage().createJudgeEvent(event),
};
