import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// 获取学习资源列表
export async function GET(request: NextRequest) {
  const client = getSupabaseClient();
  const { searchParams } = new URL(request.url);
  
  const category = searchParams.get('category'); // 前端/后端/算法/工具/面试
  const type = searchParams.get('type'); // article/video/course/book/project
  const level = searchParams.get('level'); // 入门/进阶/高级/all
  
  try {
    let query = client.from('learning_resources').select('*', { count: 'exact' });
    
    if (category) {
      query = query.eq('category', category);
    }
    if (type) {
      query = query.eq('type', type);
    }
    if (level && level !== 'all') {
      query = query.eq('level', level);
    }
    
    query = query.order('created_at', { ascending: false });
    
    const { data, error, count } = await query;
    if (error) throw new Error(`查询失败: ${error.message}`);
    
    return NextResponse.json({
      success: true,
      data: data || [],
      total: count || 0,
    });
  } catch (error) {
    console.error('获取学习资源失败:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '获取失败' },
      { status: 500 }
    );
  }
}

// 批量添加学习资源
export async function POST(request: NextRequest) {
  const client = getSupabaseClient();
  
  try {
    const body = await request.json();
    const { resources } = body;
    
    if (!resources || !Array.isArray(resources)) {
      return NextResponse.json(
        { success: false, error: '资源数据格式错误' },
        { status: 400 }
      );
    }
    
    const { data, error } = await client
      .from('learning_resources')
      .insert(resources)
      .select();
    
    if (error) throw new Error(`添加失败: ${error.message}`);
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('添加学习资源失败:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '添加失败' },
      { status: 500 }
    );
  }
}
