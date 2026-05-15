// @ts-nocheck
import { neon } from "@neondatabase/serverless";
import { type User, type InsertUser, type Judge, type InsertJudge, type JudgeEvent, type InsertJudgeEvent } from "@shared/schema";
import type { IStorage } from "./storage";

export class SupabaseStorage implements IStorage {
  private sql: ReturnType<typeof neon>;

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('Missing DATABASE_URL environment variable');
    }
    this.sql = neon(databaseUrl);
  }

  async getUser(id: number): Promise<User | undefined> {
    const rows = await this.sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`;
    return rows[0] as User | undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const rows = await this.sql`SELECT * FROM users WHERE username = ${username} LIMIT 1`;
    return rows[0] as User | undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const rows = await this.sql`
      INSERT INTO users (username, password) VALUES (${insertUser.username}, ${insertUser.password})
      RETURNING *`;
    return rows[0] as User;
  }

  async getJudges(): Promise<Judge[]> {
    const rows = await this.sql`SELECT * FROM judges ORDER BY sort_order ASC, created_at DESC`;
    return rows.map(this.mapDatabaseToJudge);
  }

  async getPublishedJudges(): Promise<Judge[]> {
    const rows = await this.sql`
      SELECT * FROM judges WHERE is_published = true
      ORDER BY sort_order ASC, tier DESC, total_events_judged DESC`;
    return rows.map(this.mapDatabaseToJudge);
  }

  private mapDatabaseToJudge(dbJudge: any): Judge {
    return {
      id: dbJudge.id,
      username: dbJudge.username,
      fullName: dbJudge.full_name,
      profilePhoto: dbJudge.profile_photo,
      headline: dbJudge.headline,
      shortBio: dbJudge.short_bio,
      location: dbJudge.judge_location,
      currentRole: dbJudge.role_title,
      company: dbJudge.company,
      primaryExpertise: dbJudge.primary_expertise || [],
      secondaryExpertise: dbJudge.secondary_expertise || [],
      totalEventsJudged: dbJudge.total_events_judged || 0,
      totalTeamsEvaluated: dbJudge.total_teams_evaluated || 0,
      totalMentorshipHours: dbJudge.total_mentorship_hours || 0,
      yearsOfExperience: dbJudge.years_of_experience || 0,
      averageFeedbackRating: dbJudge.average_feedback_rating,
      eventsJudgedVerified: dbJudge.events_judged_verified || false,
      teamsEvaluatedVerified: dbJudge.teams_evaluated_verified || false,
      mentorshipHoursVerified: dbJudge.mentorship_hours_verified || false,
      feedbackRatingVerified: dbJudge.feedback_rating_verified || false,
      linkedin: dbJudge.linkedin,
      github: dbJudge.github,
      twitter: dbJudge.twitter,
      website: dbJudge.website,
      languagesSpoken: dbJudge.languages_spoken || [],
      publicAchievements: dbJudge.public_achievements,
      mentorshipStatement: dbJudge.mentorship_statement,
      availabilityStatus: dbJudge.availability_status as 'available' | 'not-available' | 'seasonal',
      tier: dbJudge.tier as 'starter' | 'verified' | 'senior' | 'chief' | 'legacy',
      isPublished: dbJudge.is_published || false,
      email: dbJudge.email,
      phone: dbJudge.phone,
      resume: dbJudge.resume,
      proofOfJudging: dbJudge.proof_of_judging,
      timezone: dbJudge.timezone,
      calendarLink: dbJudge.calendar_link,
      compensationPreference: dbJudge.compensation_preference as 'volunteer' | 'paid' | 'negotiable',
      references: dbJudge.judge_references,
      conflictOfInterest: dbJudge.conflict_of_interest,
      agreedToNDA: dbJudge.agreed_to_nda || false,
      address: dbJudge.address,
      createdAt: new Date(dbJudge.created_at),
    };
  }

  async getJudgeByUsername(username: string): Promise<Judge | undefined> {
    const rows = await this.sql`SELECT * FROM judges WHERE LOWER(username) = LOWER(${username}) LIMIT 1`;
    if (!rows.length) return undefined;
    const dbJudge = rows[0] as any;

    // Fetch avatar from profiles
    const profileRows = await this.sql`SELECT avatar_url FROM profiles WHERE LOWER(username) = LOWER(${username}) LIMIT 1`;
    if (profileRows.length) {
      dbJudge.profile_photo = (profileRows[0] as any).avatar_url || dbJudge.profile_photo;
    }

    return this.mapDatabaseToJudge(dbJudge);
  }

  async createJudge(insertJudge: InsertJudge): Promise<Judge> {
    const rows = await this.sql`
      INSERT INTO judges (
        username, full_name, profile_photo, headline, short_bio, judge_location,
        role_title, company, primary_expertise, secondary_expertise,
        total_events_judged, total_teams_evaluated, total_mentorship_hours,
        years_of_experience, average_feedback_rating, events_judged_verified,
        teams_evaluated_verified, mentorship_hours_verified, feedback_rating_verified,
        linkedin, github, twitter, website, languages_spoken, public_achievements,
        mentorship_statement, availability_status, tier, is_published, email, phone,
        resume, proof_of_judging, timezone, calendar_link, compensation_preference,
        conflict_of_interest, agreed_to_nda, judge_references, address
      ) VALUES (
        ${insertJudge.username}, ${insertJudge.fullName}, ${insertJudge.profilePhoto ?? null},
        ${insertJudge.headline}, ${insertJudge.shortBio ?? null}, ${insertJudge.location ?? null},
        ${insertJudge.currentRole}, ${insertJudge.company ?? null},
        ${insertJudge.primaryExpertise || []}, ${insertJudge.secondaryExpertise || []},
        ${insertJudge.totalEventsJudged || 0}, ${insertJudge.totalTeamsEvaluated || 0},
        ${insertJudge.totalMentorshipHours || 0}, ${insertJudge.yearsOfExperience || 0},
        ${insertJudge.averageFeedbackRating ?? null}, ${insertJudge.eventsJudgedVerified || false},
        ${insertJudge.teamsEvaluatedVerified || false}, ${insertJudge.mentorshipHoursVerified || false},
        ${insertJudge.feedbackRatingVerified || false}, ${insertJudge.linkedin ?? null},
        ${insertJudge.github ?? null}, ${insertJudge.twitter ?? null}, ${insertJudge.website ?? null},
        ${insertJudge.languagesSpoken || []}, ${insertJudge.publicAchievements ?? null},
        ${insertJudge.mentorshipStatement ?? null}, ${insertJudge.availabilityStatus || 'available'},
        ${insertJudge.tier || 'starter'}, ${insertJudge.isPublished || false},
        ${insertJudge.email}, ${insertJudge.phone ?? null}, ${insertJudge.resume ?? null},
        ${insertJudge.proofOfJudging ?? null}, ${insertJudge.timezone ?? null},
        ${insertJudge.calendarLink ?? null}, ${insertJudge.compensationPreference ?? null},
        ${insertJudge.conflictOfInterest ?? null}, ${insertJudge.agreedToNDA || false},
        ${insertJudge.references ?? null}, ${insertJudge.address ?? null}
      ) RETURNING *`;
    return this.mapDatabaseToJudge(rows[0]);
  }

  async getJudgeEvents(judgeId: number): Promise<JudgeEvent[]> {
    const judgeRows = await this.sql`SELECT user_id FROM judges WHERE id = ${judgeId} LIMIT 1`;
    if (!judgeRows.length || !(judgeRows[0] as any).user_id) return [];
    const userId = (judgeRows[0] as any).user_id;
    const rows = await this.sql`SELECT * FROM judge_events WHERE judge_id = ${userId} ORDER BY date DESC`;
    return rows.map(this.mapDatabaseToJudgeEvent);
  }

  private mapDatabaseToJudgeEvent(dbEvent: any): JudgeEvent {
    return {
      id: dbEvent.id,
      judgeId: dbEvent.judge_id,
      eventName: dbEvent.event_name,
      role: dbEvent.role,
      date: dbEvent.date,
      link: dbEvent.event_link,
      verified: dbEvent.verified || false,
    };
  }

  async createJudgeEvent(insertEvent: InsertJudgeEvent): Promise<JudgeEvent> {
    const rows = await this.sql`
      INSERT INTO judge_events (judge_id, event_name, role, date, event_link, verified)
      VALUES (${insertEvent.judgeId}, ${insertEvent.eventName}, ${insertEvent.role},
              ${insertEvent.date}, ${insertEvent.link ?? null}, ${insertEvent.verified || false})
      RETURNING *`;
    return this.mapDatabaseToJudgeEvent(rows[0]);
  }
}