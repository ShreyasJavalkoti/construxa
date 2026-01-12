"use client"

import { motion } from "framer-motion"
import { FileText, Sparkles, BarChart3, IndianRupee, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function NoBOQEmptyState() {
  const features = [
    { icon: BarChart3, title: "Category-wise breakdown", description: "Organized by work type" },
    { icon: IndianRupee, title: "CPWD/PWD rates", description: "Current market prices" },
    { icon: Download, title: "Export to Excel/PDF", description: "Easy sharing" },
  ]

  return (
    <div className="flex items-center justify-center min-h-[500px] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl"
      >
        <Card className="p-12 backdrop-blur-sm bg-white shadow-lg">
          <motion.div className="mb-8 flex justify-center">
            <div className="relative">
              <FileText className="h-32 w-32 text-gray-300" strokeWidth={1.5} />
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                <Sparkles className="absolute -top-4 -right-4 h-12 w-12 text-purple-400" />
              </motion.div>
            </div>
          </motion.div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">BOQ not generated yet</h2>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Create a detailed Bill of Quantities with accurate Indian market rates
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Card className="p-6 border-2 border-gray-100 hover:border-purple-200 transition-colors h-full">
                    <Icon className="h-8 w-8 text-purple-500 mb-3 mx-auto" />
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg w-full mb-4"
          >
            Generate BOQ
          </Button>

          <p className="text-sm text-gray-500">Requires at least one analyzed drawing</p>
        </Card>
      </motion.div>
    </div>
  )
}
