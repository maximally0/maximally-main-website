// @ts-nocheck
import type { Express } from "express";
import { createClient } from "@supabase/supabase-js";
import { sendRegistrationConfirmation } from "../services/email";

async function bearerUserId(supabaseAdmin: any, token: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  return data?.user?.id || null;
}

export function registerHackathonRegistrationRoutes(app: Express) {
  const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;

  // ============================================
  // REGISTRATION ENDPOINTS
  // ============================================

  // Unregister from hackathon
  app.delete("/api/hackathons/:hackathonId/register", async (req, res) => {
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

      // Check if registered
      const { data: registration } = await supabaseAdmin
        .from('hackathon_registrations')
        .select('id, status, team_id')
        .eq('hackathon_id', hackathonId)
        .eq('user_id', userId)
        .single();

      if (!registration) {
        return res.status(404).json({ success: false, message: 'Not registered for this hackathon' });
      }

      // Check if already checked in
      if (registration.status === 'checked_in') {
        return res.status(400).json({ success: false, message: 'Cannot unregister after check-in' });
      }

      // Delete registration
      const { error } = await supabaseAdmin
        .from('hackathon_registrations')
        .delete()
        .eq('id', registration.id);

      if (error) throw error;

      // Decrement registration count
      await supabaseAdmin
        .from('organizer_hackathons')
        .update({ 
          registrations_count: supabaseAdmin.raw('GREATEST(registrations_count - 1, 0)')
        })
        .eq('id', hackathonId);

      return res.json({ success: true, message: 'Successfully unregistered from hackathon' });
    } catch (error: any) {
      console.error('Unregister error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Register for hackathon (individual)
  app.post("/api/hackathons/:hackathonId/register", async (req, res) => {
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
      const registrationData = req.body;

      // Check if hackathon exists and registrations are open
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('registration_opens_at, registration_closes_at, status')
        .eq('id', hackathonId)
        .single();

      if (!hackathon) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      if (hackathon.status !== 'published') {
        return res.status(403).json({ success: false, message: 'Hackathon is not published' });
      }

      const now = new Date();
      
      // Check if registrations are closed
      if (hackathon.registration_closes_at && new Date(hackathon.registration_closes_at) < now) {
        return res.status(403).json({ success: false, message: 'Registrations are closed for this hackathon' });
      }

      // Check if registrations haven't opened yet
      if (hackathon.registration_opens_at && new Date(hackathon.registration_opens_at) > now) {
        return res.status(403).json({ success: false, message: 'Registrations have not opened yet' });
      }

      // Get user profile
      const { data: userData } = await supabaseAdmin.auth.getUser(token);
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('username, full_name, email')
        .eq('id', userId)
        .single();

      // Check if already registered
      const { data: existing } = await supabaseAdmin
        .from('hackathon_registrations')
        .select('id')
        .eq('hackathon_id', hackathonId)
        .eq('user_id', userId)
        .single();

      if (existing) {
        return res.status(400).json({ success: false, message: 'Already registered for this hackathon' });
      }

      // Check hackathon capacity (reuse hackathon data from above)
      let status = 'confirmed';
      if (hackathon?.max_participants && hackathon.registrations_count >= hackathon.max_participants) {
        status = 'waitlist';
      }

      // Create registration
      const { data, error } = await supabaseAdmin
        .from('hackathon_registrations')
        .insert({
          hackathon_id: hackathonId,
          user_id: userId,
          username: profile?.username || userData.user.email?.split('@')[0],
          email: profile?.email || userData.user.email,
          full_name: profile?.full_name || registrationData.full_name,
          registration_type: 'individual',
          status,
          ...registrationData
        })
        .select()
        .single();

      if (error) throw error;

      // Update registration count
      await supabaseAdmin.rpc('increment', {
        table_name: 'organizer_hackathons',
        row_id: hackathonId,
        column_name: 'registrations_count'
      });

      // Send confirmation email
      if (hackathon) {
        const { data: hackathonDetails } = await supabaseAdmin
          .from('organizer_hackathons')
          .select('hackathon_name, slug, start_date, end_date')
          .eq('id', hackathonId)
          .single();

        if (hackathonDetails) {
          sendRegistrationConfirmation({
            email: profile?.email || userData.user.email!,
            userName: profile?.full_name || profile?.username || 'there',
            hackathonName: hackathonDetails.hackathon_name,
            hackathonSlug: hackathonDetails.slug,
            registrationNumber: data.registration_number,
            registrationType: 'individual',
            startDate: hackathonDetails.start_date,
            endDate: hackathonDetails.end_date,
          }).catch(err => console.error('Email send failed:', err));
        }
      }

      return res.json({ success: true, data, status });
    } catch (error: any) {
      console.error('Registration error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get user's registration for a hackathon
  app.get("/api/hackathons/:hackathonId/my-registration", async (req, res) => {
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

      const { data, error } = await supabaseAdmin
        .from('hackathon_registrations')
        .select('*, team:hackathon_teams(*)')
        .eq('hackathon_id', hackathonId)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return res.json({ success: true, data: data || null });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Cancel registration
  app.delete("/api/hackathons/:hackathonId/register", async (req, res) => {
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

      const { error } = await supabaseAdmin
        .from('hackathon_registrations')
        .delete()
        .eq('hackathon_id', hackathonId)
        .eq('user_id', userId);

      if (error) throw error;

      return res.json({ success: true });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // ============================================
  // TEAM ENDPOINTS
  // ============================================

  // Create team
  app.post("/api/hackathons/:hackathonId/teams", async (req, res) => {
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
      const { team_name } = req.body;

      // Create team
      const { data: team, error: teamError } = await supabaseAdmin
        .from('hackathon_teams')
        .insert({
          hackathon_id: hackathonId,
          team_name,
          team_leader_id: userId
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Update user's registration to link to team
      await supabaseAdmin
        .from('hackathon_registrations')
        .update({
          registration_type: 'team',
          team_id: team.id
        })
        .eq('hackathon_id', hackathonId)
        .eq('user_id', userId);

      return res.json({ success: true, data: team });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Join team with code
  app.post("/api/hackathons/:hackathonId/teams/join", async (req, res) => {
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
      const { team_code } = req.body;

      // Find team
      const { data: team, error: teamError } = await supabaseAdmin
        .from('hackathon_teams')
        .select('*')
        .eq('team_code', team_code)
        .eq('hackathon_id', hackathonId)
        .single();

      if (teamError || !team) {
        return res.status(404).json({ success: false, message: 'Team not found' });
      }

      // Check team size
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('team_size_max')
        .eq('id', hackathonId)
        .single();

      const { count } = await supabaseAdmin
        .from('hackathon_registrations')
        .select('*', { count: 'exact', head: true })
        .eq('team_id', team.id);

      if (hackathon?.team_size_max && count && count >= hackathon.team_size_max) {
        return res.status(400).json({ success: false, message: 'Team is full' });
      }

      // Update registration
      const { error: updateError } = await supabaseAdmin
        .from('hackathon_registrations')
        .update({
          registration_type: 'team',
          team_id: team.id
        })
        .eq('hackathon_id', hackathonId)
        .eq('user_id', userId);

      if (updateError) throw updateError;

      return res.json({ success: true, data: team });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get team details
  app.get("/api/teams/:teamId", async (req, res) => {
    try {
      const { teamId } = req.params;

      const { data: team, error } = await supabaseAdmin
        .from('hackathon_teams')
        .select(`
          *,
          members:hackathon_registrations(*)
        `)
        .eq('id', teamId)
        .single();

      if (error) throw error;

      return res.json({ success: true, data: team });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Leave team
  app.post("/api/teams/:teamId/leave", async (req, res) => {
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

      const { teamId } = req.params;

      // Check if user is team leader
      const { data: team } = await supabaseAdmin
        .from('hackathon_teams')
        .select('team_leader_id')
        .eq('id', teamId)
        .single();

      if (team?.team_leader_id === userId) {
        return res.status(400).json({ success: false, message: 'Team leader cannot leave. Transfer leadership or disband team.' });
      }

      // Remove from team
      await supabaseAdmin
        .from('hackathon_registrations')
        .update({
          registration_type: 'individual',
          team_id: null
        })
        .eq('team_id', teamId)
        .eq('user_id', userId);

      return res.json({ success: true });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // ============================================
  // ORGANIZER ENDPOINTS
  // ============================================

  // Get all registrations for hackathon
  app.get("/api/organizer/hackathons/:hackathonId/registrations", async (req, res) => {
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
        .select('organizer_id')
        .eq('id', hackathonId)
        .single();

      if (hackathon?.organizer_id !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      const { data, error } = await supabaseAdmin
        .from('hackathon_registrations')
        .select('*, team:hackathon_teams(*)')
        .eq('hackathon_id', hackathonId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get all teams for hackathon
  app.get("/api/organizer/hackathons/:hackathonId/teams", async (req, res) => {
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
        .select('organizer_id')
        .eq('id', hackathonId)
        .single();

      if (hackathon?.organizer_id !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      const { data, error } = await supabaseAdmin
        .from('hackathon_teams')
        .select(`
          *,
          members:hackathon_registrations(count)
        `)
        .eq('hackathon_id', hackathonId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Check-in participant
  app.post("/api/organizer/registrations/:registrationId/check-in", async (req, res) => {
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

      const { registrationId } = req.params;

      // Get registration and verify ownership
      const { data: registration } = await supabaseAdmin
        .from('hackathon_registrations')
        .select('hackathon_id')
        .eq('id', registrationId)
        .single();

      if (!registration) {
        return res.status(404).json({ success: false, message: 'Registration not found' });
      }

      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('organizer_id')
        .eq('id', registration.hackathon_id)
        .single();

      if (hackathon?.organizer_id !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      // Update status to checked_in
      const { error } = await supabaseAdmin
        .from('hackathon_registrations')
        .update({
          status: 'checked_in',
          checked_in_at: new Date().toISOString()
        })
        .eq('id', registrationId);

      if (error) throw error;

      return res.json({ success: true });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // ============================================
  // TEAM INVITATION ENDPOINTS
  // ============================================

  // Send team invitation
  app.post("/api/teams/:teamId/invite", async (req, res) => {
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

      const { teamId } = req.params;
      const { email } = req.body;

      // Verify team membership
      const { data: team } = await supabaseAdmin
        .from('hackathon_teams')
        .select('*')
        .eq('id', teamId)
        .single();

      if (!team) {
        return res.status(404).json({ success: false, message: 'Team not found' });
      }

      // Check if user is team leader or member
      const { data: membership } = await supabaseAdmin
        .from('hackathon_registrations')
        .select('*')
        .eq('team_id', teamId)
        .eq('user_id', userId)
        .single();

      if (!membership && team.team_leader_id !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      // Create invitation
      const { data, error } = await supabaseAdmin
        .from('hackathon_team_invitations')
        .insert({
          team_id: teamId,
          hackathon_id: team.hackathon_id,
          invited_by_user_id: userId,
          invited_email: email,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        })
        .select()
        .single();

      if (error) throw error;

      // TODO: Send email notification

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Remove team member
  app.delete("/api/teams/:teamId/members/:memberId", async (req, res) => {
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

      const { teamId, memberId } = req.params;

      // Verify team leadership
      const { data: team } = await supabaseAdmin
        .from('hackathon_teams')
        .select('team_leader_id')
        .eq('id', teamId)
        .single();

      if (team?.team_leader_id !== userId) {
        return res.status(403).json({ success: false, message: 'Only team leader can remove members' });
      }

      // Remove member
      const { error } = await supabaseAdmin
        .from('hackathon_registrations')
        .update({
          registration_type: 'individual',
          team_id: null
        })
        .eq('id', memberId);

      if (error) throw error;

      return res.json({ success: true });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get participant's hackathons
  app.get("/api/participant/hackathons", async (req, res) => {
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

      // Get all hackathons user is registered for
      const { data, error } = await supabaseAdmin
        .from('hackathon_registrations')
        .select(`
          *,
          hackathon:organizer_hackathons(
            id,
            hackathon_name,
            slug,
            cover_image,
            start_date,
            end_date,
            format,
            hackathon_status
          ),
          team:hackathon_teams(
            id,
            team_name,
            team_code
          )
        `)
        .eq('user_id', userId)
        .in('status', ['confirmed', 'checked_in', 'waitlist'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Enrich with submission status
      const enrichedData = await Promise.all((data || []).map(async (registration: any) => {
        const { data: submission } = await supabaseAdmin
          .from('hackathon_submissions')
          .select('id, status, project_name, submitted_at')
          .eq('hackathon_id', registration.hackathon_id)
          .eq('user_id', userId)
          .single();

        return {
          ...registration,
          has_submitted: !!submission,
          submission
        };
      }));

      return res.json({ success: true, data: enrichedData });
    } catch (error: any) {
      console.error('Get participant hackathons error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Submit project for hackathon
  app.post("/api/hackathons/:hackathonId/submit", async (req, res) => {
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
      const submissionData = req.body;

      // Check if hackathon exists and submissions are open
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('submission_opens_at, submission_closes_at, status, start_date, end_date')
        .eq('id', hackathonId)
        .single();

      if (!hackathon) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      if (hackathon.status !== 'published') {
        return res.status(403).json({ success: false, message: 'Hackathon is not published' });
      }

      const now = new Date();
      
      // Check if submissions are closed
      if (hackathon.submission_closes_at && new Date(hackathon.submission_closes_at) < now) {
        return res.status(403).json({ success: false, message: 'Submissions are closed for this hackathon' });
      }

      // Check if submissions haven't opened yet
      if (hackathon.submission_opens_at && new Date(hackathon.submission_opens_at) > now) {
        return res.status(403).json({ success: false, message: 'Submissions have not opened yet' });
      }

      // Check if user is registered
      const { data: registration } = await supabaseAdmin
        .from('hackathon_registrations')
        .select('id, team_id')
        .eq('hackathon_id', hackathonId)
        .eq('user_id', userId)
        .single();

      if (!registration) {
        return res.status(403).json({ success: false, message: 'You must be registered to submit' });
      }

      // Upsert submission
      const { data, error } = await supabaseAdmin
        .from('submissions')
        .upsert({
          hackathon_id: parseInt(hackathonId),
          user_id: userId,
          team_id: registration.team_id,
          project_name: submissionData.project_name,
          tagline: submissionData.tagline,
          description: submissionData.description,
          track: submissionData.track,
          github_repo: submissionData.github_repo,
          demo_url: submissionData.demo_url,
          video_url: submissionData.video_url,
          presentation_url: submissionData.presentation_url,
          technologies_used: submissionData.technologies_used,
          logo_url: submissionData.logo_url,
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'hackathon_id,user_id'
        })
        .select()
        .single();

      if (error) {
        console.error('Submission error:', error);
        throw error;
      }

      return res.json({ success: true, data });
    } catch (error: any) {
      console.error('Submit error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get user's submission for a hackathon
  app.get("/api/hackathons/:hackathonId/my-submission", async (req, res) => {
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

      const { data, error } = await supabaseAdmin
        .from('submissions')
        .select('*')
        .eq('hackathon_id', hackathonId)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        throw error;
      }

      return res.json({ success: true, data: data || null });
    } catch (error: any) {
      console.error('Get submission error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });
}
