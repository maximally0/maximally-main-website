import type { Express, Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";

export function registerBlogRoutes(app: Express) {
  app.get("/api/blogs", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Supabase not configured" });
      }

      const page = parseInt(req.query.page as string) || 1;
      const pageSize = Math.min(parseInt(req.query.pageSize as string) || 10, 100);
      const search = (req.query.search as string) || "";

      let query = supabaseAdmin
        .from("blogs")
        .select("*", { count: "exact" })
        .eq("status", "published")
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
        data: data || [],
        total: count || 0,
      });
    } catch (err: any) {
      console.error("Blog list error:", err);
      return res.status(500).json({ success: false, message: err?.message || "Failed to fetch blogs" });
    }
  });

  app.get("/api/blogs/:slug", async (req: Request, res: Response) => {
    try {
      const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient> | undefined;
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
        .eq("status", "published")
        .maybeSingle();

      if (error) {
        console.error("Blog fetch error:", error);
        return res.status(500).json({ success: false, message: error.message });
      }

      if (!data) {
        return res.status(404).json({ success: false, message: "Blog post not found" });
      }

      return res.json({ success: true, data });
    } catch (err: any) {
      console.error("Blog fetch error:", err);
      return res.status(500).json({ success: false, message: err?.message || "Failed to fetch blog" });
    }
  });
}
