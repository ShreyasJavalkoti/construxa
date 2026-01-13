# Construxa - Testing Checklist

This document provides a comprehensive testing checklist for verifying the Supabase database schema and backend integration.

## Prerequisites

Before starting tests:
- [ ] Supabase project is created
- [ ] All migrations have been run successfully (00001, 00002, 00003, 00004)
- [ ] Environment variables are configured in `.env.local`
- [ ] Application is running (`npm run dev`)
- [ ] `drawings` storage bucket is created

## Database Schema Tests

### Tables Creation
- [ ] `profiles` table exists
- [ ] `projects` table exists
- [ ] `drawings` table exists
- [ ] `boq_items` table exists
- [ ] `timeline_tasks` table exists

**Verification Query:**
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

### Row Level Security (RLS)
- [ ] RLS is enabled on `profiles` table
- [ ] RLS is enabled on `projects` table
- [ ] RLS is enabled on `drawings` table
- [ ] RLS is enabled on `boq_items` table
- [ ] RLS is enabled on `timeline_tasks` table

**Verification Query:**
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

### RLS Policies
- [ ] Profile SELECT policy exists
- [ ] Profile UPDATE policy exists
- [ ] Profile INSERT policy exists
- [ ] Project SELECT policy exists
- [ ] Project INSERT policy exists
- [ ] Project UPDATE policy exists
- [ ] Project DELETE policy exists
- [ ] Similar policies for drawings, boq_items, timeline_tasks

**Verification Query:**
```sql
SELECT schemaname, tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### Functions and Triggers
- [ ] `handle_new_user()` function exists
- [ ] `on_auth_user_created` trigger exists
- [ ] `handle_updated_at()` function exists
- [ ] Updated triggers on profiles, projects, drawings
- [ ] `increment_project_drawings_count()` function exists
- [ ] `decrement_project_drawings_count()` function exists
- [ ] `increment_profile_projects_count()` function exists
- [ ] `decrement_profile_projects_count()` function exists
- [ ] `update_project_total_cost()` function exists

**Verification Query:**
```sql
SELECT trigger_name, event_object_table, action_statement 
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;
```

### Storage Setup
- [ ] `drawings` bucket exists
- [ ] Bucket is set to private (not public)
- [ ] Storage upload policy exists
- [ ] Storage select policy exists
- [ ] Storage update policy exists
- [ ] Storage delete policy exists

**Verification Query:**
```sql
SELECT policyname, cmd, tablename 
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
ORDER BY policyname;
```

## Authentication Tests

### User Registration
- [ ] Can access signup page at `/signup`
- [ ] Can submit registration form with valid data
- [ ] User is created in `auth.users` table
- [ ] Profile is auto-created in `profiles` table
- [ ] Profile has correct email
- [ ] Profile defaults: `subscription_tier = 'free'`, `projects_count = 0`, `drawings_count = 0`
- [ ] Timestamps are set correctly (`created_at`, `updated_at`)

**Test Steps:**
1. Navigate to http://localhost:3000/signup
2. Fill in email, password, and optional fields
3. Click "Sign Up"
4. Verify redirect to dashboard
5. Check database for new user and profile

**Verification Query:**
```sql
SELECT id, email, full_name, company, subscription_tier, projects_count, drawings_count
FROM profiles
WHERE email = 'test@example.com';
```

### User Login
- [ ] Can access login page at `/login`
- [ ] Can login with correct credentials
- [ ] Cannot login with incorrect credentials
- [ ] Session is created and stored
- [ ] Redirect to dashboard after successful login

### User Logout
- [ ] Can logout from dashboard
- [ ] Session is cleared
- [ ] Redirect to home/login page
- [ ] Cannot access protected routes after logout

## Profile Tests

### Get Profile
- [ ] `GET /api/user/profile` returns current user's profile
- [ ] Response includes all profile fields
- [ ] Correct `projects_count` is displayed
- [ ] Correct `drawings_count` is displayed

**Test Command:**
```bash
curl -X GET http://localhost:3000/api/user/profile \
  -H "Cookie: your-session-cookie"
