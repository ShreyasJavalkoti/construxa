"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Download, RefreshCw, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTimeline } from "@/hooks/use-timeline"
import { useBOQ } from "@/hooks/use-boq"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"

export function TimelineTab({ projectId }: { projectId: string }) {
  const { timeline, timelineData, loading, error, fetchTimeline, generateTimeline } = useTimeline(projectId)
  const { boqData } = useBOQ(projectId)

  useEffect(() => {
    fetchTimeline()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  const handleGenerate = async () => {
    if (!boqData) {
      toast.error('Please generate BOQ first before creating timeline')
      return
    }

    toast.loading('Generating construction timeline...')
    const result = await generateTimeline(boqData)
    toast.dismiss()

    if (result.success) {
      toast.success('Timeline generated successfully!')
    } else {
      toast.error(result.error || 'Failed to generate timeline')
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      "pending": "bg-gray-500/10 text-gray-600 border-gray-500/20",
      "in_progress": "bg-blue-500/10 text-blue-600 border-blue-500/20",
      "completed": "bg-green-500/10 text-green-600 border-green-500/20",
    }
    return variants[status as keyof typeof variants] || variants["pending"]
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // If no timeline data, show generate UI
  if (!timelineData && !loading) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card className="border-2 border-dashed border-green-300 bg-green-50/30">
            <CardContent className="p-12 text-center">
              <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                <Calendar className="w-16 h-16 mx-auto mb-4 text-green-600" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Generate Construction Timeline</h3>
              <p className="text-gray-600 mb-6">
                Create a detailed construction timeline with proper phase sequencing
              </p>
              <Button
                className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                onClick={handleGenerate}
                disabled={loading || !boqData}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Timeline
              </Button>
              {!boqData && (
                <p className="text-sm text-gray-500 mt-4">Generate BOQ first</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Show loading
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="w-8 h-8 text-green-600" />
      </div>
    )
  }

  const phases = timelineData?.phases || []
  const totalDuration = timelineData?.totalDuration || 0

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <p className="text-sm text-blue-600 mb-2">Total Duration</p>
              <p className="text-4xl font-bold text-blue-900">{totalDuration} days</p>
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
        <Button 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={handleGenerate}
          disabled={loading}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Regenerate Timeline
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
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
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Phase Details</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Phase Name</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>End</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Dependencies</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {phases.map((phase) => (
                    <TableRow key={phase.id}>
                      <TableCell className="font-medium">{phase.name}</TableCell>
                      <TableCell>{formatDate(phase.startDate)}</TableCell>
                      <TableCell>{formatDate(phase.endDate)}</TableCell>
                      <TableCell>{phase.duration} days</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusBadge(phase.status)}>
                          {phase.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {phase.dependencies.length > 0 ? phase.dependencies.join(', ') : '-'}
                      </TableCell>
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
