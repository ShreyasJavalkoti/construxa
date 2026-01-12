import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { verifyPaymentSignature } from '@/lib/razorpay'
import { verifyPaymentSchema } from '@/lib/validations'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = verifyPaymentSchema.parse(body)
    
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Verify payment signature
    const isValid = verifyPaymentSignature(
      validatedData.razorpay_order_id,
      validatedData.razorpay_payment_id,
      validatedData.razorpay_signature
    )
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature' },
        { status: 400 }
      )
    }
    
    // Update payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .update({
        razorpay_payment_id: validatedData.razorpay_payment_id,
        razorpay_signature: validatedData.razorpay_signature,
        status: 'paid',
      })
      .eq('razorpay_order_id', validatedData.razorpay_order_id)
      .eq('user_id', user.id)
      .select()
      .single()
    
    if (paymentError) {
      return NextResponse.json(
        { success: false, error: 'Failed to update payment record' },
        { status: 500 }
      )
    }
    
    // Update user subscription
    await supabase
      .from('profiles')
      .update({
        subscription_tier: 'pro',
        subscription_status: 'active',
      })
      .eq('id', user.id)
    
    return NextResponse.json({
      success: true,
      data: payment,
      message: 'Payment verified successfully',
    })
  } catch (error: any) {
    console.error('Verify payment error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
