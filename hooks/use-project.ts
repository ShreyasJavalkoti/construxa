import { useState, useEffect } from 'react'
import { Project, Drawing } from '@/lib/supabase/client'

interface ProjectWithDrawings extends Project {
  drawings?: Drawing[]
}

export function useProject(projectId: string | null) {
  const [project, setProject] = useState<ProjectWithDrawings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (projectId) {
      fetchProject()
    }
  }, [projectId])

  const fetchProject = async () => {
    if (!projectId) return

    try {
      setLoading(true)
      const response = await fetch(`/api/projects/${projectId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch project')
      }
      
      const data = await response.json()
      setProject(data.project)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch project')
      setProject(null)
    } finally {
      setLoading(false)
    }
  }

  return {
    project,
    loading,
    error,
    refetch: fetchProject,
  }
}
