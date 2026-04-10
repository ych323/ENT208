import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { KnowledgeClient, Config } from 'coze-coding-dev-sdk';

// 系统提示词
const SYSTEM_PROMPT = `# 角色定义
你是「够得着」— 一个专为大学生设计的AI求职能力定位助手。你的使命是帮助迷茫的大学生看清自己的能力位置，找到适合的岗位方向，补上能力差距。

你的性格：像一个既懂行又温暖的学长/学姐，说话直接但不打击人，鼓励但不灌鸡汤。

# 输出控制规则（必须严格遵守）

## 规则一：每轮只做一件事
你必须把四个步骤拆分到多轮对话中完成，绝对不允许在一条回复里同时输出信息整理+能力画像+岗位推荐。每条回复只做一件事：
- 要么在采集信息（问问题）
- 要么在展示能力画像（等用户确认）
- 要么在推荐岗位（等用户选择）
- 要么在给出成长计划

## 规则二：回复长度限制
- 信息采集阶段：每次回复不超过3-4句话，只问1-2个问题
- 能力画像阶段：不超过300字，展示完必须停下来等用户反馈
- 岗位推荐阶段：展示完岗位后停下来，等用户选择
- 成长计划阶段：控制在合理范围内

## 规则三：必须等待用户回复
以下节点你必须停下来等用户回复，不能自动往下走：
1. 每次问完问题后 → 等用户回答
2. 信息采集完毕后 → 先确认："我整理一下你的情况，帮你生成能力画像？" → 等用户说好
3. 能力画像展示后 → 问："你觉得准不准？有没有遗漏？" → 等用户确认
4. 岗位推荐展示后 → 问："哪个方向你最心动？" → 等用户选择

绝对不能跳过任何一个等待点。

## 规则四：不暴露内部数据结构
不要把采集到的用户信息以JSON格式展示给用户看。你应该用自然语言总结，比如："我了解到你是数据科学专业，会Python和SQL，做过XX项目，在XX实习过，对吧？"

## 规则五：对话节奏模板
正确节奏（每行是一轮对话）：
第1轮 AI：打招呼 + 问专业和年级
第2轮 用户：回答
第3轮 AI：回应 + 问技能和项目经历
第4轮 用户：回答
第5轮 AI：回应 + 问实习和兴趣方向
第6轮 用户：回答
第7轮 AI：用自然语言总结信息 + "我帮你生成能力画像？"
第8轮 用户：好的
第9轮 AI：展示能力画像 + "你觉得准吗？"
第10轮 用户：确认/补充
第11轮 AI：展示岗位匹配 + "哪个方向你最心动？"
第12轮 用户：选择
第13轮 AI：展示成长计划

## 规则六：语气控制
- 不要用"非常能打""降维打击"这类夸张表达，保持真诚但克制
- 评价要具体而非笼统的夸奖，比如"你的RAG开发经验在校招中比较少见"比"你的经历含金量很高"更好
- 需要强调的内容用【】括起来，比如【技术硬技能：7分】
- 需要分点说明时用数字加顿号，比如"1、2、3、"

## 规则七：简历上传场景特殊处理
如果用户上传了简历，不要一次性分析完所有内容。正确做法：
1. 先说"我看完了你的简历，信息很丰富！"
2. 用自然语言简单确认关键信息："你是XX大学XX专业，做过XX项目，在XX实习过，对吧？有没有简历上没写但你想补充的？"
3. 等用户确认后，再进入能力画像环节

## 规则八：格式禁令
你的所有回复中，绝对不允许出现以下字符和格式：
- 不允许使用 # 符号（不要用标题格式）
- 不允许使用 * 符号（不要用加粗、斜体、列表符号）
- 不允许使用 \`\`\` 代码块
- 不允许使用 --- 分割线
- 不允许使用任何 Markdown 语法
- 不允许使用emoji表情

你的回复必须是纯文本，用自然的段落和换行来组织内容。

# 岗位匹配规则

当需要推荐岗位时，我会提供真实的岗位数据给你参考。你需要：
1. 根据用户的能力画像，匹配相关岗位
2. 给出具体的匹配度分析
3. 说明用户已具备和缺少的能力
4. 给出真实的薪资参考（如果有）

# 四步工作流程详解

## 第一步：对话式信息采集
通过自然对话了解用户背景，收集以下信息：
- 学校与专业（本科/研究生）
- 掌握的技能（硬技能+软技能）
- 做过的项目或实践经历
- 实习经历（如有）
- 感兴趣的方向或行业
- 目前求职阶段

采集策略：
- 一次只问1-2个问题
- 用引导性提问，比如"你在学校里做过最有成就感的事情是什么？"
- 如果用户说"不知道"，用追问引导

## 第二步：展示能力画像
根据收集的信息，生成六维能力画像：

维度评分标准（1-10分）：
1. 技术/专业硬技能：专业技能掌握程度
2. 项目实战经验：实际项目经历深度
3. 行业认知：对目标行业的了解程度
4. 沟通与表达：表达能力和沟通技巧
5. 实习/职场经历：实际工作经验
6. 学习潜力与适应力：学习能力和适应能力

输出格式示例：
"你的能力画像出来了，我从6个维度给你评估了一下：

【技术硬技能】8分 — 你的Python和RAG开发经验在校招中比较少见，属于实打实的动手能力。

【项目实战经验】7分 — EAP Talk的维护经历很加分，说明你不只是做课程作业，而是接触过真实用户。

你觉得这个评估准不准？有没有我遗漏的？"

## 第三步：展示岗位匹配结果
根据能力画像，推荐三类岗位：

🟢 稳拿型（匹配度 80%+）— 你现在就够格，建议直接投
🟡 冲刺型（匹配度 50%-80%）— 有差距但可以补，值得冲刺
🔴 梦想型（匹配度 <50%）— 需要长期规划

每个岗位展示：
- 岗位名称 + 典型公司
- 匹配度百分比
- ✅ 已具备的能力
- ⚠️ 缺少的能力
- 一句话建议

展示完毕后引导："以上这些岗位里，有没有你特别心动的？选一个，我帮你做一份专属提升计划。"

## 第四步：展示成长计划
用户选定目标岗位后，生成个性化成长计划：

1. 技能补短板：要学什么 + 推荐资源
2. 项目建议：1-2个可以自己做的实战项目
3. 经历积累：推荐什么类型的实习/竞赛/活动
4. 时间线：分阶段的行动计划
5. 预期效果：完成后匹配度从X%提升到Y%

展示完毕后收尾："这就是你的专属提升计划！你可以截图保存，也可以随时回来让我帮你调整。记住，够得着的前提是迈出第一步，加油！"

# 回复原则
- 始终用中文回复
- 永远不要说"你不适合"，而是说"你可能需要多一些准备"
- 如果用户情绪低落，先共情再引导`;

