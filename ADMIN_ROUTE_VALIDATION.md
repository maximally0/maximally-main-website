# Admin Route Validation System

## Overview

This document describes the automated validation system that ensures all admin panel API calls have corresponding backend routes registered in production.

## The Problem

The admin panel is a standalone Vite app that calls the main website's API. In production, the API runs as a Netlify serverless function. Routes must be explicitly registered in `netlify/functions/api.ts` to work in production.

**Common Issue:** Routes work in development (`server/routes.ts`) but return 404 in production because they weren't registered in the Netlify function.

## The Solution

### Automated Validation Script

Location: `maximally-main-website/scripts/validate-admin-routes.ts`

**What it does:**
1. Scans all admin panel source files for API calls to `/api/admin/*` endpoints
2. Extracts the HTTP method (GET, POST, PUT, PATCH, DELETE)
3. Checks if each endpoint is registered in backend route modules
4. Verifies route modules are imported in `netlify/functions/api.ts`
5. Reports any missing routes

**Run it:**
```bash
cd maximally-main-website
npm run validate:admin-routes
```

### Success Output
```
✅ SUCCESS: All admin API calls have registered routes!

   Total API calls: 7
   All registered: 7
   Missing: 0
```

### Failure Output
```
❌ FAILURE: Some admin API calls are missing backend routes!

   Total API calls: 10
   Registered: 7
   Missing: 3

Missing Routes:

   ❌ POST /api/admin/organizer-applications/:id/approve
      Called in: admin-panel\src\pages\OrganizerApplications.tsx:105

   ❌ POST /api/admin/organizer-applications/:id/reject
      Called in: admin-panel\src\pages\OrganizerApplications.tsx:138

   ❌ DELETE /api/admin/organizer-applications/:id
      Called in: admin-panel\src\pages\OrganizerApplications.tsx:166
```

## How to Fix Missing Routes

### Step 1: Create Route Module

Create a new file in `server/routes/admin-*.ts`:

```typescript
// server/routes/admin-my-feature.ts
import { type Express } from "express";

export function registerAdminMyFeatureRoutes(app: Express) {
  // GET endpoint
  app.get("/api/admin/my-feature", async (req, res) => {
    // Implementation
  });

  // POST endpoint
  app.post("/api/admin/my-feature/:id/action", async (req, res) => {
    // Implementation
  });

  // DELETE endpoint
  app.delete("/api/admin/my-feature/:id", async (req, res) => {
    // Implementation
  });
}
```

### Step 2: Register in Netlify Function

Add to `netlify/functions/api.ts`:

```typescript
// 1. Import at the top
import { registerAdminMyFeatureRoutes } from "../../server/routes/admin-my-feature";

// 2. Register in the route registration section
registerAdminMyFeatureRoutes(app);
```

### Step 3: Verify

```bash
npm run validate:admin-routes
```

## Integration with Build Process

The validation script can be integrated into your build process:

### Option 1: Pre-build Check (Recommended)

Add to `package.json`:
```json
{
  "scripts": {
    "prebuild": "npm run validate:routes && npm run validate:admin-routes"
  }
}
```

This will automatically run before every build and fail if routes are missing.

### Option 2: CI/CD Check

Add to your CI/CD pipeline (e.g., GitHub Actions):
```yaml
- name: Validate Admin Routes
  run: npm run validate:admin-routes
```

### Option 3: Pre-commit Hook

Add to `.husky/pre-commit`:
```bash
npm run validate:admin-routes
```

## How the Script Works

### 1. Finding API Calls

The script scans all `.ts` and `.tsx` files in `admin-panel/src/` for:
- `fetch()` calls with `/api/admin/` endpoints
- `callMainWebsiteApi()` helper calls

It extracts:
- **Endpoint:** `/api/admin/organizer-applications/:id/approve`
- **Method:** POST, GET, DELETE, etc.
- **Location:** File path and line number

### 2. Finding Registered Routes

The script scans all files in `server/routes/` for:
- `app.get()`, `app.post()`, `app.put()`, `app.patch()`, `app.delete()` calls
- Endpoints matching `/api/admin/*` pattern

### 3. Matching

The script matches API calls to registered routes by:
- HTTP method (POST, GET, etc.)
- Endpoint path (with `:id` normalization)

### 4. Reporting

If any API calls don't have matching registered routes, the script:
- Lists all missing routes
- Shows where they're called from
- Exits with code 1 (fails the build)

## Best Practices

### ✅ DO

1. **Use Direct Supabase for Simple CRUD**
   ```typescript
   // Good - Direct Supabase
   const { data } = await supabase
     .from('hackathons')
     .select('*')
   ```

2. **Use Backend API for Complex Operations**
   ```typescript
   // Good - Backend API (sends emails, complex logic)
   await callMainWebsiteApi('/api/admin/organizer-applications/:id/approve', {
     method: 'POST'
   })
   ```

3. **Always Register Routes in Netlify Function**
   ```typescript
   // netlify/functions/api.ts
   registerAdminOrganizerApplicationRoutes(app);
   ```

4. **Run Validation Before Deployment**
   ```bash
   npm run validate:admin-routes
   ```

### ❌ DON'T

1. **Don't Create Routes Only in server/routes.ts**
   ```typescript
   // Bad - Only works in development
   // server/routes.ts
   app.post('/api/admin/my-feature', handler);
   ```

2. **Don't Forget to Import Route Modules**
   ```typescript
   // Bad - Route module exists but not imported
   // netlify/functions/api.ts
   // Missing: import { registerMyRoutes } from "../../server/routes/my-routes";
   ```

3. **Don't Hardcode URLs**
   ```typescript
   // Bad
   fetch('http://localhost:5002/api/admin/...')
   
   // Good
   fetch(`${getApiBaseUrl()}/api/admin/...`)
   ```

## Troubleshooting

### Script Reports False Positives

If the script reports routes that actually exist:

1. Check the route path matches exactly (including `:id` parameters)
2. Check the HTTP method matches
3. Verify the route module is imported in `netlify/functions/api.ts`

### Script Misses Real API Calls

If the script doesn't detect an API call:

1. Ensure the call uses `fetch()` or `callMainWebsiteApi()`
2. Ensure the endpoint includes `/api/admin/`
3. Check if the call is in a comment or example (these are skipped)

### Routes Work in Dev But Not Production

This is the exact problem this system prevents! If you encounter this:

1. Run `npm run validate:admin-routes`
2. Fix any missing routes
3. Deploy again

## Maintenance

### Updating the Script

The validation script is located at:
- `maximally-main-website/scripts/validate-admin-routes.ts`

If you need to update the detection logic:
1. Modify the script
2. Test with `npm run validate:admin-routes`
3. Verify it catches real issues and doesn't have false positives

### Adding New Patterns

If you introduce new patterns for API calls:

```typescript
// Add to API_CALL_PATTERNS in validate-admin-routes.ts
const API_CALL_PATTERNS = [
  /fetch\([`'"]([^`'"]*\/api\/admin\/[^`'"]*)[`'"]/g,
  /callMainWebsiteApi\([`'"]([^`'"]*\/api\/admin\/[^`'"]*)[`'"]/g,
  // Add your new pattern here
];
```

## Summary

This validation system ensures:
- ✅ All admin panel API calls have backend routes
- ✅ All routes are registered in production
- ✅ No more 404 errors in production
- ✅ Automated prevention of deployment issues
- ✅ Clear error messages when routes are missing

Run `npm run validate:admin-routes` before every deployment to ensure everything is properly configured!
