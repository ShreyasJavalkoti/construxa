/**
 * Reusable database query functions for Construxa
 * These functions provide a clean API for interacting with the Supabase database
 */

import { SupabaseClient } from '@supabase/supabase-js'
import {
  Database,
  Profile,
  ProfileUpdate,
  Project,
  ProjectInsert,
  ProjectUpdate,
  ProjectWithDrawings,
  Drawing,
  DrawingInsert,
  DrawingUpdate,
  BOQItem,
  BOQItemInsert,
  BOQItemUpdate,
  TimelineTask,
  TimelineTaskInsert,
  TimelineTaskUpdate,
} from './database.types'

// =====================================================
// PROFILE QUERIES
// =====================================================

/**
 * Get a user's profile by ID
 */
export async function getProfile(
  supabase: SupabaseClient<Database>,
  userId: string
) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data as Profile
}

/**
 * Update a user's profile
 */
export async function updateProfile(
  supabase: SupabaseClient<Database>,
  userId: string,
  updates: ProfileUpdate
) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data as Profile
}

// =====================================================
// PROJECT QUERIES
// =====================================================

/**
 * Get all projects for a user
 */
export async function getUserProjects(
  supabase: SupabaseClient<Database>,
  userId: string
) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Project[]
}

/**
 * Get a single project by ID
 */
export async function getProject(
  supabase: SupabaseClient<Database>,
  projectId: string,
  userId?: string
) {
  let query = supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query.single()

  if (error) throw error
  return data as Project
}

/**
 * Get a project with all its drawings
 */
export async function getProjectWithDrawings(
  supabase: SupabaseClient<Database>,
  projectId: string,
  userId?: string
) {
  const project = await getProject(supabase, projectId, userId)
  const drawings = await getProjectDrawings(supabase, projectId)

  return {
    ...project,
    drawings,
  } as ProjectWithDrawings
}

/**
 * Create a new project
 */
export async function createProject(
  supabase: SupabaseClient<Database>,
  project: ProjectInsert
) {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single()

  if (error) throw error
  return data as Project
}

/**
 * Update a project
 */
export async function updateProject(
  supabase: SupabaseClient<Database>,
  projectId: string,
  updates: ProjectUpdate,
  userId?: string
) {
  let query = supabase
    .from('projects')
    .update(updates)
    .eq('id', projectId)

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query.select().single()

  if (error) throw error
  return data as Project
}

/**
 * Delete a project
 */
export async function deleteProject(
  supabase: SupabaseClient<Database>,
  projectId: string,
  userId?: string
) {
  let query = supabase
    .from('projects')
    .delete()
    .eq('id', projectId)

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { error } = await query

  if (error) throw error
}

// =====================================================
// DRAWING QUERIES
// =====================================================

/**
 * Get all drawings for a project
 */
export async function getProjectDrawings(
  supabase: SupabaseClient<Database>,
  projectId: string
) {
  const { data, error } = await supabase
    .from('drawings')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Drawing[]
}

/**
 * Get a single drawing by ID
 */
export async function getDrawing(
  supabase: SupabaseClient<Database>,
  drawingId: string
) {
  const { data, error } = await supabase
    .from('drawings')
    .select('*')
    .eq('id', drawingId)
    .single()

  if (error) throw error
  return data as Drawing
}

/**
 * Create a new drawing
 */
export async function createDrawing(
  supabase: SupabaseClient<Database>,
  drawing: DrawingInsert
) {
  const { data, error } = await supabase
    .from('drawings')
    .insert(drawing)
    .select()
    .single()

  if (error) throw error
  return data as Drawing
}

/**
 * Update a drawing
 */
export async function updateDrawing(
  supabase: SupabaseClient<Database>,
  drawingId: string,
  updates: DrawingUpdate
) {
  const { data, error } = await supabase
    .from('drawings')
    .update(updates)
    .eq('id', drawingId)
    .select()
    .single()

  if (error) throw error
  return data as Drawing
}

/**
 * Delete a drawing
 */
