import { openai, isOpenAIConfigured } from './client'
import { BOQ_GENERATION_PROMPT } from './prompts'
import { BOQItem, DrawingAnalysis } from '@/types'

/**
 * Generate Bill of Quantities (BOQ) based on project analysis
 * @param projectAnalysis - Analysis data from drawing analysis
 * @param projectDetails - Additional project details
 * @returns Array of BOQ items
 */
export async function generateBOQ(
  projectAnalysis: DrawingAnalysis,
  projectDetails?: {
    projectType?: string
    location?: string
    specifications?: string
  }
): Promise<BOQItem[]> {
  if (!isOpenAIConfigured()) {
    throw new Error('OpenAI API key is not configured')
  }

  try {
    const projectInfo = `
Project Analysis:
- Built-up Area: ${projectAnalysis.builtUpArea || 'Not specified'} sq ft
- Number of Floors: ${projectAnalysis.floors || 'Not specified'}
- Construction Type: ${projectAnalysis.constructionType || 'Not specified'}
- Foundation Type: ${projectAnalysis.foundationType || 'Not specified'}
- Rooms: ${projectAnalysis.rooms?.length || 0}
- Doors: ${projectAnalysis.doors || 'Not specified'}
- Windows: ${projectAnalysis.windows || 'Not specified'}
- Wall Lengths: ${projectAnalysis.wallLengths || 'Not specified'} running feet

${projectDetails?.projectType ? `Project Type: ${projectDetails.projectType}` : ''}
${projectDetails?.location ? `Location: ${projectDetails.location}` : ''}
${projectDetails?.specifications ? `Specifications: ${projectDetails.specifications}` : ''}

Additional Details: ${projectAnalysis.additionalDetails || 'Standard construction'}
`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: BOQ_GENERATION_PROMPT,
        },
        {
          role: 'user',
          content: projectInfo,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    const response = JSON.parse(content)
    // Handle both array and object with items array
    const items = Array.isArray(response) ? response : response.items || []
    
    return items.map((item: any, index: number) => ({
      category: item.category || 'Miscellaneous',
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
      rate: item.rate,
      sort_order: item.sort_order || index,
    }))
  } catch (error) {
    console.error('Error generating BOQ:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to generate BOQ'
    )
  }
}
