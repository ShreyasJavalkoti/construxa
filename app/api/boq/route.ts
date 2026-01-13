import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/server'

// GET - Get BOQ items for a project
export async function GET(request: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('project_id')

    if (!projectId) {
      return NextResponse.json(
        { error: 'project_id is required' },
        { status: 400 }
      )
    }

    // Verify user owns the project
    const { data: project } = await supabaseAdmin
      .from('projects')
      .select('user_id')
      .eq('id', projectId)
      .single()

    if (!project || project.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Fetch BOQ from boqs table
    const { data: boq, error } = await supabaseAdmin
      .from('boqs')
      .select('*')
      .eq('project_id', projectId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!boq) {
      return NextResponse.json({ 
        items: [],
        subtotal: 0,
        overhead: 0,
        gst: 0,
        grand_total: 0
      })
    }

    // Calculate totals from items
    const items = boq.items || []
    const subtotal = items.reduce((sum: number, item: any) => {
      return sum + (item.quantity * item.rate)
    }, 0)
    const overhead = subtotal * 0.10 // 10% overhead
    const gst = (subtotal + overhead) * 0.18 // 18% GST
    const grandTotal = subtotal + overhead + gst

    return NextResponse.json({
      items,
      subtotal,
      overhead,
      gst,
      grand_total: grandTotal,
    })
  } catch (error) {
    console.error('Get BOQ error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch BOQ' },
      { status: 500 }
    )
  }
}

// DELETE - Delete BOQ for regeneration
export async function DELETE(request: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('project_id')

    if (!projectId) {
      return NextResponse.json(
        { error: 'project_id is required' },
        { status: 400 }
      )
    }

    // Verify user owns the project
    const { data: project } = await supabaseAdmin
      .from('projects')
      .select('user_id')
      .eq('id', projectId)
      .single()

    if (!project || project.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Delete BOQ
    const { error } = await supabaseAdmin
      .from('boqs')
      .delete()
      .eq('project_id', projectId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete BOQ error:', error)
    return NextResponse.json(
      { error: 'Failed to delete BOQ' },
      { status: 500 }
    )
  }
}
