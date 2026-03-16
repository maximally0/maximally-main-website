# ISP Blocking Mitigation Strategy

## Overview

Some Internet Service Providers (ISPs) in India block direct access to Supabase domains. This document outlines our comprehensive strategy to ensure uninterrupted service regardless of ISP restrictions.

## Problem

- **Direct Supabase Access**: Some ISPs block `*.supabase.co` domains
- **Admin Panel Impact**: Admin users cannot access hackathon management features
- **User Experience**: Service appears broken for affected users

## Solution Architecture

### 1. Environment Variable Fallbacks
```typescript
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'fallback_key'
```
- **Primary**: Load from environment variables
- **Fallback**: Use hardcoded values if env vars fail
- **Benefit**: Ensures service continuity even with deployment issues

### 2. API Routing Through Main Website
```typescript
// Instead of direct Supabase calls:
// supabase.from('table').select()

// Route through main website:
callMainWebsiteApi('/api/admin/hackathons')
```
- **Mechanism**: Admin panel → maximally.in → Supabase
- **Benefit**: ISPs don't block maximally.in domain
- **Transparency**: Same functionality, different routing

### 3. Automatic Fallback Detection
```typescript
if (baseUrl.includes('localhost:5002')) {
  // Check if local server is running
  // Fallback to direct Supabase if not
}
```
- **Development**: Auto-detects local server availability
- **Production**: Routes through main website API
- **Graceful Degradation**: Falls back to direct calls if needed

### 4. Service Role Key Security
- **Environment Variables**: Secure key storage
- **Fallback Protection**: Prevents service outages
- **RLS Bypass**: Admin operations work regardless of user permissions

## Implementation Details

### Admin Panel (`admin-panel/`)
- **Supabase Client**: Dual client setup (user + admin)
- **API Helpers**: Smart routing logic
- **Error Handling**: Graceful fallbacks
- **Environment**: Secure key management

### Main Website (`maximally-main-website/`)
- **API Endpoints**: Proxy Supabase operations
- **Authentication**: JWT token validation
- **CORS**: Proper cross-origin handling
- **Rate Limiting**: Prevent abuse

## Configuration

### Environment Variables
```env
# Admin Panel
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_key
VITE_USE_API=false  # Set to true to force API routing

# Main Website
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

### Feature Flags
```typescript
// Enable API routing for ISP blocking mitigation
export const USE_API = import.meta.env.VITE_USE_API === 'true'
```

## Benefits

1. **Reliability**: Service works regardless of ISP restrictions
2. **Transparency**: Users don't notice the mitigation
3. **Performance**: Minimal overhead for routing
4. **Security**: No compromise on data protection
5. **Scalability**: Handles increased load through main website

## Conclusion

This multi-layered approach ensures that ISP blocking cannot disrupt our service. The combination of environment variable fallbacks, API routing, and automatic detection provides a robust solution that maintains full functionality while being transparent to end users.