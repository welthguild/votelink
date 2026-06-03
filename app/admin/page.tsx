'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import ContestManager from '@/components/admin/ContestManager'
import ContestantManager from '@/components/admin/ContestantManager'
import PlatformManager from '@/components/admin/PlatformManager'

export default function AdminPage() {
  const [contests, setContests] = useState<any[]>([])
  const [selectedContest, setSelectedContest] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    fetchContests()
  }, [])

  const fetchContests = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('contests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setContests(data || [])
    } catch (error) {
      console.error('Error fetching contests:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">VoteLink Admin</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contest Manager */}
          <div className="lg:col-span-1">
            <ContestManager
              onContestCreated={fetchContests}
              selectedContest={selectedContest}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Contests</h2>

              {loading ? (
                <p className="text-gray-600">Loading...</p>
              ) : contests.length === 0 ? (
                <p className="text-gray-600">No contests created yet.</p>
              ) : (
                <div className="space-y-4">
                  {contests.map((contest) => (
                    <div
                      key={contest.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedContest?.id === contest.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedContest(contest)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {contest.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Slug: <code className="bg-gray-100 px-2 py-1 rounded">{contest.slug}</code>
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Status: {contest.is_active ? '✅ Active' : '⏸️ Inactive'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              duplicateContest(contest)
                            }}
                            className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            Duplicate
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleContest(contest)
                            }}
                            className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                          >
                            {contest.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedContest && (
              <>
                <ContestantManager
                  contest={selectedContest}
                  onUpdate={fetchContests}
                />
                <PlatformManager
                  contest={selectedContest}
                  onUpdate={fetchContests}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  async function toggleContest(contest: any) {
    try {
      const { error } = await supabase
        .from('contests')
        .update({ is_active: !contest.is_active })
        .eq('id', contest.id)

      if (error) throw error
      fetchContests()
    } catch (error) {
      console.error('Error toggling contest:', error)
    }
  }

  async function duplicateContest(contest: any) {
    try {
      // Create new contest
      const { data: newContest, error: contestError } = await supabase
        .from('contests')
        .insert([
          {
            slug: `${contest.slug}-copy-${Date.now()}`,
            name: `${contest.name} (Copy)`,
            banner_url: contest.banner_url,
            end_date: contest.end_date,
            is_active: false,
          },
        ])
        .select()
        .single()

      if (contestError) throw contestError

      // Copy contestants
      const { data: contestants, error: fetchError } = await supabase
        .from('contestants')
        .select('*')
        .eq('contest_id', contest.id)

      if (fetchError) throw fetchError

      if (contestants && contestants.length > 0) {
        const newContestants = contestants.map((c: any) => ({
          contest_id: newContest.id,
          name: c.name,
          photo_url: c.photo_url,
          position: c.position,
        }))

        const { error: insertError } = await supabase
          .from('contestants')
          .insert(newContestants)

        if (insertError) throw insertError
      }

      // Copy platforms
      const { data: platforms, error: platformsFetchError } = await supabase
        .from('platforms')
        .select('*')
        .eq('contest_id', contest.id)

      if (platformsFetchError) throw platformsFetchError

      if (platforms && platforms.length > 0) {
        const newPlatforms = platforms.map((p: any) => ({
          contest_id: newContest.id,
          platform_name: p.platform_name,
          is_enabled: p.is_enabled,
          redirect_url: p.redirect_url,
        }))

        const { error: platformInsertError } = await supabase
          .from('platforms')
          .insert(newPlatforms)

        if (platformInsertError) throw platformInsertError
      }

      fetchContests()
    } catch (error) {
      console.error('Error duplicating contest:', error)
    }
  }
}
