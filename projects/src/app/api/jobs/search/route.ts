import { NextRequest, NextResponse } from 'next/server';
import { KnowledgeClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { query, topK = 5, minScore = 0.3 } = await request.json();

    if (!query) {
      return NextResponse.json({ error: '请提供搜索关键词' }, { status: 400 });
    }

    // 初始化知识库客户端
    const config = new Config();
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const client = new KnowledgeClient(config, customHeaders);

    // 语义搜索 - 搜索所有数据集
    const response = await client.search(
      query,
      [], // 空数组表示搜索所有数据集
      topK,
      minScore
    );

    if (response.code !== 0) {
      return NextResponse.json(
        { error: '搜索失败', message: response.msg },
        { status: 500 }
      );
    }

    // 格式化结果
    const results = response.chunks.map((chunk, index) => ({
      index: index + 1,
      score: chunk.score,
      content: chunk.content,
      docId: chunk.doc_id,
    }));

    return NextResponse.json({
      success: true,
      query,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: '搜索失败', message: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
}
