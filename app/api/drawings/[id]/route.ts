import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/server'

// GET: Get single drawing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const { data: drawing, error } = await supabaseAdmin
      .from('drawings')
      .select('*, projects!inner(user_id)')
      .eq('id', id)
      .single()

    if (error || !drawing) {
      return NextResponse.json({ error: 'Drawing not found' }, { status: 404 })
    }

    // Verify project belongs to user
    if (drawing.projects.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Get signed URL for the file
    const { data: urlData } = await supabaseAdmin.storage
      .from('drawings')
      .createSignedUrl(drawing.file_path, 3600)

    return NextResponse.json({
      drawing: {
        ...drawing,
        file_url: urlData?.signedUrl,
      },
    })
  } catch (error) {
    console.error('Get drawing error:', error)
    return NextResponse.json({ error: 'Failed to fetch drawing' }, { status: 500 })
  }
}

// DELETE: Delete drawing
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Get drawing details
    const { data: drawing, error: fetchError } = await supabaseAdmin
      .from('drawings')
      .select('*, projects!inner(user_id)')
      .eq('id', id)
      .single()

    if (fetchError || !drawing) {
      return NextResponse.json({ error: 'Drawing not found' }, { status: 404 })
    }

    // Verify project belongs to user
    if (drawing.projects.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Delete from storage
    await supabaseAdmin.storage
      .from('drawings')
      .remove([drawing.file_path])

    // Delete from database
    const { error: deleteError } = await supabaseAdmin
      .from('drawings')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete drawing error:', error)
    return NextResponse.json({ error: 'Failed to delete drawing' }, { status: 500 })
  }
}
