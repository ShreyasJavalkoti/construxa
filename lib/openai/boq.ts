import { getOpenAI } from './client'
import { BOQ_GENERATION_PROMPT } from './prompts'
import type { DrawingAnalysis } from './analyze'

export interface BOQItem {
  category: string
  description: string
  quantity: number
  unit: string
  rate: number
}

export async function generateBOQ(
  projectDetails: {
    name: string
    analysis: DrawingAnalysis
  }
): Promise<BOQItem[]> {
  const openai = getOpenAI()

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: BOQ_GENERATION_PROMPT,
        },
        {
          role: 'user',
          content: `Generate a detailed BOQ for project: ${projectDetails.name}
          
Drawing Analysis:
${JSON.stringify(projectDetails.analysis, null, 2)}

Please generate a comprehensive BOQ with CPWD 2024 rates in INR.`,
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 2000,
    })

    const result = JSON.parse(response.choices[0].message.content || '{}')
    return result.items || []
  } catch (error) {
    console.error('Error generating BOQ:', error)
    throw new Error('Failed to generate BOQ')
  }
}
