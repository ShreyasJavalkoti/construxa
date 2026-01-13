import { openai, isOpenAIConfigured } from './client'
import { TIMELINE_GENERATION_SYSTEM_PROMPT, createTimelineGenerationPrompt } from './prompts'

export interface TimelinePhase {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  duration: number
  dependencies: string[]
  progress: number
  status: 'pending' | 'in_progress' | 'completed'
  milestones: string[]
}

export interface TimelineResult {
  project: string
  totalArea: number
  startDate: string
  estimatedEndDate: string
  totalDuration: number
  phases: TimelinePhase[]
}

/**
 * Generate construction timeline using OpenAI
 * @param projectName Name of the project
 * @param boqData BOQ data for reference
 * @param totalArea Total built-up area in sqm
 * @param startDate Optional start date (defaults to today)
 * @returns Timeline data or error
 */
export async function generateTimeline(
  projectName: string,
  boqData: any,
  totalArea: number,
  startDate?: string
): Promise<{ success: boolean; data?: TimelineResult; error?: string }> {
  try {
    // Check if OpenAI is configured
    if (!isOpenAIConfigured()) {
      return {
        success: false,
        error: 'OpenAI API key is not configured',
      }
    }

    // Create the timeline generation prompt
    const userPrompt = createTimelineGenerationPrompt(projectName, boqData, totalArea, startDate)

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: TIMELINE_GENERATION_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 3000,
    })

    const content = completion.choices[0]?.message?.content

    if (!content) {
      return {
        success: false,
        error: 'No response from OpenAI',
      }
    }

    // Parse the JSON response
    const timelineData = JSON.parse(content) as TimelineResult

    return {
      success: true,
      data: timelineData,
    }
  } catch (error) {
    console.error('Timeline generation error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate timeline',
    }
  }
}

/**
 * Generate a mock timeline for testing purposes
 */
