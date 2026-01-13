import { openai, isOpenAIConfigured } from './client'
import { BOQ_GENERATION_SYSTEM_PROMPT, createBOQGenerationPrompt } from './prompts'

export interface BOQItem {
  sno: string
  description: string
  unit: string
  quantity: number
  rate: number
  amount: number
}

export interface BOQCategory {
  name: string
  items: BOQItem[]
  subtotal: number
}

export interface BOQResult {
  project: string
  generatedDate: string
  summary: {
    totalBuiltUpArea: string
    estimatedDuration: string
    totalCost: number
  }
  categories: BOQCategory[]
  costBreakdown: {
    subtotal: number
    overhead: number
    subtotalWithOverhead: number
    gst: number
    grandTotal: number
  }
}

/**
 * Generate Bill of Quantities using OpenAI and CPWD rates
 * @param projectName Name of the project
 * @param analysisData Drawing analysis data
 * @returns BOQ data or error
 */
export async function generateBOQ(
  projectName: string,
  analysisData: any
): Promise<{ success: boolean; data?: BOQResult; error?: string }> {
  try {
    // Check if OpenAI is configured
    if (!isOpenAIConfigured()) {
      return {
        success: false,
        error: 'OpenAI API key is not configured',
      }
    }

    // Create the BOQ generation prompt
    const userPrompt = createBOQGenerationPrompt(projectName, analysisData)

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: BOQ_GENERATION_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2, // Low temperature for consistent rate calculations
      max_tokens: 4000,
    })

    const content = completion.choices[0]?.message?.content

    if (!content) {
      return {
        success: false,
        error: 'No response from OpenAI',
      }
    }

    // Parse the JSON response
    const boqData = JSON.parse(content) as BOQResult

    return {
      success: true,
      data: boqData,
    }
  } catch (error) {
    console.error('BOQ generation error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate BOQ',
    }
  }
}

/**
 * Generate a mock BOQ for testing purposes
 */
