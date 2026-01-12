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
cp .env.local.example .env.local

# Edit .env.local with your credentials
# (See IMPLEMENTATION_STATUS.md for required env vars)

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
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPENAI_API_KEY=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

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
