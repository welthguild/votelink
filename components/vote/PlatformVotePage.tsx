'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'

interface PlatformVotePageProps {
  contest: any
  platform: string
  platformConfig?: any
  contestant: any
}

export default function PlatformVotePage({
  contest,
  platform,
  platformConfig,
  contestant,
}: PlatformVotePageProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleVote = async () => {
    if (!contestant) {
      alert('Please select a contestant')
      return
    }

    try {
      setLoading(true)

      // Submit vote
      const { error } = await supabase.from('submissions').insert([
        {
          contest_id: contest.id,
          contestant_id: contestant.id,
          platform: platform,
        },
      ])

      if (error) throw error

      // Increment vote count
      await supabase
        .from('contestants')
        .update({ votes: (contestant.votes || 0) + 1 })
        .eq('id', contestant.id)

      // Redirect to thanks page
      router.push(`/vote/${contest.slug}/thanks?contestant=${contestant.id}`)
    } catch (error) {
      console.error('Error submitting vote:', error)
      alert('Error submitting vote')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {contest.name}
        </h1>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <p className="text-sm text-gray-600 mb-3">Voting for:</p>
          <div className="flex items-center gap-4">
            {contestant?.photo_url && (
              <img
                src={contestant.photo_url}
                alt={contestant.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <div>
              <p className="text-lg font-bold text-gray-900">
                {contestant?.name}
              </p>
              <p className="text-sm text-gray-600">
                #{contestant?.position}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-gray-600 text-center mb-4">
            Confirm your vote for <strong>{contestant?.name}</strong> via{' '}
            <strong className="capitalize">{platform}</strong>
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleVote}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition"
          >
            {loading ? 'Voting...' : 'Confirm Vote'}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          Your vote is being recorded. Thank you for participating!
        </p>
      </div>
    </div>
  )
}
