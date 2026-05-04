'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Message } from '@/types/chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Send, Loader2, FileText, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

// 生成唯一ID
function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function normalizeAssistantContent(content: string): string {
  return content
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/`{1,3}/g, '')
    .replace(/^\s*[-*•]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// 快捷引导问题 - 英文
const QUICK_QUESTIONS_EN = [
  {
    icon: '📄',
    title: 'Upload Resume Analysis',
    desc: 'Supports PDF, Word, and image formats. AI automatically extracts and analyzes your background information',
    prompt: 'upload_resume',
    isUpload: true,
  },
  {
    icon: '📝',
    title: 'Describe Your Resume',
    desc: 'Tell me about your experience and skills, and I will help you analyze them',
    prompt: 'I want you to help me analyze my resume. Here is my situation:\n\n1. School and major:\n2. Skills I have:\n3. Projects I have done:\n4. Internship experience (if any):\n5. Fields of interest:\n\nPlease help me identify my abilities based on this information.',
  },
  {
    icon: '😶‍🌫️',
    title: 'Completely Lost',
    desc: "Not sure what you can do? Don't worry, we can find a direction together",
    prompt: "I'm a junior student and I have no idea what kind of job I can do. Can you help me analyze?",
  },
  {
    icon: '🏢',
    title: 'Want to Join a Big Company',
    desc: "Want to aim for big tech but not confident? Let AI help you assess the gap and create a sprint plan",
    prompt: "I want to join a big tech company but I feel like I'm not qualified enough. Do I have a chance with my current level?",
  },
];

// 快捷引导问题 - 中文
const QUICK_QUESTIONS_ZH = [
  {
    icon: '📄',
    title: '上传简历分析',
    desc: '支持 PDF、Word、图片格式，AI 自动提取并分析你的背景信息',
    prompt: 'upload_resume',
    isUpload: true,
  },
  {
    icon: '📝',
    title: '描述简历内容',
    desc: '直接告诉我你的经历和技能，我来帮你分析',
    prompt: '我想让你帮我分析简历，我的情况是：\n\n1. 学校和专业：\n2. 掌握的技能：\n3. 做过的项目：\n4. 实习经历（如有）：\n5. 感兴趣的方向：\n\n请根据这些信息帮我定位能力。',
  },
  {
    icon: '😶‍🌫️',
    title: '完全迷茫',
    desc: '不知道自己能做什么？没关系，聊聊就能找到方向',
    prompt: '我是大三学生，完全不知道自己能做什么工作，能帮我分析一下吗？',
  },
  {
    icon: '🏢',
    title: '想进大厂',
    desc: '想冲大厂但没信心？让 AI 帮你评估差距，制定冲刺计划',
    prompt: '我想进大厂但感觉自己不够格，我现在的水平有机会吗？',
  },
];

interface ChatProps {
  onBack?: () => void;
}

export function Chat({ onBack }: ChatProps) {
  const { isEnglish } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 根据语言选择快捷问题
  const QUICK_QUESTIONS = isEnglish ? QUICK_QUESTIONS_EN : QUICK_QUESTIONS_ZH;

  // 国际化文本
  const texts = {
    welcomeTitle: isEnglish ? 'How can I help you?' : '有什么我能帮你的吗？',
    welcomeDesc: isEnglish 
      ? "I'm your career positioning assistant, helping you understand your abilities and find your direction"
      : '我是你的求职定位助手，帮你看清能力、找到方向',
    userAvatar: isEnglish ? 'Me' : '我',
    inputPlaceholder: isEnglish 
      ? (isUploading ? 'Parsing resume...' : 'Tell me about your background, or just ask me...')
      : (isUploading ? '正在解析简历...' : '聊聊你的背景，或者直接问我...'),
    inputHint: isEnglish 
      ? 'Press Enter to send · Shift + Enter for new line · Click 📎 to upload resume'
      : '按 Enter 发送 · Shift + Enter 换行 · 点击 📎 上传简历',
    uploadTitle: isEnglish ? 'Upload Resume' : '上传简历',
    sendTitle: isEnglish ? 'Send' : '发送',
    requestFailed: isEnglish ? 'Request failed' : '请求失败',
    errorPrefix: isEnglish ? 'Sorry, an error occurred: ' : '抱歉，出错了：',
    networkError: isEnglish ? 'Something went wrong with the network' : '网络出了点问题',
    noResponseError: isEnglish 
      ? 'Sorry, I encountered some issues. Please try again.'
      : '抱歉，我遇到了一些问题，请再试一次。',
    uploadErrorTitle: isEnglish ? 'Resume upload failed 😔' : '抱歉，简历上传失败了 😔',
    uploadErrorReasons: isEnglish 
      ? 'Possible reasons:\n- Unsupported file format (please upload PDF, Word, image, or text file)\n- File too large (max 10MB)\n- Network issue\n\nPlease try again, or you can tell me about your situation directly~'
      : '可能的原因：\n- 文件格式不支持（请上传 PDF、Word、图片或文本文件）\n- 文件太大（最大 10MB）\n- 网络问题\n\n请重新尝试，或者直接告诉我你的情况也可以～',
    uploadedResume: isEnglish ? '📄 Uploaded resume: ' : '📄 上传简历：',
    resumeAnalysisPrompt: isEnglish 
      ? `I uploaded my resume, please help me analyze it:

Resume content:
{{content}}

Based on my resume, please help me:
1. Analyze my core strengths and advantages
2. Evaluate what types of positions suit me
3. Provide job-seeking advice`
      : `我上传了我的简历，请帮我分析一下：

简历内容：
{{content}}

请基于我的简历，帮我：
1. 分析我的核心能力和优势
2. 评估我适合什么类型的岗位
3. 给出求职建议`,
  };

  // 是否已开始对话
  const hasStarted = messages.length > 0;

  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // 自动调整输入框高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  // 发送消息
  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const assistantMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const messageHistory = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      messageHistory.push({ role: 'user', content: content.trim() });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messageHistory }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: texts.requestFailed }));
        throw new Error(errorData.error || texts.requestFailed);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('无法读取响应');

      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                fullContent += parsed.content;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessage.id ? { ...m, content: normalizeAssistantContent(fullContent) } : m
                  )
                );
              }
            } catch {}
          }
        }
      }

      if (!fullContent) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id ? { ...m, content: texts.noResponseError } : m
          )
        );
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = error instanceof Error ? error.message : texts.networkError;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessage.id ? { ...m, content: `${texts.errorPrefix}${errorMsg}` } : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 上传简历
  const handleUploadResume = async (file: File) => {
    setIsUploading(true);

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: `${texts.uploadedResume}${file.name}`,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/resume', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error('上传失败详情:', data);
        throw new Error(data.message || data.error || (isEnglish ? 'Upload failed' : '上传失败'));
      }

      const analysisPrompt = texts.resumeAnalysisPrompt.replace('{{content}}', data.content);

      await sendMessage(analysisPrompt);
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: texts.uploadErrorReasons,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsUploading(false);
    }
  };

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUploadResume(file);
    e.target.value = '';
  };

  // 处理快捷问题点击
  const handleQuickAction = (item: (typeof QUICK_QUESTIONS)[0]) => {
    if (item.isUpload) {
      fileInputRef.current?.click();
    } else {
      sendMessage(item.prompt);
    }
  };

  // 处理输入提交
  const handleSubmit = () => {
    if (input.trim()) sendMessage(input);
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // 重新开始
  const handleRestart = () => {
    setMessages([]);
    setInput('');
  };

  return (
    <div className="chat-page">
      {/* 隐藏的文件上传input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Ambient Background */}
      <div className="bg-ambient">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
      <div className="grid-overlay"></div>

      {/* App Layout */}
      <div className="app-layout">
        {/* Chat Area */}
        <div className="chat-area">
          <div className="chat-content">
            {!hasStarted ? (
              /* Welcome Block */
              <>
                <div className="welcome">
                  <Image
                    src="/logo.png"
                    alt="够得着"
                    width={64}
                    height={64}
                    className="welcome-icon"
                  />
                  <h2>{texts.welcomeTitle}</h2>
                  <p>{texts.welcomeDesc}</p>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions">
                  {QUICK_QUESTIONS.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(item)}
                      disabled={isLoading || isUploading}
                      className="action-card"
                    >
                      <div className="action-header">
                        <div className="action-icon" data-index={index}>
                          {item.icon}
                        </div>
                        <div className="action-title">{item.title}</div>
                      </div>
                      <div className="action-desc">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              /* Messages */
              <div className="messages">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`msg ${message.role === 'user' ? 'msg-user' : 'msg-ai'}`}
                  >
                    {message.role === 'assistant' ? (
                      <Image
                        src="/logo.png"
                        alt="够得着"
                        width={32}
                        height={32}
                        className="msg-avatar"
                      />
                    ) : (
                      <div className="msg-avatar user-avatar">{texts.userAvatar}</div>
                    )}
                    <div className="msg-bubble">
                      <div className="whitespace-pre-wrap break-words">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
                {(isLoading || isUploading) && (
                  <div className="msg msg-ai">
                    <Image
                      src="/logo.png"
                      alt="够得着"
                      width={32}
                      height={32}
                      className="msg-avatar"
                    />
                    <div className="msg-bubble">
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input Bar */}
        <div className="input-bar-wrapper">
          <div className="input-container">
            <div className="input-bar">
              <div className="input-area">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || isUploading}
                  className="upload-btn"
                  title={texts.uploadTitle}
                >
                  <FileText className="h-4 w-4" />
                </button>
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={texts.inputPlaceholder}
                  disabled={isLoading || isUploading}
                  className="input-field"
                  rows={1}
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={!input.trim() || isLoading || isUploading}
                className="send-btn"
                title={texts.sendTitle}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <div className="input-hint">
              {texts.inputHint}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .chat-page {
          --primary: #0A6E5C;
          --primary-light: #0D9B7A;
          --primary-glow: rgba(13,155,122,0.25);
          --accent: #FF6B35;
          --dark: #0B1215;
          --dark-raised: #0F1A1E;
          --dark-card: #132025;
          --dark-input: #1A2B32;
          --card-border: rgba(255,255,255,0.06);
          --card-border-hover: rgba(255,255,255,0.12);
          --text-primary: #F0F0F0;
          --text-secondary: #8A9BA8;
          --text-dim: #546370;

          font-family: 'Noto Sans SC', 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          background: var(--dark);
          color: var(--text-primary);
          height: calc(100vh - 72px);
          min-height: calc(100vh - 72px);
          overflow: hidden;
          -webkit-font-smoothing: antialiased;
        }

        /* ═══════ AMBIENT BG ═══════ */
        .bg-ambient {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .bg-ambient .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(130px);
          opacity: 0.12;
        }
        .orb-1 {
          width: 500px;
          height: 500px;
          background: var(--primary);
          top: -8%;
          left: -4%;
          animation: float-orb 18s ease-in-out infinite;
        }
        .orb-2 {
          width: 400px;
          height: 400px;
          background: var(--accent);
          bottom: -12%;
          right: -6%;
          animation: float-orb 22s ease-in-out infinite reverse;
        }
        .orb-3 {
          width: 300px;
          height: 300px;
          background: #1a3a5c;
          top: 50%;
          left: 55%;
          animation: float-orb 15s ease-in-out infinite 3s;
        }
        @keyframes float-orb {
          0%, 100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(30px,-25px) scale(1.06); }
          66% { transform: translate(-15px,30px) scale(0.96); }
        }

        .bg-ambient::after {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          opacity: 0.5;
        }

        .grid-overlay {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image: linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: radial-gradient(ellipse 60% 50% at 50% 40%, black 20%, transparent 75%);
        }

        /* ═══════ LAYOUT ═══════ */
        .app-layout {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        /* ═══════ TOP NAV ═══════ */
        .top-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 32px;
          backdrop-filter: blur(20px);
          background: rgba(11,18,21,0.7);
          border-bottom: 1px solid var(--card-border);
          flex-shrink: 0;
          animation: fadeDown 0.6s ease-out;
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .back-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: 1px solid var(--card-border);
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          transition: all 0.3s;
        }
        .back-btn:hover {
          border-color: var(--card-border-hover);
          color: var(--text-primary);
          background: rgba(255,255,255,0.03);
        }

        .nav-logo {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          box-shadow: 0 0 16px var(--primary-glow);
        }
        .nav-info .nav-title {
          font-weight: 700;
          font-size: 15px;
          letter-spacing: -0.01em;
        }
        .nav-info .nav-sub {
          font-size: 11px;
          color: var(--text-dim);
          margin-top: 1px;
          letter-spacing: 0.04em;
        }

        .nav-right {
          display: flex;
          gap: 8px;
        }
        .nav-icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: 1px solid var(--card-border);
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }
        .nav-icon-btn:hover {
          border-color: var(--card-border-hover);
          color: var(--text-primary);
          background: rgba(255,255,255,0.03);
        }

        /* ═══════ CHAT AREA ═══════ */
        .chat-area {
          flex: 1;
          overflow-y: auto;
          padding: 32px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.08) transparent;
        }
        .chat-area::-webkit-scrollbar { width: 6px; }
        .chat-area::-webkit-scrollbar-track { background: transparent; }
        .chat-area::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }

        .chat-content {
          width: 100%;
          max-width: 720px;
          padding: 0 24px;
        }

        /* ═══════ WELCOME BLOCK ═══════ */
        .welcome {
          text-align: center;
          margin-bottom: 40px;
          animation: fadeUp 0.7s ease-out;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .welcome-icon {
          width: 64px;
          height: 64px;
          border-radius: 18px;
          margin: 0 auto 20px;
          background: linear-gradient(135deg, rgba(13,155,122,0.15), rgba(13,155,122,0.05));
          border: 1px solid rgba(13,155,122,0.2);
          padding: 12px;
          box-shadow: 0 0 30px rgba(13,155,122,0.1);
        }
        .welcome h2 {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
        }
        .welcome p {
          font-size: 14px;
          color: var(--text-secondary);
          font-weight: 300;
          line-height: 1.6;
        }

        /* ═══════ QUICK ACTION CARDS ═══════ */
        .quick-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 32px;
          animation: fadeUp 0.7s ease-out 0.15s both;
        }

        .action-card {
          padding: 20px;
          border-radius: 16px;
          background: var(--dark-card);
          border: 1px solid var(--card-border);
          cursor: pointer;
          transition: all 0.35s ease;
          position: relative;
          overflow: hidden;
          text-align: left;
        }
        .action-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1.5px;
          background: linear-gradient(90deg, transparent, var(--primary-light), transparent);
          opacity: 0;
          transition: opacity 0.35s;
        }
        .action-card:hover {
          transform: translateY(-2px);
          border-color: var(--card-border-hover);
          background: rgba(19,32,37,0.9);
          box-shadow: 0 12px 40px rgba(0,0,0,0.3);
        }
        .action-card:hover::before { opacity: 1; }
        .action-card:hover .action-icon { transform: scale(1.1); }

        .action-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }
        .action-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          transition: transform 0.35s;
          flex-shrink: 0;
        }
        .action-icon[data-index="0"] { background: rgba(13,155,122,0.12); }
        .action-icon[data-index="1"] { background: rgba(255,159,67,0.12); }
        .action-icon[data-index="2"] { background: rgba(99,140,255,0.12); }
        .action-icon[data-index="3"] { background: rgba(192,57,43,0.12); }

        .action-title {
          font-size: 15px;
          font-weight: 700;
          letter-spacing: -0.01em;
        }
        .action-desc {
          font-size: 12.5px;
          color: var(--text-dim);
          line-height: 1.55;
          padding-left: 52px;
          font-weight: 300;
        }

        /* ═══════ CHAT MESSAGES ═══════ */
        .messages {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding-bottom: 16px;
        }

        .msg {
          display: flex;
          gap: 12px;
          max-width: 92%;
          animation: msgIn 0.4s ease-out both;
        }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .msg-ai { align-self: flex-start; }
        .msg-user { align-self: flex-end; flex-direction: row-reverse; }

        .msg-avatar {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          flex-shrink: 0;
          box-shadow: 0 0 12px var(--primary-glow);
        }
        .msg-avatar.user-avatar {
          background: linear-gradient(135deg, #2a3a45, #3a4f5c);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          box-shadow: none;
        }

        .msg-bubble {
          padding: 14px 18px;
          border-radius: 16px;
          font-size: 14px;
          line-height: 1.7;
          font-weight: 400;
        }
        .msg-ai .msg-bubble {
          background: var(--dark-card);
          border: 1px solid var(--card-border);
          border-top-left-radius: 4px;
          color: var(--text-primary);
        }
        .msg-user .msg-bubble {
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          color: white;
          border-top-right-radius: 4px;
          box-shadow: 0 4px 20px var(--primary-glow);
        }

        /* typing indicator */
        .typing-dots {
          display: flex;
          gap: 5px;
          padding: 4px 0;
        }
        .typing-dots span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--text-dim);
          animation: blink 1.4s ease-in-out infinite;
        }
        .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes blink {
          0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
          30% { opacity: 1; transform: scale(1); }
        }

        /* ═══════ INPUT BAR ═══════ */
        .input-bar-wrapper {
          flex-shrink: 0;
          padding: 16px 24px 20px;
          backdrop-filter: blur(20px);
          background: rgba(11,18,21,0.7);
          border-top: 1px solid var(--card-border);
          display: flex;
          justify-content: center;
          animation: fadeUp 0.6s ease-out 0.3s both;
        }

        .input-container {
          width: 100%;
          max-width: 720px;
        }

        .input-bar {
          display: flex;
          align-items: flex-end;
          gap: 12px;
        }

        .input-area {
          flex: 1;
          background: var(--dark-input);
          border: 1px solid var(--card-border);
          border-radius: 16px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s;
        }
        .input-area:focus-within {
          border-color: rgba(13,155,122,0.4);
          box-shadow: 0 0 0 3px rgba(13,155,122,0.08);
        }

        .upload-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid var(--card-border);
          background: transparent;
          color: var(--text-dim);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          flex-shrink: 0;
        }
        .upload-btn:hover {
          color: var(--text-secondary);
          border-color: var(--card-border-hover);
        }

        .input-field {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-size: 14px;
          font-family: inherit;
          resize: none;
          line-height: 1.5;
          max-height: 120px;
        }
        .input-field::placeholder { color: var(--text-dim); }

        .send-btn {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          box-shadow: 0 4px 20px var(--primary-glow);
          flex-shrink: 0;
        }
        .send-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(13,155,122,0.4);
        }
        .send-btn:active { transform: scale(0.96); }
        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .input-hint {
          text-align: center;
          margin-top: 10px;
          font-size: 11px;
          color: var(--text-dim);
          letter-spacing: 0.02em;
        }

        /* ═══════ RESPONSIVE ═══════ */
        @media (max-width: 640px) {
          .top-nav { padding: 12px 16px; }
          .chat-content { padding: 0 16px; }
          .quick-actions { grid-template-columns: 1fr; }
          .input-bar-wrapper { padding: 12px 16px 16px; }
          .action-desc { padding-left: 0; margin-top: 4px; }
          .welcome h2 { font-size: 20px; }
        }
      `}</style>
    </div>
  );
}
