# 🚀 Netlify Functions Migration Guide

This guide explains how to migrate from direct Supabase calls to Netlify Functions to solve ISP blocking issues.

## 🔹 PART 1 — Architecture Overview

### Before (ISP Blocking Issue)
```
Browser → supabase.co (BLOCKED by ISPs) → Database
```

### After (Solution)
```
Browser → maximally.in/.netlify/functions/* → Supabase → Database
```

## 🔹 PART 2 — Environment Variables

### 🚫 Remove from Frontend (.env)
These should NOT be accessible to the browser:
```bash
# Remove these VITE_ prefixed variables (security risk)
VITE_SUPABASE_URL=https://vbjqqspfosgelxhhqlks.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### ✅ Add to Netlify Dashboard
Go to Netlify Dashboard → Site Settings → Environment Variables:

```bash
# Backend-only variables (secure)
SUPABASE_URL=https://vbjqqspfosgelxhhqlks.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZianFxc3Bmb3NnZWx4aGhxbGtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQyOTY4NiwiZXhwIjoyMDczMDA1Njg2fQ.Ne_NPgkBlsxd7wPV1Ta7a9OeMgjvm6SwbwO8eYN_z0E

# Email service
RESEND_API_KEY=re_biy4P12V_Mqc2Qm21v5bkGJaYWaAUvofK
FROM_EMAIL=noreply@maximally.in

# Other secrets
RECAPTCHA_SECRET_KEY=6LcLn-UrAAAAAO-jx-QtVu7Orh2ry9b3ANCdpcuk
SESSION_SECRET=maximally-scheduler-2025-secret
SCHEDULER_SECRET=maximally-scheduler-2025-secret
```

### 🔄 Keep for Gradual Migration
```bash
# Feature flags for gradual rollout
VITE_USE_API_AUTH=false      # Set to true when ready
VITE_USE_API_BLOGS=false     # Set to true when ready  
VITE_USE_API_HACKATHONS=false # Set to true when ready

# Legacy (remove after full migration)
VITE_SUPABASE_URL=https://vbjqqspfosgelxhhqlks.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

## 🔹 PART 3 — Deployment Steps

### Step 1: Deploy Functions
```bash
# Build the project
npm run build

# Deploy to Netlify
git add .
git commit -m "Add Netlify Functions backend proxy"
git push origin main
```

### Step 2: Configure Netlify Dashboard
1. Go to https://app.netlify.com/sites/[your-site]/settings/deploys
2. Set Build Command: `npm run build`
3. Set Publish Directory: `dist/public`
4. Set Functions Directory: `netlify/functions`

### Step 3: Add Environment Variables
1. Go to Site Settings → Environment Variables
2. Add all the backend variables listed above
3. Deploy the site

### Step 4: Test Functions
Test the endpoints:
```bash
# Test blogs
curl https://maximally.in/.netlify/functions/blogs/getAll

# Test hackathons  
curl https://maximally.in/.netlify/functions/hackathons/getAll

# Test login
curl -X POST https://maximally.in/.netlify/functions/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Step 5: Gradual Migration
Enable features one by one:

```bash
# Week 1: Enable blog API
VITE_USE_API_BLOGS=true

# Week 2: Enable hackathon API  
VITE_USE_API_HACKATHONS=true

# Week 3: Enable auth API
VITE_USE_API_AUTH=true
```

### Step 6: Final Cleanup
After all features are migrated and tested:
```bash
# Remove legacy Supabase frontend access
# VITE_SUPABASE_URL=  # DELETE
# VITE_SUPABASE_ANON_KEY=  # DELETE
```

## 🔹 PART 4 — Admin Panel Migration

### Update Vercel Environment Variables
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Remove: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
3. Add: `VITE_API_BASE_URL=https://maximally.in/.netlify/functions`

### Update Admin Panel Code
Replace direct Supabase calls with API client calls:
```typescript
// Before
const { data } = await supabase.from('blogs').select('*');

// After  
const { data } = await apiClient.getBlogs();
```

## 🔹 PART 5 — Testing Checklist

### Local Testing
- [ ] Netlify dev server starts: `npx netlify dev`
- [ ] Functions respond: `http://localhost:8888/.netlify/functions/blogs/getAll`
- [ ] Frontend connects to local functions
- [ ] Authentication works
- [ ] Data fetching works

### Production Testing
- [ ] Functions deploy successfully
- [ ] Environment variables are set
- [ ] CORS headers work
- [ ] Authentication flow works
- [ ] No direct supabase.co calls in browser network tab
- [ ] ISP blocking is resolved

## 🔹 PART 6 — Security Benefits

### ✅ What This Solves
- **ISP Blocking**: No more direct calls to supabase.co
- **Security**: Service role key never exposed to browser
- **Rate Limiting**: Can add rate limiting at function level
- **Monitoring**: Better logging and error tracking
- **Caching**: Can add caching layers

### ⚠️ Considerations
- **Latency**: Extra hop through Netlify functions
- **Cold Starts**: Functions may have cold start delays
- **Costs**: Netlify function execution costs
- **Complexity**: More moving parts to maintain

## 🔹 PART 7 — Future Scalability

### Recommended Structure
```
netlify/functions/
├── shared/
│   └── supabase.js          # Shared Supabase client
├── auth/
│   ├── login.js
│   ├── signup.js
│   └── refresh.js
├── blogs/
│   ├── getAll.js
│   ├── getBySlug.js
│   └── create.js
├── hackathons/
│   ├── getAll.js
│   ├── getById.js
│   └── register.js
└── user/
    ├── getProfile.js
    └── updateProfile.js
```

### Performance Optimizations
- Use edge functions for better performance
- Implement caching strategies
- Add request batching
- Use connection pooling

## 🔹 PART 8 — Rollback Plan

If issues occur, quickly rollback:
```bash
# Disable new API
VITE_USE_API_AUTH=false
VITE_USE_API_BLOGS=false  
VITE_USE_API_HACKATHONS=false

# Re-enable direct Supabase (temporary)
VITE_SUPABASE_URL=https://vbjqqspfosgelxhhqlks.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

## 🔹 PART 9 — Monitoring

### Key Metrics to Watch
- Function execution time
- Error rates
- Cold start frequency
- User authentication success rate
- Data loading performance

### Logging
Functions automatically log to Netlify dashboard:
- Go to Functions tab in Netlify dashboard
- View real-time logs
- Set up alerts for errors

---

## 🎯 Quick Start Commands

```bash
# Local development
npm run dev                    # Start main server
npx netlify dev               # Start Netlify functions

# Testing
node test-functions.js        # Test functions locally

# Deployment
git push origin main          # Auto-deploy to Netlify
```

This migration eliminates ISP blocking while maintaining all existing functionality!