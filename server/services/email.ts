import { Resend } from 'resend';
import dotenv from 'dotenv';
import { sendEmailQueued } from './emailQueue';

// Ensure env vars are loaded (in case this module is imported before index.ts runs dotenv)
dotenv.config();

// Lazy-initialize Resend client
let resend: Resend | null = null;

function getResend(): Resend | null {
  if (resend) return resend;
  
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    resend = new Resend(apiKey);
    console.log('✅ Resend email client initialized');
  }
  return resend;
}

// Initialize resend on first import
getResend();

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@maximally.in';
const PLATFORM_NAME = 'Maximally';
const PLATFORM_URL = process.env.PLATFORM_URL || 'https://maximally.in';

// Brand colors matching the new cosmic UI
const BRAND_COLORS = {
  // Primary colors
  orange: '#F97316',      // Primary CTA button
  red: '#EF4444',         // Hackathon text gradient start
  purple: '#A855F7',      // Universe text / accents
  pink: '#EC4899',        // Gradient accents
  cyan: '#06B6D4',        // Secondary accents
  
  // Background colors
  black: '#000000',       // Main background
  darkPurple: '#1a0a2e',  // Cosmic purple tint
  darkRed: '#2a0a0a',     // Subtle red tint
  
  // Text colors
  white: '#FFFFFF',
  gray: '#9CA3AF',
  lightGray: '#D1D5DB',
  
  // Glow colors
  redGlow: 'rgba(239, 68, 68, 0.3)',
  purpleGlow: 'rgba(168, 85, 247, 0.3)',
  orangeGlow: 'rgba(249, 115, 22, 0.4)',
};

