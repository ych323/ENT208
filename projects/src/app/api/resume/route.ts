import { NextRequest, NextResponse } from 'next/server';

// 动态导入pdf-parse
async function parsePdf(buffer: Buffer): Promise<string> {
  try {
    // 使用require方式导入CommonJS模块
    // @ts-ignore
    const pdfParse = require('pdf-parse');
    const data = await pdfParse(buffer);
    return data.text || '';
  } catch (error) {
    console.error('PDF解析错误:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    // 检查对象存储环境变量
    const hasCloudStorage = !!(
      process.env.COZE_BUCKET_ENDPOINT_URL &&
      process.env.COZE_BUCKET_NAME
    );
    
    console.log('=== 简历上传API ===');
    console.log('云端存储:', hasCloudStorage ? '可用' : '不可用');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: '未找到文件', success: false }, { status: 400 });
    }

    console.log('文件:', file.name, file.type, `${(file.size / 1024).toFixed(1)}KB`);

    // 检查文件类型
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/webp',
      'text/plain',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '不支持的文件格式，请上传 PDF、Word、图片或文本文件', success: false },
        { status: 400 }
      );
    }

    // 检查文件大小（最大 10MB）
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: '文件大小不能超过 10MB', success: false }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let textContent: string;

    // 云端环境：使用对象存储 + fetch-url服务解析PDF
    if (hasCloudStorage && file.type === 'application/pdf') {
      console.log('尝试云端fetch-url解析...');
      try {
        const { S3Storage, FetchClient, Config, HeaderUtils } = await import('coze-coding-dev-sdk');
        
        const storage = new S3Storage({
          endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
          accessKey: '',
          secretKey: '',
          bucketName: process.env.COZE_BUCKET_NAME!,
          region: 'cn-beijing',
        });

        // 使用纯ASCII文件名
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2, 8);
        const fileName = `resumes/${timestamp}_${randomId}.pdf`;

        console.log('上传文件:', fileName);
        
        const fileKey = await storage.uploadFile({
          fileContent: buffer,
          fileName,
          contentType: 'application/pdf',
        });
        console.log('上传成功, key:', fileKey);

        console.log('生成签名URL...');
        const signedUrl = await storage.generatePresignedUrl({
          key: fileKey,
          expireTime: 3600,
        });

        console.log('调用fetch-url解析...');
        const config = new Config();
        const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
        const fetchClient = new FetchClient(config, customHeaders);

        const fetchResponse = await fetchClient.fetch(signedUrl);
        console.log('fetch-url响应:', fetchResponse.status_code, fetchResponse.status_message);

        if (fetchResponse.status_code !== 0) {
          throw new Error(`fetch-url失败: ${fetchResponse.status_message}`);
        }

        textContent = fetchResponse.content
          .filter((item) => item.type === 'text')
          .map((item) => item.text)
          .join('\n');
        
        console.log(`云端解析成功! 提取 ${textContent.length} 字符`);
        
        if (textContent.trim().length < 10) {
          textContent = `【PDF解析结果】

PDF文件「${file.name}」云端解析完成，但内容较少（${textContent.length}字符）。

建议：直接在对话中描述你的简历内容。`;
        }
      } catch (cloudError) {
        console.error('云端解析失败，降级到本地解析:', cloudError);
        textContent = await parseLocally(file, buffer);
      }
    }
    // 本地解析或其他格式
    else {
      textContent = await parseLocally(file, buffer);
    }

    console.log('=== 简历上传完成 ===');
    
    return NextResponse.json({
      success: true,
      fileName: file.name,
      content: textContent,
      message: '简历上传成功',
    });
  } catch (error) {
    console.error('=== 简历上传错误 ===');
    console.error('错误:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: '上传失败', 
        message: error instanceof Error ? error.message : '未知错误',
      }, 
      { status: 500 }
    );
  }
}

// 本地解析函数
async function parseLocally(file: File, buffer: Buffer): Promise<string> {
  if (file.type === 'application/pdf') {
    try {
      console.log('本地pdf-parse解析...');
      const text = await parsePdf(buffer);
      console.log(`解析完成，提取 ${text.length} 字符`);
      
      if (!text || text.trim().length < 10) {
        return `【本地PDF解析】

PDF文件「${file.name}」本地解析完成，但内容较少（${text.length}字符）。

可能原因：PDF是扫描图片格式

建议：直接在对话中描述你的简历内容。`;
      }
      return text;
    } catch (pdfError) {
      console.error('PDF解析失败:', pdfError);
      return `【本地PDF解析失败】

PDF文件「${file.name}」无法解析。

错误：${pdfError instanceof Error ? pdfError.message : '未知错误'}

建议：直接在对话中描述你的简历内容。`;
    }
  }
  
  if (file.type.includes('word')) {
    return `Word文件「${file.name}」已接收。暂不支持Word解析，请将内容复制为txt文件上传。`;
  }
  
  if (file.type.startsWith('image/')) {
    return `图片文件「${file.name}」已接收。暂不支持图片OCR，请将内容复制为txt文件上传。`;
  }
  
  if (file.type === 'text/plain') {
    try {
      return new TextDecoder('utf-8').decode(buffer);
    } catch {
      return '文本文件解码失败，请确保文件是UTF-8编码。';
    }
  }
  
  return `文件「${file.name}」已上传，但不支持此格式解析。`;
}
