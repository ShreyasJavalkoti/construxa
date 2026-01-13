# Construxa - Complete Setup Guide

This guide will walk you through setting up the Construxa application with Supabase backend.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier is sufficient)
- OpenAI API key (for AI features)
- Razorpay account (for payment features, optional for development)

## Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/ShreyasJavalkoti/construxa.git
cd construxa

# Install dependencies
npm install
```

## Step 2: Create Supabase Project

1. Go to [Supabase](https://app.supabase.com)
2. Click "New Project"
3. Fill in project details:
   - Name: `construxa` (or your preferred name)
   - Database Password: Choose a strong password
   - Region: Select closest to your users
4. Wait for the project to be created (~2 minutes)

## Step 3: Get Supabase Credentials

1. In your Supabase project, go to **Project Settings** > **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (under Project API keys)
   - **service_role** key (under Project API keys) - ⚠️ Keep this secret!

## Step 4: Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local and add your credentials
nano .env.local  # or use your preferred editor
```

Add the following to `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# OpenAI (get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-your_openai_key_here

# Razorpay (optional for development)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

## Step 5: Set Up Database Schema

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project
2. Navigate to **SQL Editor**
3. Create a new query
4. Run each migration file in order:

#### Migration 1: Initial Schema
Copy and paste the contents of `supabase/migrations/00001_initial_schema.sql` and click "Run"

#### Migration 2: RLS Policies
Copy and paste the contents of `supabase/migrations/00002_rls_policies.sql` and click "Run"

#### Migration 3: Functions & Triggers
Copy and paste the contents of `supabase/migrations/00003_functions_triggers.sql` and click "Run"

### Option B: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

## Step 6: Create Storage Bucket

1. In Supabase dashboard, go to **Storage**
2. Click **New bucket**
3. Configure:
   - Name: `drawings`
   - Public: **OFF** (keep it private)
   - File size limit: 50 MB (adjust as needed)
4. Click **Create bucket**

### Set Up Storage Policies

1. Go to **SQL Editor**
2. Copy and paste the contents of `supabase/migrations/00004_storage_policies.sql`
3. Click "Run"

## Step 7: Verify Database Setup

Run this SQL query in the SQL Editor to verify everything is set up correctly:

```sql
-- Check tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check triggers
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- Check storage policies
SELECT policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects';
```

Expected results:
- 5 tables: `profiles`, `projects`, `drawings`, `boq_items`, `timeline_tasks`
- All tables should have `rowsecurity = true`
- Multiple triggers for auto-updates and counts
- 4 storage policies for the drawings bucket

## Step 8: Run the Application

```bash
# Development mode
npm run dev

# The app will be available at http://localhost:3000
```

## Step 9: Test the Setup

1. Open http://localhost:3000
2. Click "Sign Up" and create a test account
3. Verify that:
   - User can sign up (profile auto-created)
   - Dashboard loads
   - Can create a new project
   - Project appears in the list

## Troubleshooting

### Database Connection Issues

**Error**: "Failed to fetch projects"

**Solution**: 
- Verify your Supabase URL and keys in `.env.local`
- Make sure the migrations ran successfully
- Check RLS policies are enabled

### Authentication Issues

**Error**: User can't sign up or login

**Solution**:
- Check Supabase Auth settings in dashboard
- Verify email provider is configured (Settings > Auth > Email)
- For development, enable "Confirm email" = OFF

### Storage Upload Issues

**Error**: "Failed to upload file"

**Solution**:
- Verify the `drawings` bucket exists
- Check storage policies were applied
- Make sure the bucket is set to private (not public)

### Migration Errors

**Error**: "relation already exists"

**Solution**:
- Some migrations may have partially run
- You can safely re-run migrations that check for existence with `IF NOT EXISTS`
- Or reset the database: Settings > Database > Reset Database (⚠️ This deletes all data!)

## Next Steps

### Enable Email Authentication

1. In Supabase dashboard, go to **Authentication** > **Providers**
2. Configure email provider:
   - Enable email provider
   - Set up email templates (optional)
   - For production, configure custom SMTP settings

### Configure File Upload Limits

1. Go to **Storage** > `drawings` bucket
2. Click settings icon
3. Adjust:
   - File size limits (default: 50MB)
   - Allowed MIME types (e.g., `application/pdf`, `image/*`, `application/x-dwg`)

### Set Up Backups (Production)

1. Go to **Database** > **Backups**
2. Enable daily backups
3. Configure backup retention period

### Monitor Usage

1. Go to **Reports**
2. Monitor:
   - Database size
   - Storage usage
   - API requests
   - Active users

## Support

For issues or questions:
- Check the [Supabase Documentation](https://supabase.com/docs)
- Review `supabase/README.md` for detailed schema documentation
- Check application logs in the terminal

## Production Deployment

When deploying to production:

1. ✅ Use strong passwords for database
2. ✅ Keep service_role key secret (never commit to Git)
3. ✅ Enable Row Level Security on all tables
4. ✅ Set up proper CORS policies
5. ✅ Configure email authentication with custom SMTP
6. ✅ Enable database backups
7. ✅ Set up monitoring and alerts
8. ✅ Use environment variables (never hardcode credentials)
9. ✅ Test RLS policies thoroughly
10. ✅ Enable Supabase's built-in DDoS protection

## Security Checklist

- [ ] RLS enabled on all tables
- [ ] Storage bucket is private (not public)
- [ ] Service role key is kept secret
- [ ] Database password is strong
- [ ] Email verification is enabled (for production)
- [ ] Rate limiting is configured
- [ ] CORS policies are properly set
- [ ] No sensitive data in error messages
- [ ] Regular security audits of policies

## Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Clear .next cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```
