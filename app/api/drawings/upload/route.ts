import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/server'

// POST: Upload drawing file
export async function POST(request: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const projectId = formData.get('project_id') as string

    if (!file || !projectId) {
      return NextResponse.json({ error: 'File and project ID are required' }, { status: 400 })
    }

    // Verify project belongs to user
    const { data: project } = await supabaseAdmin
      .from('projects')
      .select('user_id')
      .eq('id', projectId)
      .single()

    if (!project || project.user_id !== user.id) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Generate file path
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${user.id}/${projectId}/${fileName}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('drawings')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 400 })
    }

    // Create drawing record in database
    const { data: drawing, error: dbError } = await supabaseAdmin
      .from('drawings')
      .insert({
        project_id: projectId,
        file_name: file.name,
        file_path: uploadData.path,
        file_size: file.size,
        file_type: file.type || fileExt || 'unknown',
        analysis_status: 'pending',
        analysis_result: null,
      })
      .select()
      .single()

    if (dbError) {
      // Cleanup uploaded file if database insert fails
      await supabaseAdmin.storage.from('drawings').remove([filePath])
      return NextResponse.json({ error: dbError.message }, { status: 400 })
    }

    // Get signed URL for the file
    const { data: urlData } = await supabaseAdmin.storage
      .from('drawings')
      .createSignedUrl(uploadData.path, 3600)

    return NextResponse.json({
      success: true,
      drawing: {
        ...drawing,
        file_url: urlData?.signedUrl,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Upload drawing error:', error)
    return NextResponse.json({ error: 'Failed to upload drawing' }, { status: 500 })
  }
}
