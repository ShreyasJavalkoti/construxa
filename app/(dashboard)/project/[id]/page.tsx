"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Trash2, Download, ChevronDown, Loader2, Pencil, FileText, FileSpreadsheet, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { DrawingsTab } from "@/components/project/drawings-tab"
import { TimelineTab } from "@/components/project/timeline-tab"
import { BOQTab } from "@/components/project/boq-tab"
import { SummaryTab } from "@/components/project/summary-tab"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useProject } from "@/hooks/use-project"
import { toast } from "sonner"

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const { project, loading, refetch } = useProject(projectId)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [activeTab, setActiveTab] = useState("drawings")
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [projectTitle, setProjectTitle] = useState("")

  useEffect(() => {
    setProjectTitle(project?.name ?? "")
  }, [project?.name])

  const projectStatus = project?.status ?? "archived"

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete project')
      }

      toast.success('Project deleted successfully')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Failed to delete project')
    } finally {
      setDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const getStatusBadge = () => {
    if (!project) return "bg-gray-500/10 text-gray-600 border-gray-500/20"
    
    const variants = {
      active: "bg-green-500/10 text-green-600 border-green-500/20",
      completed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      archived: "bg-gray-500/10 text-gray-600 border-gray-500/20",
    }
    return variants[project.status] || variants.archived
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Project not found</h2>
          <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Projects</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{projectTitle}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </motion.div>

        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 relative overflow-hidden"
        >
          {/* Gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Left side */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                {isEditingTitle ? (
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    onBlur={() => setIsEditingTitle(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setIsEditingTitle(false)
                    }}
                    className="text-3xl font-bold text-gray-900 bg-transparent border-b-2 border-blue-500 focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 group">
                    {projectTitle}
                    <button
                      onClick={() => setIsEditingTitle(true)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Pencil className="w-5 h-5 text-gray-400 hover:text-blue-500" />
                    </button>
                  </h1>
                )}
              </div>
              <p className="text-gray-600 mb-3 leading-relaxed">
                Modern residential complex with 120 units across 4 towers
              </p>
              <p className="text-sm text-gray-500">Created on Dec 15, 2025 | Last updated: 2 hours ago</p>
            </div>

            {/* Right side */}
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className={`${getStatusBadge()} px-4 py-1.5`}>
                {projectStatus}
              </Badge>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Download className="w-4 h-4 mr-2" />
                    Export All
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <FileText className="w-4 h-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Export as Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="w-4 h-4 mr-2" />
                    Export as MS Project XML
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share Project
              </Button>

              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6 bg-white p-1 rounded-lg shadow-sm">
              <TabsTrigger value="drawings" className="flex items-center gap-2">
                <span>📁</span>
                <span className="hidden sm:inline">Drawings</span>
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex items-center gap-2">
                <span>📅</span>
                <span className="hidden sm:inline">Timeline</span>
              </TabsTrigger>
              <TabsTrigger value="boq" className="flex items-center gap-2">
                <span>📊</span>
                <span className="hidden sm:inline">BOQ</span>
              </TabsTrigger>
              <TabsTrigger value="summary" className="flex items-center gap-2">
                <span>📈</span>
                <span className="hidden sm:inline">Summary</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="drawings" className="mt-0">
              <DrawingsTab />
            </TabsContent>

            <TabsContent value="timeline" className="mt-0">
              <TimelineTab />
            </TabsContent>

            <TabsContent value="boq" className="mt-0">
              <BOQTab />
            </TabsContent>

            <TabsContent value="summary" className="mt-0">
              <SummaryTab />
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Project?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{projectTitle}"? This action cannot be undone and will permanently
                delete all associated drawings, timelines, and BOQ data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting..." : "Delete Project"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
