import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// 添加评论
export async function POST(request: NextRequest) {
  const client = getSupabaseClient();
  
  try {
    const body = await request.json();
    const { post_id, content, author } = body;
    
    if (!post_id || !content) {
      return NextResponse.json(
        { success: false, error: '帖子ID和内容不能为空' },
        { status: 400 }
      );
    }
    
    // 插入评论
    const { data: comment, error: commentError } = await client
      .from('forum_comments')
      .insert({
        post_id,
        content,
        author: author || '匿名用户',
        likes: 0,
      })
      .select()
      .single();
    
    if (commentError) throw new Error(`评论失败: ${commentError.message}`);
    
    // 更新帖子评论数
    const { data: post } = await client
      .from('forum_posts')
      .select('comments_count')
      .eq('id', post_id)
      .single();
    
    if (post) {
      await client
        .from('forum_posts')
        .update({ comments_count: (post.comments_count || 0) + 1 })
        .eq('id', post_id);
    }
    
    return NextResponse.json({ success: true, data: comment });
  } catch (error) {
    console.error('评论失败:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '评论失败' },
      { status: 500 }
    );
  }
}
