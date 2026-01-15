// @ts-nocheck
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
    'https://www.maximally.in',
    'https://maximally-admin-panel.vercel.app'
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

async function bearerUserId(supabase: any, token: string): Promise<string | null> {
  try { const { data: { user }, error } = await supabase.auth.getUser(token); return error || !user ? null : user.id; } catch { return null; }
}

// ============================================
// HEALTH & UTILITY ROUTES
// ============================================
app.get("/api/health", (_req, res) => res.json({ ok: true }));

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
    const { data: judges, error } = await (supabaseAdmin as any).from('judges').select('*').eq('is_published', true).order('sort_order', { ascending: true }).order('created_at', { ascending: false });
    if (error) return res.status(500).json({ success: false, message: error.message });
    const judgesList = (judges || []).map((j: any) => ({
      id: j.id, username: j.username, fullName: j.full_name, profilePhoto: j.profile_photo, headline: j.headline, shortBio: j.short_bio,
      location: j.judge_location, currentRole: j.role_title, company: j.company, primaryExpertise: j.primary_expertise || [],
      secondaryExpertise: j.secondary_expertise || [], totalEventsJudged: j.total_events_judged || 0, totalTeamsEvaluated: j.total_teams_evaluated || 0,
      totalMentorshipHours: j.total_mentorship_hours || 0, yearsOfExperience: j.years_of_experience || 0, averageFeedbackRating: j.average_feedback_rating,
      eventsJudgedVerified: j.events_judged_verified || false, teamsEvaluatedVerified: j.teams_evaluated_verified || false,
      mentorshipHoursVerified: j.mentorship_hours_verified || false, feedbackRatingVerified: j.feedback_rating_verified || false,
      linkedin: j.linkedin, github: j.github, twitter: j.twitter, website: j.website, languagesSpoken: j.languages_spoken || [],
      publicAchievements: j.public_achievements, mentorshipStatement: j.mentorship_statement, availabilityStatus: j.availability_status || 'available',
      tier: j.tier || 'starter', isPublished: j.is_published || false, createdAt: j.created_at
    }));
    return res.json(judgesList);
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.get("/api/judges/:username", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const { username } = req.params;
    const { data: judge, error } = await (supabaseAdmin as any).from('judges').select('*').ilike('username', username).eq('is_published', true).single();
    if (error || !judge) return res.status(404).json({ success: false, message: 'Judge not found' });
    const { data: events } = await (supabaseAdmin as any).from('judge_events').select('*').eq('judge_id', judge.id).order('event_date', { ascending: false }).limit(5);
    return res.json({
      id: judge.id, username: judge.username, fullName: judge.full_name, profilePhoto: judge.profile_photo, headline: judge.headline, shortBio: judge.short_bio,
      location: judge.judge_location, currentRole: judge.role_title, company: judge.company, primaryExpertise: judge.primary_expertise || [],
      secondaryExpertise: judge.secondary_expertise || [], totalEventsJudged: judge.total_events_judged || 0, totalTeamsEvaluated: judge.total_teams_evaluated || 0,
      totalMentorshipHours: judge.total_mentorship_hours || 0, yearsOfExperience: judge.years_of_experience || 0, averageFeedbackRating: judge.average_feedback_rating,
      eventsJudgedVerified: judge.events_judged_verified || false, teamsEvaluatedVerified: judge.teams_evaluated_verified || false,
      mentorshipHoursVerified: judge.mentorship_hours_verified || false, feedbackRatingVerified: judge.feedback_rating_verified || false,
      linkedin: judge.linkedin, github: judge.github, twitter: judge.twitter, website: judge.website, email: judge.email, phone: judge.phone,
      address: judge.address, timezone: judge.timezone, compensationPreference: judge.compensation_preference, languagesSpoken: judge.languages_spoken || [],
      publicAchievements: judge.public_achievements, mentorshipStatement: judge.mentorship_statement, availabilityStatus: judge.availability_status || 'available',
      tier: judge.tier || 'starter', isPublished: judge.is_published || false,
      topEventsJudged: (events || []).map((e: any) => ({ eventName: e.event_name, role: e.event_role, date: e.event_date, link: e.event_link, verified: e.verified || false }))
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
// ORGANIZER ROUTES
// ============================================
app.get("/api/organizer/hackathons", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const { data, error } = await (supabaseAdmin as any).from('organizer_hackathons').select('*').eq('organizer_id', userId).order('created_at', { ascending: false });
    if (error) throw error;
    return res.json({ success: true, data: data || [] });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.get("/api/organizer/hackathons/:id", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const { id } = req.params;
    const { data, error } = await (supabaseAdmin as any).from('organizer_hackathons').select('*').eq('id', id).single();
    if (error || !data) return res.status(404).json({ success: false, message: 'Hackathon not found' });
    if (data.organizer_id !== userId) {
      const { data: coOrg } = await (supabaseAdmin as any).from('hackathon_co_organizers').select('id').eq('hackathon_id', id).eq('user_id', userId).single();
      if (!coOrg) return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    return res.json({ success: true, data });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.post("/api/organizer/hackathons", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const body = req.body;
    const baseSlug = (body.hackathon_name || 'hackathon').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const slug = `${baseSlug}-${Date.now().toString(36)}`;
    const { data, error } = await (supabaseAdmin as any).from('organizer_hackathons').insert({ ...body, organizer_id: userId, slug, status: 'draft' }).select().single();
    if (error) throw error;
    return res.json({ success: true, data });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.patch("/api/organizer/hackathons/:id", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const { id } = req.params;
    const body = req.body;
    const { data: hackathon } = await (supabaseAdmin as any).from('organizer_hackathons').select('organizer_id').eq('id', id).single();
    if (!hackathon || hackathon.organizer_id !== userId) return res.status(403).json({ success: false, message: 'Not authorized' });
    const { data, error } = await (supabaseAdmin as any).from('organizer_hackathons').update(body).eq('id', id).select().single();
    if (error) throw error;
    return res.json({ success: true, data });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.get("/api/organizer/my-profile", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const { data, error } = await (supabaseAdmin as any).from('organizer_profiles').select('*').eq('user_id', userId).single();
    if (error && error.code !== 'PGRST116') throw error;
    return res.json({ success: true, data: data || null });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.post("/api/organizer/apply", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const body = req.body;
    if (!body.username || !body.full_name || !body.email) return res.status(400).json({ message: 'Missing required fields' });
    const { data: existingUsername } = await (supabaseAdmin as any).from('organizer_applications').select('id').eq('username', body.username).maybeSingle();
    if (existingUsername) return res.status(400).json({ message: 'You have already submitted an application' });
    const { data: existingOrganizer } = await (supabaseAdmin as any).from('profiles').select('id, role').eq('username', body.username).single();
    if (existingOrganizer && existingOrganizer.role === 'organizer') return res.status(400).json({ message: 'You are already an approved organizer' });
    const applicationData = { user_id: body.user_id || null, username: body.username, email: body.email, full_name: body.full_name, organization_name: body.organization_name, organization_type: body.organization_type, organization_website: body.organization_website, phone: body.phone, location: body.location, previous_organizing_experience: body.previous_organizing_experience, why_maximally: body.why_maximally, linkedin: body.linkedin, twitter: body.twitter, instagram: body.instagram, additional_info: body.additional_info, agreed_to_terms: body.agreed_to_terms || false, status: 'pending' };
    const { data: application, error } = await (supabaseAdmin as any).from('organizer_applications').insert(applicationData).select().single();
    if (error) return res.status(500).json({ message: `Failed to submit: ${error.message}` });
    return res.status(201).json({ message: 'Application submitted successfully!', applicationId: application.id });
  } catch (e: any) { return res.status(500).json({ message: e.message }); }
});

// ============================================
// PARTICIPANT ROUTES
// ============================================
app.get("/api/participant/my-hackathons", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const { data: registrations, error } = await (supabaseAdmin as any).from('hackathon_registrations').select('*, hackathon_teams(team_name, team_code)').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) throw error;
    const enrichedData = await Promise.all((registrations || []).map(async (reg: any) => {
      const { data: hackathon } = await (supabaseAdmin as any).from('organizer_hackathons').select('id, hackathon_name, slug, start_date, end_date, format').eq('id', reg.hackathon_id).single();
      const { data: submission } = await (supabaseAdmin as any).from('hackathon_submissions').select('id, project_name, status, score, prize_won').eq('hackathon_id', reg.hackathon_id).eq('user_id', userId).single();
      return { ...(hackathon || {}), registration: { id: reg.id, status: reg.status, registration_number: reg.registration_number, registration_type: reg.registration_type, team: reg.hackathon_teams }, submission: submission || null };
    }));
    return res.json({ success: true, data: enrichedData });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});


// ============================================
// ADMIN ROUTES
// ============================================
app.get("/api/admin/judge-applications", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Missing token' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const { data: profile } = await (supabaseAdmin as any).from('profiles').select('role').eq('id', userId).single();
    if (!profile || profile.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin access required' });
    const { data, error } = await (supabaseAdmin as any).from('judge_applications').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return res.json({ success: true, data: data || [] });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.post("/api/admin/judge-applications/:id/approve", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Missing token' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const { data: profile } = await (supabaseAdmin as any).from('profiles').select('role').eq('id', userId).single();
    if (!profile || profile.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin access required' });
    const { id } = req.params;
    const { data: application } = await (supabaseAdmin as any).from('judge_applications').select('*').eq('id', id).single();
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    // Create judge from application
    const judgeData = { username: application.username, full_name: application.full_name, email: application.email, profile_photo: application.profile_photo, headline: application.headline, short_bio: application.short_bio, judge_location: application.judge_location, role_title: application.role_title, company: application.company, primary_expertise: application.primary_expertise, secondary_expertise: application.secondary_expertise, total_events_judged: application.total_events_judged, total_teams_evaluated: application.total_teams_evaluated, total_mentorship_hours: application.total_mentorship_hours, years_of_experience: application.years_of_experience, average_feedback_rating: application.average_feedback_rating, linkedin: application.linkedin, github: application.github, twitter: application.twitter, website: application.website, languages_spoken: application.languages_spoken, public_achievements: application.public_achievements, mentorship_statement: application.mentorship_statement, availability_status: application.availability_status, phone: application.phone, address: application.address, timezone: application.timezone, compensation_preference: application.compensation_preference, tier: 'starter', is_published: false };
    const { data: judge, error: judgeError } = await (supabaseAdmin as any).from('judges').insert(judgeData).select().single();
    if (judgeError) throw judgeError;
    await (supabaseAdmin as any).from('judge_applications').update({ status: 'approved' }).eq('id', id);
    return res.json({ success: true, message: 'Application approved', judge });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.post("/api/admin/judge-applications/:id/reject", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Missing token' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const { data: profile } = await (supabaseAdmin as any).from('profiles').select('role').eq('id', userId).single();
    if (!profile || profile.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin access required' });
    const { id } = req.params;
    const { reason } = req.body;
    await (supabaseAdmin as any).from('judge_applications').update({ status: 'rejected', rejection_reason: reason }).eq('id', id);
    return res.json({ success: true, message: 'Application rejected' });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.delete("/api/admin/judge-applications/:id", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Missing token' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const { data: profile } = await (supabaseAdmin as any).from('profiles').select('role').eq('id', userId).single();
    if (!profile || profile.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin access required' });
    const { id } = req.params;
    await (supabaseAdmin as any).from('judge_application_events').delete().eq('application_id', id);
    await (supabaseAdmin as any).from('judge_applications').delete().eq('id', id);
    return res.json({ success: true, message: 'Application deleted' });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.get("/api/admin/organizer-applications", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Missing token' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const { data: profile } = await (supabaseAdmin as any).from('profiles').select('role').eq('id', userId).single();
    if (!profile || profile.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin access required' });
    const { data, error } = await (supabaseAdmin as any).from('organizer_applications').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return res.json({ success: true, data: data || [] });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.post("/api/admin/organizer-applications/:id/approve", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Missing token' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const { data: profile } = await (supabaseAdmin as any).from('profiles').select('role').eq('id', userId).single();
    if (!profile || profile.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin access required' });
    const { id } = req.params;
    const { data: application } = await (supabaseAdmin as any).from('organizer_applications').select('*').eq('id', id).single();
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    // Update user profile to organizer role
    if (application.user_id) {
      await (supabaseAdmin as any).from('profiles').update({ role: 'organizer' }).eq('id', application.user_id);
    }
    // Create organizer profile
    const organizerData = { user_id: application.user_id, username: application.username, email: application.email, full_name: application.full_name, organization_name: application.organization_name, organization_type: application.organization_type, organization_website: application.organization_website, phone: application.phone, location: application.location, linkedin: application.linkedin, twitter: application.twitter, instagram: application.instagram };
    await (supabaseAdmin as any).from('organizer_profiles').upsert(organizerData, { onConflict: 'user_id' });
    await (supabaseAdmin as any).from('organizer_applications').update({ status: 'approved' }).eq('id', id);
    return res.json({ success: true, message: 'Application approved' });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.post("/api/admin/organizer-applications/:id/reject", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Missing token' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const { data: profile } = await (supabaseAdmin as any).from('profiles').select('role').eq('id', userId).single();
    if (!profile || profile.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin access required' });
    const { id } = req.params;
    const { reason } = req.body;
    await (supabaseAdmin as any).from('organizer_applications').update({ status: 'rejected', rejection_reason: reason }).eq('id', id);
    return res.json({ success: true, message: 'Application rejected' });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.delete("/api/admin/organizer-applications/:id", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Missing token' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const { data: profile } = await (supabaseAdmin as any).from('profiles').select('role').eq('id', userId).single();
    if (!profile || profile.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin access required' });
    const { id } = req.params;
    await (supabaseAdmin as any).from('organizer_applications').delete().eq('id', id);
    return res.json({ success: true, message: 'Application deleted' });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});


// ============================================
// PUBLIC HACKATHON ROUTES
// ============================================
app.get("/api/public/hackathons", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const { data, error } = await (supabaseAdmin as any).from('organizer_hackathons').select('id, hackathon_name, slug, tagline, description, cover_image, logo, start_date, end_date, registration_deadline, format, location, max_participants, registration_count, view_count, status, tracks, prizes').eq('status', 'published').order('start_date', { ascending: true });
    if (error) throw error;
    return res.json({ success: true, data: data || [] });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.get("/api/public/hackathons/featured", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const { data, error } = await (supabaseAdmin as any).from('organizer_hackathons').select('id, hackathon_name, slug, tagline, cover_image, logo, start_date, end_date, format, location').eq('status', 'published').eq('is_featured', true).order('start_date', { ascending: true }).limit(6);
    if (error) throw error;
    return res.json({ success: true, data: data || [] });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.get("/api/public/hackathons/upcoming", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const now = new Date().toISOString();
    const { data, error } = await (supabaseAdmin as any).from('organizer_hackathons').select('id, hackathon_name, slug, tagline, cover_image, logo, start_date, end_date, format, location, registration_deadline').eq('status', 'published').gte('start_date', now).order('start_date', { ascending: true }).limit(10);
    if (error) throw error;
    return res.json({ success: true, data: data || [] });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

// ============================================
// HACKATHON REGISTRATION ROUTES
// ============================================
app.get("/api/hackathons/:hackathonId/registrations", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const { hackathonId } = req.params;
    // Verify organizer access
    const { data: hackathon } = await (supabaseAdmin as any).from('organizer_hackathons').select('organizer_id').eq('id', hackathonId).single();
    if (!hackathon || hackathon.organizer_id !== userId) return res.status(403).json({ success: false, message: 'Not authorized' });
    const { data, error } = await (supabaseAdmin as any).from('hackathon_registrations').select('*').eq('hackathon_id', hackathonId).order('created_at', { ascending: false });
    if (error) throw error;
    return res.json({ success: true, data: data || [] });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.get("/api/hackathons/:hackathonId/submissions", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const { hackathonId } = req.params;
    // Verify organizer access
    const { data: hackathon } = await (supabaseAdmin as any).from('organizer_hackathons').select('organizer_id').eq('id', hackathonId).single();
    if (!hackathon || hackathon.organizer_id !== userId) return res.status(403).json({ success: false, message: 'Not authorized' });
    const { data, error } = await (supabaseAdmin as any).from('hackathon_submissions').select('*').eq('hackathon_id', hackathonId).order('created_at', { ascending: false });
    if (error) throw error;
    return res.json({ success: true, data: data || [] });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.patch("/api/hackathons/:hackathonId/registrations/:registrationId", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const { hackathonId, registrationId } = req.params;
    const body = req.body;
    // Verify organizer access
    const { data: hackathon } = await (supabaseAdmin as any).from('organizer_hackathons').select('organizer_id').eq('id', hackathonId).single();
    if (!hackathon || hackathon.organizer_id !== userId) return res.status(403).json({ success: false, message: 'Not authorized' });
    const { data, error } = await (supabaseAdmin as any).from('hackathon_registrations').update(body).eq('id', registrationId).select().single();
    if (error) throw error;
    return res.json({ success: true, data });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

// ============================================
// TEAM ROUTES
// ============================================
app.get("/api/hackathons/:hackathonId/teams", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const { hackathonId } = req.params;
    const { data, error } = await (supabaseAdmin as any).from('hackathon_teams').select('*').eq('hackathon_id', hackathonId);
    if (error) throw error;
    return res.json({ success: true, data: data || [] });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.post("/api/hackathons/:hackathonId/teams", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const { hackathonId } = req.params;
    const body = req.body;
    const teamCode = `TEAM-${Date.now().toString(36).toUpperCase()}`;
    const { data, error } = await (supabaseAdmin as any).from('hackathon_teams').insert({ hackathon_id: hackathonId, team_name: body.team_name, team_code: teamCode, leader_id: userId, max_members: body.max_members || 4 }).select().single();
    if (error) throw error;
    // Update registration with team_id
    await (supabaseAdmin as any).from('hackathon_registrations').update({ team_id: data.id, team_role: 'leader' }).eq('hackathon_id', hackathonId).eq('user_id', userId);
    return res.json({ success: true, data });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.post("/api/hackathons/:hackathonId/teams/join", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const { hackathonId } = req.params;
    const { team_code } = req.body;
    const { data: team } = await (supabaseAdmin as any).from('hackathon_teams').select('*').eq('hackathon_id', hackathonId).eq('team_code', team_code).single();
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
    // Check team capacity
    const { count } = await (supabaseAdmin as any).from('hackathon_registrations').select('*', { count: 'exact', head: true }).eq('team_id', team.id);
    if (count >= team.max_members) return res.status(400).json({ success: false, message: 'Team is full' });
    // Update registration with team_id
    const { data, error } = await (supabaseAdmin as any).from('hackathon_registrations').update({ team_id: team.id, team_role: 'member' }).eq('hackathon_id', hackathonId).eq('user_id', userId).select().single();
    if (error) throw error;
    return res.json({ success: true, data, team });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});


// ============================================
// GALLERY ROUTES
// ============================================
app.get("/api/gallery/projects", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const { data, error } = await (supabaseAdmin as any).from('gallery_projects').select('*').eq('status', 'approved').order('created_at', { ascending: false });
    if (error) throw error;
    return res.json({ success: true, data: data || [] });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.get("/api/gallery/projects/:id", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const { id } = req.params;
    const { data, error } = await (supabaseAdmin as any).from('gallery_projects').select('*').eq('id', id).single();
    if (error || !data) return res.status(404).json({ success: false, message: 'Project not found' });
    // Increment view count
    await (supabaseAdmin as any).from('gallery_projects').update({ view_count: (data.view_count || 0) + 1 }).eq('id', id);
    return res.json({ success: true, data });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.post("/api/gallery/projects", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const body = req.body;
    const { data, error } = await (supabaseAdmin as any).from('gallery_projects').insert({ ...body, user_id: userId, status: 'pending' }).select().single();
    if (error) throw error;
    return res.json({ success: true, data });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.post("/api/gallery/projects/:id/like", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const { id } = req.params;
    // Check if already liked
    const { data: existing } = await (supabaseAdmin as any).from('gallery_project_likes').select('id').eq('project_id', id).eq('user_id', userId).single();
    if (existing) {
      // Unlike
      await (supabaseAdmin as any).from('gallery_project_likes').delete().eq('id', existing.id);
      await (supabaseAdmin as any).rpc('decrement_project_likes', { project_id: parseInt(id) });
      return res.json({ success: true, liked: false });
    } else {
      // Like
      await (supabaseAdmin as any).from('gallery_project_likes').insert({ project_id: id, user_id: userId });
      await (supabaseAdmin as any).rpc('increment_project_likes', { project_id: parseInt(id) });
      return res.json({ success: true, liked: true });
    }
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

// ============================================
// ANNOUNCEMENT ROUTES
// ============================================
app.get("/api/hackathons/:hackathonId/announcements", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const { hackathonId } = req.params;
    const { data, error } = await (supabaseAdmin as any).from('hackathon_announcements').select('*').eq('hackathon_id', hackathonId).eq('is_published', true).order('created_at', { ascending: false });
    if (error) throw error;
    return res.json({ success: true, data: data || [] });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.post("/api/hackathons/:hackathonId/announcements", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const { hackathonId } = req.params;
    const body = req.body;
    // Verify organizer access
    const { data: hackathon } = await (supabaseAdmin as any).from('organizer_hackathons').select('organizer_id').eq('id', hackathonId).single();
    if (!hackathon || hackathon.organizer_id !== userId) return res.status(403).json({ success: false, message: 'Not authorized' });
    const { data, error } = await (supabaseAdmin as any).from('hackathon_announcements').insert({ hackathon_id: hackathonId, ...body, created_by: userId, is_published: true, published_at: new Date().toISOString() }).select().single();
    if (error) throw error;
    return res.json({ success: true, data });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

// ============================================
// HACKATHON JUDGES ROUTES
// ============================================
app.get("/api/hackathons/:hackathonId/judges", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const { hackathonId } = req.params;
    const { data, error } = await (supabaseAdmin as any).from('hackathon_judges').select('*').eq('hackathon_id', hackathonId);
    if (error) throw error;
    return res.json({ success: true, data: data || [] });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.post("/api/hackathons/:hackathonId/judges", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const { hackathonId } = req.params;
    const body = req.body;
    // Verify organizer access
    const { data: hackathon } = await (supabaseAdmin as any).from('organizer_hackathons').select('organizer_id').eq('id', hackathonId).single();
    if (!hackathon || hackathon.organizer_id !== userId) return res.status(403).json({ success: false, message: 'Not authorized' });
    const { data, error } = await (supabaseAdmin as any).from('hackathon_judges').insert({ hackathon_id: hackathonId, ...body }).select().single();
    if (error) throw error;
    return res.json({ success: true, data });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.delete("/api/hackathons/:hackathonId/judges/:judgeId", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const { hackathonId, judgeId } = req.params;
    // Verify organizer access
    const { data: hackathon } = await (supabaseAdmin as any).from('organizer_hackathons').select('organizer_id').eq('id', hackathonId).single();
    if (!hackathon || hackathon.organizer_id !== userId) return res.status(403).json({ success: false, message: 'Not authorized' });
    await (supabaseAdmin as any).from('hackathon_judges').delete().eq('id', judgeId);
    return res.json({ success: true, message: 'Judge removed' });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

// ============================================
// HACKATHON SPONSORS ROUTES
// ============================================
app.get("/api/hackathons/:hackathonId/sponsors", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const { hackathonId } = req.params;
    const { data, error } = await (supabaseAdmin as any).from('hackathon_sponsors').select('*').eq('hackathon_id', hackathonId).eq('is_active', true).order('display_order', { ascending: true });
    if (error) throw error;
    return res.json({ success: true, data: data || [] });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.post("/api/hackathons/:hackathonId/sponsors", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const { hackathonId } = req.params;
    const body = req.body;
    // Verify organizer access
    const { data: hackathon } = await (supabaseAdmin as any).from('organizer_hackathons').select('organizer_id').eq('id', hackathonId).single();
    if (!hackathon || hackathon.organizer_id !== userId) return res.status(403).json({ success: false, message: 'Not authorized' });
    const { data, error } = await (supabaseAdmin as any).from('hackathon_sponsors').insert({ hackathon_id: hackathonId, ...body }).select().single();
    if (error) throw error;
    return res.json({ success: true, data });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});


// ============================================
// HACKATHON SCHEDULE ROUTES
// ============================================
app.get("/api/hackathons/:hackathonId/schedule", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const { hackathonId } = req.params;
    const { data, error } = await (supabaseAdmin as any).from('hackathon_schedule_events').select('*').eq('hackathon_id', hackathonId).order('start_time', { ascending: true });
    if (error) throw error;
    return res.json({ success: true, data: data || [] });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.post("/api/hackathons/:hackathonId/schedule", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const { hackathonId } = req.params;
    const body = req.body;
    const { data: hackathon } = await (supabaseAdmin as any).from('organizer_hackathons').select('organizer_id').eq('id', hackathonId).single();
    if (!hackathon || hackathon.organizer_id !== userId) return res.status(403).json({ success: false, message: 'Not authorized' });
    const { data, error } = await (supabaseAdmin as any).from('hackathon_schedule_events').insert({ hackathon_id: hackathonId, ...body }).select().single();
    if (error) throw error;
    return res.json({ success: true, data });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

// ============================================
// HACKATHON RESOURCES ROUTES
// ============================================
app.get("/api/hackathons/:hackathonId/resources", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const { hackathonId } = req.params;
    const { data, error } = await (supabaseAdmin as any).from('hackathon_resources').select('*').eq('hackathon_id', hackathonId).order('created_at', { ascending: false });
    if (error) throw error;
    return res.json({ success: true, data: data || [] });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.post("/api/hackathons/:hackathonId/resources", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const { hackathonId } = req.params;
    const body = req.body;
    const { data: hackathon } = await (supabaseAdmin as any).from('organizer_hackathons').select('organizer_id').eq('id', hackathonId).single();
    if (!hackathon || hackathon.organizer_id !== userId) return res.status(403).json({ success: false, message: 'Not authorized' });
    const { data, error } = await (supabaseAdmin as any).from('hackathon_resources').insert({ hackathon_id: hackathonId, uploaded_by: userId, ...body }).select().single();
    if (error) throw error;
    return res.json({ success: true, data });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

// ============================================
// CUSTOM QUESTIONS ROUTES
// ============================================
app.get("/api/hackathons/:hackathonId/custom-questions", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const { hackathonId } = req.params;
    const { data, error } = await (supabaseAdmin as any).from('hackathon_custom_questions').select('*').eq('hackathon_id', hackathonId).order('order_index', { ascending: true });
    if (error) throw error;
    return res.json({ success: true, data: data || [] });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.post("/api/hackathons/:hackathonId/custom-questions", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const { hackathonId } = req.params;
    const body = req.body;
    const { data: hackathon } = await (supabaseAdmin as any).from('organizer_hackathons').select('organizer_id').eq('id', hackathonId).single();
    if (!hackathon || hackathon.organizer_id !== userId) return res.status(403).json({ success: false, message: 'Not authorized' });
    const { data, error } = await (supabaseAdmin as any).from('hackathon_custom_questions').insert({ hackathon_id: hackathonId, ...body }).select().single();
    if (error) throw error;
    return res.json({ success: true, data });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

// ============================================
// FEEDBACK ROUTES
// ============================================
app.get("/api/hackathons/:hackathonId/feedback-forms", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const { hackathonId } = req.params;
    const { data, error } = await (supabaseAdmin as any).from('hackathon_feedback_forms').select('*').eq('hackathon_id', hackathonId).eq('is_active', true);
    if (error) throw error;
    return res.json({ success: true, data: data || [] });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

app.post("/api/hackathons/:hackathonId/feedback", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const { hackathonId } = req.params;
    const body = req.body;
    const { data, error } = await (supabaseAdmin as any).from('hackathon_participant_feedback').insert({ hackathon_id: hackathonId, user_id: userId, ...body }).select().single();
    if (error) throw error;
    return res.json({ success: true, data });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

// ============================================
// ANALYTICS ROUTES
// ============================================
app.get("/api/hackathons/:hackathonId/analytics", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.toString().startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const token = authHeader.toString().slice(7);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });
    const { hackathonId } = req.params;
    const { data: hackathon } = await (supabaseAdmin as any).from('organizer_hackathons').select('organizer_id, registration_count, view_count').eq('id', hackathonId).single();
    if (!hackathon || hackathon.organizer_id !== userId) return res.status(403).json({ success: false, message: 'Not authorized' });
    const { count: submissionCount } = await (supabaseAdmin as any).from('hackathon_submissions').select('*', { count: 'exact', head: true }).eq('hackathon_id', hackathonId);
    const { count: teamCount } = await (supabaseAdmin as any).from('hackathon_teams').select('*', { count: 'exact', head: true }).eq('hackathon_id', hackathonId);
    return res.json({ success: true, data: { registration_count: hackathon.registration_count || 0, view_count: hackathon.view_count || 0, submission_count: submissionCount || 0, team_count: teamCount || 0 } });
  } catch (e: any) { return res.status(500).json({ success: false, message: e.message }); }
});

// ============================================
// MISSING PUBLIC HACKATHON ROUTES
// ============================================
app.get("/api/hackathons/:hackathonId/is-organizer", async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
      return res.json({ success: true, isOrganizer: false });
    }
    const token = authHeader.slice('Bearer '.length);
    const userId = await bearerUserId(supabaseAdmin, token);
    if (!userId) {
      return res.json({ success: true, isOrganizer: false });
    }
    const { hackathonId } = req.params;
    const { data: hackathon } = await (supabaseAdmin as any).from('organizer_hackathons').select('organizer_id').eq('id', hackathonId).single();
    if (hackathon?.organizer_id === userId) {
      return res.json({ success: true, isOrganizer: true });
    }
    const { data: coOrg } = await (supabaseAdmin as any).from('hackathon_organizers').select('role, status').eq('hackathon_id', hackathonId).eq('user_id', userId).eq('status', 'accepted').single();
    return res.json({ success: true, isOrganizer: !!coOrg });
  } catch (e: any) {
    return res.json({ success: true, isOrganizer: false });
  }
});

app.get("/api/hackathons/:hackathonId/winners", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const { hackathonId } = req.params;
    const hackathonIdNum = parseInt(hackathonId);
    if (isNaN(hackathonIdNum)) {
      return res.status(400).json({ success: false, message: 'Invalid hackathon ID' });
    }
    const { data, error } = await (supabaseAdmin as any).from('hackathon_winners').select(`
      *,
      submission:hackathon_submissions(
        id,
        project_name,
        description,
        tagline,
        github_repo,
        demo_url,
        video_url,
        cover_image,
        project_logo,
        user_id,
        team_id
      )
    `).eq('hackathon_id', hackathonIdNum).order('position', { ascending: true });
    if (error) throw error;
    const enrichedData = await Promise.all((data || []).map(async (winner: any) => {
      let userName = 'Anonymous';
      let teamName = null;
      if (winner.submission?.user_id) {
        const { data: profile } = await (supabaseAdmin as any).from('profiles').select('username, full_name').eq('id', winner.submission.user_id).single();
        userName = profile?.full_name || profile?.username || 'Anonymous';
      }
      if (winner.submission?.team_id) {
        const { data: team } = await (supabaseAdmin as any).from('hackathon_teams').select('team_name').eq('id', winner.submission.team_id).single();
        teamName = team?.team_name;
      }
      return {
        ...winner,
        submission: winner.submission ? {
          ...winner.submission,
          user_name: userName,
          team: teamName ? { team_name: teamName } : null
        } : null,
        team_name: teamName
      };
    }));
    return res.json({ success: true, data: enrichedData });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

app.get("/api/hackathons/:hackathonId/projects", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Server not configured" });
    const { hackathonId } = req.params;
    const { data, error } = await (supabaseAdmin as any).from('hackathon_submissions').select(`
      id,
      project_name,
      tagline,
      description,
      track,
      github_repo,
      demo_url,
      video_url,
      cover_image,
      project_logo,
      technologies_used,
      status,
      score,
      prize_won,
      submitted_at,
      user_id,
      team_id
    `).eq('hackathon_id', hackathonId).eq('status', 'submitted').order('submitted_at', { ascending: false });
    if (error) throw error;
    const enrichedData = await Promise.all((data || []).map(async (project: any) => {
      let userName = 'Anonymous';
      let team = null;
      if (project.user_id) {
        const { data: profile } = await (supabaseAdmin as any).from('profiles').select('username, full_name').eq('id', project.user_id).single();
        userName = profile?.full_name || profile?.username || 'Anonymous';
      }
      if (project.team_id) {
        const { data: teamData } = await (supabaseAdmin as any).from('hackathon_teams').select('team_name, team_code').eq('id', project.team_id).single();
        team = teamData;
      }
      return {
        ...project,
        user_name: userName,
        team
      };
    }));
    return res.json({ success: true, data: enrichedData });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

// ============================================
// CATCH-ALL ROUTE
// ============================================
app.use('/api/*', (_req: Request, res: Response) => {
  return res.status(404).json({ success: false, message: 'API endpoint not found' });
});

export const handler = serverless(app);
