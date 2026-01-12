"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Download, RefreshCw, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Task {
  id: string
  name: string
  start: string
  end: string
  duration: string
  status: "Not Started" | "In Progress" | "Completed"
  dependencies: string
  color: string
  startDay: number
  durationDays: number
  progress: number
}

export function TimelineTab() {
  const [tasks] = useState<Task[]>([
    {
      id: "1",
      name: "Foundation",
      start: "Jan 5",
      end: "Jan 25",
      duration: "20 days",
      status: "Completed",
      dependencies: "-",
      color: "bg-blue-500",
      startDay: 0,
      durationDays: 20,
      progress: 100,
    },
    {
      id: "2",
      name: "Structure - Ground Floor",
      start: "Jan 20",
      end: "Feb 15",
      duration: "25 days",
      status: "In Progress",
      dependencies: "Foundation",
      color: "bg-purple-500",
      startDay: 15,
      durationDays: 25,
      progress: 60,
    },
    {
      id: "3",
      name: "Structure - First Floor",
      start: "Feb 10",
      end: "Mar 5",
      duration: "23 days",
      status: "Not Started",
      dependencies: "Structure - Ground Floor",
      color: "bg-purple-500",
      startDay: 35,
      durationDays: 23,
      progress: 0,
    },
    {
      id: "4",
      name: "MEP - Plumbing",
      start: "Feb 20",
      end: "Mar 20",
      duration: "28 days",
      status: "Not Started",
      dependencies: "Structure - Ground Floor",
      color: "bg-green-500",
      startDay: 45,
      durationDays: 28,
      progress: 0,
    },
    {
      id: "5",
      name: "MEP - Electrical",
      start: "Mar 1",
      end: "Mar 30",
      duration: "29 days",
      status: "Not Started",
      dependencies: "Structure - First Floor",
      color: "bg-green-500",
      startDay: 55,
      durationDays: 29,
      progress: 0,
    },
    {
      id: "6",
      name: "Finishing - Plastering",
      start: "Mar 15",
      end: "Apr 10",
      duration: "25 days",
      status: "Not Started",
      dependencies: "MEP - Plumbing",
      color: "bg-orange-500",
      startDay: 70,
      durationDays: 25,
      progress: 0,
    },
    {
      id: "7",
      name: "Finishing - Painting",
      start: "Apr 5",
      end: "Apr 25",
      duration: "20 days",
      status: "Not Started",
      dependencies: "Finishing - Plastering",
      color: "bg-orange-500",
      startDay: 90,
      durationDays: 20,
      progress: 0,
    },
    {
      id: "8",
      name: "Handover",
      start: "Apr 20",
      end: "May 5",
      duration: "15 days",
      status: "Not Started",
      dependencies: "Finishing - Painting",
      color: "bg-red-500",
      startDay: 105,
      durationDays: 15,
      progress: 0,
    },
  ])

  const getStatusBadge = (status: string) => {
    const variants = {
      "Not Started": "bg-gray-500/10 text-gray-600 border-gray-500/20",
      "In Progress": "bg-blue-500/10 text-blue-600 border-blue-500/20",
      Completed: "bg-green-500/10 text-green-600 border-green-500/20",
    }
    return variants[status as keyof typeof variants] || variants["Not Started"]
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <p className="text-sm text-blue-600 mb-2">Total Duration</p>
              <p className="text-4xl font-bold text-blue-900">120 days</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 mb-2">Start Date</p>
                <p className="text-2xl font-bold text-purple-900">Jan 5, 2026</p>
              </div>
              <Calendar className="w-10 h-10 text-purple-400" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-pink-600 mb-2">End Date</p>
                <p className="text-2xl font-bold text-pink-900">May 5, 2026</p>
              </div>
              <Calendar className="w-10 h-10 text-pink-400" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex flex-wrap gap-3"
      >
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Sparkles className="w-4 h-4 mr-2" />
          Generate Timeline
        </Button>
        <Button variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Regenerate
        </Button>
        <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
          <Download className="w-4 h-4 mr-2" />
          Export to MS Project
        </Button>
      </motion.div>

      {/* Gantt Chart Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Timeline View</h3>

            {/* Timeline Header */}
            <div className="mb-4 flex items-center gap-2 pl-64 overflow-x-auto pb-2">
              {["Jan", "Feb", "Mar", "Apr", "May"].map((month, index) => (
                <div key={month} className="text-xs font-medium text-gray-500 w-48 text-center">
                  {month}
                </div>
              ))}
            </div>

            {/* Gantt Bars */}
            <div className="space-y-4">
              {tasks.map((task, index) => (
                <div key={task.id} className="flex items-center gap-4">
                  <div className="w-56 flex-shrink-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{task.name}</p>
                  </div>
                  <div className="flex-1 relative h-10 bg-gray-100 rounded-lg overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(task.durationDays / 120) * 100}%` }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className={`absolute h-full ${task.color} rounded-lg flex items-center px-3 text-white text-xs font-medium shadow-sm`}
                      style={{ left: `${(task.startDay / 120) * 100}%` }}
                    >
                      {task.progress > 0 && (
                        <div className="absolute inset-0 bg-white/20" style={{ width: `${task.progress}%` }} />
                      )}
                      <span className="relative z-10">{task.progress}%</span>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Task List Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Task Details</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task Name</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>End</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Dependencies</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.name}</TableCell>
                      <TableCell>{task.start}</TableCell>
                      <TableCell>{task.end}</TableCell>
                      <TableCell>{task.duration}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusBadge(task.status)}>
                          {task.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">{task.dependencies}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
