# 🚀 Deployment Steps - Fix ISP Blocking Issue

## 🎯 Current Status
- ✅ Code pushed to repository
- ✅ Netlify Functions created
- ❌ Environment variables not configured in Netlify
- ❌ Feature flags disabled (to prevent errors)

## 📋 Step-by-Step Deployment

### Step 1: Configure Netlify Environment Variables
Go to **Netlify Dashboard → Site Settings → Environment Variables** and add:

```bash
# Backend Variables (for Netlify Functions)
SUPABASE_URL=https://vbjqqspfosgelxhhqlks.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZianFxc3Bmb3NnZWx4aGhxbGtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQyOTY4NiwiZXhwIjoyMDczMDA1Njg2fQ.Ne_NPgkBlsxd7wPV1Ta7a9OeMgjvm6SwbwO8eYN_z0E
RESEND_API_KEY=re_biy4P12V_Mqc2Qm21v5bkGJaYWaAUvofK
FROM_EMAIL=noreply@maximally.in
RECAPTCHA_SECRET_KEY=6LcLn-UrAAAAAO-jx-QtVu7Orh2ry9b3ANCdpcuk
SESSION_SECRET=maximally-scheduler-2025-secret
SCHEDULER_SECRET=maximally-scheduler-2025-secret
```

### Step 2: Verify Build Settings
Ensure these settings in **Netlify Dashboard → Site Settings → Build & Deploy**:
- **Build Command**: `npm run build`
- **Publish Directory**: `dist/public`
- **Functions Directory**: `netlify/functions`

### Step 3: Test Netlify Functions
After deployment, test these endpoints:

```bash
# Test blogs function
curl https://maximally.in/.netlify/functions/blogs/getAll

# Expected response:
# {"success":true,"data":{"blogs":[...],"total":X}}

# Test hackathons function
curl https://maximally.in/.netlify/functions/hackathons/getAll

# Test auth function (should return error for invalid credentials)
curl -X POST https://maximally.in/.netlify/functions/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}'
```

### Step 4: Enable Blog API (Once Functions Work)
Add this environment variable in Netlify:
```bash
VITE_USE_API_BLOGS=true
```

### Step 5: Test Blog Page
Visit https://maximally.in/blog and verify:
- ✅ No console errors
- ✅ Blog posts load (if any exist)
- ✅ No calls to `supabase.co` in Network tab

### Step 6: Gradually Enable Other APIs
Once blogs work, enable other features:
```bash
# Week 2: Enable hackathons
VITE_USE_API_HACKATHONS=true

# Week 3: Enable auth
VITE_USE_API_AUTH=true
```

## 🔧 Troubleshooting

### If Functions Return 404:
- Check Functions Directory is set to `netlify/functions`
- Verify build completed successfully
- Check function files are in correct structure

### If Functions Return 500:
- Check environment variables are set correctly
- Check Netlify function logs in dashboard
- Verify Supabase credentials are correct

### If Still Getting "fetch failed":
- ISP blocking is still active
- Functions aren't properly configured
- Environment variables missing

## 🎯 Success Criteria
- ✅ Blog page loads without errors
- ✅ No direct calls to `supabase.co`
- ✅ Functions return proper JSON responses
- ✅ ISP blocking completely bypassed

## 🚨 Emergency Rollback
If issues occur, disable feature flags:
```bash
VITE_USE_API_AUTH=false
VITE_USE_API_BLOGS=false
VITE_USE_API_HACKATHONS=false
```

This will revert to direct Supabase calls (which may still be blocked, but won't cause JSON parsing errors).