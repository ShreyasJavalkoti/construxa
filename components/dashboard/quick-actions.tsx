"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QuickActionsProps {
  onCreateProject: () => void
}

export function QuickActions({ onCreateProject }: QuickActionsProps) {
  return (
    <Button onClick={onCreateProject} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
      <Plus className="w-4 h-4 mr-2" />
      New Project
    </Button>
  )
}
