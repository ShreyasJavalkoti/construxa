-- Construxa Database Schema Migration
-- This migration creates all necessary tables, RLS policies, and indexes

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLES
-- =====================================================

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  company_name TEXT,
  phone TEXT,
  job_title TEXT,
  location TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'inactive', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed')),
  total_drawings INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drawings table
CREATE TABLE IF NOT EXISTS public.drawings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  category TEXT CHECK (category IN ('plan', 'elevation', 'section', 'structural')),
  status TEXT DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'parsing', 'analyzed', 'error')),
  analysis_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BOQ table
CREATE TABLE IF NOT EXISTS public.boq (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  data JSONB NOT NULL,
  subtotal DECIMAL(15,2),
  overhead DECIMAL(15,2),
  gst DECIMAL(15,2),
  grand_total DECIMAL(15,2),
  rate_source TEXT DEFAULT 'cpwd' CHECK (rate_source IN ('cpwd', 'pwd', 'custom')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Timeline table
CREATE TABLE IF NOT EXISTS public.timelines (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  data JSONB NOT NULL,
  total_duration INTEGER,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  plan_type TEXT CHECK (plan_type IN ('pro_monthly', 'pro_yearly')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  rate_source TEXT DEFAULT 'cpwd',
  currency_format TEXT DEFAULT 'rupee',
  number_format TEXT DEFAULT 'indian',
  length_unit TEXT DEFAULT 'meters',
  area_unit TEXT DEFAULT 'sqm',
  volume_unit TEXT DEFAULT 'cum',
  weight_unit TEXT DEFAULT 'kg',
  date_format TEXT DEFAULT 'ddmmyyyy',
  time_format TEXT DEFAULT '24h',
  timezone TEXT DEFAULT 'Asia/Kolkata',
  theme TEXT DEFAULT 'light',
  language TEXT DEFAULT 'en',
  compact_view BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification preferences table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  project_updates BOOLEAN DEFAULT true,
  timeline_complete BOOLEAN DEFAULT true,
  boq_complete BOOLEAN DEFAULT true,
  weekly_summary BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_drawings_project_id ON public.drawings(project_id);
CREATE INDEX IF NOT EXISTS idx_drawings_user_id ON public.drawings(user_id);
CREATE INDEX IF NOT EXISTS idx_boq_project_id ON public.boq(project_id);
CREATE INDEX IF NOT EXISTS idx_boq_user_id ON public.boq(user_id);
CREATE INDEX IF NOT EXISTS idx_timelines_project_id ON public.timelines(project_id);
CREATE INDEX IF NOT EXISTS idx_timelines_user_id ON public.timelines(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drawings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boq ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- Drawings policies
CREATE POLICY "Users can view own drawings" ON public.drawings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own drawings" ON public.drawings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own drawings" ON public.drawings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own drawings" ON public.drawings
  FOR DELETE USING (auth.uid() = user_id);

-- BOQ policies
CREATE POLICY "Users can view own boq" ON public.boq
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own boq" ON public.boq
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own boq" ON public.boq
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own boq" ON public.boq
  FOR DELETE USING (auth.uid() = user_id);

-- Timelines policies
CREATE POLICY "Users can view own timelines" ON public.timelines
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own timelines" ON public.timelines
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own timelines" ON public.timelines
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own timelines" ON public.timelines
  FOR DELETE USING (auth.uid() = user_id);

-- Payments policies
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User preferences policies
CREATE POLICY "Users can manage own preferences" ON public.user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Notification preferences policies
CREATE POLICY "Users can manage own notifications" ON public.notification_preferences
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drawings_updated_at BEFORE UPDATE ON public.drawings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_boq_updated_at BEFORE UPDATE ON public.boq
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_timelines_updated_at BEFORE UPDATE ON public.timelines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create default preferences for new users
CREATE OR REPLACE FUNCTION create_default_preferences()
RETURNS TRIGGER AS $$
BEGIN
  -- Create default user preferences
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Create default notification preferences
  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create default preferences when profile is created
CREATE TRIGGER create_user_preferences_on_profile_insert
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION create_default_preferences();
