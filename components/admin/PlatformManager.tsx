'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface PlatformManagerProps {
  contest: any
  onUpdate: () => void
}

export default function PlatformManager({
  contest,
  onUpdate,
}: PlatformManagerProps) {
  const [platforms, setPlatforms] = useState<any[]>([])
  const [telegramEnabled, setTelegramEnabled] = useState(false)
  const [telegramChatId, setTelegramChatId] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (contest?.id) {
      fetchPlatforms()
      setTelegramEnabled(contest.telegram_enabled || false)
      setTelegramChatId(contest.telegram_chat_id || '')
    }
  }, [contest])

  const fetchPlatforms = async () => {
    try {
      const { data, error } = await supabase
        .from('platforms')
        .select('*')
        .eq('contest_id', contest.id)

      if (error) throw error

      // Ensure Instagram and Facebook exist
      const existingNames = (data || []).map((p) => p.platform_name)
      const defaultPlatforms = ['instagram', 'facebook']

      for (const name of defaultPlatforms) {
        if (!existingNames.includes(name)) {
          const { error: insertError } = await supabase
            .from('platforms')
            .insert([
              {
                contest_id: contest.id,
                platform_name: name,
                is_enabled: false,
                redirect_url: '',
              },
            ])

          if (insertError) throw insertError
        }
      }

      // Refetch
      const { data: updated, error: refetchError } = await supabase
        .from('platforms')
        .select('*')
        .eq('contest_id', contest.id)

      if (refetchError) throw refetchError
      setPlatforms(updated || [])
    } catch (error) {
      console.error('Error fetching platforms:', error)
    }
  }

  const updatePlatform = async (id: string, updates: any) => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('platforms')
        .update(updates)
        .eq('id', id)

      if (error) throw error
      fetchPlatforms()
      onUpdate()
    } catch (error) {
      console.error('Error updating platform:', error)
      alert('Error updating platform')
    } finally {
      setLoading(false)
    }
  }

  const updateTelegram = async (updates: any) => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('contests')
        .update(updates)
        .eq('id', contest.id)

      if (error) throw error
      onUpdate()
    } catch (error) {
      console.error('Error updating telegram settings:', error)
      alert('Error updating telegram settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h3 className="text-2xl font-bold mb-6">Platforms</h3>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Telegram Notifications</h4>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <span className="text-sm font-medium text-gray-700">
              Enable Telegram notifications
            </span>
            <input
              type="checkbox"
              checked={telegramEnabled}
              onChange={(e) => {
                setTelegramEnabled(e.target.checked)
                updateTelegram({ telegram_enabled: e.target.checked })
              }}
              disabled={loading}
              className="w-5 h-5 rounded border-gray-300"
            />
          </label>

          {telegramEnabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telegram Chat ID
              </label>
              <input
                type="text"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                onBlur={() => updateTelegram({ telegram_chat_id: telegramChatId })}
                placeholder="e.g., -1001234567890"
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              />
              <p className="text-xs text-gray-600 mt-1">
                Notifications will be sent to this chat when votes are submitted
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className="p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold capitalize text-gray-900">
                {platform.platform_name}
              </h4>
              <label className="flex items-center gap-3 cursor-pointer">
                <span className="text-sm font-medium text-gray-700">
                  Enabled
                </span>
                <input
                  type="checkbox"
                  checked={platform.is_enabled}
                  onChange={(e) =>
                    updatePlatform(platform.id, { is_enabled: e.target.checked })
                  }
                  disabled={loading}
                  className="w-5 h-5 rounded border-gray-300"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Redirect URL
              </label>
              <input
                type="url"
                value={platform.redirect_url || ''}
                onChange={(e) =>
                  updatePlatform(platform.id, { redirect_url: e.target.value })
                }
                placeholder="https://..."
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                Where users are redirected after voting via this platform
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
