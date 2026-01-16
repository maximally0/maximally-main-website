// @ts-nocheck
/**
 * Admin routes for managing organizer applications
 * These routes are for admin panel use only
 */
import type { Express, Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";
import { Resend } from 'resend';

export function registerAdminOrganizerApplicationRoutes(app: Express) {
  const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;
  
  // Initialize Resend for emails
  let resend: Resend | null = null;
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    resend = new Resend(resendApiKey);
  }

  // Get all organizer applications (Admin only)
  app.get("/api/admin/organizer-applications", async (req: Request, res: Response) => {
    try {
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server not configured" });
      }

      // Fetch all applications with their status
      const { data: applications, error } = await supabaseAdmin
        .from('organizer_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to fetch applications',
          error: error.message 
        });
      }

      return res.json(applications || []);
    } catch (err: any) {
      console.error('Admin organizer applications error:', err);
      return res.status(500).json({ 
        success: false, 
        message: err?.message || 'Failed to fetch applications' 
      });
    }
  });

  // Approve organizer application
  app.post("/api/admin/organizer-applications/:id/approve", async (req: Request, res: Response) => {
    try {
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server not configured" });
      }

      const { id } = req.params;

      // Get the application
      const { data: application, error: fetchError } = await supabaseAdmin
        .from('organizer_applications')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !application) {
        return res.status(404).json({ 
          success: false, 
          message: 'Application not found' 
        });
      }

      // Update application status
      const { error: updateError } = await supabaseAdmin
        .from('organizer_applications')
        .update({ 
          status: 'approved',
          reviewed_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) {
        console.error('Error updating application:', updateError);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to approve application',
          error: updateError.message 
        });
      }

      // Update user profile to organizer role if user_id exists
      if (application.user_id) {
        await supabaseAdmin
          .from('profiles')
          .update({ role: 'organizer' })
          .eq('id', application.user_id);
      }

      // Send approval email
      if (resend && application.email) {
        try {
          await resend.emails.send({
            from: process.env.FROM_EMAIL || 'noreply@maximally.in',
            to: application.email,
            subject: 'Your Maximally Organizer Application Has Been Approved!',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Congratulations, ${application.full_name}!</h2>
                <p>Your application to become a Maximally organizer has been approved.</p>
                <p>You can now start creating and managing hackathons on the platform.</p>
                <a href="${process.env.PLATFORM_URL || 'https://maximally.in'}" 
                   style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
                  Get Started
                </a>
                <p>Welcome to the Maximally organizer community!</p>
              </div>
            `
          });
        } catch (emailError) {
          console.error('Error sending approval email:', emailError);
          // Don't fail the request if email fails
        }
      }

      return res.json({ 
        success: true, 
        message: 'Application approved successfully' 
      });
    } catch (err: any) {
      console.error('Approve application error:', err);
      return res.status(500).json({ 
        success: false, 
        message: err?.message || 'Failed to approve application' 
      });
    }
  });

  // Reject organizer application
  app.post("/api/admin/organizer-applications/:id/reject", async (req: Request, res: Response) => {
    try {
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server not configured" });
      }

      const { id } = req.params;
      const { reason } = req.body;

      // Get the application
      const { data: application, error: fetchError } = await supabaseAdmin
        .from('organizer_applications')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !application) {
        return res.status(404).json({ 
          success: false, 
          message: 'Application not found' 
        });
      }

      // Update application status
      const { error: updateError } = await supabaseAdmin
        .from('organizer_applications')
        .update({ 
          status: 'rejected',
          rejection_reason: reason || 'Application did not meet requirements',
          reviewed_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) {
        console.error('Error updating application:', updateError);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to reject application',
          error: updateError.message 
        });
      }

      // Send rejection email
      if (resend && application.email) {
        try {
          await resend.emails.send({
            from: process.env.FROM_EMAIL || 'noreply@maximally.in',
            to: application.email,
            subject: 'Update on Your Maximally Organizer Application',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Thank you for your interest, ${application.full_name}</h2>
                <p>We appreciate you taking the time to apply to become a Maximally organizer.</p>
                <p>After careful review, we are unable to approve your application at this time.</p>
                ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
                <p>You're welcome to reapply in the future as you gain more experience.</p>
                <p>Thank you for your interest in Maximally!</p>
              </div>
            `
          });
        } catch (emailError) {
          console.error('Error sending rejection email:', emailError);
          // Don't fail the request if email fails
        }
      }

      return res.json({ 
        success: true, 
        message: 'Application rejected successfully' 
      });
    } catch (err: any) {
      console.error('Reject application error:', err);
      return res.status(500).json({ 
        success: false, 
        message: err?.message || 'Failed to reject application' 
      });
    }
  });

  // Delete organizer application
  app.delete("/api/admin/organizer-applications/:id", async (req: Request, res: Response) => {
    try {
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server not configured" });
      }

      const { id } = req.params;

      // Delete the application
      const { error } = await supabaseAdmin
        .from('organizer_applications')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting application:', error);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to delete application',
          error: error.message 
        });
      }

      return res.json({ 
        success: true, 
        message: 'Application deleted successfully' 
      });
    } catch (err: any) {
      console.error('Delete application error:', err);
      return res.status(500).json({ 
        success: false, 
        message: err?.message || 'Failed to delete application' 
      });
    }
  });
}
