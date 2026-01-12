import { makeAIRequest } from '@/lib/openai'

const SYSTEM_PROMPT = `You are an expert construction engineer specializing in analyzing AutoCAD drawings and extracting construction data. 

Your task is to analyze construction drawings and extract:
1. Dimensions (length, width, height, area, volume)
2. Structural elements (walls, doors, windows, rooms, columns, beams)
3. Materials mentioned in the drawing
4. Any annotations or specifications
5. Drawing type and scale

Return the analysis in JSON format with clear categorization.`

export async function analyzeDrawing(drawingData: {
  fileName: string
  fileType: string
  metadata?: any
}) {
  const userPrompt = `Analyze this construction drawing:
  
File Name: ${drawingData.fileName}
File Type: ${drawingData.fileType}
${drawingData.metadata ? `Metadata: ${JSON.stringify(drawingData.metadata)}` : ''}

Based on the file name and any available information, provide a structured analysis of what this drawing likely contains. Include:
- Estimated dimensions
- Probable structural elements
- Common materials for this type of drawing
- Drawing category (plan/elevation/section/structural)

Return as JSON with this structure:
{
  "dimensions": { "length": number, "width": number, "height": number, "area": number, "volume": number },
  "elements": { "walls": number, "doors": number, "windows": number, "rooms": number, "columns": number, "beams": number },
  "materials": { "materialName": { "quantity": number, "unit": "string" } },
  "metadata": { "scale": "string", "units": "string", "drawingType": "string" }
}`

  try {
    const response = await makeAIRequest(SYSTEM_PROMPT, userPrompt, {
      temperature: 0.3,
      maxTokens: 1500,
    })

    return JSON.parse(response)
  } catch (error) {
    console.error('Error analyzing drawing:', error)
    throw new Error('Failed to analyze drawing')
  }
}
