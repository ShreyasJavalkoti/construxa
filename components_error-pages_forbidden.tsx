"use client"

import { motion } from "framer-motion"
import { ShieldAlert, ArrowLeft, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function ForbiddenError() {
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

        {/* 403 Text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mb-8"
        >
          <h2 className="text-[120px] font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent leading-none">
            403
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
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <ShieldAlert className="h-40 w-40 text-gray-300" strokeWidth={1.5} />
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Access denied</h3>
          <p className="text-lg text-gray-600 leading-relaxed">
            You don&apos;t have permission to access this resource. Contact your administrator if you think this is a
            mistake.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg w-full sm:w-auto"
          >
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Go Back
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
            <MessageCircle className="mr-2 h-5 w-5" />
            Contact Support
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
