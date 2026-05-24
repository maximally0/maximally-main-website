// @ts-nocheck

/**
 * 🚀 NETLIFY SERVERLESS FUNCTION - PRODUCTION API ENTRY POINT
 * 
 * This file handles ALL API requests in production.
 * 
 * ✅ ADDING NEW ROUTES:
 * 1. Create route module in server/routes/my-feature.ts
 * 2. Import it here: import { registerMyFeatureRoutes } from "../../server/routes/my-feature";
 * 3. Call it in the "REGISTER ROUTE MODULES" section below
 * 4. Run `npm run validate:routes` to verify
 * 
 * ⚠️ IMPORTANT: All route modules MUST be imported and called here!
 * Routes not registered here will return 404 in production.
 * 
 * 📖 See ROUTE_GUIDELINES.md for detailed instructions
 */

import express, { type Request, Response, NextFunction } from "express";
import serverless from "serverless-http";
import { Resend } from 'resend';
import { getSupabaseAdmin } from "../../server/supabaseAdmin";
import { registerCoreRoutes } from "../../server/routes/core-routes";
import { registerOrganizerRoutes } from "../../server/routes/organizer";
import { registerOrganizerApplicationRoutes } from "../../server/routes/organizer-applications";
import { registerAdminOrganizerApplicationRoutes } from "../../server/routes/admin-organizer-applications";
import { registerAdminHackathonRoutes } from "../../server/routes/admin-hackathons";
import { registerHackathonRegistrationRoutes } from "../../server/routes/hackathon-registration";
import { registerOrganizerAdvancedRoutes } from "../../server/routes/organizer-advanced";
import { registerPublicHackathonRoutes } from "../../server/routes/public-hackathons";
import { registerJudgeInvitationRoutes } from "../../server/routes/judge-invitations";
import { registerJudgeProfileRoutes } from "../../server/routes/judge-profile";
import { registerSimpleJudgeRoutes } from "../../server/routes/judge-profile-simple";
import { registerJudgingRoutes } from "../../server/routes/judging";
import { registerFileUploadRoutes } from "../../server/routes/file-uploads";
import { registerHackathonFeatureRoutes } from "../../server/routes/hackathon-features";
import { registerOrganizerMessageRoutes } from "../../server/routes/organizer-messages";
import { registerModerationRoutes } from "../../server/routes/moderation";
import { registerGalleryRoutes } from "../../server/routes/gallery";
import { registerCustomQuestionsRoutes } from "../../server/routes/custom-questions";
import { registerJudgeReminderRoutes } from "../../server/routes/judge-reminders";
import { registerJudgeScoringRoutes } from "../../server/routes/judge-scoring";
import { registerSimplifiedJudgesRoutes } from "../../server/routes/simplified-judges";
import { registerAutoPublishGalleryRoutes } from "../../server/routes/auto-publish-gallery";
import { registerCertificateRoutes } from "../../server/routes/certificates";
import { registerSubmissionModerationRoutes } from "../../server/routes/submission-moderation";
import { registerFeaturedContentRoutes } from "../../server/routes/featured-content";
import { registerEdgeCaseTestRoutes } from "../../server/routes/edge-case-tests";
import { registerDocsRoutes } from "../../server/routes/docs";
import { registerNewsletterRoutes } from "../../server/routes/newsletter";
import { registerAdminNewsletterRoutes } from "../../server/routes/admin-newsletter";
import { registerDbProxyRoutes } from "../../server/routes/db-proxy";
// Role-based profiles routes
import { registerBlogRoutes } from "../../server/routes/blogs";
import { registerMentorRoutes } from "../../server/routes/mentors";
import { registerMentorshipRoutes } from "../../server/routes/mentorship";
import { registerJudgeEvaluationRoutes } from "../../server/routes/judge-evaluations";
import { registerRoleRoutes } from "../../server/routes/roles";
import { registerProfileRoutes } from "../../server/routes/profiles";
import { registerOAuthCallbackRoutes } from "../../server/routes/oauth-callback";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS middleware
app.use((_req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5002',
    'http://localhost:5001',
    'https://maximally.in',
    'https://www.maximally.in',
    'https://maximally.org',
    'https://www.maximally.org',
    'https://maximally.netlify.app',
    'https://maximally-admin-panel.vercel.app',
    'https://maximally-admin-panel-git-master-gautamxgambhir.vercel.app'
  ];

  const origin = _req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Invite-Token');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (_req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// Initialize Supabase admin client
let supabaseAdmin: any;
try {
  supabaseAdmin = getSupabaseAdmin();
  app.locals.supabaseAdmin = supabaseAdmin;
} catch (e) {
  console.error('[api] Failed to initialize Supabase admin:', e);
}

// Initialize Resend for emails
let resend: Resend | null = null;
const resendApiKey = process.env.RESEND_API_KEY;
if (resendApiKey) {
  resend = new Resend(resendApiKey);
}


// Rate limiter
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

// OTP Storage using Supabase
async function storeOtp(supabase: any, email: string, data: any): Promise<boolean> {
  try {
    await supabase.from('signup_otps').delete().eq('email', email);
    const { error } = await supabase.from('signup_otps').insert({
      email, otp_hash: data.otp, password_encrypted: data.password,
      name: data.name || null, username: data.username || null,
      expires_at: data.expires_at, attempts: data.attempts
    });
    return !error;
  } catch { return false; }
}

async function getOtp(supabase: any, email: string): Promise<any> {
  try {
    const { data, error } = await supabase.from('signup_otps').select('*').eq('email', email).single();
    if (error || !data) return null;
    return { otp: data.otp_hash, email: data.email, password: data.password_encrypted,
      name: data.name, username: data.username, expires_at: data.expires_at, attempts: data.attempts };
  } catch { return null; }
}

async function updateOtpAttempts(supabase: any, email: string, attempts: number): Promise<boolean> {
  try { await supabase.from('signup_otps').update({ attempts }).eq('email', email); return true; } catch { return false; }
}

async function deleteOtp(supabase: any, email: string): Promise<boolean> {
  try { await supabase.from('signup_otps').delete().eq('email', email); return true; } catch { return false; }
}

// Disposable email domains
const DISPOSABLE_DOMAINS = new Set(['tempmail.com', 'throwaway.email', 'guerrillamail.com', 'mailinator.com',
  '10minutemail.com', 'temp-mail.org', 'fakeinbox.com', 'trashmail.com', 'yopmail.com', 'getnada.com', 'maildrop.cc']);

function validateEmailQuick(email: string) {
  const issues: string[] = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) { issues.push('Invalid email format'); return { isValid: false, domain: '', issues, isSafe: false, isDisposable: false }; }
  const domain = email.split('@')[1]?.toLowerCase() || '';
  const isDisposable = DISPOSABLE_DOMAINS.has(domain);
  if (isDisposable) issues.push('Disposable email addresses are not allowed');
  return { isValid: issues.length === 0, domain, issues, isSafe: !isDisposable, isDisposable };
}

function generateOtp(): string { return Math.floor(100000 + Math.random() * 900000).toString(); }

