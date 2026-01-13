import { openai, isOpenAIConfigured } from './client'
import { TIMELINE_GENERATION_PROMPT } from './prompts'
import { TimelineTask, DrawingAnalysis } from '@/types'

/**
 * Generate construction timeline based on project analysis
 * @param projectAnalysis - Analysis data from drawing analysis
 * @param projectDetails - Additional project details
 * @returns Array of timeline tasks
 */
export async function generateTimeline(
  projectAnalysis: DrawingAnalysis,
  projectDetails?: {
    projectName?: string
    projectType?: string
    startDate?: string
    constraints?: string
  }
): Promise<TimelineTask[]> {
  if (!isOpenAIConfigured()) {
    throw new Error('OpenAI API key is not configured')
  }

  try {
    const projectInfo = `
Project Information:
${projectDetails?.projectName ? `Project Name: ${projectDetails.projectName}` : ''}
- Built-up Area: ${projectAnalysis.builtUpArea || 'Not specified'} sq ft
- Number of Floors: ${projectAnalysis.floors || 1}
- Construction Type: ${projectAnalysis.constructionType || 'RCC Frame'}
- Foundation Type: ${projectAnalysis.foundationType || 'Standard'}
${projectDetails?.projectType ? `- Project Type: ${projectDetails.projectType}` : ''}
${projectDetails?.startDate ? `- Planned Start Date: ${projectDetails.startDate}` : ''}
${projectDetails?.constraints ? `- Constraints: ${projectDetails.constraints}` : ''}

Generate a realistic construction timeline considering Indian construction practices, weather conditions, and standard durations.
`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: TIMELINE_GENERATION_PROMPT,
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
    // Handle both array and object with tasks/phases array
    const tasks = Array.isArray(response) 
      ? response 
      : response.tasks || response.phases || []
    
    return tasks.map((task: any, index: number) => ({
      phase_name: task.phase_name || task.name || `Phase ${index + 1}`,
      start_date: task.start_date?.toString() || '0',
      duration_days: task.duration_days || task.duration || 7,
      dependencies: Array.isArray(task.dependencies) ? task.dependencies : [],
      color: task.color || generateColor(index),
      progress: task.progress || 0,
      sort_order: task.sort_order || index,
    }))
  } catch (error) {
    console.error('Error generating timeline:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to generate timeline'
    )
  }
}

/**
 * Generate a color for timeline visualization
 */
function generateColor(index: number): string {
  const colors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // amber
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#06B6D4', // cyan
    '#F97316', // orange
  ]
  return colors[index % colors.length]
}
