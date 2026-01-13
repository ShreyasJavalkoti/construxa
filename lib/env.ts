// Environment variable validation
export function validateEnv() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'OPENAI_API_KEY',
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
  ] as const

  const missing: string[] = []
  
  for (const key of required) {
    const value = key.startsWith('NEXT_PUBLIC_') 
      ? process.env[key]
      : process.env[key]
    
    if (!value) {
      missing.push(key)
    }
  }

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:')
    missing.forEach(key => console.error(`   - ${key}`))
    console.error('\nPlease add these to your .env.local file')
    return false
  }

  console.log('✅ All required environment variables are set')
  return true
}

// Helper to get env vars with fallback
export function getEnv(key: string, fallback = ''): string {
  return process.env[key] || fallback
}

// Client-safe env vars
export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || '',
}

// Server-only env vars (use in API routes)
export const serverEnv = {
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',
}
