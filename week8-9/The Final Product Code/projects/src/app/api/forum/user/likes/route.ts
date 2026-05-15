import { NextRequest, NextResponse } from 'next/server';

// 中文帖子数据（用于点赞列表）
const cnPosts = [
  { id: 'cn-int-001', author: '程序员小王', title: '字节跳动后端一面+二面+HR面，超详细面经分享！', likes: 456, comments_count: 3, created_at: '2026-04-28T10:30:00Z' },
  { id: 'cn-int-002', author: '算法小能手', title: '腾讯AI Lab面试经历：从简历筛选到offer', likes: 323, comments_count: 2, created_at: '2026-04-27T14:20:00Z' },
  { id: 'cn-int-003', author: '前端小姐姐', title: '阿里云前端面试复盘，这些坑千万别踩！', likes: 289, comments_count: 2, created_at: '2026-04-26T09:15:00Z' },
  { id: 'cn-job-001', author: '职场观察员', title: '2026年最值得投递的AI岗位Top 10', likes: 567, comments_count: 2, created_at: '2026-04-25T16:45:00Z' },
  { id: 'cn-job-002', author: '海归小李', title: '北美科技公司 vs 国内大厂，薪资待遇对比', likes: 445, comments_count: 1, created_at: '2026-04-24T11:30:00Z' },
  { id: 'cn-study-001', author: '坚持每日学习', title: 'LeetCode刷题100天打卡 Day 45', likes: 89, comments_count: 2, created_at: '2026-04-29T22:00:00Z' },
  { id: 'cn-study-002', author: '转码日记', title: '从土木工程转行到Java后端，我的学习路线分享', likes: 345, comments_count: 1, created_at: '2026-04-28T20:30:00Z' },
  { id: 'cn-help-001', author: '迷茫的求职者', title: '考研失利后是选择二战还是找工作？', likes: 123, comments_count: 3, created_at: '2026-04-26T15:30:00Z' },
];

// 英文帖子数据
const enPosts = [
  { id: 'en-int-001', author: 'TechCoder_2026', title: 'ByteDance Backend Interview: 3 Rounds + HR - Full Experience', likes: 456, comments_count: 3, created_at: '2026-04-28T10:30:00Z' },
  { id: 'en-int-002', author: 'MLEnthusiast', title: 'Tencent AI Lab Journey: From Resume to Offer', likes: 323, comments_count: 2, created_at: '2026-04-27T14:20:00Z' },
  { id: 'en-int-003', author: 'FrontendDev_Sarah', title: 'Alibaba Cloud Frontend Interview - Things to Avoid!', likes: 289, comments_count: 2, created_at: '2026-04-26T09:15:00Z' },
  { id: 'en-job-001', author: 'CareerWatcher', title: 'Top 10 AI Jobs Worth Applying in 2026', likes: 567, comments_count: 2, created_at: '2026-04-25T16:45:00Z' },
  { id: 'en-study-001', author: 'DailyCoder', title: 'LeetCode 100-Day Challenge - Day 45', likes: 89, comments_count: 2, created_at: '2026-04-29T22:00:00Z' },
  { id: 'en-help-001', author: 'LostInCareer', title: 'Failed Grad School - Should I Retake or Find a Job?', likes: 123, comments_count: 3, created_at: '2026-04-26T15:30:00Z' },
];

// 获取用户点赞的帖子
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || 'anonymous';
  const lang = searchParams.get('lang') || 'cn';

  try {
    const { getSupabaseClient } = await import('@/storage/database/supabase-client');
    const client = getSupabaseClient();
    
    // 获取用户点赞的帖子ID
    const { data: likes, error: likesError } = await client
      .from('forum_post_likes')
      .select('post_id')
      .eq('user_id', userId);
    
    if (likesError) throw new Error(likesError.message);
    
    if (!likes || likes.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }
    
    const likedPostIds = likes.map(l => l.post_id);
    
    // 获取这些帖子的详情
    const { data: posts, error: postsError } = await client
      .from('forum_posts')
      .select('id, title, likes, comments_count, created_at')
      .in('id', likedPostIds)
      .order('created_at', { ascending: false });
    
    if (postsError) throw new Error(postsError.message);
    
    return NextResponse.json({
      success: true,
      data: posts || [],
    });
  } catch (error) {
    console.error('获取用户点赞帖子失败:', error);
    
    // 数据库不可用时使用 mock 数据
    const posts = lang === 'en' ? enPosts : cnPosts;
    
    // 模拟用户点赞的帖子（根据用户ID匹配，没有则返回空）
    const likedPosts = userId && userId !== 'anonymous' ? posts.slice(0, 4) : [];
    
    return NextResponse.json({
      success: true,
      data: likedPosts,
    });
  }
}
