import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { generateTimeline } from '@/lib/ai/generate-timeline'
import { generateTimelineSchema } from '@/lib/validations'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = generateTimelineSchema.parse(body)
    
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Get project details
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('name')
      .eq('id', validatedData.projectId)
      .eq('user_id', user.id)
      .single()
    
    if (projectError || !project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }
    
    // Get BOQ data if boqId is provided
    let boqData = null
    if (validatedData.boqId) {
      const { data: boq } = await supabase
        .from('boq')
        .select('data')
        .eq('id', validatedData.boqId)
        .eq('user_id', user.id)
        .single()
      
      if (boq) {
        boqData = boq.data
      }
    }
    
    // Generate timeline using AI
    const timelineData = await generateTimeline({
      projectName: project.name,
      boqData,
      projectType: 'Residential Building', // Could be determined from project data
    })
    
    // Calculate dates
    const startDate = new Date()
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + timelineData.total_duration)
    
    // Save timeline to database
    const { data: savedTimeline, error: timelineError } = await supabase
      .from('timelines')
      .insert({
        project_id: validatedData.projectId,
        user_id: user.id,
        data: timelineData,
        total_duration: timelineData.total_duration,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
      })
      .select()
      .single()
    
    if (timelineError) {
      return NextResponse.json(
        { success: false, error: 'Failed to save timeline' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: savedTimeline,
      message: 'Timeline generated successfully',
    })
  } catch (error: any) {
    console.error('Generate timeline error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate timeline' },
      { status: 500 }
    )
  }
}
