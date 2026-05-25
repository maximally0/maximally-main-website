import type { Express, Request, Response } from "express";

export function registerBlogRoutes(app: Express) {
  app.get("/api/blogs", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as any;
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Supabase not configured" });
      }

      const page = parseInt(req.query.page as string) || 1;
      const pageSize = Math.min(parseInt(req.query.pageSize as string) || 10, 100);
      const search = (req.query.search as string) || "";

      let query = supabaseAdmin
        .from("blogs")
        .select("*", { count: "exact" })
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (search.trim()) {
        query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error("Blog list error:", error);
        return res.status(500).json({ success: false, message: error.message });
      }

      return res.json({
        success: true,
        data: { blogs: data || [], total: count || 0 },
        total: count || 0,
      });
    } catch (err: any) {
      console.error("Blog list error:", err);
      return res.status(500).json({ success: false, message: err?.message || "Failed to fetch blogs" });
    }
  });

  app.get("/api/blogs/:slug", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as any;
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Supabase not configured" });
      }

      const { slug } = req.params;
      if (!slug) {
        return res.status(400).json({ success: false, message: "Slug is required" });
      }

      const { data, error } = await supabaseAdmin
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

      if (error) {
        console.error("Blog fetch error:", error);
        return res.status(500).json({ success: false, message: error.message });
      }

      if (!data) {
        return res.status(404).json({ success: false, message: "Blog post not found" });
      }

      return res.json({ success: true, data: { blog: data } });
    } catch (err: any) {
      console.error("Blog fetch error:", err);
      return res.status(500).json({ success: false, message: err?.message || "Failed to fetch blog" });
    }
  });

  // POST /api/blogs — admin only, create blog
  app.post("/api/blogs", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as any;
      if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Supabase not configured" });

      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const { data: { user } } = await supabaseAdmin.auth.getUser(authHeader.slice(7));
      if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).maybeSingle();
      if (profile?.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden' });

      const { data, error } = await supabaseAdmin.from('blogs').insert(req.body).select().single();
      if (error) return res.status(500).json({ success: false, message: error.message });

      return res.status(201).json({ success: true, data });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err?.message || "Failed to create blog" });
    }
  });

  // PATCH /api/blogs/:id — admin only, update blog
  app.patch("/api/blogs/:id", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as any;
      if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Supabase not configured" });

      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const { data: { user } } = await supabaseAdmin.auth.getUser(authHeader.slice(7));
      if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).maybeSingle();
      if (profile?.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden' });

      const { data, error } = await supabaseAdmin.from('blogs').update({ ...req.body, updated_at: new Date().toISOString() }).eq('id', req.params.id).select().single();
      if (error) return res.status(500).json({ success: false, message: error.message });

      return res.json({ success: true, data });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err?.message || "Failed to update blog" });
    }
  });

  // DELETE /api/blogs/:id — admin only
  app.delete("/api/blogs/:id", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as any;
      if (!supabaseAdmin) return res.status(500).json({ success: false, message: "Supabase not configured" });

      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const { data: { user } } = await supabaseAdmin.auth.getUser(authHeader.slice(7));
      if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).maybeSingle();
      if (profile?.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden' });

      const { error } = await supabaseAdmin.from('blogs').delete().eq('id', req.params.id);
      if (error) return res.status(500).json({ success: false, message: error.message });

      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err?.message || "Failed to delete blog" });
    }
  });
}
