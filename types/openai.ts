// OpenAI-specific types

export interface DrawingAnalysis {
  summary: string
  totalArea: string
  plotArea?: string
  floors: string
  rooms: Array<{
    name: string
    dimensions: string
    area: string
  }>
  doors: {
    count: string
    types: string
  }
  windows: {
    count: string
    types: string
  }
  walls: {
    external: string
    internal: string
    thickness: string
  }
  specialFeatures: string[]
  constructionType: string
  estimatedCost?: string
}

export interface BOQItem {
  sno: string
  description: string
  unit: string
  quantity: number
  rate: number
  amount: number
}

export interface BOQCategory {
  name: string
  items: BOQItem[]
  subtotal: number
}

export interface BOQData {
  project: string
  generatedDate: string
  summary: {
    totalBuiltUpArea: string
    estimatedDuration: string
    totalCost: number
  }
  categories: BOQCategory[]
  costBreakdown: {
    subtotal: number
    overhead: number
    subtotalWithOverhead: number
    gst: number
    grandTotal: number
  }
}

export interface TimelinePhase {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  duration: number
  dependencies: string[]
  progress: number
  status: 'pending' | 'in_progress' | 'completed'
  milestones: string[]
}

export interface TimelineData {
  project: string
  totalArea: number
  startDate: string
  estimatedEndDate: string
  totalDuration: number
  phases: TimelinePhase[]
}
