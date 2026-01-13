import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, full_name, company, phone } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Create auth user (trigger will auto-create profile)
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

    // Update profile with additional information if provided
    if (authData.user && (full_name || company || phone)) {
      try {
        await supabaseAdmin
          .from('profiles')
          .update({
            full_name: full_name || null,
            company: company || null,
            phone: phone || null,
          } as any)
          .eq('id', authData.user.id)
      } catch (profileError) {
        console.error('Profile update error:', profileError)
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
