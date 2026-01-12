import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { signUpSchema } from '@/lib/validations'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = signUpSchema.parse(body)
    
    const supabase = await createClient()
    
    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          full_name: validatedData.fullName,
          company_name: validatedData.companyName,
        },
      },
    })
    
    if (authError) {
      return NextResponse.json(
        { success: false, error: authError.message },
        { status: 400 }
      )
    }
    
    // Create profile
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          full_name: validatedData.fullName,
          company_name: validatedData.companyName,
        })
      
      if (profileError) {
        console.error('Profile creation error:', profileError)
        // Note: User is created but profile failed - they can complete it later
      }
    }
    
    return NextResponse.json({
      success: true,
      data: {
        user: authData.user,
        session: authData.session,
      },
      message: 'Registration successful. Please check your email to verify your account.',
    })
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An error occurred during registration',
      },
      { status: 500 }
    )
  }
}
