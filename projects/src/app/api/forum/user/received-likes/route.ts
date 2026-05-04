import { NextRequest, NextResponse } from 'next/server';

// 获取用户收到的赞数量（帖子被点赞 + 评论被点赞）
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || 'anonymous';
  const lang = searchParams.get('lang') || 'cn';

  try {
    const { getSupabaseClient } = await import('@/storage/database/supabase-client');
    const client = getSupabaseClient();
    
    // 获取用户发布的帖子的点赞总数
    const { data: userPosts } = await client
      .from('forum_posts')
      .select('likes')
      .eq('author_id', userId);
    
    const postLikes = userPosts?.reduce((sum, p) => sum + (p.likes || 0), 0) || 0;
    
    // 获取用户发布的评论的点赞总数
    const { data: userComments } = await client
      .from('forum_comments')
      .select('likes')
      .eq('author_id', userId);
    
    const commentLikes = userComments?.reduce((sum, c) => sum + (c.likes || 0), 0) || 0;
    
    return NextResponse.json({
      success: true,
      data: {
        postLikes,
        commentLikes,
        totalReceivedLikes: postLikes + commentLikes,
      },
    });
  } catch (error) {
    console.error('获取用户收到赞失败:', error);
    
    // 数据库不可用时使用 mock 数据
    const mockReceivedLikes = lang === 'en' ? 456 : 523;
    
    return NextResponse.json({
      success: true,
      data: {
        postLikes: Math.floor(mockReceivedLikes * 0.7),
        commentLikes: Math.floor(mockReceivedLikes * 0.3),
        totalReceivedLikes: mockReceivedLikes,
      },
      message: 'Mock data (database unavailable)',
    });
  }
}
