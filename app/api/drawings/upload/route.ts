import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/server'

// POST - Upload a drawing file
export async function POST(request: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const projectId = formData.get('project_id') as string

    if (!file || !projectId) {
      return NextResponse.json(
        { error: 'file and project_id are required' },
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

    // Validate file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    const allowedExtensions = ['pdf', 'dwg', 'dxf']
    
    if (!allowedExtensions.includes(fileExtension || '')) {
      return NextResponse.json(
        { error: 'Only PDF, DWG, and DXF files are allowed' },
        { status: 400 }
      )
    }

    // Upload to Supabase Storage
    const fileName = `${projectId}/${Date.now()}_${file.name}`
    const fileBuffer = await file.arrayBuffer()
    const fileBlob = new Blob([fileBuffer])

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('drawings')
      .upload(fileName, fileBlob, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: uploadError.message || 'Failed to upload file' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('drawings')
      .getPublicUrl(fileName)

    // Create drawing record in database
    const { data: drawing, error: dbError } = await supabaseAdmin
      .from('drawings')
      .insert({
        project_id: projectId,
        file_name: file.name,
        file_path: fileName,
        file_size: file.size,
        file_type: fileExtension || 'unknown',
        analysis_status: 'pending',
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Try to clean up uploaded file
      await supabaseAdmin.storage.from('drawings').remove([fileName])
      return NextResponse.json({ error: dbError.message }, { status: 400 })
    }

    return NextResponse.json({
      drawing,
      file_url: urlData.publicUrl,
    }, { status: 201 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
