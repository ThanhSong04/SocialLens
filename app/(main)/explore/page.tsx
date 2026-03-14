import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import ExploreGrid from '@/components/post/ExploreGrid'

export default async function ExplorePage() {
  const session = await getSession()

  if (!session?.authenticated) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen relative">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(900px_circle_at_10%_-10%,rgba(56,189,248,0.3),transparent_60%),radial-gradient(900px_circle_at_90%_110%,rgba(244,114,182,0.35),transparent_55%)]" />
      <div className="max-w-5xl mx-auto px-4 pt-8 pb-24 space-y-6">
        <header className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted mb-1">
              Explore
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              Dynamic grid
            </h1>
          </div>
          <p className="text-[11px] text-muted">
            Hover to preview · Tilt to feel depth
          </p>
        </header>

        <ExploreGrid />
      </div>
    </div>
  )
}

