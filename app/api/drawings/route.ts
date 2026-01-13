import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/server'

// GET - List drawings for a project
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

    // Fetch drawings
    const { data: drawings, error } = await supabaseAdmin
      .from('drawings')
      .select('*')
      .eq('project_id', projectId)
      .order('uploaded_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ drawings: drawings || [] })
  } catch (error) {
    console.error('Get drawings error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch drawings' },
      { status: 500 }
    )
  }
}

// POST - Create a drawing record
export async function POST(request: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { project_id, file_name, file_path, file_size, file_type } = body

    if (!project_id || !file_name || !file_path) {
      return NextResponse.json(
        { error: 'project_id, file_name, and file_path are required' },
        { status: 400 }
      )
    }

    // Verify user owns the project
    const { data: project } = await supabaseAdmin
      .from('projects')
      .select('user_id')
      .eq('id', project_id)
      .single()

    if (!project || project.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Create drawing record
    const { data: drawing, error } = await supabaseAdmin
      .from('drawings')
      .insert({
        project_id,
        file_name,
        file_path,
        file_size: file_size || 0,
        file_type: file_type || 'unknown',
        analysis_status: 'pending',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ drawing }, { status: 201 })
  } catch (error) {
    console.error('Create drawing error:', error)
    return NextResponse.json(
      { error: 'Failed to create drawing' },
      { status: 500 }
    )
  }
}
