import { createClient } from '@/lib/supabase/server'
import VotePage from '@/components/vote/VotePage'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: contest } = await supabase
    .from('contests')
    .select('*')
    .eq('slug', slug)
    .single()

  return {
    title: contest ? `Vote for ${contest.name}` : 'Contest Not Found',
    description: 'Cast your vote now',
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: contest, error: contestError } = await supabase
    .from('contests')
    .select('*')
    .eq('slug', slug)
    .single()

  if (contestError || !contest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Contest Not Found</h1>
          <p className="text-gray-600">The contest you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    )
  }

  if (!contest.is_active) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Contest Not Active</h1>
          <p className="text-gray-600">This contest is currently inactive.</p>
        </div>
      </div>
    )
  }

  const { data: contestants } = await supabase
    .from('contestants')
    .select('*')
    .eq('contest_id', contest.id)
    .order('position', { ascending: true })

  const { data: platforms } = await supabase
    .from('platforms')
    .select('*')
    .eq('contest_id', contest.id)
    .eq('is_enabled', true)

  return (
    <VotePage
      contest={contest}
      contestants={contestants || []}
      platforms={platforms || []}
    />
  )
}
