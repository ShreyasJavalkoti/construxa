import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/server'
import { generateBOQ } from '@/lib/openai/boq'

// POST - Generate BOQ with AI
export async function POST(request: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { project_id, analysis_data } = body

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

    // Generate BOQ items using OpenAI
    const boqItems = await generateBOQ(projectAnalysis, {
      projectType: project.project_type || undefined,
      location: project.location || undefined,
    })

    // Calculate totals
    const itemsWithAmount = boqItems.map(item => ({
      ...item,
      project_id,
      amount: item.quantity * item.rate,
    }))

    const subtotal = itemsWithAmount.reduce((sum, item) => sum + item.amount, 0)
    const overhead = subtotal * 0.10 // 10% overhead
    const gst = (subtotal + overhead) * 0.18 // 18% GST
    const grandTotal = subtotal + overhead + gst

    // Delete existing BOQ if any
    await supabaseAdmin
      .from('boqs')
      .delete()
      .eq('project_id', project_id)

    // Save new BOQ to database
    const { data: boq, error: boqError } = await supabaseAdmin
      .from('boqs')
      .insert({
        project_id,
        items: itemsWithAmount,
        total_cost: grandTotal,
        currency: 'INR',
      })
      .select()
      .single()

    if (boqError) {
      console.error('BOQ save error:', boqError)
      return NextResponse.json({ error: boqError.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      items: itemsWithAmount,
      subtotal,
      overhead,
      gst,
      grand_total: grandTotal,
    })
  } catch (error) {
    console.error('Generate BOQ error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to generate BOQ',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
