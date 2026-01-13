import { useState } from 'react'

export interface TimelineTask {
  id: string
  project_id: string
  name: string
  start_date: string
  end_date: string
  duration: number
  status: 'not_started' | 'in_progress' | 'completed'
  progress: number
  dependencies: string[]
}

export function useTimeline(projectId: string) {
  const [tasks, setTasks] = useState<TimelineTask[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTimeline = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/timeline?project_id=${projectId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch timeline')
      }

      setTasks(data.tasks || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const generateTimeline = async (startDate?: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/timeline/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          start_date: startDate || new Date().toISOString().split('T')[0],
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate timeline')
      }

      setTasks(data.tasks || [])
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    tasks,
    loading,
    error,
    fetchTimeline,
    generateTimeline,
  }
}
