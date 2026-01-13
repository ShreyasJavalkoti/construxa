-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  company_name TEXT,
  phone TEXT,
  job_title TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed')),
  drawings_count INTEGER DEFAULT 0,
  total_cost DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drawings table
CREATE TABLE public.drawings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT CHECK (file_type IN ('dwg', 'dxf', 'pdf')),
  category TEXT CHECK (category IN ('plan', 'elevation', 'section', 'structural', 'other')),
  status TEXT DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'analyzing', 'analyzed', 'error')),
  analysis_result JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BOQ Items table
CREATE TABLE public.boq_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  quantity DECIMAL(15,3) NOT NULL,
  unit TEXT NOT NULL,
  rate DECIMAL(15,2) NOT NULL,
  amount DECIMAL(15,2) GENERATED ALWAYS AS (quantity * rate) STORED,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Timeline Tasks table
CREATE TABLE public.timeline_tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration INTEGER,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  dependencies UUID[],
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  plan_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drawings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for projects
CREATE POLICY "Users can view own projects" ON public.projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for drawings
CREATE POLICY "Users can view own drawings" ON public.drawings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own drawings" ON public.drawings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own drawings" ON public.drawings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own drawings" ON public.drawings FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for boq_items
CREATE POLICY "Users can view own boq" ON public.boq_items FOR SELECT USING (
  project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
);
CREATE POLICY "Users can create own boq" ON public.boq_items FOR INSERT WITH CHECK (
  project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
);
CREATE POLICY "Users can delete own boq" ON public.boq_items FOR DELETE USING (
  project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
);

-- RLS Policies for timeline_tasks
CREATE POLICY "Users can view own timeline" ON public.timeline_tasks FOR SELECT USING (
  project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
);
CREATE POLICY "Users can create own timeline" ON public.timeline_tasks FOR INSERT WITH CHECK (
  project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
);
CREATE POLICY "Users can update own timeline" ON public.timeline_tasks FOR UPDATE USING (
  project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
);
CREATE POLICY "Users can delete own timeline" ON public.timeline_tasks FOR DELETE USING (
  project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
);

-- RLS Policies for payments
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own payments" ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto-create profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_drawings_updated_at BEFORE UPDATE ON public.drawings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
