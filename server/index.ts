import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import dotenv from "dotenv";
import { runAutoMigrations } from "./auto-migrate";
import { getSupabaseAdmin } from "./supabaseAdmin";

// Load environment variables from .env file
dotenv.config();

// Set NODE_ENV if not set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS middleware - allow admin panel and Replit proxy to make requests
app.use((_req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',  // Added for admin panel
    'http://localhost:5002',
    'http://localhost:5001',
    'https://maximally.in',
    'https://maximally-admin-panel.vercel.app'
  ];

  const origin = _req.headers.origin;
  const isAllowed = origin && (
    allowedOrigins.includes(origin) ||
    /\.replit\.dev$/.test(origin) ||
    /\.repl\.co$/.test(origin) ||
    /\.replit\.app$/.test(origin)
  );

  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (_req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// Basic security headers without adding deps
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-XSS-Protection', '0');
  // Avoid a strict CSP here to not break Vite/SPA; can be added later when fully audited
  next();
});

// Redirect /vibe to vibe-a-thon.devpost.com
app.get('/vibe', (_req: Request, res: Response) => {
  res.redirect(301, 'https://vibe-a-thon.devpost.com');
});

// Initialize Supabase admin client
(() => {
  try {
    app.locals.supabaseAdmin = getSupabaseAdmin();
    log("✓ Supabase admin client initialized successfully");
    runAutoMigrations();
  } catch (error: any) {
    log(`✗ Failed to initialize Supabase admin client: ${error.message}`);
    throw error;
  }
})();

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // error handling must be registered AFTER all routes are registered.
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = process.env.PORT || 5000;
  server.listen({
    port,
    host: "0.0.0.0",
  }, () => {
    log(`serving on port ${port}`);
  });
})();
