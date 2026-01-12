// Common types used across the application
export * from './database'
export * from './api'

// User types
export interface User {
  id: string
  email: string
  full_name: string | null
  company_name: string | null
  avatar_url: string | null
  subscription_tier: 'free' | 'pro'
  subscription_status: 'active' | 'inactive' | 'cancelled'
}

// Subscription plans
export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  interval: 'monthly' | 'yearly'
  features: string[]
  limits: {
    projects: number
    drawings: number
    boq: number
    timeline: number
  }
}

// File upload types
export interface FileUpload {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

// Drawing analysis result
export interface DrawingAnalysis {
  dimensions: {
    length?: number
    width?: number
    height?: number
    area?: number
    volume?: number
  }
  elements: {
    walls: number
    doors: number
    windows: number
    rooms: number
  }
  materials?: {
    [key: string]: {
      quantity: number
      unit: string
    }
  }
  metadata: {
    scale?: string
    units?: string
    drawingType?: string
  }
}
