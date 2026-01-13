// Export all types from the supabase client
export type {
  User,
  Project,
  Drawing,
  BOQ,
  Timeline,
  Payment,
  Database,
} from '@/lib/supabase/client'

// Additional type definitions

export interface DrawingAnalysis {
  builtUpArea?: number
  rooms?: Array<{
    name: string
    dimensions: string
    area: number
  }>
  wallLengths?: number
  doors?: number
  windows?: number
  foundationType?: string
  floors?: number
  constructionType?: string
  [key: string]: any
}

export interface BOQItem {
  id?: string
  project_id: string
  category: string
  description: string
  quantity: number
  unit: string
  rate: number
  amount?: number
  sort_order: number
}

export interface BOQSummary {
  items: BOQItem[]
  subtotal: number
  overhead: number
  gst: number
  grand_total: number
}

export interface TimelineTask {
  id?: string
  project_id: string
  phase_name: string
  start_date: string
  duration_days: number
  dependencies?: string[]
  color?: string
  progress?: number
  sort_order: number
}

export interface PaymentOrder {
  order_id: string
  amount: number
  currency: string
  plan_type: string
}

export interface RazorpayResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}
