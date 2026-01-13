// Database types - extending from lib/supabase/client.ts types

export interface Profile {
  id: string
  email: string
  full_name: string | null
  company_name: string | null
  phone: string | null
  subscription_tier: 'free' | 'starter' | 'professional' | 'enterprise'
  subscription_status: 'active' | 'inactive' | 'cancelled'
  credits_remaining: number
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  description: string | null
  location: string | null
  project_type: string | null
  status: 'active' | 'completed' | 'archived'
  created_at: string
  updated_at: string
}

export interface Drawing {
  id: string
  project_id: string
  file_name: string
  file_path: string
  file_size: number
  file_type: string
  analysis_status: 'pending' | 'processing' | 'completed' | 'failed'
  analysis_result: any | null
  uploaded_at: string
}

export interface BOQ {
  id: string
  project_id: string
  items: any
  total_cost: number
  currency: string
  created_at: string
  updated_at: string
}

export interface Timeline {
  id: string
  project_id: string
  tasks: any
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  user_id: string
  razorpay_order_id: string
  razorpay_payment_id: string | null
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed'
  plan_type: string
  created_at: string
  updated_at: string
}

// Project with related data
export interface ProjectWithDetails extends Project {
  drawings?: Drawing[]
  boq?: BOQ | null
  timeline?: Timeline | null
}
