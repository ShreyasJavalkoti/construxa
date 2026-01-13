import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const projectId = formData.get('project_id') as string
    const category = formData.get('category') as string || 'other'

    if (!file || !projectId) {
      return NextResponse.json(
        { error: 'file and project_id are required' },
        { status: 400 }
      )
    }

    // Upload to Supabase Storage
    const fileName = `${user.id}/${projectId}/${Date.now()}_${file.name}`
    const adminClient = createAdminClient()
    
    const { data: uploadData, error: uploadError } = await adminClient.storage
      .from('drawings')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Get public URL
    const { data: { publicUrl } } = adminClient.storage
      .from('drawings')
      .getPublicUrl(fileName)

    // Create drawing record
    const { data: drawing, error: dbError } = await supabase
      .from('drawings')
      .insert({
        project_id: projectId,
        user_id: user.id,
        name: file.name,
        file_path: fileName,
        file_size: file.size,
        file_type: file.name.split('.').pop()?.toLowerCase() || 'unknown',
        category,
        status: 'uploaded',
      })
      .select()
      .single()

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({ drawing, publicUrl }, { status: 201 })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
