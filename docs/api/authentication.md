---
title: "API Authentication"
description: "Complete guide to authenticating with the Maximally API"
category: "api"
order: 1
---

# API Authentication

The Maximally API uses modern authentication methods to ensure secure access to platform resources. This guide covers all authentication methods, security best practices, and implementation examples.

## Authentication Methods

### 1. Bearer Token Authentication

**Primary Method**: Used for most API endpoints requiring user authentication.

**How it works:**
1. User logs in through the web interface or mobile app
2. Supabase returns a JWT (JSON Web Token)
3. Include this token in the `Authorization` header for API requests
4. Token is validated on each request

**Implementation:**
```javascript
// Get token from Supabase auth
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;

// Use token in API requests
const response = await fetch('https://maximally.in/api/hackathons', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

**Token Properties:**
- **Expiration**: 1 hour (automatically refreshed by Supabase client)
- **Scope**: Full user permissions based on role
- **Format**: JWT with user ID, email, and role claims
- **Security**: Signed with secret key, includes expiration and issuer

### 2. API Key Authentication

**Use Case**: Server-to-server communication, webhooks, and automated systems.

**How to get an API key:**
1. Navigate to your profile settings
2. Go to "Developer" section
3. Generate a new API key
4. Copy and securely store the key

**Implementation:**
```javascript
const response = await fetch('https://maximally.in/api/hackathons', {
  headers: {
    'X-API-Key': 'your-api-key-here',
    'Content-Type': 'application/json'
  }
});
```

**API Key Properties:**
- **Expiration**: No expiration (can be revoked manually)
- **Scope**: Limited to read-only operations by default
- **Rate Limiting**: 1000 requests per hour
- **Security**: Should be stored securely and never exposed in client-side code

### 3. OAuth 2.0 (Third-party Applications)

**Use Case**: Third-party applications that need to access Maximally data on behalf of users.

**Supported Flows:**
- **Authorization Code Flow**: For web applications
- **PKCE Flow**: For mobile and single-page applications
- **Client Credentials Flow**: For server-to-server communication

**OAuth Endpoints:**
```
Authorization: https://maximally.in/oauth/authorize
Token: https://maximally.in/oauth/token
Revoke: https://maximally.in/oauth/revoke
```

**Example Authorization URL:**
```
https://maximally.in/oauth/authorize?
  response_type=code&
  client_id=your_client_id&
  redirect_uri=https://yourapp.com/callback&
  scope=read:profile read:hackathons&
  state=random_state_string
```

## Authentication Endpoints

### Login with Email/Password

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "participant"
  },
  "session": {
    "access_token": "jwt_token_here",
    "refresh_token": "refresh_token_here",
    "expires_in": 3600
  }
}
```

### OAuth Login (Google/GitHub)

**Endpoint:** `POST /api/auth/oauth`

**Request Body:**
```json
{
  "provider": "google",
  "code": "authorization_code_from_oauth_provider",
  "redirect_uri": "https://yourapp.com/callback"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@gmail.com",
    "role": "participant",
    "provider": "google"
  },
  "session": {
    "access_token": "jwt_token_here",
    "refresh_token": "refresh_token_here",
    "expires_in": 3600
  }
}
```

### Refresh Token

**Endpoint:** `POST /api/auth/refresh`

**Request Body:**
```json
{
  "refresh_token": "your_refresh_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "session": {
    "access_token": "new_jwt_token_here",
    "refresh_token": "new_refresh_token_here",
    "expires_in": 3600
  }
}
```

### Logout

**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer your_jwt_token_here
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

## User Roles & Permissions

### Role Hierarchy

**1. Participant**
- **Permissions**: Read hackathons, join events, submit projects, view own data
- **API Access**: Limited to participant-specific endpoints
- **Rate Limits**: 100 requests per minute

**2. Organizer**
- **Permissions**: All participant permissions + create/manage hackathons, invite judges
- **API Access**: Organizer management endpoints
- **Rate Limits**: 200 requests per minute

