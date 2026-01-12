import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getRazorpay } from '@/lib/razorpay'
import { createOrderSchema } from '@/lib/validations'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = createOrderSchema.parse(body)
    
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const razorpay = getRazorpay()
    
    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: validatedData.amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: {
        user_id: user.id,
        plan_type: validatedData.planType,
      },
    })
    
    // Save payment record
    await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        razorpay_order_id: order.id,
        amount: validatedData.amount,
        currency: 'INR',
        status: 'pending',
        plan_type: validatedData.planType,
      })
    
    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        amount: validatedData.amount,
        currency: 'INR',
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      },
      message: 'Order created successfully',
    })
  } catch (error: any) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
}
