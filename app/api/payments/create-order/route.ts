import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/server'
import { razorpay, isRazorpayConfigured, SUBSCRIPTION_PLANS } from '@/lib/razorpay/client'
import { env } from '@/lib/env'

// POST: Create Razorpay order
export async function POST(request: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { plan_type } = body

    if (!plan_type || !['starter', 'professional', 'enterprise'].includes(plan_type)) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 })
    }

    // Check if Razorpay is configured
    if (!isRazorpayConfigured()) {
      return NextResponse.json(
        { error: 'Payment gateway is not configured' },
        { status: 503 }
      )
    }

    const plan = SUBSCRIPTION_PLANS[plan_type as keyof typeof SUBSCRIPTION_PLANS]
    const amount = plan.price

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      receipt: `order_${user.id}_${Date.now()}`,
      notes: {
        user_id: user.id,
        plan_type: plan_type,
      },
    })

    // Save payment record in database
    await supabaseAdmin
      .from('payments')
      .insert({
        user_id: user.id,
        razorpay_order_id: order.id,
        amount: amount,
        currency: 'INR',
        status: 'pending',
        plan_type: plan_type,
      })

    return NextResponse.json({
      success: true,
      order_id: order.id,
      amount: amount,
      currency: 'INR',
      key_id: env.razorpayKeyId,
    })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 })
  }
}
