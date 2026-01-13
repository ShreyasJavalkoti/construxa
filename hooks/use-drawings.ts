import { useState } from 'react'
import { Drawing } from '@/types'
import { toast } from 'sonner'

export function useDrawings(projectId: string) {
  const [drawings, setDrawings] = useState<Drawing[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState<string | null>(null)

  // Fetch drawings for a project
  const fetchDrawings = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/drawings?project_id=${projectId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch drawings')
      }
      
      const data = await response.json()
      setDrawings(data.drawings || [])
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch drawings')
      setDrawings([])
    } finally {
      setLoading(false)
    }
  }

  // Upload a new drawing file
  const uploadDrawing = async (file: File) => {
    try {
      setUploading(true)
      
      const formData = new FormData()
      formData.append('file', file)
      formData.append('project_id', projectId)

      const response = await fetch('/api/drawings/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to upload file')
      }

      const data = await response.json()
      toast.success('File uploaded successfully')
      
      // Refresh drawings list
      await fetchDrawings()
      
      return { success: true, drawing: data.drawing }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload file')
      return { success: false, error: error instanceof Error ? error.message : 'Upload failed' }
    } finally {
      setUploading(false)
    }
  }

  // Analyze a drawing with AI
  const analyzeDrawing = async (drawingId: string, description?: string) => {
    try {
      setAnalyzing(drawingId)
      
      const response = await fetch('/api/drawings/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          drawing_id: drawingId,
          description,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to analyze drawing')
      }

      const data = await response.json()
      toast.success('Drawing analyzed successfully')
      
      // Refresh drawings list
      await fetchDrawings()
      
      return { success: true, analysis: data.analysis }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to analyze drawing')
      return { success: false, error: error instanceof Error ? error.message : 'Analysis failed' }
    } finally {
      setAnalyzing(null)
    }
  }

  // Delete a drawing
  const deleteDrawing = async (drawingId: string) => {
    try {
      const response = await fetch(`/api/drawings/${drawingId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete drawing')
      }

      toast.success('Drawing deleted successfully')
      
      // Refresh drawings list
      await fetchDrawings()
      
      return { success: true }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete drawing')
      return { success: false, error: error instanceof Error ? error.message : 'Delete failed' }
    }
  }

  return {
    drawings,
    loading,
    uploading,
    analyzing,
    fetchDrawings,
    uploadDrawing,
    analyzeDrawing,
    deleteDrawing,
  }
}
