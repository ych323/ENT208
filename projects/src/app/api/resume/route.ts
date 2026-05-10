import { NextRequest, NextResponse } from 'next/server';
import { createBigModelChatCompletion, parseFileWithBigModel } from '@/lib/bigmodel';

async function parsePdf(buffer: Buffer): Promise<string> {
  // @ts-ignore CommonJS package
  const pdfParse = require('pdf-parse');
  const data = await pdfParse(buffer);
  return data.text || '';
}

async function summarizeResume(rawText: string) {
  if (!rawText.trim()) {
    return '';
  }

  const prompt = `Rewrite the resume content below into a concise English summary for later career-fit analysis. Focus on education, projects, internships or work experience, technical stack, measurable outcomes, and possible target-role signals. Do not output JSON. Use clear short paragraphs.\n\nResume content:\n${rawText}`;

  return createBigModelChatCompletion([
    { role: 'system', content: '你是一个简历解析助手，负责把原始简历内容提炼成清晰、可读、可用于求职分析的摘要。' },
    { role: 'user', content: prompt },
  ]);
}

async function parseLocally(file: File, buffer: Buffer) {
  if (file.type === 'application/pdf') {
    try {
      return await parsePdf(buffer);
    } catch {
      return '';
    }
  }

  if (file.type === 'text/plain') {
    return buffer.toString('utf-8');
  }

  return '';
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: '未找到上传文件' }, { status: 400 });
    }

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'image/jpeg',
      'image/png',
      'image/webp',
      'text/plain',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: '仅支持 PDF、Word、图片或 txt 文件' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: '文件大小不能超过 10MB' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let content = await parseFileWithBigModel(file);

    if (!content) {
      content = await parseLocally(file, buffer);
    }

    if (content) {
      const summarized = await summarizeResume(content);
      if (summarized) {
        content = summarized;
      }
    }

    if (!content && file.type.includes('word')) {
      content = '已收到 Word 简历，但当前未能成功完成解析。建议优先转成 PDF 后重新上传。';
    }

    if (!content && file.type.startsWith('image/')) {
      content = '已收到图片简历，但当前未能成功提取文本。建议优先转成清晰 PDF 后重新上传。';
    }

    if (!content) {
      content = '简历上传成功，但没有提取到足够文本。你也可以直接补充学校、项目、实习和技能信息。';
    }

    return NextResponse.json({
      success: true,
      fileName: file.name,
      content,
      message: '简历上传成功',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '上传失败',
      },
      { status: 500 },
    );
  }
}
