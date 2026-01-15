// @ts-nocheck
import type { Express } from "express";
import { createClient } from "@supabase/supabase-js";

async function bearerUserId(supabaseAdmin: any, token: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  return data?.user?.id || null;
}

export function registerJudgeInvitationRoutes(app: Express) {
  const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;

  // Helper function to check if user has access to hackathon (owner or co-organizer)
  async function checkHackathonAccess(
    hackathonId: string | number, 
    userId: string,
    requiredPermission?: string
  ): Promise<{ hasAccess: boolean; isOwner: boolean; role?: string; permissions?: any }> {
    // Check if user is the owner
    const { data: hackathon } = await supabaseAdmin
      .from('organizer_hackathons')
      .select('organizer_id')
      .eq('id', hackathonId)
      .single();

    if (hackathon?.organizer_id === userId) {
      return { hasAccess: true, isOwner: true, role: 'owner' };
    }

    // Check if user is a co-organizer
    const { data: coOrg } = await supabaseAdmin
      .from('hackathon_organizers')
      .select('role, permissions, status')
      .eq('hackathon_id', hackathonId)
      .eq('user_id', userId)
      .eq('status', 'accepted')
      .single();

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

  // Organizer: Invite judge to hackathon (by email)
  app.post("/api/organizer/hackathons/:hackathonId/invite-judge", async (req, res) => {
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
      const { judge_email, message } = req.body;

      // Find judge by email
      const { data: judgeProfile } = await supabaseAdmin
        .from('profiles')
        .select('id, role')
        .eq('email', judge_email)
        .single();

      if (!judgeProfile) {
        return res.status(404).json({ success: false, message: 'Judge not found with that email' });
      }

      if (judgeProfile.role !== 'judge') {
        return res.status(400).json({ success: false, message: 'User is not a judge' });
      }

      const judgeId = judgeProfile.id;

      // Check judge availability status from judges table
      const { data: judgeData } = await supabaseAdmin
        .from('judges')
        .select('availability_status')
        .eq('user_id', judgeId)
        .single();

      if (judgeData?.availability_status === 'not-available') {
        return res.status(400).json({ 
          success: false, 
          message: 'This judge is currently not available for judging. They have set their status to "Not Available".',
          availability_status: 'not-available'
        });
      }

      // Verify access (owner or co-organizer with can_manage_judges)
      const access = await checkHackathonAccess(hackathonId, userId, 'can_manage_judges');
      if (!access.hasAccess) {
        return res.status(403).json({ success: false, message: 'Not authorized to manage judges' });
      }

      // Get hackathon organizer_id for the request
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('organizer_id')
        .eq('id', hackathonId)
        .single();

      // Create invitation
      const { data, error } = await supabaseAdmin
        .from('judge_hackathon_requests')
        .insert({
          hackathon_id: parseInt(hackathonId),
          judge_id: judgeId,
          organizer_id: hackathon?.organizer_id || userId,
          request_type: 'organizer_invite',
          message: message || null,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          return res.status(400).json({ success: false, message: 'Invitation already sent' });
        }
        throw error;
      }

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Judge: Request to judge hackathon
  app.post("/api/hackathons/:hackathonId/request-to-judge", async (req, res) => {
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

      // Verify user is a judge
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profile?.role !== 'judge') {
        return res.status(403).json({ success: false, message: 'Only judges can request' });
      }

      const { hackathonId } = req.params;
      const { message } = req.body;

      // Get hackathon organizer
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('organizer_id')
        .eq('id', hackathonId)
        .single();

      if (!hackathon) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      // Create request
      const { data, error } = await supabaseAdmin
        .from('judge_hackathon_requests')
        .insert({
          hackathon_id: parseInt(hackathonId),
          judge_id: userId,
          organizer_id: hackathon.organizer_id,
          request_type: 'judge_request',
          message: message || null,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          return res.status(400).json({ success: false, message: 'Request already sent' });
        }
        throw error;
      }

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get requests for judge (invites they received + requests they sent)
  app.get("/api/judge/requests", async (req, res) => {
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
        .from('judge_hackathon_requests')
        .select('*')
        .eq('judge_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Enrich with hackathon and organizer details, and filter out removed assignments
      const enrichedData = await Promise.all((data || []).map(async (request: any) => {
        // Get hackathon details
        const { data: hackathon } = await supabaseAdmin
          .from('organizer_hackathons')
          .select('id, hackathon_name, start_date, end_date, format')
          .eq('id', request.hackathon_id)
          .single();

        // Get organizer details
        const { data: organizer } = await supabaseAdmin
          .from('profiles')
          .select('username, full_name, avatar_url')
          .eq('id', request.organizer_id)
          .single();

        // For accepted requests, check if the assignment is still active
        let isRemoved = false;
        if (request.status === 'accepted') {
          const { data: assignment } = await supabaseAdmin
            .from('judge_hackathon_assignments')
            .select('status')
            .eq('hackathon_id', request.hackathon_id)
            .eq('judge_id', userId)
            .single();
          
          // If assignment doesn't exist or is removed/inactive, mark as removed
          isRemoved = !assignment || assignment.status === 'removed' || assignment.status === 'inactive';
        }

        return {
          ...request,
          hackathon,
          organizer,
          isRemoved
        };
      }));

      // Filter out requests where the judge has been removed
      const filteredData = enrichedData.filter(request => !request.isRemoved);

      return res.json({ success: true, data: filteredData });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get requests for a specific hackathon (organizer)
  app.get("/api/organizer/hackathons/:hackathonId/judge-requests", async (req, res) => {
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

      // Verify access (owner or co-organizer with can_manage_judges)
      const access = await checkHackathonAccess(hackathonId, userId, 'can_manage_judges');
      if (!access.hasAccess) {
        return res.status(403).json({ success: false, message: 'Not authorized to manage judges' });
      }

      const { data, error } = await supabaseAdmin
        .from('judge_hackathon_requests')
        .select('*')
        .eq('hackathon_id', hackathonId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch judge profiles separately since there's no direct FK to profiles
      const enrichedData = await Promise.all((data || []).map(async (req: any) => {
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('username, full_name, avatar_url, email')
          .eq('id', req.judge_id)
          .single();
        
        return {
          ...req,
          judge_name: profile?.full_name || profile?.username || 'Unknown',
          judge_email: profile?.email || ''
        };
      }));

      return res.json({ success: true, data: enrichedData });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get judge assignments for a specific hackathon (organizer)
  app.get("/api/organizer/hackathons/:hackathonId/judge-assignments", async (req, res) => {
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

      // Verify access (owner or co-organizer with can_manage_judges)
      const access = await checkHackathonAccess(hackathonId, userId, 'can_manage_judges');
      if (!access.hasAccess) {
        return res.status(403).json({ success: false, message: 'Not authorized to manage judges' });
      }

      const { data, error } = await supabaseAdmin
        .from('judge_hackathon_assignments')
        .select('*')
        .eq('hackathon_id', hackathonId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch judge profiles separately since there's no direct FK to profiles
      const enrichedData = await Promise.all((data || []).map(async (assignment: any) => {
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('username, full_name, avatar_url, email')
          .eq('id', assignment.judge_id)
          .single();
        
        return {
          ...assignment,
          judge_name: profile?.full_name || profile?.username || 'Unknown',
          judge_email: profile?.email || ''
        };
      }));

      return res.json({ success: true, data: enrichedData });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get requests for organizer (requests they received + invites they sent)
  app.get("/api/organizer/judge-requests", async (req, res) => {
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
        .from('judge_hackathon_requests')
        .select(`
          *,
          hackathon:organizer_hackathons(id, hackathon_name, start_date, end_date, format)
        `)
        .eq('organizer_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch judge profiles separately
      const enrichedData = await Promise.all((data || []).map(async (req: any) => {
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('username, full_name, avatar_url')
          .eq('id', req.judge_id)
          .single();
        
        return {
          ...req,
          judge: profile
        };
      }));

      return res.json({ success: true, data: enrichedData });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Accept request (judge accepts invite OR organizer accepts request)
  app.post("/api/judge-requests/:requestId/accept", async (req, res) => {
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

      const { requestId } = req.params;
      const { responseMessage } = req.body;

      // Get the request details
      const { data: request, error: reqError } = await supabaseAdmin
        .from('judge_hackathon_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (reqError || !request) {
        return res.status(404).json({ success: false, message: 'Request not found' });
      }

      // Verify the user is authorized (either the organizer or the judge depending on request type)
      const isOrganizer = request.organizer_id === userId;
      const isJudge = request.judge_id === userId;
      
      if (request.request_type === 'judge_request' && !isOrganizer) {
        return res.status(403).json({ success: false, message: 'Only the organizer can accept judge requests' });
      }
      if (request.request_type === 'organizer_invite' && !isJudge) {
        return res.status(403).json({ success: false, message: 'Only the judge can accept organizer invites' });
      }

      // Check judge availability status before accepting (for both request types)
      const { data: judgeData } = await supabaseAdmin
        .from('judges')
        .select('availability_status')
        .eq('user_id', request.judge_id)
        .single();

      if (judgeData?.availability_status === 'not-available') {
        return res.status(400).json({ 
          success: false, 
          message: 'This judge is currently not available for judging. They have set their status to "Not Available".',
          availability_status: 'not-available'
        });
      }

      // Update the request status
      const { error: updateError } = await supabaseAdmin
        .from('judge_hackathon_requests')
        .update({
          status: 'accepted',
          response_message: responseMessage || null,
          responded_at: new Date().toISOString(),
          responded_by: userId
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // Create the assignment
      const { data: assignment, error: assignError } = await supabaseAdmin
        .from('judge_hackathon_assignments')
        .insert({
          hackathon_id: request.hackathon_id,
          judge_id: request.judge_id,
          assigned_by: userId,
          role: 'judge',
          status: 'active'
        })
        .select()
        .single();

      if (assignError) throw assignError;

      return res.json({ success: true, data: assignment });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Reject request
  app.post("/api/judge-requests/:requestId/reject", async (req, res) => {
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

      const { requestId } = req.params;
      const { responseMessage } = req.body;

      // Get the request details
      const { data: request, error: reqError } = await supabaseAdmin
        .from('judge_hackathon_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (reqError || !request) {
        return res.status(404).json({ success: false, message: 'Request not found' });
      }

      // Verify the user is authorized
      const isOrganizer = request.organizer_id === userId;
      const isJudge = request.judge_id === userId;
      
      if (request.request_type === 'judge_request' && !isOrganizer) {
        return res.status(403).json({ success: false, message: 'Only the organizer can reject judge requests' });
      }
      if (request.request_type === 'organizer_invite' && !isJudge) {
        return res.status(403).json({ success: false, message: 'Only the judge can reject organizer invites' });
      }

      // Update the request status
      const { error: updateError } = await supabaseAdmin
        .from('judge_hackathon_requests')
        .update({
          status: 'rejected',
          response_message: responseMessage || null,
          responded_at: new Date().toISOString(),
          responded_by: userId
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      return res.json({ success: true, message: 'Request rejected' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Cancel/Delete request
  app.delete("/api/judge-requests/:requestId", async (req, res) => {
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

      const { requestId } = req.params;

      const { error } = await supabaseAdmin
        .from('judge_hackathon_requests')
        .delete()
        .eq('id', requestId)
        .or(`judge_id.eq.${userId},organizer_id.eq.${userId}`);

      if (error) throw error;

      return res.json({ success: true });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Organizer: Remove judge from hackathon
  app.delete("/api/organizer/hackathons/:hackathonId/judges/:assignmentId", async (req, res) => {
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

      const { hackathonId, assignmentId } = req.params;

      // Verify access (owner or co-organizer with can_manage_judges)
      const access = await checkHackathonAccess(hackathonId, userId, 'can_manage_judges');
      if (!access.hasAccess) {
        return res.status(403).json({ success: false, message: 'Not authorized to manage judges' });
      }

      // Get the assignment to find the judge_id
      const { data: assignment } = await supabaseAdmin
        .from('judge_hackathon_assignments')
        .select('judge_id')
        .eq('id', assignmentId)
        .eq('hackathon_id', hackathonId)
        .single();

      // Update assignment status to 'removed'
      const { error } = await supabaseAdmin
        .from('judge_hackathon_assignments')
        .update({ status: 'removed' })
        .eq('id', assignmentId)
        .eq('hackathon_id', hackathonId);

      if (error) throw error;

      // Also delete the corresponding request record so the judge can be re-invited
      if (assignment?.judge_id) {
        await supabaseAdmin
          .from('judge_hackathon_requests')
          .delete()
          .eq('hackathon_id', hackathonId)
          .eq('judge_id', assignment.judge_id);
      }

      return res.json({ success: true, message: 'Judge removed from hackathon' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Judge: Withdraw from hackathon
  app.post("/api/judge/hackathons/:hackathonId/withdraw", async (req, res) => {
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
      const { reason } = req.body;

      // Find the assignment
      const { data: assignment, error: findError } = await supabaseAdmin
        .from('judge_hackathon_assignments')
        .select('id')
        .eq('hackathon_id', hackathonId)
        .eq('judge_id', userId)
        .eq('status', 'active')
        .single();

      if (findError || !assignment) {
        return res.status(404).json({ success: false, message: 'Assignment not found' });
      }

      // Update assignment status to 'inactive' (judge withdrew)
      const { error } = await supabaseAdmin
        .from('judge_hackathon_assignments')
        .update({ 
          status: 'inactive',
          updated_at: new Date().toISOString()
        })
        .eq('id', assignment.id);

      if (error) throw error;

      // Also delete the corresponding request record so the judge can be re-invited later
      await supabaseAdmin
        .from('judge_hackathon_requests')
        .delete()
        .eq('hackathon_id', hackathonId)
        .eq('judge_id', userId);

      return res.json({ success: true, message: 'Successfully withdrawn from hackathon' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get assigned judges for a hackathon
  app.get("/api/hackathons/:hackathonId/judges", async (req, res) => {
    try {
      const { hackathonId } = req.params;

      const { data, error } = await supabaseAdmin
        .from('judge_hackathon_assignments')
        .select(`
          *,
          judge:profiles!judge_hackathon_assignments_judge_id_fkey(username, full_name, avatar_url)
        `)
        .eq('hackathon_id', hackathonId)
        .eq('status', 'active');

      if (error) throw error;

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Check if judge can request or has been invited
  app.get("/api/hackathons/:hackathonId/judge-status", async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return res.json({ success: true, data: { canRequest: false, hasRequest: false, isAssigned: false } });
      }

      const token = authHeader.slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin, token);
      if (!userId) {
        return res.json({ success: true, data: { canRequest: false, hasRequest: false, isAssigned: false } });
      }

      const { hackathonId } = req.params;

      // Check if user is a judge
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      const isJudge = profile?.role === 'judge';

      // Check existing request
      const { data: request } = await supabaseAdmin
        .from('judge_hackathon_requests')
        .select('*')
        .eq('hackathon_id', hackathonId)
        .eq('judge_id', userId)
        .single();

      // Check assignment
      const { data: assignment } = await supabaseAdmin
        .from('judge_hackathon_assignments')
        .select('*')
        .eq('hackathon_id', hackathonId)
        .eq('judge_id', userId)
        .eq('status', 'active')
        .single();

      return res.json({
        success: true,
        data: {
          canRequest: isJudge && !request && !assignment,
          hasRequest: !!request,
          requestStatus: request?.status,
          requestType: request?.request_type,
          isAssigned: !!assignment
        }
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });
}
