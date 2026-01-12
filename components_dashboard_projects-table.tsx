"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Pencil, Trash2, FileImage, ArrowRight } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const projects = [
  {
    name: "Residential Complex Phase 2",
    status: "Active",
    drawings: 12,
    created: "Dec 20, 2025",
  },
  {
    name: "Commercial Tower",
    status: "Completed",
    drawings: 8,
    created: "Dec 18, 2025",
  },
  {
    name: "Metro Station Project",
    status: "Active",
    drawings: 15,
    created: "Dec 15, 2025",
  },
  {
    name: "Hospital Building",
    status: "Draft",
    drawings: 3,
    created: "Dec 22, 2025",
  },
  {
    name: "School Campus",
    status: "Active",
    drawings: 6,
    created: "Dec 19, 2025",
  },
]

export function ProjectsTable() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold">Recent Projects</CardTitle>
        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
          View All
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold text-slate-700">Project Name</TableHead>
                <TableHead className="font-semibold text-slate-700">Status</TableHead>
                <TableHead className="font-semibold text-slate-700">Drawings</TableHead>
                <TableHead className="font-semibold text-slate-700">Created Date</TableHead>
                <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.name} className="hover:bg-slate-50 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <FileImage className="w-4 h-4 text-white" />
                      </div>
                      {project.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        project.status === "Active"
                          ? "default"
                          : project.status === "Completed"
                            ? "secondary"
                            : "outline"
                      }
                      className={
                        project.status === "Active"
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : project.status === "Completed"
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                            : "bg-slate-100 text-slate-700"
                      }
                    >
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-slate-600">{project.drawings} drawings</span>
                  </TableCell>
                  <TableCell className="text-slate-600">{project.created}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-600">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-purple-600">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-sm text-slate-600">Showing 1-5 of 24 projects</div>
      </CardContent>
    </Card>
  )
}
