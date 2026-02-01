import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const caption = formData.get('caption') as string | null
    const shelbyFileId = formData.get('shelbyFileId') as string
    const shelbyFileUrl = formData.get('shelbyFileUrl') as string
    const fileType = formData.get('fileType') as 'image' | 'video'

    if (!shelbyFileId || !shelbyFileUrl || !fileType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Save post metadata to Supabase
    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        shelby_file_id: shelbyFileId,
        shelby_file_url: shelbyFileUrl,
        file_type: fileType,
        caption: caption || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving post:', error)
      return NextResponse.json(
        { error: 'Failed to save post' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      post,
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    )
  }
}
