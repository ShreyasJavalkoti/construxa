import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/server'
import { analyzeDrawing } from '@/lib/openai/analyze'

// POST - Analyze a drawing with AI
export async function POST(request: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { drawing_id, description } = body

    if (!drawing_id) {
      return NextResponse.json(
        { error: 'drawing_id is required' },
        { status: 400 }
      )
    }

    // Fetch drawing with project info to verify ownership
    const { data: drawing, error: fetchError } = await supabaseAdmin
      .from('drawings')
      .select('*, projects(user_id, name, description, location, project_type)')
      .eq('id', drawing_id)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 404 })
    }

    // Verify ownership
    const projectData = (drawing as any).projects
    if (projectData?.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Update status to processing
    await supabaseAdmin
      .from('drawings')
      .update({ analysis_status: 'processing' })
      .eq('id', drawing_id)

    // Build analysis input
    let analysisInput = description || ''
    
    if (!analysisInput) {
      // Build description from project and file info
      analysisInput = `
Project: ${projectData.name}
Type: ${projectData.project_type || 'Residential'}
Location: ${projectData.location || 'Not specified'}
Description: ${projectData.description || 'No description'}
File: ${drawing.file_name}
File Type: ${drawing.file_type}

Please analyze this construction project and provide detailed information about the built-up area, rooms, walls, doors, windows, foundation type, number of floors, and construction type.
      `.trim()
    }

    try {
      // Call OpenAI to analyze
      const analysis = await analyzeDrawing(analysisInput, drawing.file_type)

      // Update drawing with analysis results
      const { data: updatedDrawing, error: updateError } = await supabaseAdmin
        .from('drawings')
        .update({
          analysis_status: 'completed',
          analysis_result: analysis,
        })
        .eq('id', drawing_id)
        .select()
        .single()

      if (updateError) {
        throw new Error(updateError.message)
      }

      return NextResponse.json({
        success: true,
        drawing: updatedDrawing,
        analysis,
      })
    } catch (analysisError) {
      // Update status to failed
      await supabaseAdmin
        .from('drawings')
        .update({ 
          analysis_status: 'failed',
        })
        .eq('id', drawing_id)

      throw analysisError
    }
  } catch (error) {
    console.error('Analyze drawing error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to analyze drawing',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
