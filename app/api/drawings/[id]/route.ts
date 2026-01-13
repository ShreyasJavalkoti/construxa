import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/server'

// GET - Get single drawing
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const drawingId = params.id

    // Fetch drawing with project info to verify ownership
    const { data: drawing, error } = await supabaseAdmin
      .from('drawings')
      .select('*, projects(user_id)')
      .eq('id', drawingId)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    // Verify ownership
    if ((drawing as any).projects?.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.json({ drawing })
  } catch (error) {
    console.error('Get drawing error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch drawing' },
      { status: 500 }
    )
  }
}

// DELETE - Delete drawing
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const drawingId = params.id

    // Fetch drawing with project info to verify ownership
    const { data: drawing, error: fetchError } = await supabaseAdmin
      .from('drawings')
      .select('*, projects(user_id)')
      .eq('id', drawingId)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 404 })
    }

    // Verify ownership
    if ((drawing as any).projects?.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Delete file from storage if it exists
    if (drawing.file_path) {
      try {
        const { error: storageError } = await supabaseAdmin.storage
          .from('drawings')
          .remove([drawing.file_path])
        
        if (storageError) {
          console.error('Storage delete error:', storageError)
          // Continue with DB deletion even if storage fails
        }
      } catch (storageError) {
        console.error('Storage delete error:', storageError)
      }
    }

    // Delete drawing record
    const { error: deleteError } = await supabaseAdmin
      .from('drawings')
      .delete()
      .eq('id', drawingId)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete drawing error:', error)
    return NextResponse.json(
      { error: 'Failed to delete drawing' },
      { status: 500 }
    )
  }
}
