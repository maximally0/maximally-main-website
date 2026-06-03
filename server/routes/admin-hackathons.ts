// @ts-nocheck
import type { Express } from "express";
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

function makeSlugBase(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70) || 'hackathon';
}

async function makeUniqueHackathonSlug(supabaseAdmin: any, base: string): Promise<string> {
  const slugBase = makeSlugBase(base);
  for (let i = 1; i <= 20; i++) {
    const suffix = i === 1 ? 'copy' : `copy-${i}`;
    const candidate = `${slugBase}-${suffix}`;
    const { data } = await supabaseAdmin
      .from('organizer_hackathons')
      .select('id')
      .eq('slug', candidate)
      .maybeSingle();
    if (!data) return candidate;
  }
  return `${slugBase}-copy-${Date.now()}`;
}

function isMissingWinnersSchema(error: any): boolean {
  const message = String(error?.message || '');
  return (
    message.includes('hackathon_winners') &&
    (message.includes('schema cache') ||
      message.includes('does not exist') ||
      message.includes('Could not find the table') ||
      message.includes('column'))
  );
}

function ordinalPosition(position: number): string {
  if (position === 1) return '1st Place';
  if (position === 2) return '2nd Place';
  if (position === 3) return '3rd Place';
  return `${position}th Place`;
}

function cleanText(value: unknown): string | null {
  if (typeof value !== 'string') return value == null ? null : String(value);
  const trimmed = value.trim();
  return trimmed || null;
}

