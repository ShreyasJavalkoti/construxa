"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileSpreadsheet, Upload, FolderPlus, Calendar } from "lucide-react"
import { Project } from "@/lib/supabase/client"

interface ActivityFeedProps {
  projects: Project[]
}

export function ActivityFeed({ projects }: ActivityFeedProps) {
  // Generate activity from recent projects
  const activities = projects.slice(0, 4).map((project, index) => {
    const activityTypes = [
      {
        icon: FolderPlus,
        text: `Project created: ${project.name}`,
        time: "Just now",
        color: "text-purple-600 bg-purple-100",
      },
      {
        icon: Upload,
        text: `Drawing uploaded to ${project.name}`,
        time: "2 hours ago",
        color: "text-blue-600 bg-blue-100",
      },
      {
        icon: FileSpreadsheet,
        text: `BOQ generated for ${project.name}`,
        time: "5 hours ago",
        color: "text-green-600 bg-green-100",
      },
      {
        icon: Calendar,
        text: `Timeline created for ${project.name}`,
        time: "1 day ago",
        color: "text-orange-600 bg-orange-100",
      },
    ]
    return activityTypes[index % activityTypes.length]
  })

  if (activities.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-center py-8">No recent activity</p>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-full ${activity.color} flex items-center justify-center flex-shrink-0`}
              >
                <activity.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 leading-tight">{activity.text}</p>
                <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
