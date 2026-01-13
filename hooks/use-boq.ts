import { useState } from 'react'

export interface BOQItem {
  id: string
  project_id: string
  category: string
  description: string
  quantity: number
  unit: string
  rate: number
  amount: number
}

export function useBOQ(projectId: string) {
  const [items, setItems] = useState<BOQItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalCost, setTotalCost] = useState(0)

  const fetchBOQ = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/boq?project_id=${projectId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch BOQ')
      }

      setItems(data.items || [])
      
      // Calculate total cost
      const total = (data.items || []).reduce(
        (sum: number, item: BOQItem) => sum + item.amount,
        0
      )
      setTotalCost(total)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const generateBOQ = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/boq/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate BOQ')
      }

      setItems(data.items || [])
      setTotalCost(data.totalCost || 0)
      
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    items,
    totalCost,
    loading,
    error,
    fetchBOQ,
    generateBOQ,
  }
}
