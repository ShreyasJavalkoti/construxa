import { useState } from 'react'
import { BOQ } from '@/types/database'
import { BOQData } from '@/types/openai'

export function useBOQ(projectId: string) {
  const [boq, setBOQ] = useState<BOQ | null>(null)
  const [boqData, setBOQData] = useState<BOQData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBOQ = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/boq?project_id=${projectId}`)

      if (!response.ok) {
        throw new Error('Failed to fetch BOQ')
      }

      const data = await response.json()
      setBOQ(data.boq)
      if (data.boq?.items) {
        setBOQData(data.boq.items)
      }
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch BOQ')
      setBOQ(null)
      setBOQData(null)
    } finally {
      setLoading(false)
    }
  }

  const generateBOQ = async (analysisData?: any): Promise<{ success: boolean; data?: BOQData; error?: string }> => {
    try {
      setLoading(true)
      const response = await fetch('/api/boq/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          analysis_data: analysisData,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate BOQ')
      }

      setBOQ(result.boq)
      setBOQData(result.data)
      setError(null)
      
      return { success: true, data: result.data }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate BOQ'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    boq,
    boqData,
    loading,
    error,
    fetchBOQ,
    generateBOQ,
  }
}