export function generateMockBOQ(projectName: string, totalArea: number = 88.26): BOQResult {
  const categories: BOQCategory[] = [
    {
      name: 'Earthwork & Site Preparation',
      items: [
        {
          sno: '1.1',
          description: 'Excavation in ordinary soil for foundation',
          unit: 'cum',
          quantity: 25.0,
          rate: 280,
          amount: 7000,
        },
        {
          sno: '1.2',
          description: 'Filling with excavated earth',
          unit: 'cum',
          quantity: 15.0,
          rate: 180,
          amount: 2700,
        },
      ],
      subtotal: 9700,
    },
    {
      name: 'PCC & Foundation Work',
      items: [
        {
          sno: '2.1',
          description: 'PCC 1:4:8 for foundation (150mm thick)',
          unit: 'cum',
          quantity: 12.5,
          rate: 6800,
          amount: 85000,
        },
        {
          sno: '2.2',
          description: 'RCC M20 for foundation with steel',
          unit: 'cum',
          quantity: 18.0,
          rate: 9500,
          amount: 171000,
        },
      ],
      subtotal: 256000,
    },
    {
      name: 'RCC Work (Columns, Beams & Slabs)',
      items: [
        {
          sno: '3.1',
          description: 'RCC M25 in columns (including formwork & steel)',
          unit: 'cum',
          quantity: 8.5,
          rate: 11200,
          amount: 95200,
        },
        {
          sno: '3.2',
          description: 'RCC M25 in beams (including formwork & steel)',
          unit: 'cum',
          quantity: 12.0,
          rate: 10800,
          amount: 129600,
        },
        {
          sno: '3.3',
          description: 'RCC M25 in roof slab (including formwork & steel)',
          unit: 'cum',
          quantity: 14.0,
          rate: 10500,
          amount: 147000,
        },
      ],
      subtotal: 371800,
    },
    {
      name: 'Brickwork & Masonry',
      items: [
        {
          sno: '4.1',
          description: 'Brick masonry 230mm thick in CM 1:6',
          unit: 'sqm',
          quantity: 145.0,
          rate: 1850,
          amount: 268250,
        },
        {
          sno: '4.2',
          description: 'Brick masonry 115mm thick in CM 1:6',
          unit: 'sqm',
          quantity: 98.0,
          rate: 1200,
          amount: 117600,
        },
      ],
      subtotal: 385850,
    },
    {
      name: 'Plastering Work',
      items: [
        {
          sno: '5.1',
          description: 'Internal plastering 12mm thick in CM 1:4',
          unit: 'sqm',
          quantity: 280.0,
          rate: 285,
          amount: 79800,
        },
        {
          sno: '5.2',
          description: 'External plastering 15mm thick in CM 1:4',
          unit: 'sqm',
          quantity: 165.0,
          rate: 320,
          amount: 52800,
        },
      ],
      subtotal: 132600,
    },
    {
      name: 'Flooring & Tiling',
      items: [
        {
          sno: '6.1',
          description: 'Vitrified tiles 600x600mm with bed concrete',
          unit: 'sqm',
          quantity: 88.26,
          rate: 1250,
          amount: 110325,
        },
        {
          sno: '6.2',
          description: 'Ceramic wall tiles in bathrooms & kitchen',
          unit: 'sqm',
          quantity: 45.0,
          rate: 950,
          amount: 42750,
        },
      ],
      subtotal: 153075,
    },
    {
      name: 'Doors & Windows',
      items: [
        {
          sno: '7.1',
          description: 'Hardwood door frame with shutters (main door)',
          unit: 'nos',
          quantity: 1,
          rate: 18500,
          amount: 18500,
        },
        {
          sno: '7.2',
          description: 'Flush doors with frame (internal)',
          unit: 'nos',
          quantity: 5,
          rate: 9800,
          amount: 49000,
        },
        {
          sno: '7.3',
          description: 'UPVC windows with mosquito mesh',
          unit: 'sqm',
          quantity: 15.5,
          rate: 2800,
          amount: 43400,
        },
      ],
      subtotal: 110900,
    },
    {
      name: 'Painting & Finishing',
      items: [
        {
          sno: '8.1',
          description: 'Internal acrylic emulsion painting (2 coats)',
          unit: 'sqm',
          quantity: 280.0,
          rate: 185,
          amount: 51800,
        },
        {
          sno: '8.2',
          description: 'External apex weather proof painting',
          unit: 'sqm',
          quantity: 165.0,
          rate: 225,
          amount: 37125,
        },
      ],
      subtotal: 88925,
    },
    {
      name: 'Electrical Works',
      items: [
        {
          sno: '9.1',
          description: 'Internal electrical wiring with switches & sockets',
          unit: 'point',
          quantity: 25,
          rate: 1850,
          amount: 46250,
        },
        {
          sno: '9.2',
          description: 'DB board with MCBs and ELCB',
          unit: 'nos',
          quantity: 1,
          rate: 12500,
          amount: 12500,
        },
      ],
      subtotal: 58750,
    },
    {
      name: 'Plumbing & Sanitary',
      items: [
        {
          sno: '10.1',
          description: 'CPVC piping for water supply',
          unit: 'rmt',
          quantity: 45.0,
          rate: 385,
          amount: 17325,
        },
        {
          sno: '10.2',
          description: 'PVC drainage pipes',
          unit: 'rmt',
          quantity: 35.0,
          rate: 295,
          amount: 10325,
        },
        {
          sno: '10.3',
          description: 'Sanitary fixtures (WC, basin, taps)',
          unit: 'set',
          quantity: 2,
          rate: 18500,
          amount: 37000,
        },
      ],
      subtotal: 64650,
    },
  ]

  const subtotal = categories.reduce((sum, cat) => sum + cat.subtotal, 0)
  const overhead = Math.round(subtotal * 0.1)
  const subtotalWithOverhead = subtotal + overhead
  const gst = Math.round(subtotalWithOverhead * 0.18)
  const grandTotal = subtotalWithOverhead + gst

  return {
    project: projectName,
    generatedDate: new Date().toISOString().split('T')[0],
    summary: {
      totalBuiltUpArea: `${totalArea} sqm`,
      estimatedDuration: '8-10 months',
      totalCost: grandTotal,
    },
    categories,
    costBreakdown: {
      subtotal,
      overhead,
      subtotalWithOverhead,
      gst,
      grandTotal,
    },
  }
}
