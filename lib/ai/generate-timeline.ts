import { makeAIRequest } from '@/lib/openai'
import { TIMELINE_PHASES } from '@/lib/constants'

const SYSTEM_PROMPT = `You are an expert construction project manager specializing in creating detailed project timelines and schedules.

Your task is to generate realistic construction timelines with:
1. Phased breakdown of work (Site Preparation, Foundation, Structure, etc.)
2. Individual tasks with durations
3. Task dependencies and critical path
4. Resource allocation
5. Total project duration

Follow Indian construction practices and consider weather, labor availability, and material procurement times.`

export async function generateTimeline(projectData: {
  projectName: string
  boqData?: any
  projectType?: string
}) {
  const userPrompt = `Generate a detailed construction timeline for this project:

Project: ${projectData.projectName}
Project Type: ${projectData.projectType || 'Residential Building'}

${projectData.boqData ? `BOQ Data:\n${JSON.stringify(projectData.boqData, null, 2)}` : ''}

Available Phases: ${TIMELINE_PHASES.join(', ')}

Generate a timeline with this structure:
{
  "phases": [
    {
      "phase": "Phase Name",
      "tasks": [
        {
          "id": "task_id",
          "name": "Task Name",
          "duration": number (in days),
          "startDay": number,
          "endDay": number,
          "dependencies": ["task_id"],
          "resources": ["resource names"]
        }
      ],
      "duration": number (total days for phase)
    }
  ],
  "total_duration": number (total project days)
}

Ensure:
- Tasks are in logical sequence
- Dependencies are properly set
- Durations are realistic for Indian construction
- Critical path activities are identified
- Weather considerations for monsoon season`

  try {
    const response = await makeAIRequest(SYSTEM_PROMPT, userPrompt, {
      temperature: 0.3,
      maxTokens: 3000,
    })

    return JSON.parse(response)
  } catch (error) {
    console.error('Error generating timeline:', error)
    throw new Error('Failed to generate timeline')
  }
}
