import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contestId, contestantId, platform } = body

    if (!contestId || !contestantId || !platform) {
      return NextResponse.json(
        { error: 'Missing required fields: contestId, contestantId, platform' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Insert the submission into the database
    const { error: insertError, data: submission } = await supabase
      .from('submissions')
      .insert({
        contest_id: contestId,
        contestant_id: contestantId,
        platform: platform,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting submission:', insertError)
      return NextResponse.json(
        { error: 'Failed to submit vote' },
        { status: 500 }
      )
    }

    // Increment the contestant's vote count
    const { error: updateError } = await supabase
      .from('contestants')
      .update({
        votes: supabase.rpc('increment_votes', { contestant_id: contestantId }),
      })
      .eq('id', contestantId)

    // Alternative approach: increment votes directly
    const { data: contestant } = await supabase
      .from('contestants')
      .select('votes')
      .eq('id', contestantId)
      .single()

    if (contestant) {
      await supabase
        .from('contestants')
        .update({ votes: contestant.votes + 1 })
        .eq('id', contestantId)
    }

    return NextResponse.json(
      { success: true, submission },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error in vote API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
