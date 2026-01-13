import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/server'

// GET - Get timeline tasks for a project
export async function GET(request: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('project_id')

    if (!projectId) {
      return NextResponse.json(
        { error: 'project_id is required' },
        { status: 400 }
      )
    }

    // Verify user owns the project
    const { data: project } = await supabaseAdmin
      .from('projects')
      .select('user_id')
      .eq('id', projectId)
      .single()

    if (!project || project.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Fetch timeline
    const { data: timeline, error } = await supabaseAdmin
      .from('timelines')
      .select('*')
      .eq('project_id', projectId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!timeline) {
      return NextResponse.json({ 
        tasks: [],
        start_date: null,
        end_date: null
      })
    }

    return NextResponse.json({
      tasks: timeline.tasks || [],
      start_date: timeline.start_date,
      end_date: timeline.end_date,
    })
  } catch (error) {
    console.error('Get timeline error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch timeline' },
      { status: 500 }
    )
  }
}

// PATCH - Update task progress
export async function PATCH(request: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { project_id, task_index, progress } = body

    if (!project_id || task_index === undefined || progress === undefined) {
      return NextResponse.json(
        { error: 'project_id, task_index, and progress are required' },
        { status: 400 }
      )
    }

    // Verify user owns the project
    const { data: project } = await supabaseAdmin
      .from('projects')
      .select('user_id')
      .eq('id', project_id)
      .single()

    if (!project || project.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Fetch current timeline
    const { data: timeline } = await supabaseAdmin
      .from('timelines')
      .select('*')
      .eq('project_id', project_id)
      .single()

    if (!timeline) {
      return NextResponse.json({ error: 'Timeline not found' }, { status: 404 })
    }

    // Update task progress
    const tasks = timeline.tasks || []
    if (task_index >= 0 && task_index < tasks.length) {
      tasks[task_index].progress = progress
    }

    // Save updated timeline
    const { data: updatedTimeline, error } = await supabaseAdmin
      .from('timelines')
      .update({ tasks })
      .eq('project_id', project_id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      tasks: updatedTimeline.tasks,
    })
  } catch (error) {
    console.error('Update timeline error:', error)
    return NextResponse.json(
      { error: 'Failed to update timeline' },
      { status: 500 }
    )
  }
}
