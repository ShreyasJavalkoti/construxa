import { supabase } from './client'

const DRAWINGS_BUCKET = 'drawings'

export interface UploadResult {
  path: string
  publicUrl?: string
  error?: string
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadDrawing(
  file: File,
  userId: string,
  projectId: string
): Promise<UploadResult> {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${userId}/${projectId}/${fileName}`

    const { data, error } = await supabase.storage
      .from(DRAWINGS_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Upload error:', error)
      return { path: '', error: error.message }
    }

    return { path: data.path }
  } catch (error) {
    console.error('Upload exception:', error)
    return { path: '', error: 'Failed to upload file' }
  }
}

/**
 * Get a signed URL for a drawing
 */
export async function getDrawingUrl(path: string, expiresIn = 3600): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from(DRAWINGS_BUCKET)
      .createSignedUrl(path, expiresIn)

    if (error) {
      console.error('Error getting signed URL:', error)
      return null
    }

    return data.signedUrl
  } catch (error) {
    console.error('Exception getting signed URL:', error)
    return null
  }
}

/**
 * Delete a drawing from storage
 */
export async function deleteDrawing(path: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(DRAWINGS_BUCKET)
      .remove([path])

    if (error) {
      console.error('Delete error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Delete exception:', error)
    return false
  }
}

/**
 * List all drawings for a project
 */
export async function listProjectDrawings(
  userId: string,
  projectId: string
): Promise<string[]> {
  try {
    const { data, error } = await supabase.storage
      .from(DRAWINGS_BUCKET)
      .list(`${userId}/${projectId}`)

    if (error) {
      console.error('List error:', error)
      return []
    }

    return data.map(file => `${userId}/${projectId}/${file.name}`)
  } catch (error) {
    console.error('List exception:', error)
    return []
  }
}
