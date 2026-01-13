import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
  
  return createBrowserClient(url, key)
}

// Legacy export for backward compatibility - lazy initialization
let _supabase: ReturnType<typeof createClient> | null = null
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    if (!_supabase) {
      _supabase = createClient()
    }
    return (_supabase as any)[prop]
  },
})

// Types for our database
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
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
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      projects: {
        Row: {
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
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['projects']['Insert']>
      }
      drawings: {
        Row: {
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
        Insert: Omit<Database['public']['Tables']['drawings']['Row'], 'id' | 'uploaded_at'>
        Update: Partial<Database['public']['Tables']['drawings']['Insert']>
      }
      boqs: {
        Row: {
          id: string
          project_id: string
          items: any
          total_cost: number
          currency: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['boqs']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['boqs']['Insert']>
      }
      timelines: {
        Row: {
          id: string
          project_id: string
          tasks: any
          start_date: string
          end_date: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['timelines']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['timelines']['Insert']>
      }
      payments: {
        Row: {
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
        Insert: Omit<Database['public']['Tables']['payments']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['payments']['Insert']>
      }
    }
  }
}

export type User = Database['public']['Tables']['users']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type Drawing = Database['public']['Tables']['drawings']['Row']
export type BOQ = Database['public']['Tables']['boqs']['Row']
export type Timeline = Database['public']['Tables']['timelines']['Row']
export type Payment = Database['public']['Tables']['payments']['Row']
