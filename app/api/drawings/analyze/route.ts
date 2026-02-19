import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { analyzeDrawing } from '@/lib/openai/analyze'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { drawing_id } = body

    if (!drawing_id) {
      return NextResponse.json({ error: 'drawing_id is required' }, { status: 400 })
    }

    // Get drawing details
    const { data: drawing, error: drawingError } = await supabase
      .from('drawings')
      .select('*')
      .eq('id', drawing_id)
      .eq('user_id', user.id)
      .single()

    if (drawingError || !drawing) {
      return NextResponse.json({ error: 'Drawing not found' }, { status: 404 })
    }

    // Update status to analyzing
    await supabase
      .from('drawings')
      .update({ status: 'analyzing' })
      .eq('id', drawing_id)

    // Get public URL for the drawing
    const adminClient = createAdminClient()
    const { data: { publicUrl } } = adminClient.storage
      .from('drawings')
      .getPublicUrl(drawing.file_path)

    // Analyze with OpenAI
    try {
      const analysis = await analyzeDrawing(publicUrl, drawing.name)

      // Update drawing with analysis results
      const { data: updatedDrawing, error: updateError } = await supabase
        .from('drawings')
        .update({
          status: 'analyzed',
          analysis_result: analysis,
        })
        .eq('id', drawing_id)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      return NextResponse.json({ drawing: updatedDrawing, analysis })
    } catch (analysisError: any) {
      // TODO(types): Replace `any` with a typed analysis error shape.
      // Update status to error
      await supabase
        .from('drawings')
        .update({ status: 'error' })
        .eq('id', drawing_id)

      return NextResponse.json(
        { error: `Analysis failed: ${analysisError.message}` },
        { status: 500 }
      )
    }
  } catch (error: any) {
    // TODO(types): Replace `any` with a typed error shape for API responses.
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
