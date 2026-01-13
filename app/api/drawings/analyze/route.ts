import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/server'
import { analyzeDrawing, generateMockAnalysis } from '@/lib/openai/analyze'

// POST: Analyze drawing with AI
export async function POST(request: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { drawing_id } = body

    if (!drawing_id) {
      return NextResponse.json({ error: 'Drawing ID is required' }, { status: 400 })
    }

    // Get drawing details
    const { data: drawing, error: drawingError } = await supabaseAdmin
      .from('drawings')
      .select('*, projects!inner(user_id)')
      .eq('id', drawing_id)
      .single()

    if (drawingError || !drawing) {
      return NextResponse.json({ error: 'Drawing not found' }, { status: 404 })
    }

    // Verify project belongs to user
    if (drawing.projects.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Update status to processing
    await supabaseAdmin
      .from('drawings')
      .update({ analysis_status: 'processing' })
      .eq('id', drawing_id)

    // Analyze the drawing
    // For MVP, we'll use mock analysis since we don't have actual CAD file parsing
    // In production, you would:
    // 1. Get the file from storage
    // 2. Convert to image if needed (for vision API)
    // 3. Call OpenAI vision API or specialized CAD parsing
    
    let analysisResult
    
    // Try to use OpenAI if configured, otherwise use mock
    const result = await analyzeDrawing(drawing.file_name, drawing.file_type)
    
    if (result.success && result.data) {
      analysisResult = result.data
    } else {
      // Use mock analysis if OpenAI fails or is not configured
      console.log('Using mock analysis:', result.error)
      analysisResult = generateMockAnalysis(drawing.file_name)
    }

    // Update drawing with analysis result
    const { data: updatedDrawing, error: updateError } = await supabaseAdmin
      .from('drawings')
      .update({
        analysis_status: 'completed',
        analysis_result: analysisResult,
      })
      .eq('id', drawing_id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      drawing: updatedDrawing,
      analysis: analysisResult,
    })
  } catch (error) {
    console.error('Analyze drawing error:', error)
    
    // Update status to failed
    const body = await request.json().catch(() => ({}))
    if (body.drawing_id) {
      await supabaseAdmin
        .from('drawings')
        .update({ analysis_status: 'failed' })
        .eq('id', body.drawing_id)
    }
    
    return NextResponse.json({ error: 'Failed to analyze drawing' }, { status: 500 })
  }
}
