import { NextResponse } from 'next/server'
import { verifyPaymentSignature } from '@/lib/razorpay'
import { createClient } from '@/lib/supabase/server'

// Razorpay webhook handler
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Verify webhook signature
    const signature = request.headers.get('x-razorpay-signature')
    
    if (!signature) {
      return NextResponse.json(
        { success: false, error: 'Missing signature' },
        { status: 400 }
      )
    }
    
    // Handle different webhook events
    const event = body.event
    const payload = body.payload
    
    const supabase = await createClient()
    
    switch (event) {
      case 'payment.captured':
        // Payment was captured successfully
        const paymentEntity = payload.payment.entity
        await supabase
          .from('payments')
          .update({
            status: 'paid',
            razorpay_payment_id: paymentEntity.id,
          })
          .eq('razorpay_order_id', paymentEntity.order_id)
        break
        
      case 'payment.failed':
        // Payment failed
        const failedPayment = payload.payment.entity
        await supabase
          .from('payments')
          .update({
            status: 'failed',
            razorpay_payment_id: failedPayment.id,
          })
          .eq('razorpay_order_id', failedPayment.order_id)
        break
        
      case 'order.paid':
        // Order was paid
        const orderEntity = payload.order.entity
        await supabase
          .from('payments')
          .update({
            status: 'paid',
          })
          .eq('razorpay_order_id', orderEntity.id)
        break
        
      default:
        console.log('Unhandled webhook event:', event)
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
