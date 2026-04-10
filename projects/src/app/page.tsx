'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        :root {
          --bg-primary: #0a0a0f;
          --bg-secondary: #111118;
          --text-primary: #ffffff;
          --text-secondary: #94a3b8;
          --accent: #818cf8;
          --accent-secondary: #c084fc;
          --card-bg: rgba(17, 17, 24, 0.8);
          --card-border: rgba(255, 255, 255, 0.08);
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: var(--bg-primary);
          color: var(--text-primary);
          min-height: 100vh;
          overflow-x: hidden;
        }
        
        .hero-section {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          position: relative;
          overflow: hidden;
        }
        
        .gradient-bg {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.3), transparent),
            radial-gradient(ellipse 60% 40% at 80% 50%, rgba(192, 132, 252, 0.15), transparent),
            radial-gradient(ellipse 60% 40% at 20% 80%, rgba(129, 140, 248, 0.15), transparent);
          pointer-events: none;
        }
        
        .noise-overlay {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          opacity: 0.03;
          pointer-events: none;
        }
        
        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 20px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .nav-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .logo-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--accent), var(--accent-secondary));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }
        
        .brand-name {
          font-size: 20px;
          font-weight: 700;
          background: linear-gradient(135deg, var(--accent), var(--accent-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .nav-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .nav-link {
          padding: 8px 16px;
          border-radius: 8px;
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        
        .nav-link:hover {
          color: var(--text-primary);
          background: var(--card-bg);
        }
        
        .nav-link-lang {
          padding: 8px 16px;
          border-radius: 8px;
          color: var(--accent);
          font-size: 14px;
          font-weight: 600;
          border: 1px solid var(--accent);
          transition: all 0.3s ease;
          text-decoration: none;
        }
        
        .nav-link-lang:hover {
          background: var(--accent);
          color: white;
        }
        
        .hero-content {
          text-align: center;
          max-width: 900px;
          position: relative;
          z-index: 1;
        }
        
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 50px;
          background: rgba(129, 140, 248, 0.1);
          border: 1px solid rgba(129, 140, 248, 0.2);
          color: var(--accent);
          font-size: 14px;
          margin-bottom: 32px;
        }
        
        .hero-title {
          font-size: 64px;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 24px;
          background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .hero-subtitle {
          font-size: 20px;
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: 48px;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .hero-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .btn {
          padding: 14px 32px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, var(--accent), var(--accent-secondary));
          color: white;
          border: none;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(129, 140, 248, 0.4);
        }
        
        .btn-secondary {
          background: var(--card-bg);
          color: var(--text-primary);
          border: 1px solid var(--card-border);
        }
        
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .stats-bar {
          display: flex;
          gap: 48px;
          justify-content: center;
          margin-top: 80px;
          padding: 32px 48px;
          background: var(--card-bg);
          border-radius: 20px;
          border: 1px solid var(--card-border);
          position: relative;
          z-index: 1;
        }
        
        .stat-item {
          text-align: center;
        }
        
        .stat-num {
          font-size: 36px;
          font-weight: 800;
          background: linear-gradient(135deg, var(--accent), var(--accent-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .stat-label {
          font-size: 14px;
          color: var(--text-secondary);
          margin-top: 4px;
        }
        
        .features-section {
          padding: 120px 40px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 64px;
        }
        
        .section-label {
          font-size: 14px;
          color: var(--accent);
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        
        .section-title {
          font-size: 48px;
          font-weight: 800;
          margin-bottom: 16px;
        }
        
        .section-desc {
          font-size: 18px;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
        }
        
        .features-grid {
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
        
        .feature-card:hover {
          transform: translateY(-8px);
          border-color: rgba(129, 140, 248, 0.3);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        .feature-icon {
          font-size: 40px;
          margin-bottom: 20px;
        }
        
        .feature-step {
          font-size: 12px;
          color: var(--accent);
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        
        .feature-title {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 12px;
        }
        
        .feature-desc {
          font-size: 15px;
          color: var(--text-secondary);
          line-height: 1.7;
        }
        
        .feature-tag {
          display: inline-block;
          margin-top: 16px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .tag-green { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
        .tag-yellow { background: rgba(234, 179, 8, 0.1); color: #eab308; }
        .tag-orange { background: rgba(249, 115, 22, 0.1); color: #f97316; }
        .tag-blue { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
        .tag-purple { background: rgba(168, 85, 247, 0.1); color: #a855f7; }
        
        .cta-section {
          padding: 120px 40px;
          text-align: center;
        }
        
        .cta-box {
          max-width: 800px;
          margin: 0 auto;
          padding: 64px;
          background: linear-gradient(135deg, rgba(129, 140, 248, 0.1), rgba(192, 132, 252, 0.1));
          border-radius: 32px;
          border: 1px solid rgba(129, 140, 248, 0.2);
        }
        
        .cta-title {
          font-size: 40px;
          font-weight: 800;
          margin-bottom: 16px;
        }
        
        .cta-desc {
          font-size: 18px;
          color: var(--text-secondary);
          margin-bottom: 32px;
        }
        
        .footer {
          padding: 40px;
          text-align: center;
          color: var(--text-secondary);
          font-size: 14px;
          border-top: 1px solid var(--card-border);
        }
        
        @keyframes card-in {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 768px) {
          .hero-title { font-size: 40px; }
          .features-grid { grid-template-columns: 1fr; }
          .stats-bar { flex-wrap: wrap; gap: 32px; }
          .nav { padding: 16px 20px; }
        }
      `}</style>

      {/* Navigation */}
      <nav className="nav">
        <div className="nav-brand">
          <div className="logo-icon">R</div>
          <span className="brand-name">Reachable</span>
        </div>
        <div className="nav-links">
          <Link href="/en/forum" className="nav-link">Forum</Link>
          <Link href="/en/resources" className="nav-link">Resources</Link>
          <Link href="/zh" className="nav-link-lang">中文</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="gradient-bg"></div>
        <div className="noise-overlay"></div>
        
        <div className="hero-content">
          <div className="hero-badge">
            AI-Powered Career Positioning
          </div>
          
          <h1 className="hero-title">
            Know Your Worth.<br />Find Your Path.
          </h1>
          
          <p className="hero-subtitle">
            An AI career assistant designed for students and graduates. 
            Discover your strengths, match with perfect jobs, and build a personalized growth plan.
          </p>
          
          <div className="hero-actions">
            <Link href="/en/chat" className="btn btn-primary">
              Start Now
            </Link>
            <Link href="/en/forum" className="btn btn-secondary">
              Join Forum
            </Link>
          </div>
          
          <div className="stats-bar">
            <div className="stat-item">
              <div className="stat-num">6</div>
              <div className="stat-label">Ability Dimensions</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">20+</div>
              <div className="stat-label">Job Matches</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">15+</div>
              <div className="stat-label">Learning Resources</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">Community</div>
              <div className="stat-label">Interview Sharing</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <div className="section-label">Core Features</div>
          <h2 className="section-title">Six Powerful Features for Your Career</h2>
          <p className="section-desc">
            From self-discovery to job preparation, AI helps you complete the full cycle of career positioning.
          </p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <div className="feature-step">Step 01</div>
            <div className="feature-title">Ability Profile</div>
            <div className="feature-desc">
              Through conversational interaction, AI generates a precise ability radar chart across 6 dimensions, helping you understand your strengths and weaknesses.
            </div>
            <span className="feature-tag tag-green">6-Dimension Analysis</span>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <div className="feature-step">Step 02</div>
            <div className="feature-title">Job Matching</div>
            <div className="feature-desc">
              Based on your ability profile, intelligently recommend three types of positions: Safe Bets, Stretch Goals, and Dream Jobs, each with match scores.
            </div>
            <span className="feature-tag tag-yellow">🟢🟡🔴 Three-Level Classification</span>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🗺️</div>
            <div className="feature-step">Step 03</div>
            <div className="feature-title">Growth Plan</div>
            <div className="feature-desc">
              After selecting your target position, AI generates a personalized improvement roadmap — what to learn, what projects to build, and how long to bridge the gap.
            </div>
            <span className="feature-tag tag-orange">Customized Action Path</span>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <div className="feature-step">Community</div>
            <div className="feature-title">Career Forum</div>
            <div className="feature-desc">
              Share interview experiences, discuss career insights, and grow together with peers on the same journey.
            </div>
            <span className="feature-tag tag-blue">Interview Experience</span>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <div className="feature-step">Resources</div>
            <div className="feature-title">Learning Library</div>
            <div className="feature-desc">
              Carefully curated learning paths and quality resources to help you systematically improve your job-hunting competitiveness.
            </div>
            <span className="feature-tag tag-purple">Quality Study Materials</span>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <div className="feature-step">AI</div>
            <div className="feature-title">Smart Chat</div>
            <div className="feature-desc">
              Powered by Zhipu GLM-5 with streaming output, natural communication like talking to a real person, answering your career questions anytime.
            </div>
            <span className="feature-tag tag-green">LLM Powered</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-box">
          <h2 className="cta-title">Ready to Find Your Path?</h2>
          <p className="cta-desc">
            Start your career positioning journey today and discover opportunities within reach.
          </p>
          <Link href="/en/chat" className="btn btn-primary">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>Reachable - AI Career Positioning Assistant</p>
      </footer>
    </>
  );
}
