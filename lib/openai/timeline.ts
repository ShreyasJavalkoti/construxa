import { getOpenAI } from './client'
import { TIMELINE_GENERATION_PROMPT } from './prompts'
import type { DrawingAnalysis } from './analyze'

export interface TimelineTask {
  name: string
  start_date: string
  end_date: string
  duration: number
  dependencies: string[]
  status: 'not_started' | 'in_progress' | 'completed'
}

export async function generateTimeline(
  projectDetails: {
    name: string
    analysis: DrawingAnalysis
    projectStartDate?: string
  }
): Promise<TimelineTask[]> {
  const openai = getOpenAI()
  const startDate = projectDetails.projectStartDate || new Date().toISOString().split('T')[0]

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: TIMELINE_GENERATION_PROMPT,
        },
        {
          role: 'user',
          content: `Generate a realistic construction timeline for project: ${projectDetails.name}
          
Project Start Date: ${startDate}

Drawing Analysis:
${JSON.stringify(projectDetails.analysis, null, 2)}

Please generate a detailed timeline with realistic durations and dependencies.`,
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 2000,
    })

    const result = JSON.parse(response.choices[0].message.content || '{}')
    return result.tasks || []
  } catch (error) {
    console.error('Error generating timeline:', error)
    throw new Error('Failed to generate timeline')
  }
}
