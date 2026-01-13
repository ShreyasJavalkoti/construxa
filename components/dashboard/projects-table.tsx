"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Trash2, FileImage, ArrowRight, Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Project } from "@/lib/supabase/client"
import { DeleteConfirmationModal } from "@/components/modals/delete-confirmation-modal"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { NoProjectsEmptyState } from "@/components/empty-states/no-projects"

interface ProjectsTableProps {
  projects: Project[]
  loading: boolean
  onRefresh: () => void
}

export function ProjectsTable({ projects, loading, onRefresh }: ProjectsTableProps) {
  const router = useRouter()
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; projectId: string | null }>({
    open: false,
    projectId: null,
  })
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteModal.projectId) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/projects/${deleteModal.projectId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete project')
      }

      toast.success('Project deleted successfully')
      onRefresh()
      setDeleteModal({ open: false, projectId: null })
    } catch (error) {
      toast.error('Failed to delete project')
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    )
  }

  if (projects.length === 0) {
    return <NoProjectsEmptyState />
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold">Recent Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-semibold text-slate-700">Project Name</TableHead>
                  <TableHead className="font-semibold text-slate-700">Status</TableHead>
                  <TableHead className="font-semibold text-slate-700">Drawings</TableHead>
                  <TableHead className="font-semibold text-slate-700">Created Date</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                          <FileImage className="w-4 h-4 text-white" />
                        </div>
                        {project.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          project.status === "active"
                            ? "default"
                            : project.status === "completed"
                              ? "secondary"
                              : "outline"
                        }
                        className={
                          project.status === "active"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : project.status === "completed"
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                              : "bg-slate-100 text-slate-700"
                        }
                      >
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600">{project.drawings_count} drawings</TableCell>
                    <TableCell className="text-slate-600">{formatDate(project.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 hover:text-blue-600"
                          onClick={() => router.push(`/project/${project.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 hover:text-red-600"
                          onClick={() => setDeleteModal({ open: true, projectId: project.id })}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 text-sm text-slate-600">
            Showing {projects.length} project{projects.length !== 1 ? 's' : ''}
          </div>
        </CardContent>
      </Card>

      <DeleteConfirmationModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, projectId: null })}
        onConfirm={handleDelete}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone and will delete all associated drawings and data."
        loading={deleting}
      />
    </>
  )
}
