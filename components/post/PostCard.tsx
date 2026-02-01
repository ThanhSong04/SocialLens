'use client'

import { useState } from 'react'
import { Post } from '@/types'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.is_liked || false)
  const [likesCount, setLikesCount] = useState(post.likes_count || 0)

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

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
          {post.user?.avatar_url ? (
            <img
              src={post.user.avatar_url}
              alt={post.user.display_name || post.user.username}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-gray-600 text-sm">
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
          <p className="text-sm text-gray-500">{formatDate(post.created_at)}</p>
        </div>
      </div>

      {/* Media */}
      <Link href={`/post/${post.id}`}>
        <div className="relative w-full aspect-square bg-black">
          {post.file_type === 'image' ? (
            <img
              src={post.shelby_file_url}
              alt={post.caption || 'Post image'}
              className="w-full h-full object-contain"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-image.png'
              }}
            />
          ) : (
            <video
              src={post.shelby_file_url}
              controls
              className="w-full h-full object-contain"
              preload="metadata"
            />
          )}
        </div>
      </Link>

      {/* Actions */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={handleLike}
            className={`transition-colors ${
              isLiked ? 'text-red-500' : 'text-gray-700 hover:text-red-500'
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
            <button className="text-gray-700 hover:text-blue-500 transition-colors">
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
          <p className="font-semibold text-sm mb-2">{likesCount} likes</p>
        )}

        {/* Caption */}
        {post.caption && (
          <div className="mb-2">
            <Link href={`/profile/${post.user_id}`}>
              <span className="font-semibold hover:underline">
                {post.user?.display_name || post.user?.username || 'Unknown User'}
              </span>
            </Link>
            <span className="ml-2">{post.caption}</span>
          </div>
        )}

        {/* Comments count */}
        {post.comments_count && post.comments_count > 0 && (
          <Link href={`/post/${post.id}`}>
            <button className="text-gray-500 text-sm hover:text-gray-700">
              View all {post.comments_count} comments
            </button>
          </Link>
        )}
      </div>
    </article>
  )
}
