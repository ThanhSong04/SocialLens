'use client'

import { useMemo, useState } from 'react'
import { Post } from '@/types'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.is_liked || false)
  const [likesCount, setLikesCount] = useState(post.likes_count || 0)
  const [showTapHeart, setShowTapHeart] = useState(false)

  // IG/FB clamp feed aspect ratio to avoid extremely tall/wide media taking over the viewport.
  // Min: 4:5 (0.8) – Max: 1.91:1
  const feedAspectRatio = useMemo(() => {
    const w = post.media_width
    const h = post.media_height
    if (!w || !h || w <= 0 || h <= 0) return 1 // square fallback
    const raw = w / h
    return Math.min(1.91, Math.max(0.8, raw))
  }, [post.media_width, post.media_height])

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: isLiked ? 'DELETE' : 'POST',
      })

      if (response.ok) {
        setIsLiked(!isLiked)
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleDoubleTap = () => {
    if (!isLiked) {
      void handleLike()
    }
    setShowTapHeart(true)
    window.setTimeout(() => setShowTapHeart(false), 260)
  }

  return (
    <article className="glass-card overflow-hidden transition-all duration-300 ease-out max-w-[680px] mx-auto">
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 bg-surface-2/80 border border-border rounded-full flex items-center justify-center overflow-hidden">
          {post.user?.avatar_url ? (
            <img
              src={post.user.avatar_url}
              alt={post.user.display_name || post.user.username}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-sm text-muted">
              {(post.user?.display_name || post.user?.username || 'U')[0].toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1">
          <Link href={`/profile/${post.user_id}`}>
            <h3 className="font-semibold hover:underline">
              {post.user?.display_name || post.user?.username || 'Unknown User'}
            </h3>
          </Link>
          <p className="text-xs text-muted">{formatDate(post.created_at)}</p>
        </div>
      </div>

      {/* Media */}
      <Link href={`/post/${post.id}`}>
        <div
          className="relative w-full max-w-[680px] mx-auto bg-black/70 overflow-hidden"
          style={{ aspectRatio: String(feedAspectRatio), maxHeight: '80vh' }}
          onDoubleClick={handleDoubleTap}
        >
          {post.file_type === 'image' ? (
            <img
              src={post.shelby_file_url}
              alt={post.caption || 'Post image'}
              className="h-full w-full object-cover"
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
              className="h-full w-full object-cover"
              preload="metadata"
            />
          )}

          {/* Double-tap heart micro interaction */}
          {showTapHeart && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="animate-[tapHeart_260ms_ease-out_forwards] text-pink-400 drop-shadow-[0_0_30px_rgba(244,114,182,0.9)]">
                <svg
                  className="w-20 h-20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0Z" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Actions */}
      <div className="px-4 py-3 space-y-2">
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={handleLike}
            className={`transition-colors ${
              isLiked ? 'text-pink-400' : 'text-muted hover:text-pink-400'
            }`}
          >
            <svg
              className="w-6 h-6"
              fill={isLiked ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
          <Link href={`/post/${post.id}`}>
            <button className="text-muted hover:text-brand-strong transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </button>
          </Link>
        </div>

        {/* Likes count */}
        {likesCount > 0 && (
          <p className="font-semibold text-xs tracking-wide text-muted-2">
            {likesCount} likes
          </p>
        )}

        {/* Caption */}
        {post.caption && (
          <div className="mb-1 text-sm leading-snug">
            <Link href={`/profile/${post.user_id}`}>
              <span className="font-semibold hover:underline">
                {post.user?.display_name || post.user?.username || 'Unknown User'}
              </span>
            </Link>
            <span className="ml-2 text-foreground/90">{post.caption}</span>
          </div>
        )}

        {/* Comments count */}
        {post.comments_count && post.comments_count > 0 && (
          <Link href={`/post/${post.id}`}>
            <button className="text-[11px] text-muted hover:text-foreground transition-colors">
              View all {post.comments_count} comments
            </button>
          </Link>
        )}
      </div>
    </article>
  )
}
