import { useState } from 'react'
import { TimelineTask } from '@/types'
import { toast } from 'sonner'

interface TimelineData {
  tasks: TimelineTask[]
  start_date: string | null
  end_date: string | null
}

export function useTimeline(projectId: string) {
  const [timeline, setTimeline] = useState<TimelineData | null>(null)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)

  // Fetch timeline for a project
  const fetchTimeline = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/timeline?project_id=${projectId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch timeline')
      }
      
      const data = await response.json()
      setTimeline(data)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch timeline')
      setTimeline(null)
    } finally {
      setLoading(false)
    }
  }

  // Generate timeline with AI
  const generateTimeline = async (analysisData?: any, startDate?: string) => {
    try {
      setGenerating(true)
      
      const response = await fetch('/api/timeline/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          analysis_data: analysisData,
          start_date: startDate,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to generate timeline')
      }

      const data = await response.json()
      toast.success('Timeline generated successfully')
      
      // Update timeline state
      setTimeline(data)
      
      return { success: true, timeline: data }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate timeline')
      return { success: false, error: error instanceof Error ? error.message : 'Generation failed' }
    } finally {
      setGenerating(false)
    }
  }

  // Update task progress
  const updateTaskProgress = async (taskIndex: number, progress: number) => {
    try {
      const response = await fetch('/api/timeline', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          task_index: taskIndex,
          progress,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update task progress')
      }

      const data = await response.json()
      toast.success('Task progress updated')
      
      // Update timeline state
      if (timeline) {
        setTimeline({
          ...timeline,
          tasks: data.tasks,
        })
      }
      
      return { success: true }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update task progress')
      return { success: false, error: error instanceof Error ? error.message : 'Update failed' }
    }
  }

  return {
    timeline,
    loading,
    generating,
    fetchTimeline,
    generateTimeline,
    updateTaskProgress,
  }
}
