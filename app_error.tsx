"use client"

import { motion } from "framer-motion"
import { RefreshCw, MessageCircle, Activity, ServerCrash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [errorId] = useState(() => {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 10000)
    return `ERR-${timestamp}-${random}`
  })

  useEffect(() => {
    console.error("[v0] Error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, #3b82f6 0px, #3b82f6 1px, transparent 1px, transparent 20px),
                           repeating-linear-gradient(90deg, #3b82f6 0px, #3b82f6 1px, transparent 1px, transparent 20px)`,
          }}
        />
      </div>

      <div className="relative z-10 text-center px-6 max-w-2xl">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Construxa
          </h1>
        </motion.div>

        {/* 500 Text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mb-8"
        >
          <h2 className="text-[120px] font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent leading-none">
            500
          </h2>
        </motion.div>

        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 flex justify-center"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <ServerCrash className="h-40 w-40 text-gray-300" strokeWidth={1.5} />
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mb-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Something went wrong</h3>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Our team has been notified and we&apos;re working on fixing the issue. Please try again in a few moments.
          </p>

          <Badge variant="secondary" className="text-sm font-mono py-2 px-4">
            Error ID: #{errorId}
          </Badge>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
        >
          <Button
            onClick={reset}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg w-full sm:w-auto"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Try Again
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
            <MessageCircle className="mr-2 h-5 w-5" />
            Contact Support
          </Button>
        </motion.div>

        <motion.a
          href="/status"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-2"
        >
          <Activity className="h-4 w-4" />
          Check system status →
        </motion.a>
      </div>
    </div>
  )
}
