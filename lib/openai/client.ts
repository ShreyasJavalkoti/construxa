import OpenAI from 'openai'
import { serverEnv } from '../env'

// Initialize OpenAI client with API key from environment
export const openai = new OpenAI({
  apiKey: serverEnv.openaiApiKey || process.env.OPENAI_API_KEY,
})

// Check if OpenAI is configured
export function isOpenAIConfigured(): boolean {
  const apiKey = serverEnv.openaiApiKey || process.env.OPENAI_API_KEY
  return !!apiKey && apiKey !== ''
}
