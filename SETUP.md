# Quick Setup Guide

Get Construxa up and running in minutes.

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- A Supabase account (free tier is fine)
- An OpenAI API key
- A Razorpay account (for payments)

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Supabase

### Create a Project
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Wait for it to initialize

### Run Database Migration
1. Go to SQL Editor in your Supabase dashboard
2. Open the file `supabase/migrations/001_initial_schema.sql`
3. Copy the entire contents
4. Paste into the SQL Editor
5. Click "Run"

This creates:
- All tables (profiles, projects, drawings, boq, timelines, payments, preferences)
- Row Level Security policies
- Indexes and triggers

### Create Storage Bucket
1. Go to Storage in Supabase dashboard
2. Create a new bucket named `drawings`
3. Make it public
4. Save

### Get API Keys
1. Go to Settings → API
2. Copy:
   - Project URL
   - `anon` public key
   - `service_role` key (keep this secret!)

## 3. Set Up OpenAI

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Create an account or sign in
3. Go to API Keys
4. Create a new API key
5. Copy the key (you won't see it again!)

## 4. Set Up Razorpay (Optional - for payments)

1. Go to [Razorpay](https://razorpay.com)
2. Create an account
3. Go to Settings → API Keys
4. Generate Test Keys (for development)
5. Copy Key ID and Key Secret

## 5. Configure Environment Variables

Copy the example file:
```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your values:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# OpenAI
OPENAI_API_KEY=sk-your-openai-key-here

# Razorpay
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret_here
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 7. Create Your First Account

1. Click "Sign Up" in the header
2. Enter your details
3. You'll receive a verification email from Supabase
4. Click the verification link
5. You're ready to go!

## 8. Test the Application

### Create a Project
1. Go to Dashboard
2. Click "New Project"
3. Enter project name and description
4. Click "Create"

### Upload a Drawing
1. Open your project
2. Go to Drawings tab
3. Click "Upload Drawing"
4. Select a CAD file (DWG or DXF)
5. Click "Analyze" to run AI analysis

### Generate BOQ
1. Make sure drawings are analyzed
2. Go to BOQ tab
3. Click "Generate BOQ"
4. Select drawings to include
5. Choose rate source (CPWD recommended)
6. Click "Generate"

### Generate Timeline
1. Go to Timeline tab
2. Click "Generate Timeline"
3. Optionally select a BOQ to base it on
4. Click "Generate"

## Common Issues

### Build Fails
- Make sure all environment variables are set
- Check that `.env.local` exists
- Verify Node.js version is 18+

### Database Errors
- Ensure migration ran successfully in Supabase
- Check RLS policies are enabled
- Verify your Supabase keys are correct

### Authentication Not Working
- Confirm email verification is enabled in Supabase
- Check that callback URL is configured
- Verify middleware is running

### AI Features Not Working
- Ensure OpenAI API key is valid
- Check you have credits in your OpenAI account
- Verify API key has correct permissions

### Payment Issues
- Make sure you're using Test Mode keys
- Check webhook URL is configured in Razorpay
- Verify Razorpay keys are correct

## Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables (same as `.env.local`)
5. Deploy!

### Update Razorpay Webhook
After deployment, update your Razorpay webhook URL:
```
https://your-domain.vercel.app/api/webhooks/razorpay
```

### Use Production Keys
For production:
- Use Razorpay Live Keys (not Test)
- Use production OpenAI key
- Ensure Supabase project is in production mode

## Need Help?

- Check the [README.md](README.md) for detailed documentation
- Review the [MIGRATION.md](MIGRATION.md) for structure details
- Create an issue on GitHub

## Next Steps

- Customize the UI components
- Add your branding
- Configure email templates in Supabase
- Set up analytics
- Add more AI features

---

**Happy Building! 🚀**
