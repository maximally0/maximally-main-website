import express, { type Request, Response, NextFunction } from "express";
import serverless from "serverless-http";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS middleware
app.use((_req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5002',
    'http://localhost:5001',
    'https://maximally.in',
    'https://maximally-admin-panel.vercel.app'
  ];

  const origin = _req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (_req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseAdmin: ReturnType<typeof createClient> | undefined;

if (supabaseUrl && supabaseServiceKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  app.locals.supabaseAdmin = supabaseAdmin;
}

// Helper function to get user ID from bearer token
async function bearerUserId(supabase: any, token: string): Promise<string | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return null;
    return user.id;
  } catch {
    return null;
  }
}

// Import and register all routes from the main server
// For now, we'll add the critical judge routes here

// Judge profile endpoint
app.get("/api/judge/profile", async (req: Request, res: Response) => {
  try {
    if (!supabaseAdmin) {
      return res.status(500).json({ success: false, message: "Server is not configured for Supabase" });
    }

    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.toString().startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Missing bearer token' });
    }
    const token = authHeader.toString().slice('Bearer '.length);
    const userId = await bearerUserId(supabaseAdmin as any, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });

    // Get user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    const profileData = profile as any;

    if (profileData.role !== 'judge') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Judge role required.'
      });
    }

    // Get judge data
    const { data: judge, error: judgeError } = await supabaseAdmin
      .from('judges')
      .select('*')
      .eq('username', profileData.username)
      .single();

    if (judgeError || !judge) {
      return res.status(404).json({ success: false, message: 'Judge profile not found' });
    }

    // Get judge events
    const { data: events, error: eventsError } = await supabaseAdmin
      .from('judge_events')
      .select('*')
      .eq('judge_id', (judge as any).id)
      .order('event_date', { ascending: false });

    return res.json({
      success: true,
      profile: {
        id: (judge as any).id,
        username: (judge as any).username,
        fullName: (judge as any).full_name,
        profilePhoto: (judge as any).profile_photo,
        headline: (judge as any).headline,
        shortBio: (judge as any).short_bio,
        location: (judge as any).judge_location,
        currentRole: (judge as any).role_title,
        company: (judge as any).company,
        tier: (judge as any).tier,
        totalEventsJudged: (judge as any).total_events_judged,
        totalTeamsEvaluated: (judge as any).total_teams_evaluated,
        totalMentorshipHours: (judge as any).total_mentorship_hours,
        averageFeedbackRating: (judge as any).average_feedback_rating,
        eventsJudgedVerified: (judge as any).events_judged_verified,
        teamsEvaluatedVerified: (judge as any).teams_evaluated_verified,
        mentorshipHoursVerified: (judge as any).mentorship_hours_verified,
        availabilityStatus: (judge as any).availability_status,
        primaryExpertise: (judge as any).primary_expertise,
        secondaryExpertise: (judge as any).secondary_expertise
      },
      events: events || []
    });
  } catch (err: any) {
    console.error('Judge profile fetch error:', err);
    return res.status(500).json({ success: false, message: err?.message || 'Failed to fetch judge profile' });
  }
});

// DEPRECATED: Judge messages endpoint
// The judge account system has been removed in Platform Simplification.
// See: .kiro/specs/platform-simplification/requirements.md - Requirement 1, 17
app.get("/api/judge/messages", async (req: Request, res: Response) => {
  // Return empty array - feature removed
  return res.json({ items: [], total: 0 });
});

// DEPRECATED: Unread count endpoint
app.get("/api/judge/messages/unread-count", async (req: Request, res: Response) => {
  // Return 0 - feature removed
  return res.json({ unread: 0 });
});

// DEPRECATED: Mark message as read
app.post("/api/judge/messages/:id/read", async (req: Request, res: Response) => {
  // Return success - feature removed
  return res.json({ success: true, message: 'Feature deprecated' });
});

