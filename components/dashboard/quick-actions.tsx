"use client"

import { Plus, Upload, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function QuickActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Quick Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem className="cursor-pointer">
          <Plus className="w-4 h-4 mr-2" />
          Create New Project
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Upload className="w-4 h-4 mr-2" />
          Upload Drawing
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Generate BOQ
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
