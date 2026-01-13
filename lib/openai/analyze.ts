import { openai, isOpenAIConfigured } from './client'
import { DRAWING_ANALYSIS_PROMPT } from './prompts'
import { DrawingAnalysis } from '@/types'

/**
 * Analyze a drawing file or description using OpenAI
 * @param input - Either file content or text description of the drawing
 * @param fileType - Type of file (optional, for better context)
 * @returns Analysis result
 */
export async function analyzeDrawing(
  input: string,
  fileType?: string
): Promise<DrawingAnalysis> {
  if (!isOpenAIConfigured()) {
    throw new Error('OpenAI API key is not configured')
  }

  try {
    const userPrompt = fileType
      ? `Analyzing a ${fileType} file. Project description or extracted data:\n\n${input}`
      : `Project description:\n\n${input}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: DRAWING_ANALYSIS_PROMPT,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    const analysis = JSON.parse(content) as DrawingAnalysis
    return analysis
  } catch (error) {
    console.error('Error analyzing drawing:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to analyze drawing'
    )
  }
}

/**
 * Analyze a drawing from an uploaded file URL
 * For actual CAD files, you would extract text/metadata first
 * This is a simplified version that works with descriptions
 */
export async function analyzeDrawingFromDescription(
  description: string
): Promise<DrawingAnalysis> {
  return analyzeDrawing(description)
}
