import { Resend } from 'resend';

// Initialize Resend only if API key is provided
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@maximally.in';
const PLATFORM_NAME = 'Maximally';
const PLATFORM_URL = process.env.PLATFORM_URL || 'https://maximally.in';

// Email Templates
const emailTemplates = {
  registrationConfirmation: (data: {
    userName: string;
    hackathonName: string;
    hackathonSlug: string;
    registrationNumber: string;
    registrationType: string;
    teamName?: string;
    teamCode?: string;
    startDate: string;
    endDate: string;
  }) => ({
    subject: `✅ Registration Confirmed - ${data.hackathonName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Courier New', monospace; background: #000; color: #fff; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #1a1a1a; border: 3px solid #ff0000; padding: 30px; }
            .header { color: #ffd700; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; }
            .content { line-height: 1.6; }
            .info-box { background: #2a2a2a; border: 2px solid #ffd700; padding: 15px; margin: 20px 0; }
            .button { display: inline-block; background: #ff0000; color: #fff; padding: 12px 24px; text-decoration: none; margin: 20px 0; font-weight: bold; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #333; font-size: 12px; color: #888; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">🎮 REGISTRATION CONFIRMED!</div>
            <div class="content">
              <p>Hey ${data.userName}! 👋</p>
              <p>You're officially registered for <strong>${data.hackathonName}</strong>!</p>
              
              <div class="info-box">
                <strong>📋 Registration Details:</strong><br/>
                Registration #: <strong>${data.registrationNumber}</strong><br/>
                Type: <strong>${data.registrationType.toUpperCase()}</strong><br/>
                ${data.teamName ? `Team: <strong>${data.teamName}</strong> (Code: ${data.teamCode})<br/>` : ''}
                Dates: <strong>${new Date(data.startDate).toLocaleDateString()} - ${new Date(data.endDate).toLocaleDateString()}</strong>
              </div>

              <p><strong>What's Next?</strong></p>
              <ul>
                ${data.registrationType === 'team' && !data.teamName ? '<li>Create or join a team using a team code</li>' : ''}
                <li>Check the hackathon page for updates and announcements</li>
                <li>Start brainstorming your project idea</li>
                <li>Submit your project before the deadline</li>
              </ul>

              <a href="${PLATFORM_URL}/hackathon/${data.hackathonSlug}" class="button">VIEW HACKATHON →</a>

              <p>Good luck and happy hacking! 🚀</p>
            </div>
            <div class="footer">
              <p>This is an automated email from ${PLATFORM_NAME}. Please do not reply to this email.</p>
              <p><a href="${PLATFORM_URL}" style="color: #ffd700;">Visit ${PLATFORM_NAME}</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  submissionConfirmation: (data: {
    userName: string;
    hackathonName: string;
    hackathonSlug: string;
    projectName: string;
    projectId: number;
    submittedAt: string;
  }) => ({
    subject: `🎉 Project Submitted - ${data.projectName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Courier New', monospace; background: #000; color: #fff; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #1a1a1a; border: 3px solid #ffd700; padding: 30px; }
            .header { color: #ffd700; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; }
            .content { line-height: 1.6; }
            .info-box { background: #2a2a2a; border: 2px solid #00ff00; padding: 15px; margin: 20px 0; }
            .button { display: inline-block; background: #ffd700; color: #000; padding: 12px 24px; text-decoration: none; margin: 20px 0; font-weight: bold; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #333; font-size: 12px; color: #888; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">🎉 PROJECT SUBMITTED!</div>
            <div class="content">
              <p>Awesome work, ${data.userName}! 🎊</p>
              <p>Your project has been successfully submitted to <strong>${data.hackathonName}</strong>!</p>
              
              <div class="info-box">
                <strong>📦 Submission Details:</strong><br/>
                Project: <strong>${data.projectName}</strong><br/>
                Submitted: <strong>${new Date(data.submittedAt).toLocaleString()}</strong><br/>
                Status: <strong>SUBMITTED ✅</strong>
              </div>

              <p><strong>What Happens Next?</strong></p>
              <ul>
                <li>Judges will review your project</li>
                <li>You'll receive scores and feedback</li>
                <li>Winners will be announced on the hackathon page</li>
                <li>You can view your project in the gallery</li>
              </ul>

              <a href="${PLATFORM_URL}/project/${data.projectId}" class="button">VIEW YOUR PROJECT →</a>

              <p>Best of luck! May the best project win! 🏆</p>
            </div>
            <div class="footer">
              <p>This is an automated email from ${PLATFORM_NAME}. Please do not reply to this email.</p>
              <p><a href="${PLATFORM_URL}" style="color: #ffd700;">Visit ${PLATFORM_NAME}</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  announcement: (data: {
    userName: string;
    hackathonName: string;
    hackathonSlug: string;
    announcementTitle: string;
    announcementContent: string;
  }) => ({
    subject: `📢 ${data.announcementTitle} - ${data.hackathonName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Courier New', monospace; background: #000; color: #fff; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #1a1a1a; border: 3px solid #ff0000; padding: 30px; }
            .header { color: #ff0000; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; }
            .content { line-height: 1.6; }
            .announcement-box { background: #2a2a2a; border: 2px solid #ff0000; padding: 20px; margin: 20px 0; }
            .button { display: inline-block; background: #ff0000; color: #fff; padding: 12px 24px; text-decoration: none; margin: 20px 0; font-weight: bold; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #333; font-size: 12px; color: #888; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">📢 NEW ANNOUNCEMENT</div>
            <div class="content">
              <p>Hey ${data.userName}! 👋</p>
              <p>There's a new announcement for <strong>${data.hackathonName}</strong>:</p>
              
              <div class="announcement-box">
                <h2 style="color: #ffd700; margin-top: 0;">${data.announcementTitle}</h2>
                <p style="white-space: pre-wrap;">${data.announcementContent}</p>
              </div>

              <a href="${PLATFORM_URL}/hackathon/${data.hackathonSlug}" class="button">VIEW HACKATHON →</a>
            </div>
            <div class="footer">
              <p>This is an automated email from ${PLATFORM_NAME}. Please do not reply to this email.</p>
              <p><a href="${PLATFORM_URL}" style="color: #ffd700;">Visit ${PLATFORM_NAME}</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  winnerNotification: (data: {
    userName: string;
    hackathonName: string;
    hackathonSlug: string;
    projectName: string;
    projectId: number;
    prize: string;
    score: number;
  }) => ({
    subject: `🏆 Congratulations! You Won ${data.prize}!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Courier New', monospace; background: #000; color: #fff; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #1a1a1a; border: 3px solid #ffd700; padding: 30px; }
            .header { color: #ffd700; font-size: 28px; font-weight: bold; margin-bottom: 20px; text-align: center; }
            .trophy { text-align: center; font-size: 64px; margin: 20px 0; }
            .content { line-height: 1.6; }
            .prize-box { background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); color: #000; border: 3px solid #ffd700; padding: 20px; margin: 20px 0; text-align: center; }
            .button { display: inline-block; background: #ffd700; color: #000; padding: 12px 24px; text-decoration: none; margin: 20px 0; font-weight: bold; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #333; font-size: 12px; color: #888; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="trophy">🏆</div>
            <div class="header">CONGRATULATIONS!</div>
            <div class="content">
              <p>Amazing news, ${data.userName}! 🎉</p>
              <p>Your project <strong>${data.projectName}</strong> has won at <strong>${data.hackathonName}</strong>!</p>
              
              <div class="prize-box">
                <h2 style="margin: 0; font-size: 32px;">${data.prize}</h2>
                <p style="margin: 10px 0 0 0; font-size: 18px;">Score: ${data.score}/100</p>
              </div>

              <p>Your hard work and innovation have paid off! This is a huge achievement. 🚀</p>

              <p><strong>What's Next?</strong></p>
              <ul>
                <li>Your project now has a winner badge</li>
                <li>Share your achievement on social media</li>
                <li>The organizers will contact you about prize details</li>
              </ul>

              <a href="${PLATFORM_URL}/project/${data.projectId}" class="button">VIEW YOUR PROJECT →</a>

              <p>Keep building amazing things! 💪</p>
            </div>
            <div class="footer">
              <p>This is an automated email from ${PLATFORM_NAME}. Please do not reply to this email.</p>
              <p><a href="${PLATFORM_URL}" style="color: #ffd700;">Visit ${PLATFORM_NAME}</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  deadlineReminder: (data: {
    userName: string;
    hackathonName: string;
    hackathonSlug: string;
    deadline: string;
    hoursLeft: number;
  }) => ({
    subject: `⏰ ${data.hoursLeft}h Left - Submit Your Project!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Courier New', monospace; background: #000; color: #fff; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #1a1a1a; border: 3px solid #ff0000; padding: 30px; }
            .header { color: #ff0000; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; }
            .content { line-height: 1.6; }
            .warning-box { background: #ff0000; color: #fff; padding: 20px; margin: 20px 0; text-align: center; border: 3px solid #ffd700; }
            .button { display: inline-block; background: #ffd700; color: #000; padding: 12px 24px; text-decoration: none; margin: 20px 0; font-weight: bold; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #333; font-size: 12px; color: #888; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">⏰ DEADLINE APPROACHING!</div>
            <div class="content">
              <p>Hey ${data.userName}! ⚠️</p>
              <p>Time is running out for <strong>${data.hackathonName}</strong>!</p>
              
              <div class="warning-box">
                <h2 style="margin: 0; font-size: 36px;">${data.hoursLeft} HOURS LEFT</h2>
                <p style="margin: 10px 0 0 0;">Deadline: ${new Date(data.deadline).toLocaleString()}</p>
              </div>

              <p><strong>Don't miss out!</strong></p>
              <ul>
                <li>Submit your project before the deadline</li>
                <li>You can save as draft and submit later</li>
                <li>Make sure all links are working</li>
                <li>Add a great description and demo video</li>
              </ul>

              <a href="${PLATFORM_URL}/hackathon/${data.hackathonSlug}" class="button">SUBMIT NOW →</a>

              <p>You've got this! 💪</p>
            </div>
            <div class="footer">
              <p>This is an automated email from ${PLATFORM_NAME}. Please do not reply to this email.</p>
              <p><a href="${PLATFORM_URL}" style="color: #ffd700;">Visit ${PLATFORM_NAME}</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
};

// Email sending functions
export async function sendRegistrationConfirmation(data: Parameters<typeof emailTemplates.registrationConfirmation>[0] & { email: string }) {
  if (!resend) {
    console.log('⚠️ Email service not configured. Skipping registration confirmation email.');
    return;
  }
  
  try {
    const template = emailTemplates.registrationConfirmation(data);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: template.subject,
      html: template.html,
    });
    console.log(`✅ Registration confirmation sent to ${data.email}`);
  } catch (error) {
    console.error('❌ Failed to send registration confirmation:', error);
  }
}

export async function sendSubmissionConfirmation(data: Parameters<typeof emailTemplates.submissionConfirmation>[0] & { email: string }) {
  if (!resend) {
    console.log('⚠️ Email service not configured. Skipping submission confirmation email.');
    return;
  }
  
  try {
    const template = emailTemplates.submissionConfirmation(data);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: template.subject,
      html: template.html,
    });
    console.log(`✅ Submission confirmation sent to ${data.email}`);
  } catch (error) {
    console.error('❌ Failed to send submission confirmation:', error);
  }
}

export async function sendAnnouncement(data: Parameters<typeof emailTemplates.announcement>[0] & { email: string }) {
  if (!resend) {
    console.log('⚠️ Email service not configured. Skipping announcement email.');
    return;
  }
  
  try {
    const template = emailTemplates.announcement(data);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: template.subject,
      html: template.html,
    });
    console.log(`✅ Announcement sent to ${data.email}`);
  } catch (error) {
    console.error('❌ Failed to send announcement:', error);
  }
}

export async function sendWinnerNotification(data: Parameters<typeof emailTemplates.winnerNotification>[0] & { email: string }) {
  if (!resend) {
    console.log('⚠️ Email service not configured. Skipping winner notification email.');
    return;
  }
  
  try {
    const template = emailTemplates.winnerNotification(data);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: template.subject,
      html: template.html,
    });
    console.log(`✅ Winner notification sent to ${data.email}`);
  } catch (error) {
    console.error('❌ Failed to send winner notification:', error);
  }
}

export async function sendDeadlineReminder(data: Parameters<typeof emailTemplates.deadlineReminder>[0] & { email: string }) {
  if (!resend) {
    console.log('⚠️ Email service not configured. Skipping deadline reminder email.');
    return;
  }
  
  try {
    const template = emailTemplates.deadlineReminder(data);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: template.subject,
      html: template.html,
    });
    console.log(`✅ Deadline reminder sent to ${data.email}`);
  } catch (error) {
    console.error('❌ Failed to send deadline reminder:', error);
  }
}

export async function sendBulkEmails(emails: string[], subject: string, html: string) {
  if (!resend) {
    console.log('⚠️ Email service not configured. Skipping bulk emails.');
    return;
  }
  
  try {
    // Send in batches of 50 to avoid rate limits
    const batchSize = 50;
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      await Promise.all(
        batch.map(email =>
          resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject,
            html,
          })
        )
      );
      console.log(`✅ Sent batch ${Math.floor(i / batchSize) + 1} (${batch.length} emails)`);
    }
  } catch (error) {
    console.error('❌ Failed to send bulk emails:', error);
  }
}
