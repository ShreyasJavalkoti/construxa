import { useState } from 'react'
import { Drawing } from '@/types/database'

export function useDrawings(projectId: string) {
  const [drawings, setDrawings] = useState<Drawing[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDrawings = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/drawings?project_id=${projectId}`)

      if (!response.ok) {
        throw new Error('Failed to fetch drawings')
      }

      const data = await response.json()
      setDrawings(data.drawings || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch drawings')
      setDrawings([])
    } finally {
      setLoading(false)
    }
  }

  const uploadDrawing = async (file: File): Promise<{ success: boolean; drawing?: any; error?: string }> => {
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('project_id', projectId)

      const response = await fetch('/api/drawings/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload drawing')
      }

      await fetchDrawings() // Refresh list
      return { success: true, drawing: data.drawing }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload drawing'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const analyzeDrawing = async (drawingId: string): Promise<{ success: boolean; analysis?: any; error?: string }> => {
    try {
      setLoading(true)
      const response = await fetch('/api/drawings/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drawing_id: drawingId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze drawing')
      }

      await fetchDrawings() // Refresh list to get updated status
      return { success: true, analysis: data.analysis }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze drawing'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const deleteDrawing = async (drawingId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true)
      const response = await fetch(`/api/drawings/${drawingId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete drawing')
      }

      await fetchDrawings() // Refresh list
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete drawing'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    drawings,
    loading,
    error,
    fetchDrawings,
    uploadDrawing,
    analyzeDrawing,
    deleteDrawing,
  }
}
