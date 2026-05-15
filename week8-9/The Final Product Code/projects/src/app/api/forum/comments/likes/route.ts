import { NextRequest, NextResponse } from 'next/server';
import { getMockCommentLikeStatus, getMockCommentLikeCount } from '../[id]/like/route';

// 获取帖子的所有评论点赞状态
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('postId');
  const userId = request.headers.get('x-user-id') || 'anonymous';
  
  if (!postId) {
    return NextResponse.json({ success: false, error: '缺少 postId' }, { status: 400 });
  }
  
  try {
    const { getSupabaseClient } = await import('@/storage/database/supabase-client');
    const client = getSupabaseClient();
    
    // 获取该帖子的所有评论
    const { data: comments } = await client
      .from('forum_comments')
      .select('id, likes')
      .eq('post_id', postId);
    
    if (!comments) {
      return NextResponse.json({ success: true, likes: [] });
    }
    
    // 获取用户对这些评论的点赞状态
    const commentIds = comments.map(c => c.id);
    const { data: userLikes } = await client
      .from('forum_comment_likes')
      .select('comment_id')
      .eq('user_id', userId)
      .in('comment_id', commentIds);
    
    const likedCommentIds = new Set(userLikes?.map(l => l.comment_id) || []);
    
    const likes = comments.map(c => ({
      commentId: c.id,
      liked: likedCommentIds.has(c.id),
      likes: c.likes,
    }));
    
    return NextResponse.json({ success: true, likes });
  } catch (error) {
    console.error('获取评论点赞状态失败:', error);
    // 数据库不可用，使用 mock 数据
    // 这里需要从评论数据中获取评论ID列表
    // 由于评论数据在帖子详情API中，我们从请求中获取评论IDs
    const commentIds = searchParams.get('commentIds')?.split(',') || [];
    
    const likes = commentIds.map(commentId => {
      const { liked } = getMockCommentLikeStatus(commentId, userId);
      const mockLikes = getMockCommentLikeCount(commentId);
      return {
        commentId,
        liked,
        likes: mockLikes,
      };
    });
    
    return NextResponse.json({ success: true, likes });
  }
}
