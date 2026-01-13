import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/server'
import { generateTimeline, generateMockTimeline } from '@/lib/openai/timeline'

// POST: Generate timeline for a project
export async function POST(request: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { project_id, boq_data, start_date } = body

    if (!project_id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    // Verify project belongs to user
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', project_id)
      .single()

    if (projectError || !project || project.user_id !== user.id) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Get BOQ data if not provided
    let boqToUse = boq_data

    if (!boqToUse) {
      const { data: latestBoq } = await supabaseAdmin
        .from('boqs')
        .select('items')
        .eq('project_id', project_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (latestBoq?.items) {
        boqToUse = latestBoq.items
      }
    }

    if (!boqToUse) {
      return NextResponse.json(
        { error: 'No BOQ data found. Please generate BOQ first.' },
        { status: 400 }
      )
    }

    // Get total area from BOQ or drawing analysis
    let totalArea = 88.26 // default
    if (boqToUse.summary?.totalBuiltUpArea) {
      totalArea = parseFloat(boqToUse.summary.totalBuiltUpArea)
    }

    // Generate timeline using OpenAI
    let timelineData
    const result = await generateTimeline(project.name, boqToUse, totalArea, start_date)

    if (result.success && result.data) {
      timelineData = result.data
    } else {
      // Use mock timeline if OpenAI fails or is not configured
      console.log('Using mock timeline:', result.error)
      timelineData = generateMockTimeline(project.name, totalArea, start_date)
    }

    // Save timeline to database
    const { data: savedTimeline, error: saveError } = await supabaseAdmin
      .from('timelines')
      .insert({
        project_id: project_id,
        tasks: timelineData,
        start_date: timelineData.startDate,
        end_date: timelineData.estimatedEndDate,
      })
      .select()
      .single()

    if (saveError) {
      return NextResponse.json({ error: saveError.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      timeline: savedTimeline,
      data: timelineData,
    })
  } catch (error) {
    console.error('Generate timeline error:', error)
    return NextResponse.json({ error: 'Failed to generate timeline' }, { status: 500 })
  }
}
