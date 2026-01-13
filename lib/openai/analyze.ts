import { openai, isOpenAIConfigured } from './client'
import { DRAWING_ANALYSIS_SYSTEM_PROMPT, createDrawingAnalysisPrompt } from './prompts'

export interface DrawingAnalysisResult {
  summary: string
  totalArea: string
  plotArea?: string
  floors: string
  rooms: Array<{
    name: string
    dimensions: string
    area: string
  }>
  doors: {
    count: string
    types: string
  }
  windows: {
    count: string
    types: string
  }
  walls: {
    external: string
    internal: string
    thickness: string
  }
  specialFeatures: string[]
  constructionType: string
  estimatedCost?: string
}

/**
 * Analyze a construction drawing using OpenAI
 * @param fileName Name of the drawing file
 * @param fileType Type of file (DWG, DXF, PDF, etc.)
 * @param fileUrl URL to access the file (if needed for vision API)
 * @returns Analysis result or error
 */
export async function analyzeDrawing(
  fileName: string,
  fileType: string,
  fileUrl?: string
): Promise<{ success: boolean; data?: DrawingAnalysisResult; error?: string }> {
  try {
    // Check if OpenAI is configured
    if (!isOpenAIConfigured()) {
      return {
        success: false,
        error: 'OpenAI API key is not configured',
      }
    }

    // Create the analysis prompt
    const userPrompt = createDrawingAnalysisPrompt(fileName, fileType)

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // Using GPT-4 Turbo for better analysis
      messages: [
        {
          role: 'system',
          content: DRAWING_ANALYSIS_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3, // Lower temperature for more consistent results
      max_tokens: 2000,
    })

    const content = completion.choices[0]?.message?.content

    if (!content) {
      return {
        success: false,
        error: 'No response from OpenAI',
      }
    }

    // Parse the JSON response
    const analysisData = JSON.parse(content) as DrawingAnalysisResult

    return {
      success: true,
      data: analysisData,
    }
  } catch (error) {
    console.error('Drawing analysis error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze drawing',
    }
  }
}

/**
 * Generate a mock analysis for testing purposes
 * This is useful when OpenAI API is not available or for development
 */
export function generateMockAnalysis(fileName: string): DrawingAnalysisResult {
  return {
    summary: `2BHK residential apartment with modern layout. Total built-up area approximately 950 sqft.`,
    totalArea: '88.26',
    plotArea: '100.00',
    floors: '1',
    rooms: [
      { name: 'Master Bedroom', dimensions: '3.6m x 3.9m', area: '14.04' },
      { name: 'Bedroom 2', dimensions: '3.0m x 3.3m', area: '9.90' },
      { name: 'Living Room', dimensions: '4.2m x 4.5m', area: '18.90' },
      { name: 'Kitchen', dimensions: '2.7m x 3.0m', area: '8.10' },
      { name: 'Dining Area', dimensions: '2.4m x 3.0m', area: '7.20' },
      { name: 'Bathroom 1', dimensions: '1.8m x 2.1m', area: '3.78' },
      { name: 'Bathroom 2', dimensions: '1.5m x 2.1m', area: '3.15' },
      { name: 'Balcony', dimensions: '1.5m x 3.0m', area: '4.50' },
    ],
    doors: {
      count: '6',
      types: '1 main door (900mm), 5 internal doors (750mm)',
    },
    windows: {
      count: '8',
      types: '4 large windows (1500x1200mm), 4 medium windows (1200x900mm)',
    },
    walls: {
      external: '32.5',
      internal: '28.3',
      thickness: 'External: 230mm, Internal: 115mm',
    },
    specialFeatures: ['Balcony with garden area', 'Modular kitchen space', 'Attached bathrooms'],
    constructionType: 'RCC Frame Structure',
    estimatedCost: '₹18-22 Lakhs (approximately ₹2,000-2,500 per sqft)',
  }
}
