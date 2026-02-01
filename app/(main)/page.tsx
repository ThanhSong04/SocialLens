import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import Feed from '@/components/post/Feed'

export default async function HomePage() {
  const session = await getSession()

  if (!session?.authenticated) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8">
        <Feed />
      </div>
    </div>
  )
}
