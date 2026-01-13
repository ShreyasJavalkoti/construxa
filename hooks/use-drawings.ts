import { useState } from 'react'

export interface Drawing {
  id: string
  project_id: string
  name: string
  file_path: string
  file_size: number
  file_type: string
  category: string
  status: 'uploaded' | 'analyzing' | 'analyzed' | 'error'
  analysis_result: any
  created_at: string
}

export function useDrawings(projectId: string) {
  const [drawings, setDrawings] = useState<Drawing[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDrawings = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/drawings?project_id=${projectId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch drawings')
      }

      setDrawings(data.drawings || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const uploadDrawing = async (file: File, category: string = 'other') => {
    try {
      setLoading(true)
      setError(null)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('project_id', projectId)
      formData.append('category', category)

      const response = await fetch('/api/drawings/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload drawing')
      }

      await fetchDrawings()
      return data.drawing
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const analyzeDrawing = async (drawingId: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/drawings/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drawing_id: drawingId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze drawing')
      }

      await fetchDrawings()
      return data.analysis
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteDrawing = async (drawingId: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/drawings/${drawingId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete drawing')
      }

      await fetchDrawings()
    } catch (err: any) {
      setError(err.message)
      throw err
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
