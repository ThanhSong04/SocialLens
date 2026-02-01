import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('posts')
      .select(`
        *,
        user:users(*)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data: posts, error } = await query

    if (error) {
      throw error
    }

    if (!posts || posts.length === 0) {
      return NextResponse.json({ posts: [] })
    }

    // Get likes and comments counts
    const postIds = posts.map(p => p.id)
    
    const [likesResult, commentsResult] = await Promise.all([
      supabase
        .from('likes')
        .select('post_id, user_id')
        .in('post_id', postIds),
      supabase
        .from('comments')
        .select('post_id')
        .in('post_id', postIds),
    ])

    const likesByPost = new Map<string, number>()
    const commentsByPost = new Map<string, number>()
    const userLikes = new Set<string>()

    likesResult.data?.forEach(like => {
      likesByPost.set(like.post_id, (likesByPost.get(like.post_id) || 0) + 1)
    })

    commentsResult.data?.forEach(comment => {
      commentsByPost.set(comment.post_id, (commentsByPost.get(comment.post_id) || 0) + 1)
    })

    // Get current user's likes
    const currentUser = await getCurrentUser()
    if (currentUser) {
      likesResult.data
        ?.filter(like => like.user_id === currentUser.id)
        .forEach(like => userLikes.add(like.post_id))
    }

    const postsWithCounts = posts.map(post => ({
      ...post,
      is_liked: userLikes.has(post.id),
      likes_count: likesByPost.get(post.id) || 0,
      comments_count: commentsByPost.get(post.id) || 0,
    }))

    return NextResponse.json({ posts: postsWithCounts })
  } catch (error: any) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}
