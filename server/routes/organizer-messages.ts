// @ts-nocheck
import type { Express } from "express";
import { createClient } from "@supabase/supabase-js";

async function bearerUserId(supabaseAdmin: any, token: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  return data?.user?.id || null;
}

export function registerOrganizerMessageRoutes(app: Express) {
  const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;

  // ============================================
  // ORGANIZER MESSAGES
  // ============================================

  // Get messages for the authenticated organizer
  app.get("/api/organizer/messages", async (req, res) => {
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

      // Verify user is an organizer
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role, username')
        .eq('id', userId)
        .single();

      if (profile?.role !== 'organizer') {
        return res.status(403).json({ success: false, message: 'Not an organizer' });
      }

      // Get query parameters for filtering
      const { subject, priority, read, from, to, limit = '50', offset = '0' } = req.query;

      // Get messages where this organizer is a recipient
      let query = supabaseAdmin
        .from('organizer_message_recipients')
        .select(`
          id,
          message_id,
          is_read,
          read_at,
          replied,
          replied_at,
          created_at,
          message:organizer_messages(
            id,
            subject,
            content,
            recipient_type,
            recipient_filter,
            sent_by,
            sent_by_name,
            sent_by_email,
            status,
            priority,
            created_at,
            sent_at
          )
        `)
        .eq('organizer_username', profile.username)
        .order('created_at', { ascending: false });

      // Apply filters
      if (read !== undefined) {
        query = query.eq('is_read', read === 'true');
      }

      // Apply pagination
      const limitNum = parseInt(limit as string, 10) || 50;
      const offsetNum = parseInt(offset as string, 10) || 0;
      query = query.range(offsetNum, offsetNum + limitNum - 1);

      const { data: recipients, error } = await query;

      if (error) {
        console.error('Error fetching organizer messages:', error);
        // Return empty array if table doesn't exist
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          return res.json({ success: true, items: [], total: 0 });
        }
        throw error;
      }

      // Transform data to match expected format
      const messages = (recipients || [])
        .filter((r: any) => r.message && r.message.status === 'sent')
        .map((r: any) => ({
          id: r.message.id,
          subject: r.message.subject,
          content: r.message.content,
          recipient_type: r.message.recipient_type,
          recipient_filter: r.message.recipient_filter,
          sent_by: r.message.sent_by,
          sent_by_name: r.message.sent_by_name,
          sent_by_email: r.message.sent_by_email,
          status: r.message.status,
          priority: r.message.priority,
          created_at: r.message.created_at,
          sent_at: r.message.sent_at,
          recipient: {
            id: r.id,
            is_read: r.is_read,
            read_at: r.read_at,
            replied: r.replied,
            replied_at: r.replied_at
          }
        }))
        // Apply client-side filters that can't be done in the join
        .filter((m: any) => {
          if (subject && !m.subject.toLowerCase().includes((subject as string).toLowerCase())) {
            return false;
          }
          if (priority && m.priority !== priority) {
            return false;
          }
          if (from) {
            const fromDate = new Date(from as string);
            const msgDate = new Date(m.sent_at || m.created_at);
            if (msgDate < fromDate) return false;
          }
          if (to) {
            const toDate = new Date(to as string);
            toDate.setHours(23, 59, 59, 999);
            const msgDate = new Date(m.sent_at || m.created_at);
            if (msgDate > toDate) return false;
          }
          return true;
        });

      return res.json({
        success: true,
        items: messages,
        total: messages.length
      });
    } catch (error: any) {
      console.error('Error in /api/organizer/messages:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Mark a message as read
  app.post("/api/organizer/messages/:messageId/read", async (req, res) => {
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

      const { messageId } = req.params;

      // Get user's username
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single();

      if (!profile?.username) {
        return res.status(404).json({ success: false, message: 'Profile not found' });
      }

      // First check if already read to avoid double counting
      const { data: existingRecipient } = await supabaseAdmin
        .from('organizer_message_recipients')
        .select('is_read')
        .eq('message_id', parseInt(messageId, 10))
        .eq('organizer_username', profile.username)
        .single();

      const wasAlreadyRead = existingRecipient?.is_read === true;

      // Update the recipient record
      const { data, error } = await supabaseAdmin
        .from('organizer_message_recipients')
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('message_id', parseInt(messageId, 10))
        .eq('organizer_username', profile.username)
        .select()
        .single();

      if (error) {
        console.error('Error marking message as read:', error);
        throw error;
      }

      // Only increment total_read if this is the first time reading
      if (!wasAlreadyRead) {
        // Get current total_read and increment it
        const { data: currentMessage } = await supabaseAdmin
          .from('organizer_messages')
          .select('total_read')
          .eq('id', parseInt(messageId, 10))
          .single();

        const newTotalRead = (currentMessage?.total_read || 0) + 1;

        await supabaseAdmin
          .from('organizer_messages')
          .update({ total_read: newTotalRead })
          .eq('id', parseInt(messageId, 10));
      }

      return res.json({ success: true, data });
    } catch (error: any) {
      console.error('Error in /api/organizer/messages/:messageId/read:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get unread message count for the authenticated organizer
  app.get("/api/organizer/messages/unread-count", async (req, res) => {
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

      // Get user's username
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('username, role')
        .eq('id', userId)
        .single();

      if (profile?.role !== 'organizer') {
        return res.json({ success: true, unread: 0 });
      }

      if (!profile?.username) {
        return res.json({ success: true, unread: 0 });
      }

      // Count unread messages
      const { count, error } = await supabaseAdmin
        .from('organizer_message_recipients')
        .select('id', { count: 'exact', head: true })
        .eq('organizer_username', profile.username)
        .eq('is_read', false);

      if (error) {
        console.error('Error getting unread count:', error);
        // Return 0 if table doesn't exist
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          return res.json({ success: true, unread: 0 });
        }
        throw error;
      }

      return res.json({ success: true, unread: count || 0 });
    } catch (error: any) {
      console.error('Error in /api/organizer/messages/unread-count:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });
}
