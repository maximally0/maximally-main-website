/**
 * PRD §3.B: After a mentorship request, optionally notify the mentor via
 * Slack (incoming webhook), Resend (email), and in-app inbox row.
 * All calls are best-effort; failures are logged and never block the HTTP response.
 *
 * Env (optional):
 *   MENTOR_REQUEST_SLACK_WEBHOOK_URL — Slack Incoming Webhook URL
 *   RESEND_API_KEY — Resend API key (same as platform email)
 *   FROM_EMAIL or MENTOR_NOTIFICATION_FROM_EMAIL — verified sender (MENTOR_* overrides)
 *   PUBLIC_APP_URL — base URL for links in emails (default https://maximally.org)
 */

import { Resend } from 'resend';

let resendClient: Resend | null | undefined;

function getResendForMentorNotify(): Resend | null {
  if (resendClient !== undefined) return resendClient;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    resendClient = null;
    return null;
  }
  resendClient = new Resend(key);
  return resendClient;
}

export type MentorHelpRequestNotifyInput = {
  supabaseAdmin: any;
  mentorId: string;
  mentorUserId: string;
  mentorName: string;
  mentorEmail: string | null;
  sessionId: string;
  problemDescription: string;
  requestedTime: string | null;
  teamId: number | null;
  requesterUserId?: string | null;
  requesterEmail?: string | null;
};

function preview(text: string, max = 200): string {
  const t = text.replace(/\s+/g, ' ').trim();
  return t.length <= max ? t : `${t.slice(0, max)}…`;
}

async function postSlack(webhookUrl: string, text: string): Promise<void> {
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.warn('[mentor-notify] Slack webhook failed:', res.status, body);
  }
}

async function sendResendMentorEmail(to: string, subject: string, html: string): Promise<void> {
  const client = getResendForMentorNotify();
  const from =
    process.env.MENTOR_NOTIFICATION_FROM_EMAIL?.trim() ||
    process.env.FROM_EMAIL?.trim() ||
    '';
  if (!client) return;
  if (!from) {
    console.warn('[mentor-notify] Resend skipped: set FROM_EMAIL or MENTOR_NOTIFICATION_FROM_EMAIL');
    return;
  }

  try {
    const { error } = await client.emails.send({
      from,
      to,
      subject,
      html,
    });
    if (error) {
      console.warn('[mentor-notify] Resend failed:', error);
    }
  } catch (e) {
    console.warn('[mentor-notify] Resend error:', e);
  }
}

/**
 * Insert in-app inbox row (requires `mentor_help_request_inbox` table — see database/mentor_help_request_inbox.sql).
 */
async function tryInsertInbox(supabaseAdmin: any, mentorUserId: string, sessionId: string): Promise<void> {
  const { error } = await supabaseAdmin.from('mentor_help_request_inbox').insert({
    mentor_user_id: mentorUserId,
    session_id: sessionId,
    read_at: null,
  });
  if (error) {
    console.warn('[mentor-notify] In-app inbox insert skipped:', error.message);
  }
}

export async function notifyMentorHelpRequest(input: MentorHelpRequestNotifyInput): Promise<void> {
  const {
    supabaseAdmin,
    mentorUserId,
    mentorName,
    mentorEmail,
    sessionId,
    problemDescription,
    requestedTime,
    teamId,
    requesterUserId,
    requesterEmail,
  } = input;

  const base = process.env.PUBLIC_APP_URL || process.env.PLATFORM_URL || 'https://maximally.org';
  const dashboardUrl = `${base.replace(/\/$/, '')}/mentor/dashboard`;

  const lines = [
    `*New mentorship request*`,
    `Mentor: ${mentorName || mentorUserId}`,
    `Session: \`${sessionId}\``,
    `Team ID: ${teamId ?? '—'}`,
    `Requested time: ${requestedTime || '—'}`,
    `Problem: ${preview(problemDescription)}`,
    `Requester: ${requesterEmail || requesterUserId || 'anonymous'}`,
    `Open dashboard: ${dashboardUrl}`,
  ];
  const slackText = lines.join('\n');

  const slackUrl = process.env.MENTOR_REQUEST_SLACK_WEBHOOK_URL;
  if (slackUrl) {
    try {
      await postSlack(slackUrl, slackText);
    } catch (e) {
      console.warn('[mentor-notify] Slack error:', e);
    }
  }

  if (mentorEmail && process.env.RESEND_API_KEY) {
    const subject = 'New mentorship request on Maximally';
    const html = `
      <p>You have a new mentorship help request.</p>
      <ul>
        <li><strong>Problem:</strong> ${preview(problemDescription, 500)}</li>
        <li><strong>Team ID:</strong> ${teamId ?? '—'}</li>
        <li><strong>Preferred time:</strong> ${requestedTime || '—'}</li>
        <li><strong>From:</strong> ${requesterEmail || requesterUserId || 'anonymous'}</li>
      </ul>
      <p><a href="${dashboardUrl}">Open your mentor dashboard</a> to accept or decline.</p>
    `;
    await sendResendMentorEmail(mentorEmail, subject, html);
  }

  try {
    await tryInsertInbox(supabaseAdmin, mentorUserId, sessionId);
  } catch (e) {
    console.warn('[mentor-notify] Inbox error:', e);
  }
}
