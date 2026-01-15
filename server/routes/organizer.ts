// @ts-nocheck
import type { Express } from "express";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { sendWinnerNotification } from "../services/email";

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

// Validation schemas
const createHackathonSchema = z.object({
  hackathonName: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  startDate: z.string(),
  endDate: z.string(),
});

// Update schema - accept any fields, we'll validate on the server
const updateHackathonSchema = z.record(z.any());

export function registerOrganizerRoutes(app: Express) {
  const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;

  // Create a new hackathon (draft)
  app.post("/api/organizer/hackathons", async (req, res) => {
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

      // Only approved organizers (or admins) can create hackathons
      const { data: roleRow } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      const role = (roleRow as any)?.role;
      if (role !== 'organizer' && role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Organizer role required. Please apply to become an organizer and wait for approval.'
        });
      }

      // Get user email
      const { data: userData } = await supabaseAdmin.auth.getUser(token);
      const userEmail = userData?.user?.email;
      if (!userEmail) {
        return res.status(400).json({ success: false, message: 'User email not found' });
      }

      // Validate input
      const validation = createHackathonSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          success: false, 
          message: 'Validation failed',
          errors: validation.error.errors 
        });
      }

      const { hackathonName, slug, startDate, endDate } = validation.data;

      // Check if slug is already taken
      const { data: existing } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('id')
        .eq('slug', slug)
        .single();

      if (existing) {
        return res.status(409).json({ 
          success: false, 
          message: 'This slug is already taken. Please choose a different one.' 
        });
      }

      // Calculate duration
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffMs = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      const duration = diffDays === 1 ? '1 day' : `${diffDays} days`;

      // Create hackathon
      const { data, error } = await supabaseAdmin
        .from('organizer_hackathons')
        .insert({
          organizer_id: userId,
          organizer_email: userEmail,
          hackathon_name: hackathonName,
          slug,
          start_date: startDate,
          end_date: endDate,
          duration,
          format: 'online', // default
          status: 'draft'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating hackathon:', error);
        return res.status(500).json({ success: false, message: 'Failed to create hackathon' });
      }

      // Create or update organizer profile
      const { data: profile } = await supabaseAdmin
        .from('organizer_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!profile) {
        await supabaseAdmin
          .from('organizer_profiles')
          .insert({ user_id: userId });
      }

      return res.json({ success: true, data });
    } catch (error: any) {
      console.error('Error in create hackathon:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get all hackathons for current user (owned + co-organized)
  app.get("/api/organizer/hackathons", async (req, res) => {
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

      console.log('Fetching hackathons for user:', userId);

      // Get hackathons owned by user
      const { data: ownedHackathons, error: ownedError } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('*')
        .eq('organizer_id', userId)
        .order('created_at', { ascending: false });

      if (ownedError) {
        console.error('Error fetching owned hackathons:', ownedError);
        return res.status(500).json({ success: false, message: 'Failed to fetch hackathons' });
      }

      console.log('Owned hackathons:', ownedHackathons?.length || 0);

      // Get hackathons where user is a co-organizer (accepted status)
      // Note: user_id in hackathon_organizers is UUID type
      const { data: coOrgAssignments, error: coOrgError } = await supabaseAdmin
        .from('hackathon_organizers')
        .select('hackathon_id, role, user_id, status')
        .eq('user_id', userId)
        .eq('status', 'accepted');

      console.log('Co-org query for user_id:', userId);
      console.log('Co-org assignments:', coOrgAssignments);
      if (coOrgError) {
        console.error('Co-org error:', coOrgError);
      }

      let coOrganizedHackathons: any[] = [];
      if (!coOrgError && coOrgAssignments && coOrgAssignments.length > 0) {
        const hackathonIds = coOrgAssignments.map(a => a.hackathon_id);
        console.log('Fetching hackathons with IDs:', hackathonIds);
        
        const { data: hackathons, error: hackathonsError } = await supabaseAdmin
          .from('organizer_hackathons')
          .select('*')
          .in('id', hackathonIds)
          .order('created_at', { ascending: false });
        
        if (hackathonsError) {
          console.error('Error fetching co-organized hackathons:', hackathonsError);
        }
        
        // Add role info to each hackathon
        coOrganizedHackathons = (hackathons || []).map(h => ({
          ...h,
          _coOrganizerRole: coOrgAssignments.find(a => a.hackathon_id === h.id)?.role,
          _isCoOrganizer: true
        }));
        
        console.log('Co-organized hackathons:', coOrganizedHackathons.length);
      }

      // Combine and deduplicate (in case someone is both owner and co-organizer)
      const ownedIds = new Set((ownedHackathons || []).map(h => h.id));
      const allHackathons = [
        ...(ownedHackathons || []).map(h => ({ ...h, _isOwner: true })),
        ...coOrganizedHackathons.filter(h => !ownedIds.has(h.id))
      ];

      // Sort by created_at descending
      allHackathons.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      console.log('Total hackathons returned:', allHackathons.length);

      return res.json({ success: true, data: allHackathons });
    } catch (error: any) {
      console.error('Error in get hackathons:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get single hackathon by ID
  app.get("/api/organizer/hackathons/:id", async (req, res) => {
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

      const { id } = req.params;
      console.log(`[GET hackathon] User ${userId} requesting hackathon ${id}`);

      // First, get the hackathon without ownership check
      const { data, error } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        console.log(`[GET hackathon] Hackathon ${id} not found in database`);
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      // Check if user is owner
      const isOwner = data.organizer_id === userId;
      console.log(`[GET hackathon] Is owner: ${isOwner} (organizer_id: ${data.organizer_id}, userId: ${userId})`);

      // Check if user is a co-organizer
      let isCoOrganizer = false;
      let coOrgRole = null;
      if (!isOwner) {
        console.log(`[GET hackathon] Checking co-organizer status for user ${userId} on hackathon ${id}`);
        const { data: coOrg, error: coOrgError } = await supabaseAdmin
          .from('hackathon_organizers')
          .select('role, status')
          .eq('hackathon_id', id)
          .eq('user_id', userId)
          .eq('status', 'accepted')
          .single();
        
        console.log(`[GET hackathon] Co-org query result:`, coOrg, 'Error:', coOrgError);
        
        if (coOrg) {
          isCoOrganizer = true;
          coOrgRole = coOrg.role;
        }
      }

      // If user is neither owner nor co-organizer, deny access
      if (!isOwner && !isCoOrganizer) {
        console.log(`[GET hackathon] Access denied - user is neither owner nor co-organizer`);
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      // Add role info to response
      return res.json({ 
        success: true, 
        data: {
          ...data,
          _isOwner: isOwner,
          _isCoOrganizer: isCoOrganizer,
          _coOrganizerRole: coOrgRole
        }
      });
    } catch (error: any) {
      console.error('Error in get hackathon:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Update hackathon
  app.patch("/api/organizer/hackathons/:id", async (req, res) => {
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

      const { id } = req.params;

      // Get the hackathon first
      const { data: existing } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('*')
        .eq('id', id)
        .single();

      if (!existing) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      // Check if user is owner or co-organizer
      const isOwner = existing.organizer_id === userId;
      let isCoOrganizer = false;
      
      if (!isOwner) {
        const { data: coOrg } = await supabaseAdmin
          .from('hackathon_organizers')
          .select('role, status')
          .eq('hackathon_id', id)
          .eq('user_id', userId)
          .eq('status', 'accepted')
          .single();
        
        isCoOrganizer = !!coOrg;
      }

      if (!isOwner && !isCoOrganizer) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      // Platform Simplification: Allow all edits for published hackathons
      // Organizers can edit directly without approval (Requirements 8.1, 8.2, 18.1)
      // No edit request workflow needed anymore

      // Accept any updates without strict validation for flexibility
      let updates = { ...req.body };

      // Remove fields that shouldn't be updated directly
      delete updates.id;
      delete updates.organizer_id;
      delete updates.organizer_email;
      delete updates.created_at;
      delete updates.views_count;
      delete updates.registrations_count;
      
      // Remove internal fields added by the API (not in database)
      delete updates._coOrganizerRole;
      delete updates._isCoOrganizer;
      delete updates._isOwner;

      // Recalculate duration if dates changed
      if (updates.start_date || updates.end_date) {
        const start = new Date(updates.start_date || existing.start_date);
        const end = new Date(updates.end_date || existing.end_date);
        const diffMs = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        updates.duration = diffDays === 1 ? '1 day' : `${diffDays} days`;
      }

      // Update timestamp
      updates.updated_at = new Date().toISOString();

      const { data, error } = await supabaseAdmin
        .from('organizer_hackathons')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating hackathon:', error);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to update hackathon',
          error: error.message 
        });
      }

      return res.json({ success: true, data });
    } catch (error: any) {
      console.error('Error in update hackathon:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Request publication
  app.post("/api/organizer/hackathons/:id/request-publish", async (req, res) => {
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

      const { id } = req.params;

      // Check ownership
      const { data: existing } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('*')
        .eq('id', id)
        .eq('organizer_id', userId)
        .single();

      if (!existing) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      if (existing.status === 'published') {
        return res.status(400).json({ success: false, message: 'Hackathon is already published' });
      }

      if (existing.status === 'pending_review') {
        return res.status(400).json({ success: false, message: 'Hackathon is already pending review' });
      }

      // Validate required fields
      const missingFields = [];
      if (!existing.hackathon_name) missingFields.push('Hackathon Name');
      if (!existing.description || existing.description.trim() === '') missingFields.push('Description');
      if (!existing.start_date) missingFields.push('Start Date');
      if (!existing.end_date) missingFields.push('End Date');
      
      if (missingFields.length > 0) {
        return res.status(400).json({ 
          success: false, 
          message: `Please complete these required fields: ${missingFields.join(', ')}` 
        });
      }

      const { data, error } = await supabaseAdmin
        .from('organizer_hackathons')
        .update({
          status: 'pending_review',
          publish_requested_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('organizer_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error requesting publication:', error);
        return res.status(500).json({ success: false, message: 'Failed to request publication' });
      }

      return res.json({ success: true, data });
    } catch (error: any) {
      console.error('Error in request publish:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Delete hackathon (organizer can delete their own hackathons)
  app.delete("/api/organizer/hackathons/:id", async (req, res) => {
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

      const { id } = req.params;

      // Check ownership
      const { data: existing } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('*')
        .eq('id', id)
        .eq('organizer_id', userId)
        .single();

      if (!existing) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      // Delete the hackathon (this will cascade delete related data if configured)
      const { error } = await supabaseAdmin
        .from('organizer_hackathons')
        .delete()
        .eq('id', id)
        .eq('organizer_id', userId);

      if (error) {
        console.error('Error deleting hackathon:', error);
        return res.status(500).json({ success: false, message: 'Failed to delete hackathon' });
      }

      // Update organizer stats if it was published
      if (existing.status === 'published') {
        const { data: profile } = await supabaseAdmin
          .from('organizer_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (profile && profile.total_hackathons_hosted > 0) {
          await supabaseAdmin
            .from('organizer_profiles')
            .update({
              total_hackathons_hosted: profile.total_hackathons_hosted - 1
            })
            .eq('user_id', userId);
        }
      }

      return res.json({ success: true, message: 'Hackathon deleted successfully' });
    } catch (error: any) {
      console.error('Error in delete hackathon:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get organizer profile
  app.get("/api/organizer/profile", async (req, res) => {
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

      const { data, error } = await supabaseAdmin
        .from('organizer_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        console.error('Error fetching organizer profile:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch profile' });
      }

      return res.json({ success: true, data: data || null });
    } catch (error: any) {
      console.error('Error in get organizer profile:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get organizer profile with tier (for dashboard)
  app.get("/api/organizer/my-profile", async (req, res) => {
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

      // Check if user is an organizer
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profile?.role !== 'organizer') {
        return res.status(403).json({ success: false, message: 'Not an organizer' });
      }

      const { data, error } = await supabaseAdmin
        .from('organizer_profiles')
        .select('tier, organization_name, total_hackathons_hosted, total_participants_reached')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching organizer profile:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch profile' });
      }

      // Return default tier if no profile exists yet
      return res.json({ 
        success: true, 
        data: data || { 
          tier: 'starter', 
          organization_name: null,
          total_hackathons_hosted: 0,
          total_participants_reached: 0
        } 
      });
    } catch (error: any) {
      console.error('Error in get organizer my-profile:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // DEPRECATED: Edit request endpoint - Platform Simplification
  // Organizers can now edit published hackathons directly without approval (Requirements 8.1, 8.2, 18.1)
  // This endpoint is kept for backwards compatibility but returns a deprecation notice
  app.post("/api/organizer/hackathons/:id/request-edit", async (req, res) => {
    return res.status(400).json({ 
      success: false, 
      message: 'Edit requests are no longer required. You can now edit your hackathon directly using the PATCH endpoint.',
      deprecated: true,
      useInstead: 'PATCH /api/organizer/hackathons/:id'
    });
  });

  // DEPRECATED: Get edit requests - Platform Simplification
  // Edit requests are no longer used - organizers can edit directly
  app.get("/api/organizer/edit-requests", async (req, res) => {
    return res.json({ 
      success: true, 
      data: [],
      deprecated: true,
      message: 'Edit requests are no longer required. Organizers can now edit hackathons directly.'
    });
  });

  // Get user profile by username (public endpoint)
  app.get("/api/profile/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;

      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('id, username, full_name, avatar_url, bio, location, role')
        .eq('username', username)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile by username:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch profile' });
      }

      if (!data) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      return res.json({ success: true, data });
    } catch (error: any) {
      console.error('Error in get profile by username:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get public organizer profile by user ID
  app.get("/api/organizer/profile/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;

      const { data, error } = await supabaseAdmin
        .from('organizer_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching organizer profile:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch profile' });
      }

      return res.json({ success: true, data: data || null });
    } catch (error: any) {
      console.error('Error in get public organizer profile:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get organizer's public hackathons
  app.get("/api/organizer/:userId/hackathons", async (req, res) => {
    try {
      const { userId } = req.params;
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;

      const { data, error } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('*')
        .eq('organizer_id', userId)
        .eq('status', 'published')
        .order('start_date', { ascending: false });

      if (error) {
        console.error('Error fetching organizer hackathons:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch hackathons' });
      }

      return res.json({ success: true, data: data || [] });
    } catch (error: any) {
      console.error('Error in get organizer hackathons:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Update organizer profile
  app.patch("/api/organizer/profile", async (req, res) => {
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

      const updates = req.body;

      // Check if profile exists
      const { data: existing } = await supabaseAdmin
        .from('organizer_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

      let data, error;

      if (existing) {
        // Update existing profile
        ({ data, error } = await supabaseAdmin
          .from('organizer_profiles')
          .update(updates)
          .eq('user_id', userId)
          .select()
          .single());
      } else {
        // Create new profile
        ({ data, error } = await supabaseAdmin
          .from('organizer_profiles')
          .insert({ user_id: userId, ...updates })
          .select()
          .single());
      }

      if (error) {
        console.error('Error updating organizer profile:', error);
        return res.status(500).json({ success: false, message: 'Failed to update profile' });
      }

      return res.json({ success: true, data });
    } catch (error: any) {
      console.error('Error in update organizer profile:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Clone a hackathon
  app.post("/api/organizer/hackathons/:id/clone", async (req, res) => {
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

      const { id } = req.params;

      // Get the original hackathon
      const { data: original, error: fetchError } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('*')
        .eq('id', id)
        .eq('organizer_id', userId)
        .single();

      if (fetchError || !original) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      // Get user email
      const { data: userData } = await supabaseAdmin.auth.getUser(token);
      const userEmail = userData?.user?.email;

      // Create a new slug with timestamp
      const timestamp = Date.now();
      const newSlug = `${original.slug}-copy-${timestamp}`;

      // Clone the hackathon with draft status
      const { data: cloned, error: cloneError } = await supabaseAdmin
        .from('organizer_hackathons')
        .insert({
          organizer_id: userId,
          organizer_email: userEmail,
          hackathon_name: `${original.hackathon_name} (Copy)`,
          slug: newSlug,
          tagline: original.tagline,
          description: original.description,
          start_date: original.start_date,
          end_date: original.end_date,
          duration: original.duration,
          format: original.format,
          venue: original.venue,
          location: original.location,
          team_size_min: original.team_size_min,
          team_size_max: original.team_size_max,
          registration_fee: original.registration_fee,
          total_prize_pool: original.total_prize_pool,
          prize_breakdown: original.prize_breakdown,
          rules_content: original.rules_content,
          eligibility_criteria: original.eligibility_criteria,
          submission_guidelines: original.submission_guidelines,
          judging_process: original.judging_process,
          code_of_conduct: original.code_of_conduct,
          tracks: original.tracks,
          themes: original.themes,
          open_innovation: original.open_innovation,
          sponsors: original.sponsors,
          partners: original.partners,
          perks: original.perks,
          faqs: original.faqs,
          discord_link: original.discord_link,
          whatsapp_link: original.whatsapp_link,
          website_url: original.website_url,
          contact_email: original.contact_email,
          cover_image: original.cover_image,
          status: 'draft', // Always create as draft
          views_count: 0,
          registrations_count: 0
        })
        .select()
        .single();

      if (cloneError) {
        console.error('Error cloning hackathon:', cloneError);
        return res.status(500).json({ success: false, message: 'Failed to clone hackathon' });
      }

      return res.json({ success: true, data: cloned });
    } catch (error: any) {
      console.error('Error in clone hackathon:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // DEPRECATED: Update period controls for a hackathon
  // Period controls have been removed in Platform Simplification.
  // All phases are now automatically determined by dates.
  // See: .kiro/specs/platform-simplification/requirements.md - Requirement 4
  app.put("/api/organizer/hackathons/:id/period-control", async (req, res) => {
    // Return 410 Gone - feature removed
    return res.status(410).json({ 
      success: false, 
      message: 'Period controls have been removed. All phases are now automatically determined by hackathon dates.' 
    });
  });

  // Get winners for a hackathon
  app.get("/api/organizer/hackathons/:id/winners", async (req, res) => {
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

      const { id } = req.params;

      // Check ownership
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('id, organizer_id')
        .eq('id', id)
        .eq('organizer_id', userId)
        .single();

      if (!hackathon) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      // Get winners with submission details
      const { data, error } = await supabaseAdmin
        .from('hackathon_winners')
        .select(`
          *,
          submission:hackathon_submissions(
            id,
            project_name,
            tagline,
            demo_url,
            github_repo,
            user_id,
            team_id
          )
        `)
        .eq('hackathon_id', id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching winners:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch winners' });
      }

      // Enrich with user names and team names
      const enrichedData = await Promise.all((data || []).map(async (winner: any) => {
        let userName = 'Anonymous';
        let teamName = null;

        if (winner.submission?.user_id) {
          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('username, full_name')
            .eq('id', winner.submission.user_id)
            .single();
          userName = profile?.full_name || profile?.username || 'Anonymous';
        }

        if (winner.submission?.team_id) {
          const { data: team } = await supabaseAdmin
            .from('hackathon_teams')
            .select('team_name')
            .eq('id', winner.submission.team_id)
            .single();
          teamName = team?.team_name;
        }

        return {
          ...winner,
          submission: winner.submission ? {
            ...winner.submission,
            user_name: userName,
            team: teamName ? { team_name: teamName } : null
          } : null
        };
      }));

      return res.json({ success: true, data: enrichedData });
    } catch (error: any) {
      console.error('Error in get winners:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Announce winners for a hackathon
  app.post("/api/organizer/hackathons/:id/announce-winners", async (req, res) => {
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

      const { id } = req.params;
      const { winners } = req.body;

      if (!winners || !Array.isArray(winners) || winners.length === 0) {
        return res.status(400).json({ success: false, message: 'No winners provided' });
      }

      // Check ownership
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('id, organizer_id')
        .eq('id', id)
        .eq('organizer_id', userId)
        .single();

      if (!hackathon) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      // Delete existing winners for this hackathon
      await supabaseAdmin
        .from('hackathon_winners')
        .delete()
        .eq('hackathon_id', id);

      // Get submission details to get user_id for each winner
      const submissionIds = winners.map((w: any) => w.submission_id);
      const { data: submissions } = await supabaseAdmin
        .from('hackathon_submissions')
        .select('id, user_id, team_id, project_name')
        .in('id', submissionIds);

      const submissionMap = new Map((submissions || []).map((s: any) => [s.id, s]));

      // Insert new winners with user_id from submission
      const winnersToInsert = winners.map((w: any, index: number) => {
        const submission = submissionMap.get(w.submission_id);
        return {
          hackathon_id: parseInt(id),
          submission_id: w.submission_id,
          user_id: submission?.user_id,
          team_id: submission?.team_id || null,
          position: index + 1, // numeric position (1, 2, 3...)
          prize_name: w.prize_position, // Required field - use prize_position as prize_name
          prize_position: w.prize_position, // text like "1st Place"
          prize_amount: w.prize_amount || null,
          announced_by: userId
        };
      });

      const { data, error } = await supabaseAdmin
        .from('hackathon_winners')
        .insert(winnersToInsert)
        .select();

      if (error) {
        console.error('Error announcing winners:', error);
        return res.status(500).json({ success: false, message: 'Failed to announce winners' });
      }

      // Update hackathon to mark winners announced
      await supabaseAdmin
        .from('organizer_hackathons')
        .update({ 
          winners_announced: true,
          winners_announced_at: new Date().toISOString()
        })
        .eq('id', id);

      // Update submissions with prize won and send winner emails
      const { data: hackathonDetails } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('hackathon_name, slug')
        .eq('id', id)
        .single();

      for (const winner of winners) {
        await supabaseAdmin
          .from('hackathon_submissions')
          .update({ prize_won: winner.prize_position })
          .eq('id', winner.submission_id);

        // Send winner notification email
        if (hackathonDetails) {
          const submission = submissionMap.get(winner.submission_id);
          if (submission?.user_id) {
            const { data: winnerProfile } = await supabaseAdmin
              .from('profiles')
              .select('email, full_name, username')
              .eq('id', submission.user_id)
              .single();

            if (winnerProfile?.email) {
              sendWinnerNotification({
                email: winnerProfile.email,
                userName: winnerProfile.full_name || winnerProfile.username || 'there',
                hackathonName: hackathonDetails.hackathon_name,
                hackathonSlug: hackathonDetails.slug,
                projectName: submission.project_name || 'Your Project',
                projectId: winner.submission_id,
                prize: winner.prize_position || 'Winner',
                score: winner.score || 0,
              }).catch(err => console.error('Winner notification email failed:', err));
            }
          }
        }
      }

      return res.json({ success: true, data, message: 'Winners announced successfully' });
    } catch (error: any) {
      console.error('Error in announce winners:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });
}
