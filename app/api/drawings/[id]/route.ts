import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET a specific drawing
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { data, error } = await supabase
      .from('drawings')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
    
    if (error) {
      return NextResponse.json(
        { success: false, error: 'Drawing not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error: any) {
    console.error('Get drawing error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// DELETE a specific drawing
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Get drawing to delete file from storage
    const { data: drawing } = await supabase
      .from('drawings')
      .select('file_url')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
    
    if (drawing) {
      // Extract file path from URL and delete from storage
      const urlParts = drawing.file_url.split('/drawings/')
      if (urlParts.length > 1) {
        await supabase.storage
          .from('drawings')
          .remove([urlParts[1]])
      }
    }
    
    const { error } = await supabase
      .from('drawings')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
    
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Drawing deleted successfully',
    })
  } catch (error: any) {
    console.error('Delete drawing error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
