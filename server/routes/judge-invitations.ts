// @ts-nocheck
import type { Express } from "express";
import { createClient } from "@supabase/supabase-js";

async function bearerUserId(supabaseAdmin: any, token: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  return data?.user?.id || null;
}

export function registerJudgeInvitationRoutes(app: Express) {
  const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;

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

      // Verify organizer owns this hackathon
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('*')
        .eq('id', hackathonId)
        .eq('organizer_id', userId)
        .single();

      if (!hackathon) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      // Create invitation
      const { data, error } = await supabaseAdmin
        .from('judge_hackathon_requests')
        .insert({
          hackathon_id: parseInt(hackathonId),
          judge_id: judgeId,
          organizer_id: userId,
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

      // Enrich with hackathon and organizer details
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

        return {
          ...request,
          hackathon,
          organizer
        };
      }));

      return res.json({ success: true, data: enrichedData });
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
        .from('judge_hackathon_requests')
        .select(`
          *,
          judge:profiles!judge_hackathon_requests_judge_id_fkey(username, full_name, avatar_url, email)
        `)
        .eq('hackathon_id', hackathonId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Enrich with judge names
      const enrichedData = (data || []).map((req: any) => ({
        ...req,
        judge_name: req.judge?.full_name || req.judge?.username || 'Unknown',
        judge_email: req.judge?.email || ''
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
        .from('judge_hackathon_assignments')
        .select(`
          *,
          judge:profiles!judge_hackathon_assignments_judge_id_fkey(username, full_name, avatar_url, email)
        `)
        .eq('hackathon_id', hackathonId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Enrich with judge names
      const enrichedData = (data || []).map((assignment: any) => ({
        ...assignment,
        judge_name: assignment.judge?.full_name || assignment.judge?.username || 'Unknown',
        judge_email: assignment.judge?.email || ''
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
          hackathon:organizer_hackathons(id, hackathon_name, start_date, end_date, format),
          judge:profiles!judge_hackathon_requests_judge_id_fkey(username, full_name, avatar_url)
        `)
        .eq('organizer_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.json({ success: true, data });
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

      const { data, error } = await supabaseAdmin.rpc('accept_judge_request', {
        p_request_id: requestId,
        p_response_message: responseMessage || null
      });

      if (error) throw error;

      return res.json({ success: true, data });
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

      const { data, error } = await supabaseAdmin.rpc('reject_judge_request', {
        p_request_id: requestId,
        p_response_message: responseMessage || null
      });

      if (error) throw error;

      return res.json({ success: true, data });
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
