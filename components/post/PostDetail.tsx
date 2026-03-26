'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Post, Comment } from '@/types'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

interface PostDetailProps {
  postId: string
}

export default function PostDetail({ postId }: PostDetailProps) {
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submittingComment, setSubmittingComment] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchPost()
    fetchComments()
  }, [postId])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch post')
      }
      const data = await response.json()
      setPost(data.post)
      setIsLiked(data.post.is_liked || false)
      setLikesCount(data.post.likes_count || 0)
    } catch (error) {
      console.error('Error fetching post:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`)
      if (!response.ok) {
        throw new Error('Failed to fetch comments')
      }
      const data = await response.json()
      setComments(data.comments || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: isLiked ? 'DELETE' : 'POST',
      })

      if (response.status === 401) {
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)
        return
      }

      if (response.ok) {
        setIsLiked(!isLiked)
        setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1))
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || submittingComment) return

    setSubmittingComment(true)
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      })

      if (response.status === 401) {
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)
        return
      }

      if (response.ok) {
        const data = await response.json()
        setComments((prev) => [...prev, data.comment])
        setNewComment('')
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
    } finally {
      setSubmittingComment(false)
    }
  }

  const detailAspectRatio = useMemo(() => {
    if (!post) return 1
    const w = post.media_width
    const h = post.media_height
    if (!w || !h || w <= 0 || h <= 0) return 1
    return w / h
  }, [post])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-brand-strong" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted">Post not found</p>
        <button onClick={() => router.push('/')} className="mt-4 rounded-lg px-4 py-2 brand-gradient">
          Go Home
        </button>
      </div>
    )
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-10">
      <div className="mb-4 flex items-center justify-between md:mb-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-foreground"
        >
          <span aria-hidden="true">←</span>
          Back
        </button>
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted-2">Post detail</p>
      </div>

      <article className="glass-card overflow-hidden border border-border/70 md:grid md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="bg-black/85">
          <div className="relative w-full" style={{ aspectRatio: String(detailAspectRatio), maxHeight: '82vh' }}>
            {post.file_type === 'image' ? (
              <img
                src={post.shelby_file_url}
                alt={post.caption || 'Post image'}
                className="h-full w-full object-contain"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-image.svg'
                }}
              />
            ) : (
              <video
                src={post.shelby_file_url}
                controls
                className="h-full w-full object-contain"
                preload="metadata"
              />
            )}
          </div>
        </div>

        <div className="flex min-h-[620px] flex-col bg-surface/80 backdrop-blur-xl">
          <header className="flex items-center gap-3 border-b border-border/60 px-5 py-4">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-2/80">
              {post.user?.avatar_url ? (
                <img
                  src={post.user.avatar_url}
                  alt={post.user.display_name || post.user.username}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <span className="text-sm text-muted">
                  {(post.user?.display_name || post.user?.username || 'U')[0].toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <Link href={`/profile/${post.user_id}`} className="block truncate font-semibold hover:underline">
                {post.user?.display_name || post.user?.username || 'Unknown User'}
              </Link>
              <p className="text-xs text-muted">{formatDate(post.created_at)}</p>
            </div>
          </header>

          <div className="space-y-3 border-b border-border/60 px-5 py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
                  isLiked
                    ? 'border-pink-400/40 bg-pink-400/10 text-pink-400'
                    : 'border-border text-muted hover:border-pink-400/40 hover:text-pink-400'
                }`}
                aria-label={isLiked ? 'Unlike post' : 'Like post'}
              >
                <svg className="h-5 w-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>

              <div>
                <p className="text-sm font-semibold">{likesCount} likes</p>
                <p className="text-xs text-muted">{comments.length} comments</p>
              </div>
            </div>

            {post.caption && (
              <p className="text-sm leading-relaxed text-foreground/90">
                <Link href={`/profile/${post.user_id}`} className="mr-2 font-semibold hover:underline">
                  {post.user?.display_name || post.user?.username || 'Unknown User'}
                </Link>
                {post.caption}
              </p>
            )}
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
            {comments.length === 0 ? (
              <div className="flex h-full min-h-24 items-center justify-center rounded-2xl border border-dashed border-border/70 bg-surface-2/40">
                <p className="text-sm text-muted">No comments yet. Be the first to share your thoughts.</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-2 text-sm">
                  <Link href={`/profile/${comment.user_id}`} className="shrink-0 font-semibold hover:underline">
                    {comment.user?.display_name || comment.user?.username || 'Unknown User'}
                  </Link>
                  <p className="break-words text-foreground/90">{comment.content}</p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSubmitComment} className="border-t border-border/60 bg-surface/95 p-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 rounded-xl border border-border/70 bg-surface px-3 py-2.5 text-sm focus:border-transparent focus:ring-2 focus:ring-brand"
                disabled={submittingComment}
              />
              <button
                type="submit"
                disabled={!newComment.trim() || submittingComment}
                className="rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 px-4 py-2.5 text-xs font-semibold tracking-wide text-slate-950 shadow-sm hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submittingComment ? 'Posting...' : 'Post'}
              </button>
            </div>
          </form>
        </div>
      </article>
    </section>
  )
}