function buildWinnerPayload(body: any, fallbackPosition = 1) {
  const position = Number(body.position) || fallbackPosition;
  const prizePosition = cleanText(body.prize_position || body.prize_name || body.position_label) || ordinalPosition(position);

  return {
    position,
    prize_position: prizePosition,
    prize_name: cleanText(body.prize_name) || prizePosition,
    prize_amount: cleanText(body.prize_amount),
    team_name: cleanText(body.team_name),
    project_title: cleanText(body.project_title || body.project_name),
    description: cleanText(body.description),
    demo_url: cleanText(body.demo_url),
    github_url: cleanText(body.github_url),
    track: cleanText(body.track),
    winner_type: cleanText(body.winner_type) || 'overall',
    status: cleanText(body.status) || 'published',
    score: body.score === '' || body.score == null ? null : Number(body.score),
  };
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

  // List manually curated winner cards for a hackathon (admin only).
  app.get("/api/admin/hackathons/:id/winners", async (req, res) => {
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
      const { data: hackathon } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('id')
        .eq('id', id)
        .maybeSingle();

      if (!hackathon) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      const { data, error } = await supabaseAdmin
        .from('hackathon_winners')
        .select('*')
        .eq('hackathon_id', id)
        .order('position', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) {
        if (isMissingWinnersSchema(error)) {
          return res.json({
            success: true,
            data: [],
            schemaMissing: true,
            message: 'Winners CMS needs the hackathon_winners database migration.',
          });
        }
        console.error('Error fetching admin winners:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch winners' });
      }

      return res.json({ success: true, data: data || [] });
    } catch (error: any) {
      console.error('Error in admin list winners:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Create a manually curated winner card (admin only).
  app.post("/api/admin/hackathons/:id/winners", async (req, res) => {
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
      const payload = {
        hackathon_id: Number(id),
        announced_by: userId,
        ...buildWinnerPayload(req.body),
      };

      if (!payload.project_title && !payload.team_name) {
        return res.status(400).json({ success: false, message: 'Project title or team name is required' });
      }

      const { data, error } = await supabaseAdmin
        .from('hackathon_winners')
        .insert(payload)
        .select()
        .single();

      if (error) {
        if (isMissingWinnersSchema(error)) {
          return res.status(501).json({
            success: false,
            schemaMissing: true,
            message: 'Run server/migrations/20260603_hackathon_winners.sql in Supabase before adding winners.',
          });
        }
        console.error('Error creating admin winner:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to create winner' });
      }

      await supabaseAdmin
        .from('organizer_hackathons')
        .update({ winners_announced: true, winners_announced_at: new Date().toISOString() })
        .eq('id', id);

      return res.status(201).json({ success: true, data });
    } catch (error: any) {
      console.error('Error in admin create winner:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Update a manually curated winner card (admin only).
  app.patch("/api/admin/hackathons/:id/winners/:winnerId", async (req, res) => {
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

      const { id, winnerId } = req.params;
      const payload = {
        ...buildWinnerPayload(req.body),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabaseAdmin
        .from('hackathon_winners')
        .update(payload)
        .eq('id', winnerId)
        .eq('hackathon_id', id)
        .select()
        .single();

      if (error) {
        if (isMissingWinnersSchema(error)) {
          return res.status(501).json({
            success: false,
            schemaMissing: true,
            message: 'Run server/migrations/20260603_hackathon_winners.sql in Supabase before editing winners.',
          });
        }
        console.error('Error updating admin winner:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to update winner' });
      }

      return res.json({ success: true, data });
    } catch (error: any) {
      console.error('Error in admin update winner:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Delete a manually curated winner card (admin only).
  app.delete("/api/admin/hackathons/:id/winners/:winnerId", async (req, res) => {
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

      const { id, winnerId } = req.params;
      const { error } = await supabaseAdmin
        .from('hackathon_winners')
        .delete()
        .eq('id', winnerId)
        .eq('hackathon_id', id);

      if (error) {
        if (isMissingWinnersSchema(error)) {
          return res.status(501).json({
            success: false,
            schemaMissing: true,
            message: 'Run server/migrations/20260603_hackathon_winners.sql in Supabase before deleting winners.',
          });
        }
        console.error('Error deleting admin winner:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to delete winner' });
      }

      const { data: remainingWinners } = await supabaseAdmin
        .from('hackathon_winners')
        .select('id')
        .eq('hackathon_id', id)
        .limit(1);

      if (!remainingWinners?.length) {
        await supabaseAdmin
          .from('organizer_hackathons')
          .update({ winners_announced: false, winners_announced_at: null })
          .eq('id', id);
      }

      return res.json({ success: true });
    } catch (error: any) {
      console.error('Error in admin delete winner:', error);
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

  // Duplicate hackathon (admin only). Copies page/CMS content into a draft,
  // but does not copy live event data such as registrations or submissions.
  app.post("/api/admin/hackathons/:id/duplicate", async (req, res) => {
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
      const { data: original, error: fetchError } = await supabaseAdmin
        .from('organizer_hackathons')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !original) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      const sourceName = original.hackathon_name || original.name || original.title || 'Hackathon';
      const newSlug = await makeUniqueHackathonSlug(supabaseAdmin, original.slug || sourceName);

      const clonePayload = {
        organizer_id: original.organizer_id,
        hackathon_name: `${sourceName} (Copy)`,
        name: original.name ? `${original.name} (Copy)` : null,
        title: original.title ? `${original.title} (Copy)` : null,
        slug: newSlug,
        tagline: original.tagline,
        description: original.description,
        start_date: original.start_date,
        end_date: original.end_date,
        registration_deadline: original.registration_deadline,
        format: original.format,
        venue: original.venue,
        location: original.location,
        mode: original.mode,
        max_participants: original.max_participants,
        prize_pool: original.prize_pool,
        total_prize_pool: original.total_prize_pool,
        tracks: original.tracks,
        themes: original.themes,
        sponsors: original.sponsors,
        eligibility: original.eligibility,
        rules: original.rules,
        schedule: original.schedule,
        tags: original.tags,
        cover_image: original.cover_image,
        hackathon_logo: original.hackathon_logo,
        status: 'draft',
        hackathon_status: 'draft',
        is_featured: false,
      };

      const { data: duplicated, error: insertError } = await supabaseAdmin
        .from('organizer_hackathons')
        .insert(clonePayload)
        .select()
        .single();

      if (insertError) {
        console.error('Error duplicating hackathon:', insertError);
        return res.status(500).json({ success: false, message: insertError.message || 'Failed to duplicate hackathon' });
      }

      const { data: assignments, error: assignmentFetchError } = await supabaseAdmin
        .from('hackathon_judge_assignments')
        .select('judge_id')
        .eq('hackathon_id', id);

      if (assignmentFetchError) {
        console.warn('Error fetching judge/mentor assignments for duplicate:', assignmentFetchError.message);
      } else if (assignments?.length) {
        const assignmentRows = assignments.map((assignment: any) => ({
          hackathon_id: duplicated.id,
          judge_id: assignment.judge_id,
        }));
        const { error: assignmentInsertError } = await supabaseAdmin
          .from('hackathon_judge_assignments')
          .upsert(assignmentRows, { onConflict: 'judge_id,hackathon_id' });

        if (assignmentInsertError) {
          console.warn('Error copying judge/mentor assignments for duplicate:', assignmentInsertError.message);
        }
      }

      const { data: winnerRows, error: winnersFetchError } = await supabaseAdmin
        .from('hackathon_winners')
        .select('*')
        .eq('hackathon_id', id);

      if (winnersFetchError) {
        if (!isMissingWinnersSchema(winnersFetchError)) {
          console.warn('Error fetching winners for duplicate:', winnersFetchError.message);
        }
      } else if (winnerRows?.length) {
        const copiedWinners = winnerRows.map((winner: any) => {
          const {
            id: _winnerId,
            created_at: _createdAt,
            updated_at: _updatedAt,
            submission_id: _submissionId,
            user_id: _winnerUserId,
            team_id: _teamId,
            announced_by: _announcedBy,
            ...copyableWinner
          } = winner;

          return {
            ...copyableWinner,
            hackathon_id: duplicated.id,
            submission_id: null,
            user_id: null,
            team_id: null,
            announced_by: userId,
          };
        });

        const { error: winnersInsertError } = await supabaseAdmin
          .from('hackathon_winners')
          .insert(copiedWinners);

        if (winnersInsertError) {
          console.warn('Error copying winners for duplicate:', winnersInsertError.message);
        }
      }

      return res.status(201).json({ success: true, data: duplicated });
    } catch (error: any) {
      console.error('Error in duplicate hackathon:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
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
