"use client"

import { motion } from "framer-motion"
import { CloudUpload, FileText } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function NoDrawingsEmptyState() {
  return (
    <div className="flex items-center justify-center min-h-[500px] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-xl w-full"
      >
        <motion.div
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="mb-8 flex justify-center"
        >
          <div className="relative">
            <CloudUpload className="h-32 w-32 text-gray-300" strokeWidth={1.5} />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
              className="absolute inset-0 border-4 border-dashed border-gray-200 rounded-full"
            />
          </div>
        </motion.div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">No drawings uploaded yet</h2>
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          Upload AutoCAD files (DWG/DXF) to get started with AI analysis
        </p>

        <Card className="p-12 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer group mb-6">
          <CloudUpload className="h-16 w-16 text-gray-400 group-hover:text-blue-500 mx-auto mb-4 transition-colors" />
          <p className="text-lg font-semibold text-gray-700 mb-2">Drag & drop files here</p>
          <p className="text-gray-500">or click to browse</p>
        </Card>

        <div className="flex items-center justify-center gap-4 mb-4">
          <Badge variant="secondary" className="py-2 px-4 text-sm">
            <FileText className="mr-2 h-4 w-4" />
            DWG, DXF • Max 50MB
          </Badge>
        </div>

        <p className="text-sm text-gray-500">We support both 2D and 3D CAD files</p>
      </motion.div>
    </div>
  )
}
