"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Upload, FileText, Eye, Sparkles, Download, Trash2, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { useDrawings } from "@/hooks/use-drawings"
import { toast } from "sonner"
import { Drawing as DrawingType } from "@/types/database"

type DrawingStatus = "pending" | "processing" | "completed" | "failed"

export function DrawingsTab({ projectId }: { projectId: string }) {
  const [fileType, setFileType] = useState<string>("plan")
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const {
    drawings,
    loading,
    error,
    fetchDrawings,
    uploadDrawing,
    analyzeDrawing,
    deleteDrawing,
  } = useDrawings(projectId)

  useEffect(() => {
    fetchDrawings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['.dwg', '.dxf', '.pdf']
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!validTypes.includes(fileExt)) {
      toast.error('Invalid file type. Please upload DWG, DXF, or PDF files.')
      return
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('File size exceeds 50MB limit.')
      return
    }

    toast.loading('Uploading drawing...')
    const result = await uploadDrawing(file)
    toast.dismiss()

    if (result.success) {
      toast.success('Drawing uploaded successfully!')
      setUploadProgress(0)
    } else {
      toast.error(result.error || 'Failed to upload drawing')
    }
  }

  const handleAnalyze = async (drawingId: string) => {
    toast.loading('Analyzing drawing with AI...')
    const result = await analyzeDrawing(drawingId)
    toast.dismiss()

    if (result.success) {
      toast.success('Drawing analyzed successfully!')
    } else {
      toast.error(result.error || 'Failed to analyze drawing')
    }
  }

  const handleDelete = async (drawingId: string, fileName: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return
    }

    toast.loading('Deleting drawing...')
    const result = await deleteDrawing(drawingId)
    toast.dismiss()

    if (result.success) {
      toast.success('Drawing deleted successfully!')
    } else {
      toast.error(result.error || 'Failed to delete drawing')
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getStatusConfig = (status: DrawingStatus) => {
    const configs = {
      pending: {
        label: "Uploaded",
        className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
        icon: Upload,
      },
      processing: {
        label: "Analyzing",
        className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
        icon: Spinner,
      },
      completed: {
        label: "Analyzed",
        className: "bg-green-500/10 text-green-600 border-green-500/20",
        icon: () => <span>✓</span>,
      },
      failed: {
        label: "Failed",
        className: "bg-red-500/10 text-red-600 border-red-500/20",
        icon: AlertCircle,
      },
    }
    return configs[status]
  }

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".dwg,.dxf,.pdf"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Zone */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card 
          className="border-2 border-dashed border-blue-300 bg-blue-50/30 hover:bg-blue-50/50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="p-12 text-center">
            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
              <Upload className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Drag & drop CAD files here</h3>
            <p className="text-gray-600 mb-4">or click to browse</p>
            <p className="text-sm text-gray-500 mb-6">Supported: DWG, DXF, PDF (max 50MB)</p>
            <div className="flex items-center justify-center gap-4" onClick={(e) => e.stopPropagation()}>
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
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                <Upload className="w-4 h-4 mr-2" />
                Browse Files
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Drawing Cards Grid */}
      {loading && drawings.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Spinner className="w-8 h-8 text-blue-600" />
        </div>
      ) : drawings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drawings.map((drawing, index) => {
            const statusConfig = getStatusConfig(drawing.analysis_status)
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
                    <h4 className="font-semibold text-gray-900 mb-2 truncate">{drawing.file_name}</h4>
                    <p className="text-sm text-gray-500 mb-3">
                      {formatFileSize(drawing.file_size)} | {drawing.file_type.toUpperCase()} | {formatDate(drawing.uploaded_at)}
                    </p>

                    {/* Status Badge */}
                    <Badge variant="outline" className={`${statusConfig.className} mb-3 flex items-center gap-1 w-fit`}>
                      {drawing.analysis_status === "processing" ? (
                        <Spinner className="w-3 h-3" />
                      ) : (
                        <StatusIcon className="w-3 h-3" />
                      )}
                      {statusConfig.label}
                    </Badge>

                    {/* Action Buttons */}
                    <div className="flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        disabled={drawing.analysis_status !== "pending" || loading}
                        onClick={() => handleAnalyze(drawing.id)}
                      >
                        <Sparkles className="w-4 h-4 mr-1" />
                        Analyze
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:bg-red-50 bg-transparent"
                        onClick={() => handleDelete(drawing.id, drawing.file_name)}
                        disabled={loading}
                      >
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
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Drawing
          </Button>
        </motion.div>
      )}
    </div>
  )
}
