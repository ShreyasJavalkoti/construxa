import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/server'
import { getProjectWithDrawings, updateProject, deleteProject } from '@/lib/supabase/queries'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const project = await getProjectWithDrawings(supabaseAdmin, params.id, user.id)

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Get project error:', error)
    const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch project' },
      { status: statusCode }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()

    // Validate updates - remove any fields that shouldn't be updated
    const allowedFields = [
      'name',
      'description',
      'status',
      'start_date',
      'end_date',
      'estimated_duration',
    ]
    const validUpdates = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key]
        return obj
      }, {} as Record<string, any>)

    if (Object.keys(validUpdates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const project = await updateProject(supabaseAdmin, params.id, validUpdates, user.id)

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Update project error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update project' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await deleteProject(supabaseAdmin, params.id, user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete project error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete project' },
      { status: 500 }
    )
  }
}
