import { NextRequest, NextResponse } from 'next/server';

// Mock 评论点赞数据（用于数据库不可用时）
const mockCommentLikes: Record<string, Record<string, boolean>> = {};
const mockCommentLikeCounts: Record<string, number> = {};

// 获取用户已点赞的评论ID列表
export function getMockLikedCommentIds(userId: string): string[] {
  const userLikes = mockCommentLikes[userId] || {};
  return Object.entries(userLikes)
    .filter(([_, liked]) => liked)
    .map(([commentId]) => commentId);
}

// 设置评论 mock 点赞状态
export function setMockCommentLike(commentId: string, userId: string, liked: boolean) {
  if (!mockCommentLikes[userId]) {
    mockCommentLikes[userId] = {};
  }
  
  const wasLiked = mockCommentLikes[userId][commentId] || false;
  
  if (liked && !wasLiked) {
    mockCommentLikes[userId][commentId] = true;
    mockCommentLikeCounts[commentId] = (mockCommentLikeCounts[commentId] || 0) + 1;
  } else if (!liked && wasLiked) {
    mockCommentLikes[userId][commentId] = false;
    mockCommentLikeCounts[commentId] = Math.max(0, (mockCommentLikeCounts[commentId] || 0) - 1);
  }
}

// 获取评论 mock 点赞状态
export function getMockCommentLikeStatus(commentId: string, userId: string): { liked: boolean; likes: number } {
  return {
    liked: mockCommentLikes[userId]?.[commentId] || false,
    likes: mockCommentLikeCounts[commentId] || 0,
  };
}

// 获取评论的当前点赞数（独立函数）
export function getMockCommentLikeCount(commentId: string): number {
  return mockCommentLikeCounts[commentId] || 0;
}

// 初始化评论 mock 点赞数
export function initializeMockCommentLikeCounts(comments: { id: string; likes: number }[]) {
  for (const comment of comments) {
    if (mockCommentLikeCounts[comment.id] === undefined) {
      mockCommentLikeCounts[comment.id] = comment.likes;
    }
  }
}

// 获取评论点赞状态
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = request.headers.get('x-user-id') || 'anonymous';
  
  try {
    const { getSupabaseClient } = await import('@/storage/database/supabase-client');
    const client = getSupabaseClient();
    
    const { data: likeData } = await client
      .from('forum_comment_likes')
      .select('id')
      .eq('comment_id', id)
      .eq('user_id', userId)
      .single();
    
    const { data: commentData } = await client
      .from('forum_comments')
      .select('likes')
      .eq('id', id)
      .single();
    
    return NextResponse.json({
      success: true,
      liked: !!likeData,
      likes: commentData?.likes || 0,
      source: 'database',
    });
  } catch (error) {
    const { liked } = getMockCommentLikeStatus(id, userId);
    // 优先使用当前 mock 点赞数，如果为0则返回1（因为用户在查看说明对这个评论感兴趣）
    const likes = getMockCommentLikeCount(id);
    return NextResponse.json({
      success: true,
      liked,
      likes,
      source: 'mock',
    });
  }
}

// 切换评论点赞状态
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = request.headers.get('x-user-id') || 'anonymous';
  
  try {
    const { getSupabaseClient } = await import('@/storage/database/supabase-client');
    const client = getSupabaseClient();
    
    const { data: existingLike } = await client
      .from('forum_comment_likes')
      .select('id')
      .eq('comment_id', id)
      .eq('user_id', userId)
      .single();
    
    let liked: boolean;
    let newLikes: number;
    
    if (existingLike) {
      await client
        .from('forum_comment_likes')
        .delete()
        .eq('id', existingLike.id);
      
      const { data: currentComment } = await client
        .from('forum_comments')
        .select('likes')
        .eq('id', id)
        .single();
      
      newLikes = Math.max(0, (currentComment?.likes || 1) - 1);
      await client
        .from('forum_comments')
        .update({ likes: newLikes })
        .eq('id', id);
      
      liked = false;
    } else {
      await client
        .from('forum_comment_likes')
        .insert({ comment_id: id, user_id: userId });
      
      const { data: currentComment } = await client
        .from('forum_comments')
        .select('likes')
        .eq('id', id)
        .single();
      
      newLikes = (currentComment?.likes || 0) + 1;
      await client
        .from('forum_comments')
        .update({ likes: newLikes })
        .eq('id', id);
      
      liked = true;
    }
    
    return NextResponse.json({
      success: true,
      liked,
      likes: newLikes,
      source: 'database',
    });
  } catch (error) {
    console.error('Database unavailable, using mock:', error);
    
    const { liked: currentLiked } = getMockCommentLikeStatus(id, userId);
    const newLiked = !currentLiked;
    setMockCommentLike(id, userId, newLiked);
    const newLikes = getMockCommentLikeStatus(id, userId).likes;
    
    return NextResponse.json({
      success: true,
      liked: newLiked,
      likes: newLikes,
      source: 'mock',
    });
  }
}
