# Deployment Guide

## Environment Variables for Netlify

Set these environment variables in your Netlify dashboard with your actual values:

### Required Environment Variables

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=your_database_connection_string
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
SESSION_SECRET=your_session_secret_key
```

## How to Set Environment Variables in Netlify

1. Go to your Netlify dashboard
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Click **Add a variable** for each one above
5. Copy-paste the **exact** values (including the long JWT tokens)

## Build Settings

Make sure your Netlify build settings are:
- **Build command**: `npm run build`
- **Publish directory**: `dist/public`
- **Node version**: 18 or higher

## What These Variables Do

- `SUPABASE_URL` & `SUPABASE_SERVICE_ROLE_KEY`: Server-side database access
- `DATABASE_URL`: Direct database connection
- `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`: Client-side database access
- `VITE_RECAPTCHA_SITE_KEY` & `RECAPTCHA_SECRET_KEY`: CAPTCHA functionality
- `SESSION_SECRET`: Session encryption

## Verification

After deployment:
1. **Test CAPTCHA**: Go to login/signup page - should show CAPTCHA widget
2. **Test Certificate Verification**: Visit `https://maximally.in/api/certificates/verify/CERT-HR85N6` - should return JSON, not HTML
3. **Test Frontend**: Visit `https://maximally.in/certificates/verify/CERT-HR85N6` - should show the verification page

## Troubleshooting

If you see:
- "CAPTCHA not configured" → Check `VITE_RECAPTCHA_SITE_KEY` is set correctly
- "Unexpected token '<'" → API routes are being intercepted (should be fixed now)
- Database errors → Check Supabase environment variables

## Single Environment File

All environment variables are now in the single `.env` file in the root directory. No more multiple env files!