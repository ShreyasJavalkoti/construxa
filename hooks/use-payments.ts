import { useState } from 'react'

export interface Payment {
  id: string
  razorpay_order_id: string
  razorpay_payment_id: string | null
  amount: number
  currency: string
  status: 'pending' | 'paid' | 'failed'
  plan_type: string
  created_at: string
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export function usePayments() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createOrder = async (amount: number, planType: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, plan_type: planType }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order')
      }

      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const verifyPayment = async (
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: razorpaySignature,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Payment verification failed')
      }

      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const initiatePayment = async (
    amount: number,
    planType: string,
    onSuccess: () => void,
    onFailure: (error: string) => void
  ) => {
    try {
      const order = await createOrder(amount, planType)

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Construxa',
        description: `${planType} Plan Subscription`,
        order_id: order.order_id,
        handler: async function (response: any) {
          try {
            await verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            )
            onSuccess()
          } catch (error: any) {
            onFailure(error.message)
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#3399cc',
        },
      }

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options)
        rzp.on('payment.failed', function (response: any) {
          onFailure(response.error.description)
        })
        rzp.open()
      } else {
        throw new Error('Razorpay SDK not loaded')
      }
    } catch (err: any) {
      onFailure(err.message)
    }
  }

  return {
    loading,
    error,
    createOrder,
    verifyPayment,
    initiatePayment,
  }
}