async function sendOtpEmail(data: { email: string; otp: string; expiresInMinutes: number }) {
  if (!resend) return { success: true };
  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@maximally.in', to: data.email,
      subject: 'Your Maximally Verification Code',
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify Your Email</h2><p>Your verification code is:</p>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">${data.otp}</div>
        <p>This code expires in ${data.expiresInMinutes} minutes.</p></div>`
    });
    return { success: true };
  } catch (e: any) { return { success: false, error: e.message }; }
}

async function sendWelcomeEmail(data: { email: string; userName: string }) {
  if (!resend) return;
  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@maximally.in', to: data.email,
      subject: 'Welcome to Maximally!',
      html: `<div style="font-family: Arial, sans-serif;"><h2>Welcome to Maximally, ${data.userName}!</h2>
        <p>Your account has been created successfully.</p>
        <a href="https://maximally.in" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Get Started</a></div>`
    });
  } catch {}
}

// bearerUserId: validates JWT via Neon Auth
async function bearerUserId(supabase: any, token: string): Promise<string | null> {
  try {
    // Check if this is a Neon Auth admin client (has custom getUser method)
    if (supabase.auth && typeof supabase.auth.getUser === 'function') {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      return error || !user ? null : user.id;
    }
    
    // Fallback for regular Supabase client
    const { data: { user }, error } = await supabase.auth.getUser(token);
    return error || !user ? null : user.id;
  } catch {
    return null;
  }
}

// ============================================
// ORGANIZERS PUBLIC DIRECTORY
// ============================================
app.get("/api/organizers", async (_req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const { data, error } = await (supabaseAdmin as any)
      .from('profiles')
      .select('id, username, full_name, avatar_url, bio, location, website_url, created_at')
      .eq('role', 'organizer')
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ success: false, message: error.message });

    // Get organizer_profiles for extra stats
    const { data: orgProfiles } = await (supabaseAdmin as any)
      .from('organizer_profiles')
      .select('user_id, total_hackathons_hosted, total_participants_reached, tier');

    const orgMap = new Map((orgProfiles || []).map((o: any) => [o.user_id, o]));

    const result = (data ?? []).map((p: any) => {
      const op = orgMap.get(p.id) as any;
      return {
        id: p.id,
        username: p.username,
        full_name: p.full_name,
        avatar_url: p.avatar_url,
        bio: p.bio,
        location: p.location,
        website_url: p.website_url,
        organizer_status: 'active',
        events_organized: op?.total_hackathons_hosted ?? 0,
        total_participants_managed: op?.total_participants_reached ?? 0,
        organizer_tier: op?.tier ?? null,
      };
    });
    return res.json(result);
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

// ============================================
// HEALTH & UTILITY ROUTES
// ============================================
app.get("/api/health", (_req, res) => res.json({ 
  ok: true,
  timestamp: new Date().toISOString(),
  config: {
    neonAuthUrl: !!process.env.NEON_AUTH_URL,
    databaseUrl: !!process.env.DATABASE_URL,
    supabaseAdmin: !!supabaseAdmin,
    hasSupabaseUrl: !!process.env.SUPABASE_URL,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    supabaseUrlPrefix: process.env.SUPABASE_URL?.substring(0, 30) || 'NOT SET'
  }
}));

// Debug endpoint to check incoming request path
app.get("/api/debug/path", (req, res) => {
  return res.json({
    success: true,
    path: req.path,
    url: req.url,
    originalUrl: req.originalUrl,
    baseUrl: req.baseUrl,
    method: req.method
  });
});

app.get("/api/debug/routes", (_req, res) => {
  const routes = [
    'GET /api/organizer/hackathons',
    'GET /api/organizer/hackathons/:id',
    'GET /api/organizer/hackathons/:hackathonId/my-role',
    'GET /api/organizer/hackathons/:hackathonId/registrations',
    'GET /api/organizer/hackathons/:hackathonId/submissions',
    'GET /api/projects/:projectId'
  ];
  return res.json({ 
    success: true, 
    message: 'Netlify function is running with all routes',
    timestamp: new Date().toISOString(),
    routes,
    totalRoutes: routes.length
  });
});

app.get("/api/notifications/unread-count", (_req, res) => res.json({ success: true, count: 0 }));

app.post("/api/verify-captcha", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: 'CAPTCHA token is required' });
    const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
    if (!RECAPTCHA_SECRET_KEY) return res.status(500).json({ success: false, message: 'CAPTCHA not configured' });
    const clientIP = req.ip || (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 'unknown';
    if (!rateLimit(clientIP, 'captcha:verify', 10, 60_000)) return res.status(429).json({ success: false, message: 'Too many attempts' });
    const params = new URLSearchParams(); params.append('secret', RECAPTCHA_SECRET_KEY); params.append('response', token);
    const verificationResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', { method: 'POST', body: params, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    const result = await verificationResponse.json();
    if (!result.success) return res.json({ success: false, message: 'CAPTCHA verification failed' });
    if (result.score !== undefined && result.score < 0.3) return res.json({ success: false, message: 'Security verification failed' });
    return res.json({ success: true, message: 'CAPTCHA verification successful', score: result.score });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});


// ============================================
// AUTH ROUTES
// ============================================
app.post("/api/auth/signup-request-otp", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const { email, password, name, username } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
    if (!password || password.length < 8) return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    const normalizedEmail = email.trim().toLowerCase();
    const clientIP = req.ip || (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 'unknown';
    if (!rateLimit(clientIP, 'otp:request', 5, 3600_000)) return res.status(429).json({ success: false, message: 'Too many OTP requests' });
    const emailValidation = validateEmailQuick(normalizedEmail);
    if (!emailValidation.isValid) return res.status(400).json({ success: false, message: emailValidation.issues[0] });
    const { data: existingUsers } = await (supabaseAdmin as any).auth.admin.listUsers();
    if (existingUsers?.users?.some((u: any) => u.email?.toLowerCase() === normalizedEmail)) return res.status(409).json({ success: false, message: 'Account already exists' });
    const skipOtp = process.env.SKIP_EMAIL_OTP === 'true';
    const otp = skipOtp ? '123456' : generateOtp();
    const stored = await storeOtp(supabaseAdmin, normalizedEmail, { otp, password, name: name?.trim(), username: username?.trim(), expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), attempts: 0 });
    if (!stored) return res.status(500).json({ success: false, message: 'Failed to process request' });
    if (skipOtp) return res.json({ success: true, message: 'Verification code sent', email: normalizedEmail, dev_otp: otp });
    const emailResult = await sendOtpEmail({ email: normalizedEmail, otp, expiresInMinutes: 10 });
    if (!emailResult.success) { await deleteOtp(supabaseAdmin, normalizedEmail); return res.status(500).json({ success: false, message: 'Failed to send verification email' }); }
    return res.json({ success: true, message: 'Verification code sent', email: normalizedEmail });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.post("/api/auth/signup-direct", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    
    const { email, password, name, username } = req.body;
    
    // Validate input
    if (!email || !password || !name || !username) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }
    
    if (name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Name must be at least 2 characters' });
    }
    
    if (username.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'Username must be at least 3 characters' });
    }
    
    const normalizedEmail = email.toLowerCase().trim();
    const emailValidation = validateEmailQuick(normalizedEmail);
    if (!emailValidation.isValid) {
      return res.status(400).json({ success: false, message: emailValidation.issues[0] });
    }
    
    // Check if email already exists
    const { data: existingUsers } = await (supabaseAdmin as any).auth.admin.listUsers();
    if (existingUsers?.users?.some((u: any) => u.email?.toLowerCase() === normalizedEmail)) {
      return res.status(409).json({ success: false, message: 'Account already exists' });
    }
    
    // Check if username already exists
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('username')
      .eq('username', username.trim())
      .single();
    
    if (existingProfile) {
      return res.status(400).json({ success: false, message: 'Username is already taken' });
    }
    
    // Create user account with auto-confirmation
    const { data: userData, error: createError } = await (supabaseAdmin as any).auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: name.trim(),
        username: username.trim(),
        signup_method: 'direct',
        otp_verified: false // No OTP used
      }
    });
    
    if (createError) {
      console.error('Direct signup error:', createError);
      return res.status(400).json({ success: false, message: createError.message });
    }
    
    // Create profile record
    if (userData.user) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: userData.user.id,
          email: userData.user.email,
          username: username.trim(),
          full_name: name.trim(),
          role: 'participant', // Default role
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Try to clean up the user if profile creation fails
        await (supabaseAdmin as any).auth.admin.deleteUser(userData.user.id);
        return res.status(500).json({ success: false, message: 'Failed to create user profile' });
      }
    }
    
    return res.status(201).json({
      success: true,
      user: {
        id: userData.user.id,
        email: userData.user.email,
        username: username.trim(),
        full_name: name.trim()
      },
      message: 'Account created successfully'
    });
    
  } catch (error) {
    console.error('Direct signup function error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post("/api/auth/signup-verify-otp", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and code required' });
    const normalizedEmail = email.trim().toLowerCase();
    const clientIP = req.ip || (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 'unknown';
    if (!rateLimit(clientIP, 'otp:verify', 10, 3600_000)) return res.status(429).json({ success: false, message: 'Too many attempts' });
    const otpEntry = await getOtp(supabaseAdmin, normalizedEmail);
    if (!otpEntry) return res.status(400).json({ success: false, message: 'No pending verification found' });
    if (new Date(otpEntry.expires_at).getTime() < Date.now()) { await deleteOtp(supabaseAdmin, normalizedEmail); return res.status(400).json({ success: false, message: 'Code expired' }); }
    if (otpEntry.attempts >= 5) { await deleteOtp(supabaseAdmin, normalizedEmail); return res.status(400).json({ success: false, message: 'Too many failed attempts' }); }
    if (otpEntry.otp !== otp.trim()) { await updateOtpAttempts(supabaseAdmin, normalizedEmail, otpEntry.attempts + 1); return res.status(400).json({ success: false, message: `Invalid code. ${5 - otpEntry.attempts - 1} attempts remaining.` }); }
    const { data: userData, error: createError } = await (supabaseAdmin as any).auth.admin.createUser({ email: otpEntry.email, password: otpEntry.password, email_confirm: true, user_metadata: { full_name: otpEntry.name, username: otpEntry.username, signup_method: 'otp_verified', otp_verified: true } });
    await deleteOtp(supabaseAdmin, normalizedEmail);
    if (createError) return res.status(400).json({ success: false, message: createError.message });
    const user = userData?.user;
    if (!user?.id) return res.status(500).json({ success: false, message: 'User created but no data returned' });
    sendWelcomeEmail({ email: user.email!, userName: otpEntry.name || otpEntry.username || user.email!.split('@')[0] }).catch(() => {});
    return res.json({ success: true, message: 'Account created successfully!', user: { id: user.id, email: user.email, username: user.user_metadata?.username } });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.post("/api/auth/resend-otp", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
    const normalizedEmail = email.trim().toLowerCase();
    if (!rateLimit(normalizedEmail, 'otp:resend', 3, 600_000)) return res.status(429).json({ success: false, message: 'Please wait before requesting another code' });
    const existingEntry = await getOtp(supabaseAdmin, normalizedEmail);
    if (!existingEntry) return res.status(400).json({ success: false, message: 'No pending signup found' });
    const newOtp = generateOtp();
    await storeOtp(supabaseAdmin, normalizedEmail, { otp: newOtp, password: existingEntry.password, name: existingEntry.name, username: existingEntry.username, expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), attempts: 0 });
    const emailResult = await sendOtpEmail({ email: normalizedEmail, otp: newOtp, expiresInMinutes: 10 });
    if (!emailResult.success) return res.status(500).json({ success: false, message: 'Failed to send email' });
    return res.json({ success: true, message: 'New verification code sent' });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.post("/api/auth/validate-email", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
    const clientIP = req.ip || (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 'unknown';
    if (!rateLimit(clientIP, 'email:validate', 20, 60_000)) return res.status(429).json({ success: false, message: 'Too many requests' });
    const validation = validateEmailQuick(email);
    return res.json({ success: true, validation });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.get("/api/auth/check-password-status", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Missing token' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const { data: userData } = await (supabaseAdmin as any).auth.admin.getUserById(userId);
    if (!userData?.user) return res.status(404).json({ success: false, message: 'User not found' });
    const user = userData.user;
    const hasEmailIdentity = user.identities?.some((i: any) => i.provider === 'email');
    const hasPassword = hasEmailIdentity || user.user_metadata?.has_password === true;
    return res.json({ success: true, hasPassword: !!hasPassword, identities: user.identities?.map((i: any) => i.provider) || [] });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.post("/api/auth/change-password", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Missing token' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    if (!rateLimit(userId, 'password:change', 3, 300_000)) return res.status(429).json({ success: false, message: 'Too many attempts' });
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    const { data: currentUser } = await (supabaseAdmin as any).auth.admin.getUserById(userId);
    const { error } = await (supabaseAdmin as any).auth.admin.updateUserById(userId, { password: newPassword, user_metadata: { ...currentUser?.user?.user_metadata, has_password: true, password_set_at: new Date().toISOString() } });
    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, message: 'Password updated successfully' });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.post("/api/auth/ensure-profile", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Missing token' });
    const token = authHeader.toString().slice(7);
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user?.id) return res.status(401).json({ success: false, message: 'Invalid token' });
    console.log(`Ensuring profile exists for user: ${user.id}`);
    const { data: existingProfile } = await supabaseAdmin.from('profiles').select('*').eq('id', user.id).maybeSingle();
    if (existingProfile) {
      console.log(`Profile already exists for user: ${user.id}`);
      return res.json({ success: true, profile: existingProfile, created: false });
    }
    try {
      console.log(`Creating auth.users record for user: ${user.id}`);
      const { error: authUserError } = await supabaseAdmin.from('auth.users').upsert({
        id: user.id, email: user.email || null, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        raw_user_meta_data: { full_name: user.name || null, name: user.name || null, avatar_url: user.image || null }
      }, { onConflict: 'id' });
      if (authUserError) console.error('Error creating auth.users record:', authUserError);
      else console.log(`Auth.users record created successfully for user: ${user.id}`);
    } catch (authError) { console.error('Auth users table error:', authError); }
    let username = user.username;
    if (!username && (user.name || user.email)) {
      const baseName = user.name || user.email?.split('@')[0] || 'user';
      username = baseName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20);
      if (username.length < 3) username = 'user' + username;
      const randomSuffix = Math.random().toString(36).slice(2, 6);
      username = username + randomSuffix;
    }
    console.log(`Creating profile record for user: ${user.id} with avatar: ${user.image || user.picture}`);
    const { data: profile, error: profileError } = await supabaseAdmin.from('profiles').upsert({
      id: user.id, email: user.email || null, full_name: user.name || null, username: username || null,
      avatar_url: user.image || user.picture || null, // Check both image and picture fields
      role: 'user', created_at: new Date().toISOString(), updated_at: new Date().toISOString()
    }, { onConflict: 'id' }).select().maybeSingle();
    if (profileError) {
      console.error('Error creating profile:', profileError);
      return res.status(500).json({ success: false, message: profileError.message });
    }
    console.log(`Profile created successfully for user: ${user.id}`);
    return res.json({ success: true, profile: profile, created: true });
  } catch (e: any) {
    console.error('Ensure profile error:', e);
    return res.status(500).json({ success: false, message: e.message });
  }
});


// ============================================
// ACCOUNT ROUTES
// ============================================
app.post("/api/account/delete", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Missing token' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    await (supabaseAdmin as any).from('profiles').delete().eq('id', userId);
    const { error } = await (supabaseAdmin as any).auth.admin.deleteUser(userId);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.json({ success: true });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.post("/api/admin/invite", async (req, res) => {
  try {
    const adminTokenHeader = req.headers["x-admin-invite-token"] as string;
    const ADMIN_INVITE_TOKEN = process.env.ADMIN_INVITE_TOKEN;
    if (!ADMIN_INVITE_TOKEN || adminTokenHeader !== ADMIN_INVITE_TOKEN) return res.status(401).json({ success: false, message: "Unauthorized" });
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email required" });
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const { data, error } = await (supabaseAdmin as any).auth.admin.inviteUserByEmail(email);
    if (error) return res.status(400).json({ success: false, message: error.message });
    const invitedUser = data?.user;
    if (!invitedUser?.id) return res.status(500).json({ success: false, message: "Invite succeeded but user not returned" });
    await (supabaseAdmin as any).from("profiles").upsert({ id: invitedUser.id, email, role: "admin" }, { onConflict: "id" });
    return res.json({ success: true, message: "Admin invite sent", user_id: invitedUser.id });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

// ============================================
// PROFILE ROUTES
// ============================================
// Profile: Create (called after Neon Auth signup)
app.post("/api/profile/create", async (req, res) => {
  try {
    const { id, email, full_name, username, role } = req.body;
    if (!id) return res.status(400).json({ success: false, message: "id required" });
    
    // Check if profile already exists
    const { data: existing } = await supabaseAdmin.from('profiles').select('id').eq('id', id).maybeSingle();
    if (existing) {
      // Profile already exists, return it
      const { data: profile } = await supabaseAdmin.from('profiles').select('*').eq('id', id).single();
      return res.json({ success: true, data: profile });
    }
    
    // First, ensure the user exists in auth.users (required for foreign key constraint)
    const { error: authUserError } = await supabaseAdmin.from('auth.users').upsert({
      id,
      email: email || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      raw_user_meta_data: {
        full_name: full_name || null,
        name: full_name || null
      }
    }, { onConflict: 'id' });
    
    if (authUserError) {
      console.error('Error creating auth.users record:', authUserError);
      // Continue anyway, as the auth.users table might be managed differently
    }
    
    // Now create the profile
    const { data, error } = await supabaseAdmin.from('profiles').upsert({
      id, 
      email: email || null, 
      full_name: full_name || null,
      username: username || null, 
      role: role || 'user',
      created_at: new Date().toISOString(), 
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' }).select().maybeSingle();
    
    if (error) {
      console.error('Error creating profile:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
    
    return res.json({ success: true, data });
  } catch (e: any) { 
    console.error('Profile creation error:', e);
    return res.status(500).json({ success: false, message: e.message }); 
  }
});

app.post("/api/profile/update", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Missing token' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    if (!rateLimit(userId, 'profile:update', 10, 60_000)) return res.status(429).json({ success: false, message: 'Too many updates' });
    const body = req.body;
    const updateData: any = {};
    if (body.full_name !== undefined) updateData.full_name = body.full_name?.trim()?.slice(0, 100) || null;
    if (body.bio !== undefined) updateData.bio = body.bio?.trim()?.slice(0, 500) || null;
    if (body.location !== undefined) updateData.location = body.location?.trim()?.slice(0, 100) || null;
    if (body.avatar_url !== undefined) updateData.avatar_url = body.avatar_url || null;
    if (body.linkedin !== undefined) updateData.linkedin = body.linkedin?.trim()?.slice(0, 200) || null;
    if (body.github !== undefined) updateData.github = body.github?.trim()?.slice(0, 200) || null;
    if (body.twitter !== undefined) updateData.twitter = body.twitter?.trim()?.slice(0, 200) || null;
    if (body.website !== undefined) updateData.website = body.website?.trim()?.slice(0, 200) || null;
    const { data, error } = await (supabaseAdmin as any).from('profiles').update(updateData).eq('id', userId).select().single();
    if (error) throw error;
    return res.json({ success: true, data });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.get("/api/user/export-data", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Missing token' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const { data: profile } = await (supabaseAdmin as any).from('profiles').select('*').eq('id', userId).single();
    const { data: registrations } = await (supabaseAdmin as any).from('hackathon_registrations').select('*').eq('user_id', userId);
    const { data: submissions } = await (supabaseAdmin as any).from('hackathon_submissions').select('*').eq('user_id', userId);
    const { data: certificates } = await (supabaseAdmin as any).from('certificates').select('*').eq('participant_email', profile?.email);
    return res.json({ success: true, data: { profile, registrations: registrations || [], submissions: submissions || [], certificates: certificates || [], exported_at: new Date().toISOString() } });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

// Profile: Get by userId (missing endpoint that client is calling)
app.get("/api/profiles", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const { userId, username } = req.query;
    
    if (!userId && !username) {
      return res.status(400).json({ success: false, message: "userId or username parameter required" });
    }

    let query = supabaseAdmin.from('profiles').select('*');
    
    if (userId) {
      query = query.eq('id', userId as string);
    } else if (username) {
      query = query.eq('username', username as string);
    }

    const { data: profile, error } = await query.maybeSingle();
    
    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    return res.json({ success: true, data: profile });
  } catch (e: any) { 
    return res.status(500).json({ success: false, message: e.message }); 
  }
});


// ============================================
// CERTIFICATE ROUTES
// ============================================
app.get("/api/certificates/verify/:certificate_id", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const { certificate_id } = req.params;
    if (!certificate_id) return res.status(400).json({ success: false, status: "invalid_id", message: "Invalid certificate ID" });
    const clientIP = req.ip || (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 'unknown';
    if (!rateLimit(clientIP, 'certificate:verify', 30, 60_000)) return res.status(429).json({ success: false, message: 'Too many requests' });
    const { data: cert, error } = await (supabaseAdmin as any).from('certificates').select('*').eq('certificate_id', certificate_id.toUpperCase()).single();
    if (error || !cert) return res.json({ success: true, status: "invalid_id", message: "Invalid certificate ID", certificate_id: certificate_id.toUpperCase() });
    if (cert.status !== 'active') return res.json({ success: true, status: "revoked", message: "Certificate has been revoked", certificate_id: certificate_id.toUpperCase(), certificate: { participant_name: cert.participant_name, hackathon_name: cert.hackathon_name, type: cert.type } });
    return res.json({ success: true, status: "verified", message: "Certificate is valid", certificate_id: certificate_id.toUpperCase(), certificate: { participant_name: cert.participant_name, hackathon_name: cert.hackathon_name, type: cert.type, position: cert.position, created_at: cert.created_at } });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.get("/api/user/:username/certificates", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const { username } = req.params;
    const { data: profile } = await (supabaseAdmin as any).from('profiles').select('id, email, username').eq('username', username).single();
    if (!profile) return res.status(404).json({ success: false, message: 'User not found' });
    const { data: certificates } = await (supabaseAdmin as any).from('certificates').select('certificate_id, participant_name, hackathon_name, type, position, created_at, jpg_url, pdf_url').or(`participant_email.eq.${profile.email},maximally_username.eq.${username}`).eq('status', 'active').order('created_at', { ascending: false });
    return res.json({ success: true, certificates: certificates || [] });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

// ============================================
// JUDGE ROUTES
// ============================================
app.get("/api/judges", async (_req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    // Get all profiles with role=judge, joined with judges table for extra data
    const { data: profiles, error } = await (supabaseAdmin as any)
      .from('profiles')
      .select('id, username, full_name, avatar_url, bio, location, skills, github_username, linkedin_username, twitter_username, website_url, total_events_judged, total_teams_evaluated, total_mentorship_hours, is_verified, created_at')
      .eq('role', 'judge')
      .order('total_events_judged', { ascending: false });
    if (error) return res.status(500).json({ success: false, message: error.message });

    // Get judges table data for tier/category info
    const { data: judgesData } = await (supabaseAdmin as any)
      .from('judges')
      .select('user_id, assigned_category, evaluation_status, hackathons_judged, is_active');

    const judgesMap = new Map((judgesData || []).map((j: any) => [j.user_id, j]));

    const judgesList = (profiles || []).map((p: any) => {
      const jd = judgesMap.get(p.id) as any;
      return {
        id: p.id,
        username: p.username,
        fullName: p.full_name,
        profilePhoto: p.avatar_url,
        headline: null,
        shortBio: p.bio,
        location: p.location,
        currentRole: null,
        company: null,
        primaryExpertise: p.skills ?? [],
        secondaryExpertise: [],
        totalEventsJudged: p.total_events_judged ?? 0,
        totalTeamsEvaluated: p.total_teams_evaluated ?? 0,
        totalMentorshipHours: p.total_mentorship_hours ?? 0,
        yearsOfExperience: 0,
        averageFeedbackRating: null,
        eventsJudgedVerified: p.is_verified ?? false,
        teamsEvaluatedVerified: p.is_verified ?? false,
        mentorshipHoursVerified: false,
        feedbackRatingVerified: false,
        linkedin: p.linkedin_username ? `https://linkedin.com/in/${p.linkedin_username}` : null,
        github: p.github_username ? `https://github.com/${p.github_username}` : null,
        twitter: p.twitter_username ? `https://twitter.com/${p.twitter_username}` : null,
        website: p.website_url,
        languagesSpoken: [],
        publicAchievements: null,
        mentorshipStatement: null,
        availabilityStatus: jd?.is_active ? 'available' : 'unavailable',
        tier: 'starter',
        isPublished: true,
        createdAt: p.created_at,
        topEventsJudged: jd?.hackathons_judged ?? [],
      };
    });
    return res.json(judgesList);
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.get("/api/judges/:username", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const { username } = req.params;
    const { data: profile, error } = await (supabaseAdmin as any)
      .from('profiles')
      .select('id, username, full_name, avatar_url, bio, location, skills, github_username, linkedin_username, twitter_username, website_url, total_events_judged, total_teams_evaluated, total_mentorship_hours, is_verified, created_at')
      .eq('username', username)
      .eq('role', 'judge')
      .maybeSingle();
    if (error || !profile) return res.status(404).json({ success: false, message: 'Judge not found' });
    const { data: jd } = await (supabaseAdmin as any).from('judges').select('assigned_category, hackathons_judged, is_active').eq('user_id', profile.id).maybeSingle();
    return res.json({
      id: profile.id, username: profile.username, fullName: profile.full_name, profilePhoto: profile.avatar_url,
      headline: null, shortBio: profile.bio, location: profile.location, currentRole: null, company: null,
      primaryExpertise: profile.skills ?? [], secondaryExpertise: [],
      totalEventsJudged: profile.total_events_judged ?? 0, totalTeamsEvaluated: profile.total_teams_evaluated ?? 0,
      totalMentorshipHours: profile.total_mentorship_hours ?? 0, yearsOfExperience: 0, averageFeedbackRating: null,
      eventsJudgedVerified: profile.is_verified ?? false, teamsEvaluatedVerified: profile.is_verified ?? false,
      mentorshipHoursVerified: false, feedbackRatingVerified: false,
      linkedin: profile.linkedin_username ? `https://linkedin.com/in/${profile.linkedin_username}` : null,
      github: profile.github_username ? `https://github.com/${profile.github_username}` : null,
      twitter: profile.twitter_username ? `https://twitter.com/${profile.twitter_username}` : null,
      website: profile.website_url, languagesSpoken: [], publicAchievements: null, mentorshipStatement: null,
      availabilityStatus: (jd as any)?.is_active ? 'available' : 'unavailable', tier: 'starter',
      topEventsJudged: (jd as any)?.hackathons_judged ?? [],
    });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.get("/api/judge/profile", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Missing token' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const { data: profile } = await (supabaseAdmin as any).from('profiles').select('*').eq('id', userId).single();
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });
    if (profile.role !== 'judge') return res.status(403).json({ success: false, message: 'Judge role required' });
    const { data: judge } = await (supabaseAdmin as any).from('judges').select('*').eq('username', profile.username).single();
    if (!judge) return res.status(404).json({ success: false, message: 'Judge profile not found' });
    const { data: events } = await (supabaseAdmin as any).from('judge_events').select('*').eq('judge_id', judge.id).order('event_date', { ascending: false });
    return res.json({ success: true, profile: { id: judge.id, username: judge.username, fullName: judge.full_name, profilePhoto: judge.profile_photo, headline: judge.headline, shortBio: judge.short_bio, location: judge.judge_location, currentRole: judge.role_title, company: judge.company, tier: judge.tier, totalEventsJudged: judge.total_events_judged, totalTeamsEvaluated: judge.total_teams_evaluated, totalMentorshipHours: judge.total_mentorship_hours, averageFeedbackRating: judge.average_feedback_rating, availabilityStatus: judge.availability_status, primaryExpertise: judge.primary_expertise, secondaryExpertise: judge.secondary_expertise }, events: events || [] });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.get("/api/judge/messages", (_req, res) => res.json({ items: [], total: 0 }));
