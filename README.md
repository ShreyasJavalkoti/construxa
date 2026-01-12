# Construxa - AI-Powered CAD Analysis for Construction

Transform AutoCAD Drawings into Project Timelines & BOQs in Minutes. AI-powered construction intelligence for Indian construction companies.

## 🚀 Features

- **🔐 Authentication**: Secure user authentication with Supabase
- **📊 Project Management**: Create and manage construction projects
- **📐 Drawing Analysis**: AI-powered analysis of AutoCAD drawings (DWG, DXF)
- **📋 BOQ Generation**: Automatic Bill of Quantities with CPWD rates
- **⏱️ Timeline Generation**: AI-generated project timelines with Gantt charts
- **💳 Payment Integration**: Razorpay integration for subscription plans
- **🎨 Modern UI**: Built with Next.js 14, React 19, and Tailwind CSS

## 📁 Project Structure

```
construxa/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Auth route group
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── (dashboard)/             # Dashboard route group
│   │   ├── dashboard/page.tsx
│   │   ├── project/[id]/page.tsx
│   │   └── settings/page.tsx
│   ├── api/                     # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── projects/           # Project CRUD
│   │   ├── drawings/           # Drawing upload & analysis
│   │   ├── boq/                # BOQ generation
│   │   ├── timeline/           # Timeline generation
│   │   ├── payments/           # Payment processing
│   │   └── webhooks/           # Razorpay webhooks
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   └── globals.css             # Global styles
├── components/                  # React components
│   ├── auth/                   # Auth components
│   ├── dashboard/              # Dashboard components
│   ├── project/                # Project detail components
│   ├── settings/               # Settings components
│   ├── payments/               # Payment components
│   ├── empty-states/           # Empty state components
│   ├── error-pages/            # Error page components
│   ├── loading/                # Loading components
│   └── ui/                     # Reusable UI components
├── lib/                        # Utility libraries
│   ├── supabase/              # Supabase clients & middleware
│   ├── ai/                    # AI utilities (OpenAI)
│   ├── openai.ts              # OpenAI client
│   ├── razorpay.ts            # Razorpay client
│   ├── constants.ts           # App constants
│   ├── validations.ts         # Zod schemas
│   └── utils.ts               # Helper functions
├── types/                      # TypeScript types
│   ├── database.ts            # Supabase database types
│   ├── api.ts                 # API types
│   └── index.ts               # Common types
├── hooks/                      # Custom React hooks
│   ├── use-auth.ts            # Authentication hook
│   ├── use-mobile.ts          # Mobile detection hook
│   └── use-toast.ts           # Toast notification hook
├── supabase/                   # Supabase configuration
│   └── migrations/            # Database migrations
│       └── 001_initial_schema.sql
└── public/                     # Static assets

```

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (Strict Mode)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: OpenAI GPT-4o-mini
- **Payments**: Razorpay
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI
- **Forms**: React Hook Form + Zod
- **State Management**: React Context
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- OpenAI API key
- Razorpay account (for payments)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ShreyasJavalkoti/construxa.git
cd construxa
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Update the following variables in `.env.local`:

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

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set up Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migration file: `supabase/migrations/001_initial_schema.sql`

This will create:
- All necessary tables (profiles, projects, drawings, boq, timelines, payments, etc.)
- Row Level Security (RLS) policies
- Database triggers and functions
- Indexes for optimization

### 5. Enable Supabase Storage

1. Go to Storage in your Supabase dashboard
2. Create a new bucket named `drawings`
3. Set it to public access
4. Configure CORS settings if needed

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Build for production

```bash
npm run build
npm start
```

## 🔑 Key Features & Usage

### Authentication

- **Sign Up**: Create a new account with email/password
- **Login**: Authenticate with existing credentials
- **Password Reset**: Recover account via email
- **Protected Routes**: Dashboard, project, and settings pages require authentication

### Project Management

- Create new construction projects
- Upload AutoCAD drawings (DWG, DXF)
- Organize drawings by category (plan, elevation, section, structural)
- Track project status (draft, active, completed)

### AI-Powered Analysis

#### Drawing Analysis
```typescript
POST /api/drawings/analyze
{
  "drawingId": "uuid"
}
```

Extracts:
- Dimensions (length, width, height, area, volume)
- Elements (walls, doors, windows, rooms)
- Materials and quantities
- Drawing metadata

#### BOQ Generation
```typescript
POST /api/boq/generate
{
  "projectId": "uuid",
  "drawingIds": ["uuid1", "uuid2"],
  "rateSource": "cpwd"
}
```

Generates comprehensive Bill of Quantities with:
- Category-wise item breakdown
- CPWD standard rates
- Accurate quantities
- Subtotal, overhead, GST calculations

#### Timeline Generation
```typescript
POST /api/timeline/generate
{
  "projectId": "uuid",
  "boqId": "uuid" // optional
}
```

Creates detailed project timeline with:
- Phased breakdown of work
- Task dependencies
- Duration estimates
- Critical path analysis

### Subscription Plans

- **Free Plan**: 1 project, 5 drawings, basic features
- **Pro Monthly**: ₹1,999/month - Unlimited projects & drawings
- **Pro Yearly**: ₹19,990/year - 2 months free

## 🔐 Security Features

- Row Level Security (RLS) on all database tables
- User authentication with Supabase Auth
- Secure payment signature verification
- Environment variable validation
- Input validation with Zod schemas
- Protected API routes

## 🗄️ Database Schema

### Main Tables

- **profiles**: User profile information
- **projects**: Construction projects
- **drawings**: Uploaded CAD drawings
- **boq**: Bill of Quantities records
- **timelines**: Project timeline data
- **payments**: Payment transactions
- **user_preferences**: User settings
- **notification_preferences**: Notification settings

See `supabase/migrations/001_initial_schema.sql` for complete schema.

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Authenticate user
- `GET /api/auth/callback` - OAuth callback handler

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get project details
- `PATCH /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Drawings
- `GET /api/drawings?projectId=uuid` - List drawings
- `POST /api/drawings` - Upload drawing
- `GET /api/drawings/[id]` - Get drawing details
- `DELETE /api/drawings/[id]` - Delete drawing
- `POST /api/drawings/analyze` - Analyze drawing with AI

### BOQ & Timeline
- `POST /api/boq/generate` - Generate BOQ
- `POST /api/timeline/generate` - Generate timeline

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment
- `POST /api/webhooks/razorpay` - Razorpay webhook

## 🎨 UI Components

The project uses a comprehensive UI component library based on Radix UI:

- Buttons, Cards, Dialogs
- Forms with validation
- Tables and Data displays
- Navigation and Menus
- Toast notifications
- Loading states
- Empty states
- Error pages

## 🧪 Development

### Code Style

- TypeScript strict mode enabled
- ESLint for code linting
- Prettier for code formatting (via editor)

### Component Structure

- Use `'use client'` directive for client components
- Server components by default in App Router
- Colocate related components
- Use TypeScript for all files

### Best Practices

- Always validate user input with Zod
- Use proper error handling in API routes
- Implement loading and error states
- Follow Next.js 14 App Router conventions
- Use Server Actions where appropriate

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Ensure the platform supports:
- Node.js 18+
- Next.js 14+
- Environment variables

## 📝 Environment Variables

All required environment variables are documented in `.env.example`. Never commit `.env.local` or actual credentials to version control.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 👥 Support

For support and queries:
- Create an issue on GitHub
- Contact: [Your contact information]

## 🔄 Updates

This README will be updated as new features are added.

---

**Built with ❤️ for the Indian Construction Industry**
