import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import CreatePostClient from '@/components/upload/CreatePostClient'

export default async function CreatePostPage() {
  const session = await getSession()

  if (!session?.authenticated) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <CreatePostClient />
      </div>
    </div>
  )
}
