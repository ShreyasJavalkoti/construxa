# Migration Guide: Flat Structure to Next.js App Router

This document details the migration from the original flat file structure to the proper Next.js App Router structure.

## Overview

The repository has been completely restructured from a flat file naming convention (e.g., `app_dashboard_page.tsx`) to proper Next.js 14 App Router directories.

## File Mapping

### App Files

| Original File | New Location |
|--------------|--------------|
| `app_layout.tsx` | `app/layout.tsx` |
| `app_page.tsx` | `app/page.tsx` |
| `app_globals.css` | `app/globals.css` |
| `app_loading.tsx` | `app/loading.tsx` |
| `app_error.tsx` | `app/error.tsx` |
| `app_not-found.tsx` | `app/not-found.tsx` |
| `app_login_page.tsx` | `app/(auth)/login/page.tsx` |
| `app_signup_page.tsx` | `app/(auth)/signup/page.tsx` |
| `app_forgot-password_page.tsx` | `app/(auth)/forgot-password/page.tsx` |
| `app_dashboard_page.tsx` | `app/(dashboard)/dashboard/page.tsx` |
| `app_project_[id]_page.tsx` | `app/(dashboard)/project/[id]/page.tsx` |
| `app_settings_page.tsx` | `app/(dashboard)/settings/page.tsx` |

### Component Files

| Original Pattern | New Location |
|-----------------|--------------|
| `components_dashboard_*.tsx` | `components/dashboard/*.tsx` |
| `components_project_*.tsx` | `components/project/*.tsx` |
| `components_settings_*.tsx` | `components/settings/*.tsx` |
| `components_empty-states_*.tsx` | `components/empty-states/*.tsx` |
| `components_error-pages_*.tsx` | `components/error-pages/*.tsx` |
| `components_loading_*.tsx` | `components/loading/*.tsx` |
| `components_ui_*.tsx` | `components/ui/*.tsx` |
| `components_theme-provider.tsx` | `components/theme-provider.tsx` |

### Library & Hook Files

| Original File | New Location |
|--------------|--------------|
| `lib_utils.ts` | `lib/utils.ts` |
| `hooks_use-mobile.ts` | `hooks/use-mobile.ts` |
| `hooks_use-toast.ts` | `hooks/use-toast.ts` |

### Public Assets

| Original Pattern | New Location |
|-----------------|--------------|
| `public_*.png/jpg/svg` | `public/*.png/jpg/svg` |

## New Structure Added

### Authentication & Backend
- `lib/supabase/client.ts` - Supabase browser client
- `lib/supabase/server.ts` - Supabase server client
- `lib/supabase/middleware.ts` - Auth middleware
- `components/auth/auth-provider.tsx` - Auth context provider
- `hooks/use-auth.ts` - Authentication hook
- `middleware.ts` - Root middleware for route protection

### API Routes (New)
```
app/api/
├── auth/
│   ├── register/route.ts
│   ├── login/route.ts
│   └── callback/route.ts
├── projects/
│   ├── route.ts
│   └── [id]/route.ts
├── drawings/
│   ├── route.ts
│   ├── [id]/route.ts
│   └── analyze/route.ts
├── boq/
│   └── generate/route.ts
├── timeline/
│   └── generate/route.ts
├── payments/
│   ├── create-order/route.ts
│   └── verify/route.ts
└── webhooks/
    └── razorpay/route.ts
```

### AI Integration (New)
- `lib/openai.ts` - OpenAI client
- `lib/ai/analyze-drawing.ts` - Drawing analysis
- `lib/ai/generate-boq.ts` - BOQ generation
- `lib/ai/generate-timeline.ts` - Timeline generation

### Payment Integration (New)
- `lib/razorpay.ts` - Razorpay client
- `components/payments/checkout-button.tsx` - Payment button

### Type Definitions (New)
- `types/database.ts` - Supabase database types
- `types/api.ts` - API request/response types
- `types/index.ts` - Common types

### Constants & Validation (New)
- `lib/constants.ts` - App constants, CPWD rates, subscription plans
- `lib/validations.ts` - Zod validation schemas

### Database (New)
- `supabase/migrations/001_initial_schema.sql` - Complete database schema

## Route Groups

Two route groups have been created for better organization:

### `(auth)` Route Group
- Excludes header/footer from auth pages
- Contains: login, signup, forgot-password
- Location: `app/(auth)/`

### `(dashboard)` Route Group
- Protected routes requiring authentication
- Contains: dashboard, project details, settings
- Location: `app/(dashboard)/`

## Import Path Changes

All imports using `@/` alias remain the same but now point to proper directories:

```typescript
// Before (these never existed but would have been confusing)
import { Button } from '@/components_ui_button'

// After (clean and proper)
import { Button } from '@/components/ui/button'
```

## Breaking Changes

### 1. Layout Updates
The root layout now includes `AuthProvider`:
```tsx
<AuthProvider>
  {children}
</AuthProvider>
```

### 2. Google Fonts Removed
Removed `Inter` and `Geist_Mono` font imports that were causing build issues. The app now uses system fonts.

### 3. Environment Variables Required
New environment variables are required for the application to run:
- Supabase credentials
- OpenAI API key
- Razorpay credentials

See `.env.example` for complete list.

## Dependencies Added

### Core
- `@supabase/ssr` - Supabase SSR support
- `@supabase/supabase-js` - Supabase client
- `openai` - OpenAI API client
- `razorpay` - Razorpay payment gateway

## Migration Checklist

If you're updating existing code that references the old files:

- [ ] Update import paths to use new directory structure
- [ ] Set up environment variables from `.env.example`
- [ ] Run database migration in Supabase
- [ ] Configure Supabase storage bucket
- [ ] Update API endpoint references if any
- [ ] Test authentication flow
- [ ] Test protected routes
- [ ] Verify middleware is working

## Rollback

If you need to rollback to the flat structure:
```bash
git checkout 14e637d  # Last commit before restructure
```

## Support

For issues or questions about the migration:
1. Check the README.md for detailed documentation
2. Review this migration guide
3. Create an issue on GitHub

## Success Metrics

✅ Build passes successfully  
✅ All routes are properly configured  
✅ Authentication middleware is working  
✅ API routes are functional  
✅ TypeScript strict mode enabled  
✅ No runtime errors  

---

**Migration completed successfully on 2026-01-12**
