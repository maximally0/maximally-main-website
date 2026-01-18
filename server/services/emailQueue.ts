/**
 * Global Email Queue Service
 * 
 * Provides rate-limited email sending across the entire platform.
 * All emails go through this queue to prevent hitting provider rate limits
 * regardless of how many organizers/users are sending simultaneously.
 * 
 * Rate limit: 2 emails per second (Resend free tier limit)
 */

import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

// Lazy-initialize Resend client
let resend: Resend | null = null;

function getResend(): Resend | null {
  if (resend) return resend;
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    resend = new Resend(apiKey);
  }
  return resend;
}

interface QueuedEmail {
  id: string;
  from: string;
  to: string;
  subject: string;
  html: string;
  addedAt: number;
  priority: 'high' | 'normal' | 'low';
  retries: number;
  maxRetries: number;
  batchId?: string; // Track which batch this email belongs to
  callback?: (success: boolean, error?: any) => void;
}

interface QueueStats {
  pending: number;
  processing: boolean;
  totalSent: number;
  totalFailed: number;
  lastProcessedAt: number | null;
}

interface BatchProgress {
  batchId: string;
  total: number;
  sent: number;
  failed: number;
  pending: number;
  startedAt: number;
  completedAt: number | null;
  status: 'queued' | 'processing' | 'completed' | 'failed';
}

// Global queue state
const emailQueue: QueuedEmail[] = [];
let isProcessing = false;
let totalSent = 0;
let totalFailed = 0;
let lastProcessedAt: number | null = null;

// Batch tracking
const batches = new Map<string, BatchProgress>();

// Rate limit: 600ms between emails = ~1.67 emails/sec (safe margin under 2/sec)
const EMAIL_INTERVAL_MS = 600;

// Generate unique ID
function generateId(): string {
  return `email-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Add an email to the global queue
 */
export function queueEmail(options: {
  from: string;
  to: string;
  subject: string;
  html: string;
  priority?: 'high' | 'normal' | 'low';
  batchId?: string;
  callback?: (success: boolean, error?: any) => void;
}): string {
  const id = generateId();
  
  const email: QueuedEmail = {
    id,
    from: options.from,
    to: options.to,
    subject: options.subject,
    html: options.html,
    addedAt: Date.now(),
    priority: options.priority || 'normal',
    retries: 0,
    maxRetries: 2,
    batchId: options.batchId,
    callback: options.callback,
  };
  
  // Insert based on priority
  if (options.priority === 'high') {
    // Find first non-high priority email and insert before it
    const insertIndex = emailQueue.findIndex(e => e.priority !== 'high');
    if (insertIndex === -1) {
      emailQueue.push(email);
    } else {
      emailQueue.splice(insertIndex, 0, email);
    }
  } else if (options.priority === 'low') {
    emailQueue.push(email);
  } else {
    // Normal priority: insert after high priority emails
    const insertIndex = emailQueue.findIndex(e => e.priority === 'low');
    if (insertIndex === -1) {
      emailQueue.push(email);
    } else {
      emailQueue.splice(insertIndex, 0, email);
    }
  }
  
  // Start processing if not already running
  if (!isProcessing) {
    processQueue();
  }
  
  console.log(`📧 Email queued: ${id} to ${options.to} (queue size: ${emailQueue.length})`);
  return id;
}

/**
 * Process the email queue with rate limiting
 */
async function processQueue(): Promise<void> {
  if (isProcessing || emailQueue.length === 0) return;
  
  isProcessing = true;
  console.log(`📬 Starting email queue processing (${emailQueue.length} emails)`);
  
  const resendClient = getResend();
  if (!resendClient) {
    console.log('⚠️ Email service not configured. Clearing queue.');
    // Call callbacks with failure
    for (const email of emailQueue) {
      email.callback?.(false, 'Email service not configured');
    }
    emailQueue.length = 0;
    isProcessing = false;
    return;
  }
  
  while (emailQueue.length > 0) {
    const email = emailQueue.shift()!;
    
    try {
      await resendClient.emails.send({
        from: email.from,
        to: email.to,
        subject: email.subject,
        html: email.html,
      });
      
      totalSent++;
      lastProcessedAt = Date.now();
      console.log(`✅ Email sent: ${email.id} to ${email.to}`);
      
      // Update batch progress
      if (email.batchId && batches.has(email.batchId)) {
        const batch = batches.get(email.batchId)!;
        batch.sent++;
        batch.pending--;
        batch.status = 'processing';
        if (batch.sent + batch.failed >= batch.total) {
          batch.completedAt = Date.now();
          batch.status = batch.failed === batch.total ? 'failed' : 'completed';
        }
      }
      
      email.callback?.(true);
      
    } catch (error: any) {
      console.error(`❌ Email failed: ${email.id} to ${email.to}:`, error.message);
      
      // Retry logic
      if (email.retries < email.maxRetries) {
        email.retries++;
        // Re-add to queue with lower priority
        email.priority = 'low';
        emailQueue.push(email);
        console.log(`🔄 Retrying email ${email.id} (attempt ${email.retries}/${email.maxRetries})`);
      } else {
        totalFailed++;
        
        // Update batch progress
        if (email.batchId && batches.has(email.batchId)) {
          const batch = batches.get(email.batchId)!;
          batch.failed++;
          batch.pending--;
          if (batch.sent + batch.failed >= batch.total) {
            batch.completedAt = Date.now();
            batch.status = batch.failed === batch.total ? 'failed' : 'completed';
          }
        }
        
        email.callback?.(false, error);
      }
    }
    
    // Rate limit: wait before next email
    if (emailQueue.length > 0) {
      await new Promise(resolve => setTimeout(resolve, EMAIL_INTERVAL_MS));
    }
  }
  
  isProcessing = false;
  console.log(`📭 Email queue empty. Total sent: ${totalSent}, failed: ${totalFailed}`);
}

/**
 * Get current queue statistics
 */
export function getQueueStats(): QueueStats {
  return {
    pending: emailQueue.length,
    processing: isProcessing,
    totalSent,
    totalFailed,
    lastProcessedAt,
  };
}

/**
 * Send email immediately (bypasses queue) - use sparingly for critical emails
 */
export async function sendEmailImmediate(options: {
  from: string;
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; error?: any }> {
  const resendClient = getResend();
  if (!resendClient) {
    return { success: false, error: 'Email service not configured' };
  }
  
  try {
    await resendClient.emails.send({
      from: options.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

/**
 * Wrapper to send email through queue with Promise interface
 */
export function sendEmailQueued(options: {
  from: string;
  to: string;
  subject: string;
  html: string;
  priority?: 'high' | 'normal' | 'low';
  batchId?: string;
}): Promise<{ success: boolean; error?: any }> {
  return new Promise((resolve) => {
    queueEmail({
      ...options,
      callback: (success, error) => {
        resolve({ success, error });
      },
    });
  });
}

/**
 * Create a new batch for tracking multiple emails
 */
export function createBatch(batchId: string, total: number): void {
  batches.set(batchId, {
    batchId,
    total,
    sent: 0,
    failed: 0,
    pending: total,
    startedAt: Date.now(),
    completedAt: null,
    status: 'queued'
  });
}

/**
 * Get batch progress
 */
export function getBatchProgress(batchId: string): BatchProgress | null {
  return batches.get(batchId) || null;
}

/**
 * Clean up old completed batches (older than 1 hour)
 */
export function cleanupOldBatches(): void {
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  for (const [batchId, batch] of batches.entries()) {
    if (batch.completedAt && batch.completedAt < oneHourAgo) {
      batches.delete(batchId);
    }
  }
}
