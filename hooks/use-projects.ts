import { useState, useEffect } from 'react'
import { Project } from '@/lib/supabase/client'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/projects')
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }
      
      const data = await response.json()
      setProjects(data.projects || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects')
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (projectData: {
    name: string
    description?: string
    location?: string
    project_type?: string
  }) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      })

      if (!response.ok) {
        throw new Error('Failed to create project')
      }

      const data = await response.json()
      await fetchProjects() // Refresh list
      return { success: true, project: data.project }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to create project',
      }
    }
  }

  const deleteProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete project')
      }

      await fetchProjects() // Refresh list
      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to delete project',
      }
    }
  }

  return {
    projects,
    loading,
    error,
    createProject,
    deleteProject,
    refetch: fetchProjects,
  }
}