app.get("/api/judge/messages/unread-count", (_req, res) => res.json({ unread: 0 }));
app.post("/api/judge/messages/:id/read", (_req, res) => res.json({ success: true, message: 'Feature deprecated' }));

// GET /api/judge/scoring-links - get tokenized scoring links for the authenticated judge
app.get("/api/judge/scoring-links", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const token = authHeader.toString().slice(7);
    const { data: { user }, error: authError } = await (supabaseAdmin as any).auth.getUser(token);
    if (authError || !user) return res.status(401).json({ success: false, message: 'Invalid token' });

    // Get profile email
    const { data: profile } = await (supabaseAdmin as any).from('profiles').select('email').eq('id', user.id).single();
    if (!profile?.email) return res.json({ success: true, data: [] });

    // Find hackathon_judges entries by email
    const { data: judgeEntries } = await (supabaseAdmin as any)
      .from('hackathon_judges')
      .select('id, name, email, hackathon_id')
      .eq('email', profile.email);

    if (!judgeEntries?.length) return res.json({ success: true, data: [] });

    const judgeIds = judgeEntries.map((j: any) => j.id);

    // Get scoring tokens
    const { data: tokens } = await (supabaseAdmin as any)
      .from('judge_scoring_tokens')
      .select('judge_id, token, expires_at, created_at')
      .in('judge_id', judgeIds);

    const tokenMap = new Map((tokens || []).map((t: any) => [t.judge_id, t]));

    // Get hackathon names
    const hackathonIds = [...new Set(judgeEntries.map((j: any) => j.hackathon_id))];
    const { data: hackathons } = await (supabaseAdmin as any)
      .from('organizer_hackathons')
      .select('id, hackathon_name, slug')
      .in('id', hackathonIds);

    const hackathonMap = new Map((hackathons || []).map((h: any) => [h.id, h]));

    const result = judgeEntries.map((j: any) => {
      const t = tokenMap.get(j.id) as any;
      const h = hackathonMap.get(j.hackathon_id) as any;
      return {
        judge_id: j.id,
        hackathon_id: j.hackathon_id,
        hackathon_name: h?.hackathon_name ?? `Hackathon #${j.hackathon_id}`,
        hackathon_slug: h?.slug ?? null,
        token: t?.token ?? null,
        expires_at: t?.expires_at ?? null,
        scoring_url: t?.token ? `${process.env.FRONTEND_URL || 'https://maximally.org'}/judge/${t.token}` : null,
      };
    });

    return res.json({ success: true, data: result });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

// GET /api/judge/requests - get judge invitations and requests for the authenticated judge
app.get("/api/judge/requests", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });

    const { data, error } = await (supabaseAdmin as any)
      .from('judge_requests')
      .select(`
        id, hackathon_id, request_type, status, message, created_at,
        hackathon:organizer_hackathons(id, hackathon_name, start_date, end_date)
      `)
      .eq('judge_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      // Table may not exist yet — return empty gracefully
      return res.json({ success: true, data: [] });
    }
    return res.json({ success: true, data: data || [] });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

