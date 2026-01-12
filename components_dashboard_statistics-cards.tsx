"use client"

import { Folder, FileText, FileSpreadsheet, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { LineChart, Line, ResponsiveContainer } from "recharts"

const stats = [
  {
    title: "Total Projects",
    value: "24",
    subtitle: "+3 this month",
    icon: Folder,
    color: "from-blue-500 to-blue-600",
    data: [4, 5, 3, 6, 7, 5, 8],
  },
  {
    title: "Drawings Uploaded",
    value: "156",
    subtitle: "+12 this week",
    icon: FileText,
    color: "from-purple-500 to-purple-600",
    data: [3, 4, 6, 5, 8, 7, 9],
  },
  {
    title: "BOQs Generated",
    value: "18",
    subtitle: "₹2.4Cr total value",
    icon: FileSpreadsheet,
    color: "from-green-500 to-green-600",
    data: [2, 3, 4, 3, 5, 6, 7],
  },
  {
    title: "Timelines Created",
    value: "22",
    subtitle: "Avg 45 days",
    icon: Calendar,
    color: "from-orange-500 to-orange-600",
    data: [5, 4, 6, 5, 7, 6, 8],
  },
]

export function StatisticsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm text-slate-600 font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                <p className="text-sm text-green-600 font-medium mt-1">{stat.subtitle}</p>
              </div>
              <div
                className={`w-12 h-12 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center flex-shrink-0`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stat.data.map((value) => ({ value }))}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={`url(#gradient-${stat.title})`}
                    strokeWidth={2}
                    dot={false}
                  />
                  <defs>
                    <linearGradient id={`gradient-${stat.title}`} x1="0" y1="0" x2="1" y2="0">
                      <stop
                        offset="0%"
                        stopColor={
                          stat.color.includes("blue")
                            ? "#3b82f6"
                            : stat.color.includes("purple")
                              ? "#a855f7"
                              : stat.color.includes("green")
                                ? "#22c55e"
                                : "#f97316"
                        }
                      />
                      <stop
                        offset="100%"
                        stopColor={
                          stat.color.includes("blue")
                            ? "#2563eb"
                            : stat.color.includes("purple")
                              ? "#9333ea"
                              : stat.color.includes("green")
                                ? "#16a34a"
                                : "#ea580c"
                        }
                      />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
