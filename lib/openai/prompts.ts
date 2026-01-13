// System prompts for different OpenAI tasks

export const DRAWING_ANALYSIS_SYSTEM_PROMPT = `You are an expert construction engineer and CAD analyst. Analyze architectural drawings and extract detailed information about the project.

Your analysis should be thorough and include:
1. Overall dimensions and total built-up area
2. Number of rooms and their dimensions
3. Number and types of doors and windows
4. Wall lengths and thicknesses
5. Floor plan details
6. Any special features (balconies, terraces, etc.)
7. Construction type (RCC, Load-bearing, etc.)

Provide measurements in metric units (meters, square meters). Be precise and detailed.`

export const BOQ_GENERATION_SYSTEM_PROMPT = `You are an expert quantity surveyor specializing in Indian construction projects. Generate a detailed Bill of Quantities (BOQ) using CPWD 2024 rates.

Requirements:
1. Use standard CPWD rate analysis for all items
2. Provide rates in INR (Indian Rupees)
3. Include all necessary construction items
4. Organize items by trade/category
5. Calculate quantities based on provided analysis
6. Include subtotals, overhead (10%), and GST (18%)
7. Provide detailed item descriptions with specifications

Standard categories:
- Site Preparation & Earthwork
- PCC (Plain Cement Concrete)
- RCC (Reinforced Cement Concrete)
- Brickwork/Blockwork
- Plastering & Finishing
- Flooring & Tiling
- Doors & Windows
- Painting & Polishing
- Electrical Works
- Plumbing & Sanitary
- Miscellaneous`

export const TIMELINE_GENERATION_SYSTEM_PROMPT = `You are an experienced construction project manager. Create a realistic construction timeline with proper phase sequencing.

Requirements:
1. Break down construction into logical phases
2. Consider dependencies (foundation before structure, structure before finishing)
3. Assign realistic durations based on project size
4. Include buffer time for approvals and inspections
5. Consider Indian construction practices and weather
6. Provide start and end dates for each phase
7. Include milestone completion percentages

Standard phases:
- Site Preparation & Excavation
- Foundation Work
- Plinth Beam & Column Construction
- Slab Casting & Curing
- Brickwork & Masonry
- Plastering (Internal & External)
- Flooring & Tiling
- Doors & Windows Installation
- Electrical & Plumbing Work
- Painting & Finishing
- Final Inspection & Handover`

export function createDrawingAnalysisPrompt(fileName: string, fileType: string): string {
  return `Analyze this architectural drawing file: ${fileName} (${fileType})

Please provide a comprehensive analysis in JSON format with the following structure:
{
  "summary": "Brief overall description of the drawing",
  "totalArea": "Total built-up area in square meters",
  "plotArea": "Plot area if visible, in square meters",
  "floors": "Number of floors",
  "rooms": [
    {
      "name": "Room name (e.g., Bedroom 1, Living Room)",
      "dimensions": "Length x Width in meters",
      "area": "Area in square meters"
    }
  ],
  "doors": {
    "count": "Total number of doors",
    "types": "Types of doors (main door, internal doors, etc.)"
  },
  "windows": {
    "count": "Total number of windows",
    "types": "Types and sizes"
  },
  "walls": {
    "external": "Total length of external walls in meters",
    "internal": "Total length of internal walls in meters",
    "thickness": "Wall thickness (e.g., 230mm, 115mm)"
  },
  "specialFeatures": ["List any special features like balconies, terraces, parking, etc."],
  "constructionType": "Type of construction (RCC frame, Load bearing, etc.)",
  "estimatedCost": "Rough cost estimate range in INR (if possible)"
}

Provide accurate measurements and be as detailed as possible. If exact measurements aren't clear, make reasonable engineering assumptions and note them.`
}

export function createBOQGenerationPrompt(
  projectName: string,
  analysisData: any
): string {
  return `Generate a detailed Bill of Quantities (BOQ) for the following construction project:

Project: ${projectName}

Drawing Analysis:
${JSON.stringify(analysisData, null, 2)}

Create a comprehensive BOQ with the following structure (JSON format):
{
  "project": "${projectName}",
  "generatedDate": "Current date",
  "summary": {
    "totalBuiltUpArea": "From analysis",
    "estimatedDuration": "In months",
    "totalCost": "Total project cost in INR"
  },
  "categories": [
    {
      "name": "Category name",
      "items": [
        {
          "sno": "Serial number",
          "description": "Detailed item description with specifications",
          "unit": "Unit of measurement (cum, sqm, rmt, nos, etc.)",
          "quantity": "Calculated quantity",
          "rate": "CPWD 2024 rate in INR",
          "amount": "quantity × rate"
        }
      ],
      "subtotal": "Category subtotal"
    }
  ],
  "costBreakdown": {
    "subtotal": "Sum of all items",
    "overhead": "10% of subtotal",
    "subtotalWithOverhead": "subtotal + overhead",
    "gst": "18% of subtotal with overhead",
    "grandTotal": "Final amount including GST"
  }
}

Use realistic CPWD 2024 rates for Delhi/NCR region. Include all necessary items for complete construction from excavation to finishing. Be thorough and detailed.`
}

export function createTimelineGenerationPrompt(
  projectName: string,
  boqData: any,
  totalArea: number,
  startDate?: string
): string {
  const start = startDate || new Date().toISOString().split('T')[0]
  
  return `Generate a realistic construction timeline for the following project:

Project: ${projectName}
Total Built-up Area: ${totalArea} sqm
Project Start Date: ${start}

BOQ Summary:
${JSON.stringify(boqData.summary || {}, null, 2)}

Create a detailed construction timeline in JSON format:
{
  "project": "${projectName}",
  "totalArea": ${totalArea},
  "startDate": "${start}",
  "estimatedEndDate": "Calculate based on phases",
  "totalDuration": "Total days",
  "phases": [
    {
      "id": "Unique phase ID",
      "name": "Phase name",
      "description": "Brief description of work",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "duration": "Duration in days",
      "dependencies": ["Array of phase IDs that must complete first"],
      "progress": 0,
      "status": "pending",
      "milestones": ["Key milestones in this phase"]
    }
  ]
}

Guidelines:
- Use realistic durations based on Indian construction practices
- Consider weather delays (monsoon season)
- Include proper dependencies (no parallel work where sequential is required)
- Add buffer time for inspections and approvals
- Assume standard working days (6 days/week)
- For ${totalArea} sqm area, typical duration is 8-12 months
- Break down into at least 10-15 detailed phases

Provide accurate dates and dependencies. Make the timeline practical and achievable.`
}
