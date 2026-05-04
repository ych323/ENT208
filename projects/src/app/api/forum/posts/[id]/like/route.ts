import { NextRequest, NextResponse } from 'next/server';

// Mock 帖子点赞数据（用于数据库不可用时）
const mockPostLikes: Record<string, Record<string, boolean>> = {
  // postId -> userId -> liked
};

// Mock 帖子点赞数 - 持久化存储
let mockPostLikeCounts: Record<string, number> = {};

// 获取帖子列表的点赞数据
export function getMockLikedPostIds(userId: string): string[] {
  const userLikes = mockPostLikes[userId] || {};
  return Object.entries(userLikes)
    .filter(([_, liked]) => liked)
    .map(([postId]) => postId);
}

// 设置 mock 点赞状态
export function setMockLike(postId: string, userId: string, liked: boolean) {
  if (!mockPostLikes[userId]) {
    mockPostLikes[userId] = {};
  }
  
  const wasLiked = mockPostLikes[userId][postId] || false;
  
  if (liked && !wasLiked) {
    // 点赞
    mockPostLikes[userId][postId] = true;
    mockPostLikeCounts[postId] = (mockPostLikeCounts[postId] || 0) + 1;
  } else if (!liked && wasLiked) {
    // 取消点赞
    mockPostLikes[userId][postId] = false;
    mockPostLikeCounts[postId] = Math.max(0, (mockPostLikeCounts[postId] || 0) - 1);
  }
}

// 获取 mock 点赞数
export function getMockLikeCount(postId: string): number {
  return mockPostLikeCounts[postId] || 0;
}

// 获取帖子点赞状态
export function getMockLikeStatus(postId: string, userId: string): { liked: boolean; likes: number } {
  return {
    liked: mockPostLikes[userId]?.[postId] || false,
    likes: mockPostLikeCounts[postId] || 0,
  };
}

// 初始化 mock 点赞数
export function initializeMockLikeCounts(posts: { id: string; likes: number }[]) {
  for (const post of posts) {
    if (mockPostLikeCounts[post.id] === undefined) {
      mockPostLikeCounts[post.id] = post.likes;
    }
  }
}

// 获取帖子点赞状态
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = request.headers.get('x-user-id') || 'anonymous';
  
  try {
    const { getSupabaseClient } = await import('@/storage/database/supabase-client');
    const client = getSupabaseClient();
    
    // 查询该用户是否点赞过此帖子
    const { data: likeData } = await client
      .from('forum_post_likes')
      .select('id')
      .eq('post_id', id)
      .eq('user_id', userId)
      .single();
    
    // 获取帖子点赞数
    const { data: postData } = await client
      .from('forum_posts')
      .select('likes')
      .eq('id', id)
      .single();
    
    return NextResponse.json({
      success: true,
      liked: !!likeData,
      likes: postData?.likes || 0,
      source: 'database',
    });
  } catch (error) {
    // 数据库不可用，使用 mock 数据
    const { liked, likes } = getMockLikeStatus(id, userId);
    return NextResponse.json({
      success: true,
      liked,
      likes,
      source: 'mock',
    });
  }
}

// 切换帖子点赞状态
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = request.headers.get('x-user-id') || 'anonymous';
  
  try {
    const { getSupabaseClient } = await import('@/storage/database/supabase-client');
    const client = getSupabaseClient();
    
    // 查询该用户是否已经点赞
    const { data: existingLike } = await client
      .from('forum_post_likes')
      .select('id')
      .eq('post_id', id)
      .eq('user_id', userId)
      .single();
    
    let liked: boolean;
    let newLikes: number;
    
    if (existingLike) {
      // 取消点赞 - 删除记录
      await client
        .from('forum_post_likes')
        .delete()
        .eq('id', existingLike.id);
      
      // 获取当前点赞数并减少
      const { data: currentPost } = await client
        .from('forum_posts')
        .select('likes')
        .eq('id', id)
        .single();
      
      newLikes = Math.max(0, (currentPost?.likes || 1) - 1);
      await client
        .from('forum_posts')
        .update({ likes: newLikes })
        .eq('id', id);
      
      liked = false;
    } else {
      // 添加点赞 - 插入记录
      await client
        .from('forum_post_likes')
        .insert({ post_id: id, user_id: userId });
      
      // 获取当前点赞数并增加
      const { data: currentPost } = await client
        .from('forum_posts')
        .select('likes')
        .eq('id', id)
        .single();
      
      newLikes = (currentPost?.likes || 0) + 1;
      await client
        .from('forum_posts')
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
    
    // 数据库不可用，使用 mock 数据
    const { liked: currentLiked } = getMockLikeStatus(id, userId);
    const newLiked = !currentLiked;
    setMockLike(id, userId, newLiked);
    const newLikes = getMockLikeCount(id);
    
    return NextResponse.json({
      success: true,
      liked: newLiked,
      likes: newLikes,
      source: 'mock',
    });
  }
}
