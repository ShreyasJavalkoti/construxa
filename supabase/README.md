# Construxa Database Schema

This directory contains the Supabase database migrations for the Construxa application.

## Overview

The database schema consists of 5 main tables:
1. **profiles** - User profile information
2. **projects** - Construction projects
3. **drawings** - CAD drawings uploaded to projects
4. **boq_items** - Bill of Quantities items
5. **timeline_tasks** - Project timeline tasks

## Running Migrations

Migrations should be run in order in the Supabase SQL Editor:

1. **00001_initial_schema.sql** - Creates all tables with indexes
2. **00002_rls_policies.sql** - Enables Row Level Security and creates policies
3. **00003_functions_triggers.sql** - Creates database functions and triggers

### Option 1: Via Supabase Dashboard

1. Go to your Supabase project
2. Navigate to SQL Editor
3. Copy the contents of each migration file
4. Run them in order (00001, 00002, 00003)

### Option 2: Via Supabase CLI

If you have the Supabase CLI installed:

```bash
supabase db push
```

## Schema Details

### Profiles Table

Extends `auth.users` with additional profile information:

- User metadata (name, company, phone, etc.)
- Subscription tier (free, pro, enterprise)
- Counters for projects and drawings
- Automatically created when user signs up

### Projects Table

Stores construction project information:

- Project metadata (name, description, status)
- Cost tracking (total_cost calculated from BOQ items)
- Timeline information (start/end dates, duration)
- Drawing count (auto-updated via triggers)

### Drawings Table

Stores uploaded CAD drawings:

- File information (path, size, type)
- Category (plan, elevation, section, etc.)
- Analysis status and results (JSON)
- Linked to project and user

### BOQ Items Table

Bill of Quantities items for cost estimation:

- Material/work description
- Quantity and unit
- Rate and auto-calculated amount
- Sortable via sort_order

### Timeline Tasks Table

Project timeline and schedule:

- Task information (name, dates, duration)
- Status and progress tracking
- Dependencies (array of task IDs)
- Sortable via sort_order

## Row Level Security (RLS)

All tables have RLS enabled with policies ensuring:

- Users can only access their own profiles
- Users can only access their own projects
- Users can only access drawings/BOQ/timeline items from their projects
- Cascade deletes automatically clean up related records

## Triggers and Functions

The database includes several automated triggers:

### 1. Auto-create Profile
- Automatically creates a profile when a user signs up
- Triggered on `auth.users` INSERT

### 2. Update Timestamps
- Automatically updates `updated_at` on row changes
- Applied to profiles, projects, and drawings tables

### 3. Update Counts
- **drawings_count**: Updated on projects when drawings added/removed
- **projects_count**: Updated on profiles when projects added/removed
- **total_cost**: Updated on projects when BOQ items change

## Storage Bucket

A `drawings` bucket needs to be created manually in Supabase Storage:

1. Go to Storage in Supabase dashboard
2. Create a new bucket named `drawings`
3. Set it to private (not public)
4. Add RLS policies for user-specific access:

```sql
-- Allow users to upload to their own folders
CREATE POLICY "Users can upload to their own folders"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'drawings' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to view their own files
CREATE POLICY "Users can view their own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'drawings'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own files
CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'drawings'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

## TypeScript Types

TypeScript types are auto-generated in `lib/supabase/database.types.ts` and include:

- Full database schema types
- Row, Insert, and Update types for each table
- Helper types for common queries (e.g., ProjectWithDrawings)

## Query Functions

Reusable query functions are available in `lib/supabase/queries.ts`:

- Profile queries: `getProfile()`, `updateProfile()`
- Project queries: `getUserProjects()`, `createProject()`, `updateProject()`, etc.
- Drawing queries: `getProjectDrawings()`, `createDrawing()`, etc.
- BOQ queries: `getProjectBOQItems()`, `createBOQItem()`, etc.
- Timeline queries: `getProjectTimelineTasks()`, `createTimelineTask()`, etc.

## Verification

After running migrations, verify the setup:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check triggers exist
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;
```

## Troubleshooting

### Migration Errors

If you encounter errors:

1. Make sure migrations are run in order (00001, 00002, 00003)
2. Check that `auth.users` table exists (it's created by Supabase Auth)
3. Ensure you're running migrations as a database admin

### RLS Issues

If users can't access their data:

1. Verify RLS is enabled: `ALTER TABLE tablename ENABLE ROW LEVEL SECURITY;`
2. Check policies exist: See Supabase dashboard > Authentication > Policies
3. Ensure service role key is used for admin operations

### Trigger Issues

If counters aren't updating:

1. Check triggers exist (see Verification section)
2. Verify functions are created properly
3. Look for errors in Supabase logs
