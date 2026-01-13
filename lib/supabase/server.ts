import { createClient } from '@supabase/supabase-js'
import { env, serverEnv } from '../env'
import { Database } from './client'

// Server-side Supabase client with service role key for admin operations
export const supabaseAdmin = createClient<Database>(
  env.supabaseUrl || 'https://placeholder.supabase.co',
  serverEnv.supabaseServiceRoleKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)
