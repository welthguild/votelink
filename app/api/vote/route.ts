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

    // Get contestant name for Telegram notification
    const { data: contestant } = await supabase
      .from('contestants')
      .select('name, votes')
      .eq('id', contestantId)
      .single()

    // Get contest details for Telegram notification
    const { data: contest } = await supabase
      .from('contests')
      .select('name, telegram_enabled, telegram_chat_id')
      .eq('id', contestId)
      .single()

    // Update vote count (DB trigger handles it, but we read the current value)
    const newVotes = (contestant?.votes || 0) + 1

    // Send Telegram notification if enabled
    if (contest?.telegram_enabled && process.env.TELEGRAM_BOT_TOKEN) {
      const chatId = contest.telegram_chat_id || process.env.TELEGRAM_CHAT_ID
      if (chatId) {
        const message = `🗳️ New vote! ${contestant?.name} received a vote in ${contest.name} via ${platform}`
        
        try {
          await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: message,
            }),
          })
        } catch (telegramError) {
          console.error('Error sending Telegram notification:', telegramError)
          // Don't fail the vote submission if Telegram fails
        }
      }
    }

    return NextResponse.json(
      { success: true, submission, votes: newVotes },
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