```

### Update Profile
- [ ] `PATCH /api/user/profile` updates allowed fields
- [ ] Can update `full_name`
- [ ] Can update `company`
- [ ] Can update `phone`
- [ ] Can update `job_title`
- [ ] Can update `location`
- [ ] Can update `avatar_url`
- [ ] Cannot update `id`
- [ ] Cannot update `email`
- [ ] Cannot update `subscription_tier`
- [ ] Cannot update `projects_count`
- [ ] Cannot update `drawings_count`
- [ ] `updated_at` timestamp is auto-updated

**Test Command:**
```bash
curl -X PATCH http://localhost:3000/api/user/profile \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{"full_name":"Updated Name","company":"New Company"}'
```

## Project Tests

### Create Project
- [ ] `POST /api/projects` creates a new project
- [ ] Project is created with correct `user_id`
- [ ] Required field `name` is validated
- [ ] Optional fields are saved correctly
- [ ] Default status is `draft`
- [ ] `projects_count` on profile is incremented
- [ ] Timestamps are set correctly

**Test Command:**
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "name":"Test Project",
    "description":"Test Description",
    "status":"active",
    "start_date":"2024-01-01",
    "end_date":"2024-06-30",
    "estimated_duration":180
  }'
```

**Verification Query:**
```sql
-- Check project was created
SELECT * FROM projects WHERE name = 'Test Project';

-- Check profile projects_count was incremented
SELECT projects_count FROM profiles WHERE id = 'user_id';
```

### List Projects
- [ ] `GET /api/projects` returns user's projects
- [ ] Only returns projects owned by current user
- [ ] Projects are ordered by `created_at` descending
- [ ] Empty array returned when no projects exist

**Test Command:**
```bash
curl -X GET http://localhost:3000/api/projects \
  -H "Cookie: your-session-cookie"
```

### Get Single Project
- [ ] `GET /api/projects/:id` returns project details
- [ ] Returns project with all fields
- [ ] Includes drawings array
- [ ] Returns 404 for non-existent project
- [ ] Returns 404 for projects owned by other users

**Test Command:**
```bash
curl -X GET http://localhost:3000/api/projects/{project-id} \
  -H "Cookie: your-session-cookie"
```

### Update Project
- [ ] `PATCH /api/projects/:id` updates project
- [ ] Can update `name`
- [ ] Can update `description`
- [ ] Can update `status`
- [ ] Can update `start_date` and `end_date`
- [ ] Can update `estimated_duration`
- [ ] Cannot update `user_id`
- [ ] Cannot update `drawings_count`
- [ ] Cannot update `total_cost` (calculated from BOQ)
- [ ] `updated_at` timestamp is auto-updated
- [ ] Can only update own projects

**Test Command:**
```bash
curl -X PATCH http://localhost:3000/api/projects/{project-id} \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{"name":"Updated Project Name","status":"completed"}'
```

### Delete Project
- [ ] `DELETE /api/projects/:id` deletes project
- [ ] Project is removed from database
- [ ] Related drawings are deleted (cascade)
- [ ] Related BOQ items are deleted (cascade)
- [ ] Related timeline tasks are deleted (cascade)
- [ ] Files in storage are NOT auto-deleted (manual cleanup needed)
- [ ] `projects_count` on profile is decremented
- [ ] Can only delete own projects

**Test Command:**
```bash
curl -X DELETE http://localhost:3000/api/projects/{project-id} \
  -H "Cookie: your-session-cookie"
```

**Verification Query:**
```sql
-- Check project was deleted
SELECT * FROM projects WHERE id = 'project_id';  -- Should return 0 rows

-- Check profile projects_count was decremented
SELECT projects_count FROM profiles WHERE id = 'user_id';

-- Check related data was deleted
SELECT * FROM drawings WHERE project_id = 'project_id';  -- Should return 0 rows
SELECT * FROM boq_items WHERE project_id = 'project_id';  -- Should return 0 rows
SELECT * FROM timeline_tasks WHERE project_id = 'project_id';  -- Should return 0 rows
```

