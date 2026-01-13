// API Request/Response Types

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

// Auth API
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  full_name: string
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

// Projects API
export interface CreateProjectRequest {
  name: string
  description?: string
  status?: 'draft' | 'active' | 'completed'
}

// Drawings API
export interface UploadDrawingRequest {
  file: File
  project_id: string
  category?: string
}

export interface AnalyzeDrawingRequest {
  drawing_id: string
}

export interface DrawingAnalysisResponse {
  dimensions: {
    length: number
    width: number
    height: number
  }
  floors: number
  rooms: Array<{
    type: string
    quantity: number
    area: number
  }>
  structural: {
    columns: number
    beams: number
    slabs: number
  }
  materials: string[]
  features: string[]
}

// BOQ API
export interface GenerateBOQRequest {
  project_id: string
}

export interface BOQResponse {
  items: Array<{
    category: string
    description: string
    quantity: number
    unit: string
    rate: number
  }>
  totalCost: number
}

// Timeline API
export interface GenerateTimelineRequest {
  project_id: string
  start_date?: string
}

export interface TimelineResponse {
  tasks: Array<{
    name: string
    start_date: string
    end_date: string
    duration: number
    dependencies: string[]
    status: string
  }>
}

// Payments API
export interface CreateOrderRequest {
  amount: number
  plan_type: string
}

export interface CreateOrderResponse {
  order_id: string
  amount: number
  currency: string
  payment_id: string
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}