// POST /api/judge-requests/:id/accept - accept a judge invitation
app.post("/api/judge-requests/:id/accept", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });

    const { id } = req.params;
    const { error } = await (supabaseAdmin as any)
      .from('judge_requests')
      .update({ status: 'accepted', updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('judge_id', userId);

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.json({ success: true, message: 'Invitation accepted' });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

// POST /api/judge-requests/:id/reject - decline a judge invitation
app.post("/api/judge-requests/:id/reject", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });

    const { id } = req.params;
    const { error } = await (supabaseAdmin as any)
      .from('judge_requests')
      .update({ status: 'rejected', updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('judge_id', userId);

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.json({ success: true, message: 'Invitation declined' });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});


app.post("/api/judges/apply", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ message: 'Server not configured' });
    const body = req.body;
    if (!body.username || !body.fullName || !body.email) return res.status(400).json({ message: 'Missing required fields: username, fullName, email' });
    const { data: existingUsername } = await (supabaseAdmin as any).from('judge_applications').select('id').eq('username', body.username).maybeSingle();
    if (existingUsername) return res.status(400).json({ message: 'Username already exists in applications' });
    const { data: existingEmail } = await (supabaseAdmin as any).from('judge_applications').select('id').eq('email', body.email).maybeSingle();
    if (existingEmail) return res.status(400).json({ message: 'Email already registered in applications' });
    const { data: existingJudge } = await (supabaseAdmin as any).from('judges').select('id').or(`username.eq.${body.username},email.eq.${body.email}`).maybeSingle();
    if (existingJudge) return res.status(400).json({ message: 'You are already a registered judge' });
    const applicationData = {
      username: body.username, full_name: body.fullName, profile_photo: body.profilePhoto, headline: body.headline, short_bio: body.shortBio,
      judge_location: body.location, role_title: body.currentRole, company: body.company, primary_expertise: body.primaryExpertise || [],
      secondary_expertise: body.secondaryExpertise || [], total_events_judged: body.totalEventsJudged || 0, total_teams_evaluated: body.totalTeamsEvaluated || 0,
      total_mentorship_hours: body.totalMentorshipHours || 0, years_of_experience: body.yearsOfExperience || 0, average_feedback_rating: body.averageFeedbackRating,
      linkedin: body.linkedin, github: body.github, twitter: body.twitter, website: body.website, languages_spoken: body.languagesSpoken || [],
      public_achievements: body.publicAchievements, mentorship_statement: body.mentorshipStatement, availability_status: body.availabilityStatus || 'available',
      email: body.email, phone: body.phone, resume: body.resume, proof_of_judging: body.proofOfJudging, timezone: body.timezone, calendar_link: body.calendarLink,
      compensation_preference: body.compensationPreference, judge_references: body.references, conflict_of_interest: body.conflictOfInterest,
      agreed_to_nda: body.agreedToNDA || false, address: body.address, status: 'pending'
    };
    const { data: application, error } = await (supabaseAdmin as any).from('judge_applications').insert(applicationData).select().single();
    if (error) return res.status(500).json({ message: `Failed to submit: ${error.message}` });
    if (body.topEventsJudged && Array.isArray(body.topEventsJudged)) {
      const events = body.topEventsJudged.filter((e: any) => e.eventName && e.role && e.date).map((e: any) => ({ application_id: application.id, event_name: e.eventName, event_role: e.role, event_date: e.date, event_link: e.link || null, verified: false }));
      if (events.length > 0) await (supabaseAdmin as any).from('judge_application_events').insert(events);
    }
    return res.status(201).json({ message: 'Application submitted successfully!', applicationId: application.id });
  } catch (e: any) { return res.status(500).json({ message: e.message }); }
});

