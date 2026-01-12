"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, ChevronRight, Download, FileSpreadsheet, FileText, RefreshCw, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface BOQItem {
  sno: number
  description: string
  quantity: number
  unit: string
  rate: number
}

interface BOQCategory {
  id: string
  icon: string
  name: string
  items: BOQItem[]
  subtotal: number
  expanded: boolean
}

export function BOQTab() {
  const [categories, setCategories] = useState<BOQCategory[]>([
    {
      id: "1",
      icon: "📦",
      name: "Earthwork",
      subtotal: 420000,
      expanded: true,
      items: [
        { sno: 1, description: "Excavation in ordinary soil", quantity: 500, unit: "cum", rate: 250 },
        { sno: 2, description: "Filling with excavated earth", quantity: 350, unit: "cum", rate: 180 },
        { sno: 3, description: "Compaction of earth", quantity: 350, unit: "cum", rate: 120 },
        { sno: 4, description: "Removal of excavated soil", quantity: 150, unit: "cum", rate: 400 },
        { sno: 5, description: "Site leveling and grading", quantity: 1000, unit: "sqm", rate: 80 },
      ],
    },
    {
      id: "2",
      icon: "🏗️",
      name: "Concrete Work",
      subtotal: 1250000,
      expanded: false,
      items: [
        { sno: 6, description: "PCC 1:4:8 for foundation", quantity: 80, unit: "cum", rate: 4500 },
        { sno: 7, description: "RCC M25 for foundation", quantity: 120, unit: "cum", rate: 6500 },
        { sno: 8, description: "RCC M25 for columns", quantity: 45, unit: "cum", rate: 7000 },
        { sno: 9, description: "RCC M25 for beams", quantity: 60, unit: "cum", rate: 7200 },
        { sno: 10, description: "RCC M25 for slabs", quantity: 180, unit: "cum", rate: 6800 },
        { sno: 11, description: "Steel reinforcement", quantity: 25000, unit: "kg", rate: 65 },
        { sno: 12, description: "Centering and shuttering", quantity: 2500, unit: "sqm", rate: 280 },
        { sno: 13, description: "Curing of concrete", quantity: 485, unit: "cum", rate: 150 },
      ],
    },
    {
      id: "3",
      icon: "🧱",
      name: "Masonry",
      subtotal: 380000,
      expanded: false,
      items: [
        { sno: 14, description: "230mm thick brick masonry", quantity: 800, unit: "sqm", rate: 350 },
        { sno: 15, description: "115mm thick brick masonry", quantity: 600, unit: "sqm", rate: 220 },
        { sno: 16, description: "Hollow concrete blocks", quantity: 400, unit: "sqm", rate: 280 },
        { sno: 17, description: "Cement mortar 1:6", quantity: 85, unit: "cum", rate: 3500 },
      ],
    },
    {
      id: "4",
      icon: "🎨",
      name: "Finishing",
      subtotal: 490000,
      expanded: false,
      items: [
        { sno: 18, description: "Internal plastering 12mm", quantity: 3500, unit: "sqm", rate: 180 },
        { sno: 19, description: "External plastering 15mm", quantity: 2800, unit: "sqm", rate: 200 },
        { sno: 20, description: "Cement paint internal", quantity: 3500, unit: "sqm", rate: 45 },
        { sno: 21, description: "Weather proof external paint", quantity: 2800, unit: "sqm", rate: 65 },
        { sno: 22, description: "Vitrified tiles flooring", quantity: 1200, unit: "sqm", rate: 850 },
        { sno: 23, description: "Ceramic wall tiles", quantity: 450, unit: "sqm", rate: 650 },
      ],
    },
  ])

  const toggleCategory = (id: string) => {
    setCategories(categories.map((cat) => (cat.id === id ? { ...cat, expanded: !cat.expanded } : cat)))
  }

  const subtotal = categories.reduce((sum, cat) => sum + cat.subtotal, 0)
  const overhead = subtotal * 0.12
  const gst = (subtotal + overhead) * 0.18
  const grandTotal = subtotal + overhead + gst

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`
  }

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
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Sparkles className="w-4 h-4 mr-2" />
          Generate BOQ
        </Button>
        <Button variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Regenerate
        </Button>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Export to Excel
        </Button>
        <Button className="bg-red-600 hover:bg-red-700 text-white">
          <FileText className="w-4 h-4 mr-2" />
          Export to PDF
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export to CSV
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
                  {categories.map((category, catIndex) => (
                    <>
                      {/* Category Header Row */}
                      <TableRow
                        key={category.id}
                        className="bg-gray-50 hover:bg-gray-100 cursor-pointer font-semibold"
                        onClick={() => toggleCategory(category.id)}
                      >
                        <TableCell colSpan={5} className="py-4">
                          <div className="flex items-center gap-2">
                            {category.expanded ? (
                              <ChevronDown className="w-5 h-5 text-gray-600" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-600" />
                            )}
                            <span className="text-lg">{category.icon}</span>
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
                      {category.expanded &&
                        category.items.map((item) => (
                          <TableRow key={item.sno}>
                            <TableCell className="text-gray-600">{item.sno}</TableCell>
                            <TableCell className="text-gray-900">{item.description}</TableCell>
                            <TableCell className="text-right text-gray-900">{item.quantity.toLocaleString()}</TableCell>
                            <TableCell className="text-gray-600">{item.unit}</TableCell>
                            <TableCell className="text-right text-gray-900">{item.rate.toLocaleString()}</TableCell>
                            <TableCell className="text-right text-gray-900 font-medium">
                              {formatCurrency(item.quantity * item.rate)}
                            </TableCell>
                          </TableRow>
                        ))}
                    </>
                  ))}

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
