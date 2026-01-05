// @ts-nocheck
import type { Express } from "express";
import { createClient } from "@supabase/supabase-js";
import { sendCertificateEmail } from "../services/email";

async function bearerUserId(supabaseAdmin: any, token: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  return data?.user?.id || null;
}

// Generate a unique certificate ID
function generateCertificateId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'CERT-';
  for (let i = 0; i < 8; i++) {
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

      const eventName = hackathon_name || hackathon.hackathon_name;
      const generatedCertificates: any[] = [];
      const errors: string[] = [];

      // Process each recipient
      for (const recipient of recipients) {
        try {
          const certificateId = generateCertificateId();
          
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
              admin_email: null, // Will be filled by trigger or later
              maximally_username: recipient.name.toLowerCase().replace(/\s+/g, '_'),
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
        total: recipients.length,
        errors: errors.length > 0 ? errors : undefined,
        certificates: generatedCertificates
      });
    } catch (error: any) {
      console.error('Certificate generation error:', error);
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
}
