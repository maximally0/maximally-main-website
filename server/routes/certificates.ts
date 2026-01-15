// @ts-nocheck
import type { Express } from "express";
import { createClient } from "@supabase/supabase-js";
import { sendCertificateEmail } from "../services/email";
import { queueEmail, getQueueStats } from "../services/emailQueue";

async function bearerUserId(supabaseAdmin: any, token: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  return data?.user?.id || null;
}

// Generate a unique certificate ID
function generateCertificateId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'CERT-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function registerCertificateRoutes(app: Express) {
  const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;

  // ============================================
  // CERTIFICATE GENERATION
  // ============================================

  // Generate certificates for hackathon participants/winners/judges
  app.post("/api/organizer/hackathons/:hackathonId/certificates/generate", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      const { hackathonId } = req.params;
      const { recipients, hackathon_name, send_email } = req.body;

      // Verify ownership
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('organizer_id, hackathon_name')
        .eq('id', hackathonId)
        .single();

      if (hackathon?.organizer_id !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      // Get organizer's email
      const { data: organizerProfile } = await supabaseAdmin
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single();
      
      const organizerEmail = organizerProfile?.email || null;

      const eventName = hackathon_name || hackathon.hackathon_name;
      const generatedCertificates: any[] = [];
      const errors: string[] = [];
      let deletedCount = 0;

      // Process each recipient
      for (const recipient of recipients) {
        try {
          // Delete existing certificate for this person + hackathon + type combination
          const { data: existingCerts } = await supabaseAdmin
            .from('certificates')
            .select('id, certificate_id')
            .eq('hackathon_name', eventName)
            .eq('participant_email', recipient.email)
            .eq('type', recipient.type);
          
          if (existingCerts && existingCerts.length > 0) {
            const { error: deleteError } = await supabaseAdmin
              .from('certificates')
              .delete()
              .in('id', existingCerts.map(c => c.id));
            
            if (!deleteError) {
              deletedCount += existingCerts.length;
            }
          }

          const certificateId = generateCertificateId();
          
          // Look up the user's actual username from profiles using email
          let actualUsername = recipient.name.toLowerCase().replace(/\s+/g, '_'); // fallback
          if (recipient.email) {
            const { data: profile } = await supabaseAdmin
              .from('profiles')
              .select('username')
              .eq('email', recipient.email)
              .single();
            
            if (profile?.username) {
              actualUsername = profile.username;
            }
          }
          
          // Insert certificate record
          const { data: cert, error: certError } = await supabaseAdmin
            .from('certificates')
            .insert({
              certificate_id: certificateId,
              participant_name: recipient.name,
              participant_email: recipient.email,
              hackathon_name: eventName,
              type: recipient.type,
              position: recipient.position || null,
              status: 'active',
              generated_by: userId,
              admin_email: organizerEmail,
              maximally_username: actualUsername,
            })
            .select()
            .single();

          if (certError) {
            errors.push(`Failed to create certificate for ${recipient.name}: ${certError.message}`);
            continue;
          }

          generatedCertificates.push(cert);

          // Send email if requested
          if (send_email && recipient.email) {
            try {
              await sendCertificateEmail({
                email: recipient.email,
                userName: recipient.name,
                hackathonName: eventName,
                certificateId: certificateId,
                certificateType: recipient.type,
                position: recipient.position,
              });
            } catch (emailError: any) {
              console.error(`Failed to send email to ${recipient.email}:`, emailError);
              // Don't fail the whole operation for email errors
            }
          }
        } catch (err: any) {
          errors.push(`Error processing ${recipient.name}: ${err.message}`);
        }
      }

      return res.json({
        success: true,
        generated: generatedCertificates.length,
        replaced: deletedCount,
        total: recipients.length,
        errors: errors.length > 0 ? errors : undefined,
        certificates: generatedCertificates
      });
    } catch (error: any) {
      console.error('Certificate generation error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Check for existing certificates (for confirmation dialog)
  app.post("/api/organizer/hackathons/:hackathonId/certificates/check-existing", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      const { hackathonId } = req.params;
      const { recipients, hackathon_name } = req.body;

      // Verify ownership
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('organizer_id, hackathon_name')
        .eq('id', hackathonId)
        .single();

      if (hackathon?.organizer_id !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      const eventName = hackathon_name || hackathon.hackathon_name;
      
      // Check for existing certificates
      const emails = recipients.map((r: any) => r.email).filter(Boolean);
      const types = [...new Set(recipients.map((r: any) => r.type))];
      
      const { data: existingCerts, error } = await supabaseAdmin
        .from('certificates')
        .select('id, participant_name, participant_email, type, certificate_id')
        .eq('hackathon_name', eventName)
        .in('participant_email', emails)
        .in('type', types);

      if (error) throw error;

      return res.json({
        success: true,
        existingCount: existingCerts?.length || 0,
        existing: existingCerts || []
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get certificates for a hackathon
  app.get("/api/organizer/hackathons/:hackathonId/certificates", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      const { hackathonId } = req.params;

      // Verify ownership
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('organizer_id, hackathon_name')
        .eq('id', hackathonId)
        .single();

      if (hackathon?.organizer_id !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      // Get certificates for this hackathon
      const { data: certificates, error } = await supabaseAdmin
        .from('certificates')
        .select('*')
        .eq('hackathon_name', hackathon.hackathon_name)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.json({ success: true, data: certificates || [] });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Revoke a certificate
  app.post("/api/organizer/certificates/:certificateId/revoke", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      const { certificateId } = req.params;

      // Get certificate and verify ownership through hackathon
      const { data: cert } = await supabaseAdmin
        .from('certificates')
        .select('hackathon_name')
        .eq('certificate_id', certificateId)
        .single();

      if (!cert) {
        return res.status(404).json({ success: false, message: 'Certificate not found' });
      }

      // Update certificate status
      const { data, error } = await supabaseAdmin
        .from('certificates')
        .update({ status: 'inactive' })
        .eq('certificate_id', certificateId)
        .select()
        .single();

      if (error) throw error;

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Send email for a single certificate (queued for rate limiting)
  app.post("/api/organizer/certificates/:certificateId/send-email", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      const { certificateId } = req.params;

      // Get certificate
      const { data: cert } = await supabaseAdmin
        .from('certificates')
        .select('*')
        .eq('certificate_id', certificateId)
        .single();

      if (!cert) {
        return res.status(404).json({ success: false, message: 'Certificate not found' });
      }

      if (!cert.participant_email) {
        return res.status(400).json({ success: false, message: 'Certificate has no email address' });
      }

      // Send email through queue
      const result = await sendCertificateEmail({
        email: cert.participant_email,
        userName: cert.participant_name,
        hackathonName: cert.hackathon_name,
        certificateId: cert.certificate_id,
        certificateType: cert.type,
        position: cert.position,
      });

      if (result.success) {
        return res.json({ success: true, message: 'Email sent successfully' });
      } else {
        return res.status(500).json({ success: false, message: result.error || 'Failed to send email' });
      }
    } catch (error: any) {
      console.error('Certificate email error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get global email queue status
  app.get("/api/organizer/email-queue/status", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      const stats = getQueueStats();
      return res.json({ success: true, ...stats });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get certificate status for recipients (check who has certificates and who doesn't)
  app.post("/api/organizer/hackathons/:hackathonId/certificates/status", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      const { hackathonId } = req.params;
      const { recipients, hackathon_name } = req.body;

      // Verify ownership
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('organizer_id, hackathon_name')
        .eq('id', hackathonId)
        .single();

      if (hackathon?.organizer_id !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      const eventName = hackathon_name || hackathon.hackathon_name;
      
      // Get all certificates for this hackathon
      const { data: certificates, error } = await supabaseAdmin
        .from('certificates')
        .select('id, certificate_id, participant_name, participant_email, type, status')
        .eq('hackathon_name', eventName);

      if (error) throw error;

      // Map recipients to their certificate status
      const recipientStatus = recipients.map((r: any) => {
        const cert = (certificates || []).find(
          (c: any) => c.participant_email === r.email && c.type === r.type
        );
        return {
          ...r,
          hasCertificate: !!cert,
          certificate: cert || null
        };
      });

      const withCertificates = recipientStatus.filter((r: any) => r.hasCertificate);
      const withoutCertificates = recipientStatus.filter((r: any) => !r.hasCertificate);

      return res.json({
        success: true,
        total: recipients.length,
        withCertificates: withCertificates.length,
        withoutCertificates: withoutCertificates.length,
        recipients: recipientStatus
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });
}