// Judge application submission
app.post("/api/judges/apply", async (req: Request, res: Response) => {
  try {
    if (!supabaseAdmin) {
      return res.status(500).json({ message: 'Server is not configured for Supabase' });
    }

    const body = req.body;

    // Validate required fields
    if (!body.username || !body.fullName || !body.email) {
      return res.status(400).json({ message: 'Missing required fields: username, fullName, email' });
    }

    // Check for existing username in applications
    const { data: existingUsername } = await supabaseAdmin
      .from('judge_applications')
      .select('id')
      .eq('username', body.username)
      .maybeSingle();

    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists in applications' });
    }

    // Check for existing email in applications
    const { data: existingEmail } = await supabaseAdmin
      .from('judge_applications')
      .select('id')
      .eq('email', body.email)
      .maybeSingle();

    if (existingEmail) {
      return res.status(400).json({ message: 'Email already registered in applications' });
    }

    // Check if already approved as judge
    const { data: existingJudge } = await supabaseAdmin
      .from('judges')
      .select('id')
      .or(`username.eq.${body.username},email.eq.${body.email}`)
      .maybeSingle();

    if (existingJudge) {
      return res.status(400).json({ message: 'You are already a registered judge or have a pending application' });
    }

    // Prepare application data
    const applicationData = {
      username: body.username,
      full_name: body.fullName,
      profile_photo: body.profilePhoto,
      headline: body.headline,
      short_bio: body.shortBio,
      judge_location: body.location,
      role_title: body.currentRole,
      company: body.company,
      primary_expertise: body.primaryExpertise || [],
      secondary_expertise: body.secondaryExpertise || [],
      total_events_judged: body.totalEventsJudged || 0,
      total_teams_evaluated: body.totalTeamsEvaluated || 0,
      total_mentorship_hours: body.totalMentorshipHours || 0,
      years_of_experience: body.yearsOfExperience || 0,
      average_feedback_rating: body.averageFeedbackRating,
      linkedin: body.linkedin,
      github: body.github,
      twitter: body.twitter,
      website: body.website,
      languages_spoken: body.languagesSpoken || [],
      public_achievements: body.publicAchievements,
      mentorship_statement: body.mentorshipStatement,
      availability_status: body.availabilityStatus || 'available',
      email: body.email,
      phone: body.phone,
      resume: body.resume,
      proof_of_judging: body.proofOfJudging,
      timezone: body.timezone,
      calendar_link: body.calendarLink,
      compensation_preference: body.compensationPreference,
      judge_references: body.references,
      conflict_of_interest: body.conflictOfInterest,
      agreed_to_nda: body.agreedToNDA || false,
      address: body.address,
      status: 'pending'
    };

    // Insert application
    const { data: application, error: applicationError } = await (supabaseAdmin as any)
      .from('judge_applications')
      .insert(applicationData)
      .select()
      .single();

    if (applicationError) {
      console.error('Application insert error:', applicationError);
      return res.status(500).json({ message: `Failed to submit application: ${applicationError.message}` });
    }

    // Add judge events if provided
    if (body.topEventsJudged && Array.isArray(body.topEventsJudged)) {
      const events = body.topEventsJudged
        .filter((event: any) => event.eventName && event.role && event.date)
        .map((event: any) => ({
          application_id: application.id,
          event_name: event.eventName,
          event_role: event.role,
          event_date: event.date,
          event_link: event.link || null,
          verified: false
        }));

      if (events.length > 0) {
        const { error: eventsError } = await (supabaseAdmin as any)
          .from('judge_application_events')
          .insert(events);

        if (eventsError) {
          console.error('Events insert error:', eventsError);
        }
      }
    }

    return res.status(201).json({
      message: 'Application submitted successfully! We will review your application and get back to you soon.',
      applicationId: application.id
    });
  } catch (err: any) {
    console.error('Judge application error:', err);
    return res.status(500).json({ message: err?.message || 'Failed to submit application' });
  }
});

