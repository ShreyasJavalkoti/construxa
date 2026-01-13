import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/server'
import { generateTimeline } from '@/lib/openai/timeline'

// POST - Generate timeline with AI
export async function POST(request: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { project_id, analysis_data, start_date } = body

    if (!project_id) {
      return NextResponse.json(
        { error: 'project_id is required' },
        { status: 400 }
      )
    }

    // Verify user owns the project
    const { data: project } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', project_id)
      .single()

    if (!project || project.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Get analysis data from drawings if not provided
    let projectAnalysis = analysis_data
    
    if (!projectAnalysis) {
      // Fetch the latest analyzed drawing
      const { data: drawings } = await supabaseAdmin
        .from('drawings')
        .select('*')
        .eq('project_id', project_id)
        .eq('analysis_status', 'completed')
        .order('uploaded_at', { ascending: false })
        .limit(1)

      if (drawings && drawings.length > 0) {
        projectAnalysis = drawings[0].analysis_result
      }
    }

    if (!projectAnalysis) {
      return NextResponse.json(
        { error: 'No analysis data available. Please analyze a drawing first.' },
        { status: 400 }
      )
    }

    // Generate timeline using OpenAI
    const timelineTasks = await generateTimeline(projectAnalysis, {
      projectName: project.name,
      projectType: project.project_type || undefined,
      startDate: start_date,
    })

    // Calculate project dates
    const projectStartDate = start_date || new Date().toISOString().split('T')[0]
    const maxEndDay = Math.max(...timelineTasks.map(task => {
      const startDay = typeof task.start_date === 'string' 
        ? parseInt(task.start_date) 
        : task.start_date
      return startDay + task.duration_days
    }))
    
    const startDateObj = new Date(projectStartDate)
    const endDateObj = new Date(startDateObj)
    endDateObj.setDate(endDateObj.getDate() + maxEndDay)
    const projectEndDate = endDateObj.toISOString().split('T')[0]

    // Delete existing timeline if any
    await supabaseAdmin
      .from('timelines')
      .delete()
      .eq('project_id', project_id)

    // Save timeline to database
    const { data: timeline, error: timelineError } = await supabaseAdmin
      .from('timelines')
      .insert({
        project_id,
        tasks: timelineTasks.map(task => ({
          ...task,
          project_id,
        })),
        start_date: projectStartDate,
        end_date: projectEndDate,
      })
      .select()
      .single()

    if (timelineError) {
      console.error('Timeline save error:', timelineError)
      return NextResponse.json({ error: timelineError.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      tasks: timeline.tasks,
      start_date: timeline.start_date,
      end_date: timeline.end_date,
    })
  } catch (error) {
    console.error('Generate timeline error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to generate timeline',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
