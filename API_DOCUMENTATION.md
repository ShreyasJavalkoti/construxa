# Construxa API Documentation

This document describes the available API endpoints for the Construxa application.

## Authentication

All API endpoints (except auth endpoints) require authentication. The authentication is handled via Supabase Auth using JWT tokens stored in HTTP-only cookies.

### Base URL
```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "full_name": "John Doe",
  "company": "Construction Co",
  "phone": "+1234567890"
}
```

**Response (201):**
```json
{
  "success": true,
  "user": { ... },
  "session": { ... }
}
```

### POST /api/auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": { ... },
  "session": { ... }
}
```

### POST /api/auth/logout
Logout the current user.

**Response (200):**
```json
{
  "success": true
}
```

## User Profile Endpoints

### GET /api/user/profile
Get the current user's profile.

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "company": "Construction Co",
    "phone": "+1234567890",
    "job_title": "Project Manager",
    "location": "New York, NY",
    "avatar_url": "https://...",
    "subscription_tier": "free",
    "projects_count": 5,
    "drawings_count": 12,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### PATCH /api/user/profile
Update the current user's profile.

**Request Body:**
```json
{
  "full_name": "John Doe Jr.",
  "company": "New Construction Co",
  "phone": "+1234567890",
  "job_title": "Senior PM",
  "location": "Boston, MA",
  "avatar_url": "https://..."
}
```

**Response (200):**
```json
{
  "user": { ... }
}
```

**Note:** The following fields are protected and cannot be updated via this endpoint:
- `id`, `email`, `subscription_tier`, `projects_count`, `drawings_count`, `created_at`, `updated_at`

## Project Endpoints

### GET /api/projects
Get all projects for the current user.

**Query Parameters:**
- None

**Response (200):**
```json
{
  "projects": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "name": "Downtown Office Building",
      "description": "5-story commercial building",
      "status": "active",
      "drawings_count": 8,
      "total_cost": 150000.00,
      "estimated_duration": 180,
      "start_date": "2024-01-01",
      "end_date": "2024-06-30",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /api/projects
Create a new project.

**Request Body:**
```json
{
  "name": "Downtown Office Building",
  "description": "5-story commercial building",
  "status": "draft",
  "start_date": "2024-01-01",
  "end_date": "2024-06-30",
  "estimated_duration": 180
}
```

**Required Fields:**
- `name` (string, non-empty)

**Optional Fields:**
- `description` (string)
- `status` (enum: "draft", "active", "completed") - defaults to "draft"
- `start_date` (date string)
- `end_date` (date string)
- `estimated_duration` (integer, days)

**Response (201):**
```json
{
  "project": { ... }
}
```

### GET /api/projects/:id
Get a single project with its drawings.

**Response (200):**
```json
{
  "project": {
    "id": "uuid",
    "user_id": "uuid",
    "name": "Downtown Office Building",
    "description": "5-story commercial building",
    "status": "active",
    "drawings_count": 8,
    "total_cost": 150000.00,
    "estimated_duration": 180,
    "start_date": "2024-01-01",
    "end_date": "2024-06-30",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "drawings": [
      {
        "id": "uuid",
        "project_id": "uuid",
        "user_id": "uuid",
        "name": "Floor Plan - Level 1",
        "file_path": "user_id/project_id/file.pdf",
        "file_size": 1024000,
        "file_type": "pdf",
        "category": "plan",
        "status": "analyzed",
        "analysis_result": { ... },
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### PATCH /api/projects/:id
Update a project.

**Request Body:**
```json
{
  "name": "Updated Project Name",
  "description": "Updated description",
  "status": "completed",
  "start_date": "2024-01-01",
  "end_date": "2024-06-30",
  "estimated_duration": 200
}
```

**Allowed Fields:**
- `name`, `description`, `status`, `start_date`, `end_date`, `estimated_duration`

**Response (200):**
```json
{
  "project": { ... }
}
```

### DELETE /api/projects/:id
Delete a project and all related data.

**Response (200):**
```json
{
  "success": true
}
```

**Note:** This will cascade delete:
- All drawings associated with the project
- All BOQ items
- All timeline tasks
- Files in storage

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Project name is required"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Project not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to create project"
}
```

## Future Endpoints (Planned)

The following endpoints are planned for future releases:

### Drawings
- `POST /api/projects/:id/drawings` - Upload a drawing
- `GET /api/drawings/:id` - Get drawing details
- `PATCH /api/drawings/:id` - Update drawing metadata
- `DELETE /api/drawings/:id` - Delete a drawing
- `POST /api/drawings/:id/analyze` - Trigger AI analysis

### BOQ (Bill of Quantities)
- `GET /api/projects/:id/boq` - Get BOQ items for a project
- `POST /api/projects/:id/boq` - Add BOQ items
- `PATCH /api/boq/:id` - Update a BOQ item
- `DELETE /api/boq/:id` - Delete a BOQ item
- `POST /api/projects/:id/boq/generate` - Generate BOQ from drawings

### Timeline
- `GET /api/projects/:id/timeline` - Get timeline tasks
- `POST /api/projects/:id/timeline` - Add timeline tasks
- `PATCH /api/timeline/:id` - Update a task
- `DELETE /api/timeline/:id` - Delete a task
- `POST /api/projects/:id/timeline/generate` - Generate timeline from BOQ

### Export
- `GET /api/projects/:id/export/pdf` - Export project as PDF
- `GET /api/projects/:id/export/excel` - Export BOQ as Excel

## Rate Limits

Current rate limits (subject to change):
- Authentication endpoints: 10 requests per minute
- Other endpoints: 100 requests per minute per user

## Support

For API issues or questions, please refer to:
- [Setup Guide](./SETUP_GUIDE.md)
- [Database Schema](./supabase/README.md)
- [Supabase Documentation](https://supabase.com/docs)
