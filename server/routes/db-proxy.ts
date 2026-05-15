// @ts-nocheck
/**
 * DB Proxy Route
 * Allows the admin panel frontend to query Neon PostgreSQL
 * through the main website API (bypasses ISP blocking of Supabase).
 * 
 * POST /api/db       — query builder proxy
 * POST /api/db/rpc   — RPC function proxy
 */
import type { Express, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

async function bearerUserId(supabaseAdmin: any, token: string, neonAuthUrl?: string): Promise<string | null> {
  // First try Supabase auth (for backward compatibility)
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (!error && user) return user.id;
  } catch {}

  // Fall back to Neon Auth token validation
  if (neonAuthUrl) {
    try {
      // Try JWT decode first (fast path)
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
        if (payload.sub && payload.email) {
          if (!payload.exp || payload.exp * 1000 > Date.now()) {
            return payload.sub;
          }
        }
      }
    } catch {}

    // Try Neon Auth session endpoint
    try {
      const res = await fetch(`${neonAuthUrl}/get-session`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const userId = data?.user?.id || data?.session?.userId;
        if (userId) return userId;
      }
    } catch {}
  }

  return null;
}

async function isAdminUser(supabaseAdmin: any, userId: string): Promise<boolean> {
  const { data } = await supabaseAdmin.from('profiles').select('role').eq('id', userId).maybeSingle();
  return data?.role === 'admin';
}

export function registerDbProxyRoutes(app: Express) {
  const supabaseAdmin = app.locals.supabaseAdmin;
  if (!supabaseAdmin) return;

  // Auth middleware for DB proxy
  const requireAdmin = async (req: Request, res: Response, next: any) => {
    // DEV BYPASS: allow requests with X-Dev-Bypass header + valid user ID
    if (process.env.NODE_ENV !== 'production' && req.headers['x-dev-bypass'] === 'true') {
      const userId = req.headers['x-user-id'] as string;
      if (userId) {
        const admin = await isAdminUser(supabaseAdmin, userId);
        if (admin) {
          (req as any).userId = userId;
          return next();
        }
      }
    }

    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ data: null, error: { message: 'Missing token' } });
    }
    const token = authHeader.slice(7);
    const neonAuthUrl = process.env.NEON_AUTH_URL;
    const userId = await bearerUserId(supabaseAdmin, token, neonAuthUrl);
    if (!userId) return res.status(401).json({ data: null, error: { message: 'Invalid token' } });
    const admin = await isAdminUser(supabaseAdmin, userId);
    if (!admin) return res.status(403).json({ data: null, error: { message: 'Admin access required' } });
    (req as any).userId = userId;
    next();
  };

  // Query builder proxy
  app.post('/api/db', requireAdmin, async (req: Request, res: Response) => {
    try {
      const { table, op, cols, filters, order, limit, offset, single, maybeSingle, count, head, payload, conflict } = req.body;

      if (!table || !op) return res.status(400).json({ data: null, error: { message: 'table and op required' } });

      // Block dangerous tables from frontend access
      const BLOCKED = ['auth'];
      if (BLOCKED.includes(table)) {
        return res.status(403).json({ data: null, error: { message: 'Access denied' } });
      }

      let query: any;

      if (op === 'select') {
        query = supabaseAdmin.from(table).select(cols || '*', count ? { count, head: head || false } : undefined);
      } else if (op === 'insert') {
        query = supabaseAdmin.from(table).insert(payload);
      } else if (op === 'update') {
        query = supabaseAdmin.from(table).update(payload);
      } else if (op === 'delete') {
        query = supabaseAdmin.from(table).delete();
      } else if (op === 'upsert') {
        query = supabaseAdmin.from(table).upsert(payload, conflict ? { onConflict: conflict } : undefined);
      } else {
        return res.status(400).json({ data: null, error: { message: `Unknown op: ${op}` } });
      }

      // Apply filters
      for (const f of (filters || [])) {
        if (f.op === 'or') { query = query.or(f.val); continue; }
        if (f.op === 'eq') query = query.eq(f.col, f.val);
        else if (f.op === 'neq') query = query.neq(f.col, f.val);
        else if (f.op === 'gt') query = query.gt(f.col, f.val);
        else if (f.op === 'gte') query = query.gte(f.col, f.val);
        else if (f.op === 'lt') query = query.lt(f.col, f.val);
        else if (f.op === 'lte') query = query.lte(f.col, f.val);
        else if (f.op === 'like') query = query.like(f.col, f.val);
        else if (f.op === 'ilike') query = query.ilike(f.col, f.val);
        else if (f.op === 'in') query = query.in(f.col, f.val);
        else if (f.op === 'is') query = query.is(f.col, f.val);
        else if (f.op === 'cs') query = query.contains(f.col, f.val);
      }

      // Apply order
      for (const o of (order || [])) {
        query = query.order(o.col, { ascending: o.asc });
      }

      if (limit !== null && limit !== undefined) query = query.limit(limit);
      if (offset !== null && offset !== undefined && limit !== null) {
        query = query.range(offset, offset + limit - 1);
      }
      if (single) query = query.single();
      else if (maybeSingle) query = query.maybeSingle();

      const result = await query;
      return res.json(result);
    } catch (e: any) {
      return res.status(500).json({ data: null, error: { message: e.message } });
    }
  });

  // RPC proxy
  app.post('/api/db/rpc', requireAdmin, async (req: Request, res: Response) => {
    try {
      const { fn, params } = req.body;
      if (!fn) return res.status(400).json({ data: null, error: { message: 'fn required' } });
      const result = await supabaseAdmin.rpc(fn, params || {});
      return res.json(result);
    } catch (e: any) {
      return res.status(500).json({ data: null, error: { message: e.message } });
    }
  });
}
