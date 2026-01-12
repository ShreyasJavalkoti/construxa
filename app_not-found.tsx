"use client"

import { motion } from "framer-motion"
import { Home, LayoutDashboard, FileQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
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

        {/* 404 Text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mb-8"
        >
          <h2 className="text-[120px] font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent leading-none">
            404
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
              rotate: [0, -5, 5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <FileQuestion className="h-40 w-40 text-gray-300" strokeWidth={1.5} />
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Page not found</h3>
          <p className="text-lg text-gray-600 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved to a new location
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-4"
        >
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
          >
            <Link href="/dashboard">
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Go to Dashboard
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
