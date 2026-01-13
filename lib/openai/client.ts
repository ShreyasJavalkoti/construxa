import OpenAI from 'openai'
import { serverEnv } from '../env'

let _openai: OpenAI | null = null

// Get OpenAI client instance (lazy initialization)
export function getOpenAI(): OpenAI {
  if (!_openai) {
    const apiKey = serverEnv.openaiApiKey || process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured')
    }
    _openai = new OpenAI({ apiKey })
  }
  return _openai
}

// Export as openai for backwards compatibility
export const openai = new Proxy({} as OpenAI, {
  get(target, prop) {
    return (getOpenAI() as any)[prop]
  }
})

// Helper function to check if OpenAI is configured
export function isOpenAIConfigured(): boolean {
  return !!(serverEnv.openaiApiKey || process.env.OPENAI_API_KEY)
}
