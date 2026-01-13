-- =====================================================
-- Construxa Database Schema - Initial Setup
-- =====================================================
-- This migration creates the core tables for the Construxa application
-- including profiles, projects, drawings, BOQ items, and timeline tasks.

-- =====================================================
-- 1. PROFILES TABLE
-- =====================================================
-- Extends auth.users with additional profile information
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  company TEXT,
  phone TEXT,
  job_title TEXT,
  location TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  projects_count INTEGER DEFAULT 0,
  drawings_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups by email
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- =====================================================
-- 2. PROJECTS TABLE
-- =====================================================
-- Stores construction project information
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed')),
  drawings_count INTEGER DEFAULT 0,
  total_cost DECIMAL(15,2) DEFAULT 0,
  estimated_duration INTEGER, -- in days
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- =====================================================
-- 3. DRAWINGS TABLE
-- =====================================================
-- Stores uploaded CAD drawings and their analysis results
CREATE TABLE IF NOT EXISTS drawings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT CHECK (file_type IN ('dwg', 'dxf', 'pdf')),
  category TEXT CHECK (category IN ('plan', 'elevation', 'section', 'structural', 'other')),
  status TEXT DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'parsing', 'analyzed', 'error')),
  analysis_result JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_drawings_project_id ON drawings(project_id);
CREATE INDEX IF NOT EXISTS idx_drawings_user_id ON drawings(user_id);
CREATE INDEX IF NOT EXISTS idx_drawings_status ON drawings(status);
CREATE INDEX IF NOT EXISTS idx_drawings_created_at ON drawings(created_at DESC);

-- =====================================================
-- 4. BOQ ITEMS TABLE
-- =====================================================
-- Stores Bill of Quantities items for projects
CREATE TABLE IF NOT EXISTS boq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  quantity DECIMAL(15,2) NOT NULL,
  unit TEXT NOT NULL,
  rate DECIMAL(15,2) NOT NULL,
  amount DECIMAL(15,2) GENERATED ALWAYS AS (quantity * rate) STORED,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_boq_items_project_id ON boq_items(project_id);
CREATE INDEX IF NOT EXISTS idx_boq_items_category ON boq_items(category);
CREATE INDEX IF NOT EXISTS idx_boq_items_sort_order ON boq_items(project_id, sort_order);

-- =====================================================
-- 5. TIMELINE TASKS TABLE
-- =====================================================
-- Stores project timeline tasks
CREATE TABLE IF NOT EXISTS timeline_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration INTEGER, -- in days
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  dependencies TEXT[], -- array of task IDs
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_timeline_tasks_project_id ON timeline_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_timeline_tasks_status ON timeline_tasks(status);
CREATE INDEX IF NOT EXISTS idx_timeline_tasks_sort_order ON timeline_tasks(project_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_timeline_tasks_dates ON timeline_tasks(start_date, end_date);

-- =====================================================
-- COMMENTS
-- =====================================================
-- Add helpful comments to tables and columns
COMMENT ON TABLE profiles IS 'User profiles extending auth.users with additional information';
COMMENT ON TABLE projects IS 'Construction projects managed by users';
COMMENT ON TABLE drawings IS 'CAD drawings uploaded to projects';
COMMENT ON TABLE boq_items IS 'Bill of Quantities items for projects';
COMMENT ON TABLE timeline_tasks IS 'Project timeline tasks with dependencies';

COMMENT ON COLUMN boq_items.amount IS 'Auto-calculated as quantity * rate';
COMMENT ON COLUMN timeline_tasks.dependencies IS 'Array of task IDs that must be completed before this task';
