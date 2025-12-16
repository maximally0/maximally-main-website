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

      // Enforce: can only unregister while registration phase is open
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('registration_opens_at, registration_closes_at, start_date, status')
        .eq('id', hackathonId)
        .single();

      if (!hackathon || hackathon.status !== 'published') {
        return res.status(400).json({ success: false, message: 'Hackathon is not available for unregistration' });
      }

      const now = new Date();
      const registrationClosesAt = hackathon.registration_closes_at ? new Date(hackathon.registration_closes_at) : null;
      const startDate = hackathon.start_date ? new Date(hackathon.start_date) : null;

      // If registration_closes_at is set, use it; otherwise fall back to start_date
      const registrationEnded = registrationClosesAt
        ? now >= registrationClosesAt
        : (startDate ? now >= startDate : false);

      if (registrationEnded) {
        return res.status(400).json({
          success: false,
          message: 'Registration phase has ended. You cannot unregister after the hackathon has started.'
        });
      }

      // If user is team leader, require disbanding team first to avoid orphan teams
      if (registration.team_id) {
        const { data: team } = await supabaseAdmin
          .from('hackathon_teams')
          .select('team_leader_id')
          .eq('id', registration.team_id)
          .single();

        if (team?.team_leader_id === userId) {
          return res.status(400).json({
            success: false,
            message: 'Team leader cannot unregister directly. Please disband your team first.'
          });
        }
      }

      // Delete registration
      const { error } = await supabaseAdmin
        .from('hackathon_registrations')
        .delete()
        .eq('id', registration.id);

      if (error) throw error;

      // Decrement registration count
      const { data: hackathonData } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('registrations_count')
        .eq('id', hackathonId)
        .single();

      if (hackathonData) {
        const newCount = Math.max((hackathonData.registrations_count || 0) - 1, 0);
        await supabaseAdmin
          .from('organizer_hackathons')
          .update({ registrations_count: newCount })
          .eq('id', hackathonId);
      }

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
        .select('registration_opens_at, registration_closes_at, status, registration_control, building_control')
        .eq('id', hackathonId)
        .single();

      if (!hackathon) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      if (hackathon.status !== 'published') {
        return res.status(403).json({ success: false, message: 'Hackathon is not published' });
      }

      const now = new Date();
      const regControl = hackathon.registration_control || 'auto';
      const buildControl = hackathon.building_control || 'auto';
      
      // Check period controls first
      if (regControl === 'closed') {
        return res.status(403).json({ success: false, message: 'Registrations are closed for this hackathon' });
      }
      
      if (buildControl === 'open') {
        return res.status(403).json({ success: false, message: 'Registrations are closed during the building phase' });
      }
      
      // If registration is force open, skip timeline checks
      if (regControl !== 'open') {
        // Check if registrations are closed by timeline
        if (hackathon.registration_closes_at && new Date(hackathon.registration_closes_at) < now) {
          return res.status(403).json({ success: false, message: 'Registrations are closed for this hackathon' });
        }

        // Check if registrations haven't opened yet
        if (hackathon.registration_opens_at && new Date(hackathon.registration_opens_at) > now) {
          return res.status(403).json({ success: false, message: 'Registrations have not opened yet' });
        }
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
          registration_type: registrationData.registration_type || 'individual',
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


  // ============================================
  // TEAM ENDPOINTS
  // ============================================

  // Test endpoint to debug team creation
  app.post("/api/hackathons/:hackathonId/teams/test", async (req, res) => {
    try {
      console.log('🧪 [TEST] Test endpoint hit');
      return res.json({ success: true, message: 'Test endpoint working' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Debug endpoint for join requests
  app.post("/api/hackathons/:hackathonId/teams/join-debug", async (req, res) => {
    try {
      console.log('🐛 [DEBUG JOIN] Debug join endpoint hit');
      console.log('🐛 [DEBUG JOIN] Request body:', req.body);
      console.log('🐛 [DEBUG JOIN] Headers:', req.headers);
      return res.json({ 
        success: true, 
        message: 'Debug endpoint working',
        received: {
          body: req.body,
          params: req.params,
          method: req.method
        }
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Create team
  app.post("/api/hackathons/:hackathonId/teams", async (req, res) => {
    try {
      console.log('🏗️ [TEAM CREATE] Starting team creation request');
      console.log('Request body:', req.body);
      console.log('Hackathon ID:', req.params.hackathonId);

      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        console.log('❌ [TEAM CREATE] No auth header');
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId) {
        console.log('❌ [TEAM CREATE] Invalid token');
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      console.log('✅ [TEAM CREATE] User authenticated:', userId);

      const { hackathonId } = req.params;
      const { team_name } = req.body;

      if (!team_name || !String(team_name).trim()) {
        console.log('❌ [TEAM CREATE] Team name is required');
        return res.status(400).json({ success: false, message: 'Team name is required' });
      }

      console.log('✅ [TEAM CREATE] Team name:', team_name);

      // Must be registered to create a team
      console.log('🔍 [TEAM CREATE] Checking registration...');
      const { data: registration, error: regError } = await supabaseAdmin
        .from('hackathon_registrations')
        .select('id, team_id')
        .eq('hackathon_id', hackathonId)
        .eq('user_id', userId)
        .single();

      if (regError) {
        console.log('❌ [TEAM CREATE] Registration error:', regError);
        return res.status(403).json({ success: false, message: 'You must be registered to create a team' });
      }

      if (!registration) {
        console.log('❌ [TEAM CREATE] No registration found');
        return res.status(403).json({ success: false, message: 'You must be registered to create a team' });
      }

      console.log('✅ [TEAM CREATE] Registration found:', registration);

      if (registration.team_id) {
        console.log('❌ [TEAM CREATE] User already in team:', registration.team_id);
        return res.status(400).json({ success: false, message: 'You are already in a team' });
      }

      // Generate simple team code
      const teamCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // Try bypassing the issue by creating team without team_code first
      console.log('🏗️ [TEAM CREATE] Creating team without team_code');
      console.log('User ID:', userId, 'Type:', typeof userId);
      console.log('Hackathon ID:', hackathonId, 'Parsed:', parseInt(hackathonId));
      
      // First, create team without team_code (since it's causing the ambiguous reference)
      const { data: team, error: teamError } = await supabaseAdmin
        .from('hackathon_teams')
        .insert({
          hackathon_id: parseInt(hackathonId),
          team_name: String(team_name).trim(),
          team_leader_id: String(userId),
          team_code: Math.random().toString(36).substring(2, 8).toUpperCase()
        });

      if (teamError) {
        console.log('❌ [TEAM CREATE] Team creation error:', teamError);
        throw teamError;
      }

      console.log('✅ [TEAM CREATE] Team created successfully');
      
      // Get the created team data separately
      const { data: createdTeam, error: fetchError } = await supabaseAdmin
        .from('hackathon_teams')
        .select('id, team_name, hackathon_id, team_leader_id, team_code, created_at')
        .eq('team_leader_id', userId)
        .eq('hackathon_id', parseInt(hackathonId))
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError) {
        console.log('❌ [TEAM CREATE] Error fetching created team:', fetchError);
        throw fetchError;
      }

      console.log('✅ [TEAM CREATE] Team data fetched:', createdTeam);

      // Update user's registration to link to team
      console.log('🔗 [TEAM CREATE] Linking registration to team...');
      const { error: updateError } = await supabaseAdmin
        .from('hackathon_registrations')
        .update({
          registration_type: 'team',
          team_id: createdTeam.id
        })
        .eq('hackathon_id', hackathonId)
        .eq('user_id', userId);

      if (updateError) {
        console.log('❌ [TEAM CREATE] Registration update error:', updateError);
        throw updateError;
      }

      console.log('✅ [TEAM CREATE] Team creation successful!');
      return res.json({ 
        success: true, 
        data: createdTeam
      });
    } catch (error: any) {
      console.log('💥 [TEAM CREATE] Fatal error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Join team with code
  app.post("/api/hackathons/:hackathonId/teams/join", async (req, res) => {
    try {
      console.log('🔗 [TEAM JOIN] Join team request received');
      console.log('🔗 [TEAM JOIN] Request method:', req.method);
      console.log('🔗 [TEAM JOIN] Request URL:', req.url);
      console.log('🔗 [TEAM JOIN] Request headers:', req.headers);
      console.log('🔗 [TEAM JOIN] Request body:', req.body);
      console.log('🔗 [TEAM JOIN] Hackathon ID from params:', req.params.hackathonId);
      
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        console.log('❌ [TEAM JOIN] No auth header');
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId) {
        console.log('❌ [TEAM JOIN] Invalid token');
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      console.log('✅ [TEAM JOIN] User authenticated:', userId);

      const { hackathonId } = req.params;
      const { team_code } = req.body;

      console.log('🔗 [TEAM JOIN] Extracted data - hackathonId:', hackathonId, 'team_code:', team_code);

      if (!team_code || String(team_code).trim().length < 4) {
        console.log('❌ [TEAM JOIN] Invalid team code:', team_code);
        return res.status(400).json({ success: false, message: 'Invalid team code' });
      }

      // Must be registered to join a team
      const { data: registration, error: regError } = await supabaseAdmin
        .from('hackathon_registrations')
        .select('id, team_id')
        .eq('hackathon_id', hackathonId)
        .eq('user_id', userId)
        .single();

      if (regError || !registration) {
        return res.status(403).json({ success: false, message: 'You must be registered to join a team' });
      }

      if (registration.team_id) {
        return res.status(400).json({ success: false, message: 'You are already in a team' });
      }

      // Find team
      const normalizedCode = String(team_code).trim().toUpperCase();
      const { data: team, error: teamError } = await supabaseAdmin
        .from('hackathon_teams')
        .select('*')
        .eq('team_code', normalizedCode)
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

      if (!team) {
        return res.status(404).json({ success: false, message: 'Team not found' });
      }

      if (team.team_leader_id === userId) {
        return res.status(400).json({ success: false, message: 'Team leader cannot leave. Disband the team instead.' });
      }

      // Remove from team
      const { error } = await supabaseAdmin
        .from('hackathon_registrations')
        .update({
          registration_type: 'individual',
          team_id: null
        })
        .eq('team_id', teamId)
        .eq('user_id', userId);

      if (error) throw error;

      return res.json({ success: true });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Disband team (leader only)
  app.post("/api/teams/:teamId/disband", async (req, res) => {
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

      const { data: team, error: teamError } = await supabaseAdmin
        .from('hackathon_teams')
        .select('id, team_leader_id')
        .eq('id', teamId)
        .single();

      if (teamError || !team) {
        return res.status(404).json({ success: false, message: 'Team not found' });
      }

      if (team.team_leader_id !== userId) {
        return res.status(403).json({ success: false, message: 'Only the team leader can disband the team' });
      }

      // Detach all members
      const { error: detachError } = await supabaseAdmin
        .from('hackathon_registrations')
        .update({ registration_type: 'individual', team_id: null })
        .eq('team_id', teamId);

      if (detachError) throw detachError;

      // Delete pending invitations (best effort)
      await supabaseAdmin
        .from('hackathon_team_invitations')
        .delete()
        .eq('team_id', teamId);

      // Delete team
      const { error: deleteTeamError } = await supabaseAdmin
        .from('hackathon_teams')
        .delete()
        .eq('id', teamId);

      if (deleteTeamError) throw deleteTeamError;

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

  // Unregister participant (organizer action)
  app.post("/api/organizer/registrations/:registrationId/unregister", async (req, res) => {
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
        .select('hackathon_id, team_id, user_id')
        .eq('id', registrationId)
        .single();

      if (!registration) {
        return res.status(404).json({ success: false, message: 'Registration not found' });
      }

      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('organizer_id, registrations_count')
        .eq('id', registration.hackathon_id)
        .single();

      if (hackathon?.organizer_id !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      // If user is in a team, remove them from the team first
      if (registration.team_id) {
        // Check if they're the team leader
        const { data: team } = await supabaseAdmin
          .from('hackathon_teams')
          .select('team_leader_id')
          .eq('id', registration.team_id)
          .single();

        if (team?.team_leader_id === registration.user_id) {
          // If team leader, disband the team
          await supabaseAdmin
            .from('hackathon_registrations')
            .update({ team_id: null, registration_type: 'individual' })
            .eq('team_id', registration.team_id);

          await supabaseAdmin
            .from('hackathon_teams')
            .delete()
            .eq('id', registration.team_id);
        }
      }

      // Delete the registration
      const { error } = await supabaseAdmin
        .from('hackathon_registrations')
        .delete()
        .eq('id', registrationId);

      if (error) throw error;

      // Decrement registration count
      if (hackathon?.registrations_count && hackathon.registrations_count > 0) {
        await supabaseAdmin
          .from('organizer_hackathons')
          .update({ registrations_count: hackathon.registrations_count - 1 })
          .eq('id', registration.hackathon_id);
      }

      return res.json({ success: true, message: 'Participant unregistered' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Block user from hackathon (organizer action)
  app.post("/api/organizer/hackathons/:hackathonId/block-user", async (req, res) => {
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
      const { user_id, registration_id } = req.body;

      if (!user_id) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
      }

      // Verify ownership
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('organizer_id, registrations_count')
        .eq('id', hackathonId)
        .single();

      if (hackathon?.organizer_id !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      // Get registration if exists
      const { data: registration } = await supabaseAdmin
        .from('hackathon_registrations')
        .select('id, team_id')
        .eq('hackathon_id', hackathonId)
        .eq('user_id', user_id)
        .single();

      // If user has a registration, handle team and delete it
      if (registration) {
        if (registration.team_id) {
          const { data: team } = await supabaseAdmin
            .from('hackathon_teams')
            .select('team_leader_id')
            .eq('id', registration.team_id)
            .single();

          if (team?.team_leader_id === user_id) {
            // Disband team if they're the leader
            await supabaseAdmin
              .from('hackathon_registrations')
              .update({ team_id: null, registration_type: 'individual' })
              .eq('team_id', registration.team_id);

            await supabaseAdmin
              .from('hackathon_teams')
              .delete()
              .eq('id', registration.team_id);
          } else {
            // Just remove from team
            await supabaseAdmin
              .from('hackathon_registrations')
              .update({ team_id: null, registration_type: 'individual' })
              .eq('id', registration.id);
          }
        }

        // Delete registration
        await supabaseAdmin
          .from('hackathon_registrations')
          .delete()
          .eq('id', registration.id);

        // Decrement count
        if (hackathon?.registrations_count && hackathon.registrations_count > 0) {
          await supabaseAdmin
            .from('organizer_hackathons')
            .update({ registrations_count: hackathon.registrations_count - 1 })
            .eq('id', hackathonId);
        }
      }

      // Add to blocked users list (we'll create a simple blocked_users table or use metadata)
      // For now, we'll store blocked users in a JSON field or create a simple tracking mechanism
      // Using hackathon_registration_tags as a workaround or creating a note
      
      // Create a blocked user record (using registration_notes as a simple solution)
      // In production, you'd want a dedicated blocked_users table
      const { error: blockError } = await supabaseAdmin
        .from('hackathon_registration_notes')
        .insert({
          registration_id: registration_id || 0,
          note_text: `BLOCKED_USER:${user_id}`,
          created_by: userId
        });

      // Note: For a proper implementation, create a hackathon_blocked_users table
      // This is a temporary solution

      return res.json({ success: true, message: 'User blocked from hackathon' });
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
  // Rules enforced:
  // - Submissions only allowed during submission window
  // - One submission per solo participant OR per team
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
      const submissionData = req.body || {};
      const desiredStatus = submissionData.status === 'submitted' ? 'submitted' : 'draft';

      // Check if hackathon exists and submissions are open
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('submission_opens_at, submission_closes_at, status, submission_control, building_control')
        .eq('id', hackathonId)
        .single();

      if (!hackathon) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      if (hackathon.status !== 'published') {
        return res.status(403).json({ success: false, message: 'Hackathon is not published' });
      }

      const now = new Date();
      const subControl = hackathon.submission_control || 'auto';
      const buildControl = hackathon.building_control || 'auto';
      
      // Check period controls first
      if (subControl === 'closed') {
        return res.status(403).json({ success: false, message: 'Submissions are closed for this hackathon' });
      }
      
      // If building phase is force active and submission is not force open, block submissions
      if (buildControl === 'open' && subControl !== 'open') {
        return res.status(403).json({ success: false, message: 'Submissions are not allowed during the building phase' });
      }
      
      // If submission is force open, skip timeline checks
      if (subControl !== 'open') {
        // Check if submissions are closed by timeline
        if (hackathon.submission_closes_at && new Date(hackathon.submission_closes_at) < now) {
          return res.status(403).json({ success: false, message: 'Submissions are closed for this hackathon' });
        }

        // Check if submissions haven't opened yet
        if (hackathon.submission_opens_at && new Date(hackathon.submission_opens_at) > now) {
          return res.status(403).json({ success: false, message: 'Submissions have not opened yet' });
        }
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

      // If team submission, enforce only team leader can submit and one submission per team
      if (registration.team_id) {
        const { data: team } = await supabaseAdmin
          .from('hackathon_teams')
          .select('team_leader_id')
          .eq('id', registration.team_id)
          .single();

        if (team?.team_leader_id !== userId) {
          return res.status(403).json({
            success: false,
            message: 'Only the team leader can submit or edit the team submission.'
          });
        }

        const { data: existing } = await supabaseAdmin
          .from('hackathon_submissions')
          .select('id')
          .eq('hackathon_id', hackathonId)
          .eq('team_id', registration.team_id)
          .single();

        if (existing) {
          const { data, error } = await supabaseAdmin
            .from('hackathon_submissions')
            .update({
              ...submissionData,
              status: desiredStatus,
              submitted_at: desiredStatus === 'submitted' ? new Date().toISOString() : null,
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id)
            .select()
            .single();

          if (error) throw error;
          return res.json({ success: true, data });
        }

        const { data, error } = await supabaseAdmin
          .from('hackathon_submissions')
          .insert({
            hackathon_id: hackathonId,
            user_id: userId,
            team_id: registration.team_id,
            ...submissionData,
            status: desiredStatus,
            submitted_at: desiredStatus === 'submitted' ? new Date().toISOString() : null
          })
          .select()
          .single();

        if (error) throw error;
        return res.json({ success: true, data });
      }

      // Solo submission: one per user per hackathon
      const { data: existing } = await supabaseAdmin
        .from('hackathon_submissions')
        .select('id')
        .eq('hackathon_id', hackathonId)
        .eq('user_id', userId)
        .single();

      if (existing) {
        const { data, error } = await supabaseAdmin
          .from('hackathon_submissions')
          .update({
            ...submissionData,
            status: desiredStatus,
            submitted_at: desiredStatus === 'submitted' ? new Date().toISOString() : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return res.json({ success: true, data });
      }

      const { data, error } = await supabaseAdmin
        .from('hackathon_submissions')
        .insert({
          hackathon_id: hackathonId,
          user_id: userId,
          team_id: null,
          ...submissionData,
          status: desiredStatus,
          submitted_at: desiredStatus === 'submitted' ? new Date().toISOString() : null
        })
        .select()
        .single();

      if (error) throw error;

      return res.json({ success: true, data });
    } catch (error: any) {
      console.error('Submit error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get user's submission for a hackathon
  // - If user is in a team, returns the team submission (one per team)
  // - Otherwise returns the user's solo submission
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

      // Determine if user is in a team for this hackathon
      const { data: registration } = await supabaseAdmin
        .from('hackathon_registrations')
        .select('team_id')
        .eq('hackathon_id', hackathonId)
        .eq('user_id', userId)
        .single();

      let query = supabaseAdmin
        .from('hackathon_submissions')
        .select('*')
        .eq('hackathon_id', hackathonId);

      if (registration?.team_id) {
        query = query.eq('team_id', registration.team_id);
      } else {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query.single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        throw error;
      }

      return res.json({ success: true, data: data || null });
    } catch (error: any) {
      console.error('Get submission error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get participant-specific announcements for a hackathon
  app.get("/api/hackathons/:hackathonId/participant-announcements", async (req, res) => {
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

      // Get user's registration details
      const { data: registration, error: regError } = await supabaseAdmin
        .from('hackathon_registrations')
        .select('status, registration_type')
        .eq('hackathon_id', hackathonId)
        .eq('user_id', userId)
        .single();

      if (regError || !registration) {
        return res.status(403).json({ success: false, message: 'You must be registered for this hackathon to view announcements' });
      }

      // Build the target audience filter based on user's registration
      const allowedAudiences = ['public']; // Always include public announcements

      // Add specific audiences based on registration status and type
      allowedAudiences.push('all'); // All participants
      
      if (registration.status === 'confirmed') {
        allowedAudiences.push('confirmed');
      }
      
      if (registration.status === 'waitlist') {
        allowedAudiences.push('waitlist');
      }
      
      if (registration.registration_type === 'team') {
        allowedAudiences.push('teams');
      }
      
      if (registration.registration_type === 'individual') {
        allowedAudiences.push('individuals');
      }

      // Fetch announcements that match the user's allowed audiences
      const { data: announcements, error } = await supabaseAdmin
        .from('hackathon_announcements')
        .select('id, title, content, announcement_type, target_audience, created_at, published_at, updated_at')
        .eq('hackathon_id', hackathonId)
        .eq('is_published', true)
        .in('target_audience', allowedAudiences)
        .order('published_at', { ascending: false });

      if (error) throw error;

      return res.json({ 
        success: true, 
        data: announcements || [],
        user_status: {
          registration_status: registration.status,
          registration_type: registration.registration_type,
          allowed_audiences: allowedAudiences
        }
      });
    } catch (error: any) {
      console.error('Get participant announcements error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });
}
