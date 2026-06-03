import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Suspense } from 'react'

async function ThanksPageContent({
  slug,
  contestantId,
}: {
  slug: string
  contestantId?: string
}) {
  const supabase = await createClient()

  const { data: contest } = await supabase
    .from('contests')
    .select('*')
    .eq('slug', slug)
    .single()

  let contestant = null
  if (contestantId) {
    const { data } = await supabase
      .from('contestants')
      .select('*')
      .eq('id', contestantId)
      .single()
    contestant = data
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">Thank You!</h1>

        <p className="text-gray-600 mb-2">Your vote has been recorded.</p>

        {contestant && (
          <p className="text-lg font-semibold text-blue-600 mb-6">
            You voted for {contestant.name}
          </p>
        )}

        {contest && (
          <p className="text-gray-600 mb-8">
            in the {contest.name} contest
          </p>
        )}

        <Link
          href={`/vote/${slug}`}
          className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition mb-4"
        >
          Back to Voting
        </Link>

        <p className="text-xs text-gray-500">
          You can vote multiple times for your favorite contestants.
        </p>
      </div>
    </div>
  )
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ contestant?: string }>
}) {
  const { slug } = await params
  const { contestant: contestantId } = await searchParams

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThanksPageContent slug={slug} contestantId={contestantId} />
    </Suspense>
  )
}