// Base email template with new cosmic UI styling
const getBaseTemplate = (content: string, preheader: string = '') => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${PLATFORM_NAME}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: 'Courier New', Courier, monospace !important;}
  </style>
  <![endif]-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Press+Start+2P&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'JetBrains Mono', 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Mono', 'Droid Sans Mono', 'Source Code Pro', 'Courier New', Courier, monospace;
      background: ${BRAND_COLORS.black};
      color: ${BRAND_COLORS.white};
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    
    .email-wrapper {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .email-container {
      background: linear-gradient(180deg, ${BRAND_COLORS.black} 0%, ${BRAND_COLORS.darkPurple} 50%, ${BRAND_COLORS.darkRed} 100%);
      border: 1px solid rgba(168, 85, 247, 0.2);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 0 60px ${BRAND_COLORS.purpleGlow}, 0 0 120px ${BRAND_COLORS.redGlow};
    }
    
    .header {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
      padding: 30px 40px;
      text-align: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .logo {
      font-family: 'Press Start 2P', 'VT323', 'Courier New', Courier, monospace;
      font-size: 20px;
      background: linear-gradient(90deg, ${BRAND_COLORS.white} 0%, ${BRAND_COLORS.red} 50%, ${BRAND_COLORS.purple} 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    /* Fallback for email clients that don't support gradient text */
    .logo-fallback {
      font-family: 'Press Start 2P', 'VT323', 'Courier New', Courier, monospace;
      font-size: 20px;
      color: ${BRAND_COLORS.white};
    }
    
    .content {
      padding: 40px;
    }
    
    .emoji-header {
      font-size: 56px;
      text-align: center;
      margin-bottom: 24px;
      filter: drop-shadow(0 0 20px ${BRAND_COLORS.purpleGlow});
    }
    
    .title {
      font-family: 'Press Start 2P', 'VT323', 'Courier New', Courier, monospace;
      font-size: 18px;
      text-align: center;
      margin-bottom: 30px;
      line-height: 1.5;
    }
    
    .title-gradient {
      background: linear-gradient(90deg, ${BRAND_COLORS.white} 0%, ${BRAND_COLORS.red} 40%, ${BRAND_COLORS.purple} 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    /* Fallback */
    .title-fallback {
      color: ${BRAND_COLORS.white};
    }
    
    .greeting {
      font-size: 16px;
      color: ${BRAND_COLORS.lightGray};
      margin-bottom: 20px;
    }
    
    .highlight-name {
      color: ${BRAND_COLORS.orange};
      font-weight: 600;
    }
    
    .message {
      font-size: 14px;
      color: ${BRAND_COLORS.gray};
      margin-bottom: 25px;
      line-height: 1.8;
    }
    
    .message strong {
      color: ${BRAND_COLORS.white};
    }
    
    .info-box {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-left: 3px solid ${BRAND_COLORS.orange};
      padding: 20px 24px;
      margin: 25px 0;
      border-radius: 0 8px 8px 0;
    }
    
    .info-box.success {
      border-left-color: #10B981;
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.02) 100%);
    }
    
    .info-box.purple {
      border-left-color: ${BRAND_COLORS.purple};
      background: linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0.02) 100%);
    }
    
    .info-box.warning {
      border-left-color: #FBBF24;
      background: linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(251, 191, 36, 0.02) 100%);
    }
    
    .info-label {
      font-size: 11px;
      color: ${BRAND_COLORS.gray};
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 12px;
      font-weight: 600;
    }
    
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .info-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    
    .info-row-label {
      color: ${BRAND_COLORS.gray};
      font-size: 13px;
    }
    
    .info-row-value {
      color: ${BRAND_COLORS.white};
      font-weight: 600;
      font-size: 14px;
    }
    
    .highlight-orange {
      color: ${BRAND_COLORS.orange};
    }
    
    .highlight-purple {
      color: ${BRAND_COLORS.purple};
    }
    
    .highlight-green {
      color: #10B981;
    }
    
    .button-container {
      text-align: center;
      margin: 35px 0;
    }
    
    .button {
      display: inline-block;
      background: linear-gradient(135deg, ${BRAND_COLORS.orange} 0%, ${BRAND_COLORS.red} 100%);
      color: ${BRAND_COLORS.white} !important;
      padding: 16px 36px;
      text-decoration: none;
      font-family: 'Press Start 2P', 'VT323', 'Courier New', Courier, monospace;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-radius: 4px;
      box-shadow: 0 4px 20px ${BRAND_COLORS.orangeGlow}, 0 0 40px ${BRAND_COLORS.redGlow};
      transition: all 0.3s ease;
    }
    
    .button-secondary {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
      border: 1px solid rgba(168, 85, 247, 0.5);
      box-shadow: 0 4px 20px ${BRAND_COLORS.purpleGlow};
    }
    
    .steps-list {
      margin: 25px 0;
      padding: 0;
      list-style: none;
    }
    
    .step-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 16px;
      padding: 16px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 8px;
    }
    
    .step-number {
      background: linear-gradient(135deg, ${BRAND_COLORS.orange} 0%, ${BRAND_COLORS.red} 100%);
      color: ${BRAND_COLORS.white};
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
      margin-right: 16px;
      flex-shrink: 0;
      box-shadow: 0 0 15px ${BRAND_COLORS.orangeGlow};
    }
    
    .step-text {
      color: ${BRAND_COLORS.lightGray};
      font-size: 14px;
      line-height: 1.6;
      padding-top: 4px;
    }
    
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.3), rgba(239, 68, 68, 0.3), transparent);
      margin: 30px 0;
    }
    
    .team-code-box {
      background: linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(236, 72, 153, 0.1) 100%);
      border: 2px dashed rgba(168, 85, 247, 0.4);
      padding: 24px;
      text-align: center;
      margin: 25px 0;
      border-radius: 8px;
    }
    
    .team-code {
      font-family: 'Press Start 2P', 'VT323', 'Courier New', Courier, monospace;
      font-size: 28px;
      color: ${BRAND_COLORS.purple};
      letter-spacing: 6px;
      text-shadow: 0 0 20px ${BRAND_COLORS.purpleGlow};
      margin-top: 12px;
    }
    
    .prize-box {
      background: linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(249, 115, 22, 0.1) 100%);
      border: 2px solid rgba(251, 191, 36, 0.3);
      padding: 30px;
      text-align: center;
      margin: 25px 0;
      border-radius: 8px;
    }
    
    .prize-amount {
      font-family: 'Press Start 2P', 'VT323', 'Courier New', Courier, monospace;
      font-size: 28px;
      color: #FBBF24;
      text-shadow: 0 0 30px rgba(251, 191, 36, 0.5);
    }
    
    .countdown-box {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(249, 115, 22, 0.1) 100%);
      border: 2px solid rgba(239, 68, 68, 0.3);
      padding: 28px;
      text-align: center;
      margin: 25px 0;
      border-radius: 8px;
    }
    
    .countdown-time {
      font-family: 'Press Start 2P', 'VT323', 'Courier New', Courier, monospace;
      font-size: 32px;
      color: ${BRAND_COLORS.red};
      text-shadow: 0 0 30px ${BRAND_COLORS.redGlow};
    }
    
    .badge {
      display: inline-block;
      padding: 4px 10px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-radius: 4px;
      margin-left: 8px;
    }
    
    .badge-success {
      background: rgba(16, 185, 129, 0.2);
      color: #10B981;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    
    .badge-purple {
      background: rgba(168, 85, 247, 0.2);
      color: ${BRAND_COLORS.purple};
      border: 1px solid rgba(168, 85, 247, 0.3);
    }
    
    .footer {
      background: rgba(0, 0, 0, 0.5);
      padding: 30px 40px;
      text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .footer-text {
      font-size: 12px;
      color: ${BRAND_COLORS.gray};
      margin-bottom: 16px;
      line-height: 1.6;
    }
    
    .footer-links {
      margin-top: 16px;
    }
    
    .footer-link {
      color: ${BRAND_COLORS.orange};
      text-decoration: none;
      font-size: 12px;
      margin: 0 12px;
    }
    
    .footer-link:hover {
      color: ${BRAND_COLORS.red};
    }
    
    .stats-row {
      display: flex;
      justify-content: center;
      gap: 40px;
      margin: 30px 0;
      text-align: center;
    }
    
    .stat-item {
      text-align: center;
    }
    
    .stat-value {
      font-family: 'Press Start 2P', 'VT323', 'Courier New', Courier, monospace;
      font-size: 20px;
      margin-bottom: 8px;
    }
    
    .stat-value.red { color: ${BRAND_COLORS.red}; }
    .stat-value.purple { color: ${BRAND_COLORS.purple}; }
    .stat-value.cyan { color: ${BRAND_COLORS.cyan}; }
    
    .stat-label {
      font-size: 10px;
      color: ${BRAND_COLORS.gray};
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    @media only screen and (max-width: 600px) {
      .email-wrapper {
        padding: 10px;
      }
      
      .header, .content, .footer {
        padding: 24px;
      }
      
      .title {
        font-size: 14px;
      }
      
      .button {
        padding: 14px 28px;
        font-size: 10px;
      }
      
      .team-code, .prize-amount, .countdown-time {
        font-size: 22px;
      }
    }
  </style>
</head>
<body>
  <span style="display:none;font-size:1px;color:#000000;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${preheader}
  </span>
  <div class="email-wrapper">
    <div class="email-container">
      <div class="header">
        <div class="logo-fallback">⚡ MAXIMALLY</div>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <p class="footer-text">
          This is an automated email from ${PLATFORM_NAME}.<br>
          Please do not reply to this email.
        </p>
        <div class="footer-links">
          <a href="${PLATFORM_URL}" class="footer-link">Visit Maximally</a>
          <a href="${PLATFORM_URL}/events" class="footer-link">Browse Events</a>
          <a href="${PLATFORM_URL}/explore" class="footer-link">Explore</a>
        </div>
        <p class="footer-text" style="margin-top: 20px; font-size: 10px; color: #6B7280;">
          © ${new Date().getFullYear()} Maximally. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;


// Email Templates
const emailTemplates = {
  // Registration Confirmation
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
    subject: `✅ You're In! Registration Confirmed - ${data.hackathonName}`,
    html: getBaseTemplate(`
      <div class="emoji-header">🎮</div>
      <h1 class="title title-fallback">REGISTRATION CONFIRMED!</h1>
      
      <p class="greeting">Hey <span class="highlight-name">${data.userName}</span>! 👋</p>
      
      <p class="message">
        Awesome news! You're officially registered for <strong>${data.hackathonName}</strong>. 
        Get ready to build something amazing!
      </p>
      
      <div class="info-box success">
        <div class="info-label">📋 Registration Details</div>
        <div class="info-row">
          <span class="info-row-label">Registration #</span>
          <span class="info-row-value">${data.registrationNumber}</span>
        </div>
        <div class="info-row">
          <span class="info-row-label">Type</span>
          <span class="info-row-value">${data.registrationType.toUpperCase()}</span>
        </div>
        ${data.teamName ? `
        <div class="info-row">
          <span class="info-row-label">Team</span>
          <span class="info-row-value">${data.teamName}</span>
        </div>
        ` : ''}
        <div class="info-row">
          <span class="info-row-label">Event Dates</span>
          <span class="info-row-value">${new Date(data.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(data.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>
      
      ${data.teamCode ? `
      <div class="team-code-box">
        <div class="info-label">🔗 Your Team Code</div>
        <div class="team-code">${data.teamCode}</div>
        <p style="color: ${BRAND_COLORS.gray}; font-size: 12px; margin-top: 12px;">
          Share this code with teammates to join your team
        </p>
      </div>
      ` : ''}
      
      <div class="divider"></div>
      
      <p class="message"><strong>What's Next?</strong></p>
      
      <ul class="steps-list">
        ${data.registrationType === 'team' && !data.teamName ? `
        <li class="step-item">
          <span class="step-number">1</span>
          <span class="step-text">Create or join a team using a team code</span>
        </li>
        ` : ''}
        <li class="step-item">
          <span class="step-number">${data.registrationType === 'team' && !data.teamName ? '2' : '1'}</span>
          <span class="step-text">Check the hackathon page for updates and announcements</span>
        </li>
        <li class="step-item">
          <span class="step-number">${data.registrationType === 'team' && !data.teamName ? '3' : '2'}</span>
          <span class="step-text">Start brainstorming your project idea</span>
        </li>
        <li class="step-item">
          <span class="step-number">${data.registrationType === 'team' && !data.teamName ? '4' : '3'}</span>
          <span class="step-text">Submit your project before the deadline</span>
        </li>
      </ul>
      
      <div class="button-container">
        <a href="${PLATFORM_URL}/hackathon/${data.hackathonSlug}" class="button">VIEW HACKATHON →</a>
      </div>
      
      <p class="message" style="text-align: center;">
        Good luck and happy hacking! 🚀
      </p>
    `, `You're registered for ${data.hackathonName}! Get ready to build something amazing.`),
  }),

  // Submission Confirmation
  submissionConfirmation: (data: {
    userName: string;
    hackathonName: string;
    hackathonSlug: string;
    projectName: string;
    projectId: number;
    submittedAt: string;
  }) => ({
    subject: `🎉 Project Submitted! - ${data.projectName}`,
    html: getBaseTemplate(`
      <div class="emoji-header">🎉</div>
      <h1 class="title title-fallback">PROJECT SUBMITTED!</h1>
      
      <p class="greeting">Awesome work, <span class="highlight-name">${data.userName}</span>! 🎊</p>
      
      <p class="message">
        Your project has been successfully submitted to <strong>${data.hackathonName}</strong>!
        This is a huge milestone - you should be proud!
      </p>
      
      <div class="info-box success">
        <div class="info-label">📦 Submission Details</div>
        <div class="info-row">
          <span class="info-row-label">Project</span>
          <span class="info-row-value">${data.projectName}</span>
        </div>
        <div class="info-row">
          <span class="info-row-label">Submitted</span>
          <span class="info-row-value">${new Date(data.submittedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
        </div>
        <div class="info-row">
          <span class="info-row-label">Status</span>
          <span class="info-row-value">SUBMITTED <span class="badge badge-success">✓</span></span>
        </div>
      </div>
      
      <div class="divider"></div>
      
      <p class="message"><strong>What Happens Next?</strong></p>
      
      <ul class="steps-list">
        <li class="step-item">
          <span class="step-number">1</span>
          <span class="step-text">Judges will review your project based on the criteria</span>
        </li>
        <li class="step-item">
          <span class="step-number">2</span>
          <span class="step-text">You'll receive scores and feedback after judging</span>
        </li>
        <li class="step-item">
          <span class="step-number">3</span>
          <span class="step-text">Winners will be announced on the hackathon page</span>
        </li>
        <li class="step-item">
          <span class="step-number">4</span>
          <span class="step-text">Your project will be featured in the gallery</span>
        </li>
      </ul>
      
      <div class="button-container">
        <a href="${PLATFORM_URL}/project/${data.projectId}" class="button">VIEW YOUR PROJECT →</a>
      </div>
      
      <p class="message" style="text-align: center;">
        Best of luck! May the best project win! 🏆
      </p>
    `, `Your project "${data.projectName}" has been submitted to ${data.hackathonName}!`),
  }),

  // Announcement
  announcement: (data: {
    userName: string;
    hackathonName: string;
    hackathonSlug: string;
    announcementTitle: string;
    announcementContent: string;
  }) => ({
    subject: `📢 ${data.announcementTitle} - ${data.hackathonName}`,
    html: getBaseTemplate(`
      <div class="emoji-header">📢</div>
      <h1 class="title title-fallback">NEW ANNOUNCEMENT</h1>
      
      <p class="greeting">Hey <span class="highlight-name">${data.userName}</span>! 👋</p>
      
      <p class="message">
        There's a new announcement for <strong>${data.hackathonName}</strong>:
      </p>
      
      <div class="info-box">
        <h2 style="color: ${BRAND_COLORS.orange}; font-size: 16px; margin-bottom: 16px; font-weight: 600;">${data.announcementTitle}</h2>
        <p style="color: ${BRAND_COLORS.lightGray}; white-space: pre-wrap; line-height: 1.8; font-size: 14px;">${data.announcementContent}</p>
      </div>
      
      <div class="button-container">
        <a href="${PLATFORM_URL}/hackathon/${data.hackathonSlug}" class="button">VIEW HACKATHON →</a>
      </div>
    `, `New announcement for ${data.hackathonName}: ${data.announcementTitle}`),
  }),

  // Winner Notification
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
    html: getBaseTemplate(`
      <div class="emoji-header">🏆</div>
      <h1 class="title title-fallback">CONGRATULATIONS!</h1>
      
      <p class="greeting">Amazing news, <span class="highlight-name">${data.userName}</span>! 🎉</p>
      
      <p class="message">
        Your project <strong>${data.projectName}</strong> has won at <strong>${data.hackathonName}</strong>!
        Your hard work and innovation have paid off!
      </p>
      
      <div class="prize-box">
        <div class="info-label">🎖️ Your Achievement</div>
        <div class="prize-amount">${data.prize}</div>
        <p style="color: ${BRAND_COLORS.gray}; font-size: 14px; margin-top: 12px;">
          Score: <span class="highlight-orange">${data.score}/100</span>
        </p>
      </div>
      
      <div class="divider"></div>
      
      <p class="message"><strong>What's Next?</strong></p>
      
      <ul class="steps-list">
        <li class="step-item">
          <span class="step-number">🏅</span>
          <span class="step-text">Your project now has a winner badge</span>
        </li>
        <li class="step-item">
          <span class="step-number">📱</span>
          <span class="step-text">Share your achievement on social media</span>
        </li>
        <li class="step-item">
          <span class="step-number">📧</span>
          <span class="step-text">The organizers will contact you about prize details</span>
        </li>
      </ul>
      
      <div class="button-container">
        <a href="${PLATFORM_URL}/project/${data.projectId}" class="button">VIEW YOUR PROJECT →</a>
      </div>
      
      <p class="message" style="text-align: center;">
        Keep building amazing things! 💪
      </p>
    `, `Congratulations! You won ${data.prize} at ${data.hackathonName}!`),
  }),

  // Deadline Reminder
  deadlineReminder: (data: {
    userName: string;
    hackathonName: string;
    hackathonSlug: string;
    deadline: string;
    hoursLeft: number;
  }) => ({
    subject: `⏰ ${data.hoursLeft}h Left - Submit Your Project!`,
    html: getBaseTemplate(`
      <div class="emoji-header">⏰</div>
      <h1 class="title title-fallback">DEADLINE APPROACHING!</h1>
      
      <p class="greeting">Hey <span class="highlight-name">${data.userName}</span>! ⚠️</p>
      
      <p class="message">
        Time is running out for <strong>${data.hackathonName}</strong>!
        Don't miss your chance to submit.
      </p>
      
      <div class="countdown-box">
        <div class="info-label">⏱️ Time Remaining</div>
        <div class="countdown-time">${data.hoursLeft} HOURS</div>
        <p style="color: ${BRAND_COLORS.gray}; font-size: 12px; margin-top: 12px;">
          Deadline: ${new Date(data.deadline).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
        </p>
      </div>
      
      <div class="divider"></div>
      
      <p class="message"><strong>Quick Checklist:</strong></p>
      
      <ul class="steps-list">
        <li class="step-item">
          <span class="step-number">✓</span>
          <span class="step-text">Submit your project before the deadline</span>
        </li>
        <li class="step-item">
          <span class="step-number">✓</span>
          <span class="step-text">Make sure all links are working</span>
        </li>
        <li class="step-item">
          <span class="step-number">✓</span>
          <span class="step-text">Add a great description and demo video</span>
        </li>
        <li class="step-item">
          <span class="step-number">✓</span>
          <span class="step-text">Double-check your submission details</span>
        </li>
      </ul>
      
      <div class="button-container">
        <a href="${PLATFORM_URL}/hackathon/${data.hackathonSlug}" class="button">SUBMIT NOW →</a>
      </div>
      
      <p class="message" style="text-align: center;">
        You've got this! 💪
      </p>
    `, `Only ${data.hoursLeft} hours left to submit your project for ${data.hackathonName}!`),
  }),

  // Team Created
  teamCreated: (data: {
    userName: string;
    hackathonName: string;
    hackathonSlug: string;
    teamName: string;
    teamCode: string;
  }) => ({
    subject: `🎯 Team Created! - ${data.teamName}`,
    html: getBaseTemplate(`
      <div class="emoji-header">🎯</div>
      <h1 class="title title-fallback">TEAM CREATED!</h1>
      
      <p class="greeting">Nice one, <span class="highlight-name">${data.userName}</span>! 🎉</p>
      
      <p class="message">
        You've successfully created team <strong>${data.teamName}</strong> for <strong>${data.hackathonName}</strong>!
        Now it's time to recruit your squad.
      </p>
      
      <div class="team-code-box">
        <div class="info-label">🔗 Your Team Code</div>
        <div class="team-code">${data.teamCode}</div>
        <p style="color: ${BRAND_COLORS.gray}; font-size: 12px; margin-top: 12px;">
          Share this code with friends to join your team
        </p>
      </div>
      
      <div class="info-box purple">
        <div class="info-label">📋 Team Details</div>
        <div class="info-row">
          <span class="info-row-label">Team Name</span>
          <span class="info-row-value">${data.teamName}</span>
        </div>
        <div class="info-row">
          <span class="info-row-label">Your Role</span>
          <span class="info-row-value">Team Leader <span class="badge badge-purple">👑</span></span>
        </div>
        <div class="info-row">
          <span class="info-row-label">Hackathon</span>
          <span class="info-row-value">${data.hackathonName}</span>
        </div>
      </div>
      
      <div class="divider"></div>
      
      <p class="message"><strong>Next Steps:</strong></p>
      
      <ul class="steps-list">
        <li class="step-item">
          <span class="step-number">1</span>
          <span class="step-text">Share the team code with your teammates</span>
        </li>
        <li class="step-item">
          <span class="step-number">2</span>
          <span class="step-text">Coordinate your project idea together</span>
        </li>
        <li class="step-item">
          <span class="step-number">3</span>
          <span class="step-text">As team leader, you'll submit the final project</span>
        </li>
      </ul>
      
      <div class="button-container">
        <a href="${PLATFORM_URL}/hackathon/${data.hackathonSlug}" class="button">VIEW HACKATHON →</a>
      </div>
    `, `Team "${data.teamName}" created! Share code ${data.teamCode} with teammates.`),
  }),

  // Team Joined
  teamJoined: (data: {
    userName: string;
    hackathonName: string;
    hackathonSlug: string;
    teamName: string;
    teamLeaderName: string;
  }) => ({
    subject: `🤝 You Joined ${data.teamName}!`,
    html: getBaseTemplate(`
      <div class="emoji-header">🤝</div>
      <h1 class="title title-fallback">WELCOME TO THE TEAM!</h1>
      
      <p class="greeting">Hey <span class="highlight-name">${data.userName}</span>! 🎉</p>
      
      <p class="message">
        You've successfully joined team <strong>${data.teamName}</strong> for <strong>${data.hackathonName}</strong>!
        Time to collaborate and build something awesome.
      </p>
      
      <div class="info-box purple">
        <div class="info-label">📋 Team Details</div>
        <div class="info-row">
          <span class="info-row-label">Team Name</span>
          <span class="info-row-value">${data.teamName}</span>
        </div>
        <div class="info-row">
          <span class="info-row-label">Team Leader</span>
          <span class="info-row-value">${data.teamLeaderName} <span class="badge badge-purple">👑</span></span>
        </div>
        <div class="info-row">
          <span class="info-row-label">Your Role</span>
          <span class="info-row-value">Team Member</span>
        </div>
      </div>
      
      <div class="divider"></div>
      
      <p class="message"><strong>What You Should Know:</strong></p>
      
      <ul class="steps-list">
        <li class="step-item">
          <span class="step-number">💡</span>
          <span class="step-text">Coordinate with your team on the project idea</span>
        </li>
        <li class="step-item">
          <span class="step-number">📝</span>
          <span class="step-text">The team leader will submit the final project</span>
        </li>
        <li class="step-item">
          <span class="step-number">🏆</span>
          <span class="step-text">All team members share in any prizes won</span>
        </li>
      </ul>
      
      <div class="button-container">
        <a href="${PLATFORM_URL}/hackathon/${data.hackathonSlug}" class="button">VIEW HACKATHON →</a>
      </div>
    `, `You joined team "${data.teamName}" for ${data.hackathonName}!`),
  }),


  // Hackathon Starting Soon
  hackathonStartingSoon: (data: {
    userName: string;
    hackathonName: string;
    hackathonSlug: string;
    startDate: string;
    hoursUntilStart: number;
  }) => ({
    subject: `🚀 ${data.hackathonName} Starts in ${data.hoursUntilStart}h!`,
    html: getBaseTemplate(`
      <div class="emoji-header">🚀</div>
      <h1 class="title title-fallback">GET READY TO BUILD!</h1>
      
      <p class="greeting">Hey <span class="highlight-name">${data.userName}</span>! 🎮</p>
      
      <p class="message">
        <strong>${data.hackathonName}</strong> is starting soon! 
        Make sure you're ready to hit the ground running.
      </p>
      
      <div class="countdown-box">
        <div class="info-label">🕐 Starting In</div>
        <div class="countdown-time">${data.hoursUntilStart} HOURS</div>
        <p style="color: ${BRAND_COLORS.gray}; font-size: 12px; margin-top: 12px;">
          ${new Date(data.startDate).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
        </p>
      </div>
      
      <div class="divider"></div>
      
      <p class="message"><strong>Pre-Hackathon Checklist:</strong></p>
      
      <ul class="steps-list">
        <li class="step-item">
          <span class="step-number">✓</span>
          <span class="step-text">Review the hackathon rules and judging criteria</span>
        </li>
        <li class="step-item">
          <span class="step-number">✓</span>
          <span class="step-text">Set up your development environment</span>
        </li>
        <li class="step-item">
          <span class="step-number">✓</span>
          <span class="step-text">Brainstorm project ideas with your team</span>
        </li>
        <li class="step-item">
          <span class="step-number">✓</span>
          <span class="step-text">Get some rest - you'll need the energy!</span>
        </li>
      </ul>
      
      <div class="button-container">
        <a href="${PLATFORM_URL}/hackathon/${data.hackathonSlug}" class="button">VIEW HACKATHON →</a>
      </div>
      
      <p class="message" style="text-align: center;">
        Let's build something amazing! 🔥
      </p>
    `, `${data.hackathonName} starts in ${data.hoursUntilStart} hours! Get ready to build.`),
  }),

  // Organizer: Hackathon Approved
  hackathonApproved: (data: {
    organizerName: string;
    hackathonName: string;
    hackathonSlug: string;
  }) => ({
    subject: `🎉 Your Hackathon "${data.hackathonName}" is Approved!`,
    html: getBaseTemplate(`
      <div class="emoji-header">🎉</div>
      <h1 class="title title-fallback">HACKATHON APPROVED!</h1>
      
      <p class="greeting">Congratulations, <span class="highlight-name">${data.organizerName}</span>! 🎊</p>
      
      <p class="message">
        Great news! Your hackathon <strong>"${data.hackathonName}"</strong> has been approved 
        and is now live on Maximally!
      </p>
      
      <div class="info-box success">
        <div class="info-label">✅ Status Update</div>
        <div class="info-row">
          <span class="info-row-label">Hackathon</span>
          <span class="info-row-value">${data.hackathonName}</span>
        </div>
        <div class="info-row">
          <span class="info-row-label">Status</span>
          <span class="info-row-value">APPROVED <span class="badge badge-success">✓</span></span>
        </div>
        <div class="info-row">
          <span class="info-row-label">Visibility</span>
          <span class="info-row-value">Public</span>
        </div>
      </div>
      
      <div class="divider"></div>
      
      <p class="message"><strong>Next Steps:</strong></p>
      
      <ul class="steps-list">
        <li class="step-item">
          <span class="step-number">1</span>
          <span class="step-text">Share your hackathon link on social media</span>
        </li>
        <li class="step-item">
          <span class="step-number">2</span>
          <span class="step-text">Invite judges to evaluate submissions</span>
        </li>
        <li class="step-item">
          <span class="step-number">3</span>
          <span class="step-text">Monitor registrations from your dashboard</span>
        </li>
        <li class="step-item">
          <span class="step-number">4</span>
          <span class="step-text">Post announcements to keep participants engaged</span>
        </li>
      </ul>
      
      <div class="button-container">
        <a href="${PLATFORM_URL}/hackathon/${data.hackathonSlug}" class="button">VIEW HACKATHON →</a>
      </div>
      
      <p class="message" style="text-align: center;">
        Good luck with your event! 🚀
      </p>
    `, `Your hackathon "${data.hackathonName}" has been approved and is now live!`),
  }),

  // Organizer: Hackathon Rejected
  hackathonRejected: (data: {
    organizerName: string;
    hackathonName: string;
    reason?: string;
  }) => ({
    subject: `📝 Update on Your Hackathon "${data.hackathonName}"`,
    html: getBaseTemplate(`
      <div class="emoji-header">📝</div>
      <h1 class="title title-fallback">REVIEW UPDATE</h1>
      
      <p class="greeting">Hey <span class="highlight-name">${data.organizerName}</span>,</p>
      
      <p class="message">
        We've reviewed your hackathon submission <strong>"${data.hackathonName}"</strong> 
        and unfortunately, it wasn't approved at this time.
      </p>
      
      ${data.reason ? `
      <div class="info-box warning">
        <div class="info-label">📋 Feedback</div>
        <p style="color: ${BRAND_COLORS.lightGray}; margin-top: 12px; line-height: 1.8; font-size: 14px;">${data.reason}</p>
      </div>
      ` : ''}
      
      <div class="divider"></div>
      
      <p class="message"><strong>What You Can Do:</strong></p>
      
      <ul class="steps-list">
        <li class="step-item">
          <span class="step-number">1</span>
          <span class="step-text">Review the feedback provided above</span>
        </li>
        <li class="step-item">
          <span class="step-number">2</span>
          <span class="step-text">Make necessary changes to your hackathon</span>
        </li>
        <li class="step-item">
          <span class="step-number">3</span>
          <span class="step-text">Resubmit for review when ready</span>
        </li>
      </ul>
      
      <p class="message">
        If you have questions, feel free to reach out to our team. 
        We're here to help you create a successful event!
      </p>
      
      <div class="button-container">
        <a href="${PLATFORM_URL}/organizer/dashboard" class="button">GO TO DASHBOARD →</a>
      </div>
    `, `Update on your hackathon "${data.hackathonName}" submission.`),
  }),

  // Organizer: Registration Milestone
  registrationMilestone: (data: {
    organizerName: string;
    hackathonName: string;
    hackathonSlug: string;
    milestone: number;
    totalRegistrations: number;
  }) => ({
    subject: `🎉 ${data.milestone} Registrations! - ${data.hackathonName}`,
    html: getBaseTemplate(`
      <div class="emoji-header">🎉</div>
      <h1 class="title title-fallback">MILESTONE REACHED!</h1>
      
      <p class="greeting">Congratulations <span class="highlight-name">${data.organizerName}</span>! 🚀</p>
      
      <p class="message">
        Your hackathon <strong>${data.hackathonName}</strong> just hit a major milestone!
      </p>
      
      <div class="prize-box">
        <div class="info-label">🎯 Registration Milestone</div>
        <div class="prize-amount">${data.milestone}+</div>
        <p style="color: ${BRAND_COLORS.gray}; font-size: 14px; margin-top: 12px;">
          Total Registrations: <span class="highlight-orange">${data.totalRegistrations}</span>
        </p>
      </div>
      
      <div class="divider"></div>
      
      <p class="message"><strong>Keep the momentum going:</strong></p>
      
      <ul class="steps-list">
        <li class="step-item">
          <span class="step-number">📢</span>
          <span class="step-text">Share this milestone on social media</span>
        </li>
        <li class="step-item">
          <span class="step-number">📧</span>
          <span class="step-text">Send an announcement to your participants</span>
        </li>
        <li class="step-item">
          <span class="step-number">🎯</span>
          <span class="step-text">Keep promoting to reach the next milestone!</span>
        </li>
      </ul>
      
      <div class="button-container">
        <a href="${PLATFORM_URL}/organizer/hackathons/${data.hackathonSlug}" class="button">VIEW DASHBOARD →</a>
      </div>
      
      <p class="message" style="text-align: center;">
        Amazing work! Your hackathon is growing! 💪
      </p>
    `, `${data.hackathonName} just hit ${data.milestone} registrations!`),
  }),

  // User: Promoted to Organizer
  organizerPromotion: (data: {
    userName: string;
  }) => ({
    subject: `🎊 You're Now an Organizer on Maximally!`,
    html: getBaseTemplate(`
      <div class="emoji-header">🎊</div>
      <h1 class="title title-fallback">YOU'RE AN ORGANIZER!</h1>
      
      <p class="greeting">Congratulations <span class="highlight-name">${data.userName}</span>! 🚀</p>
      
      <p class="message">
        Your organizer application has been approved! You now have the power to 
        create and manage hackathons on Maximally.
      </p>
      
      <div class="info-box success">
        <div class="info-label">🎖️ Your New Role</div>
        <div class="info-row">
          <span class="info-row-label">Status</span>
          <span class="info-row-value">ORGANIZER <span class="badge badge-success">✓</span></span>
        </div>
        <div class="info-row">
          <span class="info-row-label">Access</span>
          <span class="info-row-value">Create & Manage Hackathons</span>
        </div>
      </div>
      
      <div class="divider"></div>
      
      <p class="message"><strong>What You Can Do Now:</strong></p>
      
      <ul class="steps-list">
        <li class="step-item">
          <span class="step-number">1</span>
          <span class="step-text">Create your first hackathon</span>
        </li>
        <li class="step-item">
          <span class="step-number">2</span>
          <span class="step-text">Set up registration, prizes, and judging criteria</span>
        </li>
        <li class="step-item">
          <span class="step-number">3</span>
          <span class="step-text">Invite judges and manage submissions</span>
        </li>
        <li class="step-item">
          <span class="step-number">4</span>
          <span class="step-text">Engage with participants through announcements</span>
        </li>
      </ul>
      
      <div class="button-container">
        <a href="${PLATFORM_URL}/create-hackathon" class="button">CREATE HACKATHON →</a>
      </div>
      
      <p class="message" style="text-align: center;">
        Welcome to the organizer community! Let's build something amazing! 💜
      </p>
    `, `You're now an organizer on Maximally!`),
  }),

  // Judge: Invitation
  judgeInvitation: (data: {
    judgeName: string;
    hackathonName: string;
    hackathonSlug: string;
    organizerName: string;
    invitationLink: string;
  }) => ({
    subject: `⚖️ You're Invited to Judge ${data.hackathonName}!`,
    html: getBaseTemplate(`
      <div class="emoji-header">⚖️</div>
      <h1 class="title title-fallback">JUDGE INVITATION</h1>
      
      <p class="greeting">Hello <span class="highlight-name">${data.judgeName}</span>! 👋</p>
      
      <p class="message">
        <strong>${data.organizerName}</strong> has invited you to be a judge for 
        <strong>${data.hackathonName}</strong> on Maximally!
      </p>
      
      <div class="info-box purple">
        <div class="info-label">📋 Invitation Details</div>
        <div class="info-row">
          <span class="info-row-label">Hackathon</span>
          <span class="info-row-value">${data.hackathonName}</span>
        </div>
        <div class="info-row">
          <span class="info-row-label">Invited By</span>
          <span class="info-row-value">${data.organizerName}</span>
        </div>
        <div class="info-row">
          <span class="info-row-label">Role</span>
          <span class="info-row-value">Judge <span class="badge badge-purple">⚖️</span></span>
        </div>
      </div>
      
      <div class="divider"></div>
      
      <p class="message"><strong>As a Judge, You'll:</strong></p>
      
      <ul class="steps-list">
        <li class="step-item">
          <span class="step-number">1</span>
          <span class="step-text">Review submitted projects based on criteria</span>
        </li>
        <li class="step-item">
          <span class="step-number">2</span>
          <span class="step-text">Provide scores and constructive feedback</span>
        </li>
        <li class="step-item">
          <span class="step-number">3</span>
          <span class="step-text">Help determine the winners</span>
        </li>
      </ul>
      
      <div class="button-container">
        <a href="${data.invitationLink}" class="button">ACCEPT INVITATION →</a>
      </div>
      
      <p class="message" style="text-align: center; font-size: 12px; color: ${BRAND_COLORS.gray};">
        If you didn't expect this invitation, you can safely ignore this email.
      </p>
    `, `You're invited to judge ${data.hackathonName}!`),
  }),

  // Welcome Email (New User)
  welcomeEmail: (data: {
    userName: string;
  }) => ({
    subject: `🎮 Welcome to Maximally, ${data.userName}!`,
    html: getBaseTemplate(`
      <div class="emoji-header">🎮</div>
      <h1 class="title title-fallback">WELCOME TO MAXIMALLY!</h1>
      
      <p class="greeting">Hey <span class="highlight-name">${data.userName}</span>! 🎉</p>
      
      <p class="message">
        Welcome to the Hackathon Universe! You've just joined a community of 
        ambitious builders, innovators, and creators.
      </p>
      
      <div class="stats-row">
        <div class="stat-item">
          <div class="stat-value red">50+</div>
          <div class="stat-label">Hackathons</div>
        </div>
        <div class="stat-item">
          <div class="stat-value purple">10K+</div>
          <div class="stat-label">Builders</div>
        </div>
        <div class="stat-item">
          <div class="stat-value cyan">$500K+</div>
          <div class="stat-label">In Prizes</div>
        </div>
      </div>
      
      <div class="info-box success">
        <div class="info-label">🚀 What You Can Do</div>
        <p style="color: ${BRAND_COLORS.lightGray}; line-height: 2; font-size: 14px; margin-top: 12px;">
          • <strong style="color: ${BRAND_COLORS.white};">Participate</strong> in hackathons and win prizes<br>
          • <strong style="color: ${BRAND_COLORS.white};">Build</strong> projects and showcase your skills<br>
          • <strong style="color: ${BRAND_COLORS.white};">Connect</strong> with other builders worldwide<br>
          • <strong style="color: ${BRAND_COLORS.white};">Organize</strong> your own hackathons<br>
          • <strong style="color: ${BRAND_COLORS.white};">Judge</strong> and mentor other participants
        </p>
      </div>
      
      <div class="divider"></div>
      
      <p class="message"><strong>Get Started:</strong></p>
      
      <ul class="steps-list">
        <li class="step-item">
          <span class="step-number">1</span>
          <span class="step-text">Complete your profile to stand out</span>
        </li>
        <li class="step-item">
          <span class="step-number">2</span>
          <span class="step-text">Browse upcoming hackathons</span>
        </li>
        <li class="step-item">
          <span class="step-number">3</span>
          <span class="step-text">Register for your first event</span>
        </li>
        <li class="step-item">
          <span class="step-number">4</span>
          <span class="step-text">Start building!</span>
        </li>
      </ul>
      
      <div class="button-container">
        <a href="${PLATFORM_URL}/events" class="button">EXPLORE HACKATHONS →</a>
      </div>
      
      <p class="message" style="text-align: center;">
        Let's build something amazing together! 🔥
      </p>
    `, `Welcome to Maximally! Start your hackathon journey today.`),
  }),

  // Team Invitation
  teamInvitation: (data: {
    inviteeName: string;
    inviterName: string;
    teamName: string;
    hackathonName: string;
    hackathonSlug: string;
    inviteUrl: string;
  }) => ({
    subject: `🤝 ${data.inviterName} Invited You to Join ${data.teamName}!`,
    html: getBaseTemplate(`
      <div class="emoji-header">🤝</div>
      <h1 class="title title-fallback">TEAM INVITATION</h1>
      
      <p class="greeting">Hey <span class="highlight-name">${data.inviteeName}</span>! 👋</p>
      
      <p class="message">
        <strong>${data.inviterName}</strong> has invited you to join team 
        <strong>${data.teamName}</strong> for <strong>${data.hackathonName}</strong>!
      </p>
      
      <div class="info-box purple">
        <div class="info-label">📋 Invitation Details</div>
        <div class="info-row">
          <span class="info-row-label">Team</span>
          <span class="info-row-value">${data.teamName}</span>
        </div>
        <div class="info-row">
          <span class="info-row-label">Hackathon</span>
          <span class="info-row-value">${data.hackathonName}</span>
        </div>
        <div class="info-row">
          <span class="info-row-label">Invited By</span>
          <span class="info-row-value">${data.inviterName}</span>
        </div>
      </div>
      
      <div class="divider"></div>
      
      <p class="message"><strong>How to Join:</strong></p>
      
      <ul class="steps-list">
        <li class="step-item">
          <span class="step-number">1</span>
          <span class="step-text">Click the button below</span>
        </li>
        <li class="step-item">
          <span class="step-number">2</span>
          <span class="step-text">Log in or create an account (if you haven't)</span>
        </li>
        <li class="step-item">
          <span class="step-number">3</span>
          <span class="step-text">You'll automatically join the team!</span>
        </li>
      </ul>
      
      <div class="button-container">
        <a href="${data.inviteUrl}" class="button">JOIN TEAM →</a>
      </div>
      
      <div class="info-box warning">
        <p style="color: ${BRAND_COLORS.lightGray}; font-size: 13px; margin: 0;">
          <strong>⚠️ Note:</strong> This invitation link is unique to you. It expires in 7 days.
          <br/><br/>
          <strong>Important:</strong> You must register for the hackathon first before you can join the team. 
          Click the button above, and if you're not registered yet, you'll be guided to register first.
        </p>
      </div>
    `, `${data.inviterName} invited you to join team ${data.teamName}!`),
  }),

  // Project Feedback Received
  projectFeedback: (data: {
    userName: string;
    hackathonName: string;
    projectName: string;
    projectId: number;
    judgeName: string;
    score: number;
    feedback?: string;
  }) => ({
    subject: `📝 New Feedback on ${data.projectName}`,
    html: getBaseTemplate(`
      <div class="emoji-header">📝</div>
      <h1 class="title title-fallback">FEEDBACK RECEIVED!</h1>
      
      <p class="greeting">Hey <span class="highlight-name">${data.userName}</span>! 📊</p>
      
      <p class="message">
        A judge has reviewed your project <strong>${data.projectName}</strong> 
        from <strong>${data.hackathonName}</strong>!
      </p>
      
      <div class="info-box">
        <div class="info-label">📋 Review Details</div>
        <div class="info-row">
          <span class="info-row-label">Judge</span>
          <span class="info-row-value">${data.judgeName}</span>
        </div>
        <div class="info-row">
          <span class="info-row-label">Score</span>
          <span class="info-row-value highlight-orange">${data.score}/100</span>
        </div>
        ${data.feedback ? `
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1);">
          <div class="info-label">💬 Feedback</div>
          <p style="color: ${BRAND_COLORS.lightGray}; margin-top: 12px; line-height: 1.8; white-space: pre-wrap; font-size: 14px;">${data.feedback}</p>
        </div>
        ` : ''}
      </div>
      
      <div class="button-container">
        <a href="${PLATFORM_URL}/project/${data.projectId}" class="button">VIEW PROJECT →</a>
      </div>
    `, `New feedback on your project "${data.projectName}"!`),
  }),

  // Hackathon Ended - Notify participants
  hackathonEnded: (data: {
    userName: string;
    hackathonName: string;
    hackathonSlug: string;
    hasSubmission: boolean;
    submissionCount: number;
  }) => ({
    subject: `🏁 ${data.hackathonName} Has Ended!`,
    html: getBaseTemplate(`
      <div class="emoji-header">🏁</div>
      <h1 class="title title-fallback">HACKATHON ENDED!</h1>
      
      <p class="greeting">Hey <span class="highlight-name">${data.userName}</span>! 👋</p>
      
      <p class="message">
        <strong>${data.hackathonName}</strong> has officially ended! 
        ${data.hasSubmission 
          ? "Thank you for participating and submitting your project!" 
          : "We hope you had a great experience!"}
      </p>
      
      <div class="info-box ${data.hasSubmission ? 'success' : ''}">
        <div class="info-label">📊 Final Stats</div>
        <div class="info-row">
          <span class="info-row-label">Total Submissions</span>
          <span class="info-row-value">${data.submissionCount}</span>
        </div>
        <div class="info-row">
          <span class="info-row-label">Your Status</span>
          <span class="info-row-value">${data.hasSubmission ? 'SUBMITTED ✓' : 'PARTICIPATED'}</span>
        </div>
      </div>
      
      <div class="divider"></div>
      
      <p class="message"><strong>What's Next?</strong></p>
      
      <ul class="steps-list">
        <li class="step-item">
          <span class="step-number">⚖️</span>
          <span class="step-text">Judges will review all submissions</span>
        </li>
        <li class="step-item">
          <span class="step-number">🏆</span>
          <span class="step-text">Winners will be announced soon</span>
        </li>
        <li class="step-item">
          <span class="step-number">🎓</span>
          <span class="step-text">Certificates will be available after results</span>
        </li>
      </ul>
      
      <div class="button-container">
        <a href="${PLATFORM_URL}/hackathon/${data.hackathonSlug}" class="button">VIEW HACKATHON →</a>
      </div>
      
      <p class="message" style="text-align: center;">
        Thanks for being part of this hackathon! 🙏
      </p>
    `, `${data.hackathonName} has ended! ${data.hasSubmission ? 'Your submission is in!' : 'Thanks for participating!'}`),
  }),

  // Co-organizer Invitation
  coOrganizerInvitation: (data: {
    inviteeName: string;
    inviterName: string;
    hackathonName: string;
    hackathonSlug: string;
    role: string;
  }) => ({
    subject: `👥 You're Invited to Co-Organize ${data.hackathonName}!`,
    html: getBaseTemplate(`
      <div class="emoji-header">👥</div>
      <h1 class="title title-fallback">CO-ORGANIZER INVITE!</h1>
      
      <p class="greeting">Hey <span class="highlight-name">${data.inviteeName}</span>! 👋</p>
      
      <p class="message">
        <strong>${data.inviterName}</strong> has invited you to help organize 
        <strong>${data.hackathonName}</strong> on Maximally!
      </p>
      
      <div class="info-box purple">
        <div class="info-label">📋 Invitation Details</div>
        <div class="info-row">
          <span class="info-row-label">Hackathon</span>
          <span class="info-row-value">${data.hackathonName}</span>
        </div>
        <div class="info-row">
          <span class="info-row-label">Your Role</span>
          <span class="info-row-value">${data.role} <span class="badge badge-purple">👥</span></span>
        </div>
        <div class="info-row">
          <span class="info-row-label">Invited By</span>
          <span class="info-row-value">${data.inviterName}</span>
        </div>
      </div>
      
      <div class="divider"></div>
      
      <p class="message"><strong>As a Co-Organizer, You Can:</strong></p>
      
      <ul class="steps-list">
        <li class="step-item">
          <span class="step-number">📝</span>
          <span class="step-text">Edit hackathon details and settings</span>
        </li>
        <li class="step-item">
          <span class="step-number">👥</span>
          <span class="step-text">Manage registrations and participants</span>
        </li>
        <li class="step-item">
          <span class="step-number">📢</span>
          <span class="step-text">Send announcements to participants</span>
        </li>
        <li class="step-item">
          <span class="step-number">📊</span>
          <span class="step-text">View analytics and submissions</span>
        </li>
      </ul>
      
      <div class="button-container">
        <a href="${PLATFORM_URL}/organizer/hackathons/${data.hackathonSlug}" class="button">VIEW HACKATHON →</a>
      </div>
    `, `You're invited to co-organize ${data.hackathonName}!`),
  }),

  // Submission Milestone - For organizers
  submissionMilestone: (data: {
    organizerName: string;
    hackathonName: string;
    hackathonSlug: string;
    milestone: number;
    totalSubmissions: number;
  }) => ({
    subject: `🚀 ${data.milestone} Submissions! - ${data.hackathonName}`,
    html: getBaseTemplate(`
      <div class="emoji-header">🚀</div>
      <h1 class="title title-fallback">SUBMISSION MILESTONE!</h1>
      
      <p class="greeting">Amazing news <span class="highlight-name">${data.organizerName}</span>! 🎉</p>
      
      <p class="message">
        Your hackathon <strong>${data.hackathonName}</strong> just hit a submission milestone!
      </p>
      
      <div class="prize-box">
        <div class="info-label">📦 Submissions Milestone</div>
        <div class="prize-amount">${data.milestone}+</div>
        <p style="color: ${BRAND_COLORS.gray}; font-size: 14px; margin-top: 12px;">
          Total Submissions: <span class="highlight-orange">${data.totalSubmissions}</span>
        </p>
      </div>
      
      <div class="divider"></div>
      
      <p class="message">
        Projects are coming in! Make sure your judges are ready to review them.
      </p>
      
      <div class="button-container">
        <a href="${PLATFORM_URL}/organizer/hackathons/${data.hackathonSlug}" class="button">VIEW SUBMISSIONS →</a>
      </div>
    `, `${data.hackathonName} hit ${data.milestone} submissions!`),
  }),

  // Results Published - Notify all participants
  resultsPublished: (data: {
    userName: string;
    hackathonName: string;
    hackathonSlug: string;
    isWinner: boolean;
    position?: string;
  }) => ({
    subject: data.isWinner 
      ? `🏆 You Won! Results for ${data.hackathonName}` 
      : `📊 Results Are Out - ${data.hackathonName}`,
    html: getBaseTemplate(`
      <div class="emoji-header">${data.isWinner ? '🏆' : '📊'}</div>
      <h1 class="title title-fallback">${data.isWinner ? 'CONGRATULATIONS!' : 'RESULTS ARE OUT!'}</h1>
      
      <p class="greeting">Hey <span class="highlight-name">${data.userName}</span>! 👋</p>
      
      ${data.isWinner ? `
      <p class="message">
        Amazing news! Your project won <strong>${data.position}</strong> at 
        <strong>${data.hackathonName}</strong>! 🎉
      </p>
      
      <div class="prize-box">
        <div class="info-label">🎖️ Your Achievement</div>
        <div class="prize-amount">${data.position}</div>
      </div>
      ` : `
      <p class="message">
        The results for <strong>${data.hackathonName}</strong> have been announced! 
        Check out the winners and see how your project performed.
      </p>
      `}
      
      <div class="divider"></div>
      
      <p class="message"><strong>What's Next?</strong></p>
      
      <ul class="steps-list">
        <li class="step-item">
          <span class="step-number">👀</span>
          <span class="step-text">View the full results and winners</span>
        </li>
        <li class="step-item">
          <span class="step-number">🎓</span>
          <span class="step-text">Download your participation certificate</span>
        </li>
        <li class="step-item">
          <span class="step-number">🔗</span>
          <span class="step-text">Share your achievement on social media</span>
        </li>
      </ul>
      
      <div class="button-container">
        <a href="${PLATFORM_URL}/hackathon/${data.hackathonSlug}" class="button">VIEW RESULTS →</a>
      </div>
      
      <p class="message" style="text-align: center;">
        ${data.isWinner ? 'Keep building amazing things! 💪' : 'Thanks for participating! Keep building! 💪'}
      </p>
    `, data.isWinner 
      ? `Congratulations! You won ${data.position} at ${data.hackathonName}!` 
      : `Results are out for ${data.hackathonName}!`),
  }),

  // Judging Complete - Notify organizer
  judgingComplete: (data: {
    organizerName: string;
    hackathonName: string;
    hackathonSlug: string;
    totalSubmissions: number;
    totalJudges: number;
  }) => ({
    subject: `✅ All Judging Complete - ${data.hackathonName}`,
    html: getBaseTemplate(`
      <div class="emoji-header">✅</div>
      <h1 class="title title-fallback">JUDGING COMPLETE!</h1>
      
      <p class="greeting">Great news <span class="highlight-name">${data.organizerName}</span>! 🎉</p>
      
      <p class="message">
        All judges have finished scoring submissions for <strong>${data.hackathonName}</strong>!
        You can now review the scores and announce winners.
      </p>
      
      <div class="info-box success">
        <div class="info-label">📊 Judging Summary</div>
        <div class="info-row">
          <span class="info-row-label">Submissions Scored</span>
          <span class="info-row-value">${data.totalSubmissions}</span>
        </div>
        <div class="info-row">
          <span class="info-row-label">Judges Participated</span>
          <span class="info-row-value">${data.totalJudges}</span>
        </div>
        <div class="info-row">
          <span class="info-row-label">Status</span>
          <span class="info-row-value">COMPLETE <span class="badge badge-success">✓</span></span>
        </div>
      </div>
      
      <div class="divider"></div>
      
      <p class="message"><strong>Next Steps:</strong></p>
      
      <ul class="steps-list">
        <li class="step-item">
          <span class="step-number">1</span>
          <span class="step-text">Review the scores and rankings</span>
        </li>
        <li class="step-item">
          <span class="step-number">2</span>
          <span class="step-text">Select and announce winners</span>
        </li>
        <li class="step-item">
          <span class="step-number">3</span>
          <span class="step-text">Generate certificates for participants</span>
        </li>
      </ul>
      
      <div class="button-container">
        <a href="${PLATFORM_URL}/organizer/hackathons/${data.hackathonSlug}" class="button">ANNOUNCE WINNERS →</a>
      </div>
    `, `All judging is complete for ${data.hackathonName}!`),
  }),

  // OTP Verification Email
  otpVerification: (data: {
    email: string;
    otp: string;
    expiresInMinutes: number;
  }) => ({
    subject: `🔐 Your Maximally Verification Code: ${data.otp}`,
    html: getBaseTemplate(`
      <div class="emoji-header">🔐</div>
      <h1 class="title title-fallback">VERIFY YOUR EMAIL</h1>
      
      <p class="greeting">Welcome to Maximally! 👋</p>
      
      <p class="message">
        Use the verification code below to complete your signup. 
        This code will expire in <strong>${data.expiresInMinutes} minutes</strong>.
      </p>
      
      <div class="team-code-box" style="background: linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(239, 68, 68, 0.1) 100%); border-color: ${BRAND_COLORS.orange};">
        <div class="info-label">🔑 Your Verification Code</div>
        <div class="team-code" style="color: ${BRAND_COLORS.orange}; font-size: 36px; letter-spacing: 8px;">${data.otp}</div>
      </div>
      
      <div class="divider"></div>
      
      <p class="message" style="font-size: 13px;">
        <strong style="color: ${BRAND_COLORS.white};">Security Tips:</strong>
      </p>
      
      <ul class="steps-list">
        <li class="step-item">
          <span class="step-number">🔒</span>
          <span class="step-text">Never share this code with anyone</span>
        </li>
        <li class="step-item">
          <span class="step-number">⏱️</span>
          <span class="step-text">This code expires in ${data.expiresInMinutes} minutes</span>
        </li>
        <li class="step-item">
          <span class="step-number">❓</span>
          <span class="step-text">If you didn't request this, ignore this email</span>
        </li>
      </ul>
      
      <p class="message" style="text-align: center; margin-top: 30px; font-size: 12px; color: ${BRAND_COLORS.gray};">
        If you didn't create an account on Maximally, you can safely ignore this email.
      </p>
    `, `Your Maximally verification code is ${data.otp}`),
  }),
};


