// API request and response types

// Generic API response wrapper
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Auth API types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  full_name?: string
  company_name?: string
  phone?: string
}

export interface AuthResponse {
  success: boolean
  user?: any
  session?: any
  error?: string
}

// Projects API types
export interface CreateProjectRequest {
  name: string
  description?: string
  location?: string
  project_type?: string
}

export interface UpdateProjectRequest {
  name?: string
  description?: string
  location?: string
  project_type?: string
  status?: 'active' | 'completed' | 'archived'
}

// Drawings API types
export interface UploadDrawingRequest {
  project_id: string
  file: File
}

export interface AnalyzeDrawingRequest {
  drawing_id: string
}

export interface AnalyzeDrawingResponse {
  success: boolean
  data?: any
  error?: string
}

// BOQ API types
export interface GenerateBOQRequest {
  project_id: string
  analysis_data?: any
}

export interface GenerateBOQResponse {
  success: boolean
  data?: any
  error?: string
}

// Timeline API types
export interface GenerateTimelineRequest {
  project_id: string
  boq_data?: any
  start_date?: string
}

export interface GenerateTimelineResponse {
  success: boolean
  data?: any
  error?: string
}

// Payments API types
export interface CreateOrderRequest {
  plan_type: 'starter' | 'professional' | 'enterprise'
  amount: number
}

export interface CreateOrderResponse {
  success: boolean
  order_id?: string
  amount?: number
  currency?: string
  key_id?: string
  error?: string
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
  plan_type: string
}

export interface VerifyPaymentResponse {
  success: boolean
  message?: string
  error?: string
}

// User profile types
export interface UpdateProfileRequest {
  full_name?: string
  company_name?: string
  phone?: string
}

export interface UpdateProfileResponse {
  success: boolean
  data?: any
  error?: string
}

// Error types
export interface ApiError {
  error: string
  message?: string
  statusCode?: number
}
