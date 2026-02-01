'use client'

import { useState, useEffect } from 'react'
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

      if (response.ok) {
        setIsLiked(!isLiked)
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
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

      if (response.ok) {
        const data = await response.json()
        setComments(prev => [...prev, data.comment])
        setNewComment('')
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
    } finally {
      setSubmittingComment(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Post not found</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Go Home
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 flex items-center gap-3 border-b">
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
        <div className="relative w-full bg-black">
          {post.file_type === 'image' ? (
            <img
              src={post.shelby_file_url}
              alt={post.caption || 'Post image'}
              className="w-full max-h-[600px] object-contain mx-auto"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-image.png'
              }}
            />
          ) : (
            <video
              src={post.shelby_file_url}
              controls
              className="w-full max-h-[600px] object-contain mx-auto"
              preload="metadata"
            />
          )}
        </div>

        {/* Actions and Caption */}
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
          </div>

          {likesCount > 0 && (
            <p className="font-semibold text-sm mb-2">{likesCount} likes</p>
          )}

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

          {/* Comments */}
          <div className="mt-4 space-y-3">
            {comments.length > 0 && (
              <div className="space-y-2">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-2">
                    <Link href={`/profile/${comment.user_id}`}>
                      <span className="font-semibold hover:underline text-sm">
                        {comment.user?.display_name || comment.user?.username || 'Unknown User'}
                      </span>
                    </Link>
                    <span className="text-sm">{comment.content}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Comment Form */}
            <form onSubmit={handleSubmitComment} className="flex gap-2 pt-2 border-t">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={submittingComment}
              />
              <button
                type="submit"
                disabled={!newComment.trim() || submittingComment}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingComment ? 'Posting...' : 'Post'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
