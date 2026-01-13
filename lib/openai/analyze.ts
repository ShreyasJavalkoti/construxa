import { getOpenAI } from './client'
import { DRAWING_ANALYSIS_PROMPT } from './prompts'

export interface DrawingAnalysis {
  dimensions: {
    length: number
    width: number
    height: number
  }
  floors: number
  rooms: Array<{
    type: string
    quantity: number
    area: number
  }>
  structural: {
    columns: number
    beams: number
    slabs: number
  }
  materials: string[]
  features: string[]
}

export async function analyzeDrawing(
  imageUrl: string,
  fileName: string
): Promise<DrawingAnalysis> {
  const openai = getOpenAI()

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: DRAWING_ANALYSIS_PROMPT,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this construction drawing file: ${fileName}`,
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 1500,
    })

    const analysis = JSON.parse(
      response.choices[0].message.content || '{}'
    ) as DrawingAnalysis

    return analysis
  } catch (error) {
    console.error('Error analyzing drawing:', error)
    throw new Error('Failed to analyze drawing')
  }
}
