'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ContestantManagerProps {
  contest: any
  onUpdate: () => void
}

export default function ContestantManager({
  contest,
  onUpdate,
}: ContestantManagerProps) {
  const [contestants, setContestants] = useState<any[]>([])
  const [name, setName] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [position, setPosition] = useState('1')
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (contest?.id) {
      fetchContestants()
    }
  }, [contest])

  const fetchContestants = async () => {
    try {
      const { data, error } = await supabase
        .from('contestants')
        .select('*')
        .eq('contest_id', contest.id)
        .order('position', { ascending: true })

      if (error) throw error
      setContestants(data || [])
    } catch (error) {
      console.error('Error fetching contestants:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const { error } = await supabase.from('contestants').insert([
        {
          contest_id: contest.id,
          name,
          photo_url: photoUrl,
          position: parseInt(position),
        },
      ])

      if (error) throw error

      setName('')
      setPhotoUrl('')
      setPosition('1')
      fetchContestants()
      onUpdate()
    } catch (error) {
      console.error('Error adding contestant:', error)
      alert('Error adding contestant')
    } finally {
      setLoading(false)
    }
  }

  const deleteContestant = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contestants')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchContestants()
      onUpdate()
    } catch (error) {
      console.error('Error deleting contestant:', error)
      alert('Error deleting contestant')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h3 className="text-2xl font-bold mb-6">Contestants</h3>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8 pb-8 border-b">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contestant Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., John Doe"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo URL
            </label>
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position
            </label>
            <input
              type="number"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !name}
            className="md:col-span-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 font-medium"
          >
            {loading ? 'Adding...' : 'Add Contestant'}
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {contestants.length === 0 ? (
          <p className="text-gray-600">No contestants yet.</p>
        ) : (
          contestants.map((contestant) => (
            <div
              key={contestant.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-4">
                {contestant.photo_url && (
                  <img
                    src={contestant.photo_url}
                    alt={contestant.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-medium text-gray-900">
                    {contestant.position}. {contestant.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Votes: {contestant.votes}
                  </p>
                </div>
              </div>
              <button
                onClick={() => deleteContestant(contestant.id)}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