// Admin: get all judge applications
app.get("/api/admin/judge-applications", async (_req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: 'Server not configured' });
    const { data, error } = await (supabaseAdmin as any)
      .from('judge_applications')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.json(data || []);
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

// Admin: approve judge application → promote user to judge role
app.post("/api/admin/judge-applications/:id/approve", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: 'Server not configured' });
    const { id } = req.params;
    const { data: app, error: fetchErr } = await (supabaseAdmin as any)
      .from('judge_applications').select('*').eq('id', id).single();
    if (fetchErr || !app) return res.status(404).json({ success: false, message: 'Application not found' });
    await (supabaseAdmin as any).from('judge_applications')
      .update({ status: 'approved', reviewed_at: new Date().toISOString() }).eq('id', id);
    // Promote user to judge role by email
    const { error: profileErr } = await (supabaseAdmin as any).from('profiles')
      .update({ role: 'judge', updated_at: new Date().toISOString() }).eq('email', app.email);
    if (profileErr) console.error('[judge-approve] profile update error:', profileErr);
    return res.json({ success: true, message: 'Application approved and user promoted to judge.' });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

// Admin: reject judge application
app.post("/api/admin/judge-applications/:id/reject", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: 'Server not configured' });
    const { id } = req.params;
    const { notes } = req.body;
    const { error } = await (supabaseAdmin as any).from('judge_applications')
      .update({ status: 'rejected', admin_notes: notes || null, reviewed_at: new Date().toISOString() }).eq('id', id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.json({ success: true, message: 'Application rejected.' });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

// Admin: delete judge application
app.delete("/api/admin/judge-applications/:id", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: 'Server not configured' });
    const { id } = req.params;
    const { error } = await (supabaseAdmin as any).from('judge_applications').delete().eq('id', id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.json({ success: true });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

// ============================================
// MENTOR APPLICATION ROUTE
// ============================================
app.post("/api/mentor/apply", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: 'Server not configured' });
    const body = req.body;
    if (!body.username || !body.full_name || !body.email) {
      return res.status(400).json({ success: false, message: 'Missing required fields: username, full_name, email' });
    }
    // Check for duplicate application
    const { data: existing } = await (supabaseAdmin as any)
      .from('mentor_applications')
      .select('id, status')
      .eq('email', body.email)
      .maybeSingle();
    if (existing) {
      if (existing.status === 'pending') return res.status(400).json({ success: false, message: 'You already have a pending mentor application.' });
      if (existing.status === 'approved') return res.status(400).json({ success: false, message: 'You are already an approved mentor.' });
    }
    // Check if already a mentor
    const { data: existingMentor } = await (supabaseAdmin as any)
      .from('profiles')
      .select('role')
      .eq('email', body.email)
      .maybeSingle();
    if (existingMentor?.role === 'mentor') {
      return res.status(400).json({ success: false, message: 'You are already a mentor.' });
    }
    const { data: application, error } = await (supabaseAdmin as any)
      .from('mentor_applications')
      .upsert({
        user_id: body.user_id || null,
        username: body.username,
        email: body.email,
        full_name: body.full_name,
        bio: body.bio || null,
        location: body.location || null,
        skills: body.skills || [],
        expertise_areas: body.expertise_areas || [],
        years_of_experience: body.years_of_experience || 0,
        why_mentor: body.why_mentor || null,
        availability: body.availability || null,
        max_mentees: body.max_mentees || 3,
        linkedin: body.linkedin || null,
        github: body.github || null,
        twitter: body.twitter || null,
        website: body.website || null,
        phone: body.phone || null,
        timezone: body.timezone || null,
        agreed_to_terms: body.agreed_to_terms || false,
        status: 'pending',
        updated_at: new Date().toISOString()
      }, { onConflict: 'email' })
      .select()
      .single();
    if (error) return res.status(500).json({ success: false, message: `Failed to submit: ${error.message}` });
    return res.status(201).json({ success: true, message: 'Mentor application submitted successfully!', applicationId: application.id });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