// ============================================
// EMAIL SENDING FUNCTIONS
// ============================================

export async function sendRegistrationConfirmation(data: Parameters<typeof emailTemplates.registrationConfirmation>[0] & { email: string }) {
  if (!resend) {
    console.log('⚠️ Email service not configured. Skipping registration confirmation email.');
    return { success: false, error: 'Email service not configured' };
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
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send registration confirmation:', error);
    return { success: false, error };
  }
}

export async function sendSubmissionConfirmation(data: Parameters<typeof emailTemplates.submissionConfirmation>[0] & { email: string }) {
  if (!resend) {
    console.log('⚠️ Email service not configured. Skipping submission confirmation email.');
    return { success: false, error: 'Email service not configured' };
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
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send submission confirmation:', error);
    return { success: false, error };
  }
}

export async function sendAnnouncement(data: Parameters<typeof emailTemplates.announcement>[0] & { email: string }) {
  if (!resend) {
    console.log('⚠️ Email service not configured. Skipping announcement email.');
    return { success: false, error: 'Email service not configured' };
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
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send announcement:', error);
    return { success: false, error };
  }
}

export async function sendWinnerNotification(data: Parameters<typeof emailTemplates.winnerNotification>[0] & { email: string }) {
  if (!resend) {
    console.log('⚠️ Email service not configured. Skipping winner notification email.');
    return { success: false, error: 'Email service not configured' };
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
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send winner notification:', error);
    return { success: false, error };
  }
}

