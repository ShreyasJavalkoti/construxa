import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, full_name, company_name, phone } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    // Create user profile in database
    if (authData.user) {
      const { error: profileError } = await supabaseAdmin
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          full_name: full_name || null,
          company_name: company_name || null,
          phone: phone || null,
          subscription_tier: 'free',
          subscription_status: 'active',
          credits_remaining: 3,
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
        // Continue anyway, user can update profile later
      }
    }

    return NextResponse.json({
      success: true,
      user: authData.user,
      session: authData.session,
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    )
  }
}
