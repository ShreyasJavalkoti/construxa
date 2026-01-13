'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { env } from '@/lib/env'

interface RazorpayButtonProps {
  amount: number
  planType: string
  planName: string
  onSuccess?: () => void
  onFailure?: (error: string) => void
  disabled?: boolean
  children?: React.ReactNode
}

// Extend Window interface for Razorpay
declare global {
  interface Window {
    Razorpay: any
  }
}

export function RazorpayButton({
  amount,
  planType,
  planName,
  onSuccess,
  onFailure,
  disabled = false,
  children,
}: RazorpayButtonProps) {
  const [loading, setLoading] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => setScriptLoaded(true)
    script.onerror = () => {
      console.error('Failed to load Razorpay script')
      toast.error('Failed to load payment gateway')
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handlePayment = async () => {
    if (!scriptLoaded) {
      toast.error('Payment gateway is still loading. Please try again.')
      return
    }

    setLoading(true)

    try {
      // Create order
      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          plan_type: planType,
        }),
      })

      if (!orderResponse.ok) {
        const error = await orderResponse.json()
        throw new Error(error.error || 'Failed to create order')
      }

      const orderData = await orderResponse.json()

      // Configure Razorpay options
      const options = {
        key: env.razorpayKeyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Construxa',
        description: `${planName} Plan Subscription`,
        order_id: orderData.order_id,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed')
            }

            const verifyData = await verifyResponse.json()
            toast.success('Payment successful! Your subscription has been upgraded.')
            
            if (onSuccess) {
              onSuccess()
            }

            // Reload page to refresh user data
            setTimeout(() => {
              window.location.reload()
            }, 2000)
          } catch (error) {
            console.error('Payment verification error:', error)
            toast.error('Payment verification failed. Please contact support.')
            
            if (onFailure) {
              onFailure(error instanceof Error ? error.message : 'Verification failed')
            }
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: function () {
            setLoading(false)
            toast.info('Payment cancelled')
          },
        },
      }

      // Open Razorpay checkout
      const rzp = new window.Razorpay(options)
      
      rzp.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error)
        toast.error(`Payment failed: ${response.error.description}`)
        setLoading(false)
        
        if (onFailure) {
          onFailure(response.error.description)
        }
      })

      rzp.open()
    } catch (error) {
      console.error('Payment error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to process payment')
      setLoading(false)
      
      if (onFailure) {
        onFailure(error instanceof Error ? error.message : 'Payment failed')
      }
    }
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || loading || !scriptLoaded}
      className="w-full"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        children || `Subscribe to ${planName}`
      )}
    </Button>
  )
}
