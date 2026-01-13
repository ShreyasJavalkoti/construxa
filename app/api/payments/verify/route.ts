import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/server'
import { verifyPaymentSignature } from '@/lib/razorpay/client'

// POST - Verify Razorpay payment
export async function POST(request: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'razorpay_order_id, razorpay_payment_id, and razorpay_signature are required' },
        { status: 400 }
      )
    }

    // Verify signature
    const isValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    )

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // Update payment record
    const { data: payment } = await supabaseAdmin
      .from('payments')
      .update({
        razorpay_payment_id,
        status: 'completed',
      })
      .eq('razorpay_order_id', razorpay_order_id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment record not found' },
        { status: 404 }
      )
    }

    // Update user subscription based on plan_type
    const subscriptionTierMap: { [key: string]: string } = {
      'starter': 'starter',
      'professional': 'professional',
      'enterprise': 'enterprise',
    }

    const newTier = subscriptionTierMap[payment.plan_type] || 'free'

    await supabaseAdmin
      .from('users')
      .update({
        subscription_tier: newTier,
        subscription_status: 'active',
        credits_remaining: newTier === 'starter' ? 10 : newTier === 'professional' ? 50 : 200,
      })
      .eq('id', user.id)

    return NextResponse.json({
      success: true,
      payment,
      subscription_tier: newTier,
    })
  } catch (error) {
    console.error('Verify payment error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to verify payment',
      },
      { status: 500 }
    )
  }
}