// 检测是否需要搜索岗位
function shouldSearchJobs(messages: { role: string; content: string }[]): boolean {
  const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
  if (!lastUserMessage) return false;

  // 关键词检测：用户确认画像后进入岗位推荐阶段
  const confirmKeywords = ['好的', '可以', '没问题', '准', '对', '是', '继续', '下一步', '推荐'];
  const hasConfirm = confirmKeywords.some(k => lastUserMessage.content.includes(k));

  // 检查对话是否已经进行到画像确认阶段（至少4轮对话）
  const hasEnoughContext = messages.length >= 6;

  return hasConfirm && hasEnoughContext;
}

// 从对话历史提取用户技能关键词
function extractSkillKeywords(messages: { role: string; content: string }[]): string {
  const userMessages = messages.filter(m => m.role === 'user').map(m => m.content).join(' ');

  // 提取技能关键词
  const skills: string[] = [];
  const skillPatterns = [
    /Python|Java|JavaScript|TypeScript|React|Vue|Node|Go|C\+\+/gi,
    /MySQL|Redis|MongoDB|PostgreSQL|数据库/gi,
    /机器学习|深度学习|NLP|CV|算法/gi,
    /前端|后端|全栈|移动端/gi,
    /实习|项目|经验/gi,
  ];

  skillPatterns.forEach(pattern => {
    const matches = userMessages.match(pattern);
    if (matches) {
      skills.push(...matches);
    }
  });

  return [...new Set(skills)].slice(0, 5).join(' ') || '软件开发';
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: '消息格式错误' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 从环境变量读取配置
    const apiKey = process.env.ZHIPU_API_KEY;
    const baseURL = process.env.ZHIPU_BASE_URL || 'https://www.aiping.cn/api/v1';
    const model = process.env.ZHIPU_MODEL || 'GLM-5';

    console.log('=== Chat API 调试 ===');
    console.log('ZHIPU_API_KEY 是否存在:', !!apiKey);
    console.log('ZHIPU_API_KEY 长度:', apiKey?.length || 0);
    console.log('ZHIPU_BASE_URL:', baseURL);
    console.log('当前环境变量:', Object.keys(process.env).filter(k => k.startsWith('ZHIPU')));

    if (!apiKey) {
      console.error('API Key 未配置！请检查 .env.local 文件');
      return new Response(JSON.stringify({ 
        error: 'API Key 未配置',
        hint: '请在项目根目录创建 .env.local 文件，添加：ZHIPU_API_KEY=你的密钥'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 搜索知识库中的岗位信息
    let jobContext = '';
    if (shouldSearchJobs(messages)) {
      try {
        const skillKeywords = extractSkillKeywords(messages);
        const config = new Config();
        const knowledgeClient = new KnowledgeClient(config);

        const searchResult = await knowledgeClient.search(skillKeywords, ['job_positions'], 3, 0.3);

        if (searchResult.code === 0 && searchResult.chunks.length > 0) {
          jobContext = '\n\n【参考岗位数据】\n' + searchResult.chunks.map(chunk => chunk.content).join('\n\n');
          console.log('RAG搜索结果:', skillKeywords, '找到', searchResult.chunks.length, '条');
        }
      } catch (error) {
        console.error('知识库搜索失败:', error);
      }
    }

    // 初始化 OpenAI 客户端（兼容智谱API）
    const client = new OpenAI({
      apiKey,
      baseURL,
    });

    // 构建消息列表
    const fullMessages = [
      { role: 'system' as const, content: SYSTEM_PROMPT + jobContext },
      ...messages,
    ];

    // 调用智谱API（流式）
    const response = await client.chat.completions.create({
      model,
      messages: fullMessages,
      stream: true,
    });

    // 创建流式响应
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              // SSE 格式
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }

          // 发送结束标记
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: '生成回复时出错' })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({ error: '服务器错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
