// Database types generated from Supabase
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
          full_name: string | null
          company_name: string | null
          phone: string | null
          job_title: string | null
          location: string | null
          avatar_url: string | null
          subscription_tier: string
          subscription_status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          company_name?: string | null
          phone?: string | null
          job_title?: string | null
          location?: string | null
          avatar_url?: string | null
          subscription_tier?: string
          subscription_status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          company_name?: string | null
          phone?: string | null
          job_title?: string | null
          location?: string | null
          avatar_url?: string | null
          subscription_tier?: string
          subscription_status?: string
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
          status: string
          total_drawings: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          status?: string
          total_drawings?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          status?: string
          total_drawings?: number
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
          file_url: string
          file_type: string | null
          file_size: number | null
          category: string | null
          status: string
          analysis_data: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          name: string
          file_url: string
          file_type?: string | null
          file_size?: number | null
          category?: string | null
          status?: string
          analysis_data?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          name?: string
          file_url?: string
          file_type?: string | null
          file_size?: number | null
          category?: string | null
          status?: string
          analysis_data?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      boq: {
        Row: {
          id: string
          project_id: string
          user_id: string
          data: Json
          subtotal: number | null
          overhead: number | null
          gst: number | null
          grand_total: number | null
          rate_source: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          data: Json
          subtotal?: number | null
          overhead?: number | null
          gst?: number | null
          grand_total?: number | null
          rate_source?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          data?: Json
          subtotal?: number | null
          overhead?: number | null
          gst?: number | null
          grand_total?: number | null
          rate_source?: string
          created_at?: string
          updated_at?: string
        }
      }
      timelines: {
        Row: {
          id: string
          project_id: string
          user_id: string
          data: Json
          total_duration: number | null
          start_date: string | null
          end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          data: Json
          total_duration?: number | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          data?: Json
          total_duration?: number | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          amount: number
          currency: string
          status: string
          plan_type: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          amount: number
          currency?: string
          status?: string
          plan_type?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          amount?: number
          currency?: string
          status?: string
          plan_type?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          rate_source: string
          currency_format: string
          number_format: string
          length_unit: string
          area_unit: string
          volume_unit: string
          weight_unit: string
          date_format: string
          time_format: string
          timezone: string
          theme: string
          language: string
          compact_view: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          rate_source?: string
          currency_format?: string
          number_format?: string
          length_unit?: string
          area_unit?: string
          volume_unit?: string
          weight_unit?: string
          date_format?: string
          time_format?: string
          timezone?: string
          theme?: string
          language?: string
          compact_view?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          rate_source?: string
          currency_format?: string
          number_format?: string
          length_unit?: string
          area_unit?: string
          volume_unit?: string
          weight_unit?: string
          date_format?: string
          time_format?: string
          timezone?: string
          theme?: string
          language?: string
          compact_view?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      notification_preferences: {
        Row: {
          id: string
          user_id: string
          project_updates: boolean
          timeline_complete: boolean
          boq_complete: boolean
          weekly_summary: boolean
          marketing_emails: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_updates?: boolean
          timeline_complete?: boolean
          boq_complete?: boolean
          weekly_summary?: boolean
          marketing_emails?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_updates?: boolean
          timeline_complete?: boolean
          boq_complete?: boolean
          weekly_summary?: boolean
          marketing_emails?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
