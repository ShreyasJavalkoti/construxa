export interface Profile {
  id: string
  email: string
  full_name: string | null
  company_name: string | null
  phone: string | null
  job_title: string | null
  avatar_url: string | null
  subscription_tier: 'free' | 'pro' | 'enterprise'
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  description: string | null
  status: 'draft' | 'active' | 'completed'
  drawings_count: number
  total_cost: number
  created_at: string
  updated_at: string
}

export interface Drawing {
  id: string
  project_id: string
  user_id: string
  name: string
  file_path: string
  file_size: number
  file_type: 'dwg' | 'dxf' | 'pdf'
  category: 'plan' | 'elevation' | 'section' | 'structural' | 'other'
  status: 'uploaded' | 'analyzing' | 'analyzed' | 'error'
  analysis_result: any
  created_at: string
  updated_at: string
}

export interface BOQItem {
  id: string
  project_id: string
  category: string
  description: string
  quantity: number
  unit: string
  rate: number
  amount: number
  sort_order: number
  created_at: string
}

export interface TimelineTask {
  id: string
  project_id: string
  name: string
  start_date: string
  end_date: string
  duration: number
  status: 'not_started' | 'in_progress' | 'completed'
  progress: number
  dependencies: string[]
  color: string | null
  sort_order: number
  created_at: string
}

export interface Payment {
  id: string
  user_id: string
  razorpay_order_id: string
  razorpay_payment_id: string | null
  razorpay_signature: string | null
  amount: number
  currency: string
  status: 'pending' | 'paid' | 'failed'
  plan_type: string
  created_at: string
}
