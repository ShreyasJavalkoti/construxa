# Construxa - AI-Powered CAD Analysis for Construction

Transform AutoCAD Drawings into Project Timelines & BOQs in Minutes.

## 🎯 Current Status

**All Major Features Implemented!** 

This application includes complete backend infrastructure, AI integration, payment processing, and frontend components.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Supabase account
- OpenAI API key (for AI features)
- Razorpay account (for payments)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd construxa

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your credentials
```

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Database Setup

1. Create a new Supabase project at https://supabase.com
2. Go to the SQL Editor in your Supabase dashboard
3. Run the migration file located at `supabase/migrations/001_complete_schema.sql`
4. Create a storage bucket named `drawings` with public access
5. Set up storage policies to allow authenticated users to upload/view files

### Running Locally

```bash
# Run development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

## ✨ Features

### ✅ Implemented Features

**Authentication & User Management**
- User registration and login
- Secure session management with Supabase Auth
- Profile management
- Password reset flow

**Project Management**
- Create, view, update, and delete projects
- Project dashboard with real-time statistics
- Activity tracking
- Project status management

**Drawing Analysis (AI-Powered)**
- Upload CAD drawings (DWG, DXF, PDF)
- AI-powered analysis using OpenAI GPT-4 Vision
- Extract building dimensions, floors, rooms, materials
- Categorize drawings by type

**BOQ Generation**
- Generate Bill of Quantities from analyzed drawings
- CPWD 2024 rate integration for Indian construction
- Categories: Earthwork, PCC, RCC, Brickwork, Plastering, etc.
- Export functionality (planned)

**Timeline Generation**
- AI-generated construction timelines
- Task dependencies and sequencing
- Realistic duration estimates
- Gantt chart visualization (planned)

**Payment Integration**
- Razorpay payment gateway integration
- Subscription management (Free, Pro, Enterprise)
- Payment verification and tracking

**UI/UX**
- Responsive design for all devices
- Dark/light mode support
- Toast notifications
- Loading states and error handling
- Empty states

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **AI**: OpenAI GPT-4 Vision
- **Payments**: Razorpay
- **Animations**: Framer Motion

## 📁 Project Structure

```
construxa/
├── app/                      # Next.js app directory
│   ├── (auth)/              # Auth pages (login, signup, forgot-password)
│   ├── (dashboard)/         # Protected dashboard pages
│   │   ├── dashboard/       # Main dashboard
│   │   ├── project/[id]/    # Project detail page
│   │   └── settings/        # User settings
│   └── api/                 # API routes
│       ├── auth/            # Authentication endpoints
│       ├── projects/        # Project CRUD
│       ├── drawings/        # Drawing upload & analysis
│       ├── boq/             # BOQ generation
│       ├── timeline/        # Timeline generation
│       ├── payments/        # Razorpay integration
│       └── user/            # User profile
├── components/              # React components
│   ├── auth/               # Auth components
│   ├── dashboard/          # Dashboard components
│   ├── project/            # Project detail tabs
│   ├── payments/           # Payment components
│   ├── settings/           # Settings tabs
│   └── ui/                 # UI primitives (shadcn/ui)
├── hooks/                  # Custom React hooks
│   ├── use-auth.ts
│   ├── use-projects.ts
│   ├── use-drawings.ts
│   ├── use-boq.ts
│   ├── use-timeline.ts
│   └── use-payments.ts
├── lib/                    # Utilities and integrations
│   ├── supabase/           # Supabase clients
│   ├── openai/             # OpenAI integration
│   │   ├── client.ts       # OpenAI client
│   │   ├── prompts.ts      # AI prompts
│   │   ├── analyze.ts      # Drawing analysis
│   │   ├── boq.ts          # BOQ generation
│   │   └── timeline.ts     # Timeline generation
│   ├── razorpay/           # Razorpay client
│   └── utils.ts            # Utility functions
├── types/                  # TypeScript type definitions
│   ├── database.ts         # Database types
│   └── api.ts              # API types
├── public/                 # Static assets
├── supabase/               # Supabase configuration
│   └── migrations/         # Database migrations
└── styles/                 # Global styles
```

## 🔐 Security Features

- Row Level Security (RLS) policies on all database tables
- Server-side authentication checks
- API route protection
- Environment variable validation
- Secure file upload to Supabase Storage
- Payment signature verification

## 📖 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Projects
- `GET /api/projects` - List user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get project details
- `DELETE /api/projects/[id]` - Delete project

### Drawings
- `GET /api/drawings?project_id=xxx` - List project drawings
- `POST /api/drawings/upload` - Upload drawing file
- `POST /api/drawings/analyze` - Analyze drawing with AI
- `DELETE /api/drawings/[id]` - Delete drawing

### BOQ
- `GET /api/boq?project_id=xxx` - Get project BOQ
- `POST /api/boq/generate` - Generate BOQ from drawings

### Timeline
- `GET /api/timeline?project_id=xxx` - Get project timeline
- `POST /api/timeline/generate` - Generate timeline from drawings

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run linting
npm run lint
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Digital Ocean App Platform
- Self-hosted with Docker

## 📝 Usage Guide

### 1. Register/Login
Create an account or login with existing credentials.

### 2. Create a Project
From the dashboard, click "New Project" and fill in the details.

### 3. Upload Drawings
In the project detail page, go to the "Drawings" tab and upload your CAD files.

### 4. Analyze Drawings
Click "Analyze" on uploaded drawings to extract construction data using AI.

### 5. Generate BOQ
Once drawings are analyzed, go to the "BOQ" tab and click "Generate BOQ" to get detailed cost estimates.

### 6. Generate Timeline
In the "Timeline" tab, click "Generate Timeline" to create a construction schedule.

### 7. Upgrade Subscription
Go to Settings → Subscription to upgrade to Pro or Enterprise plans for more features.

## 🤝 Contributing

This is currently a private project. For any questions or issues, please contact the development team.

## 📄 License

Proprietary - All rights reserved

## 🆘 Support

For support, email support@construxa.com or create an issue in the repository.

## 🔄 Updates

- **v1.0.0** (2026-01) - Initial release with complete feature set

---

Built with ❤️ for the Indian construction industry
