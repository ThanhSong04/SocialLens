import PostDetail from '@/components/post/PostDetail'

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Public page - no auth required to view
  const { id } = await params

  return <PostDetail postId={id} />
}
