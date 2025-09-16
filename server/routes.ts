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
      res.status(500).json({ error: "Failed to fetch hackathons" });
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
      res.status(500).json({ error: "Failed to fetch hackathon" });
    }
  });


  const httpServer = createServer(app);

  return httpServer;
}