// Get all published judges (public endpoint)
app.get("/api/judges", async (_req: Request, res: Response) => {
  try {
    if (!supabaseAdmin) {
      return res.status(500).json({ success: false, message: "Server is not configured for Supabase" });
    }

    // Get all published judges
    const { data: judges, error: judgesError } = await supabaseAdmin
      .from('judges')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (judgesError) {
      console.error('Judges fetch error:', judgesError);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch judges',
        error: judgesError.message
      });
    }

    const judgesList = (judges || []).map((judgeData: any) => ({
      id: judgeData.id,
      username: judgeData.username,
      fullName: judgeData.full_name,
      profilePhoto: judgeData.profile_photo,
      headline: judgeData.headline,
      shortBio: judgeData.short_bio,
      location: judgeData.judge_location,
      currentRole: judgeData.role_title,
      company: judgeData.company,
      primaryExpertise: judgeData.primary_expertise || [],
      secondaryExpertise: judgeData.secondary_expertise || [],
      totalEventsJudged: judgeData.total_events_judged || 0,
      totalTeamsEvaluated: judgeData.total_teams_evaluated || 0,
      totalMentorshipHours: judgeData.total_mentorship_hours || 0,
      yearsOfExperience: judgeData.years_of_experience || 0,
      averageFeedbackRating: judgeData.average_feedback_rating,
      eventsJudgedVerified: judgeData.events_judged_verified || false,
      teamsEvaluatedVerified: judgeData.teams_evaluated_verified || false,
      mentorshipHoursVerified: judgeData.mentorship_hours_verified || false,
      feedbackRatingVerified: judgeData.feedback_rating_verified || false,
      linkedin: judgeData.linkedin,
      github: judgeData.github,
      twitter: judgeData.twitter,
      website: judgeData.website,
      languagesSpoken: judgeData.languages_spoken || [],
      publicAchievements: judgeData.public_achievements,
      mentorshipStatement: judgeData.mentorship_statement,
      availabilityStatus: judgeData.availability_status || 'available',
      tier: judgeData.tier || 'starter',
      isPublished: judgeData.is_published || false,
      createdAt: judgeData.created_at
    }));
    return res.json(judgesList);
  } catch (err: any) {
    console.error('Judges fetch error:', err);
    return res.status(500).json({ success: false, message: err?.message || 'Failed to fetch judges' });
  }
});

// Get judge by username (public endpoint)
app.get("/api/judges/:username", async (req: Request, res: Response) => {
  try {
    if (!supabaseAdmin) {
      return res.status(500).json({ success: false, message: "Server is not configured for Supabase" });
    }

    const { username } = req.params;

    // Get judge data - use ilike for case-insensitive matching
    const { data: judge, error: judgeError } = await supabaseAdmin
      .from('judges')
      .select('*')
      .ilike('username', username)
      .eq('is_published', true)
      .single();

    if (judgeError || !judge) {
      return res.status(404).json({ success: false, message: 'Judge not found' });
    }

    // Get top events
    const { data: events, error: eventsError } = await supabaseAdmin
      .from('judge_events')
      .select('*')
      .eq('judge_id', (judge as any).id)
      .order('event_date', { ascending: false })
      .limit(5);

    const judgeData = judge as any;

    const response = {
      id: judgeData.id,
      username: judgeData.username,
      fullName: judgeData.full_name,
      profilePhoto: judgeData.profile_photo,
      headline: judgeData.headline,
      shortBio: judgeData.short_bio,
      location: judgeData.judge_location,
      currentRole: judgeData.role_title,
      company: judgeData.company,
      primaryExpertise: judgeData.primary_expertise || [],
      secondaryExpertise: judgeData.secondary_expertise || [],
      totalEventsJudged: judgeData.total_events_judged || 0,
      totalTeamsEvaluated: judgeData.total_teams_evaluated || 0,
      totalMentorshipHours: judgeData.total_mentorship_hours || 0,
      yearsOfExperience: judgeData.years_of_experience || 0,
      averageFeedbackRating: judgeData.average_feedback_rating,
      eventsJudgedVerified: judgeData.events_judged_verified || false,
      teamsEvaluatedVerified: judgeData.teams_evaluated_verified || false,
      mentorshipHoursVerified: judgeData.mentorship_hours_verified || false,
      feedbackRatingVerified: judgeData.feedback_rating_verified || false,
      linkedin: judgeData.linkedin,
      github: judgeData.github,
      twitter: judgeData.twitter,
      website: judgeData.website,
      email: judgeData.email,
      phone: judgeData.phone,
      address: judgeData.address,
      timezone: judgeData.timezone,
      compensationPreference: judgeData.compensation_preference,
      languagesSpoken: judgeData.languages_spoken || [],
      publicAchievements: judgeData.public_achievements,
      mentorshipStatement: judgeData.mentorship_statement,
      availabilityStatus: judgeData.availability_status || 'available',
      tier: judgeData.tier || 'starter',
      isPublished: judgeData.is_published || false,
      topEventsJudged: (events || []).map((e: any) => ({
        eventName: e.event_name,
        role: e.event_role,
        date: e.event_date,
        link: e.event_link,
        verified: e.verified || false
      }))
    };

    return res.json(response);
  } catch (err: any) {
    console.error('Judge fetch error:', err);
    return res.status(500).json({ success: false, message: err?.message || 'Failed to fetch judge' });
  }
});

export const handler = serverless(app);