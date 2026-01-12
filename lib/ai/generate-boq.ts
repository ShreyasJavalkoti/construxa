import { makeAIRequest } from '@/lib/openai'
import { CPWD_RATES } from '@/lib/constants'

const SYSTEM_PROMPT = `You are an expert quantity surveyor specializing in construction Bill of Quantities (BOQ) preparation using CPWD (Central Public Works Department) rates for Indian construction projects.

Your task is to generate detailed BOQs with:
1. Item-wise breakdown by category (Earthwork, Concrete, Masonry, etc.)
2. Accurate quantities calculated from drawing analysis
3. CPWD standard rates
4. Proper units (cum, sqm, kg, rmt, etc.)
5. Subtotals, overheads, GST, and grand total

Follow CPWD specifications and Indian construction standards.`

export async function generateBOQ(projectData: {
  projectName: string
  drawings: Array<{
    name: string
    analysisData: any
  }>
  rateSource?: 'cpwd' | 'pwd' | 'custom'
}) {
  const userPrompt = `Generate a comprehensive Bill of Quantities (BOQ) for this construction project:

Project: ${projectData.projectName}
Rate Source: ${projectData.rateSource || 'cpwd'}

Drawing Analysis Data:
${JSON.stringify(projectData.drawings, null, 2)}

Available CPWD Rates:
${JSON.stringify(CPWD_RATES, null, 2)}

Generate a detailed BOQ with the following structure:
{
  "categories": [
    {
      "category": "Category Name",
      "items": [
        {
          "item": "Item Name",
          "description": "Detailed description",
          "unit": "Unit (cum/sqm/kg/rmt/each)",
          "quantity": number,
          "rate": number,
          "amount": number
        }
      ],
      "subtotal": number
    }
  ],
  "subtotal": number,
  "overhead": number (10% of subtotal),
  "gst": number (18% of subtotal + overhead),
  "grand_total": number
}

Ensure all calculations are accurate and follow CPWD standards.`

  try {
    const response = await makeAIRequest(SYSTEM_PROMPT, userPrompt, {
      temperature: 0.2,
      maxTokens: 3000,
    })

    return JSON.parse(response)
  } catch (error) {
    console.error('Error generating BOQ:', error)
    throw new Error('Failed to generate BOQ')
  }
}
