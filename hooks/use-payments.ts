import { useState } from 'react'

declare global {
  interface Window {
    Razorpay: any
  }
}

export interface PaymentOptions {
  plan_type: 'starter' | 'professional' | 'enterprise'
  onSuccess?: (response: any) => void
  onFailure?: (error: any) => void
}

export function usePayments() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initializePayment = async (options: PaymentOptions) => {
    try {
      setLoading(true)
      setError(null)

      // Get plan amount
      const planPrices = {
        starter: 999,
        professional: 2999,
        enterprise: 9999,
      }

      const amount = planPrices[options.plan_type]

      // Create order
      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan_type: options.plan_type,
          amount,
        }),
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok) {
        throw new Error(orderData.error || 'Failed to create payment order')
      }

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        document.body.appendChild(script)

        await new Promise((resolve, reject) => {
          script.onload = resolve
          script.onerror = reject
        })
      }

      // Initialize Razorpay checkout
      const razorpayOptions = {
        key: orderData.key_id,
        amount: orderData.amount * 100,
        currency: orderData.currency,
        order_id: orderData.order_id,
        name: 'Construxa',
        description: `${options.plan_type.charAt(0).toUpperCase() + options.plan_type.slice(1)} Plan Subscription`,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan_type: options.plan_type,
              }),
            })

            const verifyData = await verifyResponse.json()

            if (!verifyResponse.ok) {
              throw new Error(verifyData.error || 'Payment verification failed')
            }

            options.onSuccess?.(verifyData)
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Payment verification failed'
            setError(errorMessage)
            options.onFailure?.(err)
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
            options.onFailure?.({ message: 'Payment cancelled by user' })
          },
        },
        theme: {
          color: '#3b82f6',
        },
      }

      const razorpay = new window.Razorpay(razorpayOptions)
      razorpay.open()

      setLoading(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize payment'
      setError(errorMessage)
      setLoading(false)
      options.onFailure?.(err)
    }
  }

  return {
    loading,
    error,
    initializePayment,
  }
}
