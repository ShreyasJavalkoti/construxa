'use client'

import { Button } from '@/components/ui/button'
import { usePayments } from '@/hooks/use-payments'
import { toast } from 'sonner'
import { useEffect } from 'react'

interface RazorpayButtonProps {
  amount: number
  planType: string
  planName: string
  onSuccess?: () => void
  disabled?: boolean
}

export function RazorpayButton({
  amount,
  planType,
  planName,
  onSuccess,
  disabled,
}: RazorpayButtonProps) {
  const { loading, initiatePayment } = usePayments()

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handlePayment = () => {
    initiatePayment(
      amount,
      planType,
      () => {
        toast.success('Payment successful! Your subscription has been upgraded.')
        if (onSuccess) {
          onSuccess()
        }
      },
      (error) => {
        toast.error(`Payment failed: ${error}`)
      }
    )
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || loading}
      className="w-full"
    >
      {loading ? 'Processing...' : `Subscribe to ${planName}`}
    </Button>
  )
}
