-- =====================================================
-- Construxa Database - Functions and Triggers
-- =====================================================
-- This migration creates database functions and triggers for:
-- 1. Auto-creating profiles on user signup
-- 2. Auto-updating timestamps
-- 3. Maintaining counts (projects_count, drawings_count)

-- =====================================================
-- 1. AUTO-CREATE PROFILE TRIGGER
-- =====================================================
-- Function to create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates a profile when a new user signs up';

-- =====================================================
-- 2. AUTO-UPDATE TIMESTAMPS
-- =====================================================
-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to profiles table
DROP TRIGGER IF EXISTS on_profiles_updated ON profiles;
CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Apply updated_at trigger to projects table
DROP TRIGGER IF EXISTS on_projects_updated ON projects;
CREATE TRIGGER on_projects_updated
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Apply updated_at trigger to drawings table
DROP TRIGGER IF EXISTS on_drawings_updated ON drawings;
CREATE TRIGGER on_drawings_updated
  BEFORE UPDATE ON drawings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

COMMENT ON FUNCTION public.handle_updated_at() IS 'Automatically updates the updated_at timestamp on row changes';

-- =====================================================
-- 3. UPDATE DRAWINGS COUNT
-- =====================================================
-- Function to increment drawings count on project
CREATE OR REPLACE FUNCTION public.increment_project_drawings_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE projects
  SET drawings_count = drawings_count + 1
  WHERE id = NEW.project_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement drawings count on project
CREATE OR REPLACE FUNCTION public.decrement_project_drawings_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE projects
  SET drawings_count = GREATEST(0, drawings_count - 1)
  WHERE id = OLD.project_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger to increment drawings count when a drawing is added
DROP TRIGGER IF EXISTS on_drawing_created ON drawings;
CREATE TRIGGER on_drawing_created
  AFTER INSERT ON drawings
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_project_drawings_count();

-- Trigger to decrement drawings count when a drawing is deleted
DROP TRIGGER IF EXISTS on_drawing_deleted ON drawings;
CREATE TRIGGER on_drawing_deleted
  AFTER DELETE ON drawings
  FOR EACH ROW
  EXECUTE FUNCTION public.decrement_project_drawings_count();

COMMENT ON FUNCTION public.increment_project_drawings_count() IS 'Increments the drawings_count on the project when a drawing is added';
COMMENT ON FUNCTION public.decrement_project_drawings_count() IS 'Decrements the drawings_count on the project when a drawing is deleted';

-- =====================================================
-- 4. UPDATE PROJECTS COUNT
-- =====================================================
-- Function to increment projects count on profile
CREATE OR REPLACE FUNCTION public.increment_profile_projects_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET projects_count = projects_count + 1
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement projects count on profile
CREATE OR REPLACE FUNCTION public.decrement_profile_projects_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET projects_count = GREATEST(0, projects_count - 1)
  WHERE id = OLD.user_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger to increment projects count when a project is added
DROP TRIGGER IF EXISTS on_project_created ON projects;
CREATE TRIGGER on_project_created
  AFTER INSERT ON projects
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_profile_projects_count();

-- Trigger to decrement projects count when a project is deleted
DROP TRIGGER IF EXISTS on_project_deleted ON projects;
CREATE TRIGGER on_project_deleted
  AFTER DELETE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION public.decrement_profile_projects_count();

COMMENT ON FUNCTION public.increment_profile_projects_count() IS 'Increments the projects_count on the profile when a project is added';
COMMENT ON FUNCTION public.decrement_profile_projects_count() IS 'Decrements the projects_count on the profile when a project is deleted';

-- =====================================================
-- 5. UPDATE TOTAL COST ON PROJECT
-- =====================================================
-- Function to recalculate project total cost from BOQ items
CREATE OR REPLACE FUNCTION public.update_project_total_cost()
RETURNS TRIGGER AS $$
DECLARE
  project_id_var UUID;
BEGIN
  -- Get the project_id from NEW or OLD using COALESCE
  project_id_var := COALESCE(NEW.project_id, OLD.project_id);

  -- Update the project's total_cost
  UPDATE projects
  SET total_cost = (
    SELECT COALESCE(SUM(amount), 0)
    FROM boq_items
    WHERE project_id = project_id_var
  )
  WHERE id = project_id_var;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update total cost when BOQ items change
DROP TRIGGER IF EXISTS on_boq_item_changed ON boq_items;
CREATE TRIGGER on_boq_item_changed
  AFTER INSERT OR UPDATE OR DELETE ON boq_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_project_total_cost();

COMMENT ON FUNCTION public.update_project_total_cost() IS 'Recalculates the total_cost on the project based on BOQ items';

-- =====================================================
-- 6. UPDATE DRAWINGS COUNT ON PROFILE
-- =====================================================
-- Function to increment drawings count on profile
CREATE OR REPLACE FUNCTION public.increment_profile_drawings_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET drawings_count = drawings_count + 1
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement drawings count on profile
CREATE OR REPLACE FUNCTION public.decrement_profile_drawings_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET drawings_count = GREATEST(0, drawings_count - 1)
  WHERE id = OLD.user_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger to increment profile drawings count when a drawing is added
DROP TRIGGER IF EXISTS on_drawing_created_profile ON drawings;
CREATE TRIGGER on_drawing_created_profile
  AFTER INSERT ON drawings
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_profile_drawings_count();

-- Trigger to decrement profile drawings count when a drawing is deleted
DROP TRIGGER IF EXISTS on_drawing_deleted_profile ON drawings;
CREATE TRIGGER on_drawing_deleted_profile
  AFTER DELETE ON drawings
  FOR EACH ROW
  EXECUTE FUNCTION public.decrement_profile_drawings_count();

COMMENT ON FUNCTION public.increment_profile_drawings_count() IS 'Increments the drawings_count on the profile when a drawing is added';
COMMENT ON FUNCTION public.decrement_profile_drawings_count() IS 'Decrements the drawings_count on the profile when a drawing is deleted';
