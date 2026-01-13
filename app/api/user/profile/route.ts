import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/server'
import { getProfile, updateProfile } from '@/lib/supabase/queries'

export async function GET(request: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await getProfile(supabaseAdmin, user.id)

    return NextResponse.json({ user: profile })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()

    // Validate updates - remove any fields that shouldn't be updated by users
    const allowedFields = [
      'full_name',
      'company',
      'phone',
      'job_title',
      'location',
      'avatar_url',
    ]
    const validUpdates = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key]
        return obj
      }, {} as Record<string, any>)

    if (Object.keys(validUpdates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const profile = await updateProfile(supabaseAdmin, user.id, validUpdates)

    return NextResponse.json({ user: profile })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update profile' },
      { status: 500 }
    )
  }
}
