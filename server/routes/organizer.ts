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

      // Update user role to organizer if not already
      await supabaseAdmin
        .from('profiles')
        .update({ role: 'organizer' })
        .eq('id', userId);

      return res.json({ success: true, data });
    } catch (error: any) {
      console.error('Error in create hackathon:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get all hackathons for current user
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

      const { data, error } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('*')
        .eq('organizer_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching hackathons:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch hackathons' });
      }

      return res.json({ success: true, data });
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

      const { data, error } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('*')
        .eq('id', id)
        .eq('organizer_id', userId)
        .single();

      if (error || !data) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      return res.json({ success: true, data });
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

      // Check ownership first
      const { data: existing } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('*')
        .eq('id', id)
        .eq('organizer_id', userId)
        .single();

      if (!existing) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      // Don't allow updates if already published (except by admin)
      if (existing.status === 'published') {
        return res.status(403).json({ 
          success: false, 
          message: 'Cannot edit published hackathon. Please contact support.' 
        });
      }

      // Accept any updates without strict validation for flexibility
      let updates = { ...req.body };

      // Remove fields that shouldn't be updated directly
      delete updates.id;
      delete updates.organizer_id;
      delete updates.organizer_email;
      delete updates.created_at;
      delete updates.views_count;
      delete updates.registrations_count;

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
        .eq('organizer_id', userId)
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

  // Delete hackathon (only drafts)
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

      // Check ownership and status
      const { data: existing } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('status')
        .eq('id', id)
        .eq('organizer_id', userId)
        .single();

      if (!existing) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      if (existing.status !== 'draft') {
        return res.status(403).json({ 
          success: false, 
          message: 'Can only delete draft hackathons' 
        });
      }

      const { error } = await supabaseAdmin
        .from('organizer_hackathons')
        .delete()
        .eq('id', id)
        .eq('organizer_id', userId);

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
}
