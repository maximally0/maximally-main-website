// @ts-nocheck
import type { Express } from "express";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

// Helper to get user ID from bearer token
async function bearerUserId(supabaseAdmin: any, token: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  return data?.user?.id || null;
}

// Helper to check if user is admin
async function isAdmin(supabaseAdmin: any, userId: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  return data?.role === 'admin';
}

// Helper to send email (placeholder - implement with your email service)
async function sendEmail(to: string, subject: string, body: string) {
  // TODO: Implement email sending with Resend or your email service
  console.log(`Email to ${to}: ${subject}\n${body}`);
}

export function registerAdminHackathonRoutes(app: Express) {
  const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;

  // Get all pending hackathon publication requests
  app.get("/api/admin/hackathon-requests", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId || !(await isAdmin(supabaseAdmin, userId))) {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }

      const { data, error } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('*')
        .eq('status', 'pending_review')
        .order('publish_requested_at', { ascending: false });

      if (error) {
        console.error('Error fetching hackathon requests:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch requests' });
      }

      return res.json({ success: true, data });
    } catch (error: any) {
      console.error('Error in get hackathon requests:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get all hackathons (for admin management)
  app.get("/api/admin/hackathons", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId || !(await isAdmin(supabaseAdmin, userId))) {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }

      const { data, error } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all hackathons:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch hackathons' });
      }

      return res.json({ success: true, data });
    } catch (error: any) {
      console.error('Error in get all hackathons:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Approve hackathon publication
  app.post("/api/admin/hackathons/:id/approve", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId || !(await isAdmin(supabaseAdmin, userId))) {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }

      const { id } = req.params;
      const { adminNotes } = req.body;

      // Get hackathon details
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('*')
        .eq('id', id)
        .single();

      if (!hackathon) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      // Update hackathon status
      const { data, error } = await supabaseAdmin
        .from('organizer_hackathons')
        .update({
          status: 'published',
          reviewed_at: new Date().toISOString(),
          reviewed_by: userId,
          admin_notes: adminNotes || null
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error approving hackathon:', error);
        return res.status(500).json({ success: false, message: 'Failed to approve hackathon' });
      }

      // Update organizer role in profiles table
      await supabaseAdmin
        .from('profiles')
        .update({ role: 'organizer' })
        .eq('id', hackathon.organizer_id);

      // Update organizer stats
      const { data: profile } = await supabaseAdmin
        .from('organizer_profiles')
        .select('*')
        .eq('user_id', hackathon.organizer_id)
        .single();

      if (profile) {
        await supabaseAdmin
          .from('organizer_profiles')
          .update({
            total_hackathons_hosted: (profile.total_hackathons_hosted || 0) + 1
          })
          .eq('user_id', hackathon.organizer_id);
      }

      // Send approval email
      await sendEmail(
        hackathon.organizer_email,
        `🎉 Your hackathon "${hackathon.hackathon_name}" has been approved!`,
        `Congratulations! Your hackathon "${hackathon.hackathon_name}" has been approved and is now live on Maximally.\n\nView it here: https://maximally.in/hackathon/${hackathon.slug}\n\nYou can now share this link with participants and start promoting your event!\n\n${adminNotes ? `Admin notes: ${adminNotes}` : ''}\n\nBest regards,\nMaximally Team`
      );

      return res.json({ success: true, data });
    } catch (error: any) {
      console.error('Error in approve hackathon:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Reject hackathon publication
  app.post("/api/admin/hackathons/:id/reject", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId || !(await isAdmin(supabaseAdmin, userId))) {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }

      const { id } = req.params;
      const { rejectionReason, adminNotes } = req.body;

      if (!rejectionReason) {
        return res.status(400).json({ 
          success: false, 
          message: 'Rejection reason is required' 
        });
      }

      // Get hackathon details
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('*')
        .eq('id', id)
        .single();

      if (!hackathon) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      // Update hackathon status
      const { data, error } = await supabaseAdmin
        .from('organizer_hackathons')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: userId,
          rejection_reason: rejectionReason,
          admin_notes: adminNotes || null
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error rejecting hackathon:', error);
        return res.status(500).json({ success: false, message: 'Failed to reject hackathon' });
      }

      // Send rejection email
      await sendEmail(
        hackathon.organizer_email,
        `Update on your hackathon "${hackathon.hackathon_name}"`,
        `Hello,\n\nThank you for submitting "${hackathon.hackathon_name}" to Maximally.\n\nUnfortunately, we cannot approve your hackathon at this time for the following reason:\n\n${rejectionReason}\n\n${adminNotes ? `Additional notes: ${adminNotes}\n\n` : ''}You can make the necessary changes and resubmit your hackathon for review.\n\nIf you have any questions, please don't hesitate to reach out to us.\n\nBest regards,\nMaximally Team`
      );

      return res.json({ success: true, data });
    } catch (error: any) {
      console.error('Error in reject hackathon:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Delete hackathon request (admin only)
  app.delete("/api/admin/hackathons/:id", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId || !(await isAdmin(supabaseAdmin, userId))) {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }

      const { id } = req.params;

      const { error } = await supabaseAdmin
        .from('organizer_hackathons')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting hackathon:', error);
        return res.status(500).json({ success: false, message: 'Failed to delete hackathon' });
      }

      return res.json({ success: true });
    } catch (error: any) {
      console.error('Error in delete hackathon:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get all edit requests
  app.get("/api/admin/edit-requests", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId || !(await isAdmin(supabaseAdmin, userId))) {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }

      const { data: requests, error } = await supabaseAdmin
        .from('hackathon_edit_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching edit requests:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch edit requests' });
      }

      // Manually fetch hackathon details for each request
      const requestsWithHackathons = await Promise.all(
        (requests || []).map(async (request: any) => {
          const { data: hackathon } = await supabaseAdmin
            .from('organizer_hackathons')
            .select('hackathon_name, slug, status')
            .eq('id', request.hackathon_id)
            .single();

          return {
            ...request,
            hackathon: hackathon || null
          };
        })
      );

      console.log('Edit requests fetched:', requestsWithHackathons.length, 'requests');
      console.log('Sample request:', requestsWithHackathons[0]);

      return res.json({ success: true, data: requestsWithHackathons });
    } catch (error: any) {
      console.error('Error in get edit requests:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Approve edit request
  app.post("/api/admin/edit-requests/:id/approve", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId || !(await isAdmin(supabaseAdmin, userId))) {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }

      const { id } = req.params;
      const { adminNotes } = req.body;

      // Get edit request
      const { data: editRequest } = await supabaseAdmin
        .from('hackathon_edit_requests')
        .select('*')
        .eq('id', id)
        .single();

      if (!editRequest) {
        return res.status(404).json({ success: false, message: 'Edit request not found' });
      }

      // Apply the changes to the hackathon
      const { error: updateError } = await supabaseAdmin
        .from('organizer_hackathons')
        .update({
          ...editRequest.requested_changes,
          updated_at: new Date().toISOString()
        })
        .eq('id', editRequest.hackathon_id);

      if (updateError) {
        console.error('Error applying changes:', updateError);
        return res.status(500).json({ success: false, message: 'Failed to apply changes' });
      }

      // Update edit request status
      const { data, error } = await supabaseAdmin
        .from('hackathon_edit_requests')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: userId,
          admin_notes: adminNotes || null
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error approving edit request:', error);
        return res.status(500).json({ success: false, message: 'Failed to approve edit request' });
      }

      // Get hackathon details for email
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('hackathon_name, slug')
        .eq('id', editRequest.hackathon_id)
        .single();

      // Send approval email
      await sendEmail(
        editRequest.organizer_email,
        `✅ Edit request approved for "${hackathon?.hackathon_name}"`,
        `Good news! Your edit request for "${hackathon?.hackathon_name}" has been approved.\n\nYour changes are now live on the hackathon page.\n\n${adminNotes ? `Admin notes: ${adminNotes}\n\n` : ''}Best regards,\nMaximally Team`
      );

      return res.json({ success: true, data });
    } catch (error: any) {
      console.error('Error in approve edit request:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Reject edit request
  app.post("/api/admin/edit-requests/:id/reject", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId || !(await isAdmin(supabaseAdmin, userId))) {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }

      const { id } = req.params;
      const { rejectionReason, adminNotes } = req.body;

      if (!rejectionReason) {
        return res.status(400).json({ 
          success: false, 
          message: 'Rejection reason is required' 
        });
      }

      // Get edit request
      const { data: editRequest } = await supabaseAdmin
        .from('hackathon_edit_requests')
        .select('*')
        .eq('id', id)
        .single();

      if (!editRequest) {
        return res.status(404).json({ success: false, message: 'Edit request not found' });
      }

      // Update edit request status
      const { data, error } = await supabaseAdmin
        .from('hackathon_edit_requests')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: userId,
          rejection_reason: rejectionReason,
          admin_notes: adminNotes || null
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error rejecting edit request:', error);
        return res.status(500).json({ success: false, message: 'Failed to reject edit request' });
      }

      // Get hackathon details for email
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('hackathon_name')
        .eq('id', editRequest.hackathon_id)
        .single();

      // Send rejection email
      await sendEmail(
        editRequest.organizer_email,
        `Update on edit request for "${hackathon?.hackathon_name}"`,
        `Hello,\n\nYour edit request for "${hackathon?.hackathon_name}" could not be approved for the following reason:\n\n${rejectionReason}\n\n${adminNotes ? `Additional notes: ${adminNotes}\n\n` : ''}You can submit a new edit request with the necessary changes.\n\nBest regards,\nMaximally Team`
      );

      return res.json({ success: true, data });
    } catch (error: any) {
      console.error('Error in reject edit request:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Delete edit request
  app.delete("/api/admin/edit-requests/:id", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId || !(await isAdmin(supabaseAdmin, userId))) {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }

      const { id } = req.params;

      const { error } = await supabaseAdmin
        .from('hackathon_edit_requests')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting edit request:', error);
        return res.status(500).json({ success: false, message: 'Failed to delete edit request' });
      }

      return res.json({ success: true });
    } catch (error: any) {
      console.error('Error in delete edit request:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Update hackathon (admin can edit any hackathon)
  app.patch("/api/admin/hackathons/:id", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId || !(await isAdmin(supabaseAdmin, userId))) {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }

      const { id } = req.params;
      const updates = req.body;

      const { data, error } = await supabaseAdmin
        .from('organizer_hackathons')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating hackathon:', error);
        return res.status(500).json({ success: false, message: 'Failed to update hackathon' });
      }

      return res.json({ success: true, data });
    } catch (error: any) {
      console.error('Error in admin update hackathon:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });
}
