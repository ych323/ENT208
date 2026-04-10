import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// 获取帖子列表
export async function GET(request: NextRequest) {
  const client = getSupabaseClient();
  const { searchParams } = new URL(request.url);
  
  const category = searchParams.get('category');
  const sort = searchParams.get('sort') || 'latest'; // latest/hot/top
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  const offset = (page - 1) * pageSize;
  
  try {
    let query = client.from('forum_posts').select('*', { count: 'exact' });
    
    // 分类筛选
    if (category && category !== '全部') {
      query = query.eq('category', category);
    }
    
    // 排序
    if (sort === 'hot') {
      query = query.order('views', { ascending: false });
    } else if (sort === 'top') {
      query = query.order('likes', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }
    
    // 分页
    query = query.range(offset, offset + pageSize - 1);
    
    const { data, error, count } = await query;
    if (error) throw new Error(`查询失败: ${error.message}`);
    
    return NextResponse.json({
      success: true,
      data: data || [],
      total: count || 0,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('获取帖子列表失败:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '获取失败' },
      { status: 500 }
    );
  }
}

// 创建帖子
export async function POST(request: NextRequest) {
  const client = getSupabaseClient();
  
  try {
    const body = await request.json();
    const { title, content, category, tags, target_job, company, author } = body;
    
    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: '标题和内容不能为空' },
        { status: 400 }
      );
    }
    
    const { data, error } = await client
      .from('forum_posts')
      .insert({
        title,
        content,
        category: category || '面试经验',
        tags: tags || '',
        target_job: target_job || '',
        company: company || '',
        author: author || '匿名用户',
        views: 0,
        likes: 0,
        comments_count: 0,
      })
      .select()
      .single();
    
    if (error) throw new Error(`创建失败: ${error.message}`);
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('创建帖子失败:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '创建失败' },
      { status: 500 }
    );
  }
}
