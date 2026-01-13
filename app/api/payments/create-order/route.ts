import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/server'
import { razorpay, isRazorpayConfigured } from '@/lib/razorpay/client'

// POST - Create Razorpay order
export async function POST(request: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!isRazorpayConfigured()) {
      return NextResponse.json(
        { error: 'Payment gateway is not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { amount, plan_type } = body

    if (!amount || !plan_type) {
      return NextResponse.json(
        { error: 'amount and plan_type are required' },
        { status: 400 }
      )
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: {
        plan_type,
        user_id: user.id,
      },
    })

    // Save payment record in database
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .insert({
        user_id: user.id,
        razorpay_order_id: order.id,
        amount: amount,
        currency: 'INR',
        status: 'pending',
        plan_type,
      })
      .select()
      .single()

    if (paymentError) {
      console.error('Payment record error:', paymentError)
      // Continue anyway, order is created
    }

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to create order',
      },
      { status: 500 }
    )
  }
}
