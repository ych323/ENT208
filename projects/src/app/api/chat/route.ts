import { NextRequest } from 'next/server';
import { createBigModelChatCompletion } from '@/lib/bigmodel';
import { searchRelevantJobs, type JobRecord } from '@/lib/jobs-data';

const SYSTEM_PROMPT = `You are Reachable's career coach for students and early-career candidates.

Default to English in every reply unless the user explicitly asks for Chinese or writes mainly in Chinese.

Output rules:
- Do not use Markdown.
- Do not use headings like # or ##.
- Do not use bold markers, code blocks, or bullet markers such as -, *, or 1.
- Write in short plain paragraphs.
- Keep the reply practical, direct, and specific.

Behavior rules:
- If the user provides resume content, first summarize what you observed, then give advice.
- If real job examples are provided by the system, use them to make the advice concrete.
- Focus on role fit, evidence, gaps, and the next actionable step.`;

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

function chunkText(text: string, chunkSize = 48) {
  const chunks: string[] = [];
  for (let index = 0; index < text.length; index += chunkSize) {
    chunks.push(text.slice(index, index + chunkSize));
  }
  return chunks;
}

function streamText(text: string) {
  const encoder = new TextEncoder();

  return new ReadableStream({
    start(controller) {
      for (const chunk of chunkText(text)) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`));
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });
}

function prefersChinese(text: string) {
  const cjkChars = text.match(/[\u4e00-\u9fff]/g) ?? [];
  if (cjkChars.length >= 6) {
    return true;
  }

  return /(please answer in chinese|reply in chinese|用中文|中文回答|请用中文)/i.test(text);
}

function summarizeIntent(message: string, jobs: JobRecord[], useChinese: boolean) {
  const normalized = message.toLowerCase();
  const categories = [...new Set(jobs.map((job) => job.category))].slice(0, 3);

  const labels = useChinese
    ? {
        resume: '你刚才的信息里已经包含了比较明显的简历式背景内容。',
        lost: '你现在更像是在做方向探索，而不是已经锁定单一岗位。',
        bigTech: '你明显在意竞争更强的平台或大厂机会。',
        categories: categories.length
          ? `当前岗位池里和你更接近的方向是：${categories.join('、')}。`
          : '即使暂时没有特别紧的岗位匹配，我也可以先根据你的背景判断方向。',
      }
    : {
        resume: 'Your latest message already contains clear resume-style background signals.',
        lost: 'You seem to be exploring direction before locking a single target role.',
        bigTech: 'You clearly care about more competitive teams or larger companies.',
        categories: categories.length
          ? `The closest role directions in the current job pool are ${categories.join(', ')}.`
          : 'I can still reason from your background even without a tight live job match.',
      };

  const lines: string[] = [];

  if (/(resume|简历|education|school|project|项目|intern|实习|skills|技能|experience)/i.test(normalized)) {
    lines.push(labels.resume);
  }
  if (/(迷茫|不知道|方向|lost|confused|no idea)/i.test(normalized)) {
    lines.push(labels.lost);
  }
  if (/(大厂|big tech|tiktok|字节|腾讯|阿里|google|meta|amazon)/i.test(normalized)) {
    lines.push(labels.bigTech);
  }

  lines.push(labels.categories);
  return lines.slice(0, 2);
}

function buildJobSuggestions(jobs: JobRecord[], useChinese: boolean) {
  if (jobs.length === 0) {
    return useChinese
      ? '当前岗位池里还没有特别强的直接匹配，所以我会先帮你把目标缩到岗位方向、城市或远程偏好，以及你最有证据支撑的能力上。'
      : 'I do not have a strong direct match from the current pool, so I would narrow your target first by role family, city or remote preference, and your strongest evidence.';
  }

  const topJobs = jobs.slice(0, 3);
  return useChinese
    ? `可以先参考这些真实岗位：${topJobs.map((job) => `${job.title} at ${job.company} in ${job.location}`).join('；')}。`
    : `You can use these real roles as reference points: ${topJobs.map((job) => `${job.title} at ${job.company} in ${job.location}`).join('; ')}.`;
}

function buildActionPlan(message: string, jobs: JobRecord[], useChinese: boolean) {
  const normalized = message.toLowerCase();

  if (useChinese) {
    if (/(resume|简历|project|项目|intern|实习|experience)/i.test(normalized)) {
      return '下一步你直接告诉我目标岗位、最能代表你的一个项目，以及你觉得最弱的一段经历，我就可以继续把它拆成差距分析和两周提升计划。';
    }

    return jobs.length
      ? '下一步最有效的是先从这些匹配岗位里选一个目标，我再帮你拆岗位要求、你已经具备的证据，以及还缺的部分。'
      : '下一步你只要补三件事：专业背景、最像样的一个项目，以及你更偏工程、产品、数据、设计还是运营。';
  }

  if (/(resume|project|intern|experience)/i.test(normalized)) {
    return 'Next, tell me your target role, your strongest project, and the weakest part of your resume, and I will turn that into a gap analysis plus a two week improvement plan.';
  }

  return jobs.length
    ? 'The most useful next move is to choose one of these matched roles, then I can break down the requirements, the evidence you already have, and what is still missing.'
    : 'Next, give me your major, one representative project, and whether you lean toward engineering, product, data, design, or operations.';
}

function buildOfflineReply(messages: ChatMessage[], jobs: JobRecord[]) {
  const lastUserMessage = [...messages].reverse().find((message) => message.role === 'user');
  const latest = lastUserMessage?.content.trim() || '';
  const useChinese = prefersChinese(latest);

  if (!latest) {
    return useChinese
      ? '你先告诉我你的专业、一个项目或实习，以及想尝试的岗位类型，我就能开始帮你定位。'
      : 'Tell me your major, one project or internship, and the kind of role you want. I will help you narrow it down.';
  }

  return [
    ...summarizeIntent(latest, jobs, useChinese),
    buildJobSuggestions(jobs, useChinese),
    buildActionPlan(latest, jobs, useChinese),
  ].join('\n\n');
}

async function requestBigModel(messages: ChatMessage[], relatedJobs: JobRecord[], useChinese: boolean) {
  const jobContext = relatedJobs.length
    ? `\n\nReal job examples:\n${relatedJobs
        .map((job, index) => `${index + 1}. ${job.title} | ${job.company} | ${job.location} | ${job.tags ?? ''}`)
        .join('\n')}`
    : '';

  const languageOverride = useChinese
    ? '\n\nThe user explicitly prefers Chinese. Reply in Chinese.'
    : '\n\nReply in English.';

  return createBigModelChatCompletion([
    { role: 'system', content: `${SYSTEM_PROMPT}${jobContext}${languageOverride}` },
    ...messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  ]);
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid messages payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const normalizedMessages: ChatMessage[] = messages
      .filter((message: ChatMessage) => message && typeof message.content === 'string')
      .map((message: ChatMessage) => ({
        role: message.role === 'assistant' ? 'assistant' : 'user',
        content: message.content,
      }));

    const lastUserMessage = [...normalizedMessages].reverse().find((message) => message.role === 'user');
    const latest = lastUserMessage?.content || '';
    const useChinese = prefersChinese(latest);
    const relatedJobs = lastUserMessage ? await searchRelevantJobs(lastUserMessage.content, 4) : [];

    let text = '';

    try {
      text = await requestBigModel(normalizedMessages, relatedJobs, useChinese);
    } catch {
      text = '';
    }

    if (!text) {
      text = buildOfflineReply(normalizedMessages, relatedJobs);
    }

    return new Response(streamText(text), {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