**3. Judge**
- **Permissions**: Participant permissions + evaluate projects, provide feedback
- **API Access**: Judging and evaluation endpoints
- **Rate Limits**: 150 requests per minute

**4. Mentor**
- **Permissions**: Participant permissions + access mentee information, schedule sessions
- **API Access**: Mentorship endpoints
- **Rate Limits**: 150 requests per minute

**5. Admin**
- **Permissions**: Full platform access, user management, system configuration
- **API Access**: All endpoints including admin functions
- **Rate Limits**: 500 requests per minute

### Permission Scopes

**Read Scopes:**
- `read:profile` - Access user profile information
- `read:hackathons` - View hackathon details and listings
- `read:projects` - Access project submissions and details
- `read:teams` - View team information and membership

**Write Scopes:**
- `write:profile` - Update user profile information
- `write:hackathons` - Create and modify hackathons (organizers only)
- `write:projects` - Submit and update projects
- `write:teams` - Create and manage teams

**Admin Scopes:**
- `admin:users` - Manage user accounts and roles
- `admin:platform` - System configuration and management
- `admin:analytics` - Access platform analytics and reports

## Security Best Practices

### Token Management

**Storage:**
- **Web Applications**: Store tokens in httpOnly cookies or secure localStorage
- **Mobile Apps**: Use secure keychain/keystore for token storage
- **Server Applications**: Store in environment variables or secure configuration

**Transmission:**
- Always use HTTPS for API requests
- Never include tokens in URL parameters
- Use proper Authorization headers

**Rotation:**
- Implement automatic token refresh
- Handle token expiration gracefully
- Revoke tokens when users log out

### API Key Security

**Generation:**
- Use cryptographically secure random generation
- Minimum 32 characters length
- Include both letters and numbers

**Storage:**
- Never commit API keys to version control
- Use environment variables or secure configuration management
- Rotate keys regularly (every 90 days recommended)

**Usage:**
- Restrict API key permissions to minimum required
- Monitor API key usage for unusual patterns
- Implement rate limiting per API key

### Rate Limiting

**Default Limits:**
- **Authenticated Users**: 100 requests per minute
- **API Keys**: 1000 requests per hour
- **OAuth Applications**: Based on approved rate limits

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

**Handling Rate Limits:**
```javascript
const response = await fetch('/api/hackathons');

if (response.status === 429) {
  const resetTime = response.headers.get('X-RateLimit-Reset');
  const waitTime = (resetTime * 1000) - Date.now();
  
  // Wait and retry
  setTimeout(() => {
    // Retry the request
  }, waitTime);
}
```

## Error Handling

### Authentication Errors

**401 Unauthorized:**
```json
{
  "success": false,
  "error": "unauthorized",
  "message": "Invalid or expired token"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "error": "forbidden",
  "message": "Insufficient permissions for this resource"
}
```

**429 Too Many Requests:**
```json
{
  "success": false,
  "error": "rate_limit_exceeded",
  "message": "Rate limit exceeded. Try again in 60 seconds.",
  "retry_after": 60
}
```

### Error Response Format

All API errors follow a consistent format:

```json
{
  "success": false,
  "error": "error_code",
  "message": "Human-readable error description",
  "details": {
    "field": "Additional error details if applicable"
  },
  "timestamp": "2024-01-17T12:00:00Z",
  "request_id": "req_123456789"
}
```

## Implementation Examples

### JavaScript/TypeScript (Web)

```typescript
class MaximallyAPI {
  private baseURL = 'https://maximally.in/api';
  private token: string | null = null;

  constructor(token?: string) {
    this.token = token;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }

  async getHackathons() {
    return this.request('/hackathons');
  }

  async createProject(hackathonId: string, projectData: any) {
    return this.request(`/hackathons/${hackathonId}/projects`, {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }
}

// Usage
const api = new MaximallyAPI('your_jwt_token_here');
const hackathons = await api.getHackathons();
```

