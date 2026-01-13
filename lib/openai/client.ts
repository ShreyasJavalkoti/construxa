import OpenAI from 'openai'
import { serverEnv } from '../env'

// Lazy-load OpenAI client to avoid build-time errors
let _openai: OpenAI | null = null

export function getOpenAIClient(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: serverEnv.openaiApiKey || process.env.OPENAI_API_KEY || 'placeholder',
    })
  }
  return _openai
}

export const openai = new Proxy({} as OpenAI, {
  get(target, prop) {
    return getOpenAIClient()[prop as keyof OpenAI]
  }
})

// Check if OpenAI is configured
export function isOpenAIConfigured(): boolean {
  const apiKey = serverEnv.openaiApiKey || process.env.OPENAI_API_KEY
  return !!apiKey && apiKey !== '' && apiKey !== 'placeholder'
}
