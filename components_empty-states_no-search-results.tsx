"use client"

import { motion } from "framer-motion"
import { Search, X, Filter, FolderOpen, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface NoSearchResultsProps {
  searchTerm: string
}

export function NoSearchResults({ searchTerm }: NoSearchResultsProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-xl"
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
          className="mb-8 flex justify-center"
        >
          <div className="relative">
            <Search className="h-32 w-32 text-gray-300" strokeWidth={1.5} />
            <X className="absolute bottom-2 right-2 h-12 w-12 text-red-400" strokeWidth={3} />
          </div>
        </motion.div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">No results found for &quot;{searchTerm}&quot;</h2>
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          Try different keywords, check spelling, or adjust filters
        </p>

        <div className="space-y-3 mb-8">
          {[
            { icon: Filter, label: "Clear all filters", action: "reset-filters" },
            { icon: FolderOpen, label: "Browse all projects", action: "browse-all" },
            { icon: HelpCircle, label: "Search tips", action: "help" },
          ].map((suggestion, index) => {
            const Icon = suggestion.icon
            return (
              <motion.div
                key={suggestion.action}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card className="p-4 hover:bg-gray-50 cursor-pointer transition-colors group">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <span className="text-gray-700 font-medium">{suggestion.label}</span>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <Button variant="outline" size="lg">
          Clear Search
        </Button>
      </motion.div>
    </div>
  )
}
