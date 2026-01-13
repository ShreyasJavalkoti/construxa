# Construxa - AI-Powered CAD Analysis for Construction

Transform AutoCAD Drawings into Project Timelines & BOQs in Minutes.

## 🎯 Current Status

**Phase 1 Complete**: Core infrastructure, authentication, and dashboard fully functional!

See [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) for detailed progress.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Supabase account
- OpenAI API key (for AI features)
- Razorpay account (for payments)

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your credentials
# (See Environment Variables section below)
```

### Supabase Setup

1. Create a new project at [Supabase](https://app.supabase.com)
2. Go to Project Settings > API to get your `SUPABASE_URL` and API keys
3. Run the migrations in the Supabase SQL Editor (in order):
   - `supabase/migrations/00001_initial_schema.sql`
   - `supabase/migrations/00002_rls_policies.sql`
   - `supabase/migrations/00003_functions_triggers.sql`
4. Create a storage bucket named `drawings`:
   - Go to Storage in the Supabase dashboard
   - Click "New bucket"
   - Name it `drawings` and make it private
   - Add RLS policies for user-specific access

### Running the Application

```bash
# Run development server
npm run dev
```

Visit `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## ✨ Features

### ✅ Working Now
- User authentication (login/signup)
- Project management (create, view, delete)
- Dashboard with real-time statistics
- Activity tracking
- Responsive design
- Toast notifications

### 🚧 In Progress
- File upload and storage
- AI-powered drawing analysis
- BOQ generation
- Timeline generation
- Export functionality (PDF/Excel)

### 📋 Planned
- Payment integration (Razorpay)
- Subscription management
- Email notifications
- Team collaboration
- Advanced analytics

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **AI**: OpenAI GPT-4
- **Payments**: Razorpay
- **Animations**: Framer Motion

## 📁 Project Structure

```
construxa/
├── app/                 # Next.js app directory
│   ├── (auth)/         # Auth pages
│   ├── (dashboard)/    # Dashboard pages
│   └── api/            # API routes
├── components/          # React components
│   ├── auth/           # Auth components
│   ├── dashboard/      # Dashboard components
│   ├── project/        # Project components
│   ├── modals/         # Modal dialogs
│   └── ui/             # UI primitives
├── hooks/               # Custom React hooks
├── lib/                 # Utilities
│   ├── supabase/       # Supabase config
│   └── env.ts          # Environment validation
└── public/              # Static assets
```

## 🔐 Environment Variables

Required environment variables (add to `.env.local`):

```env
# Supabase - Get from https://app.supabase.com (Project Settings > API)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI - Get from https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key

# Razorpay - Get from https://dashboard.razorpay.com/app/keys
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

See `.env.example` for a template.

## 📖 Documentation

- [Implementation Status](./IMPLEMENTATION_STATUS.md) - Detailed progress and TODOs
- [API Documentation](./docs/API.md) - API endpoints (to be created)
- [Component Guide](./docs/COMPONENTS.md) - Component usage (to be created)

## 🤝 Contributing

This is currently a private project. For any questions or issues, please contact the development team.

## 📄 License

Proprietary - All rights reserved

---

Built with ❤️ for the Indian construction industry
