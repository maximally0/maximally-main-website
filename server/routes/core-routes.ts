// @ts-nocheck
/**
 * Core Routes Module
 * 
 * This module contains essential routes that were originally in server/routes.ts
 * These routes are now properly registered for production deployment.
 */

import type { Express, Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";
import { Resend } from 'resend';

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
  try { 
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase configuration for auth');
      return null;
    }
    
    const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    });
    
    const { data: { user }, error } = await tempClient.auth.getUser();
    return error || !user ? null : user.id; 
  } catch { 
    return null; 
  }
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

export function registerCoreRoutes(app: Express) {
  const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;

  // Health check
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ ok: true, timestamp: new Date().toISOString() });
  });

  // Notifications unread count (placeholder)
  app.get("/api/notifications/unread-count", (_req, res) => res.json({ success: true, count: 0 }));

  // Verify CAPTCHA
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

  // Auth: Signup request OTP
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

  // Auth: Verify OTP
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

  // Auth: Resend OTP
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

  // Auth: Validate email
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

  // Auth: Check password status
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

  // Auth: Change password
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

  // Account: Delete
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

  // Admin: Invite
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

  // Profile: Update
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

  // User: Export data
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
}
