import { useState } from 'react'
import { Timeline } from '@/types/database'
import { TimelineData } from '@/types/openai'

export function useTimeline(projectId: string) {
  const [timeline, setTimeline] = useState<Timeline | null>(null)
  const [timelineData, setTimelineData] = useState<TimelineData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTimeline = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/timeline?project_id=${projectId}`)

      if (!response.ok) {
        throw new Error('Failed to fetch timeline')
      }

      const data = await response.json()
      setTimeline(data.timeline)
      if (data.timeline?.tasks) {
        setTimelineData(data.timeline.tasks)
      }
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch timeline')
      setTimeline(null)
      setTimelineData(null)
    } finally {
      setLoading(false)
    }
  }

  const generateTimeline = async (
    boqData?: any,
    startDate?: string
  ): Promise<{ success: boolean; data?: TimelineData; error?: string }> => {
    try {
      setLoading(true)
      const response = await fetch('/api/timeline/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          boq_data: boqData,
          start_date: startDate,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate timeline')
      }

      setTimeline(result.timeline)
      setTimelineData(result.data)
      setError(null)
      
      return { success: true, data: result.data }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate timeline'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    timeline,
    timelineData,
    loading,
    error,
    fetchTimeline,
    generateTimeline,
  }
}
