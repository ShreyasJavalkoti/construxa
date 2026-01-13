import { createClient } from '@supabase/supabase-js'
import { env } from '../env'
import { Database } from './database.types'

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  env.supabaseUrl || 'https://placeholder.supabase.co',
  env.supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
)

// Re-export types for convenience
export type {
  Database,
  Profile,
  Project,
  Drawing,
  BOQItem,
  TimelineTask,
  ProjectWithDrawings,
  ProjectWithDetails,
} from './database.types'

// Legacy type alias for backwards compatibility
export type { Profile as User } from './database.types'
