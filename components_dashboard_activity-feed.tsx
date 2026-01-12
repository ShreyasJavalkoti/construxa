"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileSpreadsheet, Upload, FolderPlus, Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const activities = [
  {
    icon: FileSpreadsheet,
    text: "BOQ generated for Residential Complex",
    time: "2 hours ago",
    color: "text-green-600 bg-green-100",
  },
  {
    icon: Upload,
    text: "Drawing uploaded: Floor Plan.dwg",
    time: "5 hours ago",
    color: "text-blue-600 bg-blue-100",
  },
  {
    icon: FolderPlus,
    text: "Project created: Commercial Building",
    time: "1 day ago",
    color: "text-purple-600 bg-purple-100",
  },
  {
    icon: Calendar,
    text: "Timeline exported for Office Tower",
    time: "2 days ago",
    color: "text-orange-600 bg-orange-100",
  },
]

export function ActivityFeed() {
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
        <Button variant="ghost" size="sm" className="w-full mt-4 text-blue-600 hover:text-blue-700">
          View all activity
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  )
}
