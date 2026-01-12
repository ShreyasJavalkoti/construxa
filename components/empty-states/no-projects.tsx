"use client"

import { motion } from "framer-motion"
import { FolderOpen, Plus, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function NoProjectsEmptyState() {
  return (
    <div className="flex items-center justify-center min-h-[600px] bg-gradient-radial from-blue-50 to-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl"
      >
        <Card className="p-12 backdrop-blur-sm bg-white/80 shadow-xl">
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="mb-8 flex justify-center"
          >
            <div className="relative">
              <FolderOpen className="h-32 w-32 text-gray-300" strokeWidth={1.5} />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="absolute -top-2 -right-2 h-6 w-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"
              />
            </div>
          </motion.div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">No projects yet</h2>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Create your first project to start analyzing CAD drawings and generating timelines
          </p>

          <div className="flex items-center justify-center gap-4 mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Your First Project
            </Button>
            <Button size="lg" variant="outline">
              <Play className="mr-2 h-5 w-5" />
              Watch Tutorial
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Upload Drawings", description: "Add your CAD files" },
              { title: "Generate Timeline", description: "AI-powered scheduling" },
              { title: "Create BOQ", description: "Accurate cost estimates" },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="p-4 border-2 border-gray-100 hover:border-blue-200 transition-colors">
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