// Admin: get all mentor applications
app.get("/api/admin/mentor-applications", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: 'Server not configured' });
    const { data, error } = await (supabaseAdmin as any)
      .from('mentor_applications')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.json(data || []);
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

// Admin: approve mentor application
app.post("/api/admin/mentor-applications/:id/approve", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: 'Server not configured' });
    const { id } = req.params;
    const { data: app, error: fetchErr } = await (supabaseAdmin as any)
      .from('mentor_applications').select('*').eq('id', id).single();
    if (fetchErr || !app) return res.status(404).json({ success: false, message: 'Application not found' });
    // Update application status
    await (supabaseAdmin as any).from('mentor_applications').update({ status: 'approved', reviewed_at: new Date().toISOString() }).eq('id', id);
    // Promote user to mentor role
    if (app.user_id) {
      await (supabaseAdmin as any).from('profiles').update({ role: 'mentor', updated_at: new Date().toISOString() }).eq('id', app.user_id);
    } else {
      // Try to find by email
      await (supabaseAdmin as any).from('profiles').update({ role: 'mentor', updated_at: new Date().toISOString() }).eq('email', app.email);
    }
    return res.json({ success: true, message: 'Mentor application approved and user promoted to mentor.' });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

// Admin: reject mentor application
app.post("/api/admin/mentor-applications/:id/reject", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: 'Server not configured' });
    const { id } = req.params;
    const { notes } = req.body;
    const { error } = await (supabaseAdmin as any).from('mentor_applications')
      .update({ status: 'rejected', admin_notes: notes || null, reviewed_at: new Date().toISOString() }).eq('id', id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.json({ success: true, message: 'Application rejected.' });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

// Admin: delete mentor application
app.delete("/api/admin/mentor-applications/:id", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: 'Server not configured' });
    const { id } = req.params;
    const { error } = await (supabaseAdmin as any).from('mentor_applications').delete().eq('id', id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.json({ success: true });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

// ============================================
// HACKATHON ROUTES
// ============================================
app.get("/api/hackathons/:slug", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const { slug } = req.params;
    const { data, error } = await (supabaseAdmin as any).from('organizer_hackathons').select('*').eq('slug', slug).eq('status', 'published').single();
    if (error || !data) return res.status(404).json({ success: false, message: 'Hackathon not found' });
    return res.json({ success: true, data });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.post("/api/hackathons/:slug/view", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const { slug } = req.params;
    await (supabaseAdmin as any).rpc('increment_hackathon_views', { hackathon_slug: slug });
    return res.json({ success: true });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.get("/api/hackathons/:hackathonId/my-submission", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const { hackathonId } = req.params;
    const { data, error } = await (supabaseAdmin as any).from('hackathon_submissions').select('*').eq('hackathon_id', hackathonId).eq('user_id', userId).single();
    if (error && error.code !== 'PGRST116') throw error;
    return res.json({ success: true, data: data || null });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.get("/api/hackathons/:hackathonId/my-registration", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const { hackathonId } = req.params;
    const { data, error } = await (supabaseAdmin as any).from('hackathon_registrations').select('*').eq('hackathon_id', hackathonId).eq('user_id', userId).single();
    if (error && error.code !== 'PGRST116') throw error;
    return res.json({ success: true, data: data || null });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.post("/api/hackathons/:hackathonId/register", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const { hackathonId } = req.params;
    const body = req.body;
    const { data: existing } = await (supabaseAdmin as any).from('hackathon_registrations').select('id').eq('hackathon_id', hackathonId).eq('user_id', userId).single();
    if (existing) return res.status(400).json({ success: false, message: 'Already registered' });
    const regNumber = `REG-${Date.now().toString(36).toUpperCase()}`;
    const { data, error } = await (supabaseAdmin as any).from('hackathon_registrations').insert({ hackathon_id: hackathonId, user_id: userId, registration_number: regNumber, registration_type: body.registration_type || 'individual', status: 'confirmed', full_name: body.full_name, email: body.email, phone: body.phone, ...body }).select().single();
    if (error) throw error;
    await (supabaseAdmin as any).rpc('increment_hackathon_registrations', { hackathon_id: parseInt(hackathonId) });
    return res.json({ success: true, data });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.post("/api/hackathons/:hackathonId/submit", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const { hackathonId } = req.params;
    const submissionData = req.body;
    const { data: registration } = await (supabaseAdmin as any).from('hackathon_registrations').select('id, team_id').eq('hackathon_id', hackathonId).eq('user_id', userId).single();
    if (!registration) return res.status(403).json({ success: false, message: 'You must be registered to submit' });
    const { data: existing } = await (supabaseAdmin as any).from('hackathon_submissions').select('id').eq('hackathon_id', hackathonId).eq('user_id', userId).single();
    if (existing) {
      const { data, error } = await (supabaseAdmin as any).from('hackathon_submissions').update({ ...submissionData, submitted_at: submissionData.status === 'submitted' ? new Date().toISOString() : null }).eq('id', existing.id).select().single();
      if (error) throw error;
      return res.json({ success: true, data });
    } else {
      const { data, error } = await (supabaseAdmin as any).from('hackathon_submissions').insert({ hackathon_id: hackathonId, user_id: userId, team_id: registration.team_id, ...submissionData, submitted_at: submissionData.status === 'submitted' ? new Date().toISOString() : null }).select().single();
      if (error) throw error;
      return res.json({ success: true, data });
    }
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

// ============================================
// PROJECT ROUTES (handles both gallery and hackathon submissions)
// ============================================
// Get individual project details (public) - checks both gallery_projects and hackathon_submissions
app.get("/api/projects/:projectId", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const { projectId } = req.params;

    // Get current user if authenticated
    let currentUserId: string | null = null;
    const authHeader = req.headers['authorization'];
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      currentUserId = userId;
    }

    // First try gallery_projects table
    const { data: galleryProject, error: galleryError } = await (supabaseAdmin as any)
      .from('gallery_projects')
      .select(`
        *,
        profiles:user_id(username, full_name, avatar_url),
        hackathon:hackathon_id(hackathon_name, slug)
      `)
      .eq('id', projectId)
      .single();

    if (galleryProject && !galleryError) {
      const gp = galleryProject;
      
      // Check if project is viewable (approved/featured OR owner viewing their own)
      const isOwner = currentUserId && gp.user_id === currentUserId;
      const isPublic = gp.status === 'approved' || gp.status === 'featured';
      
      if (isPublic || isOwner) {
        // Found in gallery_projects - format response
        const enrichedData = {
          id: gp.id,
          project_name: gp.name,
          tagline: gp.tagline,
          description: gp.description,
          github_repo: gp.github_url,
          demo_url: gp.demo_url,
          video_url: gp.video_url,
          cover_image: gp.cover_image_url,
          project_logo: gp.logo_url,
          technologies_used: gp.technologies || [],
          submitted_at: gp.created_at,
          prize_won: gp.hackathon_position,
          score: null,
          feedback: null,
          source: 'gallery',
          status: gp.status,
          user_name: gp.profiles?.full_name || gp.profiles?.username || 'Anonymous',
          hackathon: gp.hackathon ? {
            hackathon_name: gp.hackathon.hackathon_name,
            slug: gp.hackathon.slug
          } : null,
          team: null
        };
        return res.json({ success: true, data: enrichedData });
      }
    }

    // Not in gallery, try hackathon_submissions
    const { data: submission, error: submissionError } = await (supabaseAdmin as any)
      .from('hackathon_submissions')
      .select(`
        *,
        team:hackathon_teams(team_name, team_code),
        hackathon:organizer_hackathons(hackathon_name, slug)
      `)
      .eq('id', projectId)
      .eq('status', 'submitted')
      .single();

    if (submissionError || !submission) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Get user name for hackathon submission
    const { data: profile } = await (supabaseAdmin as any).from('profiles').select('username, full_name').eq('id', submission.user_id).single();

    const enrichedData = {
      ...submission,
      source: 'hackathon',
      user_name: profile?.full_name || profile?.username || 'Anonymous'
    };

    return res.json({ success: true, data: enrichedData });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

// Get project by source and ID (gallery or hackathon)
app.get("/api/projects/:source/:projectId", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const { source, projectId } = req.params;

    // Get current user if authenticated
    let currentUserId: string | null = null;
    const authHeader = req.headers['authorization'];
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      currentUserId = userId;
    }

    if (source === 'gallery') {
      const { data: galleryProject, error } = await (supabaseAdmin as any)
        .from('gallery_projects')
        .select(`
          *,
          profiles:user_id(username, full_name, avatar_url),
          hackathon:hackathon_id(hackathon_name, slug)
        `)
        .eq('id', projectId)
        .single();

      if (error || !galleryProject) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }

      const gp = galleryProject;
      
      // Check if project is viewable (approved/featured OR owner viewing their own)
      const isOwner = currentUserId && gp.user_id === currentUserId;
      const isPublic = gp.status === 'approved' || gp.status === 'featured';
      
      if (!isPublic && !isOwner) {
        return res.status(404).json({ success: false, message: 'Project not found or not public' });
      }

      const enrichedData = {
        id: gp.id,
        project_name: gp.name,
        tagline: gp.tagline,
        description: gp.description,
        github_repo: gp.github_url,
        demo_url: gp.demo_url,
        video_url: gp.video_url,
        cover_image: gp.cover_image_url,
        project_logo: gp.logo_url,
        technologies_used: gp.technologies || [],
        submitted_at: gp.created_at,
        prize_won: gp.hackathon_position,
        score: null,
        feedback: null,
        source: 'gallery',
        status: gp.status,
        user_name: gp.profiles?.full_name || gp.profiles?.username || 'Anonymous',
        hackathon: gp.hackathon ? {
          hackathon_name: gp.hackathon.hackathon_name,
          slug: gp.hackathon.slug
        } : null,
        team: null
      };
      return res.json({ success: true, data: enrichedData });
    } 
    
    if (source === 'hackathon') {
      const { data: submission, error } = await (supabaseAdmin as any)
        .from('hackathon_submissions')
        .select(`
          *,
          team:hackathon_teams(team_name, team_code),
          hackathon:organizer_hackathons(hackathon_name, slug)
        `)
        .eq('id', projectId)
        .eq('status', 'submitted')
        .single();

      if (error || !submission) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }

      const { data: profile } = await (supabaseAdmin as any).from('profiles').select('username, full_name').eq('id', submission.user_id).single();

      const enrichedData = {
        ...submission,
        source: 'hackathon',
        user_name: profile?.full_name || profile?.username || 'Anonymous'
      };

      return res.json({ success: true, data: enrichedData });
    }

    return res.status(400).json({ success: false, message: 'Invalid source. Must be "gallery" or "hackathon"' });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

// ============================================
// REGISTER ROUTE MODULES
// ============================================
// All API routes are handled by these route modules
// IMPORTANT: Core routes must be registered FIRST (contains auth, health, etc.)
registerCoreRoutes(app);
registerOAuthCallbackRoutes(app); // OAuth callback handling for profile creation
registerOrganizerRoutes(app);
registerOrganizerApplicationRoutes(app);
registerAdminOrganizerApplicationRoutes(app);
registerAdminHackathonRoutes(app);
registerHackathonRegistrationRoutes(app);
registerOrganizerAdvancedRoutes(app);
registerPublicHackathonRoutes(app);
registerJudgeInvitationRoutes(app);
registerJudgeProfileRoutes(app);
registerSimpleJudgeRoutes(app);
registerJudgingRoutes(app);
registerFileUploadRoutes(app);
registerHackathonFeatureRoutes(app);
registerOrganizerMessageRoutes(app);
registerModerationRoutes(app);
registerGalleryRoutes(app);
registerCustomQuestionsRoutes(app);
registerJudgeReminderRoutes(app);
registerJudgeScoringRoutes(app);
registerSimplifiedJudgesRoutes(app);
registerAutoPublishGalleryRoutes(app);
registerCertificateRoutes(app);
registerSubmissionModerationRoutes(app);
registerFeaturedContentRoutes(app);
registerEdgeCaseTestRoutes(app);
registerDocsRoutes(app);
registerNewsletterRoutes(app);
registerAdminNewsletterRoutes(app);
registerDbProxyRoutes(app); // DB proxy for admin panel frontend
registerBlogRoutes(app);

// Role-based profiles routes
registerProfileRoutes(app);
registerMentorRoutes(app);
registerMentorshipRoutes(app);
registerJudgeEvaluationRoutes(app);
registerRoleRoutes(app);

// ============================================
// CATCH-ALL ROUTE (MUST BE LAST)
// ============================================
app.use('/api/*', (_req: Request, res: Response) => {
  return res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// Export the handler - serverless-http reads event.path directly from the Netlify event
// The path is already correct (/api/mentors etc.) from the redirect
export const handler = serverless(app);
