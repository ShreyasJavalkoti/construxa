import { useState } from 'react'
import { BOQSummary } from '@/types'
import { toast } from 'sonner'

export function useBOQ(projectId: string) {
  const [boq, setBOQ] = useState<BOQSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)

  // Fetch BOQ for a project
  const fetchBOQ = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/boq?project_id=${projectId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch BOQ')
      }
      
      const data = await response.json()
      setBOQ(data)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch BOQ')
      setBOQ(null)
    } finally {
      setLoading(false)
    }
  }

  // Generate BOQ with AI
  const generateBOQ = async (analysisData?: any) => {
    try {
      setGenerating(true)
      
      const response = await fetch('/api/boq/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          analysis_data: analysisData,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to generate BOQ')
      }

      const data = await response.json()
      toast.success('BOQ generated successfully')
      
      // Update BOQ state
      setBOQ(data)
      
      return { success: true, boq: data }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate BOQ')
      return { success: false, error: error instanceof Error ? error.message : 'Generation failed' }
    } finally {
      setGenerating(false)
    }
  }

  // Delete BOQ
  const deleteBOQ = async () => {
    try {
      const response = await fetch(`/api/boq?project_id=${projectId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete BOQ')
      }

      toast.success('BOQ deleted successfully')
      setBOQ(null)
      
      return { success: true }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete BOQ')
      return { success: false, error: error instanceof Error ? error.message : 'Delete failed' }
    }
  }

  return {
    boq,
    loading,
    generating,
    fetchBOQ,
    generateBOQ,
    deleteBOQ,
  }
}
