import { createClient } from '@/lib/supabase/server'
import PlatformVotePage from '@/components/vote/PlatformVotePage'
import { Suspense } from 'react'

async function InstagramPageContent({
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

  if (!contest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Contest not found</h1>
        </div>
      </div>
    )
  }

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
    <PlatformVotePage
      contest={contest}
      platform="instagram"
      contestant={contestant}
    />
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
      <InstagramPageContent slug={slug} contestantId={contestantId} />
    </Suspense>
  )
}
