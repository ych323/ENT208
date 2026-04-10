import { NextRequest, NextResponse } from 'next/server';
import { FetchClient, KnowledgeClient, Config, DataSourceType, HeaderUtils, KnowledgeDocument } from 'coze-coding-dev-sdk';

// 岗位信息结构
interface JobInfo {
  title: string;
  company?: string;
  salary?: string;
  location?: string;
  requirements: string[];
  url: string;
}

// 从抓取内容中解析岗位信息
function parseJobInfo(content: { type: string; text?: string }[], url: string, title?: string): JobInfo {
  const jobInfo: JobInfo = {
    title: title || '未知岗位',
    requirements: [],
    url,
  };

  // 提取所有文本
  const textContent = content
    .filter(item => item.type === 'text' && item.text)
    .map(item => item.text)
    .join('\n');

  // 尝试解析薪资
  const salaryMatch = textContent.match(/(\d+[-~]\d+K?|\d+K[-~]\d+K?|\d+[-~]\d+万)/i);
  if (salaryMatch) {
    jobInfo.salary = salaryMatch[1];
  }

  // 尝试解析地点
  const locationMatch = textContent.match(/(?:地点|城市|工作地[点区])[:：\s]*([^\n,，]+)/);
  if (locationMatch) {
    jobInfo.location = locationMatch[1].trim();
  }

  // 提取关键词作为要求
  const keywords = [
    'Python', 'Java', 'JavaScript', 'TypeScript', 'React', 'Vue', 'Node',
    'MySQL', 'Redis', 'MongoDB', 'PostgreSQL',
    'Docker', 'Kubernetes', 'Linux', 'Git',
    '机器学习', '深度学习', 'NLP', 'CV', '算法',
    '本科', '硕士', '博士',
    '经验', '年以上',
  ];

  keywords.forEach(keyword => {
    if (textContent.includes(keyword)) {
      jobInfo.requirements.push(keyword);
    }
  });

  // 将完整内容作为要求的一部分
  if (textContent.length > 100) {
    jobInfo.requirements.push(`岗位详情：${textContent.substring(0, 500)}`);
  }

  return jobInfo;
}

// 格式化岗位信息为文本
function formatJobForKnowledge(job: JobInfo): string {
  return `【岗位名称】${job.title}
${job.company ? `【公司】${job.company}` : ''}
${job.salary ? `【薪资】${job.salary}` : ''}
${job.location ? `【地点】${job.location}` : ''}
【来源】${job.url}

【岗位要求】
${job.requirements.map((r, i) => `${i + 1}、${r}`).join('\n')}
`;
}

export async function POST(request: NextRequest) {
  try {
    const { urls } = await request.json();

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: '请提供岗位URL列表' }, { status: 400 });
    }

    // 初始化客户端
    const config = new Config();
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const fetchClient = new FetchClient(config, customHeaders);
    const knowledgeClient = new KnowledgeClient(config, customHeaders);

    const results: { url: string; status: string; job?: JobInfo; error?: string }[] = [];
    const documents: KnowledgeDocument[] = [];

    // 抓取每个URL
    for (const url of urls) {
      try {
        console.log(`正在抓取: ${url}`);
        const response = await fetchClient.fetch(url);

        if (response.status_code !== 0) {
          results.push({
            url,
            status: 'failed',
            error: response.status_message || '抓取失败',
          });
          continue;
        }

        // 解析岗位信息
        const jobInfo = parseJobInfo(
          response.content as { type: string; text?: string }[],
          url,
          response.title
        );

        // 格式化为知识库文档
        const jobText = formatJobForKnowledge(jobInfo);

        documents.push({
          source: DataSourceType.TEXT,
          raw_data: jobText,
        });

        results.push({
          url,
          status: 'success',
          job: jobInfo,
        });

        console.log(`抓取成功: ${jobInfo.title}`);
      } catch (error) {
        console.error(`抓取失败 ${url}:`, error);
        results.push({
          url,
          status: 'failed',
          error: error instanceof Error ? error.message : '未知错误',
        });
      }
    }

    // 存入知识库
    let importResult = { success: 0, failed: 0 };
    if (documents.length > 0) {
      try {
        const knowledgeResponse = await knowledgeClient.addDocuments(
          documents,
          'job_positions',
          {
            separator: '\n\n',
            max_tokens: 2000,
          }
        );

        if (knowledgeResponse.code === 0) {
          importResult.success = documents.length;
          console.log(`成功导入 ${documents.length} 条岗位数据到知识库`);
        } else {
          importResult.failed = documents.length;
          console.error('知识库导入失败:', knowledgeResponse.msg);
        }
      } catch (error) {
        importResult.failed = documents.length;
        console.error('知识库导入异常:', error);
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        total: urls.length,
        fetched: results.filter(r => r.status === 'success').length,
        failed: results.filter(r => r.status === 'failed').length,
        imported: importResult.success,
      },
      results,
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: '导入失败', message: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
}