export async function sendDeadlineReminder(data: Parameters<typeof emailTemplates.deadlineReminder>[0] & { email: string }) {
  if (!resend) {
    console.log('⚠️ Email service not configured. Skipping deadline reminder email.');
    return { success: false, error: 'Email service not configured' };
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
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send deadline reminder:', error);
    return { success: false, error };
  }
}

export async function sendTeamCreatedEmail(data: Parameters<typeof emailTemplates.teamCreated>[0] & { email: string }) {
  if (!resend) {
    console.log('⚠️ Email service not configured. Skipping team created email.');
    return { success: false, error: 'Email service not configured' };
  }
  
  try {
    const template = emailTemplates.teamCreated(data);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: template.subject,
      html: template.html,
    });
    console.log(`✅ Team created email sent to ${data.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send team created email:', error);
    return { success: false, error };
  }
}

export async function sendTeamJoinedEmail(data: Parameters<typeof emailTemplates.teamJoined>[0] & { email: string }) {
  if (!resend) {
    console.log('⚠️ Email service not configured. Skipping team joined email.');
    return { success: false, error: 'Email service not configured' };
  }
  
  try {
    const template = emailTemplates.teamJoined(data);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: template.subject,
      html: template.html,
    });
    console.log(`✅ Team joined email sent to ${data.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send team joined email:', error);
    return { success: false, error };
  }
}

