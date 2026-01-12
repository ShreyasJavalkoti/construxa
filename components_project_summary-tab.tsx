"use client"

import { motion } from "framer-motion"
import { TrendingUp, Users, FileText, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

export function SummaryTab() {
  const costData = [
    { name: "Concrete Work", value: 1250000, color: "#8B5CF6" },
    { name: "Finishing", value: 490000, color: "#3B82F6" },
    { name: "Earthwork", value: 420000, color: "#10B981" },
    { name: "Masonry", value: 380000, color: "#F59E0B" },
  ]

  const activities = [
    { id: 1, user: "John Doe", action: "uploaded Ground Floor Plan.dxf", time: "2 hours ago" },
    { id: 2, user: "Sarah Smith", action: "generated BOQ report", time: "5 hours ago" },
    { id: 3, user: "Mike Johnson", action: "updated timeline", time: "1 day ago" },
    { id: 4, user: "Emily Brown", action: "shared project with team", time: "2 days ago" },
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                <span className="text-green-600 text-sm font-medium">+12%</span>
              </div>
              <p className="text-sm text-blue-600 mb-1">Project Progress</p>
              <p className="text-3xl font-bold text-blue-900">35%</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-sm text-purple-600 mb-1">Total Drawings</p>
              <p className="text-3xl font-bold text-purple-900">12</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm text-green-600 mb-1">Team Members</p>
              <p className="text-3xl font-bold text-green-900">8</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <p className="text-sm text-orange-600 mb-1">Days Remaining</p>
              <p className="text-3xl font-bold text-orange-900">78</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Breakdown Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Cost Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={costData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {costData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `₹${value.toLocaleString("en-IN")}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Timeline Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Timeline Progress</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Foundation</span>
                    <span className="text-sm text-green-600 font-semibold">100%</span>
                  </div>
                  <Progress value={100} className="h-3" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Structure</span>
                    <span className="text-sm text-blue-600 font-semibold">60%</span>
                  </div>
                  <Progress value={60} className="h-3" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">MEP Work</span>
                    <span className="text-sm text-gray-600 font-semibold">0%</span>
                  </div>
                  <Progress value={0} className="h-3" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Finishing</span>
                    <span className="text-sm text-gray-600 font-semibold">0%</span>
                  </div>
                  <Progress value={0} className="h-3" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {activity.user.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
