/**
 * Email Template Utilities
 * 
 * Helper functions to generate HTML email templates with consistent styling
 */

interface NewsletterEmailOptions {
  subject: string;
  htmlContent: string;
  unsubscribeUrl: string;
  previewText?: string;
}

/**
 * Generate a complete newsletter email HTML with header, footer, and styling
 */
export function generateNewsletterEmail(options: NewsletterEmailOptions): string {
  const { subject, htmlContent, unsubscribeUrl, previewText } = options;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${subject}</title>
  ${previewText ? `<meta name="description" content="${previewText}">` : ''}
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #000000;
      color: #ffffff;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #000000;
    }
    .email-header {
      background: linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
      border-bottom: 1px solid rgba(168, 85, 247, 0.3);
      padding: 30px 20px;
      text-align: center;
    }
    .email-logo {
      font-family: 'Press Start 2P', monospace;
      font-size: 24px;
      background: linear-gradient(to right, #a855f7, #ec4899, #06b6d4);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 10px;
    }
    .email-body {
      padding: 40px 20px;
      background-color: #0a0a0a;
    }
    .email-content {
      color: #e5e5e5;
      line-height: 1.6;
      font-size: 16px;
    }
    .email-content h1 {
      color: #a855f7;
      font-size: 28px;
      margin-top: 0;
      margin-bottom: 20px;
    }
    .email-content h2 {
      color: #ec4899;
      font-size: 24px;
      margin-top: 30px;
      margin-bottom: 15px;
    }
    .email-content h3 {
      color: #06b6d4;
      font-size: 20px;
      margin-top: 25px;
      margin-bottom: 12px;
    }
    .email-content p {
      margin-bottom: 15px;
    }
    .email-content a {
      color: #a855f7;
      text-decoration: none;
    }
    .email-content a:hover {
      text-decoration: underline;
    }
    .email-content img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 20px 0;
    }
    .email-content ul, .email-content ol {
      margin-bottom: 15px;
      padding-left: 25px;
    }
    .email-content li {
      margin-bottom: 8px;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(to right, #a855f7, #ec4899);
      color: #ffffff !important;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .email-footer {
      background-color: #050505;
      border-top: 1px solid rgba(168, 85, 247, 0.2);
      padding: 30px 20px;
      text-align: center;
      color: #666666;
      font-size: 14px;
    }
    .email-footer a {
      color: #a855f7;
      text-decoration: none;
    }
    .social-links {
      margin: 20px 0;
    }
    .social-links a {
      display: inline-block;
      margin: 0 10px;
      color: #a855f7;
      text-decoration: none;
    }
    @media only screen and (max-width: 600px) {
      .email-body {
        padding: 20px 15px;
      }
      .email-content h1 {
        font-size: 24px;
      }
      .email-content h2 {
        font-size: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="email-header">
      <div class="email-logo">MAXIMALLY</div>
      <p style="color: #999; margin: 0; font-size: 14px;">The Global Hackathon League</p>
    </div>

    <!-- Body -->
    <div class="email-body">
      <div class="email-content">
        ${htmlContent}
      </div>
    </div>

    <!-- Footer -->
    <div class="email-footer">
      <p style="margin-bottom: 15px;">
        © ${new Date().getFullYear()} Maximally. All rights reserved.
      </p>
      
      <div class="social-links">
        <a href="https://www.instagram.com/maximally.in/" target="_blank">Instagram</a>
        <a href="https://www.linkedin.com/company/maximallyedu" target="_blank">LinkedIn</a>
        <a href="https://twitter.com/maximally_in" target="_blank">X</a>
        <a href="https://discord.gg/WmSXVzDYuq" target="_blank">Discord</a>
      </div>

      <p style="margin-top: 20px; font-size: 12px;">
        You're receiving this email because you subscribed to our newsletter.
      </p>
      
      <p style="margin-top: 10px;">
        <a href="${unsubscribeUrl}" style="color: #666;">Unsubscribe</a> | 
        <a href="https://maximally.in/privacy" style="color: #666;">Privacy Policy</a>
      </p>
      
      <p style="margin-top: 15px; font-size: 12px; color: #444;">
        Maximally<br>
        Built by builders, for builders.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate unsubscribe URL with email parameter
 */
export function generateUnsubscribeUrl(email: string, baseUrl: string = 'https://maximally.in'): string {
  return `${baseUrl}/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;
}

/**
 * Strip HTML tags for plain text version
 */
export function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>.*?<\/style>/gi, '')
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generate preview text from HTML content
 */
export function generatePreviewText(htmlContent: string, maxLength: number = 150): string {
  const text = stripHtml(htmlContent);
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

/**
 * Validate email HTML for common issues
 */
export function validateEmailHtml(html: string): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  // Check for inline styles (recommended for email)
  if (html.includes('class=') && !html.includes('style=')) {
    issues.push('Consider using inline styles instead of classes for better email client compatibility');
  }

  // Check for external resources
  if (html.includes('src="http') && !html.includes('src="https')) {
    issues.push('Use HTTPS for all external resources');
  }

  // Check for large images
  const imgMatches = html.match(/<img[^>]+>/g);
  if (imgMatches && imgMatches.length > 10) {
    issues.push('Too many images may cause slow loading');
  }

  // Check for JavaScript (not supported in most email clients)
  if (html.includes('<script')) {
    issues.push('JavaScript is not supported in email clients');
  }

  // Check for forms (limited support)
  if (html.includes('<form')) {
    issues.push('Forms have limited support in email clients');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Example newsletter templates
 */
export const newsletterTemplates = {
  announcement: (title: string, content: string, ctaText: string, ctaUrl: string) => `
    <h1>${title}</h1>
    <p>${content}</p>
    <a href="${ctaUrl}" class="cta-button">${ctaText}</a>
  `,

  digest: (items: Array<{ title: string; description: string; url: string }>) => `
    <h1>This Week's Highlights</h1>
    ${items.map(item => `
      <h2>${item.title}</h2>
      <p>${item.description}</p>
      <p><a href="${item.url}">Read more →</a></p>
    `).join('')}
  `,

  event: (eventName: string, date: string, description: string, registerUrl: string) => `
    <h1>${eventName}</h1>
    <p><strong>Date:</strong> ${date}</p>
    <p>${description}</p>
    <a href="${registerUrl}" class="cta-button">Register Now</a>
  `,
};