### Python

```python
import requests
import json
from typing import Optional, Dict, Any

class MaximallyAPI:
    def __init__(self, token: Optional[str] = None, api_key: Optional[str] = None):
        self.base_url = 'https://maximally.in/api'
        self.session = requests.Session()
        
        if token:
            self.session.headers.update({'Authorization': f'Bearer {token}'})
        elif api_key:
            self.session.headers.update({'X-API-Key': api_key})
        
        self.session.headers.update({'Content-Type': 'application/json'})

    def request(self, method: str, endpoint: str, **kwargs) -> Dict[Any, Any]:
        url = f'{self.base_url}{endpoint}'
        response = self.session.request(method, url, **kwargs)
        
        if not response.ok:
            error_data = response.json()
            raise Exception(error_data.get('message', 'API request failed'))
        
        return response.json()

    def get_hackathons(self) -> Dict[Any, Any]:
        return self.request('GET', '/hackathons')

    def create_project(self, hackathon_id: str, project_data: Dict[Any, Any]) -> Dict[Any, Any]:
        return self.request('POST', f'/hackathons/{hackathon_id}/projects', 
                          json=project_data)

# Usage
api = MaximallyAPI(token='your_jwt_token_here')
hackathons = api.get_hackathons()
```

### cURL Examples

**Get hackathons with Bearer token:**
```bash
curl -X GET "https://maximally.in/api/hackathons" \
  -H "Authorization: Bearer your_jwt_token_here" \
  -H "Content-Type: application/json"
```

**Create project with API key:**
```bash
curl -X POST "https://maximally.in/api/hackathons/123/projects" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Awesome Project",
    "description": "A revolutionary solution",
    "repository_url": "https://github.com/user/project"
  }'
```

## Testing Authentication

### Test Endpoints

**Check Authentication Status:**
```
GET /api/auth/me
Authorization: Bearer your_token_here
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "participant",
    "permissions": ["read:profile", "read:hackathons"]
  }
}
```

**Validate API Key:**
```
GET /api/auth/validate-key
X-API-Key: your_api_key_here
```

**Response:**
```json
{
  "success": true,
  "key": {
    "id": "key_uuid",
    "name": "My API Key",
    "permissions": ["read:hackathons"],
    "rate_limit": 1000,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### Postman Collection

We provide a comprehensive Postman collection for testing all authentication methods:

**Download:** [Maximally API Postman Collection](https://maximally.in/api/postman-collection.json)

**Includes:**
- Pre-configured authentication methods
- Environment variables for easy testing
- Example requests for all endpoints
- Automated token refresh workflows

## Troubleshooting

### Common Issues

**1. Token Expired**
- **Symptom**: 401 Unauthorized responses
- **Solution**: Implement automatic token refresh or re-authenticate

**2. Invalid API Key**
- **Symptom**: 403 Forbidden responses
- **Solution**: Verify API key is correct and has required permissions

**3. Rate Limit Exceeded**
- **Symptom**: 429 Too Many Requests responses
- **Solution**: Implement exponential backoff and respect rate limit headers

**4. CORS Issues**
- **Symptom**: Browser blocks requests from web applications
- **Solution**: Ensure your domain is whitelisted or use server-side proxy

### Debug Mode

Enable debug mode to get detailed authentication information:

```javascript
const api = new MaximallyAPI(token, { debug: true });
```

This will log:
- Request headers and authentication method
- Token validation status
- Rate limit information
- Detailed error messages

### Support

**Documentation:** [https://docs.maximally.in](https://docs.maximally.in)
**API Status:** [https://status.maximally.in](https://status.maximally.in)
**Support Email:** [api-support@maximally.in](mailto:api-support@maximally.in)
**Discord:** [#api-support channel](https://discord.gg/maximally)

---

**Ready to start building?** Get your API credentials from your [profile settings](https://maximally.in/profile) and start integrating with the Maximally platform! 🚀