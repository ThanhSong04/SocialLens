import { getSession } from '@/lib/auth'
import Profile from '@/components/profile/Profile'

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Public page - get session but don't require it
  const session = await getSession()
  const { id } = await params

  return <Profile userId={id} currentUserId={session?.userId || null} />
}
