---
title: "API Endpoints Reference"
description: "Complete reference for all Maximally API endpoints"
category: "api"
order: 2
---

# API Endpoints Reference

This comprehensive reference covers all available endpoints in the Maximally API. All endpoints require proper authentication unless otherwise noted.

## Base URL

```
Production: https://maximally.in/api
Development: http://localhost:5002/api
```

## Authentication Endpoints

### POST /auth/login
Authenticate user with email and password.

**Request:**
```json
{
  "email": "user@yourdomain.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@yourdomain.com",
      "username": "johndoe"
    },
    "session": {
      "access_token": "jwt-token",
      "refresh_token": "refresh-token",
      "expires_at": 1640995200
    }
  }
}
```

### POST /auth/refresh
Refresh access token using refresh token.

**Request:**
```json
{
  "refresh_token": "your-refresh-token"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "new-jwt-token",
    "refresh_token": "new-refresh-token",
    "expires_at": 1640998800
  }
}
```

### GET /auth/user
Get current authenticated user information.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "profile": {
      "full_name": "John Doe",
      "bio": "Developer and hackathon enthusiast"
    }
  }
}
```

## User Management Endpoints

### GET /users/profile/:username
Get public profile information for a user.

**Response:**
```json
{
  "success": true,
  "data": {
    "username": "johndoe",
    "full_name": "John Doe",
    "bio": "Developer and hackathon enthusiast",
    "location": "San Francisco, CA",
    "skills": ["JavaScript", "React", "Node.js"],
    "social_links": {
      "github": "https://github.com/johndoe",
      "linkedin": "https://linkedin.com/in/johndoe"
    },
    "achievements": [
      {
        "title": "First Place Winner",
        "event": "AI Hackathon 2024",
        "date": "2024-03-15"
      }
    ]
  }
}
```

### PUT /users/profile
Update current user's profile.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request:**
```json
{
  "full_name": "John Doe",
  "bio": "Full-stack developer passionate about AI",
  "location": "San Francisco, CA",
  "skills": ["JavaScript", "Python", "React"],
  "social_links": {
    "github": "https://github.com/johndoe"
  }
}
```

## Hackathon Endpoints

### GET /hackathons
List all public hackathons with filtering and pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)
- `status` (string): Filter by status (`upcoming`, `live`, `completed`)
- `theme` (string): Filter by theme
- `search` (string): Search in title and description

**Response:**
```json
{
  "success": true,
  "data": {
    "hackathons": [
      {
        "id": "uuid",
        "title": "AI Innovation Challenge",
        "description": "Build AI solutions for real-world problems",
        "theme": "Artificial Intelligence",
        "status": "upcoming",
        "start_date": "2024-04-01T00:00:00Z",
        "end_date": "2024-04-03T23:59:59Z",
        "registration_deadline": "2024-03-30T23:59:59Z",
        "max_team_size": 5,
        "participant_count": 150,
        "prize_pool": "$10,000",
        "organizer": {
          "username": "techcorp",
          "name": "Tech Corp"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  }
}
```

### GET /hackathons/:id
Get detailed information about a specific hackathon.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "AI Innovation Challenge",
    "description": "Detailed description...",
    "theme": "Artificial Intelligence",
    "status": "upcoming",
    "start_date": "2024-04-01T00:00:00Z",
    "end_date": "2024-04-03T23:59:59Z",
    "registration_deadline": "2024-03-30T23:59:59Z",
    "rules": "Competition rules and guidelines...",
    "judging_criteria": [
      {
        "name": "Innovation",
        "weight": 30,
        "description": "Originality and creativity"
      }
    ],
    "prizes": [
      {
        "position": 1,
        "title": "First Place",
        "description": "$5,000 cash prize"
      }
    ],
    "organizer": {
      "username": "techcorp",
      "name": "Tech Corp",
      "bio": "Leading technology company"
    },
    "judges": [
      {
        "name": "Jane Smith",
        "title": "Senior Engineer",
        "company": "Tech Corp"
      }
    ]
  }
}
```

### POST /hackathons
Create a new hackathon (organizers only).

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request:**
```json
{
  "title": "My Awesome Hackathon",
  "description": "Build something amazing",
  "theme": "Web Development",
  "start_date": "2024-04-01T00:00:00Z",
  "end_date": "2024-04-03T23:59:59Z",
  "registration_deadline": "2024-03-30T23:59:59Z",
  "max_team_size": 4,
  "rules": "Competition rules...",
  "judging_criteria": [
    {
      "name": "Technical Implementation",
      "weight": 40,
      "description": "Code quality and execution"
    }
  ]
}
```

## Registration Endpoints

### POST /hackathons/:id/register
Register for a hackathon.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request:**
```json
{
  "team_name": "Awesome Team",
  "team_members": [
    {
      "user_id": "uuid",
      "role": "developer"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "registration_id": "uuid",
    "team_id": "uuid",
    "status": "confirmed"
  }
}
```

### GET /hackathons/:id/registrations
Get registrations for a hackathon (organizers only).

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "registrations": [
      {
        "id": "uuid",
        "team_name": "Awesome Team",
        "team_size": 3,
        "registration_date": "2024-03-15T10:30:00Z",
        "status": "confirmed",
        "members": [
          {
            "username": "johndoe",
            "full_name": "John Doe",
            "role": "developer"
          }
        ]
      }
    ],
    "stats": {
      "total_registrations": 45,
      "total_participants": 180,
      "average_team_size": 4
    }
  }
}
```

## Team Management Endpoints

### POST /teams
Create a new team.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request:**
```json
{
  "name": "Team Awesome",
  "hackathon_id": "uuid",
  "description": "We build amazing things"
}
```

### GET /teams/:id
Get team information.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Team Awesome",
    "description": "We build amazing things",
    "hackathon_id": "uuid",
    "members": [
      {
        "user_id": "uuid",
        "username": "johndoe",
        "full_name": "John Doe",
        "role": "leader",
        "joined_at": "2024-03-15T10:30:00Z"
      }
    ],
    "created_at": "2024-03-15T10:30:00Z"
  }
}
```

### POST /teams/:id/invite
Invite a user to join the team.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request:**
```json
{
  "user_id": "uuid",
  "role": "member"
}
```

### POST /teams/:id/join
Join a team via invite token.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request:**
```json
{
  "invite_token": "invite-token-string"
}
```

## Submission Endpoints

### POST /hackathons/:id/submissions
Submit a project for a hackathon.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request:**
```json
{
  "title": "My Amazing Project",
  "description": "This project solves...",
  "demo_url": "https://myproject.com",
  "github_url": "https://github.com/user/project",
  "video_url": "https://youtube.com/watch?v=...",
  "technologies": ["React", "Node.js", "MongoDB"],
  "team_id": "uuid"
}
```

### GET /hackathons/:id/submissions
Get submissions for a hackathon.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `team_id` (string): Filter by team

**Response:**
```json
{
  "success": true,
  "data": {
    "submissions": [
      {
        "id": "uuid",
        "title": "My Amazing Project",
        "description": "Project description...",
        "demo_url": "https://myproject.com",
        "github_url": "https://github.com/user/project",
        "technologies": ["React", "Node.js"],
        "team": {
          "id": "uuid",
          "name": "Team Awesome",
          "members": [...]
        },
        "submitted_at": "2024-04-03T22:30:00Z",
        "scores": {
          "average": 8.5,
          "count": 3
        }
      }
    ]
  }
}
```

## Judging Endpoints

### GET /judge/hackathons
Get hackathons assigned to judge.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "hackathons": [
      {
        "id": "uuid",
        "title": "AI Innovation Challenge",
        "status": "judging",
        "submissions_count": 25,
        "judged_count": 10,
        "deadline": "2024-04-05T23:59:59Z"
      }
    ]
  }
}
```

### GET /judge/hackathons/:id/submissions
Get submissions to judge for a hackathon.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "submissions": [
      {
        "id": "uuid",
        "title": "Project Title",
        "description": "Description...",
        "demo_url": "https://demo.com",
        "team": {
          "name": "Team Name",
          "members": [...]
        },
        "judged": false
      }
    ]
  }
}
```

