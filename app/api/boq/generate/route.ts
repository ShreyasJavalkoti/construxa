import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { generateBOQ } from '@/lib/ai/generate-boq'
import { generateBOQSchema } from '@/lib/validations'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = generateBOQSchema.parse(body)
    
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
    
    // Get drawings with analysis data
    const { data: drawings, error: drawingsError } = await supabase
      .from('drawings')
      .select('name, analysis_data')
      .in('id', validatedData.drawingIds)
      .eq('user_id', user.id)
    
    if (drawingsError || !drawings || drawings.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No drawings found' },
        { status: 404 }
      )
    }
    
    // Check if drawings are analyzed
    const unanalyzedDrawings = drawings.filter(d => !d.analysis_data)
    if (unanalyzedDrawings.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Some drawings are not yet analyzed. Please analyze them first.' },
        { status: 400 }
      )
    }
    
    // Generate BOQ using AI
    const boqData = await generateBOQ({
      projectName: project.name,
      drawings: drawings as any[],
      rateSource: validatedData.rateSource,
    })
    
    // Save BOQ to database
    const { data: savedBOQ, error: boqError } = await supabase
      .from('boq')
      .insert({
        project_id: validatedData.projectId,
        user_id: user.id,
        data: boqData,
        subtotal: boqData.subtotal,
        overhead: boqData.overhead,
        gst: boqData.gst,
        grand_total: boqData.grand_total,
        rate_source: validatedData.rateSource,
      })
      .select()
      .single()
    
    if (boqError) {
      return NextResponse.json(
        { success: false, error: 'Failed to save BOQ' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: savedBOQ,
      message: 'BOQ generated successfully',
    })
  } catch (error: any) {
    console.error('Generate BOQ error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate BOQ' },
      { status: 500 }
    )
  }
}