export async function sendHackathonStartingSoonEmail(data: Parameters<typeof emailTemplates.hackathonStartingSoon>[0] & { email: string }) {
  if (!resend) {
    console.log('⚠️ Email service not configured. Skipping hackathon starting soon email.');
    return { success: false, error: 'Email service not configured' };
  }
  
  try {
    const template = emailTemplates.hackathonStartingSoon(data);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: template.subject,
      html: template.html,
    });
    console.log(`✅ Hackathon starting soon email sent to ${data.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send hackathon starting soon email:', error);
    return { success: false, error };
  }
}

export async function sendHackathonApprovedEmail(data: Parameters<typeof emailTemplates.hackathonApproved>[0] & { email: string }) {
  if (!resend) {
    console.log('⚠️ Email service not configured. Skipping hackathon approved email.');
    return { success: false, error: 'Email service not configured' };
  }
  
  try {
    const template = emailTemplates.hackathonApproved(data);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: template.subject,
      html: template.html,
    });
    console.log(`✅ Hackathon approved email sent to ${data.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send hackathon approved email:', error);
    return { success: false, error };
  }
}

export async function sendHackathonRejectedEmail(data: Parameters<typeof emailTemplates.hackathonRejected>[0] & { email: string }) {
  if (!resend) {
    console.log('⚠️ Email service not configured. Skipping hackathon rejected email.');
    return { success: false, error: 'Email service not configured' };
  }
  
  try {
    const template = emailTemplates.hackathonRejected(data);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: template.subject,
      html: template.html,
    });
    console.log(`✅ Hackathon rejected email sent to ${data.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send hackathon rejected email:', error);
    return { success: false, error };
  }
}

export async function sendRegistrationMilestoneEmail(data: Parameters<typeof emailTemplates.registrationMilestone>[0] & { email: string }) {
  if (!resend) {
    console.log('⚠️ Email service not configured. Skipping registration milestone email.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const template = emailTemplates.registrationMilestone(data);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: template.subject,
      html: template.html,
    });
    console.log(`✅ Registration milestone email sent to ${data.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send registration milestone email:', error);
    return { success: false, error };
  }
}