export async function deleteDrawing(
  supabase: SupabaseClient<Database>,
  drawingId: string
) {
  const { error } = await supabase
    .from('drawings')
    .delete()
    .eq('id', drawingId)

  if (error) throw error
}

// =====================================================
// BOQ ITEM QUERIES
// =====================================================

/**
 * Get all BOQ items for a project
 */
export async function getProjectBOQItems(
  supabase: SupabaseClient<Database>,
  projectId: string
) {
  const { data, error } = await supabase
    .from('boq_items')
    .select('*')
    .eq('project_id', projectId)
    .order('sort_order', { ascending: true })

  if (error) throw error
  return data as BOQItem[]
}

/**
 * Create a new BOQ item
 */
export async function createBOQItem(
  supabase: SupabaseClient<Database>,
  item: BOQItemInsert
) {
  const { data, error } = await supabase
    .from('boq_items')
    .insert(item)
    .select()
    .single()

  if (error) throw error
  return data as BOQItem
}

/**
 * Create multiple BOQ items
 */
export async function createBOQItems(
  supabase: SupabaseClient<Database>,
  items: BOQItemInsert[]
) {
  const { data, error } = await supabase
    .from('boq_items')
    .insert(items)
    .select()

  if (error) throw error
  return data as BOQItem[]
}

/**
 * Update a BOQ item
 */
export async function updateBOQItem(
  supabase: SupabaseClient<Database>,
  itemId: string,
  updates: BOQItemUpdate
) {
  const { data, error } = await supabase
    .from('boq_items')
    .update(updates)
    .eq('id', itemId)
    .select()
    .single()

  if (error) throw error
  return data as BOQItem
}

/**
 * Delete a BOQ item
 */
export async function deleteBOQItem(
  supabase: SupabaseClient<Database>,
  itemId: string
) {
  const { error } = await supabase
    .from('boq_items')
    .delete()
    .eq('id', itemId)

  if (error) throw error
}

/**
 * Delete all BOQ items for a project
 */
export async function deleteProjectBOQItems(
  supabase: SupabaseClient<Database>,
  projectId: string
) {
  const { error } = await supabase
    .from('boq_items')
    .delete()
    .eq('project_id', projectId)

  if (error) throw error
}

// =====================================================
// TIMELINE TASK QUERIES
// =====================================================

/**
 * Get all timeline tasks for a project
 */
export async function getProjectTimelineTasks(
  supabase: SupabaseClient<Database>,
  projectId: string
) {
  const { data, error } = await supabase
    .from('timeline_tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('sort_order', { ascending: true })

  if (error) throw error
  return data as TimelineTask[]
}

/**
 * Create a new timeline task
 */
export async function createTimelineTask(
  supabase: SupabaseClient<Database>,
  task: TimelineTaskInsert
) {
  const { data, error } = await supabase
    .from('timeline_tasks')
    .insert(task)
    .select()
    .single()

  if (error) throw error
  return data as TimelineTask
}

/**
 * Create multiple timeline tasks
 */
export async function createTimelineTasks(
  supabase: SupabaseClient<Database>,
  tasks: TimelineTaskInsert[]
) {
  const { data, error } = await supabase
    .from('timeline_tasks')
    .insert(tasks)
    .select()

  if (error) throw error
  return data as TimelineTask[]
}

/**
 * Update a timeline task
 */
export async function updateTimelineTask(
  supabase: SupabaseClient<Database>,
  taskId: string,
  updates: TimelineTaskUpdate
) {
  const { data, error } = await supabase
    .from('timeline_tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single()

  if (error) throw error
  return data as TimelineTask
}

/**
 * Delete a timeline task
 */
export async function deleteTimelineTask(
  supabase: SupabaseClient<Database>,
  taskId: string
) {
  const { error } = await supabase
    .from('timeline_tasks')
    .delete()
    .eq('id', taskId)

  if (error) throw error
}

/**
 * Delete all timeline tasks for a project
 */
export async function deleteProjectTimelineTasks(
  supabase: SupabaseClient<Database>,
  projectId: string
) {
  const { error } = await supabase
    .from('timeline_tasks')
    .delete()
    .eq('project_id', projectId)

  if (error) throw error
}
