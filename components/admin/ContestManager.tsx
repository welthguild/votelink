'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ContestManagerProps {
  onContestCreated: () => void
  selectedContest: any
}

export default function ContestManager({
  onContestCreated,
  selectedContest,
}: ContestManagerProps) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [bannerUrl, setBannerUrl] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setName(newName)
    setSlug(generateSlug(newName))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const { error } = await supabase.from('contests').insert([
        {
          name,
          slug,
          banner_url: bannerUrl,
          end_date: endDate ? new Date(endDate).toISOString() : null,
        },
      ])

      if (error) throw error

      setName('')
      setSlug('')
      setBannerUrl('')
      setEndDate('')
      onContestCreated()
    } catch (error) {
      console.error('Error creating contest:', error)
      alert('Error creating contest')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Create Contest</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contest Name
          </label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="e.g., Best Developer 2024"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug (URL)
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="best-developer-2024"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            URL: votelink.com/vote/{slug}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Banner URL
          </label>
          <input
            type="url"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date (Optional)
          </label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !name || !slug}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium"
        >
          {loading ? 'Creating...' : 'Create Contest'}
        </button>
      </form>
    </div>
  )
}