### POST /judge/submissions/:id/score
Submit scores for a submission.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request:**
```json
{
  "scores": {
    "innovation": 9,
    "technical": 8,
    "design": 7,
    "presentation": 8
  },
  "feedback": "Great project with innovative approach..."
}
```

## File Upload Endpoints

### POST /upload/image
Upload an image file.

**Headers:**
```
Authorization: Bearer <access-token>
Content-Type: multipart/form-data
```

**Request:**
Form data with `file` field containing the image.

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://storage.maximally.in/images/uuid.jpg",
    "filename": "uuid.jpg",
    "size": 1024000,
    "type": "image/jpeg"
  }
}
```

### POST /upload/document
Upload a document file.

**Headers:**
```
Authorization: Bearer <access-token>
Content-Type: multipart/form-data
```

**Supported formats:** PDF, DOC, DOCX, TXT, MD

## Analytics Endpoints

### GET /analytics/hackathon/:id
Get analytics for a hackathon (organizers only).

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "registrations": {
      "total": 150,
      "over_time": [
        {"date": "2024-03-01", "count": 10},
        {"date": "2024-03-02", "count": 25}
      ]
    },
    "submissions": {
      "total": 45,
      "completion_rate": 0.3
    },
    "engagement": {
      "page_views": 5000,
      "unique_visitors": 2500
    }
  }
}
```

## Error Responses

All endpoints return errors in a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Additional error details"
  }
}
```

### Common Error Codes

- `UNAUTHORIZED` (401): Invalid or missing authentication
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Invalid request data
- `RATE_LIMIT_EXCEEDED` (429): Too many requests
- `INTERNAL_ERROR` (500): Server error

## Rate Limiting

API requests are rate-limited per user:

- **Authenticated users**: 1000 requests per hour
- **Unauthenticated users**: 100 requests per hour
- **File uploads**: 50 requests per hour

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Pagination

List endpoints support pagination with these parameters:

- `page`: Page number (starts at 1)
- `limit`: Items per page (max 100)

Pagination info is included in responses:

```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8,
    "has_next": true,
    "has_prev": false
  }
}
```

## Webhooks

Subscribe to real-time events (coming soon):

- `hackathon.created`
- `hackathon.registration`
- `submission.created`
- `judging.completed`

## SDKs and Libraries

Official SDKs available for:

- **JavaScript/Node.js**: `npm install maximally-sdk`
- **Python**: `pip install maximally-sdk`
- **Go**: `go get github.com/maximally/go-sdk`

## Testing

Use our test environment for development:

```
Base URL: https://api-test.maximally.in
```

Test data is reset daily. Contact support for test accounts.

## Support

For API support:
- **Documentation**: [maximally.in/docs](https://maximally.in/docs)
- **Discord**: [discord.gg/maximally](https://discord.gg/maximally)
- **Email**: api@maximally.in

## Changelog

### v2.1.0 (2024-03-15)
- Added team management endpoints
- Improved error handling
- Added file upload support

### v2.0.0 (2024-02-01)
- Breaking: Updated authentication flow
- Added judging endpoints
- Improved rate limiting

### v1.0.0 (2024-01-01)
- Initial API release
- Basic hackathon and user management