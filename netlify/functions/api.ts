import express, { type Request, Response, NextFunction } from "express";
import serverless from "serverless-http";
import { createClient } from "@supabase/supabase-js";
import { Resend } from 'resend';

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

// Initialize Resend for emails
let resend: Resend | null = null;
const resendApiKey = process.env.RESEND_API_KEY;
if (resendApiKey) {
  resend = new Resend(resendApiKey);
}

// OTP Storage (in-memory for serverless - will reset between invocations)
// For production, consider using a database or Redis
interface OtpEntry {
  otp: string;
  email: string;
  password: string;
  name?: string;
  username?: string;
  expiresAt: number;
  attempts: number;
}
const otpStore = new Map<string, OtpEntry>();

// Generate 6-digit OTP
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Simple rate limiter
const rateBuckets = new Map<string, { tokens: number; last: number }>();
function rateLimit(userId: string, key: string, capacity = 10, refillMs = 60_000): boolean {
  const bucketKey = `${key}:${userId}`;
  const now = Date.now();
  const b = rateBuckets.get(bucketKey) || { tokens: capacity, last: now };
  const elapsed = now - b.last;
  if (elapsed > 0) {
    const refill = Math.floor(elapsed / refillMs) * capacity;
    b.tokens = Math.min(capacity, b.tokens + refill);
    b.last = now;
  }
  if (b.tokens <= 0) {
    rateBuckets.set(bucketKey, b);
    return false;
  }
  b.tokens -= 1;
  rateBuckets.set(bucketKey, b);
  return true;
}

// Disposable email domains list
const DISPOSABLE_DOMAINS = new Set([
  'tempmail.com', 'throwaway.email', 'guerrillamail.com', 'mailinator.com',
  '10minutemail.com', 'temp-mail.org', 'fakeinbox.com', 'trashmail.com',
  'yopmail.com', 'getnada.com', 'maildrop.cc', 'dispostable.com'
]);

// Quick email validation
function validateEmailQuick(email: string): { isValid: boolean; domain: string; issues: string[]; isSafe: boolean; isDisposable: boolean } {
  const issues: string[] = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    issues.push('Invalid email format');
    return { isValid: false, domain: '', issues, isSafe: false, isDisposable: false };
  }
  
  const domain = email.split('@')[1]?.toLowerCase() || '';
  const isDisposable = DISPOSABLE_DOMAINS.has(domain);
  
  if (isDisposable) {
    issues.push('Disposable email addresses are not allowed');
  }
  
  return {
    isValid: issues.length === 0,
    domain,
    issues,
    isSafe: !isDisposable,
    isDisposable
  };
}

// Send OTP email
async function sendOtpEmail(data: { email: string; otp: string; expiresInMinutes: number }): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    console.log('Email service not configured, skipping OTP email');
    return { success: true }; // Allow signup to proceed without email in dev
  }
  
  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@maximally.in',
      to: data.email,
      subject: 'Your Maximally Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Verify Your Email</h2>
          <p>Your verification code is:</p>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
            ${data.otp}
          </div>
          <p>This code expires in ${data.expiresInMinutes} minutes.</p>
          <p style="color: #666; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `
    });
    return { success: true };
  } catch (error: any) {
    console.error('Failed to send OTP email:', error);
    return { success: false, error: error.message };
  }
}

