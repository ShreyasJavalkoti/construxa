"use client"

import { motion } from "framer-motion"
import { Calendar, Check, Circle, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function NoTimelineEmptyState() {
  const requirements = [
    { label: "Upload drawings", completed: true },
    { label: "Analyze drawings", completed: true },
    { label: "Generate timeline", completed: false },
  ]

  return (
    <div className="flex items-center justify-center min-h-[500px] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-xl"
      >
        <Card className="p-12 backdrop-blur-sm bg-white shadow-lg">
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="mb-8 flex justify-center"
          >
            <div className="relative">
              <Calendar className="h-32 w-32 text-gray-300" strokeWidth={1.5} />
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl"
              >
                ?
              </motion.div>
            </div>
          </motion.div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">Timeline not generated yet</h2>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Generate an AI-powered project timeline from your analyzed drawings
          </p>

          <div className="space-y-3 mb-8">
            {requirements.map((req, index) => (
              <motion.div
                key={req.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-center gap-3 text-left"
              >
                {req.completed ? (
                  <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                ) : (
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                    <Circle className="h-3 w-3 text-gray-300" />
                  </div>
                )}
                <span className={req.completed ? "text-green-700 font-medium" : "text-gray-500"}>{req.label}</span>
              </motion.div>
            ))}
          </div>

          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg w-full"
          >
            Generate Timeline
          </Button>

          <Badge variant="secondary" className="mt-6 py-2 px-4">
            <Zap className="mr-2 h-4 w-4 text-yellow-500" />
            Takes ~30 seconds
          </Badge>
        </Card>
      </motion.div>
    </div>
  )
}
