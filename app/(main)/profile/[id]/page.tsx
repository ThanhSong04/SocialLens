import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import Profile from '@/components/profile/Profile'

export default async function ProfilePage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getSession()

  if (!session?.authenticated) {
    redirect('/login')
  }

  return <Profile userId={params.id} currentUserId={session.userId} />
}
