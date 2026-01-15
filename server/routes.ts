// @ts-nocheck
import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createClient } from "@supabase/supabase-js";
import { registerOrganizerRoutes } from "./routes/organizer";
import { registerAdminHackathonRoutes } from "./routes/admin-hackathons";
import { registerHackathonRegistrationRoutes } from "./routes/hackathon-registration";
import { registerOrganizerAdvancedRoutes } from "./routes/organizer-advanced";
import { registerPublicHackathonRoutes } from "./routes/public-hackathons";
import { registerJudgeInvitationRoutes } from "./routes/judge-invitations";
import { registerJudgeProfileRoutes } from "./routes/judge-profile";
import { registerSimpleJudgeRoutes } from "./routes/judge-profile-simple";
import { registerJudgingRoutes } from "./routes/judging";
import { registerFileUploadRoutes } from "./routes/file-uploads";
import { registerHackathonFeatureRoutes } from "./routes/hackathon-features";
import { registerOrganizerMessageRoutes } from "./routes/organizer-messages";
import { registerModerationRoutes } from "./routes/moderation";
import { registerGalleryRoutes } from "./routes/gallery";
import { registerCustomQuestionsRoutes } from "./routes/custom-questions";
import { registerJudgeReminderRoutes } from "./routes/judge-reminders";
import { registerJudgeScoringRoutes } from "./routes/judge-scoring";
import { registerSimplifiedJudgesRoutes } from "./routes/simplified-judges";
import { registerAutoPublishGalleryRoutes } from "./routes/auto-publish-gallery";
import { registerCertificateRoutes } from "./routes/certificates";
import { registerSubmissionModerationRoutes } from "./routes/submission-moderation";
import { registerFeaturedContentRoutes } from "./routes/featured-content";
// import { registerNotificationRoutes } from "./routes/notifications"; // REMOVED - Notification system disabled
import { 
  sendSubmissionConfirmation, 
  sendAnnouncement, 
  sendWinnerNotification, 
  sendWelcomeEmail,
  sendDeadlineReminder,
  sendHackathonStartingSoonEmail,
  sendOtpEmail,
  sendOrganizerPromotionEmail
} from "./services/email";

// Simple per-user rate limiter (token bucket) in memory
const rateBuckets = new Map<string, { tokens: number; last: number }>();
function rateLimit(userId: string, key: string, capacity = 10, refillMs = 60_000): boolean {
  const bucketKey = `${key}:${userId}`;
  const now = Date.now();
  const b = rateBuckets.get(bucketKey) || { tokens: capacity, last: now };
  // Refill tokens
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

// OTP Storage (in-memory, expires after 10 minutes)
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

// Clean expired OTPs periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of otpStore.entries()) {
    if (entry.expiresAt < now) {
      otpStore.delete(key);
    }
  }
}, 60_000); // Clean every minute

