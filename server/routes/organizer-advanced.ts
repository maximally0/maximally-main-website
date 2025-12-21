// @ts-nocheck
import type { Express } from "express";
import { createClient } from "@supabase/supabase-js";
import { sendAnnouncement, sendBulkEmails } from "../services/email";

async function bearerUserId(supabaseAdmin: any, token: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  return data?.user?.id || null;
}

export function registerOrganizerAdvancedRoutes(app: Express) {
  const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;

  // ============================================
  // BULK ACTIONS
  // ============================================

  // Bulk update registration status
  app.post("/api/organizer/hackathons/:hackathonId/registrations/bulk-update", async (req, res) => {
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
      const { registrationIds, action, value } = req.body;

      // Verify ownership
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('organizer_id')
        .eq('id', hackathonId)
        .single();

      if (hackathon?.organizer_id !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      let updateData: any = {};
      
      switch (action) {
        case 'status':
          updateData.status = value;
          if (value === 'checked_in') {
            updateData.checked_in_at = new Date().toISOString();
          }
          break;
        case 'tag':
          // Handle tagging separately
          break;
        default:
          return res.status(400).json({ success: false, message: 'Invalid action' });
      }

      if (action !== 'tag') {
        const { error } = await supabaseAdmin
          .from('hackathon_registrations')
          .update(updateData)
          .in('id', registrationIds);

        if (error) throw error;
      }

      return res.json({ success: true, updated: registrationIds.length });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // ============================================
  // ADVANCED FILTERS & ANALYTICS
  // ============================================

  // Get registration analytics
  app.get("/api/organizer/hackathons/:hackathonId/analytics", async (req, res) => {
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

      // Get various analytics
      const [
        { data: registrations },
        { data: collegeStats },
        { data: experienceStats },
        { data: dailyStats }
      ] = await Promise.all([
        supabaseAdmin
          .from('hackathon_registrations')
          .select('*')
          .eq('hackathon_id', hackathonId),
        supabaseAdmin
          .from('hackathon_college_stats')
          .select('*')
          .eq('hackathon_id', hackathonId)
          .order('total_registrations', { ascending: false })
          .limit(10),
        supabaseAdmin
          .from('hackathon_experience_stats')
          .select('*')
          .eq('hackathon_id', hackathonId),
        supabaseAdmin
          .from('hackathon_registration_analytics')
          .select('*')
          .eq('hackathon_id', hackathonId)
          .order('date', { ascending: false })
          .limit(30)
      ]);

      // Calculate additional metrics
      const totalRegistrations = registrations?.length || 0;
      const confirmedCount = registrations?.filter(r => r.status === 'confirmed').length || 0;
      const checkedInCount = registrations?.filter(r => r.status === 'checked_in').length || 0;
      const waitlistCount = registrations?.filter(r => r.status === 'waitlist').length || 0;
      const teamCount = new Set(registrations?.filter(r => r.team_id).map(r => r.team_id)).size;
      const individualCount = registrations?.filter(r => r.registration_type === 'individual').length || 0;

      // Registration timeline
      const timeline = registrations?.reduce((acc: any, reg: any) => {
        const date = new Date(reg.created_at).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      return res.json({
        success: true,
        data: {
          overview: {
            total: totalRegistrations,
            confirmed: confirmedCount,
            checkedIn: checkedInCount,
            waitlist: waitlistCount,
            teams: teamCount,
            individuals: individualCount,
            checkInRate: totalRegistrations > 0 ? (checkedInCount / totalRegistrations * 100).toFixed(1) : 0
          },
          collegeStats: collegeStats || [],
          experienceStats: experienceStats || [],
          timeline: timeline || {},
          dailyStats: dailyStats || []
        }
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // ============================================
  // SUBMISSIONS
  // ============================================

  // Get submissions for hackathon
  app.get("/api/organizer/hackathons/:hackathonId/submissions", async (req, res) => {
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
        .from('hackathon_submissions')
        .select(`
          *,
          team:hackathon_teams(team_name, team_code)
        `)
        .eq('hackathon_id', hackathonId)
        .eq('status', 'submitted')
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      // Get user names and judge scores
      const enrichedData = await Promise.all((data || []).map(async (submission: any) => {
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('username, full_name')
          .eq('id', submission.user_id)
          .single();

        // Get all judge scores for this submission from judge_scores table
        const { data: scores, error: scoresError } = await supabaseAdmin
          .from('judge_scores')
          .select('judge_id, score, feedback, criteria_scores, created_at, updated_at')
          .eq('submission_id', submission.id);

        // Get judge names for each score
        const judgeScores = await Promise.all((scores || []).map(async (scoreEntry: any) => {
          const { data: judgeProfile } = await supabaseAdmin
            .from('profiles')
            .select('username, full_name')
            .eq('id', scoreEntry.judge_id)
            .single();
          
          return {
            judge_id: scoreEntry.judge_id,
            judge_name: judgeProfile?.full_name || judgeProfile?.username || 'Judge',
            score: scoreEntry.score,
            notes: scoreEntry.feedback,
            scored_at: scoreEntry.updated_at || scoreEntry.created_at,
            criteria_scores: scoreEntry.criteria_scores
          };
        }));

        // Calculate average score from all judges
        const avgScore = judgeScores.length > 0 
          ? judgeScores.reduce((sum, js) => sum + (js.score || 0), 0) / judgeScores.length 
          : null;

        return {
          ...submission,
          user_name: profile?.full_name || profile?.username || 'Anonymous',
          judge_scores: judgeScores,
          judges_count: judgeScores.length,
          average_score: avgScore ? parseFloat(avgScore.toFixed(1)) : null
        };
      }));

      return res.json({ success: true, data: enrichedData });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // ============================================
  // ANNOUNCEMENTS
  // ============================================

  // Create announcement
  app.post("/api/organizer/hackathons/:hackathonId/announcements", async (req, res) => {
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
      const { title, content, announcement_type, target_audience, send_email, is_published } = req.body;

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
        .from('hackathon_announcements')
        .insert({
          hackathon_id: hackathonId,
          title,
          content,
          announcement_type: announcement_type || 'general',
          target_audience: target_audience || 'all',
          send_email: send_email || false,
          is_published: is_published === true || is_published === 'true',
          created_by: userId,
          published_at: (is_published === true || is_published === 'true') ? new Date().toISOString() : null
        })
        .select()
        .single();

      if (error) throw error;

      // Send emails if requested
      if (send_email && is_published) {
        const { data: hackathonDetails } = await supabaseAdmin
          .from('organizer_hackathons')
          .select('hackathon_name, slug')
          .eq('id', hackathonId)
          .single();

        // Build query based on target audience
        let query = supabaseAdmin
          .from('hackathon_registrations')
          .select('email, full_name, status, registration_type')
          .eq('hackathon_id', hackathonId);

        // Filter based on target audience
        switch (target_audience) {
          case 'confirmed':
            query = query.eq('status', 'confirmed');
            break;
          case 'waitlist':
            query = query.eq('status', 'waitlist');
            break;
          case 'teams':
            query = query.eq('registration_type', 'team');
            break;
          case 'individuals':
            query = query.eq('registration_type', 'individual');
            break;
          case 'public':
            // Public announcements don't send emails to participants
            // They are only visible on the website
            query = null;
            break;
          case 'all':
          default:
            // Send to all registered users (confirmed + waitlist)
            query = query.in('status', ['confirmed', 'waitlist']);
            break;
        }

        const { data: registrations } = query ? await query : { data: [] };

        if (hackathonDetails && registrations && registrations.length > 0) {
          // Send emails in background
          Promise.all(
            registrations.map((reg: any) =>
              sendAnnouncement({
                email: reg.email,
                userName: reg.full_name || 'there',
                hackathonName: hackathonDetails.hackathon_name,
                hackathonSlug: hackathonDetails.slug,
                announcementTitle: title,
                announcementContent: content,
              })
            )
          ).catch(err => console.error('Bulk email send failed:', err));
        }
      }

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get announcements
  app.get("/api/organizer/hackathons/:hackathonId/announcements", async (req, res) => {
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
        .from('hackathon_announcements')
        .select('*')
        .eq('hackathon_id', hackathonId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Update announcement
  app.put("/api/organizer/hackathons/:hackathonId/announcements/:announcementId", async (req, res) => {
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

      const { hackathonId, announcementId } = req.params;
      const { title, content, announcement_type, target_audience, send_email, is_published } = req.body;

      // Verify ownership
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('organizer_id')
        .eq('id', hackathonId)
        .single();

      if (hackathon?.organizer_id !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      // Build update object with only provided fields
      const updateData: any = { updated_at: new Date().toISOString() };
      if (title !== undefined) updateData.title = title;
      if (content !== undefined) updateData.content = content;
      if (announcement_type !== undefined) updateData.announcement_type = announcement_type;
      if (target_audience !== undefined) updateData.target_audience = target_audience;
      if (send_email !== undefined) updateData.send_email = send_email;
      if (is_published !== undefined) {
        updateData.is_published = is_published;
        if (is_published && !updateData.published_at) {
          updateData.published_at = new Date().toISOString();
        }
      }

      const { data, error } = await supabaseAdmin
        .from('hackathon_announcements')
        .update(updateData)
        .eq('id', announcementId)
        .eq('hackathon_id', hackathonId)
        .select()
        .single();

      if (error) throw error;

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Delete announcement
  app.delete("/api/organizer/hackathons/:hackathonId/announcements/:announcementId", async (req, res) => {
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

      const { hackathonId, announcementId } = req.params;

      // Verify ownership
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('organizer_id')
        .eq('id', hackathonId)
        .single();

      if (hackathon?.organizer_id !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      const { error } = await supabaseAdmin
        .from('hackathon_announcements')
        .delete()
        .eq('id', announcementId)
        .eq('hackathon_id', hackathonId);

      if (error) throw error;

      return res.json({ success: true });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // ============================================
  // REGISTRATION NOTES & TAGS
  // ============================================

  // Add note to registration
  app.post("/api/organizer/registrations/:registrationId/notes", async (req, res) => {
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
      const { note_text } = req.body;

      // Verify ownership
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

      const { data, error } = await supabaseAdmin
        .from('hackathon_registration_notes')
        .insert({
          registration_id: registrationId,
          note_text,
          created_by: userId
        })
        .select()
        .single();

      if (error) throw error;

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get registration notes
  app.get("/api/organizer/registrations/:registrationId/notes", async (req, res) => {
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

      const { data, error } = await supabaseAdmin
        .from('hackathon_registration_notes')
        .select('*')
        .eq('registration_id', registrationId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Create tag
  app.post("/api/organizer/hackathons/:hackathonId/tags", async (req, res) => {
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
      const { tag_name, tag_color } = req.body;

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
        .from('hackathon_registration_tags')
        .insert({
          hackathon_id: hackathonId,
          tag_name,
          tag_color: tag_color || '#6B7280'
        })
        .select()
        .single();

      if (error) throw error;

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get tags
  app.get("/api/organizer/hackathons/:hackathonId/tags", async (req, res) => {
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
        .from('hackathon_registration_tags')
        .select('*')
        .eq('hackathon_id', hackathonId);

      if (error) throw error;

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Assign tag to registration
  app.post("/api/organizer/registrations/:registrationId/tags/:tagId", async (req, res) => {
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

      const { registrationId, tagId } = req.params;

      const { data, error } = await supabaseAdmin
        .from('hackathon_registration_tag_assignments')
        .insert({
          registration_id: registrationId,
          tag_id: tagId
        })
        .select()
        .single();

      if (error) throw error;

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // ============================================
  // REGISTRATION SETTINGS
  // ============================================

  // Update registration settings
  app.patch("/api/organizer/hackathons/:hackathonId/registration-settings", async (req, res) => {
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
      const settings = req.body;

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
        .from('organizer_hackathons')
        .update(settings)
        .eq('id', hackathonId)
        .select()
        .single();

      if (error) throw error;

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // ============================================
  // EXPORT OPTIONS
  // ============================================

  // Export registrations with custom fields
  app.post("/api/organizer/hackathons/:hackathonId/export", async (req, res) => {
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
      const { fields, filters, format } = req.body;

      // Verify ownership
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('organizer_id')
        .eq('id', hackathonId)
        .single();

      if (hackathon?.organizer_id !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      let query = supabaseAdmin
        .from('hackathon_registrations')
        .select('*, team:hackathon_teams(*)')
        .eq('hackathon_id', hackathonId);

      // Apply filters
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.registration_type) {
        query = query.eq('registration_type', filters.registration_type);
      }

      const { data, error } = await query;

      if (error) throw error;

      return res.json({ success: true, data, format: format || 'json' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get submissions for a hackathon
  app.get("/api/organizer/hackathons/:hackathonId/submissions", async (req, res) => {
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

      // Get submissions with scores
      const { data: submissions, error } = await supabaseAdmin
        .from('submissions')
        .select(`
          *,
          team:teams(team_name),
          user:profiles!submissions_user_id_fkey(username, full_name)
        `)
        .eq('hackathon_id', hackathonId)
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      // Get all scores for these submissions
      const submissionIds = (submissions || []).map((s: any) => s.id);
      const { data: scores } = submissionIds.length > 0 ? await supabaseAdmin
        .from('judge_scores')
        .select('submission_id, score, prize_won')
        .in('submission_id', submissionIds) : { data: [] };

      // Calculate average scores
      const enrichedSubmissions = (submissions || []).map((submission: any) => {
        const submissionScores = (scores || []).filter((s: any) => s.submission_id === submission.id);
        const avgScore = submissionScores.length > 0
          ? submissionScores.reduce((sum: number, s: any) => sum + parseFloat(s.score), 0) / submissionScores.length
          : null;

        return {
          ...submission,
          user_name: submission.user?.full_name || submission.user?.username || 'Unknown',
          score: avgScore,
          total_scores: submissionScores.length,
          prize_won: submissionScores.find((s: any) => s.prize_won)?.prize_won || null
        };
      });

      return res.json({ success: true, data: enrichedSubmissions });
    } catch (error: any) {
      console.error('Error fetching submissions:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get judge assignments for a hackathon
  // NOTE: This endpoint is also defined in judge-invitations.ts - keeping this as backup
  // The judge-invitations.ts version uses the correct table (judge_hackathon_assignments)
  /*
  app.get("/api/organizer/hackathons/:hackathonId/judge-assignments-legacy", async (req, res) => {
    // Disabled - use the endpoint in judge-invitations.ts instead
  });
  */

  // Update hackathon settings (close registrations, submissions, etc.)
  app.patch("/api/organizer/hackathons/:hackathonId/settings", async (req, res) => {
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
      const { registration_closes_at, submission_closes_at } = req.body;

      // Verify ownership
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('organizer_id')
        .eq('id', hackathonId)
        .single();

      if (hackathon?.organizer_id !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      const updateData: any = {};
      if (registration_closes_at !== undefined) updateData.registration_closes_at = registration_closes_at;
      if (submission_closes_at !== undefined) updateData.submission_closes_at = submission_closes_at;

      const { data, error } = await supabaseAdmin
        .from('organizer_hackathons')
        .update(updateData)
        .eq('id', hackathonId)
        .select()
        .single();

      if (error) throw error;

      return res.json({ success: true, data });
    } catch (error: any) {
      console.error('Error updating hackathon settings:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });
}
