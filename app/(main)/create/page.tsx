import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import CreatePostClient from '@/components/upload/CreatePostClient'

export default async function CreatePostPage() {
  const session = await getSession()

  if (!session?.authenticated) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen relative">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(900px_circle_at_10%_-10%,rgba(56,189,248,0.35),transparent_60%),radial-gradient(900px_circle_at_90%_110%,rgba(244,114,182,0.35),transparent_55%)]" />
      <div className="max-w-3xl mx-auto px-4 pt-10 pb-24">
        <header className="mb-6 space-y-1">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">
            Create
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            New drop
          </h1>
        </header>
        <CreatePostClient />
      </div>
    </div>
  )
}
