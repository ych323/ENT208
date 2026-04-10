import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// 获取单个帖子详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const client = getSupabaseClient();
  const { id } = await params;
  
  try {
    // 获取帖子
    const { data: post, error: postError } = await client
      .from('forum_posts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (postError) throw new Error(`查询失败: ${postError.message}`);
    
    // 增加浏览量
    await client
      .from('forum_posts')
      .update({ views: (post.views || 0) + 1 })
      .eq('id', id);
    
    // 获取评论
    const { data: comments, error: commentsError } = await client
      .from('forum_comments')
      .select('*')
      .eq('post_id', id)
      .order('created_at', { ascending: true });
    
    if (commentsError) throw new Error(`查询评论失败: ${commentsError.message}`);
    
    return NextResponse.json({
      success: true,
      post,
      comments: comments || [],
    });
  } catch (error) {
    console.error('获取帖子详情失败:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '获取失败' },
      { status: 500 }
    );
  }
}

// 更新帖子（点赞等）
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const client = getSupabaseClient();
  const { id } = await params;
  
  try {
    const body = await request.json();
    const { likes, action } = body;
    
    if (action === 'like') {
      const { data, error } = await client
        .from('forum_posts')
        .update({ likes: (likes || 0) + 1 })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw new Error(`更新失败: ${error.message}`);
      return NextResponse.json({ success: true, data });
    }
    
    return NextResponse.json({ success: false, error: '未知操作' }, { status: 400 });
  } catch (error) {
    console.error('更新帖子失败:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '更新失败' },
      { status: 500 }
    );
  }
}

// 删除帖子
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const client = getSupabaseClient();
  const { id } = await params;
  
  try {
    const { error } = await client
      .from('forum_posts')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(`删除失败: ${error.message}`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除帖子失败:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '删除失败' },
      { status: 500 }
    );
  }
}
