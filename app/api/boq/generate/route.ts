import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/server'
import { generateBOQ, generateMockBOQ } from '@/lib/openai/boq'

// POST: Generate BOQ for a project
export async function POST(request: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { project_id, analysis_data } = body

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

    // Get the latest drawing analysis if not provided
    let analysisToUse = analysis_data

    if (!analysisToUse) {
      const { data: latestDrawing } = await supabaseAdmin
        .from('drawings')
        .select('analysis_result')
        .eq('project_id', project_id)
        .eq('analysis_status', 'completed')
        .order('uploaded_at', { ascending: false })
        .limit(1)
        .single()

      if (latestDrawing?.analysis_result) {
        analysisToUse = latestDrawing.analysis_result
      }
    }

    if (!analysisToUse) {
      return NextResponse.json(
        { error: 'No analysis data found. Please analyze a drawing first.' },
        { status: 400 }
      )
    }

    // Generate BOQ using OpenAI
    let boqData
    const result = await generateBOQ(project.name, analysisToUse)

    if (result.success && result.data) {
      boqData = result.data
    } else {
      // Use mock BOQ if OpenAI fails or is not configured
      console.log('Using mock BOQ:', result.error)
      const totalArea = parseFloat(analysisToUse.totalArea) || 88.26
      boqData = generateMockBOQ(project.name, totalArea)
    }

    // Save BOQ to database
    const { data: savedBoq, error: saveError } = await supabaseAdmin
      .from('boqs')
      .insert({
        project_id: project_id,
        items: boqData,
        total_cost: boqData.costBreakdown.grandTotal,
        currency: 'INR',
      })
      .select()
      .single()

    if (saveError) {
      return NextResponse.json({ error: saveError.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      boq: savedBoq,
      data: boqData,
    })
  } catch (error) {
    console.error('Generate BOQ error:', error)
    return NextResponse.json({ error: 'Failed to generate BOQ' }, { status: 500 })
  }
}