function bearerUserId(supabaseAdmin: any, token: string): Promise<string | null> {
  return supabaseAdmin.auth.getUser(token).then((r: any) => (r?.data?.user?.id ? r.data.user.id : null));
}

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Health check
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  // CAPTCHA verification endpoint
  app.post("/api/verify-captcha", async (req: Request, res: Response) => {
    try {
      const { token } = req.body as { token?: string };

      if (!token || typeof token !== 'string') {
        return res.status(400).json({ success: false, message: 'CAPTCHA token is required' });
      }

      const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
      if (!RECAPTCHA_SECRET_KEY) {
        console.error('RECAPTCHA_SECRET_KEY not configured');
        return res.status(500).json({ success: false, message: 'CAPTCHA verification not configured' });
      }

      // Rate limiting - 10 CAPTCHA verifications per IP per minute
      const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
      if (!rateLimit(clientIP, 'captcha:verify', 10, 60_000)) {
        return res.status(429).json({ success: false, message: 'Too many CAPTCHA verification attempts' });
      }

      // Verify CAPTCHA with Google's API
      const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify';
      const params = new URLSearchParams();
      params.append('secret', RECAPTCHA_SECRET_KEY);
      params.append('response', token);
      params.append('remoteip', clientIP);

      const verificationResponse = await fetch(verificationUrl, {
        method: 'POST',
        body: params,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const verificationResult = await verificationResponse.json();

      if (!verificationResult.success) {
        return res.json({
          success: false,
          message: 'CAPTCHA verification failed',
          errors: verificationResult['error-codes']
        });
      }

      // For reCAPTCHA v3, check the score if provided
      if (verificationResult.score !== undefined) {
        const minimumScore = 0.3; // Lowered threshold for better user experience
        if (verificationResult.score < minimumScore) {
          return res.json({
            success: false,
            message: 'Security verification failed. Please try again.',
            score: verificationResult.score
          });
        }
      }

      return res.json({
        success: true,
        message: 'CAPTCHA verification successful',
        score: verificationResult.score,
        action: verificationResult.action
      });
    } catch (err: any) {
      console.error('CAPTCHA verification error:', err);
      return res.status(500).json({
        success: false,
        message: 'CAPTCHA verification failed due to server error'
      });
    }
  });

  // Secure admin invite endpoint
  app.post("/api/admin/invite", async (req: Request, res: Response) => {
    try {
      const adminTokenHeader = req.headers["x-admin-invite-token"] as string | undefined;
      const ADMIN_INVITE_TOKEN = process.env.ADMIN_INVITE_TOKEN;
      if (!ADMIN_INVITE_TOKEN || adminTokenHeader !== ADMIN_INVITE_TOKEN) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { email } = req.body as { email?: string };
      if (!email || typeof email !== "string") {
        return res.status(400).json({ success: false, message: "Invalid payload: 'email' is required" });
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format" });
      }

      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
      const SUPABASE_URL = process.env.SUPABASE_URL;
      if (!supabaseAdmin || !SUPABASE_URL) {
        return res.status(500).json({ success: false, message: "Server is not configured for Supabase" });
      }

      // Send an invite; if user exists, Supabase will throw an error
      const { data, error } = await (supabaseAdmin as any).auth.admin.inviteUserByEmail(email);
      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

      const invitedUser = data?.user;
      if (!invitedUser?.id) {
        return res.status(500).json({ success: false, message: "Invite succeeded but user was not returned" });
      }

      // Upsert profile with role=admin
      const { error: upsertErr } = await supabaseAdmin
        .from("profiles")
        .upsert({ id: invitedUser.id, email, role: "admin" } as any, { onConflict: "id" });

      if (upsertErr) {
        return res.status(500).json({ success: false, message: `User invited but failed to set admin profile: ${upsertErr.message}` });
      }

      return res.json({ success: true, message: "Admin invite sent and profile updated", user_id: invitedUser.id });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err?.message || "Unexpected error" });
    }
  });

  // Account deletion endpoint (requires authenticated Bearer token)
  app.post("/api/account/delete", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
      const SUPABASE_URL = process.env.SUPABASE_URL;
      if (!supabaseAdmin || !SUPABASE_URL) {
        return res.status(500).json({ success: false, message: "Server is not configured for Supabase" });
      }

      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.toString().startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing bearer token' });
      }
      const token = authHeader.toString().slice('Bearer '.length);

      // Verify token and get the user
      const { data: jwtUser, error: jwtErr } = await (supabaseAdmin as any).auth.getUser(token);
      if (jwtErr || !jwtUser?.user?.id) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }
      const userId: string = jwtUser.user.id;

      // Try to remove avatar object if present
      const { data: prof, error: profErr } = await supabaseAdmin
        .from('profiles')
        .select('avatar_url')
        .eq('id', userId)
        .maybeSingle();
      if (!profErr && (prof as any)?.avatar_url) {
        try {
          const prefix = '/storage/v1/object/public/avatar/';
          const url = new URL((prof as any).avatar_url, SUPABASE_URL);
          const idx = url.pathname.indexOf(prefix);
          if (idx >= 0) {
            const path = url.pathname.slice(idx + prefix.length);
            await (supabaseAdmin as any).storage.from('avatar').remove([path]);
          }
        } catch { }
      }

      // Delete profile row
      await supabaseAdmin.from('profiles').delete().eq('id', userId);

      // Delete auth user
      const { error: delErr } = await (supabaseAdmin as any).auth.admin.deleteUser(userId);
      if (delErr) {
        return res.status(500).json({ success: false, message: delErr.message });
      }

      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err?.message || 'Unexpected error' });
    }
  });

  // Password status check endpoint
  app.get("/api/auth/check-password-status", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
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

      // Get user details from admin API to check if password is set
      const { data: userData, error: userError } = await (supabaseAdmin as any).auth.admin.getUserById(userId);

      if (userError || !userData?.user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const user = userData.user;

      // Check if user has password set
      const hasEmailIdentity = user.identities?.some((identity: any) => identity.provider === 'email');

      // Check user metadata for password flag (set when OAuth user sets password)
      const hasPasswordFromMetadata = user.user_metadata?.has_password === true;

      // User has password if they signed up with email OR if they're OAuth user who set password
      const hasPassword = hasEmailIdentity || hasPasswordFromMetadata;

      return res.json({
        success: true,
        hasPassword: !!hasPassword,
        identities: user.identities?.map((id: any) => id.provider) || [],
        metadata: {
          hasPasswordFlag: hasPasswordFromMetadata,
          hasEmailIdentity
        }
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err?.message || 'Failed to check password status' });
    }
  });

  // Step 1: Request OTP for signup (validates email and sends OTP)
  app.post("/api/auth/signup-request-otp", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server is not configured for Supabase" });
      }

      const { email, password, name, username } = req.body as {
        email?: string;
        password?: string;
        name?: string;
        username?: string;
      };

      // Basic input validation
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ success: false, message: 'Email is required' });
      }
      if (!password || typeof password !== 'string' || password.length < 8) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Rate limiting - 5 OTP requests per IP per hour
      const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
      if (!rateLimit(clientIP, 'otp:request', 5, 3600_000)) {
        return res.status(429).json({ success: false, message: 'Too many OTP requests. Please try again later.' });
      }

      // Import email validation utilities
      const { validateEmail } = await import('../shared/emailValidation');

      // Validate email comprehensively
      const emailValidation = await validateEmail(normalizedEmail);

      if (!emailValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: emailValidation.issues[0] || 'Invalid email address',
          details: {
            issues: emailValidation.issues,
            domain: emailValidation.domain,
            isDisposable: emailValidation.isDisposable
          }
        });
      }

      // Check if user already exists
      const { data: existingUsers } = await (supabaseAdmin as any).auth.admin.listUsers();
      const userExists = existingUsers?.users?.some((u: any) => u.email?.toLowerCase() === normalizedEmail);
      
      if (userExists) {
        return res.status(409).json({ success: false, message: 'An account with this email already exists' });
      }

      // Check if OTP verification should be skipped (for testing)
      const skipOtp = process.env.SKIP_EMAIL_OTP === 'true';
      const otp = skipOtp ? '123456' : generateOtp();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

      // Store OTP with signup data
      otpStore.set(normalizedEmail, {
        otp,
        email: normalizedEmail,
        password,
        name: name?.trim(),
        username: username?.trim(),
        expiresAt,
        attempts: 0,
      });

      // Skip sending email if OTP verification is disabled
      if (skipOtp) {
        console.log(`[DEV] OTP verification skipped. Use code: ${otp} for ${normalizedEmail}`);
        return res.json({
          success: true,
          message: 'Verification code sent to your email',
          email: normalizedEmail,
          // Include OTP in response for testing (only when SKIP_EMAIL_OTP=true)
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
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server is not configured for Supabase" });
      }

      const { email, otp } = req.body as {
        email?: string;
        otp?: string;
      };

      if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Email and verification code are required' });
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Rate limiting - 10 OTP verification attempts per IP per hour
      const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
      if (!rateLimit(clientIP, 'otp:verify', 10, 3600_000)) {
        return res.status(429).json({ success: false, message: 'Too many verification attempts. Please try again later.' });
      }

      // Get stored OTP entry
      const otpEntry = otpStore.get(normalizedEmail);

      if (!otpEntry) {
        return res.status(400).json({ success: false, message: 'No pending verification found. Please request a new code.' });
      }

      // Check if expired
      if (otpEntry.expiresAt < Date.now()) {
        otpStore.delete(normalizedEmail);
        return res.status(400).json({ success: false, message: 'Verification code has expired. Please request a new one.' });
      }

      // Check attempts (max 5)
      if (otpEntry.attempts >= 5) {
        otpStore.delete(normalizedEmail);
        return res.status(400).json({ success: false, message: 'Too many failed attempts. Please request a new code.' });
      }

      // Verify OTP
      if (otpEntry.otp !== otp.trim()) {
        otpEntry.attempts += 1;
        otpStore.set(normalizedEmail, otpEntry);
        const remainingAttempts = 5 - otpEntry.attempts;
        return res.status(400).json({ 
          success: false, 
          message: `Invalid verification code. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.` 
        });
      }

      // OTP verified! Create the user
      const { data: userData, error: createError } = await (supabaseAdmin as any).auth.admin.createUser({
        email: otpEntry.email,
        password: otpEntry.password,
        email_confirm: true, // Email is verified via OTP
        user_metadata: {
          full_name: otpEntry.name || null,
          username: otpEntry.username || null,
          signup_method: 'otp_verified',
          validated_at: new Date().toISOString(),
          otp_verified: true,
        },
        app_metadata: {
          username: otpEntry.username || null
        }
      });

      // Clean up OTP entry
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

  // Resend OTP endpoint
  app.post("/api/auth/resend-otp", async (req: Request, res: Response) => {
    try {
      const { email } = req.body as { email?: string };

      if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Rate limiting - 3 resend requests per email per 10 minutes
      if (!rateLimit(normalizedEmail, 'otp:resend', 3, 600_000)) {
        return res.status(429).json({ success: false, message: 'Please wait before requesting another code.' });
      }

      // Get existing OTP entry
      const existingEntry = otpStore.get(normalizedEmail);

      if (!existingEntry) {
        return res.status(400).json({ success: false, message: 'No pending signup found. Please start the signup process again.' });
      }

      // Generate new OTP
      const newOtp = generateOtp();
      existingEntry.otp = newOtp;
      existingEntry.expiresAt = Date.now() + 10 * 60 * 1000;
      existingEntry.attempts = 0;
      otpStore.set(normalizedEmail, existingEntry);

      // Send new OTP email
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

  // Legacy endpoint - redirect to new OTP flow (for backwards compatibility)
  app.post("/api/auth/signup-validate", async (req: Request, res: Response) => {
    // Redirect to the new OTP flow
    return res.status(400).json({ 
      success: false, 
      message: 'Please use the new signup flow with email verification',
      useOtpFlow: true 
    });
  });

  // Email validation endpoint (for real-time frontend validation)
  app.post("/api/auth/validate-email", async (req: Request, res: Response) => {
    try {
      const { email } = req.body as { email?: string };

      if (!email || typeof email !== 'string') {
        return res.status(400).json({ success: false, message: 'Email is required' });
      }

      // Rate limiting - 20 validations per IP per minute
      const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
      if (!rateLimit(clientIP, 'email:validate', 20, 60_000)) {
        return res.status(429).json({ success: false, message: 'Too many validation requests' });
      }

      // Import email validation utilities
      const { validateEmailQuick } = await import('../shared/emailValidation');

      // Quick validation (no MX check for real-time use)
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

  // Password change endpoint with authentication
  app.post("/api/auth/change-password", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
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

      if (!rateLimit(userId, 'password:change', 3, 300_000)) { // 3 attempts per 5 minutes
        return res.status(429).json({ success: false, message: 'Too many password change attempts' });
      }

      const { newPassword } = req.body as { newPassword?: string };
      if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
        return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long' });
      }

      // Get current user to preserve existing metadata
      const { data: currentUser } = await (supabaseAdmin as any).auth.admin.getUserById(userId);
      const existingMetadata = currentUser?.user?.user_metadata || {};

      // Update password using admin client
      const { error } = await (supabaseAdmin as any).auth.admin.updateUserById(userId, {
        password: newPassword,
        user_metadata: {
          ...existingMetadata,
          has_password: true,
          password_set_at: new Date().toISOString()
        }
      });

      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

      return res.json({ success: true, message: 'Password updated successfully' });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err?.message || 'Failed to change password' });
    }
  });

  // Certificate verification endpoint
  app.get("/api/certificates/verify/:certificate_id", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server is not configured for Supabase" });
      }

      const { certificate_id } = req.params;

      // Basic validation of certificate_id format (should match CERT-[A-Z0-9]{6})
      if (!certificate_id || typeof certificate_id !== 'string') {
        return res.status(400).json({
          success: false,
          message: "Invalid certificate ID format",
          status: "invalid_id"
        });
      }

      // Rate limiting - 30 certificate verifications per IP per minute
      const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
      if (!rateLimit(clientIP, 'certificate:verify', 30, 60_000)) {
        return res.status(429).json({ success: false, message: 'Too many verification requests' });
      }

      // Query certificate from database
      const { data: certificate, error: certError } = await supabaseAdmin
        .from('certificates')
        .select('*')
        .eq('certificate_id', certificate_id.toUpperCase())
        .single();

      if (certError || !certificate) {
        return res.json({
          success: true,
          status: "invalid_id",
          message: "Invalid certificate ID",
          certificate_id: certificate_id.toUpperCase()
        });
      }

      const cert = certificate as any;

      // Check if certificate is revoked/inactive
      if (cert.status !== 'active') {
        return res.json({
          success: true,
          status: "revoked",
          message: "This certificate has been revoked",
          certificate_id: certificate_id.toUpperCase(),
          certificate: {
            participant_name: cert.participant_name,
            hackathon_name: cert.hackathon_name,
            type: cert.type,
            position: cert.position,
            created_at: cert.created_at
          }
        });
      }

      // Certificate is valid and active
      return res.json({
        success: true,
        status: "verified",
        message: "Certificate is verified and valid",
        certificate_id: certificate_id.toUpperCase(),
        certificate: {
          participant_name: cert.participant_name,
          participant_email: cert.participant_email,
          hackathon_name: cert.hackathon_name,
          type: cert.type,
          position: cert.position,
          pdf_url: cert.pdf_url,
          jpg_url: cert.jpg_url,
          created_at: cert.created_at
        }
      });

    } catch (err: any) {
      console.error('Certificate verification error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to verify certificate',
        status: "error"
      });
    }
  });

  // User certificates and hackathons endpoint
  app.get("/api/user/:username/certificates", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server is not configured for Supabase" });
      }

      const { username } = req.params;

      if (!username || typeof username !== 'string') {
        return res.status(400).json({ success: false, message: "Username is required" });
      }

      // Rate limiting - 20 requests per IP per minute
      const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
      if (!rateLimit(clientIP, 'user:certificates', 20, 60_000)) {
        return res.status(429).json({ success: false, message: 'Too many requests' });
      }

      // Get certificates for the user
      const { data: certificates, error: certError } = await supabaseAdmin
        .from('certificates')
        .select('*')
        .eq('maximally_username', username)
        .order('created_at', { ascending: false });

      if (certError) {
        console.error('Error fetching certificates:', certError);
        return res.status(500).json({ success: false, message: 'Failed to fetch certificates' });
      }

      // Get hackathons from the certificates
      const certificatesData = certificates as any[] || [];
      const hackathonNames = Array.from(new Set(certificatesData.map((cert: any) => cert.hackathon_name)));

      // Get hackathon details from the hackathons table
      const hackathonDetails: any[] = [];
      if (hackathonNames.length > 0) {
        for (const hackathonName of hackathonNames) {
          const { data: hackathon } = await supabaseAdmin
            .from('hackathons')
            .select('*')
            .eq('title', hackathonName)
            .single();

          if (hackathon) {
            hackathonDetails.push(hackathon);
          }
        }
      }

      // Process achievements based on certificates
      const achievements = [];
      if (certificatesData) {
        for (const cert of certificatesData) {
          // Add judging achievements
          if (cert.type === 'judge') {
            achievements.push({
              id: `judge_${cert.id}`,
              title: `Judge - ${cert.hackathon_name}`,
              description: `Successfully judged ${cert.hackathon_name}`,
              icon: '⚖️',
              earnedAt: cert.created_at,
              type: 'judging'
            });
          }

          // Add winning achievements (if position is specified and not just "Participant")
          if (cert.position && cert.position.toLowerCase() !== 'participant' && cert.type !== 'judge') {
            achievements.push({
              id: `winner_${cert.id}`,
              title: `${cert.position} - ${cert.hackathon_name}`,
              description: `Achieved ${cert.position} position in ${cert.hackathon_name}`,
              icon: cert.position.toLowerCase().includes('1st') || cert.position.toLowerCase().includes('first') || cert.position.toLowerCase().includes('winner') ? '🏆' :
                cert.position.toLowerCase().includes('2nd') || cert.position.toLowerCase().includes('second') ? '�' :
                  cert.position.toLowerCase().includes('3rd') || cert.position.toLowerCase().includes('third') ? '🥉' : '🏅',
              earnedAt: cert.created_at,
              type: 'winning'
            });
          }
        }
      }

      return res.json({
        success: true,
        data: {
          certificates: certificatesData,
          hackathons: hackathonDetails,
          achievements: achievements
        }
      });

    } catch (err: any) {
      console.error('User certificates fetch error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch user data'
      });
    }
  });

  // Lightweight notifications stub to avoid 404s from the client navbar
  app.get("/api/notifications/unread-count", async (_req: Request, res: Response) => {
    return res.json({ success: true, count: 0 });
  });

  // ============================================
  // SCHEDULED EMAIL NOTIFICATIONS
  // These endpoints can be called by a cron job (e.g., every hour)
  // ============================================

  // Send deadline reminder emails (call this via cron every hour)
  // Sends reminders at 24h and 6h before deadline
  app.post("/api/scheduler/deadline-reminders", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server not configured" });
      }

      // Optional: Add a secret key check for security
      const schedulerKey = req.headers['x-scheduler-key'];
      if (process.env.SCHEDULER_SECRET && schedulerKey !== process.env.SCHEDULER_SECRET) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const now = new Date();
      const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const in6Hours = new Date(now.getTime() + 6 * 60 * 60 * 1000);
      const in25Hours = new Date(now.getTime() + 25 * 60 * 60 * 1000);
      const in7Hours = new Date(now.getTime() + 7 * 60 * 60 * 1000);

      // Find hackathons with deadlines in the next 24-25 hours or 6-7 hours
      const { data: hackathons } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('id, hackathon_name, slug, submission_closes_at')
        .eq('status', 'published')
        .not('submission_closes_at', 'is', null);

      let emailsSent = 0;
      const errors: string[] = [];

      for (const hackathon of hackathons || []) {
        const deadline = new Date(hackathon.submission_closes_at);
        
        // Check if deadline is in 24h window or 6h window
        const isIn24hWindow = deadline >= in24Hours && deadline < in25Hours;
        const isIn6hWindow = deadline >= in6Hours && deadline < in7Hours;
        
        if (!isIn24hWindow && !isIn6hWindow) continue;

        const hoursLeft = isIn6hWindow ? 6 : 24;

        // Get all registered participants who haven't submitted yet
        const { data: registrations } = await supabaseAdmin
          .from('hackathon_registrations')
          .select('user_id, email, full_name, username')
          .eq('hackathon_id', hackathon.id)
          .in('status', ['confirmed', 'checked_in']);

        // Get submissions for this hackathon
        const { data: submissions } = await supabaseAdmin
          .from('hackathon_submissions')
          .select('user_id')
          .eq('hackathon_id', hackathon.id)
          .eq('status', 'submitted');

        const submittedUserIds = new Set((submissions || []).map(s => s.user_id));

        for (const reg of registrations || []) {
          // Skip if already submitted
          if (submittedUserIds.has(reg.user_id)) continue;

          try {
            await sendDeadlineReminder({
              email: reg.email,
              userName: reg.full_name || reg.username || 'there',
              hackathonName: hackathon.hackathon_name,
              hackathonSlug: hackathon.slug,
              deadline: hackathon.submission_closes_at,
              hoursLeft: hoursLeft,
            });
            emailsSent++;
          } catch (err: any) {
            errors.push(`Failed to send to ${reg.email}: ${err.message}`);
          }
        }
      }

      return res.json({ 
        success: true, 
        message: `Sent ${emailsSent} deadline reminder emails`,
        emailsSent,
        errors: errors.length > 0 ? errors : undefined
      });
    } catch (err: any) {
      console.error('Deadline reminder scheduler error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // Send hackathon starting soon emails (call this via cron every hour)
  // Sends reminders at 24h and 2h before start
  app.post("/api/scheduler/starting-soon", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server not configured" });
      }

      // Optional: Add a secret key check for security
      const schedulerKey = req.headers['x-scheduler-key'];
      if (process.env.SCHEDULER_SECRET && schedulerKey !== process.env.SCHEDULER_SECRET) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const now = new Date();
      const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const in2Hours = new Date(now.getTime() + 2 * 60 * 60 * 1000);
      const in25Hours = new Date(now.getTime() + 25 * 60 * 60 * 1000);
      const in3Hours = new Date(now.getTime() + 3 * 60 * 60 * 1000);

      // Find hackathons starting in the next 24-25 hours or 2-3 hours
      const { data: hackathons } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('id, hackathon_name, slug, start_date')
        .eq('status', 'published')
        .not('start_date', 'is', null);

      let emailsSent = 0;
      const errors: string[] = [];

      for (const hackathon of hackathons || []) {
        const startDate = new Date(hackathon.start_date);
        
        // Check if start is in 24h window or 2h window
        const isIn24hWindow = startDate >= in24Hours && startDate < in25Hours;
        const isIn2hWindow = startDate >= in2Hours && startDate < in3Hours;
        
        if (!isIn24hWindow && !isIn2hWindow) continue;

        const hoursUntilStart = isIn2hWindow ? 2 : 24;

        // Get all registered participants
        const { data: registrations } = await supabaseAdmin
          .from('hackathon_registrations')
          .select('user_id, email, full_name, username')
          .eq('hackathon_id', hackathon.id)
          .in('status', ['confirmed', 'checked_in']);

        for (const reg of registrations || []) {
          try {
            await sendHackathonStartingSoonEmail({
              email: reg.email,
              userName: reg.full_name || reg.username || 'there',
              hackathonName: hackathon.hackathon_name,
              hackathonSlug: hackathon.slug,
              startDate: hackathon.start_date,
              hoursUntilStart: hoursUntilStart,
            });
            emailsSent++;
          } catch (err: any) {
            errors.push(`Failed to send to ${reg.email}: ${err.message}`);
          }
        }
      }

      return res.json({ 
        success: true, 
        message: `Sent ${emailsSent} starting soon emails`,
        emailsSent,
        errors: errors.length > 0 ? errors : undefined
      });
    } catch (err: any) {
      console.error('Starting soon scheduler error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // User data export endpoint
  app.get("/api/user/export-data", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
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

      // Rate limit data exports (max 3 per hour)
      if (!rateLimit(userId, 'data:export', 3, 3600_000)) {
        return res.status(429).json({ success: false, message: 'Too many export requests. Please try again later.' });
      }

      // Get user profile data
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        return res.status(404).json({ success: false, message: 'Profile not found' });
      }

      // Get user auth data (limited info for privacy)
      const { data: userData, error: userError } = await (supabaseAdmin as any).auth.admin.getUserById(userId);
      const authData = userData?.user ? {
        id: userData.user.id,
        email: userData.user.email,
        email_confirmed_at: userData.user.email_confirmed_at,
        created_at: userData.user.created_at,
        updated_at: userData.user.updated_at,
        identities: userData.user.identities?.map((identity: any) => ({
          provider: identity.provider,
          created_at: identity.created_at,
          updated_at: identity.updated_at
        })),
        user_metadata: userData.user.user_metadata
      } : null;

      // Try to get additional user data (hackathons, achievements, etc.)
      // These queries will fail gracefully if tables don't exist
      let hackathons: any[] = [];
      let achievements: any[] = [];

      try {
        const { data: hackathonData } = await supabaseAdmin
          .from('user_hackathons')
          .select('*')
          .eq('userId', userId);
        hackathons = hackathonData || [];
      } catch (error) {
        // No hackathon data available or table does not exist
      }

      try {
        const { data: achievementData } = await supabaseAdmin
          .from('user_achievements')
          .select('*')
          .eq('userId', userId);
        achievements = achievementData || [];
      } catch (error) {
        // No achievement data available or table does not exist
      }

      const exportData = {
        export_info: {
          exported_at: new Date().toISOString(),
          data_version: '1.0',
          platform: 'Maximally',
          user_id: userId,
          export_type: 'full_user_data'
        },
        profile: profile,
        auth: authData,
        hackathons: hackathons,
        achievements: achievements,
        statistics: {
          total_hackathons: hackathons.length,
          total_achievements: achievements.length,
          account_age_days: userData?.user?.created_at
            ? Math.floor((Date.now() - new Date(userData.user.created_at).getTime()) / (1000 * 60 * 60 * 24))
            : null
        }
      };

      // Create filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `maximally-data-${timestamp}.json`;

      // Set response headers for file download
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

      return res.json(exportData);

    } catch (err: any) {
      return res.status(500).json({ success: false, message: err?.message || 'Failed to export user data' });
    }
  });

  // Profile update endpoint with validation and per-user rate limiting
  app.post("/api/profile/update", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
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

      if (!rateLimit(userId, 'profile:update', 15, 60_000)) {
        return res.status(429).json({ success: false, message: 'Too many requests' });
      }

      // Allowlist fields and validate/sanitize - using actual database field names
      type Patch = {
        full_name?: string | null;
        bio?: string | null;
        location?: string | null;
        email?: string | null; // ignored here (email updates should go through auth API)
        skills?: string[] | null;
        github_username?: string | null;
        linkedin_username?: string | null;
        twitter_username?: string | null;
        website_url?: string | null;
        avatar_url?: string | null;
      };
      const body: Patch = req.body || {};

      // Helpers
      const trimOrNull = (v: any, max = 200): string | null => {
        if (typeof v !== 'string') return null;
        const s = v.trim();
        if (!s) return null;
        return s.slice(0, max);
      };
      const sanitizeHandle = (v: any, max = 64): string | null => {
        const s = trimOrNull(v, max);
        if (!s) return null;
        const cleaned = s.toLowerCase().replace(/[^a-z0-9._-]/g, '');
        return cleaned ? cleaned.slice(0, max) : null;
      };
      const sanitizeSkills = (arr: any): string[] | null => {
        if (!Array.isArray(arr)) return null;
        const out: string[] = [];
        for (const x of arr) {
          const val = trimOrNull(String(x), 32);
          if (val) out.push(val);
          if (out.length >= 20) break;
        }
        return out.length ? out : [];
      };
      const sanitizeWebsite = (v: any): string | null => {
        const raw = trimOrNull(v, 300);
        if (!raw) return null;
        try {
          const u = new URL(raw.startsWith('http') ? raw : `https://${raw}`);
          if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
          return u.toString().slice(0, 300);
        } catch {
          return null;
        }
      };

      const patch: Patch = {
        full_name: trimOrNull(body.full_name, 100),
        bio: trimOrNull(body.bio, 1000),
        location: trimOrNull(body.location, 100),
        // email intentionally ignored to avoid desync with auth
        skills: sanitizeSkills(body.skills),
        github_username: sanitizeHandle(body.github_username),
        linkedin_username: sanitizeHandle(body.linkedin_username),
        twitter_username: sanitizeHandle(body.twitter_username),
        website_url: sanitizeWebsite(body.website_url),
        avatar_url: trimOrNull(body.avatar_url, 500),
      };

      const { error } = await (supabaseAdmin as any)
        .from('profiles')
        .update(patch)
        .eq('id', userId);
      if (error) return res.status(400).json({ success: false, message: error.message });

      const { data: updated, error: selErr } = await (supabaseAdmin as any)
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      if (selErr) return res.status(500).json({ success: false, message: selErr.message });

      return res.json({ success: true, profile: updated });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err?.message || 'Unexpected error' });
    }
  });

  app.get("/api/judges", async (_req: Request, res: Response) => {
    try {
      const judges = await storage.getPublishedJudges();
      return res.json(judges);
    } catch (err: any) {
      return res.status(500).json({ message: err?.message || 'Failed to fetch judges' });
    }
  });

  app.get("/api/judges/:username", async (req: Request, res: Response) => {
    try {
      const { username } = req.params;
      const judge = await storage.getJudgeByUsername(username);

      if (!judge || !judge.isPublished) {
        return res.status(404).json({ message: 'Judge not found' });
      }

      // Try to fetch events, but do not fail the whole request if this breaks
      let events: any[] = [];
      try {
        events = await storage.getJudgeEvents(judge.id as any);
      } catch (eventsErr: any) {
        console.error('Error fetching judge events for profile:', eventsErr?.message || eventsErr);
        // Fallback: just return the judge without events
        events = [];
      }

      return res.json({ ...judge, topEventsJudged: events });
    } catch (err: any) {
      console.error('Error in /api/judges/:username route:', err);
      return res.status(500).json({ message: err?.message || 'Failed to fetch judge' });
    }
  });

  app.post("/api/judges/apply", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server is not configured for Supabase" });
      }

      const body = req.body;

      // Validate required fields
      if (!body.username || !body.fullName || !body.email) {
        return res.status(400).json({ message: 'Missing required fields: username, fullName, email' });
      }

      // Check for existing username in applications
      const { data: existingUsername, error: usernameCheckError } = await supabaseAdmin
        .from('judge_applications')
        .select('id')
        .eq('username', body.username)
        .maybeSingle();

      if (existingUsername) {
        return res.status(400).json({ message: 'Username already exists in applications' });
      }

      // Check for existing email in applications
      const { data: existingEmail, error: emailCheckError } = await supabaseAdmin
        .from('judge_applications')
        .select('id')
        .eq('email', body.email)
        .maybeSingle();

      if (existingEmail) {
        return res.status(400).json({ message: 'Email already registered in applications' });
      }

      // Check if already approved as judge
      const { data: existingJudge, error: judgeCheckError } = await supabaseAdmin
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
      const { data: application, error: applicationError } = await supabaseAdmin
        .from('judge_applications')
        .insert(applicationData as any)
        .select()
        .single();

      if (applicationError) {
        console.error('Application insert error:', applicationError);
        return res.status(500).json({ message: `Failed to submit application: ${applicationError.message}` });
      }

      const appData = application as any;

      // Add judge events if provided
      if (body.topEventsJudged && Array.isArray(body.topEventsJudged)) {
        const events = body.topEventsJudged
          .filter((event: any) => event.eventName && event.role && event.date)
          .map((event: any) => ({
            application_id: appData.id,
            event_name: event.eventName,
            event_role: event.role,
            event_date: event.date,
            event_link: event.link || null,
            verified: false
          }));

        if (events.length > 0) {
          const { error: eventsError } = await supabaseAdmin
            .from('judge_application_events')
            .insert(events as any);

          if (eventsError) {
            console.error('Events insert error:', eventsError);
            // Don't fail the application if events fail to insert
          }
        }
      }

      return res.status(201).json({
        message: 'Application submitted successfully! We will review your application and get back to you soon.',
        applicationId: appData.id
      });
    } catch (err: any) {
      console.error('Judge application error:', err);
      return res.status(500).json({ message: err?.message || 'Failed to submit application' });
    }
  });

  // Judge Applications Management Routes (Admin only)
  app.get("/api/admin/judge-applications", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server is not configured for Supabase" });
      }

      // Check admin authentication
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.toString().startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing bearer token' });
      }
      const token = authHeader.toString().slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin as any, token);
      if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });

      // Check if user is admin
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profileError || !profile || (profile as any).role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }

      const { data: applications, error } = await supabaseAdmin
        .from('judge_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        return res.status(500).json({ message: `Failed to fetch applications: ${error.message}` });
      }

      // Fetch events for each application separately
      const applicationsWithEvents = await Promise.all(
        (applications || []).map(async (app: any) => {
          const { data: events } = await supabaseAdmin
            .from('judge_application_events')
            .select('*')
            .eq('application_id', app.id);

          return {
            ...app,
            judge_application_events: events || []
          };
        })
      );

      return res.json(applicationsWithEvents);
    } catch (err: any) {
      console.error('Fetch applications error:', err);
      return res.status(500).json({ message: err?.message || 'Failed to fetch applications' });
    }
  });

  app.post("/api/admin/judge-applications/:id/approve", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server is not configured for Supabase" });
      }

      const { id } = req.params;
      const { tier = 'starter' } = req.body;

      // Check admin authentication
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.toString().startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing bearer token' });
      }
      const token = authHeader.toString().slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin as any, token);
      if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });

      // Check if user is admin
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profileError || !profile || (profile as any).role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }

      // Get the application
      const { data: application, error: fetchError } = await supabaseAdmin
        .from('judge_applications')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !application) {
        return res.status(404).json({ message: 'Application not found' });
      }

      const appData2 = application as any;

      // Clean username by removing @ symbol if present
      const cleanUsername = appData2.username.replace(/^@/, '');

      // Find or create user profile and promote to judge role
      const { data: userProfile, error: userProfileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('username', cleanUsername)
        .maybeSingle();

      let profileUserId: string;

      if (!userProfile) {
        // Profile doesn't exist - create one
        const { data: newProfile, error: createProfileError } = await (supabaseAdmin as any)
          .from('profiles')
          .insert({
            username: cleanUsername,
            full_name: appData2.full_name,
            email: appData2.email,
            role: 'judge',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createProfileError) {
          return res.status(500).json({ message: `Failed to create profile: ${createProfileError.message}` });
        }

        profileUserId = (newProfile as any).id;
      } else {
        // Profile exists - update role to judge
        profileUserId = (userProfile as any).id;

        const { error: roleUpdateError } = await (supabaseAdmin as any)
          .from('profiles')
          .update({
            role: 'judge',
            updated_at: new Date().toISOString()
          })
          .eq('username', cleanUsername);

        if (roleUpdateError) {
          return res.status(500).json({ message: `Failed to update user role: ${roleUpdateError.message}` });
        }
      }

      // Create judge from application
      const judgeData = {
        username: cleanUsername,
        full_name: appData2.full_name,
        profile_photo: appData2.profile_photo,
        headline: appData2.headline,
        short_bio: appData2.short_bio,
        judge_location: appData2.judge_location,
        role_title: appData2.role_title,
        company: appData2.company,
        primary_expertise: appData2.primary_expertise,
        secondary_expertise: appData2.secondary_expertise,
        total_events_judged: appData2.total_events_judged,
        total_teams_evaluated: appData2.total_teams_evaluated,
        total_mentorship_hours: appData2.total_mentorship_hours,
        years_of_experience: appData2.years_of_experience,
        average_feedback_rating: appData2.average_feedback_rating,
        linkedin: appData2.linkedin,
        github: appData2.github,
        twitter: appData2.twitter,
        website: appData2.website,
        languages_spoken: appData2.languages_spoken,
        public_achievements: appData2.public_achievements,
        mentorship_statement: appData2.mentorship_statement,
        availability_status: appData2.availability_status,
        tier: tier,
        is_published: true,
        email: appData2.email,
        phone: appData2.phone,
        resume: appData2.resume,
        proof_of_judging: appData2.proof_of_judging,
        timezone: appData2.timezone,
        calendar_link: appData2.calendar_link,
        compensation_preference: appData2.compensation_preference,
        judge_references: appData2.judge_references,
        conflict_of_interest: appData2.conflict_of_interest,
        agreed_to_nda: appData2.agreed_to_nda,
        address: appData2.address,
        user_id: profileUserId // Link to the user profile
      };

      // Insert into judges table
      const { data: judge, error: judgeError } = await supabaseAdmin
        .from('judges')
        .insert(judgeData as any)
        .select()
        .single();

      if (judgeError) {
        return res.status(500).json({ message: `Failed to create judge: ${judgeError.message}` });
      }

      const judgeData2 = judge as any;

      // Copy application events to judge events
      const { data: applicationEvents } = await supabaseAdmin
        .from('judge_application_events')
        .select('*')
        .eq('application_id', id);

      if (applicationEvents && applicationEvents.length > 0) {
        const appEvents = applicationEvents as any[];
        const judgeEvents = appEvents.map((event: any) => ({
          judge_id: judgeData2.id,
          event_name: event.event_name,
          event_role: event.event_role,
          event_date: event.event_date,
          event_link: event.event_link,
          verified: event.verified
        }));

        await supabaseAdmin
          .from('judge_events')
          .insert(judgeEvents as any);
      }

      // Update application status
      const { error: updateError } = await (supabaseAdmin as any)
        .from('judge_applications')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: 'admin' // TODO: Get actual admin user
        })
        .eq('id', id);

      return res.json({
        message: `Application approved successfully! User ${cleanUsername} has been promoted to judge role.`,
        judgeId: judgeData2.id,
        username: cleanUsername
      });
    } catch (err: any) {
      console.error('Approve application error:', err);
      return res.status(500).json({ message: err?.message || 'Failed to approve application' });
    }
  });

  app.post("/api/admin/judge-applications/:id/reject", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server is not configured for Supabase" });
      }

      const { id } = req.params;
      const { reason } = req.body;

      // Check admin authentication
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.toString().startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing bearer token' });
      }
      const token = authHeader.toString().slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin as any, token);
      if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });

      // Check if user is admin
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profileError || !profile || (profile as any).role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }

      // Update application status
      const { error } = await (supabaseAdmin as any)
        .from('judge_applications')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: 'admin', // TODO: Get actual admin user
          rejection_reason: reason
        })
        .eq('id', id);

      if (error) {
        return res.status(500).json({ message: `Failed to reject application: ${error.message}` });
      }

      return res.json({ message: 'Application rejected successfully' });
    } catch (err: any) {
      console.error('Reject application error:', err);
      return res.status(500).json({ message: err?.message || 'Failed to reject application' });
    }
  });

  // Delete judge application
  app.delete("/api/admin/judge-applications/:id", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server is not configured for Supabase" });
      }

      const { id } = req.params;

      // Check admin authentication
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.toString().startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing bearer token' });
      }
      const token = authHeader.toString().slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin as any, token);
      if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });

      // Check if user is admin
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profileError || !profile || (profile as any).role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }

      // Delete related events first (due to foreign key constraint)
      const { error: eventsDeleteError } = await supabaseAdmin
        .from('judge_application_events')
        .delete()
        .eq('application_id', id);

      if (eventsDeleteError) {
        console.error('Failed to delete application events:', eventsDeleteError);
        // Continue anyway as events might not exist
      }

      // Delete the application
      const { error: deleteError } = await supabaseAdmin
        .from('judge_applications')
        .delete()
        .eq('id', id);

      if (deleteError) {
        return res.status(500).json({ message: `Failed to delete application: ${deleteError.message}` });
      }

      return res.json({ message: 'Application deleted successfully' });
    } catch (err: any) {
      console.error('Delete application error:', err);
      return res.status(500).json({ message: err?.message || 'Failed to delete application' });
    }
  });

  // ============================================
  // ORGANIZER APPLICATION ROUTES
  // ============================================

  // Submit organizer application
  app.post("/api/organizer/apply", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server is not configured for Supabase" });
      }

      const body = req.body;

      // Validate required fields
      if (!body.username || !body.full_name || !body.email) {
        return res.status(400).json({ 
          message: 'Missing required fields',
          details: {
            username: !body.username ? 'Username is required' : null,
            full_name: !body.full_name ? 'Full name is required' : null,
            email: !body.email ? 'Email is required' : null
          }
        });
      }

      // Check for existing username in applications
      const { data: existingUsername } = await supabaseAdmin
        .from('organizer_applications')
        .select('id')
        .eq('username', body.username)
        .maybeSingle();

      if (existingUsername) {
        return res.status(400).json({ message: 'You have already submitted an application' });
      }

      // Check if already an organizer
      const { data: existingOrganizer } = await supabaseAdmin
        .from('profiles')
        .select('id, role')
        .eq('username', body.username)
        .single();

      if (existingOrganizer && (existingOrganizer as any).role === 'organizer') {
        return res.status(400).json({ message: 'You are already an approved organizer' });
      }

      // Prepare application data
      const applicationData = {
        user_id: body.user_id || null,
        username: body.username,
        email: body.email,
        full_name: body.full_name,
        organization_name: body.organization_name,
        organization_type: body.organization_type,
        organization_website: body.organization_website,
        phone: body.phone,
        location: body.location,
        previous_organizing_experience: body.previous_organizing_experience,
        why_maximally: body.why_maximally,
        linkedin: body.linkedin,
        twitter: body.twitter,
        instagram: body.instagram,
        additional_info: body.additional_info,
        agreed_to_terms: body.agreed_to_terms || false,
        status: 'pending'
      };

      // Insert application
      const { data: application, error: applicationError } = await supabaseAdmin
        .from('organizer_applications')
        .insert(applicationData as any)
        .select()
        .single();

      if (applicationError) {
        console.error('Application insert error:', applicationError);
        return res.status(500).json({ 
          message: `Failed to submit application: ${applicationError.message}`,
          error: applicationError.message
        });
      }

      return res.status(201).json({
        message: 'Application submitted successfully! We will review your application and get back to you soon.',
        applicationId: (application as any).id
      });
    } catch (err: any) {
      console.error('Organizer application error:', err);
      return res.status(500).json({ message: err?.message || 'Failed to submit application' });
    }
  });

  // Get all organizer applications (Admin only)
  app.get("/api/admin/organizer-applications", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server is not configured for Supabase" });
      }

      // Check admin authentication
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.toString().startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing bearer token' });
      }
      const token = authHeader.toString().slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin as any, token);
      if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });

      // Check if user is admin
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profileError || !profile || (profile as any).role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }

      const { data: applications, error } = await supabaseAdmin
        .from('organizer_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        return res.status(500).json({ message: `Failed to fetch applications: ${error.message}` });
      }

      return res.json(applications || []);
    } catch (err: any) {
      console.error('Fetch applications error:', err);
      return res.status(500).json({ message: err?.message || 'Failed to fetch applications' });
    }
  });

  // Approve organizer application
  app.post("/api/admin/organizer-applications/:id/approve", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server is not configured for Supabase" });
      }

      const { id } = req.params;

      // Check admin authentication
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.toString().startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing bearer token' });
      }
      const token = authHeader.toString().slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin as any, token);
      if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });

      // Check if user is admin
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profileError || !profile || (profile as any).role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }

      // Get application details
      const { data: application, error: appError } = await supabaseAdmin
        .from('organizer_applications')
        .select('*')
        .eq('id', id)
        .single();

      if (appError || !application) {
        return res.status(404).json({ message: 'Application not found' });
      }

      const appData = application as any;

      // Update application status
      const { error: updateError } = await supabaseAdmin
        .from('organizer_applications')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: userId
        })
        .eq('id', id);

      if (updateError) {
        console.error('Failed to update application status:', updateError);
        return res.status(500).json({ message: `Failed to approve application: ${updateError.message}`, error: updateError });
      }

      // Update user role to organizer if user_id exists
      if (appData.user_id) {
        const { error: roleError } = await supabaseAdmin
          .from('profiles')
          .update({ role: 'organizer' })
          .eq('id', appData.user_id);

        if (roleError) {
          console.error('Failed to update user role:', roleError);
          return res.status(500).json({ message: `Failed to update user role: ${roleError.message}`, error: roleError });
        }

        // Create organizer profile
        const { error: profileCreateError } = await supabaseAdmin
          .from('organizer_profiles')
          .insert({
            user_id: appData.user_id,
            display_name: appData.full_name,
            organization_name: appData.organization_name,
            organization_type: appData.organization_type,
            website: appData.organization_website,
            location: appData.location,
            linkedin: appData.linkedin,
            twitter: appData.twitter,
            instagram: appData.instagram
          });

        if (profileCreateError) {
          // Check if it's a duplicate key error (profile already exists)
          if (profileCreateError.code !== '23505') {
            console.error('Failed to create organizer profile:', profileCreateError);
            return res.status(500).json({ message: `Failed to create organizer profile: ${profileCreateError.message}`, error: profileCreateError });
          }
        }

        // Send organizer promotion email
        const { data: userProfile } = await supabaseAdmin
          .from('profiles')
          .select('full_name, username, email')
          .eq('id', appData.user_id)
          .single();

        if (userProfile?.email) {
          sendOrganizerPromotionEmail({
            email: userProfile.email,
            userName: userProfile.full_name || userProfile.username || appData.full_name || 'there',
          }).catch(err => console.error('Organizer promotion email failed:', err));
        }
      }
      return res.json({ message: 'Application approved successfully' });
    } catch (err: any) {
      console.error('Approve application error:', err);
      return res.status(500).json({ message: err?.message || 'Failed to approve application', error: err });
    }
  });

  // Reject organizer application
  app.post("/api/admin/organizer-applications/:id/reject", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server is not configured for Supabase" });
      }

      const { id } = req.params;
      const { reason } = req.body;

      // Check admin authentication
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.toString().startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing bearer token' });
      }
      const token = authHeader.toString().slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin as any, token);
      if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });

      // Check if user is admin
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profileError || !profile || (profile as any).role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }

      // Update application status
      const { error } = await supabaseAdmin
        .from('organizer_applications')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: userId,
          rejection_reason: reason
        })
        .eq('id', id);

      if (error) {
        return res.status(500).json({ message: `Failed to reject application: ${error.message}` });
      }

      return res.json({ message: 'Application rejected successfully' });
    } catch (err: any) {
      console.error('Reject application error:', err);
      return res.status(500).json({ message: err?.message || 'Failed to reject application' });
    }
  });

  // Delete organizer application
  app.delete("/api/admin/organizer-applications/:id", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server is not configured for Supabase" });
      }

      const { id } = req.params;

      // Check admin authentication
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.toString().startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing bearer token' });
      }
      const token = authHeader.toString().slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin as any, token);
      if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });

      // Check if user is admin
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profileError || !profile || (profile as any).role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }

      // Delete the application
      const { error: deleteError } = await supabaseAdmin
        .from('organizer_applications')
        .delete()
        .eq('id', id);

      if (deleteError) {
        return res.status(500).json({ message: `Failed to delete application: ${deleteError.message}` });
      }

      return res.json({ message: 'Application deleted successfully' });
    } catch (err: any) {
      console.error('Delete application error:', err);
      return res.status(500).json({ message: err?.message || 'Failed to delete application' });
    }
  });

  // ============================================
  // END ORGANIZER APPLICATION ROUTES
  // ============================================

  // Tier Progression System
  app.post("/api/admin/judges/:id/promote", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server is not configured for Supabase" });
      }

      const { id } = req.params;
      const { newTier } = req.body;

      const validTiers = ['starter', 'verified', 'senior', 'chief', 'legacy'];
      if (!validTiers.includes(newTier)) {
        return res.status(400).json({ message: 'Invalid tier' });
      }

      // Update judge tier
      const { error } = await (supabaseAdmin as any)
        .from('judges')
        .update({ tier: newTier })
        .eq('id', id);

      if (error) {
        return res.status(500).json({ message: `Failed to update tier: ${error.message}` });
      }

      return res.json({ message: `Judge promoted to ${newTier} tier successfully` });
    } catch (err: any) {
      console.error('Promote judge error:', err);
      return res.status(500).json({ message: err?.message || 'Failed to promote judge' });
    }
  });

  // Auto-calculate tier progression based on metrics
  app.post("/api/admin/judges/:id/calculate-tier", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server is not configured for Supabase" });
      }

      const { id } = req.params;

      // Get judge data
      const { data: judge, error: fetchError } = await supabaseAdmin
        .from('judges')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !judge) {
        return res.status(404).json({ message: 'Judge not found' });
      }

      const judgeData = judge as any;

      // Calculate tier based on metrics
      const calculateTier = (judge: any): string => {
        const events = judge.total_events_judged || 0;
        const teams = judge.total_teams_evaluated || 0;
        const hours = judge.total_mentorship_hours || 0;
        const experience = judge.years_of_experience || 0;
        const verified = judge.events_judged_verified && judge.teams_evaluated_verified;

        // Legacy Judge: 40+ events, 200+ teams, 400+ hours, 10+ years, all verified
        if (events >= 40 && teams >= 200 && hours >= 400 && experience >= 10 && verified) {
          return 'legacy';
        }

        // Chief Judge: 25+ events, 120+ teams, 250+ hours, 8+ years, all verified
        if (events >= 25 && teams >= 120 && hours >= 250 && experience >= 8 && verified) {
          return 'chief';
        }

        // Senior Judge: 15+ events, 70+ teams, 150+ hours, 5+ years, all verified
        if (events >= 15 && teams >= 70 && hours >= 150 && experience >= 5 && verified) {
          return 'senior';
        }

        // Verified Judge: 5+ events, 20+ teams, 50+ hours, 3+ years, some verification
        if (events >= 5 && teams >= 20 && hours >= 50 && experience >= 3 && (judge.events_judged_verified || judge.teams_evaluated_verified)) {
          return 'verified';
        }

        // Starter Judge: Default for new judges
        return 'starter';
      };

      const suggestedTier = calculateTier(judgeData);
      const currentTier = judgeData.tier;

      // Only promote, never demote automatically
      const tierHierarchy = ['starter', 'verified', 'senior', 'chief', 'legacy'];
      const currentIndex = tierHierarchy.indexOf(currentTier);
      const suggestedIndex = tierHierarchy.indexOf(suggestedTier);

      if (suggestedIndex > currentIndex) {
        // Update judge tier
        const { error } = await (supabaseAdmin as any)
          .from('judges')
          .update({ tier: suggestedTier })
          .eq('id', id);

        if (error) {
          return res.status(500).json({ message: `Failed to update tier: ${error.message}` });
        }

        return res.json({
          message: `Judge automatically promoted from ${currentTier} to ${suggestedTier}`,
          oldTier: currentTier,
          newTier: suggestedTier,
          promoted: true
        });
      } else {
        return res.json({
          message: `Judge remains at ${currentTier} tier`,
          currentTier: currentTier,
          suggestedTier: suggestedTier,
          promoted: false
        });
      }
    } catch (err: any) {
      console.error('Calculate tier error:', err);
      return res.status(500).json({ message: err?.message || 'Failed to calculate tier' });
    }
  });

  // Bulk tier calculation for all judges
  app.post("/api/admin/judges/calculate-all-tiers", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server is not configured for Supabase" });
      }

      // Get all judges
      const { data: judges, error: fetchError } = await supabaseAdmin
        .from('judges')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (fetchError) {
        return res.status(500).json({ message: `Failed to fetch judges: ${fetchError.message}` });
      }

      const results = [];
      const judgesData = judges as any[] || [];

      for (const judge of judgesData) {
        // Calculate tier for each judge
        const response = await fetch(`http://maximally.in/api/admin/judges/${judge.id}/calculate-tier`, {
          method: 'POST'
        });

        if (response.ok) {
          const result = await response.json();
          results.push({
            judgeId: judge.id,
            judgeName: judge.full_name,
            ...result
          });
        }
      }

      const promoted = results.filter(r => r.promoted);

      return res.json({
        message: `Processed ${results.length} judges, promoted ${promoted.length}`,
        results: results,
        promotedJudges: promoted
      });
    } catch (err: any) {
      console.error('Bulk calculate tier error:', err);
      return res.status(500).json({ message: err?.message || 'Failed to calculate tiers' });
    }
  });

  // Judge Dashboard API Endpoints
  app.get("/api/judge/profile", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
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

      // Get user profile to check if they're a judge
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

  // Add new judging event
  app.post("/api/judge/events", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
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

      // Get user profile to check if they're a judge
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError || !profile || (profile as any).role !== 'judge') {
        return res.status(403).json({ success: false, message: 'Access denied. Judge role required.' });
      }

      // Get judge data
      const { data: judge, error: judgeError } = await supabaseAdmin
        .from('judges')
        .select('id')
        .eq('username', (profile as any).username)
        .single();

      if (judgeError || !judge) {
        return res.status(404).json({ success: false, message: 'Judge profile not found' });
      }

      const { eventName, role, date, link, teamsEvaluated, hoursSpent } = req.body;

      if (!eventName || !role || !date) {
        return res.status(400).json({ success: false, message: 'Event name, role, and date are required' });
      }

      // Insert new event
      const { data: newEvent, error: insertError } = await (supabaseAdmin as any)
        .from('judge_events')
        .insert({
          judge_id: (judge as any).id,
          event_name: eventName,
          event_role: role,
          event_date: date,
          event_link: link || null,
          verified: false
        })
        .select()
        .single();

      if (insertError) {
        return res.status(500).json({ success: false, message: `Failed to add event: ${insertError.message}` });
      }

      // Update judge metrics if provided
      if (teamsEvaluated || hoursSpent) {
        // First get current judge data
        const { data: currentJudge, error: getCurrentError } = await supabaseAdmin
          .from('judges')
          .select('total_teams_evaluated, total_mentorship_hours, total_events_judged')
          .eq('id', (judge as any).id)
          .single();

        if (!getCurrentError && currentJudge) {
          const { error: updateError } = await (supabaseAdmin as any)
            .from('judges')
            .update({
              total_teams_evaluated: (currentJudge as any).total_teams_evaluated + (teamsEvaluated || 0),
              total_mentorship_hours: (currentJudge as any).total_mentorship_hours + (hoursSpent || 0),
              total_events_judged: (currentJudge as any).total_events_judged + 1
            })
            .eq('id', (judge as any).id);

          if (updateError) {
            console.error('Failed to update judge metrics:', updateError);
          }
        }
      }

      return res.json({
        success: true,
        message: 'Event added successfully',
        event: newEvent
      });
    } catch (err: any) {
      console.error('Add judge event error:', err);
      return res.status(500).json({ success: false, message: err?.message || 'Failed to add event' });
    }
  });

  // Update judge profile
  app.put("/api/judge/profile", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
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

      // Rate limiting
      if (!rateLimit(userId, 'judge:profile:update', 10, 60_000)) {
        return res.status(429).json({ success: false, message: 'Too many requests' });
      }

      // Get user profile to check if they're a judge
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError || !profile || (profile as any).role !== 'judge') {
        return res.status(403).json({ success: false, message: 'Access denied. Judge role required.' });
      }

      const allowedFields = [
        'profile_photo', 'headline', 'short_bio', 'judge_location', 'role_title', 'company',
        'primary_expertise', 'secondary_expertise', 'linkedin', 'github', 'twitter', 'website',
        'languages_spoken', 'public_achievements', 'mentorship_statement', 'availability_status',
        'phone', 'timezone', 'calendar_link'
      ];

      const updateData: any = {};
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ success: false, message: 'No valid fields to update' });
      }

      // Update judge profile
      const { error: updateError } = await (supabaseAdmin as any)
        .from('judges')
        .update(updateData)
        .eq('username', (profile as any).username);

      if (updateError) {
        return res.status(500).json({ success: false, message: `Failed to update profile: ${updateError.message}` });
      }

      return res.json({
        success: true,
        message: 'Profile updated successfully'
      });
    } catch (err: any) {
      console.error('Update judge profile error:', err);
      return res.status(500).json({ success: false, message: err?.message || 'Failed to update profile' });
    }
  });

  // Judge Dashboard - Get judge profile and events
  app.get("/api/judge/profile", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server is not configured for Supabase" });
      }

      // Check authentication
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.toString().startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing bearer token' });
      }
      const token = authHeader.toString().slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin as any, token);
      if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });

      // Check if user has judge role
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError || !profile || (profile as any).role !== 'judge') {
        return res.status(403).json({ success: false, message: 'Access denied. Judge role required.' });
      }

      // Get judge data from judges table
      const { data: judge, error: judgeError } = await supabaseAdmin
        .from('judges')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (judgeError || !judge) {
        return res.status(404).json({ success: false, message: 'Judge profile not found' });
      }

      const judgeData = judge as any;

      // Get judge events
      const { data: events, error: eventsError } = await supabaseAdmin
        .from('judge_events')
        .select('*')
        .eq('judge_id', judgeData.id)
        .order('event_date', { ascending: false });

      const eventsData = events as any[] || [];

      // Format response
      const response = {
        profile: {
          id: judgeData.id,
          username: judgeData.username,
          fullName: judgeData.full_name,
          profilePhoto: judgeData.profile_photo,
          headline: judgeData.headline,
          shortBio: judgeData.short_bio,
          location: judgeData.judge_location,
          currentRole: judgeData.role_title,
          company: judgeData.company,
          tier: judgeData.tier || 'starter',
          totalEventsJudged: judgeData.total_events_judged || 0,
          totalTeamsEvaluated: judgeData.total_teams_evaluated || 0,
          totalMentorshipHours: judgeData.total_mentorship_hours || 0,
          averageFeedbackRating: judgeData.average_feedback_rating,
          eventsJudgedVerified: judgeData.events_judged_verified || false,
          teamsEvaluatedVerified: judgeData.teams_evaluated_verified || false,
          mentorshipHoursVerified: judgeData.mentorship_hours_verified || false,
          availabilityStatus: judgeData.availability_status || 'available',
          primaryExpertise: judgeData.primary_expertise || [],
          secondaryExpertise: judgeData.secondary_expertise || []
        },
        events: eventsData.map((event: any) => ({
          id: event.id,
          eventName: event.event_name,
          role: event.event_role,
          date: event.event_date,
          link: event.event_link,
          verified: event.verified || false
        }))
      };

      return res.json(response);
    } catch (err: any) {
      console.error('Get judge profile error:', err);
      return res.status(500).json({ success: false, message: err?.message || 'Failed to fetch judge profile' });
    }
  });

  // Judge Dashboard - Add new event
  app.post("/api/judge/events", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server is not configured for Supabase" });
      }

      // Check authentication
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.toString().startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing bearer token' });
      }
      const token = authHeader.toString().slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin as any, token);
      if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });

      // Check if user has judge role
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError || !profile || (profile as any).role !== 'judge') {
        return res.status(403).json({ success: false, message: 'Access denied. Judge role required.' });
      }

      // Get judge data
      const { data: judge, error: judgeError } = await supabaseAdmin
        .from('judges')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (judgeError || !judge) {
        return res.status(404).json({ success: false, message: 'Judge profile not found' });
      }

      const judgeData = judge as any;

      // Validate event data
      const { eventName, role, date, link } = req.body;
      if (!eventName || !role || !date) {
        return res.status(400).json({ success: false, message: 'Missing required fields: eventName, role, date' });
      }

      // Insert event
      const { data: newEvent, error: insertError } = await supabaseAdmin
        .from('judge_events')
        .insert({
          judge_id: judgeData.id,
          event_name: eventName,
          event_role: role,
          event_date: date,
          event_link: link || null,
          verified: false
        } as any)
        .select()
        .single();

      if (insertError) {
        return res.status(500).json({ success: false, message: `Failed to add event: ${insertError.message}` });
      }

      return res.json({
        success: true,
        message: 'Event added successfully',
        event: newEvent
      });
    } catch (err: any) {
      console.error('Add judge event error:', err);
      return res.status(500).json({ success: false, message: err?.message || 'Failed to add event' });
    }
  });

  // Public endpoint to get all published judges
  app.get("/api/judges", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server is not configured for Supabase" });
      }

      // Rate limiting - 30 requests per IP per minute
      const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
      if (!rateLimit(clientIP, 'judges:list', 30, 60_000)) {
        return res.status(429).json({ success: false, message: 'Too many requests' });
      }

      // Get all published judges
      const { data: judges, error: judgesError } = await supabaseAdmin
        .from('judges')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (judgesError) {
        console.error('Error fetching judges:', judgesError);
        return res.status(500).json({ success: false, message: 'Failed to fetch judges', error: judgesError.message });
      }

      // Transform to match frontend Judge type
      const transformedJudges = (judges || []).map((judge: any) => ({
        id: judge.id,
        username: judge.username,
        fullName: judge.full_name,
        profilePhoto: judge.profile_photo,
        headline: judge.headline,
        shortBio: judge.short_bio,
        location: judge.judge_location,
        currentRole: judge.role_title,
        company: judge.company,
        primaryExpertise: judge.primary_expertise || [],
        secondaryExpertise: judge.secondary_expertise || [],
        totalEventsJudged: judge.total_events_judged || 0,
        totalTeamsEvaluated: judge.total_teams_evaluated || 0,
        totalMentorshipHours: judge.total_mentorship_hours || 0,
        yearsOfExperience: judge.years_of_experience || 0,
        averageFeedbackRating: judge.average_feedback_rating,
        eventsJudgedVerified: judge.events_judged_verified || false,
        teamsEvaluatedVerified: judge.teams_evaluated_verified || false,
        mentorshipHoursVerified: judge.mentorship_hours_verified || false,
        feedbackRatingVerified: judge.feedback_rating_verified || false,
        linkedin: judge.linkedin,
        github: judge.github,
        twitter: judge.twitter,
        website: judge.website,
        languagesSpoken: judge.languages_spoken || [],
        publicAchievements: judge.public_achievements,
        mentorshipStatement: judge.mentorship_statement,
        availabilityStatus: judge.availability_status || 'available',
        tier: judge.tier || 'starter',
        isPublished: judge.is_published || false,
        createdAt: judge.created_at
      }));

      return res.json(transformedJudges);
    } catch (err: any) {
      console.error('❌ Get judges error:', err);
      return res.status(500).json({ success: false, message: err?.message || 'Failed to fetch judges' });
    }
  });

  // REMOVED: Judge Messages API Endpoints (Platform Simplification)
  // The judge account system has been deprecated. Judges now use tokenized links.
  // See: .kiro/specs/platform-simplification/requirements.md - Requirement 1, 17

  // Organizer Messages API Endpoints
  app.get("/api/organizer/messages", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
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

      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('username, role')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        return res.status(404).json({ success: false, message: 'Profile not found' });
      }

      const profileData = profile as any;

      if (profileData.role !== 'organizer') {
        return res.status(403).json({ success: false, message: 'Access denied. Organizer role required.' });
      }

      const { data: recipients, error: recipientsError } = await supabaseAdmin
        .from('organizer_message_recipients')
        .select('message_id, is_read, read_at')
        .eq('organizer_username', profileData.username);

      if (recipientsError) {
        return res.status(500).json({ success: false, message: 'Failed to fetch message recipients' });
      }

      const messageIds = (recipients || []).map((r: any) => r.message_id);
      
      if (messageIds.length === 0) {
        return res.json({ items: [], total: 0 });
      }

      let query = supabaseAdmin
        .from('organizer_messages')
        .select('*')
        .in('id', messageIds)
        .eq('status', 'sent');

      if (req.query.subject) {
        query = query.ilike('subject', `%${req.query.subject}%`);
      }
      if (req.query.priority) {
        query = query.eq('priority', req.query.priority);
      }

      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      query = query.range(offset, offset + limit - 1);
      query = query.order('created_at', { ascending: false });

      const { data: messages, error: messagesError } = await query;

      if (messagesError) {
        return res.status(500).json({ success: false, message: 'Failed to fetch messages' });
      }

      const readStatusMap = new Map();
      (recipients || []).forEach((r: any) => {
        readStatusMap.set(r.message_id, { is_read: r.is_read, read_at: r.read_at });
      });

      const transformedMessages = (messages || []).map((msg: any) => {
        const readStatus = readStatusMap.get(msg.id) || { is_read: false, read_at: null };
        return {
          id: msg.id,
          subject: msg.subject,
          content: msg.content,
          priority: msg.priority,
          created_at: msg.created_at,
          sent_at: msg.sent_at,
          sent_by_name: msg.sent_by_name,
          sent_by_email: msg.sent_by_email,
          recipient: { is_read: readStatus.is_read, read_at: readStatus.read_at }
        };
      });

      return res.json({ items: transformedMessages, total: transformedMessages.length });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err?.message || 'Failed to fetch messages' });
    }
  });

  app.get("/api/organizer/messages/unread-count", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
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

      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('username, role')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        return res.status(404).json({ success: false, message: 'Profile not found' });
      }

      const profileData = profile as any;

      if (profileData.role !== 'organizer') {
        return res.status(403).json({ success: false, message: 'Access denied. Organizer role required.' });
      }

      const { count, error: countError } = await supabaseAdmin
        .from('organizer_message_recipients')
        .select('*', { count: 'exact', head: true })
        .eq('organizer_username', profileData.username)
        .eq('is_read', false);

      if (countError) {
        return res.status(500).json({ success: false, message: 'Failed to count unread messages' });
      }

      return res.json({ unread: count || 0 });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err?.message || 'Failed to fetch unread count' });
    }
  });

  app.post("/api/organizer/messages/:id/read", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
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

      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('username, role')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        return res.status(404).json({ success: false, message: 'Profile not found' });
      }

      const profileData = profile as any;

      if (profileData.role !== 'organizer') {
        return res.status(403).json({ success: false, message: 'Access denied. Organizer role required.' });
      }

      const messageId = parseInt(req.params.id);

      const { data: recipient, error: recipientError } = await supabaseAdmin
        .from('organizer_message_recipients')
        .select('id')
        .eq('message_id', messageId)
        .eq('organizer_username', profileData.username)
        .single();

      if (recipientError || !recipient) {
        return res.status(404).json({ success: false, message: 'Message not found for this organizer' });
      }

      const { error: updateError } = await supabaseAdmin
        .from('organizer_message_recipients')
        .update({ is_read: true, read_at: new Date().toISOString() } as any)
        .eq('message_id', messageId)
        .eq('organizer_username', profileData.username);

      if (updateError) {
        return res.status(500).json({ success: false, message: 'Failed to mark message as read' });
      }

      return res.json({ success: true, message: 'Message marked as read' });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err?.message || 'Failed to mark message as read' });
    }
  });

  // Register organizer routes
  registerOrganizerRoutes(app);
  
  // Register admin hackathon management routes
  registerAdminHackathonRoutes(app);
  
  // Register hackathon registration routes
  registerHackathonRegistrationRoutes(app);
  
  // Register advanced organizer features
  registerOrganizerAdvancedRoutes(app);

  // Register notification routes - DISABLED
  // registerNotificationRoutes(app);

  // Public hackathon routes
  app.get("/api/hackathons/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;

      const { data, error } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error || !data) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/hackathons/:slug/view", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;

      await supabaseAdmin.rpc('increment_hackathon_views', { hackathon_slug: slug });

      return res.json({ success: true });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get public announcements for a hackathon
  app.get("/api/hackathons/:hackathonId/announcements", async (req: Request, res: Response) => {
    try {
      const { hackathonId } = req.params;
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;

      const { data, error} = await supabaseAdmin
        .from('hackathon_announcements')
        .select('id, title, content, announcement_type, created_at, published_at')
        .eq('hackathon_id', hackathonId)
        .eq('is_published', true)
        .eq('target_audience', 'public')
        .order('published_at', { ascending: false });

      if (error) throw error;

      return res.json({ success: true, data: data || [] });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Submit project
  app.post("/api/hackathons/:hackathonId/submit", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;
      const { data: userData } = await supabaseAdmin.auth.getUser(token);
      const userId = userData?.user?.id;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      const { hackathonId } = req.params;
      const submissionData = req.body;

      // Check if user is registered
      const { data: registration } = await supabaseAdmin
        .from('hackathon_registrations')
        .select('id, team_id')
        .eq('hackathon_id', hackathonId)
        .eq('user_id', userId)
        .single();

      if (!registration) {
        return res.status(403).json({ success: false, message: 'You must be registered to submit' });
      }

      // Check if already submitted (ONE SUBMISSION PER USER PER HACKATHON)
      const { data: existing, error: existingError } = await supabaseAdmin
        .from('hackathon_submissions')
        .select('id, status')
        .eq('hackathon_id', hackathonId)
        .eq('user_id', userId)
        .single();

      // Helper function to sync submission to gallery
      const syncToGallery = async (submission: any) => {
        if (submission.status !== 'submitted') return; // Only sync submitted projects
        
        try {
          // Check if gallery project already exists for this submission
          const { data: existingGallery } = await supabaseAdmin
            .from('gallery_projects')
            .select('id')
            .eq('hackathon_submission_id', submission.id)
            .single();

          const galleryData = {
            user_id: userId,
            name: submission.project_name || 'Untitled Project',
            tagline: submission.tagline,
            description: submission.description || '',
            logo_url: submission.project_logo,
            github_url: submission.github_repo,
            demo_url: submission.demo_url,
            video_url: submission.video_url,
            technologies: submission.technologies_used || [],
            hackathon_id: parseInt(hackathonId),
            hackathon_submission_id: submission.id,
            status: 'approved', // Auto-approve hackathon submissions
          };

          if (existingGallery) {
            // Update existing gallery project
            await supabaseAdmin
              .from('gallery_projects')
              .update({
                ...galleryData,
                updated_at: new Date().toISOString()
              })
              .eq('id', existingGallery.id);
          } else {
            // Create new gallery project
            await supabaseAdmin
              .from('gallery_projects')
              .insert({
                ...galleryData,
                created_at: submission.submitted_at || new Date().toISOString()
              });
          }
        } catch (galleryError) {
          console.error('Error syncing to gallery:', galleryError);
          // Don't fail the submission if gallery sync fails
        }
      };

      if (existing) {
        // Update existing submission (only one submission allowed per user)
        const { data, error } = await supabaseAdmin
          .from('hackathon_submissions')
          .update({
            ...submissionData,
            submitted_at: submissionData.status === 'submitted' ? new Date().toISOString() : null
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;

        // Sync to gallery
        await syncToGallery(data);

        // Send email only if status changed to submitted
        if (submissionData.status === 'submitted' && data.status === 'submitted') {
          const { data: hackathonDetails } = await supabaseAdmin
            .from('organizer_hackathons')
            .select('hackathon_name, slug')
            .eq('id', hackathonId)
            .single();

          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('full_name, username, email')
            .eq('id', userId)
            .single();

          if (hackathonDetails && profile?.email) {
            sendSubmissionConfirmation({
              email: profile.email,
              userName: profile.full_name || profile.username || 'there',
              hackathonName: hackathonDetails.hackathon_name,
              hackathonSlug: hackathonDetails.slug,
              projectName: data.project_name,
              projectId: data.id,
              submittedAt: data.submitted_at,
            }).catch(err => console.error('Email send failed:', err));
          }
        }

        return res.json({ success: true, data });
      } else {
        // Create new submission
        const { data, error } = await supabaseAdmin
          .from('hackathon_submissions')
          .insert({
            hackathon_id: hackathonId,
            user_id: userId,
            team_id: registration.team_id,
            ...submissionData,
            submitted_at: submissionData.status === 'submitted' ? new Date().toISOString() : null
          })
          .select()
          .single();

        if (error) throw error;

        // Sync to gallery
        await syncToGallery(data);

        // Send email only if submitted (not draft)
        if (submissionData.status === 'submitted') {
          const { data: hackathonDetails } = await supabaseAdmin
            .from('organizer_hackathons')
            .select('hackathon_name, slug')
            .eq('id', hackathonId)
            .single();

          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('full_name, username, email')
            .eq('id', userId)
            .single();

          if (hackathonDetails && profile?.email) {
            sendSubmissionConfirmation({
              email: profile.email,
              userName: profile.full_name || profile.username || 'there',
              hackathonName: hackathonDetails.hackathon_name,
              hackathonSlug: hackathonDetails.slug,
              projectName: data.project_name,
              projectId: data.id,
              submittedAt: data.submitted_at,
            }).catch(err => console.error('Email send failed:', err));
          }
        }

        return res.json({ success: true, data });
      }
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get user's submission
  app.get("/api/hackathons/:hackathonId/my-submission", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;
      const { data: userData } = await supabaseAdmin.auth.getUser(token);
      const userId = userData?.user?.id;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      const { hackathonId } = req.params;

      const { data, error } = await supabaseAdmin
        .from('hackathon_submissions')
        .select('*')
        .eq('hackathon_id', hackathonId)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return res.json({ success: true, data: data || null });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get all projects for a hackathon (public)
  app.get("/api/hackathons/:hackathonId/projects", async (req: Request, res: Response) => {
    try {
      const { hackathonId } = req.params;
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;

      const { data, error } = await supabaseAdmin
        .from('hackathon_submissions')
        .select(`
          *,
          team:hackathon_teams(team_name, team_code)
        `)
        .eq('hackathon_id', hackathonId)
        .eq('status', 'submitted')
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      // Get user names
      const enrichedData = await Promise.all((data || []).map(async (submission: any) => {
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('username, full_name')
          .eq('id', submission.user_id)
          .single();

        return {
          ...submission,
          user_name: profile?.full_name || profile?.username || 'Anonymous'
        };
      }));

      return res.json({ success: true, data: enrichedData });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Participant: Get my hackathons
  app.get("/api/participant/my-hackathons", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;
      const { data: userData } = await supabaseAdmin.auth.getUser(token);
      const userId = userData?.user?.id;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      // Get all registrations for this user
      const { data: registrations, error } = await supabaseAdmin
        .from('hackathon_registrations')
        .select(`
          id,
          status,
          registration_number,
          registration_type,
          team_id,
          hackathon_id,
          team:hackathon_teams(team_name, team_code)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get hackathon details and submissions
      const enrichedData = await Promise.all((registrations || []).map(async (reg: any) => {
        // Get hackathon details
        const { data: hackathon } = await supabaseAdmin
          .from('organizer_hackathons')
          .select('id, hackathon_name, slug, start_date, end_date, format')
          .eq('id', reg.hackathon_id)
          .single();

        // Get submission if exists
        const { data: submission } = await supabaseAdmin
          .from('hackathon_submissions')
          .select('id, project_name, status, score, prize_won')
          .eq('hackathon_id', reg.hackathon_id)
          .eq('user_id', userId)
          .single();

        return {
          ...hackathon,
          registration: {
            id: reg.id,
            status: reg.status,
            registration_number: reg.registration_number,
            registration_type: reg.registration_type,
            team: reg.team
          },
          submission: submission || null
        };
      }));

      return res.json({ success: true, data: enrichedData });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get project by source and ID (gallery or hackathon) - MUST be before the generic route
  app.get("/api/projects/:source/:projectId", async (req: Request, res: Response) => {
    try {
      const { source, projectId } = req.params;
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;

      // Get current user if authenticated
      let currentUserId: string | null = null;
      const authHeader = req.headers['authorization'];
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.slice('Bearer '.length);
        const { data: userData } = await supabaseAdmin.auth.getUser(token);
        currentUserId = userData?.user?.id || null;
      }

      if (source === 'gallery') {
        const { data: galleryProject, error } = await supabaseAdmin
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

        const gp = galleryProject as any;
        
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
        const { data: submission, error } = await supabaseAdmin
          .from('hackathon_submissions')
          .select(`
            *,
            team:hackathon_teams(team_name, team_code),
            hackathon:organizer_hackathons(hackathon_name, slug)
          `)
          .eq('id', projectId)
          .single();

        if (error || !submission) {
          return res.status(404).json({ success: false, message: 'Project not found' });
        }

        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('username, full_name')
          .eq('id', (submission as any).user_id)
          .single();

        const enrichedData = {
          ...(submission as any),
          source: 'hackathon',
          user_name: (profile as any)?.full_name || (profile as any)?.username || 'Anonymous'
        };

        return res.json({ success: true, data: enrichedData });
      }

      return res.status(400).json({ success: false, message: 'Invalid source. Use "gallery" or "hackathon"' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get individual project details (public) - checks both gallery_projects and hackathon_submissions
  app.get("/api/projects/:projectId", async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params;
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;

      // Get current user if authenticated
      let currentUserId: string | null = null;
      const authHeader = req.headers['authorization'];
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.slice('Bearer '.length);
        const { data: userData } = await supabaseAdmin.auth.getUser(token);
        currentUserId = userData?.user?.id || null;
      }

      // First try gallery_projects table
      const { data: galleryProject, error: galleryError } = await supabaseAdmin
        .from('gallery_projects')
        .select(`
          *,
          profiles:user_id(username, full_name, avatar_url),
          hackathon:hackathon_id(hackathon_name, slug)
        `)
        .eq('id', projectId)
        .single();

      if (galleryProject && !galleryError) {
        const gp = galleryProject as any;
        
        // Check if project is viewable (approved/featured OR owner viewing their own)
        const isOwner = currentUserId && gp.user_id === currentUserId;
        const isPublic = gp.status === 'approved' || gp.status === 'featured';
        
        if (!isPublic && !isOwner) {
          // Not viewable - fall through to check hackathon_submissions
        } else {
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
      const { data: submission, error: submissionError } = await supabaseAdmin
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
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('username, full_name')
        .eq('id', (submission as any).user_id)
        .single();

      const enrichedData = {
        ...(submission as any),
        source: 'hackathon',
        user_name: (profile as any)?.full_name || (profile as any)?.username || 'Anonymous'
      };

      return res.json({ success: true, data: enrichedData });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Judge: Get submissions for judging (ASSIGNED ONLY)
  // Returns data shape compatible with JudgeHackathonInterface
  app.get("/api/judge/hackathons/:hackathonId/submissions", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;
      const { data: userData } = await supabaseAdmin.auth.getUser(token);
      const userId = userData?.user?.id;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      // Verify user is a judge
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if ((profile as any)?.role !== 'judge') {
        return res.status(403).json({ success: false, message: 'Judge role required' });
      }

      const { hackathonId } = req.params;

      // Verify judge is assigned to this hackathon
      const { data: assignment } = await supabaseAdmin
        .from('judge_hackathon_assignments')
        .select('id')
        .eq('hackathon_id', hackathonId)
        .eq('judge_id', userId)
        .eq('status', 'active')
        .single();

      if (!assignment) {
        return res.status(403).json({ success: false, message: 'Not authorized to judge this hackathon' });
      }

      const { data: submissions, error } = await supabaseAdmin
        .from('hackathon_submissions')
        .select(`
          *,
          team:hackathon_teams(team_name)
        `)
        .eq('hackathon_id', hackathonId)
        .eq('status', 'submitted')
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      const submissionIds = (submissions || []).map((s: any) => s.id);
      const userIds = Array.from(new Set((submissions || []).map((s: any) => s.user_id).filter(Boolean)));

      // Fetch user profiles in batch (avoid relying on FK relationship)
      const { data: profiles } = userIds.length > 0
        ? await supabaseAdmin
            .from('profiles')
            .select('id, username, full_name, avatar_url')
            .in('id', userIds)
        : { data: [] };

      const profileById = (profiles || []).reduce((acc: any, p: any) => {
        acc[p.id] = p;
        return acc;
      }, {});

      const { data: myRatings } = submissionIds.length > 0
        ? await supabaseAdmin
            .from('hackathon_submission_ratings')
            .select('submission_id, criterion_id, score, notes')
            .in('submission_id', submissionIds)
            .eq('judge_id', userId)
        : { data: [] };

      const ratingsBySubmission = (myRatings || []).reduce((acc: any, r: any) => {
        acc[r.submission_id] = acc[r.submission_id] || [];
        acc[r.submission_id].push(r);
        return acc;
      }, {});

      const enriched = (submissions || []).map((s: any) => {
        const mine = ratingsBySubmission[s.id] || [];
        const p = profileById[s.user_id];

        return {
          ...s,
          user: p ? { username: p.username, full_name: p.full_name, avatar_url: p.avatar_url } : null,
          my_ratings: mine,
          has_rated: mine.length > 0
        };
      });

      return res.json({ success: true, data: enriched });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Judge: Get hackathons to judge (ASSIGNED ONLY)
  app.get("/api/judge/hackathons", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;
      const { data: userData } = await supabaseAdmin.auth.getUser(token);
      const userId = userData?.user?.id;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      // Verify user is a judge
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if ((profile as any)?.role !== 'judge') {
        return res.status(403).json({ success: false, message: 'Judge role required' });
      }

      // Fetch assigned hackathons
      const { data: assignments, error } = await supabaseAdmin
        .from('judge_hackathon_assignments')
        .select(`
          hackathon:organizer_hackathons(
            id,
            hackathon_name,
            slug,
            start_date,
            end_date,
            format,
            registrations_count
          )
        `)
        .eq('judge_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const hackathons = (assignments || [])
        .map((a: any) => a.hackathon)
        .filter(Boolean);

      // Add submissions_count
      const enrichedData = await Promise.all(hackathons.map(async (hackathon: any) => {
        const { count } = await supabaseAdmin
          .from('hackathon_submissions')
          .select('*', { count: 'exact', head: true })
          .eq('hackathon_id', hackathon.id)
          .eq('status', 'submitted');

        return {
          ...hackathon,
          submissions_count: count || 0
        };
      }));

      return res.json({ success: true, data: enrichedData });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Judge: Score a submission (ASSIGNED ONLY)
  app.post("/api/judge/submissions/:submissionId/score", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;
      const { data: userData } = await supabaseAdmin.auth.getUser(token);
      const userId = userData?.user?.id;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      // Verify user is a judge
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if ((profile as any)?.role !== 'judge') {
        return res.status(403).json({ success: false, message: 'Judge role required' });
      }

      const { submissionId } = req.params;
      const { score, feedback, criteria_scores } = req.body;

      // Fetch submission to verify assignment
      const { data: submission } = await supabaseAdmin
        .from('hackathon_submissions')
        .select('id, hackathon_id')
        .eq('id', submissionId)
        .single();

      if (!submission) {
        return res.status(404).json({ success: false, message: 'Submission not found' });
      }

      // Check if judging period is open
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('judging_starts_at, judging_ends_at, judging_control')
        .eq('id', submission.hackathon_id)
        .single();

      if (hackathon) {
        const now = new Date();
        const judgingControl = hackathon.judging_control || 'auto';
        
        // Check period control first
        if (judgingControl === 'closed') {
          return res.status(403).json({ success: false, message: 'Judging period is closed' });
        }
        
        // If not force open, check timeline
        if (judgingControl !== 'open') {
          const judgingStarts = hackathon.judging_starts_at ? new Date(hackathon.judging_starts_at) : null;
          const judgingEnds = hackathon.judging_ends_at ? new Date(hackathon.judging_ends_at) : null;
          
          if (judgingStarts && now < judgingStarts) {
            return res.status(403).json({ success: false, message: 'Judging period has not started yet' });
          }
          
          if (judgingEnds && now > judgingEnds) {
            return res.status(403).json({ success: false, message: 'Judging period has ended' });
          }
        }
      }

      const { data: assignment } = await supabaseAdmin
        .from('judge_hackathon_assignments')
        .select('id')
        .eq('hackathon_id', submission.hackathon_id)
        .eq('judge_id', userId)
        .eq('status', 'active')
        .single();

      if (!assignment) {
        return res.status(403).json({ success: false, message: 'Not authorized to judge this submission' });
      }

      // Build update object - only include criteria_scores if provided
      const updateData: any = { score, feedback };
      if (criteria_scores) {
        updateData.criteria_scores = criteria_scores;
      }

      const { data, error } = await supabaseAdmin
        .from('hackathon_submissions')
        .update(updateData)
        .eq('id', submissionId)
        .select()
        .single();

      if (error) {
        console.error('Error updating submission score:', error);
        throw error;
      }

      // Winner notification removed - prize_won no longer used
      if (false && data) {
        const { data: hackathonDetails } = await supabaseAdmin
          .from('organizer_hackathons')
          .select('hackathon_name, slug')
          .eq('id', data.hackathon_id)
          .single();

        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('full_name, username, email')
          .eq('id', data.user_id)
          .single();

        if (hackathonDetails && profile?.email) {
          sendWinnerNotification({
            email: profile.email,
            userName: profile.full_name || profile.username || 'there',
            hackathonName: hackathonDetails.hackathon_name,
            hackathonSlug: hackathonDetails.slug,
            projectName: data.project_name,
            projectId: data.id,
            prize: prize_won,
            score: score,
          }).catch(err => console.error('Winner email send failed:', err));
        }
      }

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Register route modules
  registerOrganizerRoutes(app);
  registerAdminHackathonRoutes(app);
  registerHackathonRegistrationRoutes(app);
  registerOrganizerAdvancedRoutes(app);
  registerPublicHackathonRoutes(app);
  registerJudgeInvitationRoutes(app);
  registerJudgeProfileRoutes(app); // Re-enabled with fix
  registerJudgingRoutes(app); // Complete judging system
  registerFileUploadRoutes(app); // File upload endpoints for logos
  registerHackathonFeatureRoutes(app); // Tracks, sponsors, feedback, tasks, etc.
  registerOrganizerMessageRoutes(app); // Organizer inbox messages
  registerModerationRoutes(app); // User reporting and moderation system
  registerGalleryRoutes(app); // Project gallery system
  registerCustomQuestionsRoutes(app); // Custom registration questions
  registerJudgeReminderRoutes(app); // Judge reminder emails and progress tracking
  registerJudgeScoringRoutes(app); // Token-based judge scoring (no login required)
  registerSimplifiedJudgesRoutes(app); // Simplified judges management for organizers
  registerAutoPublishGalleryRoutes(app); // Auto-publish gallery when hackathon ends
  registerSubmissionModerationRoutes(app); // Submission moderation (disqualify) for organizers
  registerCertificateRoutes(app); // Certificate generation for organizers
  registerFeaturedContentRoutes(app); // Featured blogs and hackathons management

  // Auto-publish is handled by the cron endpoint /api/cron/auto-publish-galleries
  // In production, this should be triggered by an external cron service (e.g., Netlify scheduled functions)
  // For local development, you can manually call the endpoint or set up a local cron

  const httpServer = createServer(app);
  return httpServer;
}
