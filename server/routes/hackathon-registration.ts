// @ts-nocheck
import type { Express } from "express";
import { createClient } from "@supabase/supabase-js";
import crypto from 'crypto';
import { 
  sendRegistrationConfirmation, 
  sendTeamCreatedEmail, 
  sendTeamJoinedEmail,
  sendTeamInvitationEmail,
  sendRegistrationMilestoneEmail
} from "../services/email";

// Milestone thresholds for registration notifications
const REGISTRATION_MILESTONES = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000];

// Helper to check if a milestone was just reached
function checkMilestone(previousCount: number, newCount: number): number | null {
  for (const milestone of REGISTRATION_MILESTONES) {
    if (previousCount < milestone && newCount >= milestone) {
      return milestone;
    }
  }
  return null;
}

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

      // Enforce: can only unregister while hackathon is live (before end_date)
      // Simplified: Registration is available when hackathon is published and end_date hasn't passed
      // Requirements: 3.1, 3.2, 3.3, 4.1
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('end_date, status')
        .eq('id', hackathonId)
        .single();

      if (!hackathon || hackathon.status !== 'published') {
        return res.status(400).json({ success: false, message: 'Hackathon is not available for unregistration' });
      }

      const now = new Date();
      const endDate = hackathon.end_date ? new Date(hackathon.end_date) : null;

      // Cannot unregister after hackathon has ended
      if (endDate && now >= endDate) {
        return res.status(400).json({
          success: false,
          message: 'Cannot unregister after the hackathon has ended.'
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
      // Simplified: Registration is available when hackathon is published and end_date hasn't passed
      // Requirements: 3.1, 3.2, 3.3, 4.1
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('status, end_date')
        .eq('id', hackathonId)
        .single();

      if (!hackathon) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      if (hackathon.status !== 'published') {
        return res.status(403).json({ success: false, message: 'Hackathon is not published' });
      }

      const now = new Date();
      const endDate = hackathon.end_date ? new Date(hackathon.end_date) : null;
      
      // Registration closes when hackathon ends (end_date passes)
      if (endDate && now > endDate) {
        return res.status(403).json({ success: false, message: 'Registrations are closed - hackathon has ended' });
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

      // Update registration count and check for milestones
      const { data: hackathonData } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('registrations_count, hackathon_name, slug, organizer_id')
        .eq('id', hackathonId)
        .single();

      const previousCount = hackathonData?.registrations_count || 0;

      await supabaseAdmin.rpc('increment', {
        table_name: 'organizer_hackathons',
        row_id: hackathonId,
        column_name: 'registrations_count'
      });

      const newCount = previousCount + 1;

      // Check if a milestone was reached
      const milestone = checkMilestone(previousCount, newCount);
      if (milestone && hackathonData) {
        // Get organizer details
        const { data: organizerProfile } = await supabaseAdmin
          .from('profiles')
          .select('full_name, username, email')
          .eq('id', hackathonData.organizer_id)
          .single();

        if (organizerProfile?.email) {
          sendRegistrationMilestoneEmail({
            email: organizerProfile.email,
            organizerName: organizerProfile.full_name || organizerProfile.username || 'Organizer',
            hackathonName: hackathonData.hackathon_name,
            hackathonSlug: hackathonData.slug,
            milestone: milestone,
            totalRegistrations: newCount,
          }).catch(err => console.error('Milestone email failed:', err));
        }
      }

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

      if (!team_name || !String(team_name).trim()) {
        return res.status(400).json({ success: false, message: 'Team name is required' });
      }

      // Must be registered to create a team
      const { data: registration, error: regError } = await supabaseAdmin
        .from('hackathon_registrations')
        .select('id, team_id')
        .eq('hackathon_id', hackathonId)
        .eq('user_id', userId)
        .single();

      if (regError) {
        return res.status(403).json({ success: false, message: 'You must be registered to create a team' });
      }

      if (!registration) {
        return res.status(403).json({ success: false, message: 'You must be registered to create a team' });
      }

      if (registration.team_id) {
        return res.status(400).json({ success: false, message: 'You are already in a team' });
      }

      // Create team with generated code
      const { data: team, error: teamError } = await supabaseAdmin
        .from('hackathon_teams')
        .insert({
          hackathon_id: parseInt(hackathonId),
          team_name: String(team_name).trim(),
          team_leader_id: userId,
          team_code: Math.random().toString(36).substring(2, 8).toUpperCase()
        });

      if (teamError) {
        throw teamError;
      }
      
      // Get the created team data
      const { data: createdTeam, error: fetchError } = await supabaseAdmin
        .from('hackathon_teams')
        .select('id, team_name, hackathon_id, team_leader_id, team_code, created_at')
        .eq('team_leader_id', userId)
        .eq('hackathon_id', parseInt(hackathonId))
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Update user's registration to link to team
      const { error: updateError } = await supabaseAdmin
        .from('hackathon_registrations')
        .update({
          registration_type: 'team',
          team_id: createdTeam.id
        })
        .eq('hackathon_id', hackathonId)
        .eq('user_id', userId);

      if (updateError) {
        throw updateError;
      }

      // Send team created email
      const { data: hackathonDetails } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('hackathon_name, slug')
        .eq('id', hackathonId)
        .single();

      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('email, full_name, username')
        .eq('id', userId)
        .single();

      if (hackathonDetails && profile?.email) {
        sendTeamCreatedEmail({
          email: profile.email,
          userName: profile.full_name || profile.username || 'there',
          hackathonName: hackathonDetails.hackathon_name,
          hackathonSlug: hackathonDetails.slug,
          teamName: createdTeam.team_name,
          teamCode: createdTeam.team_code,
        }).catch(err => console.error('Team created email failed:', err));
      }

      return res.json({ 
        success: true, 
        data: createdTeam
      });
    } catch (error: any) {
      console.error('Team creation error:', error);
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

      if (!team_code || String(team_code).trim().length < 4) {
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

      // Send team joined email
      const { data: hackathonDetails } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('hackathon_name, slug')
        .eq('id', hackathonId)
        .single();

      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('email, full_name, username')
        .eq('id', userId)
        .single();

      const { data: leaderProfile } = await supabaseAdmin
        .from('profiles')
        .select('full_name, username')
        .eq('id', team.team_leader_id)
        .single();

      if (hackathonDetails && profile?.email) {
        sendTeamJoinedEmail({
          email: profile.email,
          userName: profile.full_name || profile.username || 'there',
          hackathonName: hackathonDetails.hackathon_name,
          hackathonSlug: hackathonDetails.slug,
          teamName: team.team_name,
          teamLeaderName: leaderProfile?.full_name || leaderProfile?.username || 'Team Leader',
        }).catch(err => console.error('Team joined email failed:', err));
      }

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

  // Helper function to check if user has access to hackathon (owner or co-organizer)
  async function checkHackathonAccess(
    hackathonId: string | number, 
    userId: string,
    requiredPermission?: string
  ): Promise<{ hasAccess: boolean; isOwner: boolean; role?: string; permissions?: any }> {
    console.log('checkHackathonAccess called:', { hackathonId, userId, requiredPermission });
    
    // Check if user is the owner
    const { data: hackathon, error: hackathonError } = await supabaseAdmin
      .from('organizer_hackathons')
      .select('organizer_id')
      .eq('id', hackathonId)
      .single();

    console.log('Owner check:', { hackathon, hackathonError, isOwner: hackathon?.organizer_id === userId });

    if (hackathon?.organizer_id === userId) {
      return { hasAccess: true, isOwner: true, role: 'owner' };
    }

    // Check if user is a co-organizer
    const { data: coOrg, error: coOrgError } = await supabaseAdmin
      .from('hackathon_organizers')
      .select('role, permissions, status')
      .eq('hackathon_id', hackathonId)
      .eq('user_id', userId)
      .eq('status', 'accepted')
      .single();

    console.log('Co-org check:', { coOrg, coOrgError });

    if (!coOrg) {
      return { hasAccess: false, isOwner: false };
    }

    // Check specific permission if required
    if (requiredPermission && coOrg.permissions) {
      const hasPermission = coOrg.permissions[requiredPermission] === true;
      if (!hasPermission) {
        return { hasAccess: false, isOwner: false, role: coOrg.role, permissions: coOrg.permissions };
      }
    }

    return { hasAccess: true, isOwner: false, role: coOrg.role, permissions: coOrg.permissions };
  }

  // ============================================
  // ORGANIZER ENDPOINTS
  // ============================================

  // Get user's role and permissions for a hackathon
  app.get("/api/organizer/hackathons/:hackathonId/my-role", async (req, res) => {
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

      const access = await checkHackathonAccess(hackathonId, userId);
      
      if (!access.hasAccess) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      // Define role-based permissions
      // Owner: Full control including team management
      // Co-Organizer: Full access except judge management
      // Admin: Manage registrations & submissions
      // Viewer: View-only access to analytics
      let permissions = {
        can_view_registrations: false,
        can_manage_registrations: false,
        can_view_teams: false,
        can_manage_teams: false,
        can_view_submissions: false,
        can_manage_submissions: false,
        can_view_judges: false,
        can_manage_judges: false,
        can_view_announcements: false,
        can_manage_announcements: false,
        can_view_analytics: false,
        can_view_insights: false,
        can_view_feedback: false,
        can_view_winners: false,
        can_manage_winners: false,
        can_view_certificates: false,
        can_manage_certificates: false,
        can_view_settings: false,
        can_manage_settings: false
      };

      if (access.isOwner) {
        // Owner has full access
        permissions = {
          can_view_registrations: true,
          can_manage_registrations: true,
          can_view_teams: true,
          can_manage_teams: true,
          can_view_submissions: true,
          can_manage_submissions: true,
          can_view_judges: true,
          can_manage_judges: true,
          can_view_announcements: true,
          can_manage_announcements: true,
          can_view_analytics: true,
          can_view_insights: true,
          can_view_feedback: true,
          can_view_winners: true,
          can_manage_winners: true,
          can_view_certificates: true,
          can_manage_certificates: true,
          can_view_settings: true,
          can_manage_settings: true
        };
      } else {
        // Role-based permissions for co-organizers
        const role = access.role?.toLowerCase();
        
        switch (role) {
          case 'co-organizer':
            // Full access except judge management
            permissions = {
              can_view_registrations: true,
              can_manage_registrations: true,
              can_view_teams: true,
              can_manage_teams: true,
              can_view_submissions: true,
              can_manage_submissions: true,
              can_view_judges: false,
              can_manage_judges: false,
              can_view_announcements: true,
              can_manage_announcements: true,
              can_view_analytics: true,
              can_view_insights: true,
              can_view_feedback: true,
              can_view_winners: true,
              can_manage_winners: true,
              can_view_certificates: true,
              can_manage_certificates: true,
              can_view_settings: false,
              can_manage_settings: false
            };
            break;
          case 'admin':
            // Manage registrations & submissions only
            permissions = {
              can_view_registrations: true,
              can_manage_registrations: true,
              can_view_teams: false,
              can_manage_teams: false,
              can_view_submissions: true,
              can_manage_submissions: true,
              can_view_judges: false,
              can_manage_judges: false,
              can_view_announcements: false,
              can_manage_announcements: false,
              can_view_analytics: false,
              can_view_insights: false,
              can_view_feedback: false,
              can_view_winners: false,
              can_manage_winners: false,
              can_view_certificates: false,
              can_manage_certificates: false,
              can_view_settings: false,
              can_manage_settings: false
            };
            break;
          case 'viewer':
            // View-only access to analytics
            permissions = {
              can_view_registrations: false,
              can_manage_registrations: false,
              can_view_teams: false,
              can_manage_teams: false,
              can_view_submissions: false,
              can_manage_submissions: false,
              can_view_judges: false,
              can_manage_judges: false,
              can_view_announcements: false,
              can_manage_announcements: false,
              can_view_analytics: true,
              can_view_insights: false,
              can_view_feedback: false,
              can_view_winners: false,
              can_manage_winners: false,
              can_view_certificates: false,
              can_manage_certificates: false,
              can_view_settings: false,
              can_manage_settings: false
            };
            break;
          default:
            // Use stored permissions if available, otherwise no access
            if (access.permissions) {
              permissions = { ...permissions, ...access.permissions };
            }
        }
      }

      return res.json({ 
        success: true, 
        data: {
          isOwner: access.isOwner,
          role: access.role || 'owner',
          permissions
        }
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

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

      // Verify access (owner or co-organizer)
      const access = await checkHackathonAccess(hackathonId, userId);
      console.log('Registrations access check:', { hackathonId, userId, access });
      
      if (!access.hasAccess) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      const { data, error } = await supabaseAdmin
        .from('hackathon_registrations')
        .select('*, team:hackathon_teams(*)')
        .eq('hackathon_id', hackathonId)
        .order('created_at', { ascending: false });

      console.log('Registrations query result:', { count: data?.length, error });

      if (error) throw error;

      return res.json({ success: true, data: data || [] });
    } catch (error: any) {
      console.error('Registrations error:', error);
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

      // Verify access (owner or co-organizer)
      const access = await checkHackathonAccess(hackathonId, userId);
      if (!access.hasAccess) {
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

      // Get registration
      const { data: registration } = await supabaseAdmin
        .from('hackathon_registrations')
        .select('hackathon_id')
        .eq('id', registrationId)
        .single();

      if (!registration) {
        return res.status(404).json({ success: false, message: 'Registration not found' });
      }

      // Verify access (owner or co-organizer with can_manage_registrations)
      const access = await checkHackathonAccess(registration.hackathon_id, userId, 'can_manage_registrations');
      if (!access.hasAccess) {
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

      // Get registration
      const { data: registration } = await supabaseAdmin
        .from('hackathon_registrations')
        .select('hackathon_id, team_id, user_id')
        .eq('id', registrationId)
        .single();

      if (!registration) {
        return res.status(404).json({ success: false, message: 'Registration not found' });
      }

      // Verify access (owner or co-organizer with can_manage_registrations)
      const access = await checkHackathonAccess(registration.hackathon_id, userId, 'can_manage_registrations');
      if (!access.hasAccess) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      // Get hackathon for registration count
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('registrations_count')
        .eq('id', registration.hackathon_id)
        .single();

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

      // Verify access (owner or co-organizer with can_manage_registrations)
      const access = await checkHackathonAccess(hackathonId, userId, 'can_manage_registrations');
      if (!access.hasAccess) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      // Get hackathon for registration count
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('registrations_count')
        .eq('id', hackathonId)
        .single();

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

      // Use team code as the invite token (it's already unique)
      const inviteToken = team.team_code;

      // Create invitation record (for tracking purposes)
      const { data, error } = await supabaseAdmin
        .from('hackathon_team_invitations')
        .insert({
          team_id: teamId,
          hackathon_id: team.hackathon_id,
          invited_by_user_id: userId,
          invited_email: email,
          invite_token: inviteToken,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        })
        .select()
        .single();

      if (error) throw error;

      // Send team invitation email
      const { data: hackathonDetails } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('hackathon_name, slug')
        .eq('id', team.hackathon_id)
        .single();

      const { data: inviterProfile } = await supabaseAdmin
        .from('profiles')
        .select('full_name, username')
        .eq('id', userId)
        .single();

      if (hackathonDetails) {
        // Use team code in the invite URL
        const inviteUrl = `${process.env.FRONTEND_URL || 'https://maximally.in'}/team/join/${team.team_code}`;
        sendTeamInvitationEmail({
          email: email,
          inviteeName: email.split('@')[0], // Use email prefix as name
          inviterName: inviterProfile?.full_name || inviterProfile?.username || 'A teammate',
          teamName: team.team_name,
          hackathonName: hackathonDetails.hackathon_name,
          hackathonSlug: hackathonDetails.slug,
          inviteUrl: inviteUrl,
        }).catch(err => console.error('Team invitation email failed:', err));
      }

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Accept team invitation via team code (public endpoint - user must be logged in)
  app.post("/api/teams/join/:token", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Please log in to join the team' });
      }

      const authToken = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, authToken);
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Invalid session' });
      }

      const { token: teamCode } = req.params;

      // Find the team by team code
      const { data: team, error: teamError } = await supabaseAdmin
        .from('hackathon_teams')
        .select('*, hackathon:organizer_hackathons(slug, hackathon_name)')
        .eq('team_code', teamCode.toUpperCase())
        .single();

      if (teamError || !team) {
        return res.status(404).json({ success: false, message: 'Invalid team code' });
      }

      // Check if user is already registered for this hackathon
      const { data: existingReg } = await supabaseAdmin
        .from('hackathon_registrations')
        .select('*')
        .eq('hackathon_id', team.hackathon_id)
        .eq('user_id', userId)
        .single();

      if (!existingReg) {
        // User is NOT registered - they must register first
        return res.status(400).json({ 
          success: false, 
          message: 'You must register for this hackathon before joining a team',
          requiresRegistration: true,
          hackathonSlug: team.hackathon?.slug || null,
          hackathonId: team.hackathon_id
        });
      }

      if (existingReg.team_id) {
        // Get the current team name to show in the error message
        const { data: currentTeam } = await supabaseAdmin
          .from('hackathon_teams')
          .select('team_name')
          .eq('id', existingReg.team_id)
          .single();
        
        return res.status(400).json({ 
          success: false, 
          message: `You're already in team "${currentTeam?.team_name || 'Unknown'}". Leave your current team first to join a new one.`,
          alreadyInTeam: true,
          currentTeamName: currentTeam?.team_name
        });
      }

      // Update registration to join team
      const { error: updateError } = await supabaseAdmin
        .from('hackathon_registrations')
        .update({
          team_id: team.id,
          registration_type: 'team'
        })
        .eq('id', existingReg.id);

      if (updateError) throw updateError;

      // Mark any pending invitations for this user as accepted
      await supabaseAdmin
        .from('hackathon_team_invitations')
        .update({
          status: 'accepted',
          invited_user_id: userId,
          responded_at: new Date().toISOString()
        })
        .eq('team_id', team.id)
        .eq('status', 'pending');

      return res.json({
        success: true,
        message: `You've joined team ${team.team_name}!`,
        data: {
          teamId: team.id,
          teamName: team.team_name,
          hackathonSlug: team.hackathon?.slug
        }
      });
    } catch (error: any) {
      console.error('Error joining team via code:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get team details by code (public - for showing team info before joining)
  app.get("/api/teams/invite/:token", async (req, res) => {
    try {
      const { token: teamCode } = req.params;

      // Find the team by team code
      const { data: team, error } = await supabaseAdmin
        .from('hackathon_teams')
        .select(`
          id,
          team_name,
          team_code,
          hackathon:organizer_hackathons(
            id,
            hackathon_name,
            slug,
            hackathon_logo,
            start_date,
            end_date
          )
        `)
        .eq('team_code', teamCode.toUpperCase())
        .single();

      if (error || !team) {
        return res.status(404).json({ success: false, message: 'Team not found' });
      }

      // Return team info in a format compatible with the JoinTeam page
      return res.json({ 
        success: true, 
        data: {
          id: team.id,
          status: 'pending',
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          invited_email: '',
          team: {
            id: team.id,
            team_name: team.team_name,
            hackathon: team.hackathon
          }
        }
      });
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
            hackathon_logo,
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
      // Platform Simplification: Removed manual control columns, using dates only
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('start_date, end_date, status')
        .eq('id', hackathonId)
        .single();

      if (!hackathon) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      if (hackathon.status !== 'published') {
        return res.status(403).json({ success: false, message: 'Hackathon is not published' });
      }

      // Platform Simplification: Use dates only for submission availability
      // See: .kiro/specs/platform-simplification/requirements.md - Requirement 4, 5
      const now = new Date();
      const startDate = hackathon.start_date ? new Date(hackathon.start_date) : null;
      const endDate = hackathon.end_date ? new Date(hackathon.end_date) : null;
      
      // Check if submissions are closed by timeline (hackathon ended)
      if (endDate && now > endDate) {
        return res.status(403).json({ success: false, message: 'Submissions are closed for this hackathon' });
      }

      // Check if submissions haven't opened yet (hackathon hasn't started)
      if (startDate && now < startDate) {
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

      // Helper function to sync submission to gallery
      const syncToGallery = async (submission: any, submitterId: string) => {
        if (submission.status !== 'submitted') return;
        
        try {
          const { data: existingGallery } = await supabaseAdmin
            .from('gallery_projects')
            .select('id')
            .eq('hackathon_submission_id', submission.id)
            .single();

          const galleryData = {
            user_id: submitterId,
            name: submission.project_name || 'Untitled Project',
            tagline: submission.tagline,
            description: submission.description || '',
            logo_url: submission.project_logo,
            github_url: submission.github_repo,
            demo_url: submission.demo_url,
            video_url: submission.video_url,
            technologies: submission.technologies_used || [],
            hackathon_id: parseInt(hackathonId),
            hackathon_submission_id: submission.id,
            status: 'approved',
          };

          if (existingGallery) {
            await supabaseAdmin
              .from('gallery_projects')
              .update({ ...galleryData, updated_at: new Date().toISOString() })
              .eq('id', existingGallery.id);
          } else {
            await supabaseAdmin
              .from('gallery_projects')
              .insert({ ...galleryData, created_at: submission.submitted_at || new Date().toISOString() });
          }
          console.log('Synced submission to gallery:', submission.id);
        } catch (galleryError) {
          console.error('Error syncing to gallery:', galleryError);
        }
      };

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
          
          // Sync to gallery
          await syncToGallery(data, userId);
          
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
        
        // Sync to gallery
        await syncToGallery(data, userId);
        
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
        
        // Sync to gallery
        await syncToGallery(data, userId);
        
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
      
      // Sync to gallery
      await syncToGallery(data, userId);

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
