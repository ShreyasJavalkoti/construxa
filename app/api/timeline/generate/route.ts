import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateTimeline } from '@/lib/openai/timeline'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { project_id, start_date } = body

    if (!project_id) {
      return NextResponse.json({ error: 'project_id is required' }, { status: 400 })
    }

    // Get project details
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', project_id)
      .eq('user_id', user.id)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Get analyzed drawings
    const { data: drawings, error: drawingsError } = await supabase
      .from('drawings')
      .select('*')
      .eq('project_id', project_id)
      .eq('status', 'analyzed')
      .not('analysis_result', 'is', null)

    if (drawingsError) {
      return NextResponse.json({ error: drawingsError.message }, { status: 500 })
    }

    if (!drawings || drawings.length === 0) {
      return NextResponse.json(
        { error: 'No analyzed drawings found for this project' },
        { status: 400 }
      )
    }

    // Use the first drawing's analysis
    const analysis = drawings[0].analysis_result

    // Generate timeline using OpenAI
    const timelineTasks = await generateTimeline({
      name: project.name,
      analysis,
      projectStartDate: start_date,
    })

    // Delete existing timeline tasks for this project
    await supabase.from('timeline_tasks').delete().eq('project_id', project_id)

    // Insert new timeline tasks
    const tasksToInsert = timelineTasks.map((task, index) => ({
      project_id,
      name: task.name,
      start_date: task.start_date,
      end_date: task.end_date,
      duration: task.duration,
      status: task.status,
      dependencies: task.dependencies || [],
      sort_order: index,
    }))

    const { data: insertedTasks, error: insertError } = await supabase
      .from('timeline_tasks')
      .insert(tasksToInsert)
      .select()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ tasks: insertedTasks })
  } catch (error: any) {
    console.error('Timeline generation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
