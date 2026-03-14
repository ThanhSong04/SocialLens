'use client'

import { useEffect, useState } from 'react'
import PostCard from './PostCard'
import StoryBar from '@/components/story/StoryBar'
import type { Post } from '@/types'

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/posts')
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts')
        }

        const data = await response.json()
        setPosts(data.posts || [])
      } catch (err) {
        console.error('Error fetching posts:', err)
        setError(err instanceof Error ? err.message : 'Failed to load posts')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand border-r-transparent"></div>
        <p className="text-muted mt-4">Loading posts...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 text-lg">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-brand rounded-lg hover:brightness-110"
        >
          Retry
        </button>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted text-lg">No posts yet</p>
        <p className="text-muted-2 mt-2">Be the first to share something!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Story strip */}
      <StoryBar />

      {/* Single-column feed – centered vertical stack */}
      <section aria-label="Feed" className="space-y-5">
        {posts.map((post) => (
          <div
            key={post.id}
            className="relative transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01]"
          >
            <PostCard post={post} />
          </div>
        ))}
      </section>
    </div>
  )
}
