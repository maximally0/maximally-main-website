import type { Express, Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";

function bearerUserId(supabaseAdmin: any, token: string): Promise<string | null> {
  return supabaseAdmin.auth.getUser(token).then((r: any) => (r?.data?.user?.id ? r.data.user.id : null));
}

async function logAuditAction(
  supabaseAdmin: any,
  userId: string,
  action: string,
  entityType: string,
  entityId: string | null,
  details: any
) {
  try {
    await supabaseAdmin.from('audit_logs').insert({
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to log audit action:', error);
  }
}

export function registerFeaturedContentRoutes(app: Express) {
  const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;

  if (!supabaseAdmin) {
    console.error("Supabase admin client not available");
    return;
  }

  // Update featured blogs
  app.post("/api/admin/featured-blogs", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.toString().startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing bearer token' });
      }
      const token = authHeader.toString().slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin as any, token);
      if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });

      // Check if user is admin
      const { data: adminRole } = await supabaseAdmin
        .from('admin_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (!adminRole || !['super_admin', 'admin'].includes((adminRole as any).role)) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }

      const { slot_1_id, slot_2_id, slot_3_id } = req.body;

      // Get previous state for audit log
      const { data: previousState } = await supabaseAdmin
        .from('featured_blogs')
        .select('*')
        .eq('id', 1)
        .single();

      // Update featured blogs
      const { error } = await supabaseAdmin
        .from('featured_blogs')
        .upsert({
          id: 1,
          slot_1_id: slot_1_id || null,
          slot_2_id: slot_2_id || null,
          slot_3_id: slot_3_id || null,
          updated_at: new Date().toISOString(),
          updated_by: userId
        } as any);

      if (error) throw error;

      // Get blog titles for audit log
      const blogIds = [slot_1_id, slot_2_id, slot_3_id].filter(id => id !== null && id !== undefined);
      let blogTitles: Record<number, string> = {};
      
      if (blogIds.length > 0) {
        const { data: blogs } = await supabaseAdmin
          .from('blogs')
          .select('id, title')
          .in('id', blogIds);
        
        if (blogs) {
          blogTitles = blogs.reduce((acc: Record<number, string>, blog: any) => {
            acc[blog.id] = blog.title;
            return acc;
          }, {});
        }
      }

      // Log audit action
      await logAuditAction(
        supabaseAdmin,
        userId,
        'featured_blogs_updated',
        'featured_content',
        'featured_blogs',
        {
          previous: {
            slot_1: (previousState as any)?.slot_1_id,
            slot_2: (previousState as any)?.slot_2_id,
            slot_3: (previousState as any)?.slot_3_id
          },
          updated: {
            slot_1: slot_1_id || null,
            slot_2: slot_2_id || null,
            slot_3: slot_3_id || null
          },
          blog_titles: blogTitles
        }
      );

      return res.json({ success: true, message: 'Featured blogs updated successfully' });
    } catch (error: any) {
      console.error('Error updating featured blogs:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to update featured blogs' });
    }
  });

  // Update featured hackathons
  app.post("/api/admin/featured-hackathons", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.toString().startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing bearer token' });
      }
      const token = authHeader.toString().slice('Bearer '.length);
      const userId = await bearerUserId(supabaseAdmin as any, token);
      if (!userId) return res.status(401).json({ success: false, message: 'Invalid token' });

      // Check if user is admin
      const { data: adminRole } = await supabaseAdmin
        .from('admin_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (!adminRole || !['super_admin', 'admin'].includes((adminRole as any).role)) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }

      const { slots } = req.body;

      if (!Array.isArray(slots) || slots.length !== 6) {
        return res.status(400).json({ success: false, message: 'Invalid slots data' });
      }

      // Get previous state for audit log
      const { data: previousState } = await supabaseAdmin
        .from('featured_hackathons')
        .select('*')
        .eq('id', 1)
        .single();

      // Build update data
      const updateData: Record<string, any> = {
        id: 1,
        updated_at: new Date().toISOString(),
        updated_by: userId
      };

      slots.forEach((slot, index) => {
        updateData[`slot_${index + 1}_type`] = slot.type || null;
        updateData[`slot_${index + 1}_id`] = slot.id || null;
      });

      // Update featured hackathons
      const { error } = await supabaseAdmin
        .from('featured_hackathons')
        .upsert(updateData as any);

      if (error) throw error;

      // Get hackathon names for audit log
      const hackathonNames: Record<string, string> = {};
      
      for (const slot of slots) {
        if (slot.type && slot.id) {
          const tableName = slot.type === 'admin' ? 'hackathons' : 'organizer_hackathons';
          const nameField = slot.type === 'admin' ? 'title' : 'hackathon_name';
          
          const { data } = await supabaseAdmin
            .from(tableName)
            .select(`id, ${nameField}`)
            .eq('id', slot.id)
            .single();
          
          if (data) {
            hackathonNames[`${slot.type}-${slot.id}`] = (data as any)[nameField];
          }
        }
      }

      const prevState = previousState as any;

      // Log audit action
      await logAuditAction(
        supabaseAdmin,
        userId,
        'featured_hackathons_updated',
        'featured_content',
        'featured_hackathons',
        {
          previous: prevState ? {
            slot_1: { type: prevState.slot_1_type, id: prevState.slot_1_id },
            slot_2: { type: prevState.slot_2_type, id: prevState.slot_2_id },
            slot_3: { type: prevState.slot_3_type, id: prevState.slot_3_id },
            slot_4: { type: prevState.slot_4_type, id: prevState.slot_4_id },
            slot_5: { type: prevState.slot_5_type, id: prevState.slot_5_id },
            slot_6: { type: prevState.slot_6_type, id: prevState.slot_6_id }
          } : null,
          updated: {
            slot_1: slots[0],
            slot_2: slots[1],
            slot_3: slots[2],
            slot_4: slots[3],
            slot_5: slots[4],
            slot_6: slots[5]
          },
          hackathon_names: hackathonNames
        }
      );

      return res.json({ success: true, message: 'Featured hackathons updated successfully' });
    } catch (error: any) {
      console.error('Error updating featured hackathons:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to update featured hackathons' });
    }
  });
}
