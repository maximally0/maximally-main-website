import { createClient } from "@supabase/supabase-js";
import { type User, type InsertUser, type Judge, type InsertJudge, type JudgeEvent, type InsertJudgeEvent } from "@shared/schema";
import type { IStorage } from "./storage";

export class SupabaseStorage implements IStorage {
  private supabase: ReturnType<typeof createClient>;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }

    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
  }

  async getUser(id: number): Promise<User | undefined> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
    return data as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !data) return undefined;
    return data as User;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { data, error } = await (this.supabase as any)
      .from('users')
      .insert(insertUser)
      .select()
      .single();

    if (error) throw new Error(`Failed to create user: ${error.message}`);
    return data as User;
  }

  async getJudges(): Promise<Judge[]> {
    const { data, error } = await this.supabase
      .from('judges')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch judges: ${error.message}`);
    return (data || []).map(this.mapDatabaseToJudge);
  }

  async getPublishedJudges(): Promise<Judge[]> {
    const { data, error } = await this.supabase
      .from('judges')
      .select('*')
      .eq('is_published', true)
      .order('tier', { ascending: false }) // Legacy first, then Chief, Senior, etc.
      .order('total_events_judged', { ascending: false });

    if (error) throw new Error(`Failed to fetch published judges: ${error.message}`);

    // Map database columns to TypeScript interface
    return (data || []).map(this.mapDatabaseToJudge);
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
    const { data, error } = await this.supabase
      .from('judges')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !data) return undefined;

    // Fetch user's avatar from profiles table
    const { data: profileData } = await (this.supabase as any)
      .from('profiles')
      .select('avatar_url')
      .eq('username', username)
      .single();

    // Use profile avatar if available, otherwise use judge's profile_photo
    const judgeWithAvatar = {
      ...(data as any),
      profile_photo: (profileData as any)?.avatar_url || (data as any).profile_photo
    };

    return this.mapDatabaseToJudge(judgeWithAvatar);
  }

  async createJudge(insertJudge: InsertJudge): Promise<Judge> {
    // Clean the data before inserting
    const cleanedJudge = {
      ...insertJudge,
      // Ensure arrays are properly formatted
      primary_expertise: insertJudge.primaryExpertise || [],
      secondary_expertise: insertJudge.secondaryExpertise || [],
      languages_spoken: insertJudge.languagesSpoken || [],
      // Map camelCase to snake_case for database
      full_name: insertJudge.fullName,
      profile_photo: insertJudge.profilePhoto,
      short_bio: insertJudge.shortBio,
      role_title: insertJudge.currentRole,
      judge_location: insertJudge.location,
      total_events_judged: insertJudge.totalEventsJudged || 0,
      total_teams_evaluated: insertJudge.totalTeamsEvaluated || 0,
      total_mentorship_hours: insertJudge.totalMentorshipHours || 0,
      years_of_experience: insertJudge.yearsOfExperience || 0,
      average_feedback_rating: insertJudge.averageFeedbackRating,
      events_judged_verified: insertJudge.eventsJudgedVerified || false,
      teams_evaluated_verified: insertJudge.teamsEvaluatedVerified || false,
      mentorship_hours_verified: insertJudge.mentorshipHoursVerified || false,
      feedback_rating_verified: insertJudge.feedbackRatingVerified || false,
      public_achievements: insertJudge.publicAchievements,
      mentorship_statement: insertJudge.mentorshipStatement,
      availability_status: insertJudge.availabilityStatus || 'available',
      is_published: insertJudge.isPublished || false,
      proof_of_judging: insertJudge.proofOfJudging,
      calendar_link: insertJudge.calendarLink,
      compensation_preference: insertJudge.compensationPreference,
      conflict_of_interest: insertJudge.conflictOfInterest,
      agreed_to_nda: insertJudge.agreedToNDA || false,
      judge_references: insertJudge.references,
    };

    // Remove the camelCase properties that don't exist in the database
    const {
      fullName, profilePhoto, shortBio, currentRole, primaryExpertise, secondaryExpertise,
      totalEventsJudged, totalTeamsEvaluated, totalMentorshipHours, yearsOfExperience,
      averageFeedbackRating, eventsJudgedVerified, teamsEvaluatedVerified,
      mentorshipHoursVerified, feedbackRatingVerified, languagesSpoken,
      publicAchievements, mentorshipStatement, availabilityStatus, isPublished,
      proofOfJudging, calendarLink, compensationPreference, conflictOfInterest,
      agreedToNDA, ...dbJudge
    } = cleanedJudge;

    const { data, error } = await (this.supabase as any)
      .from('judges')
      .insert(dbJudge)
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw new Error(`Failed to create judge: ${error.message}`);
    }

    return this.mapDatabaseToJudge(data);
  }

  async getJudgeEvents(judgeId: number): Promise<JudgeEvent[]> {
    const { data, error } = await this.supabase
      .from('judge_events')
      .select('*')
      .eq('judge_id', judgeId)
      .order('event_date', { ascending: false });

    if (error) throw new Error(`Failed to fetch judge events: ${error.message}`);
    return (data || []).map(this.mapDatabaseToJudgeEvent);
  }

  private mapDatabaseToJudgeEvent(dbEvent: any): JudgeEvent {
    return {
      id: dbEvent.id,
      judgeId: dbEvent.judge_id,
      eventName: dbEvent.event_name,
      role: dbEvent.event_role,
      date: dbEvent.event_date,
      link: dbEvent.event_link,
      verified: dbEvent.verified || false,
    };
  }

  async createJudgeEvent(insertEvent: InsertJudgeEvent): Promise<JudgeEvent> {
    // Map camelCase to snake_case
    const dbEvent = {
      judge_id: insertEvent.judgeId,
      event_name: insertEvent.eventName,
      event_role: insertEvent.role,
      event_date: insertEvent.date,
      event_link: insertEvent.link,
      verified: insertEvent.verified || false,
    };

    const { data, error } = await (this.supabase as any)
      .from('judge_events')
      .insert(dbEvent)
      .select()
      .single();

    if (error) {
      console.error('Supabase judge event insert error:', error);
      throw new Error(`Failed to create judge event: ${error.message}`);
    }

    return this.mapDatabaseToJudgeEvent(data);
  }

  // Additional helper methods for judge management
  async updateJudgePublishStatus(judgeId: number, isPublished: boolean): Promise<void> {
    const { error } = await (this.supabase as any)
      .from('judges')
      .update({ is_published: isPublished })
      .eq('id', judgeId);

    if (error) throw new Error(`Failed to update judge publish status: ${error.message}`);
  }

  async updateJudgeTier(judgeId: number, tier: 'starter' | 'verified' | 'senior' | 'chief' | 'legacy'): Promise<void> {
    const { error } = await (this.supabase as any)
      .from('judges')
      .update({ tier })
      .eq('id', judgeId);

    if (error) throw new Error(`Failed to update judge tier: ${error.message}`);
  }

  async verifyJudgeMetrics(judgeId: number, metrics: {
    eventsJudgedVerified?: boolean;
    teamsEvaluatedVerified?: boolean;
    mentorshipHoursVerified?: boolean;
    feedbackRatingVerified?: boolean;
  }): Promise<void> {
    const updateData: any = {};

    if (metrics.eventsJudgedVerified !== undefined) {
      updateData.events_judged_verified = metrics.eventsJudgedVerified;
    }
    if (metrics.teamsEvaluatedVerified !== undefined) {
      updateData.teams_evaluated_verified = metrics.teamsEvaluatedVerified;
    }
    if (metrics.mentorshipHoursVerified !== undefined) {
      updateData.mentorship_hours_verified = metrics.mentorshipHoursVerified;
    }
    if (metrics.feedbackRatingVerified !== undefined) {
      updateData.feedback_rating_verified = metrics.feedbackRatingVerified;
    }

    const { error } = await (this.supabase as any)
      .from('judges')
      .update(updateData)
      .eq('id', judgeId);

    if (error) throw new Error(`Failed to verify judge metrics: ${error.message}`);
  }

  async searchJudges(query: string, filters?: {
    tier?: string;
    expertise?: string;
    location?: string;
  }): Promise<Judge[]> {
    let supabaseQuery = this.supabase
      .from('judges')
      .select('*')
      .eq('is_published', true);

    // Add text search
    if (query) {
      supabaseQuery = supabaseQuery.or(`full_name.ilike.%${query}%,company.ilike.%${query}%,headline.ilike.%${query}%,judge_location.ilike.%${query}%`);
    }

    // Add filters
    if (filters?.tier && filters.tier !== 'all') {
      supabaseQuery = supabaseQuery.eq('tier', filters.tier);
    }

    if (filters?.expertise && filters.expertise !== 'all') {
      supabaseQuery = supabaseQuery.or(`primary_expertise.cs.{${filters.expertise}},secondary_expertise.cs.{${filters.expertise}}`);
    }

    if (filters?.location) {
      supabaseQuery = supabaseQuery.ilike('judge_location', `%${filters.location}%`);
    }

    const { data, error } = await supabaseQuery
      .order('tier', { ascending: false })
      .order('total_events_judged', { ascending: false });

    if (error) throw new Error(`Failed to search judges: ${error.message}`);
    return (data || []) as Judge[];
  }
}