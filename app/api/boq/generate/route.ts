import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateBOQ } from '@/lib/openai/boq'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { project_id } = body

    if (!project_id) {
      return NextResponse.json({ error: 'project_id is required' }, { status: 400 })
    }

    // Get project details
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', project_id)
      .eq('user_id', user.id)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Get analyzed drawings
    const { data: drawings, error: drawingsError } = await supabase
      .from('drawings')
      .select('*')
      .eq('project_id', project_id)
      .eq('status', 'analyzed')
      .not('analysis_result', 'is', null)

    if (drawingsError) {
      return NextResponse.json({ error: drawingsError.message }, { status: 500 })
    }

    if (!drawings || drawings.length === 0) {
      return NextResponse.json(
        { error: 'No analyzed drawings found for this project' },
        { status: 400 }
      )
    }

    // Use the first drawing's analysis or combine multiple
    const analysis = drawings[0].analysis_result

    // Generate BOQ using OpenAI
    const boqItems = await generateBOQ({
      name: project.name,
      analysis,
    })

    // Delete existing BOQ items for this project
    await supabase.from('boq_items').delete().eq('project_id', project_id)

    // Insert new BOQ items
    const itemsToInsert = boqItems.map((item, index) => ({
      project_id,
      category: item.category,
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
      rate: item.rate,
      sort_order: index,
    }))

    const { data: insertedItems, error: insertError } = await supabase
      .from('boq_items')
      .insert(itemsToInsert)
      .select()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    // Calculate total cost
    const totalCost = insertedItems.reduce(
      (sum, item) => sum + (item.quantity * item.rate),
      0
    )

    // Update project with total cost
    await supabase
      .from('projects')
      .update({ total_cost: totalCost })
      .eq('id', project_id)

    return NextResponse.json({ items: insertedItems, totalCost })
  } catch (error: any) {
    // TODO(types): Replace `any` with a typed error shape for API responses.
    console.error('BOQ generation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
