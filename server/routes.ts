import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Hackathon API routes
  app.get("/api/hackathons", async (req, res) => {
    try {
      const hackathons = await storage.getActiveHackathons();
      res.json(hackathons);
    } catch (error) {
      console.error("Error fetching hackathons:", error);
      // If DB is unreachable, return a lightweight fallback list so the UI can still render
      const fallback = [
        {
          id: -1,
          slug: "codehypothesis",
          title: "Code Hypothesis 24h",
          subtitle: "A small local fallback event",
          is_active: false,
        },
      ];
      res.status(502).json({ error: "Failed to fetch hackathons", fallback });
    }
  });

  app.get("/api/hackathons/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const hackathon = await storage.getHackathon(slug);
      
      if (!hackathon) {
        return res.status(404).json({ error: "Hackathon not found" });
      }
      
      res.json(hackathon);
    } catch (error) {
      console.error("Error fetching hackathon:", error);
      // common connectivity error -> return a 502 and a small static fallback for known slugs
      const { slug } = req.params;
      const fallbacks: Record<string, any> = {
        "codehypothesis": {
          id: -1,
          slug: "codehypothesis",
          title: "Code Hypothesis 24h (offline fallback)",
          description: "A local fallback description. DB unreachable.",
          is_active: false,
        },
        "protocol-404": {
          id: -2,
          slug: "protocol-404",
          title: "Protocol 404 (offline fallback)",
          description: "A local fallback description. DB unreachable.",
          is_active: false,
        },
      };

      if (fallbacks[slug]) {
        return res.status(502).json({ error: "DB unreachable", fallback: fallbacks[slug] });
      }

      res.status(502).json({ error: "Failed to fetch hackathon" });
    }
  });


  const httpServer = createServer(app);

  return httpServer;
}
