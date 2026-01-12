"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { StatisticsCards } from "@/components/dashboard/statistics-cards"
import { ProjectsTable } from "@/components/dashboard/projects-table"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { useProjects } from "@/hooks/use-projects"
import { useUser } from "@/hooks/use-user"
import { CreateProjectModal } from "@/components/modals/create-project-modal"

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { projects, loading: projectsLoading, refetch } = useProjects()
  const { user, loading: userLoading } = useUser()

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "ml-20" : "ml-[280px]"}`}>
        <DashboardHeader />

        <main className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-600 mt-1">
                Welcome back, {user?.full_name || 'User'}! Here's your project overview.
              </p>
            </div>
            <QuickActions onCreateProject={() => setShowCreateModal(true)} />
          </div>

          <StatisticsCards projects={projects} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ProjectsTable projects={projects} loading={projectsLoading} onRefresh={refetch} />
            </div>
            <div>
              <ActivityFeed projects={projects} />
            </div>
          </div>
        </main>
      </div>

      <CreateProjectModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={refetch}
      />
    </div>
  )
}
