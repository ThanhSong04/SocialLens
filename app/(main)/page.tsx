import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import Feed from '@/components/post/Feed'
import ThemeToggle from '@/components/layout/ThemeToggle'

export default async function HomePage() {
  const session = await getSession()

  if (!session?.authenticated) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen relative">
      <div className="max-w-3xl lg:max-w-4xl mx-auto px-4 pt-6 pb-24 space-y-6">
        <Feed />
      </div>
    </div>
  )
}
