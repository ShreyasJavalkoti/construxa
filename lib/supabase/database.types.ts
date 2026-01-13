/**
 * TypeScript types for Construxa Supabase Database
 * Auto-generated types based on the database schema
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          company: string | null
          phone: string | null
          job_title: string | null
          location: string | null
          avatar_url: string | null
          subscription_tier: 'free' | 'pro' | 'enterprise'
          projects_count: number
          drawings_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          company?: string | null
          phone?: string | null
          job_title?: string | null
          location?: string | null
          avatar_url?: string | null
          subscription_tier?: 'free' | 'pro' | 'enterprise'
          projects_count?: number
          drawings_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          company?: string | null
          phone?: string | null
          job_title?: string | null
          location?: string | null
          avatar_url?: string | null
          subscription_tier?: 'free' | 'pro' | 'enterprise'
          projects_count?: number
          drawings_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          status: 'draft' | 'active' | 'completed'
          drawings_count: number
          total_cost: number
          estimated_duration: number | null
          start_date: string | null
          end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          status?: 'draft' | 'active' | 'completed'
          drawings_count?: number
          total_cost?: number
          estimated_duration?: number | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          status?: 'draft' | 'active' | 'completed'
          drawings_count?: number
          total_cost?: number
          estimated_duration?: number | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      drawings: {
        Row: {
          id: string
          project_id: string
          user_id: string
          name: string
          file_path: string
          file_size: number | null
          file_type: 'dwg' | 'dxf' | 'pdf' | null
          category: 'plan' | 'elevation' | 'section' | 'structural' | 'other' | null
          status: 'uploaded' | 'parsing' | 'analyzed' | 'error'
          analysis_result: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          name: string
          file_path: string
          file_size?: number | null
          file_type?: 'dwg' | 'dxf' | 'pdf' | null
          category?: 'plan' | 'elevation' | 'section' | 'structural' | 'other' | null
          status?: 'uploaded' | 'parsing' | 'analyzed' | 'error'
          analysis_result?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          name?: string
          file_path?: string
          file_size?: number | null
          file_type?: 'dwg' | 'dxf' | 'pdf' | null
          category?: 'plan' | 'elevation' | 'section' | 'structural' | 'other' | null
          status?: 'uploaded' | 'parsing' | 'analyzed' | 'error'
          analysis_result?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      boq_items: {
        Row: {
          id: string
          project_id: string
          category: string
          description: string
          quantity: number
          unit: string
          rate: number
          amount: number // Generated column, read-only
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          category: string
          description: string
          quantity: number
          unit: string
          rate: number
          // amount is generated, cannot be inserted
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          category?: string
          description?: string
          quantity?: number
          unit?: string
          rate?: number
          // amount is generated, cannot be updated
          sort_order?: number
          created_at?: string
        }
      }
      timeline_tasks: {
        Row: {
          id: string
          project_id: string
          name: string
          start_date: string
          end_date: string
          duration: number | null
          status: 'not_started' | 'in_progress' | 'completed'
          progress: number
          dependencies: string[] | null
          color: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          start_date: string
          end_date: string
          duration?: number | null
          status?: 'not_started' | 'in_progress' | 'completed'
          progress?: number
          dependencies?: string[] | null
          color?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          start_date?: string
          end_date?: string
          duration?: number | null
          status?: 'not_started' | 'in_progress' | 'completed'
          progress?: number
          dependencies?: string[] | null
          color?: string | null
          sort_order?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types for each table
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export type Drawing = Database['public']['Tables']['drawings']['Row']
export type DrawingInsert = Database['public']['Tables']['drawings']['Insert']
export type DrawingUpdate = Database['public']['Tables']['drawings']['Update']

export type BOQItem = Database['public']['Tables']['boq_items']['Row']
export type BOQItemInsert = Database['public']['Tables']['boq_items']['Insert']
export type BOQItemUpdate = Database['public']['Tables']['boq_items']['Update']

export type TimelineTask = Database['public']['Tables']['timeline_tasks']['Row']
export type TimelineTaskInsert = Database['public']['Tables']['timeline_tasks']['Insert']
export type TimelineTaskUpdate = Database['public']['Tables']['timeline_tasks']['Update']

// Extended types with relationships
export type ProjectWithDrawings = Project & {
  drawings: Drawing[]
}

export type ProjectWithDetails = Project & {
  drawings: Drawing[]
  boq_items: BOQItem[]
  timeline_tasks: TimelineTask[]
}
