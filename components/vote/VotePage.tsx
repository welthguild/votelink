'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Contest {
  id: string
  slug: string
  name: string
  banner_url?: string
  end_date?: string
  is_active: boolean
}

interface Contestant {
  id: string
  name: string
  photo_url?: string
  position: number
  votes: number
}

interface Platform {
  id: string
  platform_name: string
  is_enabled: boolean
  redirect_url?: string
}

interface VotePageProps {
  contest: Contest
  contestants: Contestant[]
  platforms: Platform[]
}

export default function VotePage({
  contest,
  contestants: initialContestants,
  platforms,
}: VotePageProps) {
  const [contestants, setContestants] = useState(initialContestants)
  const supabase = createClient()

  useEffect(() => {
    fetchVoteCounts()
    const interval = setInterval(fetchVoteCounts, 5000)
    return () => clearInterval(interval)
  }, [contest.id])

  const fetchVoteCounts = async () => {
    try {
      const { data } = await supabase
        .from('contestants')
        .select('*')
        .eq('contest_id', contest.id)
        .order('position', { ascending: true })
      if (data) setContestants(data)
    } catch (error) {
      console.error('Error fetching vote counts:', error)
    }
  }

  const isContestEnded = contest.end_date && new Date(contest.end_date) < new Date()

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100"
      style={{
        backgroundImage: contest.banner_url ? `url(${contest.banner_url})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {contest.banner_url && (
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      )}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className={`text-5xl font-bold mb-4 ${contest.banner_url ? 'text-white drop-shadow-lg' : 'text-gray-900'}`}>
            {contest.name}
          </h1>
          {isContestEnded && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg inline-block">
              <p className="font-semibold">🏁 Contest has ended</p>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {contestants.map((contestant) => (
            <div key={contestant.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {contestant.photo_url && (
                <div className="relative h-64 bg-gray-200 overflow-hidden">
                  <img src={contestant.photo_url} alt={contestant.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                </div>
              )}
              <div className="p-6">
                <p className="text-sm font-semibold text-blue-600 mb-2">#{contestant.position}</p>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{contestant.name}</h3>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Votes</span>
                    <span className="text-2xl font-bold text-blue-600">{contestant.votes}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${contestants.length > 0 ? (contestant.votes / Math.max(...contestants.map((c) => c.votes || 1), 1)) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {platforms.length > 0 && !isContestEnded ? (
                    platforms.map((platform) => (
                      <Link
                        key={platform.id}
                        href={`/vote/${contest.slug}/${platform.platform_name}?contestant=${contestant.id}`}
                        className="block px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all text-center capitalize"
                      >
                        Vote via {platform.platform_name}
                      </Link>
                    ))
                  ) : isContestEnded ? (
                    <p className="text-center text-gray-500 text-sm">Voting ended</p>
                  ) : (
                    <p className="text-center text-gray-500 text-sm">No voting platforms available</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {contestants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No contestants yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
