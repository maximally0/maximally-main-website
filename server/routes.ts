import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createClient } from "@supabase/supabase-js";

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
        console.log('CAPTCHA verification failed:', verificationResult['error-codes']);
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
          console.log(`CAPTCHA score too low: ${verificationResult.score}`);
          return res.json({ 
            success: false, 
            message: 'Security verification failed. Please try again.',
            score: verificationResult.score
          });
        }
        console.log(`CAPTCHA v3 score: ${verificationResult.score} (threshold: ${minimumScore})`);
      }
      
      console.log('CAPTCHA verification successful', {
        hostname: verificationResult.hostname,
        score: verificationResult.score,
        action: verificationResult.action
      });
      
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
        } catch {}
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
  
  // Secure email signup endpoint with validation
  app.post("/api/auth/signup-validate", async (req: Request, res: Response) => {
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
      
      console.log('📝 Signup request data:', {
        email: email?.slice(0, 5) + '***',
        name: name,
        username: username,
        hasPassword: !!password
      });
      console.log('🔍 Raw request body:', JSON.stringify(req.body, null, 2));
      console.log('🔍 Username analysis:', {
        raw: req.body.username,
        type: typeof req.body.username,
        length: req.body.username?.length,
        trimmed: req.body.username?.trim()
      });
      
      // Basic input validation
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ success: false, message: 'Email is required' });
      }
      if (!password || typeof password !== 'string' || password.length < 8) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
      }
      
      // Rate limiting - 5 signup attempts per IP per hour
      const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
      if (!rateLimit(clientIP, 'signup:attempt', 5, 3600_000)) {
        return res.status(429).json({ success: false, message: 'Too many signup attempts. Please try again later.' });
      }
      
      // Import email validation utilities
      const { validateEmail } = await import('../shared/emailValidation');
      
      // Validate email comprehensively
      console.log('🔍 Validating email:', email);
      const emailValidation = await validateEmail(email);
      console.log('📧 Email validation result:', JSON.stringify(emailValidation, null, 2));
      
      if (!emailValidation.isValid) {
        console.log('❌ Email validation failed:', emailValidation.issues);
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
      
      console.log('✅ Email validation passed');
      
      
      // Create user with admin client (bypasses email confirmation if configured)
      const { data: userData, error: createError } = await (supabaseAdmin as any).auth.admin.createUser({
        email: email.trim().toLowerCase(),
        password: password,
        email_confirm: true, // Auto-confirm email since we validated it
        user_metadata: {
          full_name: name?.trim() || null,
          username: username?.trim() || null, // Store the provided username
          signup_method: 'validated_email',
          validated_at: new Date().toISOString(),
          domain_validated: true,
          mx_verified: emailValidation.hasMx
        },
        app_metadata: {
          username: username?.trim() || null // Also store in app_metadata for server access
        }
      });
      
      if (createError) {
        // Handle duplicate user error specifically
        if (createError.message?.includes('already registered') || createError.message?.includes('already exists')) {
          return res.status(409).json({ success: false, message: 'An account with this email already exists' });
        }
        return res.status(400).json({ success: false, message: createError.message });
      }
      
      const user = userData?.user;
      if (!user?.id) {
        return res.status(500).json({ success: false, message: 'User created but no user data returned' });
      }
      
      // Note: This project uses Drizzle ORM with local database, not Supabase profiles table
      // The user creation in Supabase auth is sufficient for now
      // Profile creation would need to be handled through your Drizzle schema if needed
      
      console.log('✅ User created successfully in Supabase auth:', user.email);
      
      return res.json({ 
        success: true, 
        message: 'Account created successfully',
        user: {
          id: user.id,
          email: user.email,
          email_confirmed_at: user.email_confirmed_at,
          username: user.user_metadata?.username || null
        }
      });
      
    } catch (err: any) {
      console.error('Signup validation error:', err);
      return res.status(500).json({ success: false, message: err?.message || 'Failed to create account' });
    }
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

      // Check if certificate is revoked/inactive
      if (certificate.status !== 'active') {
        return res.json({
          success: true,
          status: "revoked",
          message: "This certificate has been revoked",
          certificate_id: certificate_id.toUpperCase(),
          certificate: {
            participant_name: certificate.participant_name,
            hackathon_name: certificate.hackathon_name,
            type: certificate.type,
            position: certificate.position,
            created_at: certificate.created_at
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
          participant_name: certificate.participant_name,
          participant_email: certificate.participant_email,
          hackathon_name: certificate.hackathon_name,
          type: certificate.type,
          position: certificate.position,
          pdf_url: certificate.pdf_url,
          jpg_url: certificate.jpg_url,
          created_at: certificate.created_at
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
      const hackathonNames = [...new Set(certificates?.map(cert => cert.hackathon_name) || [])];
      
      // Get hackathon details from the hackathons table
      const hackathonDetails = [];
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
      if (certificates) {
        for (const cert of certificates) {
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
                    cert.position.toLowerCase().includes('2nd') || cert.position.toLowerCase().includes('second') ? '🥈' :
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
          certificates: certificates || [],
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
        console.log('No hackathon data available or table does not exist');
      }
      
      try {
        const { data: achievementData } = await supabaseAdmin
          .from('user_achievements')
          .select('*')
          .eq('userId', userId);
        achievements = achievementData || [];
      } catch (error) {
        console.log('No achievement data available or table does not exist');
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

  const httpServer = createServer(app);
  return httpServer;
}
