// @ts-nocheck
import type { Express } from "express";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { sendHackathonApprovedEmail, sendHackathonRejectedEmail } from "../services/email";

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

      // Update hackathon status - set both status and hackathon_status
      const { data, error } = await supabaseAdmin
        .from('organizer_hackathons')
        .update({
          status: 'published',
          hackathon_status: 'live',
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
      const { data: organizerProfile } = await supabaseAdmin
        .from('profiles')
        .select('full_name, username')
        .eq('id', hackathon.organizer_id)
        .single();

      sendHackathonApprovedEmail({
        email: hackathon.organizer_email,
        organizerName: organizerProfile?.full_name || organizerProfile?.username || 'Organizer',
        hackathonName: hackathon.hackathon_name,
        hackathonSlug: hackathon.slug,
      }).catch(err => console.error('Hackathon approved email failed:', err));

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
      const { data: organizerProfile } = await supabaseAdmin
        .from('profiles')
        .select('full_name, username')
        .eq('id', hackathon.organizer_id)
        .single();

      sendHackathonRejectedEmail({
        email: hackathon.organizer_email,
        organizerName: organizerProfile?.full_name || organizerProfile?.username || 'Organizer',
        hackathonName: hackathon.hackathon_name,
        reason: rejectionReason,
      }).catch(err => console.error('Hackathon rejected email failed:', err));

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

  // DEPRECATED: Get all edit requests - Platform Simplification
  // Edit requests are no longer used - organizers can edit directly (Requirements 8.1, 8.2, 18.1)
  app.get("/api/admin/edit-requests", async (req, res) => {
    return res.json({ 
      success: true, 
      data: [],
      deprecated: true,
      message: 'Edit requests are no longer required. Organizers can now edit hackathons directly without admin approval.'
    });
  });

  // DEPRECATED: Approve edit request - Platform Simplification
  app.post("/api/admin/edit-requests/:id/approve", async (req, res) => {
    return res.status(400).json({ 
      success: false, 
      message: 'Edit request approval is no longer required. Organizers can now edit hackathons directly.',
      deprecated: true
    });
  });

  // DEPRECATED: Reject edit request - Platform Simplification
  app.post("/api/admin/edit-requests/:id/reject", async (req, res) => {
    return res.status(400).json({ 
      success: false, 
      message: 'Edit request rejection is no longer required. Organizers can now edit hackathons directly.',
      deprecated: true
    });
  });

  // DEPRECATED: Delete edit request - Platform Simplification
  app.delete("/api/admin/edit-requests/:id", async (req, res) => {
    return res.status(400).json({ 
      success: false, 
      message: 'Edit request deletion is no longer required. Organizers can now edit hackathons directly.',
      deprecated: true
    });
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
