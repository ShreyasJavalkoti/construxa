"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, Brain, Zap, Upload, Bot, Edit, Download, Check, Play } from "lucide-react"
import { motion } from "framer-motion"

export default function ConstructaLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Construxa
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
              Pricing
            </a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Contact
            </a>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
              🚀 AI-Powered | Trusted by 500+ Construction Companies
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              Transform AutoCAD Drawings into Project Timelines & BOQs in Minutes
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto text-pretty">
              AI-powered construction intelligence. Upload DWG/DXF files, get instant timelines and detailed Bills of
              Quantities with accurate Indian market rates.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Start Free Trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg border-2 border-blue-500 text-blue-600 hover:bg-blue-50 bg-transparent"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </motion.div>

          {/* Hero Image/Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 max-w-6xl mx-auto"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
              <img src="/modern-construction-dashboard-with-cad-drawings--t.jpg" alt="Construxa Dashboard Preview" className="w-full h-auto" />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need for construction project intelligence</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Cloud className="w-12 h-12 text-blue-600" />,
                title: "Upload CAD Drawings",
                description: "Support for DWG and DXF files up to 50MB",
              },
              {
                icon: <Brain className="w-12 h-12 text-purple-600" />,
                title: "AI Analysis",
                description: "Advanced AI extracts rooms, dimensions, materials automatically",
              },
              {
                icon: <Zap className="w-12 h-12 text-blue-600" />,
                title: "Instant Results",
                description: "Generate timelines and BOQs in under 2 minutes",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-8 text-center h-full hover:shadow-xl transition-shadow bg-white/70 backdrop-blur-sm border-2 border-gray-100 hover:border-blue-200">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">How It Works</h2>
            <p className="text-xl text-gray-600">Get started in 4 simple steps</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                icon: <Upload className="w-10 h-10 text-white" />,
                title: "Upload AutoCAD Drawings",
                description: "Drag and drop your DWG or DXF files",
              },
              {
                step: 2,
                icon: <Bot className="w-10 h-10 text-white" />,
                title: "AI Analyzes & Extracts Data",
                description: "Our AI processes your drawings instantly",
              },
              {
                step: 3,
                icon: <Edit className="w-10 h-10 text-white" />,
                title: "Review & Customize",
                description: "Fine-tune the results to your needs",
              },
              {
                step: 4,
                icon: <Download className="w-10 h-10 text-white" />,
                title: "Export Timeline & BOQ",
                description: "Download detailed reports and schedules",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg">
                    <div className="relative">
                      {item.icon}
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-purple-600 border-2 border-purple-600">
                        {item.step}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 -z-10" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that fits your needs</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* FREE Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
            >
              <Card className="p-8 h-full hover:shadow-xl transition-all bg-white">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">FREE</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">₹0</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">3 projects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">10 drawings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Basic support</span>
                  </li>
                </ul>
                <Button className="w-full bg-transparent" variant="outline">
                  Start Free
                </Button>
              </Card>
            </motion.div>

            {/* PRO Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-8 h-full hover:shadow-2xl transition-all bg-gradient-to-br from-blue-500 to-purple-600 text-white border-4 border-white shadow-xl transform md:scale-105 relative">
                <Badge className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 border-0">Popular</Badge>
                <h3 className="text-2xl font-bold mb-2">PRO</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold">₹1,999</span>
                  <span className="text-blue-100">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span>Unlimited projects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span>Unlimited drawings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span>Advanced analytics</span>
                  </li>
                </ul>
                <Button className="w-full bg-white text-purple-600 hover:bg-gray-100">Start Pro Trial</Button>
              </Card>
            </motion.div>

            {/* ENTERPRISE Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-8 h-full hover:shadow-xl transition-all bg-white">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">ENTERPRISE</h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-gray-900">Contact Sales</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Custom pricing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Dedicated account manager</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Custom integrations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">SLA guarantee</span>
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white">Contact Us</Button>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Left - Logo and Tagline */}
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Construxa
              </div>
              <p className="text-gray-400">Construction Intelligence, Delivered</p>
            </div>

            {/* Middle - Links */}
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-gray-400 hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Right - Social Icons */}
            <div>
              <h4 className="font-bold mb-4">Connect With Us</h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <span className="sr-only">GitHub</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>Copyright © 2025 Construxa. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
