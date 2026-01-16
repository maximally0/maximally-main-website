// @ts-nocheck
import type { Express, Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";

export function registerOrganizerApplicationRoutes(app: Express) {
  const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;

  // Submit organizer application
  app.post("/api/organizer/apply", async (req: Request, res: Response) => {
    try {
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server is not configured for Supabase" });
      }

      const body = req.body;

      // Validate required fields
      if (!body.username || !body.full_name || !body.email) {
        return res.status(400).json({ 
          message: 'Missing required fields',
          details: {
            username: !body.username ? 'Username is required' : null,
            full_name: !body.full_name ? 'Full name is required' : null,
            email: !body.email ? 'Email is required' : null
          }
        });
      }

      // Check for existing username in applications
      const { data: existingUsername } = await supabaseAdmin
        .from('organizer_applications')
        .select('id')
        .eq('username', body.username)
        .maybeSingle();

      if (existingUsername) {
        return res.status(400).json({ message: 'You have already submitted an application' });
      }

      // Check if already an organizer
      const { data: existingOrganizer } = await supabaseAdmin
        .from('profiles')
        .select('id, role')
        .eq('username', body.username)
        .single();

      if (existingOrganizer && (existingOrganizer as any).role === 'organizer') {
        return res.status(400).json({ message: 'You are already an approved organizer' });
      }

      // Prepare application data
      const applicationData = {
        user_id: body.user_id || null,
        username: body.username,
        email: body.email,
        full_name: body.full_name,
        organization_name: body.organization_name,
        organization_type: body.organization_type,
        organization_website: body.organization_website,
        phone: body.phone,
        location: body.location,
        previous_organizing_experience: body.previous_organizing_experience,
        why_maximally: body.why_maximally,
        linkedin: body.linkedin,
        twitter: body.twitter,
        instagram: body.instagram,
        additional_info: body.additional_info,
        agreed_to_terms: body.agreed_to_terms || false,
        status: 'pending'
      };

      // Insert application
      const { data: application, error: applicationError } = await supabaseAdmin
        .from('organizer_applications')
        .insert(applicationData as any)
        .select()
        .single();

      if (applicationError) {
        console.error('Application insert error:', applicationError);
        return res.status(500).json({ 
          message: `Failed to submit application: ${applicationError.message}`,
          error: applicationError.message
        });
      }

      return res.status(201).json({
        message: 'Application submitted successfully! We will review your application and get back to you soon.',
        applicationId: (application as any).id
      });
    } catch (err: any) {
      console.error('Organizer application error:', err);
      return res.status(500).json({ message: err?.message || 'Failed to submit application' });
    }
  });

  // Get all organizer applications (Admin only)
  app.get("/api/organizer/applications", async (req: Request, res: Response) => {
    try {
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server is not configured for Supabase" });
      }

      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const { data: userData } = await supabaseAdmin.auth.getUser(token);
      const userId = userData?.user?.id;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      // Check if user is admin
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profile?.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }

      // Get all applications
      const { data: applications, error } = await supabaseAdmin
        .from('organizer_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch applications' });
      }

      return res.json({ success: true, data: applications || [] });
    } catch (err: any) {
      console.error('Error fetching applications:', err);
      return res.status(500).json({ success: false, message: err?.message || 'Failed to fetch applications' });
    }
  });
}
