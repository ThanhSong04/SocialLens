import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import Profile from '@/components/profile/Profile'

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession()

  if (!session?.authenticated) {
    redirect('/login')
  }

  const { id } = await params

  return <Profile userId={id} currentUserId={session.userId} />
}
