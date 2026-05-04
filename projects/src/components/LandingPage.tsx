'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Chat } from '@/components/chat/Chat';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';

export function LandingPage() {
  const [started, setStarted] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // 用户头像/登录按钮组件
  function UserButton() {
    if (isAuthenticated && user) {
      return (
        <Link href="/profile" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px 6px 6px',
          borderRadius: '24px',
          background: 'rgba(13,155,122,0.15)',
          border: '1px solid rgba(13,155,122,0.3)',
          textDecoration: 'none',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(13,155,122,0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(13,155,122,0.15)';
        }}
        >
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: user.avatar || '#0D9B7A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: '700',
            color: 'white',
          }}>
            {user.username.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontSize: '13px', color: '#4ECCA3', fontWeight: '500' }}>
            {user.username}
          </span>
        </Link>
      );
    }
    return (
      <Link href="/login" style={{
        padding: '8px 16px',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #0A6E5C, #0D9B7A)',
        color: 'white',
        fontSize: '13px',
        fontWeight: '600',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(13,155,122,0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      >
        登录
      </Link>
    );
  }

  if (started) {
    return <Chat onBack={() => setStarted(false)} />;
  }

  return (
    <>
      <Header />
      
      <div className="landing-page">
      {/* Ambient Background */}
      <div className="bg-ambient">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
      <div className="grid-overlay"></div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-badge">
          <span className="dot"></span>
          AI 驱动 · 为大学生求职而生
        </div>
        <h1>
          <span className="line-green">找到够得着的岗位</span><br />
          <span className="line-white">补上够不着的差距</span>
        </h1>
        <p className="hero-desc">
          不再盲目投递、不再妄自菲薄。用 AI 看清你的能力坐标，<br />找到最适合你的下一步。
        </p>
        <div className="hero-cta">
          <button onClick={() => setStarted(true)} className="btn-primary">
            开始能力定位
            <span className="btn-arrow">→</span>
          </button>
          <a href="#how" className="btn-secondary">了解运作方式</a>
        </div>
        <div className="scroll-hint">
          <span>Scroll</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* Features */}
      <section className="features" id="features">
        <div className="section-label">Core Features</div>
        <h2 className="section-title">五大核心能力，助你求职无忧</h2>
        <p className="section-desc">从迷茫到清晰，AI 帮你完成自我认知、岗位匹配和成长规划的完整闭环。</p>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <div className="feature-step">Step 01</div>
            <div className="feature-title">能力画像</div>
            <div className="feature-desc">通过轻松对话采集你的背景信息，AI 从 6 个维度生成精准的能力雷达图，让你看清自己的优势和短板。</div>
            <span className="feature-tag tag-green">六维度深度分析</span>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <div className="feature-step">Step 02</div>
            <div className="feature-title">岗位匹配</div>
            <div className="feature-desc">基于你的能力画像，智能推荐三类岗位：稳拿型、冲刺型、梦想型，每个都标注匹配度和能力差距。</div>
            <span className="feature-tag tag-yellow">🟢🟡🔴 三色分类</span>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🗺️</div>
            <div className="feature-step">Step 03</div>
            <div className="feature-title">成长计划</div>
            <div className="feature-desc">选定目标岗位后，AI 生成一份个性化提升路线图——学什么、做什么项目、多久能缩小差距。</div>
            <span className="feature-tag tag-orange">定制化行动路径</span>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <div className="feature-step">社区</div>
            <div className="feature-title">求职论坛</div>
            <div className="feature-desc">分享面试经历、交流求职心得，与同路人一起成长，不再孤单前行。</div>
            <span className="feature-tag tag-blue">面试经验分享</span>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <div className="feature-step">资源</div>
            <div className="feature-title">学习资源库</div>
            <div className="feature-desc">精心整理的学习路线和优质资源，助你系统提升求职竞争力。</div>
            <span className="feature-tag tag-purple">优质学习资料</span>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <div className="feature-step">AI</div>
            <div className="feature-title">智能对话</div>
            <div className="feature-desc">智谱GLM-5驱动，流式输出，像真人一样自然交流，随时随地解答你的求职疑惑。</div>
            <span className="feature-tag tag-green">大模型赋能</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works" id="how">
        <div className="section-label">How It Works</div>
        <h2 className="section-title">像和学长聊天一样简单</h2>
        <p className="section-desc" style={{ marginBottom: '48px' }}>不用填表，不用准备，打开就聊。</p>

        <div className="steps-timeline">
          <div className="step-item">
            <div className="step-dot"></div>
            <div className="step-label">01 — 聊一聊</div>
            <div className="step-title">告诉 AI 你的背景</div>
            <div className="step-desc">专业是什么、做过什么项目、有没有实习、对什么感兴趣……就像和朋友聊天，AI 会自然地引导你。</div>
          </div>
          <div className="step-item">
            <div className="step-dot"></div>
            <div className="step-label">02 — 看一看</div>
            <div className="step-title">获取你的能力画像</div>
            <div className="step-desc">AI 从技术硬技能、项目经验、行业认知、沟通表达、实习经历、学习潜力六个维度为你画像。</div>
          </div>
          <div className="step-item">
            <div className="step-dot"></div>
            <div className="step-label">03 — 选一选</div>
            <div className="step-title">找到你的目标岗位</div>
            <div className="step-desc">绿色稳拿、黄色冲刺、红色梦想——每个岗位的匹配度和差距一目了然。</div>
          </div>
          <div className="step-item">
            <div className="step-dot"></div>
            <div className="step-label">04 — 干起来</div>
            <div className="step-title">拿到你的行动地图</div>
            <div className="step-desc">针对目标岗位的专属提升计划，精确到该学什么课、做什么项目、花多少时间。</div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-num">6</div>
          <div className="stat-label">能力评估维度</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">20+</div>
          <div className="stat-label">精准岗位推荐</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">15+</div>
          <div className="stat-label">优质学习资源</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">社区</div>
          <div className="stat-label">面试经验分享</div>
        </div>
      </div>

      {/* CTA */}
      <section className="cta-section" id="start">
        <div className="cta-box">
          <h2>别让迷茫替你做决定</h2>
          <p>每一个「我不够格」的念头背后，都可能藏着一个够得着的机会。<br />花 5 分钟，让 AI 帮你看清。</p>
          <button onClick={() => setStarted(true)} className="btn-primary">
            立即开始
            <span className="btn-arrow">→</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p><span className="footer-brand">够得着 / Reachable</span> · 让每个努力都有方向 🚀</p>
      </footer>

      <style jsx global>{`
        .landing-page {
          --primary: #0A6E5C;
          --primary-light: #0D9B7A;
          --accent: #FF6B35;
          --accent-glow: #FF8F5E;
          --dark: #0B1215;
          --card-bg: rgba(255,255,255,0.04);
          --card-border: rgba(255,255,255,0.08);
          --text-primary: #F0F0F0;
          --text-secondary: #8A9BA8;
          --text-dim: #546370;
          --green-tag: #0D9B7A;
          --yellow-tag: #D4A017;
          --red-tag: #C0392B;

          font-family: 'Noto Sans SC', 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          background: var(--dark);
          color: var(--text-primary);
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
        }

        /* ═══════════ AMBIENT BACKGROUND ═══════════ */
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
          filter: blur(120px);
          opacity: 0.18;
        }
        .bg-ambient .orb-1 {
          width: 600px;
          height: 600px;
          background: var(--primary);
          top: -10%;
          left: -5%;
          animation: float-orb 18s ease-in-out infinite;
        }
        .bg-ambient .orb-2 {
          width: 500px;
          height: 500px;
          background: var(--accent);
          bottom: -15%;
          right: -8%;
          animation: float-orb 22s ease-in-out infinite reverse;
        }
        .bg-ambient .orb-3 {
          width: 350px;
          height: 350px;
          background: #1a3a5c;
          top: 40%;
          left: 50%;
          animation: float-orb 15s ease-in-out infinite 3s;
        }
        @keyframes float-orb {
          0%, 100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(40px,-30px) scale(1.08); }
          66% { transform: translate(-20px,40px) scale(0.95); }
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
          background-image:
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 80%);
        }

        /* ═══════════ HERO ═══════════ */
        .hero {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 120px 24px 80px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px 6px 8px;
          border-radius: 40px;
          background: rgba(13,155,122,0.1);
          border: 1px solid rgba(13,155,122,0.25);
          font-size: 13px;
          color: var(--primary-light);
          margin-bottom: 32px;
          animation: fade-up 0.8s ease-out 0.2s both;
        }
        .hero-badge .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--primary-light);
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .hero h1 {
          font-size: clamp(40px, 6vw, 72px);
          font-weight: 900;
          line-height: 1.15;
          letter-spacing: -0.03em;
          margin-bottom: 12px;
          animation: fade-up 0.8s ease-out 0.35s both;
        }
        .hero h1 .line-green {
          background: linear-gradient(135deg, var(--primary-light), #4ECCA3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero h1 .line-white {
          color: var(--text-primary);
        }

        .hero-desc {
          font-size: clamp(15px, 2vw, 18px);
          color: var(--text-secondary);
          max-width: 520px;
          line-height: 1.7;
          margin-bottom: 48px;
          font-weight: 300;
          animation: fade-up 0.8s ease-out 0.5s both;
        }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hero-cta {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
          animation: fade-up 0.8s ease-out 0.65s both;
        }
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 36px;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          color: white;
          border: none;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.35s ease;
          box-shadow: 0 4px 24px rgba(13,155,122,0.35), inset 0 1px 0 rgba(255,255,255,0.15);
          text-decoration: none;
          position: relative;
          overflow: hidden;
        }
        .btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.12));
          opacity: 0;
          transition: opacity 0.35s;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 36px rgba(13,155,122,0.45), inset 0 1px 0 rgba(255,255,255,0.15);
        }
        .btn-primary:hover::before { opacity: 1; }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 36px;
          background: transparent;
          color: var(--text-secondary);
          border: 1px solid var(--card-border);
          border-radius: 14px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.35s ease;
          text-decoration: none;
        }
        .btn-secondary:hover {
          color: var(--text-primary);
          border-color: rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.03);
        }

        .btn-arrow {
          display: inline-flex;
          transition: transform 0.35s;
        }
        .btn-primary:hover .btn-arrow { transform: translateX(3px); }

        /* ═══════════ SCROLL INDICATOR ═══════════ */
        .scroll-hint {
          position: absolute;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          animation: fade-up 0.8s ease-out 1s both;
        }
        .scroll-hint span {
          font-size: 11px;
          color: var(--text-dim);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .scroll-line {
          width: 1px;
          height: 32px;
          background: linear-gradient(to bottom, var(--text-dim), transparent);
          animation: scroll-pulse 2s ease-in-out infinite;
        }
        @keyframes scroll-pulse {
          0%, 100% { opacity: 1; height: 32px; }
          50% { opacity: 0.3; height: 20px; }
        }

        /* ═══════════ FEATURES SECTION ═══════════ */
        .features {
          position: relative;
          z-index: 1;
          padding: 120px 48px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .section-label {
          font-size: 12px;
          color: var(--primary-light);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 16px;
        }
        .section-title {
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 16px;
        }
        .section-desc {
          font-size: 16px;
          color: var(--text-secondary);
          max-width: 500px;
          line-height: 1.7;
          font-weight: 300;
          margin-bottom: 64px;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .feature-card {
          padding: 32px 28px;
          border-radius: 20px;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
          opacity: 0;
          transform: translateY(40px);
          animation: card-in 0.7s ease-out forwards;
        }
        .feature-card:nth-child(1) { animation-delay: 0.1s; }
        .feature-card:nth-child(2) { animation-delay: 0.2s; }
        .feature-card:nth-child(3) { animation-delay: 0.3s; }
        .feature-card:nth-child(4) { animation-delay: 0.4s; }
        .feature-card:nth-child(5) { animation-delay: 0.5s; }
        .feature-card:nth-child(6) { animation-delay: 0.6s; }
        @keyframes card-in {
          to { opacity: 1; transform: translateY(0); }
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--primary-light), transparent);
          opacity: 0;
          transition: opacity 0.4s;
        }
        .feature-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.06);
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .feature-card:hover::before { opacity: 1; }

        .feature-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
        .feature-card:nth-child(1) .feature-icon { background: rgba(13,155,122,0.12); }
        .feature-card:nth-child(2) .feature-icon { background: rgba(212,160,23,0.12); }
        .feature-card:nth-child(3) .feature-icon { background: rgba(255,107,53,0.12); }

        .feature-step {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-dim);
          margin-bottom: 12px;
          font-weight: 600;
        }
        .feature-title {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 12px;
          letter-spacing: -0.01em;
        }
        .feature-desc {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.7;
          font-weight: 300;
        }

        .feature-tag {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          margin-top: 20px;
        }
        .tag-green { background: rgba(13,155,122,0.15); color: var(--green-tag); }
        .tag-yellow { background: rgba(212,160,23,0.15); color: var(--yellow-tag); }
        .tag-orange { background: rgba(255,107,53,0.15); color: var(--accent); }

        /* ═══════════ HOW IT WORKS ═══════════ */
        .how-it-works {
          position: relative;
          z-index: 1;
          padding: 100px 48px 120px;
          max-width: 900px;
          margin: 0 auto;
        }

        .steps-timeline {
          position: relative;
          padding-left: 40px;
        }
        .steps-timeline::before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 15px;
          width: 1px;
          background: linear-gradient(to bottom, var(--primary-light), var(--primary), transparent);
        }

        .step-item {
          position: relative;
          margin-bottom: 56px;
          opacity: 0;
          transform: translateX(-20px);
          animation: step-in 0.6s ease-out forwards;
        }
        .step-item:nth-child(1) { animation-delay: 0.1s; }
        .step-item:nth-child(2) { animation-delay: 0.3s; }
        .step-item:nth-child(3) { animation-delay: 0.5s; }
        .step-item:nth-child(4) { animation-delay: 0.7s; }
        @keyframes step-in {
          to { opacity: 1; transform: translateX(0); }
        }

        .step-dot {
          position: absolute;
          left: -40px;
          top: 4px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid var(--primary-light);
          background: var(--dark);
        }
        .step-item:first-child .step-dot {
          background: var(--primary-light);
          box-shadow: 0 0 12px rgba(13,155,122,0.5);
        }

        .step-label {
          font-size: 12px;
          color: var(--primary-light);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 6px;
        }
        .step-title {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .step-desc {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.7;
          max-width: 600px;
        }

        /* ═══════════ STATS BAR ═══════════ */
        .stats-bar {
          position: relative;
          z-index: 1;
          padding: 64px 48px;
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          gap: 80px;
          border-top: 1px solid var(--card-border);
          border-bottom: 1px solid var(--card-border);
        }
        .stat-item { text-align: center; }
        .stat-num {
          font-size: 42px;
          font-weight: 900;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, var(--primary-light), #4ECCA3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .stat-label {
          font-size: 13px;
          color: var(--text-dim);
          margin-top: 6px;
          font-weight: 400;
        }

        /* ═══════════ CTA SECTION ═══════════ */
        .cta-section {
          position: relative;
          z-index: 1;
          padding: 120px 48px;
          text-align: center;
        }
        .cta-box {
          max-width: 680px;
          margin: 0 auto;
          padding: 64px 48px;
          border-radius: 28px;
          background: linear-gradient(135deg, rgba(13,155,122,0.08), rgba(255,107,53,0.04));
          border: 1px solid rgba(13,155,122,0.15);
          position: relative;
          overflow: hidden;
        }
        .cta-box::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at 30% 30%, rgba(13,155,122,0.06), transparent 50%);
          animation: rotate-slow 20s linear infinite;
        }
        @keyframes rotate-slow {
          to { transform: rotate(360deg); }
        }

        .cta-box h2 {
          position: relative;
          font-size: clamp(24px, 3.5vw, 36px);
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 16px;
        }
        .cta-box p {
          position: relative;
          font-size: 15px;
          color: var(--text-secondary);
          margin-bottom: 36px;
          line-height: 1.7;
        }
        .cta-box .btn-primary { position: relative; }

        /* ═══════════ FOOTER ═══════════ */
        footer {
          position: relative;
          z-index: 1;
          padding: 40px 48px;
          text-align: center;
          border-top: 1px solid var(--card-border);
        }
        footer p {
          font-size: 13px;
          color: var(--text-dim);
        }
        footer .footer-brand {
          font-weight: 700;
          color: var(--text-secondary);
        }

        /* ═══════════ RESPONSIVE ═══════════ */
        @media (max-width: 768px) {
          .hero { padding: 100px 20px 60px; }
          .features { padding: 80px 20px; }
          .feature-grid { grid-template-columns: 1fr; gap: 16px; }
          .how-it-works { padding: 60px 20px; }
          .stats-bar { flex-direction: column; gap: 32px; padding: 48px 20px; }
          .cta-section { padding: 80px 20px; }
          .cta-box { padding: 40px 24px; }
          footer { padding: 32px 20px; }
        }
      `}</style>
    </div>
    </>
  );
}
