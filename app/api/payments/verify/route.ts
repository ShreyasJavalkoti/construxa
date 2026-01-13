import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/server'
import { SUBSCRIPTION_PLANS } from '@/lib/razorpay/client'
import crypto from 'crypto'
import { serverEnv } from '@/lib/env'

// POST: Verify Razorpay payment signature
export async function POST(request: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan_type,
    } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !plan_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify signature
    const keySecret = serverEnv.razorpayKeySecret
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // Update payment record
    const { error: paymentError } = await supabaseAdmin
      .from('payments')
      .update({
        razorpay_payment_id: razorpay_payment_id,
        status: 'completed',
      })
      .eq('razorpay_order_id', razorpay_order_id)
      .eq('user_id', user.id)

    if (paymentError) {
      console.error('Payment update error:', paymentError)
    }

    // Update user subscription
    const plan = SUBSCRIPTION_PLANS[plan_type as keyof typeof SUBSCRIPTION_PLANS]
    
    const { error: userError } = await supabaseAdmin
      .from('users')
      .update({
        subscription_tier: plan_type,
        subscription_status: 'active',
        credits_remaining: plan.credits === -1 ? 999999 : plan.credits,
      })
      .eq('id', user.id)

    if (userError) {
      console.error('User update error:', userError)
      return NextResponse.json(
        { error: 'Payment verified but failed to update subscription' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and subscription updated successfully',
    })
  } catch (error) {
    console.error('Verify payment error:', error)
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 })
  }
}
