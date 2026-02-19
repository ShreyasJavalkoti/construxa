import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getRazorpay } from '@/lib/razorpay/client'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment verification data' },
        { status: 400 }
      )
    }

    // Verify signature
    const body_text = razorpay_order_id + '|' + razorpay_payment_id
    const expected_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body_text)
      .digest('hex')

    const isValid = expected_signature === razorpay_signature

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // Update payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .update({
        razorpay_payment_id,
        razorpay_signature,
        status: 'paid',
      })
      .eq('razorpay_order_id', razorpay_order_id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (paymentError) {
      return NextResponse.json({ error: paymentError.message }, { status: 500 })
    }

    // Update user subscription tier based on plan_type
    if (payment.plan_type) {
      const tierMap: { [key: string]: string } = {
        pro: 'pro',
        enterprise: 'enterprise',
      }
      
      const newTier = tierMap[payment.plan_type] || 'free'
      
      await supabase
        .from('profiles')
        .update({ subscription_tier: newTier })
        .eq('id', user.id)
    }

    return NextResponse.json({ success: true, payment })
  } catch (error: any) {
    // TODO(types): Replace `any` with a typed error shape for API responses.
    console.error('Payment verification error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
