import OpenAI from 'openai'
import { serverEnv } from '../env'

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: serverEnv.openaiApiKey || process.env.OPENAI_API_KEY,
})

// Helper function to check if OpenAI is configured
export function isOpenAIConfigured(): boolean {
  return !!(serverEnv.openaiApiKey || process.env.OPENAI_API_KEY)
}
