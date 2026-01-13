/**
 * Utility functions for API routes
 */

/**
 * Filter an object to only include allowed fields
 * Useful for sanitizing user input before database updates
 */
export function filterAllowedFields<T extends Record<string, any>>(
  updates: T,
  allowedFields: string[]
): Partial<T> {
  return Object.keys(updates)
    .filter(key => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = updates[key]
      return obj
    }, {} as Partial<T>)
}

/**
 * Validate required fields are present in request body
 */
export function validateRequiredFields(
  body: Record<string, any>,
  requiredFields: string[]
): { valid: boolean; missing: string[] } {
  const missing = requiredFields.filter(field => !body[field])
  return {
    valid: missing.length === 0,
    missing,
  }
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  message: string,
  status: number = 400
): Response {
  return Response.json({ error: message }, { status })
}

/**
 * Create a standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  status: number = 200
): Response {
  return Response.json(data, { status })
}
