"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronDown, ChevronRight, Download, FileSpreadsheet, FileText, RefreshCw, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useBOQ } from "@/hooks/use-boq"
import { useDrawings } from "@/hooks/use-drawings"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"

interface BOQItem {
  sno: string
  description: string
  quantity: number
  unit: string
  rate: number
  amount: number
}

interface BOQCategory {
  name: string
  items: BOQItem[]
  subtotal: number
  expanded?: boolean
}

export function BOQTab({ projectId }: { projectId: string }) {
  const { boq, boqData, loading, error, fetchBOQ, generateBOQ } = useBOQ(projectId)
  const { drawings } = useDrawings(projectId)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Earthwork & Site Preparation']))

  useEffect(() => {
    fetchBOQ()
  }, [projectId])
  useEffect(() => {
    fetchBOQ()
  }, [projectId])

  const handleGenerate = async () => {
    // Find the latest analyzed drawing
    const analyzedDrawing = drawings.find(d => d.analysis_status === 'completed')
    
    if (!analyzedDrawing) {
      toast.error('Please analyze a drawing first before generating BOQ')
      return
    }

    toast.loading('Generating BOQ with CPWD rates...')
    const result = await generateBOQ(analyzedDrawing.analysis_result)
    toast.dismiss()

    if (result.success) {
      toast.success('BOQ generated successfully!')
    } else {
      toast.error(result.error || 'Failed to generate BOQ')
    }
  }

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryName)) {
        newSet.delete(categoryName)
      } else {
        newSet.add(categoryName)
      }
      return newSet
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // If no BOQ data, show generate UI
  if (!boqData && !loading) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card className="border-2 border-dashed border-purple-300 bg-purple-50/30">
            <CardContent className="p-12 text-center">
              <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                <FileSpreadsheet className="w-16 h-16 mx-auto mb-4 text-purple-600" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Generate Bill of Quantities</h3>
              <p className="text-gray-600 mb-6">
                Create a detailed BOQ with CPWD 2024 rates based on your drawing analysis
              </p>
              <Button
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={handleGenerate}
                disabled={loading || drawings.length === 0}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate BOQ with AI
              </Button>
              {drawings.length === 0 && (
                <p className="text-sm text-gray-500 mt-4">Upload and analyze a drawing first</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Show loading
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="w-8 h-8 text-purple-600" />
      </div>
    )
  }

  // Calculate totals from boqData
  const categories: BOQCategory[] = boqData?.categories || []
  const subtotal = boqData?.costBreakdown?.subtotal || 0
  const overhead = boqData?.costBreakdown?.overhead || 0
  const gst = boqData?.costBreakdown?.gst || 0
  const grandTotal = boqData?.costBreakdown?.grandTotal || 0

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <p className="text-sm text-blue-600 mb-2">Subtotal</p>
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(subtotal)}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <p className="text-sm text-purple-600 mb-2">Overhead (12%)</p>
              <p className="text-2xl font-bold text-purple-900">{formatCurrency(overhead)}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
            <CardContent className="p-6">
              <p className="text-sm text-pink-600 mb-2">GST (18%)</p>
              <p className="text-2xl font-bold text-pink-900">{formatCurrency(gst)}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 ring-2 ring-green-300">
            <CardContent className="p-6">
              <p className="text-sm text-green-600 mb-2">Grand Total</p>
              <p className="text-3xl font-bold text-green-900">{formatCurrency(grandTotal)}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="flex flex-wrap gap-3"
      >
        <Button 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={handleGenerate}
          disabled={loading}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Regenerate BOQ
        </Button>
        <Button variant="outline">
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Export to Excel
        </Button>
        <Button variant="outline">
          <FileText className="w-4 h-4 mr-2" />
          Export to PDF
        </Button>
      </motion.div>

      {/* BOQ Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Bill of Quantities</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-gray-50 z-10">
                  <TableRow>
                    <TableHead className="w-16">S.No</TableHead>
                    <TableHead className="min-w-64">Item Description</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-right">Rate (₹)</TableHead>
                    <TableHead className="text-right">Amount (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category, catIndex) => {
                    const isExpanded = expandedCategories.has(category.name)
                    
                    return (
                      <React.Fragment key={category.name}>
                        {/* Category Header Row */}
                        <TableRow
                          className="bg-gray-50 hover:bg-gray-100 cursor-pointer font-semibold"
                          onClick={() => toggleCategory(category.name)}
                        >
                          <TableCell colSpan={5} className="py-4">
                            <div className="flex items-center gap-2">
                              {isExpanded ? (
                                <ChevronDown className="w-5 h-5 text-gray-600" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                              )}
                              <span className="text-gray-900">
                                {category.name} ({category.items.length} items)
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-bold text-gray-900 py-4">
                            {formatCurrency(category.subtotal)}
                          </TableCell>
                        </TableRow>

                        {/* Category Items */}
                        {isExpanded &&
                          category.items.map((item) => (
                            <TableRow key={item.sno}>
                              <TableCell className="text-gray-600">{item.sno}</TableCell>
                              <TableCell className="text-gray-900">{item.description}</TableCell>
                              <TableCell className="text-right text-gray-900">{item.quantity.toLocaleString()}</TableCell>
                              <TableCell className="text-gray-600">{item.unit}</TableCell>
                              <TableCell className="text-right text-gray-900">{item.rate.toLocaleString()}</TableCell>
                              <TableCell className="text-right text-gray-900 font-medium">
                                {formatCurrency(item.amount)}
                              </TableCell>
                            </TableRow>
                          ))}
                      </React.Fragment>
                    )
                  })}

                  {/* Grand Total Row */}
                  <TableRow className="bg-gradient-to-r from-green-50 to-emerald-50 font-bold text-lg border-t-2 border-green-300">
                    <TableCell colSpan={5} className="py-4 text-green-900">
                      GRAND TOTAL (Including Overhead & GST)
                    </TableCell>
                    <TableCell className="text-right py-4 text-green-900">{formatCurrency(grandTotal)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
