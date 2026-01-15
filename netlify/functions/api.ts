// @ts-nocheck
/**
 * Complete Netlify Function with ALL routes from server
 * This imports all route modules to ensure 100% parity with local development
 */
import express from "express";
import serverless from "serverless-http";
import { createClient } from "@supabase/supabase-js";
import { Resend } from 'resend';

// Import all route registration functions
import { registerOrganizerRoutes } from "../../server/routes/organizer";
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

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// CORS middleware
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5002',
    'http://localhost:5001',
    'https://maximally.in',
    'https://www.maximally.in',
    'https://maximally-admin-panel.vercel.app'
  ];

  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Invite-Token');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
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
const resendApiKey = process.env.RESEND_API_KEY;
if (resendApiKey) {
  const resend = new Resend(resendApiKey);
  app.locals.resend = resend;
}

// Health check
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Register ALL route modules (same as server/routes.ts)
registerOrganizerRoutes(app);
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

// Catch-all 404
app.use('/api/*', (_req, res) => {
  return res.status(404).json({ success: false, message: 'API endpoint not found' });
});

export const handler = serverless(app);