export function generateMockTimeline(
  projectName: string,
  totalArea: number = 88.26,
  startDate?: string
): TimelineResult {
  const start = startDate || new Date().toISOString().split('T')[0]
  const startDateObj = new Date(start)

  // Helper function to calculate date
  const addDays = (date: Date, days: number): string => {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result.toISOString().split('T')[0]
  }

  let currentDate = new Date(startDateObj)

  const phases: TimelinePhase[] = [
    {
      id: 'phase-1',
      name: 'Site Preparation & Excavation',
      description: 'Site clearing, marking, and excavation for foundation',
      startDate: addDays(currentDate, 0),
      endDate: addDays(currentDate, 12),
      duration: 12,
      dependencies: [],
      progress: 0,
      status: 'pending',
      milestones: ['Site clearing completed', 'Excavation completed', 'Site leveling done'],
    },
  ]

  currentDate = new Date(phases[phases.length - 1].endDate)

  phases.push(
    {
      id: 'phase-2',
      name: 'Foundation & PCC Work',
      description: 'Plain cement concrete and foundation laying',
      startDate: addDays(currentDate, 1),
      endDate: addDays(currentDate, 18),
      duration: 18,
      dependencies: ['phase-1'],
      progress: 0,
      status: 'pending',
      milestones: ['PCC laying completed', 'Foundation concrete poured', 'Curing completed'],
    }
  )

  currentDate = new Date(phases[phases.length - 1].endDate)

  phases.push(
    {
      id: 'phase-3',
      name: 'Plinth Beam & Column Construction',
      description: 'Plinth beam casting and column construction up to lintel level',
      startDate: addDays(currentDate, 1),
      endDate: addDays(currentDate, 25),
      duration: 25,
      dependencies: ['phase-2'],
      progress: 0,
      status: 'pending',
      milestones: ['Plinth beam completed', 'Columns erected', 'Lintel level reached'],
    }
  )

  currentDate = new Date(phases[phases.length - 1].endDate)

  phases.push(
    {
      id: 'phase-4',
      name: 'RCC Beam & Slab Casting',
      description: 'Roof beam and slab construction with reinforcement',
      startDate: addDays(currentDate, 1),
      endDate: addDays(currentDate, 30),
      duration: 30,
      dependencies: ['phase-3'],
      progress: 0,
      status: 'pending',
      milestones: ['Beam reinforcement completed', 'Slab shuttering done', 'Concrete poured', 'Curing started'],
    }
  )

  currentDate = new Date(phases[phases.length - 1].endDate)

  phases.push(
    {
      id: 'phase-5',
      name: 'Brickwork & Masonry',
      description: 'External and internal wall construction',
      startDate: addDays(currentDate, 1),
      endDate: addDays(currentDate, 35),
      duration: 35,
      dependencies: ['phase-4'],
      progress: 0,
      status: 'pending',
      milestones: ['External walls completed', 'Internal walls completed', 'Lintels installed'],
    }
  )

  currentDate = new Date(phases[phases.length - 1].endDate)

  phases.push(
    {
      id: 'phase-6',
      name: 'Internal Plastering',
      description: 'Internal wall and ceiling plastering',
      startDate: addDays(currentDate, 1),
      endDate: addDays(currentDate, 25),
      duration: 25,
      dependencies: ['phase-5'],
      progress: 0,
      status: 'pending',
      milestones: ['Wall plastering completed', 'Ceiling plastering done', 'Curing completed'],
    }
  )

  currentDate = new Date(phases[phases.length - 1].endDate)

  phases.push(
    {
      id: 'phase-7',
      name: 'External Plastering & Waterproofing',
      description: 'External plastering and terrace waterproofing',
      startDate: addDays(currentDate, 1),
      endDate: addDays(currentDate, 20),
      duration: 20,
      dependencies: ['phase-5'],
      progress: 0,
      status: 'pending',
      milestones: ['External plastering completed', 'Waterproofing applied', 'Tested for leaks'],
    }
  )

  currentDate = new Date(phases[phases.length - 1].endDate)

  phases.push(
    {
      id: 'phase-8',
      name: 'Flooring & Tiling Work',
      description: 'Floor tiling in all rooms and wall tiling in wet areas',
      startDate: addDays(currentDate, 1),
      endDate: addDays(currentDate, 28),
      duration: 28,
      dependencies: ['phase-6'],
      progress: 0,
      status: 'pending',
      milestones: ['Floor tiles laid', 'Bathroom tiles completed', 'Kitchen tiles done', 'Grouting completed'],
    }
  )

  currentDate = new Date(phases[phases.length - 1].endDate)

  phases.push(
    {
      id: 'phase-9',
      name: 'Doors & Windows Installation',
      description: 'Installing all doors, windows, and frames',
      startDate: addDays(currentDate, 1),
      endDate: addDays(currentDate, 15),
      duration: 15,
      dependencies: ['phase-6', 'phase-7'],
      progress: 0,
      status: 'pending',
      milestones: ['Window frames installed', 'Door frames fixed', 'Shutters hung', 'Hardware fitted'],
    }
  )

  currentDate = new Date(phases[phases.length - 1].endDate)

  phases.push(
    {
      id: 'phase-10',
      name: 'Electrical Work',
      description: 'Complete electrical wiring, switches, and fixtures',
      startDate: addDays(currentDate, 1),
      endDate: addDays(currentDate, 20),
      duration: 20,
      dependencies: ['phase-6'],
      progress: 0,
      status: 'pending',
      milestones: ['Conduits laid', 'Wiring completed', 'Switches installed', 'DB board fitted', 'Testing done'],
    }
  )

  currentDate = new Date(phases[phases.length - 1].endDate)

  phases.push(
    {
      id: 'phase-11',
      name: 'Plumbing & Sanitary Work',
      description: 'Water supply, drainage, and sanitary fixture installation',
      startDate: addDays(currentDate, 1),
      endDate: addDays(currentDate, 18),
      duration: 18,
      dependencies: ['phase-6', 'phase-8'],
      progress: 0,
      status: 'pending',
      milestones: ['Water pipes laid', 'Drainage connected', 'Fixtures installed', 'Pressure tested'],
    }
  )

  currentDate = new Date(phases[phases.length - 1].endDate)

  phases.push(
    {
      id: 'phase-12',
      name: 'Painting & Polishing',
      description: 'Internal and external painting, door polishing',
      startDate: addDays(currentDate, 1),
      endDate: addDays(currentDate, 22),
      duration: 22,
      dependencies: ['phase-8', 'phase-9', 'phase-10', 'phase-11'],
      progress: 0,
      status: 'pending',
      milestones: ['Putty applied', 'Primer coats done', 'Final coats applied', 'Polishing completed'],
    }
  )

  currentDate = new Date(phases[phases.length - 1].endDate)

  phases.push(
    {
      id: 'phase-13',
      name: 'Final Finishing & Cleanup',
      description: 'Final touches, cleanup, and punch list items',
      startDate: addDays(currentDate, 1),
      endDate: addDays(currentDate, 10),
      duration: 10,
      dependencies: ['phase-12'],
      progress: 0,
      status: 'pending',
      milestones: ['Touch-ups completed', 'Site cleaned', 'Inspection passed'],
    }
  )

  currentDate = new Date(phases[phases.length - 1].endDate)

  phases.push(
    {
      id: 'phase-14',
      name: 'Final Inspection & Handover',
      description: 'Final inspection, documentation, and project handover',
      startDate: addDays(currentDate, 1),
      endDate: addDays(currentDate, 7),
      duration: 7,
      dependencies: ['phase-13'],
      progress: 0,
      status: 'pending',
      milestones: ['Final inspection done', 'Documentation completed', 'Keys handed over'],
    }
  )

  const totalDuration = phases.reduce((sum, phase) => sum + phase.duration, 0)
  const estimatedEndDate = phases[phases.length - 1].endDate

  return {
    project: projectName,
    totalArea,
    startDate: start,
    estimatedEndDate,
    totalDuration,
    phases,
  }
}
