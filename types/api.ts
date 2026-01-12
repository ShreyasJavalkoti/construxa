// API Request and Response Types

// Auth
export interface SignUpRequest {
  email: string
  password: string
  fullName: string
  companyName?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
  }
  session: {
    access_token: string
    refresh_token: string
  }
}

// Projects
export interface CreateProjectRequest {
  name: string
  description?: string
}

export interface UpdateProjectRequest {
  name?: string
  description?: string
  status?: 'draft' | 'active' | 'completed'
}

export interface ProjectResponse {
  id: string
  name: string
  description: string | null
  status: string
  total_drawings: number
  created_at: string
  updated_at: string
}

// Drawings
export interface UploadDrawingRequest {
  projectId: string
  name: string
  file: File
  category?: 'plan' | 'elevation' | 'section' | 'structural'
}

export interface AnalyzeDrawingRequest {
  drawingId: string
}

export interface DrawingResponse {
  id: string
  project_id: string
  name: string
  file_url: string
  file_type: string | null
  file_size: number | null
  category: string | null
  status: string
  analysis_data: any
  created_at: string
  updated_at: string
}

// BOQ
export interface GenerateBOQRequest {
  projectId: string
  drawingIds: string[]
  rateSource?: 'cpwd' | 'pwd' | 'custom'
}

export interface BOQItem {
  item: string
  description: string
  unit: string
  quantity: number
  rate: number
  amount: number
}

export interface BOQCategory {
  category: string
  items: BOQItem[]
  subtotal: number
}

export interface BOQResponse {
  id: string
  project_id: string
  categories: BOQCategory[]
  subtotal: number
  overhead: number
  gst: number
  grand_total: number
  rate_source: string
  created_at: string
}

// Timeline
export interface GenerateTimelineRequest {
  projectId: string
  boqId?: string
}

export interface TimelineTask {
  id: string
  name: string
  duration: number
  startDay: number
  endDay: number
  dependencies: string[]
  resources?: string[]
}

export interface TimelinePhase {
  phase: string
  tasks: TimelineTask[]
  duration: number
}

export interface TimelineResponse {
  id: string
  project_id: string
  phases: TimelinePhase[]
  total_duration: number
  start_date: string | null
  end_date: string | null
  created_at: string
}

// Payments
export interface CreateOrderRequest {
  amount: number
  planType: 'pro_monthly' | 'pro_yearly'
}

export interface CreateOrderResponse {
  orderId: string
  amount: number
  currency: string
  key: string
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

export interface VerifyPaymentResponse {
  success: boolean
  message: string
}

// Generic API Response
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Error Response
export interface ApiError {
  error: string
  message: string
  statusCode: number
}