## Drawing Tests (When Implemented)

### Upload Drawing
- [ ] Can upload file to storage
- [ ] Drawing record is created in database
- [ ] `drawings_count` on project is incremented
- [ ] `drawings_count` on profile is incremented
- [ ] File is stored in correct path: `user_id/project_id/filename`

### List Drawings
- [ ] Can list drawings for a project
- [ ] Only shows drawings from user's projects
- [ ] Drawings are ordered by `created_at` descending

### Delete Drawing
- [ ] Can delete drawing record
- [ ] File is removed from storage
- [ ] `drawings_count` on project is decremented
- [ ] `drawings_count` on profile is decremented

## BOQ Tests (When Implemented)

### Create BOQ Items
- [ ] Can create BOQ item for a project
- [ ] `amount` is auto-calculated (quantity * rate)
- [ ] `total_cost` on project is updated

### Update BOQ Item
- [ ] Can update quantity
- [ ] Can update rate
- [ ] `amount` is recalculated automatically
- [ ] `total_cost` on project is updated

### Delete BOQ Item
- [ ] Can delete BOQ item
- [ ] `total_cost` on project is updated

## Timeline Tests (When Implemented)

### Create Timeline Task
- [ ] Can create timeline task for a project
- [ ] Dependencies array is stored correctly
- [ ] Tasks can reference other task IDs

### Update Timeline Task
- [ ] Can update task status
- [ ] Can update progress percentage
- [ ] Can modify dependencies

## Integration Tests

### Complete User Flow
- [ ] New user signs up
- [ ] Profile is auto-created
- [ ] User creates first project
- [ ] `projects_count` = 1
- [ ] User uploads drawing (when implemented)
- [ ] `drawings_count` = 1 on both profile and project
- [ ] User creates BOQ items (when implemented)
- [ ] `total_cost` is calculated on project
- [ ] User creates timeline tasks (when implemented)
- [ ] User deletes project
- [ ] All related data is cleaned up
- [ ] Counters are updated correctly

### Multi-Project Flow
- [ ] User creates multiple projects
- [ ] Can switch between projects
- [ ] Each project has separate drawings/BOQ/timeline
- [ ] Deleting one project doesn't affect others
- [ ] Counters are accurate

### RLS Security Tests
- [ ] User A cannot see User B's projects
- [ ] User A cannot update User B's projects
- [ ] User A cannot delete User B's projects
- [ ] User A cannot see User B's drawings
- [ ] Direct API calls with manipulated IDs are blocked

## Performance Tests

- [ ] Dashboard loads within 2 seconds
- [ ] Project list loads within 1 second
- [ ] Project details load within 1 second
- [ ] Profile updates are instant (<500ms)
- [ ] Database queries use proper indexes

## Error Handling Tests

- [ ] Invalid email format is rejected
- [ ] Weak passwords are rejected
- [ ] Duplicate email registration is prevented
- [ ] Missing required fields return 400 errors
- [ ] Non-existent resource IDs return 404 errors
- [ ] Unauthorized requests return 401 errors
- [ ] Server errors return 500 with safe messages (no sensitive data leaked)

## Browser Compatibility

- [ ] Works in Chrome/Edge (latest)
- [ ] Works in Firefox (latest)
- [ ] Works in Safari (latest)
- [ ] Mobile responsive design works

## Summary

Total Tests: ~150+

**Critical Tests (Must Pass):**
- Authentication (signup/login/logout)
- Profile auto-creation
- Project CRUD operations
- RLS security policies
- Cascade deletes
- Counter updates

**Important Tests (Should Pass):**
- Profile updates
- Timestamp auto-updates
- Storage policies
- Error handling

**Nice to Have:**
- Performance benchmarks
- Browser compatibility
- Mobile responsiveness

## Notes

- Tests marked "When Implemented" are for future features
- Some tests require manual verification in Supabase dashboard
- Security tests should be performed by multiple users
- Performance tests should be done with realistic data volumes