// Send welcome email
async function sendWelcomeEmail(data: { email: string; userName: string }): Promise<void> {
  if (!resend) return;
  
  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@maximally.in',
      to: data.email,
      subject: 'Welcome to Maximally!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Maximally, ${data.userName}!</h2>
          <p>Your account has been created successfully.</p>
          <p>Start exploring hackathons and building amazing projects!</p>
          <a href="https://maximally.in" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">Get Started</a>
        </div>
      `
    });
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
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

// ============================================
// AUTH ROUTES
// ============================================

// Step 1: Request OTP for signup
app.post("/api/auth/signup-request-otp", async (req: Request, res: Response) => {
  try {
    if (!supabaseAdmin) {
      return res.status(500).json({ success: false, message: "Server is not configured for Supabase" });
    }

    const { email, password, name, username } = req.body as {
      email?: string;
      password?: string;
      name?: string;
      username?: string;
    };

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    if (!password || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Rate limiting
    const clientIP = req.ip || (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 'unknown';
    if (!rateLimit(clientIP, 'otp:request', 5, 3600_000)) {
      return res.status(429).json({ success: false, message: 'Too many OTP requests. Please try again later.' });
    }

    // Validate email
    const emailValidation = validateEmailQuick(normalizedEmail);
    if (!emailValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: emailValidation.issues[0] || 'Invalid email address'
      });
    }

    // Check if user already exists
    const { data: existingUsers } = await (supabaseAdmin as any).auth.admin.listUsers();
    const userExists = existingUsers?.users?.some((u: any) => u.email?.toLowerCase() === normalizedEmail);
    
    if (userExists) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    // Generate OTP
    const skipOtp = process.env.SKIP_EMAIL_OTP === 'true';
    const otp = skipOtp ? '123456' : generateOtp();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    // Store OTP
    otpStore.set(normalizedEmail, {
      otp,
      email: normalizedEmail,
      password,
      name: name?.trim(),
      username: username?.trim(),
      expiresAt,
      attempts: 0,
    });

    if (skipOtp) {
      return res.json({
        success: true,
        message: 'Verification code sent to your email',
        email: normalizedEmail,
        dev_otp: otp,
      });
    }

    // Send OTP email
    const emailResult = await sendOtpEmail({
      email: normalizedEmail,
      otp,
      expiresInMinutes: 10,
    });

    if (!emailResult.success) {
      otpStore.delete(normalizedEmail);
      return res.status(500).json({ success: false, message: 'Failed to send verification email. Please try again.' });
    }

    return res.json({
      success: true,
      message: 'Verification code sent to your email',
      email: normalizedEmail,
    });

  } catch (err: any) {
    console.error('OTP request error:', err);
    return res.status(500).json({ success: false, message: err?.message || 'Failed to send verification code' });
  }
});

// Step 2: Verify OTP and create account
app.post("/api/auth/signup-verify-otp", async (req: Request, res: Response) => {
  try {
    if (!supabaseAdmin) {
      return res.status(500).json({ success: false, message: "Server is not configured for Supabase" });
    }

    const { email, otp } = req.body as { email?: string; otp?: string };

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and verification code are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Rate limiting
    const clientIP = req.ip || (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 'unknown';
    if (!rateLimit(clientIP, 'otp:verify', 10, 3600_000)) {
      return res.status(429).json({ success: false, message: 'Too many verification attempts. Please try again later.' });
    }

    // Get stored OTP entry
    const otpEntry = otpStore.get(normalizedEmail);

    if (!otpEntry) {
      return res.status(400).json({ success: false, message: 'No pending verification found. Please request a new code.' });
    }

    if (otpEntry.expiresAt < Date.now()) {
      otpStore.delete(normalizedEmail);
      return res.status(400).json({ success: false, message: 'Verification code has expired. Please request a new one.' });
    }

    if (otpEntry.attempts >= 5) {
      otpStore.delete(normalizedEmail);
      return res.status(400).json({ success: false, message: 'Too many failed attempts. Please request a new code.' });
    }

    if (otpEntry.otp !== otp.trim()) {
      otpEntry.attempts += 1;
      otpStore.set(normalizedEmail, otpEntry);
      const remainingAttempts = 5 - otpEntry.attempts;
      return res.status(400).json({ 
        success: false, 
        message: `Invalid verification code. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.` 
      });
    }

    // Create user
    const { data: userData, error: createError } = await (supabaseAdmin as any).auth.admin.createUser({
      email: otpEntry.email,
      password: otpEntry.password,
      email_confirm: true,
      user_metadata: {
        full_name: otpEntry.name || null,
        username: otpEntry.username || null,
        signup_method: 'otp_verified',
        otp_verified: true,
      },
    });

    otpStore.delete(normalizedEmail);

    if (createError) {
      if (createError.message?.includes('already registered') || createError.message?.includes('already exists')) {
        return res.status(409).json({ success: false, message: 'An account with this email already exists' });
      }
      return res.status(400).json({ success: false, message: createError.message });
    }

    const user = userData?.user;
    if (!user?.id) {
      return res.status(500).json({ success: false, message: 'User created but no user data returned' });
    }

    // Send welcome email
    sendWelcomeEmail({
      email: user.email!,
      userName: otpEntry.name || otpEntry.username || user.email!.split('@')[0],
    }).catch(err => console.error('Welcome email failed:', err));

    return res.json({
      success: true,
      message: 'Account created successfully! You can now sign in.',
      user: {
        id: user.id,
        email: user.email,
        email_confirmed_at: user.email_confirmed_at,
        username: user.user_metadata?.username || null
      }
    });

  } catch (err: any) {
    console.error('OTP verification error:', err);
    return res.status(500).json({ success: false, message: err?.message || 'Failed to verify code' });
  }
});

// Resend OTP
app.post("/api/auth/resend-otp", async (req: Request, res: Response) => {
  try {
    const { email } = req.body as { email?: string };

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!rateLimit(normalizedEmail, 'otp:resend', 3, 600_000)) {
      return res.status(429).json({ success: false, message: 'Please wait before requesting another code.' });
    }

    const existingEntry = otpStore.get(normalizedEmail);

    if (!existingEntry) {
      return res.status(400).json({ success: false, message: 'No pending signup found. Please start the signup process again.' });
    }

    const newOtp = generateOtp();
    existingEntry.otp = newOtp;
    existingEntry.expiresAt = Date.now() + 10 * 60 * 1000;
    existingEntry.attempts = 0;
    otpStore.set(normalizedEmail, existingEntry);

    const emailResult = await sendOtpEmail({
      email: normalizedEmail,
      otp: newOtp,
      expiresInMinutes: 10,
    });

    if (!emailResult.success) {
      return res.status(500).json({ success: false, message: 'Failed to send verification email. Please try again.' });
    }

    return res.json({
      success: true,
      message: 'New verification code sent to your email',
    });

  } catch (err: any) {
    console.error('Resend OTP error:', err);
    return res.status(500).json({ success: false, message: err?.message || 'Failed to resend code' });
  }
});

// Email validation endpoint
app.post("/api/auth/validate-email", async (req: Request, res: Response) => {
  try {
    const { email } = req.body as { email?: string };

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const clientIP = req.ip || (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 'unknown';
    if (!rateLimit(clientIP, 'email:validate', 20, 60_000)) {
      return res.status(429).json({ success: false, message: 'Too many validation requests' });
    }

    const validation = validateEmailQuick(email);

    return res.json({
      success: true,
      validation: {
        isValid: validation.isValid,
        domain: validation.domain,
        issues: validation.issues,
        isSafe: validation.isSafe,
        isDisposable: validation.isDisposable
      }
    });

  } catch (err: any) {
    console.error('Email validation error:', err);
    return res.status(500).json({ success: false, message: 'Failed to validate email' });
  }
});

// ============================================
// JUDGE ROUTES (existing)
// ============================================

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