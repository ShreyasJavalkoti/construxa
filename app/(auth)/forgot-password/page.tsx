"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Mail, Loader2, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log("[v0] Forgot password email:", data.email)
    setIsSuccess(true)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Gradient Background with Pattern */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 relative overflow-hidden"
      >
        {/* Blueprint Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="blueprint" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="100" height="100" fill="none" stroke="white" strokeWidth="0.5" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="white" strokeWidth="0.5" />
                <line x1="50" y1="0" x2="50" y2="100" stroke="white" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="20" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#blueprint)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-white px-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-6">Password Recovery</h1>
            <p className="text-xl text-blue-100 max-w-md">
              Don't worry! We'll help you get back to your construction projects in no time.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Forgot Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 bg-white/70 backdrop-blur-sm shadow-xl border-2 border-gray-100">
            {/* Logo */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Construxa
              </h2>
            </div>

            {!isSuccess ? (
              <>
                {/* Heading */}
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset your password</h1>
                  <p className="text-gray-600">Enter your email to receive a reset link</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        {...register("email")}
                      />
                    </div>
                    {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                  </div>

                  {/* Send Reset Link Button */}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>

                  {/* Back to Login Link */}
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to login
                  </Link>
                </form>
              </>
            ) : (
              <>
                {/* Success State */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
                  <p className="text-gray-600 mb-8">
                    We've sent a password reset link to your email address. Please check your inbox and follow the
                    instructions.
                  </p>
                  <Link href="/login">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to login
                    </Button>
                  </Link>
                </motion.div>
              </>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
