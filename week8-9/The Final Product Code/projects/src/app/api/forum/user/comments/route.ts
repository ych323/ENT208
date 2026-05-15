import { NextRequest, NextResponse } from 'next/server';

// 中文评论数据（关联到帖子）
const cnComments = [
  { id: 'c1', post_id: 'cn-int-001', post_title: '字节跳动后端一面+二面+HR面，超详细面经分享！', content: '感谢分享！请问一面大概多长时间？', likes: 12, created_at: '2026-04-28T11:00:00Z' },
  { id: 'c2', post_id: 'cn-int-001', post_title: '字节跳动后端一面+二面+HR面，超详细面经分享！', content: '一面大概45分钟左右，主要是基础知识和项目经验', likes: 8, created_at: '2026-04-28T12:30:00Z' },
  { id: 'c3', post_id: 'cn-int-001', post_title: '字节跳动后端一面+二面+HR面，超详细面经分享！', content: '二面算法题难吗？', likes: 5, created_at: '2026-04-28T14:00:00Z' },
  { id: 'c4', post_id: 'cn-int-002', post_title: '腾讯AI Lab面试经历：从简历筛选到offer', content: '腾讯AI Lab面试看重哪些能力？', likes: 15, created_at: '2026-04-27T15:00:00Z' },
  { id: 'c5', post_id: 'cn-int-002', post_title: '腾讯AI Lab面试经历：从简历筛选到offer', content: '主要是论文理解能力和工程实现能力', likes: 10, created_at: '2026-04-27T16:30:00Z' },
  { id: 'c6', post_id: 'cn-int-003', post_title: '阿里云前端面试复盘，这些坑千万别踩！', content: '请问手写代码是什么题型？', likes: 8, created_at: '2026-04-26T10:00:00Z' },
  { id: 'c7', post_id: 'cn-job-001', post_title: '2026年最值得投递的AI岗位Top 10', content: '大模型算法工程师需要掌握哪些技能？', likes: 20, created_at: '2026-04-25T17:00:00Z' },
  { id: 'c8', post_id: 'cn-study-001', post_title: 'LeetCode刷题100天打卡 Day 45', content: '坚持就是胜利！动态规划确实是最难的部分', likes: 25, created_at: '2026-04-29T22:30:00Z' },
  { id: 'c9', post_id: 'cn-help-001', post_title: '考研失利后是选择二战还是找工作？', content: '如果你对学术研究有强烈兴趣，建议二战', likes: 30, created_at: '2026-04-26T16:00:00Z' },
];

// 英文评论数据
const enComments = [
  { id: 'ec1', post_id: 'en-int-001', post_title: 'ByteDance Backend Interview: 3 Rounds + HR - Full Experience', content: 'Thanks for sharing! How long was Round 1?', likes: 12, created_at: '2026-04-28T11:00:00Z' },
  { id: 'ec2', post_id: 'en-int-001', post_title: 'ByteDance Backend Interview: 3 Rounds + HR - Full Experience', content: 'Round 1 was about 45 minutes, mainly fundamentals and project experience', likes: 8, created_at: '2026-04-28T12:30:00Z' },
  { id: 'ec3', post_id: 'en-int-001', post_title: 'ByteDance Backend Interview: 3 Rounds + HR - Full Experience', content: 'Were the algorithm problems hard in Round 2?', likes: 5, created_at: '2026-04-28T14:00:00Z' },
  { id: 'ec4', post_id: 'en-int-002', post_title: 'Tencent AI Lab Journey: From Resume to Offer', content: 'What abilities does Tencent AI Lab value most?', likes: 15, created_at: '2026-04-27T15:00:00Z' },
  { id: 'ec5', post_id: 'en-job-001', post_title: 'Top 10 AI Jobs Worth Applying in 2026', content: 'What skills are needed for LLM Algorithm Engineer?', likes: 20, created_at: '2026-04-25T17:00:00Z' },
  { id: 'ec6', post_id: 'en-study-001', post_title: 'LeetCode 100-Day Challenge - Day 45', content: 'Persistence pays off! DP is indeed the hardest part', likes: 25, created_at: '2026-04-29T22:30:00Z' },
  { id: 'ec7', post_id: 'en-help-001', post_title: 'Failed Grad School - Should I Retake or Find a Job?', content: 'If you have strong interest in research, retake. If just for degree, work experience is valuable too', likes: 30, created_at: '2026-04-26T16:00:00Z' },
];

// 获取用户发布的评论
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || 'anonymous';
  const lang = searchParams.get('lang') || 'cn';

  try {
    const { getSupabaseClient } = await import('@/storage/database/supabase-client');
    const client = getSupabaseClient();
    
    // 从数据库获取用户发布的评论，关联帖子标题
    const { data: comments, error } = await client
      .from('forum_comments')
      .select(`
        id, 
        post_id, 
        content, 
        likes, 
        created_at,
        post:forum_posts(title)
      `)
      .eq('author_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    
    // 处理帖子标题嵌套
    const formattedComments = comments?.map((c: any) => ({
      ...c,
      post_title: Array.isArray(c.post) ? c.post[0]?.title || 'Unknown Post' : c.post?.title || 'Unknown Post',
    })) || [];
    
    return NextResponse.json({
      success: true,
      data: formattedComments,
    });
  } catch (error) {
    console.error('获取用户评论失败:', error);
    
    // 数据库不可用时使用 mock 数据
    const comments = lang === 'en' ? enComments : cnComments;
    
    // 模拟用户发布的评论（根据评论ID匹配）
    const userComments = comments.filter(c => 
      c.id.startsWith('ec') && ['ec1', 'ec2', 'ec3'].includes(c.id) ||
      c.id.startsWith('c') && ['c1', 'c2', 'c3'].includes(c.id)
    );
    
    return NextResponse.json({
      success: true,
      data: userComments,
    });
  }
}
