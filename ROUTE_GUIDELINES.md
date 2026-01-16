# API Route Guidelines

## 🚨 CRITICAL: Route Registration Rules

To prevent deployment issues where API endpoints are not accessible, **ALL API routes MUST follow these rules:**

---

## ✅ DO: Create Routes in Dedicated Modules

**Always create API routes in separate files under `server/routes/`**

### Example Structure:
```
server/routes/
├── organizer.ts
├── organizer-applications.ts  ✅ Good!
├── hackathon-registration.ts
└── certificates.ts
```

### Template for New Route Module:

```typescript
// server/routes/my-feature.ts
import type { Express, Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";

export function registerMyFeatureRoutes(app: Express) {
  const supabaseAdmin = app.locals.supabaseAdmin as ReturnType<typeof createClient>;

  app.post("/api/my-feature/action", async (req: Request, res: Response) => {
    try {
      // Your route logic here
      return res.json({ success: true });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });
}
```

---

## ✅ DO: Register Routes in Netlify Function

**After creating a route module, you MUST register it in `netlify/functions/api.ts`**

### Step 1: Import the module
```typescript
// netlify/functions/api.ts
import { registerMyFeatureRoutes } from "../../server/routes/my-feature";
```

### Step 2: Call the registration function
```typescript
// In the REGISTER ROUTE MODULES section
registerMyFeatureRoutes(app);
```

---

## ❌ DON'T: Add Routes to server/routes.ts

**NEVER add API routes directly to `server/routes.ts`**

### ❌ Bad Example:
```typescript
// server/routes.ts
export async function registerRoutes(app: Express) {
  app.post("/api/organizer/apply", async (req, res) => {  // ❌ DON'T DO THIS
    // This route will NOT work in production!
  });
}
```

### Why?
- `server/routes.ts` is used for local development only
- The Netlify function (`netlify/functions/api.ts`) doesn't import it
- Routes added here will work locally but **FAIL in production**

---

## 🔍 Validation Tools

### Automatic Validation

Routes are automatically validated:
- **Before every build** via `prebuild` script
- **On every commit** via pre-commit hook
- **In CI/CD** via GitHub Actions

### Manual Validation

Run these commands to check your routes:

```bash
# Validate all routes are properly registered
npm run validate:routes

# Check for orphaned routes (frontend calls with no backend)
npm run check:orphaned-routes
```

---

## 🛠️ Fixing Route Issues

### Issue: "Route not found in production"

**Symptoms:**
- Route works locally (`npm run dev`)
- Route fails in production with 404 error
- Error: "API endpoint not found"

**Solution:**
1. Check if route is in `server/routes.ts` ❌
2. Move route to dedicated module in `server/routes/` ✅
3. Import and register in `netlify/functions/api.ts` ✅
4. Run `npm run validate:routes` to verify ✅

### Issue: "Imported but not called"

**Error Message:**
```
❌ Found 1 imported route module(s) that are NOT called:
   - registerMyFeatureRoutes (imported but not called with app)
```

**Solution:**
Add the function call in the "REGISTER ROUTE MODULES" section:
```typescript
registerMyFeatureRoutes(app);
```

---

## 📋 Checklist for New Routes

When adding a new API endpoint:

- [ ] Create route in `server/routes/my-feature.ts`
- [ ] Export function named `registerMyFeatureRoutes`
- [ ] Import in `netlify/functions/api.ts`
- [ ] Call the function with `app` parameter
- [ ] Run `npm run validate:routes`
- [ ] Test locally with `npm run dev`
- [ ] Test build with `npm run build`
- [ ] Commit and push (pre-commit hook will validate)

---

## 🎯 Quick Reference

| Action | Command |
|--------|---------|
| Validate routes | `npm run validate:routes` |
| Check orphaned routes | `npm run check:orphaned-routes` |
| Build (with validation) | `npm run build` |
| Local development | `npm run dev` |

---

## 🚀 Deployment Checklist

Before deploying to production:

1. ✅ All routes in dedicated modules under `server/routes/`
2. ✅ All modules imported in `netlify/functions/api.ts`
3. ✅ All modules called with `app` parameter
4. ✅ `npm run validate:routes` passes
5. ✅ `npm run build` succeeds
6. ✅ Test critical endpoints in staging

---

## 📞 Need Help?

If you encounter route registration issues:

1. Run `npm run validate:routes` for detailed error messages
2. Check this guide for solutions
3. Review recent commits that added routes
4. Verify the route exists in `netlify/functions/api.ts`

---

**Remember: Routes in `server/routes.ts` = Local only ❌**  
**Routes in `server/routes/*.ts` + registered in Netlify = Production ready ✅**
