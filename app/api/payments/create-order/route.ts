import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getRazorpay } from '@/lib/razorpay/client'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { amount, plan_type } = body

    if (!amount || !plan_type) {
      return NextResponse.json(
        { error: 'amount and plan_type are required' },
        { status: 400 }
      )
    }

    const razorpay = getRazorpay()

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: {
        user_id: user.id,
        plan_type,
      },
    })

    // Create payment record in database
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        razorpay_order_id: order.id,
        amount,
        currency: 'INR',
        status: 'pending',
        plan_type,
      })
      .select()
      .single()

    if (paymentError) {
      return NextResponse.json({ error: paymentError.message }, { status: 500 })
    }

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      payment_id: payment.id,
    })
  } catch (error: any) {
    console.error('Create order error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
