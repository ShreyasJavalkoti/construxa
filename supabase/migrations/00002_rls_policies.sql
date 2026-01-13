-- =====================================================
-- Construxa Database - Row Level Security Policies
-- =====================================================
-- This migration enables RLS on all tables and creates policies
-- to ensure users can only access their own data.

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE drawings ENABLE ROW LEVEL SECURITY;
ALTER TABLE boq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_tasks ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROFILES POLICIES
-- =====================================================
-- Users can read their own profile
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (for initial creation)
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- PROJECTS POLICIES
-- =====================================================
-- Users can view their own projects
CREATE POLICY "Users can view their own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own projects
CREATE POLICY "Users can create their own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own projects
CREATE POLICY "Users can update their own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own projects
CREATE POLICY "Users can delete their own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- DRAWINGS POLICIES
-- =====================================================
-- Users can view drawings from their own projects
CREATE POLICY "Users can view their own drawings"
  ON drawings FOR SELECT
  USING (
    auth.uid() = user_id
    OR auth.uid() IN (
      SELECT user_id FROM projects WHERE id = drawings.project_id
    )
  );

-- Users can create drawings in their own projects
CREATE POLICY "Users can create drawings in their projects"
  ON drawings FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND auth.uid() IN (
      SELECT user_id FROM projects WHERE id = drawings.project_id
    )
  );

-- Users can update their own drawings
CREATE POLICY "Users can update their own drawings"
  ON drawings FOR UPDATE
  USING (
    auth.uid() = user_id
    OR auth.uid() IN (
      SELECT user_id FROM projects WHERE id = drawings.project_id
    )
  );

-- Users can delete their own drawings
CREATE POLICY "Users can delete their own drawings"
  ON drawings FOR DELETE
  USING (
    auth.uid() = user_id
    OR auth.uid() IN (
      SELECT user_id FROM projects WHERE id = drawings.project_id
    )
  );

-- =====================================================
-- BOQ ITEMS POLICIES
-- =====================================================
-- Users can view BOQ items from their own projects
CREATE POLICY "Users can view BOQ items from their projects"
  ON boq_items FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM projects WHERE id = boq_items.project_id
    )
  );

-- Users can create BOQ items in their own projects
CREATE POLICY "Users can create BOQ items in their projects"
  ON boq_items FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM projects WHERE id = boq_items.project_id
    )
  );

-- Users can update BOQ items in their own projects
CREATE POLICY "Users can update BOQ items in their projects"
  ON boq_items FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM projects WHERE id = boq_items.project_id
    )
  );

-- Users can delete BOQ items from their own projects
CREATE POLICY "Users can delete BOQ items from their projects"
  ON boq_items FOR DELETE
  USING (
    auth.uid() IN (
      SELECT user_id FROM projects WHERE id = boq_items.project_id
    )
  );

-- =====================================================
-- TIMELINE TASKS POLICIES
-- =====================================================
-- Users can view timeline tasks from their own projects
CREATE POLICY "Users can view timeline tasks from their projects"
  ON timeline_tasks FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM projects WHERE id = timeline_tasks.project_id
    )
  );

-- Users can create timeline tasks in their own projects
CREATE POLICY "Users can create timeline tasks in their projects"
  ON timeline_tasks FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM projects WHERE id = timeline_tasks.project_id
    )
  );

-- Users can update timeline tasks in their own projects
CREATE POLICY "Users can update timeline tasks in their projects"
  ON timeline_tasks FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM projects WHERE id = timeline_tasks.project_id
    )
  );

-- Users can delete timeline tasks from their own projects
CREATE POLICY "Users can delete timeline tasks from their projects"
  ON timeline_tasks FOR DELETE
  USING (
    auth.uid() IN (
      SELECT user_id FROM projects WHERE id = timeline_tasks.project_id
    )
  );

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON POLICY "Users can view their own profile" ON profiles IS 'Users can only read their own profile data';
COMMENT ON POLICY "Users can view their own projects" ON projects IS 'Users can only view projects they own';
COMMENT ON POLICY "Users can view their own drawings" ON drawings IS 'Users can only view drawings from their projects';
COMMENT ON POLICY "Users can view BOQ items from their projects" ON boq_items IS 'Users can only view BOQ items from their projects';
COMMENT ON POLICY "Users can view timeline tasks from their projects" ON timeline_tasks IS 'Users can only view timeline tasks from their projects';
