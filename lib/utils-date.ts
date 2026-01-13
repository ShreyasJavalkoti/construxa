// Utility functions for date formatting

/**
 * Format a date as ISO string (YYYY-MM-DD)
 * @param date - Date to format (defaults to current date)
 * @returns ISO formatted date string
 */
export function formatDateAsISOString(date?: Date): string {
  const d = date || new Date()
  return d.toISOString().split('T')[0]
}

/**
 * Add days to a date
 * @param date - Starting date
 * @param days - Number of days to add
 * @returns New date with days added
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * Format currency for Indian Rupees
 * @param amount - Amount in INR
 * @returns Formatted string (e.g., "₹1,23,456")
 */
export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}
