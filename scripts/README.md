# Route Validation Scripts

This directory contains automated scripts to prevent API route registration issues in production.

## Scripts

### 1. `validate-routes.ts`

**Purpose:** Ensures all API routes are properly registered in the Netlify function.

**What it checks:**
- ✅ No routes defined in `server/routes.ts` (they won't work in production)
- ✅ All imported route modules are actually called
- ⚠️ All route files have corresponding imports

**Usage:**
```bash
npm run validate:routes
```

**When it runs:**
- Automatically before every build (`prebuild` script)
- On every commit (pre-commit hook)
- In CI/CD pipeline (GitHub Actions)

**Example Output:**
```
🔍 Validating API routes...

❌ ERRORS:

❌ Found 1 route(s) in server/routes.ts that may not be registered:
   - /api/organizer/apply

💡 Solution: Move these routes to a dedicated module in server/routes/
```

---

### 2. `check-orphaned-routes.ts`

**Purpose:** Finds API endpoints called from the frontend that might not exist in the backend.

**What it checks:**
- 📊 Scans all frontend files for API calls
- 📊 Scans all backend files for route definitions
- ⚠️ Reports routes that are called but not defined

**Usage:**
```bash
npm run check:orphaned-routes
```

**When to run:**
- After adding new API calls in frontend
- Before major deployments
- When debugging "404 Not Found" errors

**Example Output:**
```
🔍 Checking for orphaned API routes...

📊 Found 45 unique API calls in frontend
📊 Found 42 unique routes in backend

⚠️  POTENTIALLY ORPHANED ROUTES:

   ❌ /api/organizer/apply
   ❌ /api/user/settings
   ❌ /api/hackathon/123/register

💡 Note: Some routes might use dynamic parameters. Please verify manually.
```

---

## How It Works

### Route Detection

The scripts use regex patterns to detect:

**Backend routes:**
```typescript
app.get("/api/users", ...)
app.post("/api/organizer/apply", ...)
```

**Frontend API calls:**
```typescript
apiRequest('/api/organizer/apply', ...)
fetch('/api/users')
axios.post('/api/hackathon/register')
```

### Validation Logic

1. **Extract all routes** from `server/routes.ts`
2. **Extract all route modules** from `server/routes/*.ts`
3. **Check imports** in `netlify/functions/api.ts`
4. **Verify function calls** for each imported module
5. **Report issues** with actionable solutions

---

## Integration

### Package.json Scripts

```json
{
  "scripts": {
    "validate:routes": "tsx scripts/validate-routes.ts",
    "check:orphaned-routes": "tsx scripts/check-orphaned-routes.ts",
    "prebuild": "npm run validate:routes"
  }
}
```

### Pre-commit Hook

Located at `.husky/pre-commit`:
```bash
#!/usr/bin/env sh
npm run validate:routes
```

### GitHub Actions

Located at `.github/workflows/route-validation.yml`:
- Runs on every PR
- Runs on push to main
- Validates routes before deployment

---

## Troubleshooting

### Script fails with "Cannot find module"

**Solution:** Install dependencies
```bash
npm install
```

### False positives for dynamic routes

**Example:** `/api/hackathon/123/register` vs `/api/hackathon/:id/register`

**Solution:** The script normalizes common patterns, but some false positives may occur. Verify manually.

### Script passes but route still fails in production

**Possible causes:**
1. Route is in `server/routes.ts` instead of a module
2. Module is imported but not called
3. Typo in route path
4. Environment variables missing

**Solution:** Run both validation scripts and check the guidelines in `ROUTE_GUIDELINES.md`

---

## Extending the Scripts

### Adding New Patterns

To detect additional API call patterns, edit the regex in `check-orphaned-routes.ts`:

```typescript
const patterns = [
  /apiRequest\s*\(\s*['"]([^'"]+)['"]/g,
  /yourCustomPattern\s*\(\s*['"]([^'"]+)['"]/g,  // Add here
];
```

### Adding New Checks

To add new validation rules, edit `validate-routes.ts`:

```typescript
function validateRoutes(): ValidationResult {
  // Add your custom validation logic here
}
```

---

## Best Practices

1. **Run validation before committing**
   ```bash
   npm run validate:routes
   ```

2. **Check for orphaned routes periodically**
   ```bash
   npm run check:orphaned-routes
   ```

3. **Review validation errors carefully**
   - Don't ignore warnings
   - Fix issues before deploying

4. **Keep scripts updated**
   - Update patterns as codebase evolves
   - Add new checks as needed

---

## Related Documentation

- [ROUTE_GUIDELINES.md](../ROUTE_GUIDELINES.md) - Complete guide for adding routes
- [netlify/functions/api.ts](../netlify/functions/api.ts) - Main API entry point
- [server/routes/](../server/routes/) - Route modules directory

---

## Support

If you encounter issues with the validation scripts:

1. Check the error message for specific guidance
2. Review `ROUTE_GUIDELINES.md` for solutions
3. Run `npm run check:orphaned-routes` for additional context
4. Verify your changes against the checklist in the guidelines
