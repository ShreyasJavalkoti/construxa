"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, FileText, Eye, Sparkles, Download, Trash2, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"

type DrawingStatus = "uploaded" | "parsing" | "analyzed" | "error"

interface Drawing {
  id: string
  name: string
  size: string
  type: string
  uploadDate: string
  status: DrawingStatus
  progress?: number
  category: string
}

export function DrawingsTab() {
  const [fileType, setFileType] = useState<string>("plan")
  const [drawings, setDrawings] = useState<Drawing[]>([
    {
      id: "1",
      name: "Ground Floor Plan.dxf",
      size: "2.4 MB",
      type: "DXF",
      uploadDate: "Dec 20",
      status: "analyzed",
      category: "Plan",
    },
    {
      id: "2",
      name: "First Floor Plan.dwg",
      size: "3.1 MB",
      type: "DWG",
      uploadDate: "Dec 20",
      status: "parsing",
      progress: 65,
      category: "Plan",
    },
    {
      id: "3",
      name: "Front Elevation.dxf",
      size: "1.8 MB",
      type: "DXF",
      uploadDate: "Dec 19",
      status: "uploaded",
      category: "Elevation",
    },
  ])

  const getStatusConfig = (status: DrawingStatus) => {
    const configs = {
      uploaded: {
        label: "Uploaded",
        className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
        icon: Upload,
      },
      parsing: {
        label: "Parsing",
        className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
        icon: Spinner,
      },
      analyzed: {
        label: "Analyzed",
        className: "bg-green-500/10 text-green-600 border-green-500/20",
        icon: () => <span>✓</span>,
      },
      error: {
        label: "Error",
        className: "bg-red-500/10 text-red-600 border-red-500/20",
        icon: AlertCircle,
      },
    }
    return configs[status]
  }

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="border-2 border-dashed border-blue-300 bg-blue-50/30 hover:bg-blue-50/50 transition-colors cursor-pointer">
          <CardContent className="p-12 text-center">
            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
              <Upload className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Drag & drop CAD files here</h3>
            <p className="text-gray-600 mb-4">or click to browse</p>
            <p className="text-sm text-gray-500 mb-6">Supported: DWG, DXF (max 50MB)</p>
            <div className="flex items-center justify-center gap-4">
              <Select value={fileType} onValueChange={setFileType}>
                <SelectTrigger className="w-48 bg-white">
                  <SelectValue placeholder="Select file type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plan">Plan</SelectItem>
                  <SelectItem value="elevation">Elevation</SelectItem>
                  <SelectItem value="section">Section</SelectItem>
                  <SelectItem value="structural">Structural</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Upload className="w-4 h-4 mr-2" />
                Browse Files
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Drawing Cards Grid */}
      {drawings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drawings.map((drawing, index) => {
            const statusConfig = getStatusConfig(drawing.status)
            const StatusIcon = statusConfig.icon

            return (
              <motion.div
                key={drawing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 border-gray-200 overflow-hidden group">
                  <CardContent className="p-6">
                    {/* Thumbnail */}
                    <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-6 mb-4 flex items-center justify-center aspect-video">
                      <FileText className="w-16 h-16 text-blue-600" />
                    </div>

                    {/* File Info */}
                    <h4 className="font-semibold text-gray-900 mb-2 truncate">{drawing.name}</h4>
                    <p className="text-sm text-gray-500 mb-3">
                      {drawing.size} | {drawing.type} | Uploaded {drawing.uploadDate}
                    </p>

                    {/* Status Badge */}
                    <Badge variant="outline" className={`${statusConfig.className} mb-3 flex items-center gap-1 w-fit`}>
                      {drawing.status === "parsing" ? (
                        <Spinner className="w-3 h-3" />
                      ) : (
                        <StatusIcon className="w-3 h-3" />
                      )}
                      {statusConfig.label}
                    </Badge>

                    {/* Progress Bar */}
                    {drawing.status === "parsing" && drawing.progress && (
                      <div className="mb-4">
                        <Progress value={drawing.progress} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1 text-right">{drawing.progress}%</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        disabled={drawing.status !== "uploaded"}
                      >
                        <Sparkles className="w-4 h-4 mr-1" />
                        Analyze
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50 bg-transparent">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center py-20"
        >
          <div className="mb-6">
            <FileText className="w-24 h-24 mx-auto text-gray-300" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">No drawings uploaded yet</h3>
          <p className="text-gray-600 mb-6">Upload your first CAD file to get started</p>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Upload className="w-4 h-4 mr-2" />
            Upload Drawing
          </Button>
        </motion.div>
      )}
    </div>
  )
}
