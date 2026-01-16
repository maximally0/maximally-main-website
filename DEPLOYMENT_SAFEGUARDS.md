# Deployment Safeguards

## Overview

This document describes the automated safeguards implemented to prevent API route registration issues in production deployments.

## Problem Statement

**Issue:** API routes defined in `server/routes.ts` work in local development but fail in production (Netlify) with "404 API endpoint not found" errors.

**Root Cause:** The Netlify serverless function (`netlify/functions/api.ts`) doesn't import `server/routes.ts`, only specific route modules from `server/routes/` directory.

**Impact:** Users encounter broken functionality in production that worked perfectly in development.

## Solution Implemented

### 1. Automated Route Validation

**Script:** `scripts/validate-routes.ts`

**What it does:**
- ✅ Detects routes in `server/routes.ts` (warns they may not work in production)
- ✅ Verifies all imported route modules are actually called
- ✅ Prevents builds if critical issues are found

**When it runs:**
- Before every build (`prebuild` script)
- On every commit (pre-commit hook)
- In CI/CD pipeline (GitHub Actions)

### 2. Orphaned Route Detection

**Script:** `scripts/check-orphaned-routes.ts`

**What it does:**
- Scans frontend for API calls
- Scans backend for route definitions
- Reports routes that are called but not defined

**When to run:**
- Manually: `npm run check:orphaned-routes`
- Before major deployments
- When debugging 404 errors

### 3. Developer Documentation

**Files created:**
- `ROUTE_GUIDELINES.md` - Complete guide for adding routes
- `scripts/README.md` - Documentation for validation scripts
- Inline comments in `server/routes.ts` and `netlify/functions/api.ts`

### 4. Pre-commit Hook

**File:** `.husky/pre-commit`

Automatically validates routes before allowing commits, catching issues early in the development cycle.

### 5. CI/CD Integration

**File:** `.github/workflows/route-validation.yml`

Runs validation on:
- Every pull request
- Every push to main branch
- Changes to route files

## Usage

### For Developers

**Adding a new API route:**

1. Create route module:
   ```bash
   # Create file: server/routes/my-feature.ts
   ```

2. Export registration function:
   ```typescript
   export function registerMyFeatureRoutes(app: Express) {
     app.post("/api/my-feature/action", async (req, res) => {
       // Your logic
     });
   }
   ```

3. Import in Netlify function:
   ```typescript
   // netlify/functions/api.ts
   import { registerMyFeatureRoutes } from "../../server/routes/my-feature";
   ```

4. Call the function:
   ```typescript
   // In REGISTER ROUTE MODULES section
   registerMyFeatureRoutes(app);
   ```

5. Validate:
   ```bash
   npm run validate:routes
   ```

### For Reviewers

**Checklist for PR reviews:**

- [ ] New routes are in `server/routes/` directory (not `server/routes.ts`)
- [ ] Route module is imported in `netlify/functions/api.ts`
- [ ] Route module is called in the registration section
- [ ] `npm run validate:routes` passes
- [ ] CI/CD checks pass

### For DevOps

**Deployment checklist:**

1. Ensure all CI/CD checks pass
2. Run `npm run validate:routes` locally
3. Run `npm run check:orphaned-routes` for warnings
4. Verify critical endpoints in staging
5. Deploy to production

## Validation Output Examples

### ✅ Success

```
🔍 Validating API routes...

⚠️  WARNINGS:
⚠️  Found 54 route(s) in server/routes.ts (these work locally but may not work in production)
💡 Best practice: Move routes to dedicated modules in server/routes/ for production compatibility

✅ All routes are properly registered!
```

### ❌ Critical Error

```
🔍 Validating API routes...

❌ ERRORS:

❌ CRITICAL: Found 1 imported route module(s) that are NOT called in netlify/functions/api.ts:
   - registerMyFeatureRoutes (imported but not called with app)

💡 Solution: Add the function call in the "REGISTER ROUTE MODULES" section:
   registerMyFeatureRoutes(app);
```

## Maintenance

### Updating Validation Scripts

**Location:** `scripts/validate-routes.ts` and `scripts/check-orphaned-routes.ts`

**When to update:**
- New route patterns are introduced
- Import/export conventions change
- Additional checks are needed

### Disabling Validation (Not Recommended)

If you absolutely must bypass validation:

```bash
# Skip pre-commit hook
git commit --no-verify

# Skip prebuild validation
npm run build:client && npm run build:server
```

**⚠️ Warning:** Bypassing validation can lead to production failures!

## Troubleshooting

### Validation fails but routes look correct

1. Check for typos in function names
2. Verify imports use correct paths
3. Ensure function is called (not just imported)
4. Run `npm run validate:routes` for detailed errors

### False positives in orphaned route check

Some dynamic routes may be flagged incorrectly. The script normalizes common patterns but manual verification may be needed.

### Pre-commit hook not running

1. Ensure Husky is installed: `npm install`
2. Check `.husky/pre-commit` exists and is executable
3. Verify Git hooks are enabled

## Metrics

**Before safeguards:**
- Route registration issues: Common
- Detection time: After production deployment
- Fix time: Hours (requires hotfix deployment)

**After safeguards:**
- Route registration issues: Prevented at commit time
- Detection time: Seconds (during development)
- Fix time: Minutes (before commit)

## Future Improvements

Potential enhancements:

1. **Runtime validation** - Check route availability on server startup
2. **E2E tests** - Automated tests for critical endpoints
3. **Route documentation** - Auto-generate API documentation from routes
4. **Performance monitoring** - Track route response times
5. **Dependency analysis** - Detect unused route modules

## Related Documentation

- [ROUTE_GUIDELINES.md](./ROUTE_GUIDELINES.md) - Complete guide for adding routes
- [scripts/README.md](./scripts/README.md) - Validation script documentation
- [netlify/functions/api.ts](./netlify/functions/api.ts) - Production API entry point
- [server/routes/](./server/routes/) - Route modules directory

## Support

For issues or questions:

1. Check validation error messages (they include solutions)
2. Review `ROUTE_GUIDELINES.md` for examples
3. Run `npm run check:orphaned-routes` for additional context
4. Check recent commits that modified routes

---

**Last Updated:** January 2025  
**Maintained By:** Development Team  
**Status:** Active