export async function sendOrganizerPromotionEmail(data: Parameters<typeof emailTemplates.organizerPromotion>[0] & { email: string }) {
  if (!resend) {
    console.log('⚠️ Email service not configured. Skipping organizer promotion email.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const template = emailTemplates.organizerPromotion(data);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: template.subject,
      html: template.html,
    });
    console.log(`✅ Organizer promotion email sent to ${data.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send organizer promotion email:', error);
    return { success: false, error };
  }
}

export async function sendJudgeInvitationEmail(data: Parameters<typeof emailTemplates.judgeInvitation>[0] & { email: string }) {
  if (!resend) {
    console.log('⚠️ Email service not configured. Skipping judge invitation email.');
    return { success: false, error: 'Email service not configured' };
  }
  
  try {
    const template = emailTemplates.judgeInvitation(data);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: template.subject,
      html: template.html,
    });
    console.log(`✅ Judge invitation email sent to ${data.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send judge invitation email:', error);
    return { success: false, error };
  }
}

export async function sendWelcomeEmail(data: Parameters<typeof emailTemplates.welcomeEmail>[0] & { email: string }) {
  if (!resend) {
    console.log('⚠️ Email service not configured. Skipping welcome email.');
    return { success: false, error: 'Email service not configured' };
  }
  
  try {
    const template = emailTemplates.welcomeEmail(data);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: template.subject,
      html: template.html,
    });
    console.log(`✅ Welcome email sent to ${data.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    return { success: false, error };
  }
}

export async function sendTeamInvitationEmail(data: Parameters<typeof emailTemplates.teamInvitation>[0] & { email: string }) {
  if (!resend) {
    console.log('⚠️ Email service not configured. Skipping team invitation email.');
    return { success: false, error: 'Email service not configured' };
  }
  
  try {
    const template = emailTemplates.teamInvitation(data);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: template.subject,
      html: template.html,
    });
    console.log(`✅ Team invitation email sent to ${data.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send team invitation email:', error);
    return { success: false, error };
  }
}

export async function sendProjectFeedbackEmail(data: Parameters<typeof emailTemplates.projectFeedback>[0] & { email: string }) {
  if (!resend) {
    console.log('⚠️ Email service not configured. Skipping project feedback email.');
    return { success: false, error: 'Email service not configured' };
  }
  
  try {
    const template = emailTemplates.projectFeedback(data);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: template.subject,
      html: template.html,
    });
    console.log(`✅ Project feedback email sent to ${data.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send project feedback email:', error);
    return { success: false, error };
  }
}

export async function sendHackathonEndedEmail(data: Parameters<typeof emailTemplates.hackathonEnded>[0] & { email: string }) {
  if (!resend) {
    console.log('⚠️ Email service not configured. Skipping hackathon ended email.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const template = emailTemplates.hackathonEnded(data);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: template.subject,
      html: template.html,
    });
    console.log(`✅ Hackathon ended email sent to ${data.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send hackathon ended email:', error);
    return { success: false, error };
  }
}

export async function sendCoOrganizerInvitationEmail(data: Parameters<typeof emailTemplates.coOrganizerInvitation>[0] & { email: string }) {
  if (!resend) {
    console.log('⚠️ Email service not configured. Skipping co-organizer invitation email.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const template = emailTemplates.coOrganizerInvitation(data);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: template.subject,
      html: template.html,
    });
    console.log(`✅ Co-organizer invitation email sent to ${data.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send co-organizer invitation email:', error);
    return { success: false, error };
  }
}

export async function sendSubmissionMilestoneEmail(data: Parameters<typeof emailTemplates.submissionMilestone>[0] & { email: string }) {
  if (!resend) {
    console.log('⚠️ Email service not configured. Skipping submission milestone email.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const template = emailTemplates.submissionMilestone(data);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: template.subject,
      html: template.html,
    });
    console.log(`✅ Submission milestone email sent to ${data.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send submission milestone email:', error);
    return { success: false, error };
  }
}

export async function sendResultsPublishedEmail(data: Parameters<typeof emailTemplates.resultsPublished>[0] & { email: string }) {
  if (!resend) {
    console.log('⚠️ Email service not configured. Skipping results published email.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const template = emailTemplates.resultsPublished(data);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: template.subject,
      html: template.html,
    });
    console.log(`✅ Results published email sent to ${data.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send results published email:', error);
    return { success: false, error };
  }
}

export async function sendJudgingCompleteEmail(data: Parameters<typeof emailTemplates.judgingComplete>[0] & { email: string }) {
  if (!resend) {
    console.log('⚠️ Email service not configured. Skipping judging complete email.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const template = emailTemplates.judgingComplete(data);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: template.subject,
      html: template.html,
    });
    console.log(`✅ Judging complete email sent to ${data.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send judging complete email:', error);
    return { success: false, error };
  }
}

export async function sendOtpEmail(data: { email: string; otp: string; expiresInMinutes?: number }) {
  if (!resend) {
    console.log('⚠️ Email service not configured. Skipping OTP email.');
    return { success: false, error: 'Email service not configured' };
  }
  
  try {
    const template = emailTemplates.otpVerification({
      email: data.email,
      otp: data.otp,
      expiresInMinutes: data.expiresInMinutes || 10,
    });
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: template.subject,
      html: template.html,
    });
    console.log(`✅ OTP email sent to ${data.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send OTP email:', error);
    return { success: false, error };
  }
}

export async function sendBulkEmails(emails: string[], subject: string, html: string) {
  if (!resend) {
    console.log('⚠️ Email service not configured. Skipping bulk emails.');
    return { success: false, sent: 0, failed: emails.length, error: 'Email service not configured' };
  }
  
  let sent = 0;
  let failed = 0;
  const errors: string[] = [];
  
  try {
    // Send in batches of 50 to avoid rate limits
    const batchSize = 50;
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      const results = await Promise.allSettled(
        batch.map(email =>
          resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject,
            html,
          })
        )
      );
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          sent++;
        } else {
          failed++;
          errors.push(`Failed to send to ${batch[index]}: ${result.reason}`);
        }
      });
      
      console.log(`✅ Sent batch ${Math.floor(i / batchSize) + 1} (${batch.length} emails)`);
    }
    
    return { success: true, sent, failed, errors: errors.length > 0 ? errors : undefined };
  } catch (error) {
    console.error('❌ Failed to send bulk emails:', error);
    return { success: false, sent, failed: emails.length - sent, error };
  }
}

export async function sendCertificateEmail(data: {
  email: string;
  userName: string;
  hackathonName: string;
  certificateId: string;
  certificateType: 'participant' | 'winner' | 'judge';
  position?: string;
}) {
  const typeLabels = {
    participant: 'Participation',
    winner: 'Winner',
    judge: 'Judge Appreciation'
  };
  
  const typeEmoji = {
    participant: '🎓',
    winner: '🏆',
    judge: '⚖️'
  };
  
  const verificationUrl = `${PLATFORM_URL}/certificates/verify/${data.certificateId}`;
  
  const html = getBaseTemplate(`
    <div class="emoji-header">${typeEmoji[data.certificateType]}</div>
    <h1 class="title title-fallback">YOUR CERTIFICATE IS READY!</h1>
    
    <p class="greeting">Congratulations, <span class="highlight-name">${data.userName}</span>! 🎉</p>
    
    <p class="message">
      Your <strong>${typeLabels[data.certificateType]} Certificate</strong> for 
      <strong>${data.hackathonName}</strong> has been generated and is ready for download!
    </p>
    
    <div class="info-box success">
      <div class="info-label">📜 Certificate Details</div>
      <div class="info-row">
        <span class="info-row-label">Certificate ID</span>
        <span class="info-row-value" style="font-family: monospace;">${data.certificateId}</span>
      </div>
      <div class="info-row">
        <span class="info-row-label">Type</span>
        <span class="info-row-value">${typeLabels[data.certificateType]}</span>
      </div>
      ${data.position ? `
      <div class="info-row">
        <span class="info-row-label">Achievement</span>
        <span class="info-row-value highlight-orange">${data.position}</span>
      </div>
      ` : ''}
      <div class="info-row">
        <span class="info-row-label">Event</span>
        <span class="info-row-value">${data.hackathonName}</span>
      </div>
    </div>
    
    <div class="button-container">
      <a href="${verificationUrl}" class="button">VIEW & DOWNLOAD CERTIFICATE →</a>
    </div>
    
    <div class="divider"></div>
    
    <p class="message" style="text-align: center; font-size: 12px;">
      You can verify this certificate anytime at:<br>
      <a href="${verificationUrl}" style="color: ${BRAND_COLORS.purple}; word-break: break-all;">${verificationUrl}</a>
    </p>
    
    <p class="message" style="text-align: center;">
      Thank you for being part of ${data.hackathonName}! 🚀
    </p>
  `, `Your ${typeLabels[data.certificateType]} Certificate for ${data.hackathonName} is ready!`);
  
  // Use global email queue for rate limiting across all organizers
  const subject = `${typeEmoji[data.certificateType]} Your ${typeLabels[data.certificateType]} Certificate - ${data.hackathonName}`;
  
  console.log(`📧 Queueing certificate email to ${data.email}`);
  return sendEmailQueued({
    from: FROM_EMAIL,
    to: data.email,
    subject,
    html,
    priority: 'normal', // Certificate emails are normal priority
  });
}

// Judge Reminder Email
export async function sendJudgeReminderEmail(data: {
  email: string;
  judgeName: string;
  hackathonName: string;
  hackathonSlug: string;
  unscoredCount: number;
  totalSubmissions: number;
  judgingDeadline?: string;
}) {
  if (!resend) {
    console.log('⚠️ Email service not configured. Skipping judge reminder email.');
    return { success: false, error: 'Email service not configured' };
  }
  
  const deadlineText = data.judgingDeadline 
    ? new Date(data.judgingDeadline).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })
    : 'Soon';
  
  const html = getBaseTemplate(`
    <div class="emoji-header">⚖️</div>
    <h1 class="title title-fallback">JUDGING REMINDER</h1>
    
    <p class="greeting">Hey <span class="highlight-name">${data.judgeName}</span>! 👋</p>
    
    <p class="message">
      This is a friendly reminder that you have submissions waiting to be scored for 
      <strong>${data.hackathonName}</strong>.
    </p>
    
    <div class="countdown-box">
      <div class="info-label">📊 Your Progress</div>
      <div class="countdown-time">${data.unscoredCount}</div>
      <p style="color: ${BRAND_COLORS.gray}; font-size: 14px; margin-top: 12px;">
        submissions still need your review
      </p>
    </div>
    
    <div class="info-box warning">
      <div class="info-label">⏰ Judging Deadline</div>
      <p style="color: ${BRAND_COLORS.lightGray}; font-size: 16px; margin-top: 8px; font-weight: 600;">
        ${deadlineText}
      </p>
    </div>
    
    <div class="divider"></div>
    
    <p class="message"><strong>Quick Stats:</strong></p>
    
    <div class="stats-row">
      <div class="stat-item">
        <div class="stat-value red">${data.totalSubmissions}</div>
        <div class="stat-label">Total</div>
      </div>
      <div class="stat-item">
        <div class="stat-value purple">${data.totalSubmissions - data.unscoredCount}</div>
        <div class="stat-label">Scored</div>
      </div>
      <div class="stat-item">
        <div class="stat-value cyan">${data.unscoredCount}</div>
        <div class="stat-label">Remaining</div>
      </div>
    </div>
    
    <div class="button-container">
      <a href="${PLATFORM_URL}/judge/hackathons/${data.hackathonSlug}/submissions" class="button">CONTINUE JUDGING →</a>
    </div>
    
    <p class="message" style="text-align: center;">
      Thank you for helping evaluate these amazing projects! 🙏
    </p>
  `, `Reminder: ${data.unscoredCount} submissions need your review for ${data.hackathonName}`);
  
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: `⚖️ Judging Reminder: ${data.unscoredCount} Submissions Awaiting Review - ${data.hackathonName}`,
      html,
    });
    console.log(`✅ Judge reminder email sent to ${data.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send judge reminder email:', error);
    return { success: false, error };
  }
}

// Mentor Certificate Email
export async function sendMentorCertificateEmail(data: {
  email: string;
  mentorName: string;
  hackathonName: string;
  certificateId: string;
}) {
  if (!resend) {
    console.log('⚠️ Email service not configured. Skipping mentor certificate email.');
    return { success: false, error: 'Email service not configured' };
  }
  
  const verificationUrl = `${PLATFORM_URL}/certificates/verify/${data.certificateId}`;
  
  const html = getBaseTemplate(`
    <div class="emoji-header">🎓</div>
    <h1 class="title title-fallback">MENTOR CERTIFICATE READY!</h1>
    
    <p class="greeting">Thank you, <span class="highlight-name">${data.mentorName}</span>! 🙏</p>
    
    <p class="message">
      Your <strong>Mentor Appreciation Certificate</strong> for 
      <strong>${data.hackathonName}</strong> has been generated!
    </p>
    
    <div class="info-box purple">
      <div class="info-label">📜 Certificate Details</div>
      <div class="info-row">
        <span class="info-row-label">Certificate ID</span>
        <span class="info-row-value" style="font-family: monospace;">${data.certificateId}</span>
      </div>
      <div class="info-row">
        <span class="info-row-label">Type</span>
        <span class="info-row-value">Mentor Appreciation</span>
      </div>
      <div class="info-row">
        <span class="info-row-label">Event</span>
        <span class="info-row-value">${data.hackathonName}</span>
      </div>
    </div>
    
    <div class="button-container">
      <a href="${verificationUrl}" class="button">VIEW & DOWNLOAD CERTIFICATE →</a>
    </div>
    
    <p class="message" style="text-align: center;">
      Your guidance made a real difference. Thank you for mentoring! 💜
    </p>
  `, `Your Mentor Certificate for ${data.hackathonName} is ready!`);
  
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: `🎓 Your Mentor Certificate - ${data.hackathonName}`,
      html,
    });
    console.log(`✅ Mentor certificate email sent to ${data.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send mentor certificate email:', error);
    return { success: false, error };
  }
}

// Export email templates for external use (e.g., preview)
export { emailTemplates, getBaseTemplate, BRAND_COLORS };

// Judge Scoring Link Email (for simplified judge system)
export async function sendJudgeScoringLinkEmail(data: {
  email: string;
  judgeName: string;
  hackathonName: string;
  scoringUrl: string;
  expiresAt: string;
}) {
  const resendClient = getResend();
  if (!resendClient) {
    console.log('⚠️ Email service not configured. Skipping judge scoring link email.');
    return { success: false, error: 'Email service not configured' };
  }
  
  const expiryDate = new Date(data.expiresAt).toLocaleDateString('en-US', { 
    dateStyle: 'long' 
  });
  
  const html = getBaseTemplate(`
    <div class="emoji-header">⚖️</div>
    <h1 class="title title-fallback">YOU'RE INVITED TO JUDGE!</h1>
    
    <p class="greeting">Hello <span class="highlight-name">${data.judgeName}</span>! 👋</p>
    
    <p class="message">
      You've been invited to judge projects for <strong>${data.hackathonName}</strong>!
      Click the button below to access your personalized scoring dashboard.
    </p>
    
    <div class="info-box purple">
      <div class="info-label">📋 Judging Details</div>
      <div class="info-row">
        <span class="info-row-label">Hackathon</span>
        <span class="info-row-value">${data.hackathonName}</span>
      </div>
      <div class="info-row">
        <span class="info-row-label">Link Expires</span>
        <span class="info-row-value">${expiryDate}</span>
      </div>
    </div>
    
    <div class="divider"></div>
    
    <p class="message"><strong>How It Works:</strong></p>
    
    <ul class="steps-list">
      <li class="step-item">
        <span class="step-number">1</span>
        <span class="step-text">Click the button below to access your scoring dashboard</span>
      </li>
      <li class="step-item">
        <span class="step-number">2</span>
        <span class="step-text">Review each project submission</span>
      </li>
      <li class="step-item">
        <span class="step-number">3</span>
        <span class="step-text">Score projects from 1-10 and add optional notes</span>
      </li>
      <li class="step-item">
        <span class="step-number">4</span>
        <span class="step-text">Your scores are saved automatically</span>
      </li>
    </ul>
    
    <div class="button-container">
      <a href="${data.scoringUrl}" class="button">START JUDGING →</a>
    </div>
    
    <div class="info-box warning">
      <p style="color: ${BRAND_COLORS.lightGray}; font-size: 13px; margin: 0;">
        <strong>⚠️ Important:</strong> This is your personal scoring link. Please do not share it with others.
        No login is required - just click the button above to start judging!
      </p>
    </div>
    
    <p class="message" style="text-align: center;">
      Thank you for helping evaluate these amazing projects! 🙏
    </p>
  `, `You're invited to judge ${data.hackathonName}! Click to access your scoring dashboard.`);
  
  try {
    await resendClient.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: `⚖️ You're Invited to Judge - ${data.hackathonName}`,
      html,
    });
    console.log(`✅ Judge scoring link email sent to ${data.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send judge scoring link email:', error);
    return { success: false, error };
  }
}


// Co-Organizer Invite Email
export async function sendCoOrganizerInviteEmail(data: {
  email: string;
  inviteeName: string;
  inviterName: string;
  hackathonName: string;
  hackathonId: number;
  role: string;
}) {
  const resendClient = getResend();
  if (!resendClient) {
    console.log('⚠️ Email service not configured. Skipping co-organizer invite email.');
    return { success: false, error: 'Email service not configured' };
  }
  
  const dashboardUrl = `${PLATFORM_URL}/organizer/hackathons/${data.hackathonId}`;
  const roleDisplay = data.role === 'co-organizer' ? 'Co-Organizer' : 
                      data.role === 'admin' ? 'Admin' : 'Viewer';
  
  const html = getBaseTemplate(`
    <div class="emoji-header">🤝</div>
    <h1 class="title title-fallback">YOU'RE INVITED!</h1>
    
    <p class="greeting">Hey <span class="highlight-name">${data.inviteeName}</span>! 👋</p>
    
    <p class="message">
      <strong>${data.inviterName}</strong> has invited you to join the organizing team for 
      <strong>${data.hackathonName}</strong>!
    </p>
    
    <div class="info-box purple">
      <div class="info-label">📋 Invitation Details</div>
      <div class="info-row">
        <span class="info-row-label">Hackathon</span>
        <span class="info-row-value">${data.hackathonName}</span>
      </div>
      <div class="info-row">
        <span class="info-row-label">Your Role</span>
        <span class="info-row-value">${roleDisplay} <span class="badge badge-purple">✨</span></span>
      </div>
      <div class="info-row">
        <span class="info-row-label">Invited By</span>
        <span class="info-row-value">${data.inviterName}</span>
      </div>
    </div>
    
    <div class="divider"></div>
    
    <p class="message"><strong>What You Can Do as ${roleDisplay}:</strong></p>
    
    <ul class="steps-list">
      ${data.role === 'co-organizer' ? `
      <li class="step-item">
        <span class="step-number">✓</span>
        <span class="step-text">Full access to edit hackathon details</span>
      </li>
      <li class="step-item">
        <span class="step-number">✓</span>
        <span class="step-text">Manage registrations and submissions</span>
      </li>
      <li class="step-item">
        <span class="step-number">✓</span>
        <span class="step-text">Post announcements and view analytics</span>
      </li>
      ` : data.role === 'admin' ? `
      <li class="step-item">
        <span class="step-number">✓</span>
        <span class="step-text">Manage registrations and submissions</span>
      </li>
      <li class="step-item">
        <span class="step-number">✓</span>
        <span class="step-text">View participant details and analytics</span>
      </li>
      ` : `
      <li class="step-item">
        <span class="step-number">✓</span>
        <span class="step-text">View hackathon analytics and statistics</span>
      </li>
      <li class="step-item">
        <span class="step-number">✓</span>
        <span class="step-text">Monitor registrations and submissions</span>
      </li>
      `}
    </ul>
    
    <div class="button-container">
      <a href="${dashboardUrl}" class="button">VIEW HACKATHON DASHBOARD →</a>
    </div>
    
    <p class="message" style="text-align: center;">
      Log in to Maximally to accept this invitation and start collaborating! 🚀
    </p>
  `, `${data.inviterName} invited you to help organize ${data.hackathonName}!`);
  
  try {
    await resendClient.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: `🤝 You're Invited to Organize ${data.hackathonName}!`,
      html,
    });
    console.log(`✅ Co-organizer invite email sent to ${data.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send co-organizer invite email:', error);
    return { success: false, error };
  }
}


// Organizer Team Invite Email (for co-organizer, admin, viewer roles)
export async function sendOrganizerTeamInviteEmail(data: {
  email: string;
  inviteeName: string;
  inviterName: string;
  hackathonName: string;
  hackathonSlug: string;
  role: 'co-organizer' | 'admin' | 'viewer';
  inviteUrl: string;
}) {
  const resendClient = getResend();
  if (!resendClient) {
    console.log('⚠️ Email service not configured. Skipping organizer team invite email.');
    return { success: false, error: 'Email service not configured' };
  }
  
  const roleDescriptions = {
    'co-organizer': 'Full access to manage the hackathon except judge management',
    'admin': 'Manage registrations and submissions',
    'viewer': 'View-only access to analytics and data',
  };
  
  const roleEmojis = {
    'co-organizer': '👥',
    'admin': '🛡️',
    'viewer': '👁️',
  };
  
  const roleDisplay = data.role === 'co-organizer' ? 'Co-Organizer' : data.role.charAt(0).toUpperCase() + data.role.slice(1);
  
  const html = getBaseTemplate(`
    <div class="emoji-header">${roleEmojis[data.role]}</div>
    <h1 class="title title-fallback">YOU'RE INVITED!</h1>
    
    <p class="greeting">Hey <span class="highlight-name">${data.inviteeName}</span>! 👋</p>
    
    <p class="message">
      <strong>${data.inviterName}</strong> has invited you to join the organizing team for 
      <strong>${data.hackathonName}</strong> as a <strong>${roleDisplay}</strong>!
    </p>
    
    <div class="info-box purple">
      <div class="info-label">📋 Invitation Details</div>
      <div class="info-row">
        <span class="info-row-label">Hackathon</span>
        <span class="info-row-value">${data.hackathonName}</span>
      </div>
      <div class="info-row">
        <span class="info-row-label">Your Role</span>
        <span class="info-row-value">${roleDisplay}</span>
      </div>
      <div class="info-row">
        <span class="info-row-label">Invited By</span>
        <span class="info-row-value">${data.inviterName}</span>
      </div>
    </div>
    
    <div class="info-box">
      <div class="info-label">🔑 Role Permissions</div>
      <p style="color: ${BRAND_COLORS.lightGray}; font-size: 14px; margin-top: 8px;">
        ${roleDescriptions[data.role]}
      </p>
    </div>
    
    <div class="divider"></div>
    
    <p class="message" style="text-align: center;">
      Click the button below to accept this invitation and join the team!
    </p>
    
    <div class="button-container">
      <a href="${data.inviteUrl}" class="button">ACCEPT INVITATION →</a>
    </div>
    
    <div class="info-box warning">
      <p style="color: ${BRAND_COLORS.lightGray}; font-size: 13px; margin: 0;">
        <strong>⚠️ Note:</strong> This invitation link expires in 7 days. 
        You'll need to be logged in to your Maximally account to accept.
      </p>
    </div>
    
    <p class="message" style="text-align: center;">
      Let's make this hackathon amazing together! 🚀
    </p>
  `, `${data.inviterName} invited you to join ${data.hackathonName} as ${roleDisplay}!`);
  
  try {
    await resendClient.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: `${roleEmojis[data.role]} You're Invited to Join ${data.hackathonName} as ${roleDisplay}!`,
      html,
    });
    console.log(`✅ Organizer team invite email sent to ${data.email} (role: ${data.role})`);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send organizer team invite email:', error);
    return { success: false, error };
  }
}
