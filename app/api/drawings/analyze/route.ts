import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { analyzeDrawing } from '@/lib/ai/analyze-drawing'

// POST analyze a drawing
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { drawingId } = body
    
    if (!drawingId) {
      return NextResponse.json(
        { success: false, error: 'Drawing ID is required' },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Get drawing
    const { data: drawing, error: drawingError } = await supabase
      .from('drawings')
      .select('*')
      .eq('id', drawingId)
      .eq('user_id', user.id)
      .single()
    
    if (drawingError || !drawing) {
      return NextResponse.json(
        { success: false, error: 'Drawing not found' },
        { status: 404 }
      )
    }
    
    // Update status to parsing
    await supabase
      .from('drawings')
      .update({ status: 'parsing' })
      .eq('id', drawingId)
    
    try {
      // Analyze the drawing using AI
      const analysisData = await analyzeDrawing({
        fileName: drawing.name,
        fileType: drawing.file_type || '',
        metadata: {
          category: drawing.category,
          fileSize: drawing.file_size,
        },
      })
      
      // Update drawing with analysis data
      const { data: updatedDrawing, error: updateError } = await supabase
        .from('drawings')
        .update({
          status: 'analyzed',
          analysis_data: analysisData,
        })
        .eq('id', drawingId)
        .select()
        .single()
      
      if (updateError) {
        throw updateError
      }
      
      return NextResponse.json({
        success: true,
        data: updatedDrawing,
        message: 'Drawing analyzed successfully',
      })
    } catch (aiError: any) {
      // Update status to error
      await supabase
        .from('drawings')
        .update({ status: 'error' })
        .eq('id', drawingId)
      
      console.error('AI analysis error:', aiError)
      return NextResponse.json(
        { success: false, error: 'Failed to analyze drawing' },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Analyze drawing error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
