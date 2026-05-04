'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getSafeExternalUrl } from '@/lib/url';
import { useAuth } from '@/context/AuthContext';
import { getClientKey } from '@/lib/client-key';
import {
  ArrowLeft, Building2, MapPin, Clock, Briefcase, 
  GraduationCap, ExternalLink, ChevronRight, Eye, Loader2, Sparkles,
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary_text?: string;
  category: string;
  tags?: string;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  job_type: string;
  education?: string;
  experience?: string;
  official_url?: string;
  publish_date: string;
  views: number;
}

interface RelatedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary_text?: string;
  category: string;
}

// 公司emoji映射
const COMPANY_EMOJI: Record<string, string> = {
  bytedance: '🎵',
  tencent: '💬',
  alibaba: '🛒',
  ByteDance: '🎵',
  Tencent: '💬',
  Alibaba: '🛒',
};

const getCompanyEmoji = (code: string): string => {
  return COMPANY_EMOJI[code] || COMPANY_EMOJI[code.toLowerCase()] || '🏢';
};

const getCompanyName = (code: string): string => {
  const map: Record<string, string> = {
    bytedance: 'ByteDance',
    tencent: 'Tencent',
    alibaba: 'Alibaba',
    'ByteDance': 'ByteDance',
    'Tencent': 'Tencent',
    'Alibaba': 'Alibaba',
  };
  return map[code] || code;
};

// 翻译函数
const translateTitle = (title: string): string => {
  const titleMap: Record<string, string> = {
    '前端开发工程师': 'Frontend Engineer',
    '后端开发工程师': 'Backend Engineer',
    'Java开发工程师': 'Java Engineer',
    '算法工程师': 'Algorithm Engineer',
    '数据分析师': 'Data Analyst',
    '数据研发工程师': 'Data Engineer',
    '产品经理': 'Product Manager',
    '数据产品经理': 'Data Product Manager',
    '运营专员': 'Operations Specialist',
    '内容运营': 'Content Operations',
    '用户运营': 'User Operations',
    '前端实习': 'Frontend Intern',
    '后端实习': 'Backend Intern',
    '算法实习': 'Algorithm Intern',
    '- TikTok': ' - TikTok',
    '- 抖音': ' - TikTok',
    '- 飞书': ' - Lark',
    '- 微信': ' - WeChat',
    '- QQ': ' - QQ',
    '- 腾讯云': ' - Tencent Cloud',
    '- 腾讯视频': ' - Tencent Video',
    '- 腾讯新闻': ' - Tencent News',
    '- 微信支付': ' - WeChat Pay',
    '- 淘宝': ' - Taobao',
    '- 钉钉': ' - DingTalk',
    '- 阿里云': ' - Alibaba Cloud',
    '- 饿了么': ' - Ele.me',
    '- 淘宝直播': ' - Taobao Live',
    '- 蚂蚁金服': ' - Ant Group',
  };
  
  let translated = title;
  for (const [cn, en] of Object.entries(titleMap)) {
    translated = translated.split(cn).join(en);
  }
  return translated;
};

const translateLocation = (location: string): string => {
  const map: Record<string, string> = {
    '北京': 'Beijing',
    '上海': 'Shanghai',
    '杭州': 'Hangzhou',
    '深圳': 'Shenzhen',
    '广州': 'Guangzhou',
    '成都': 'Chengdu',
    '武汉': 'Wuhan',
    '南京': 'Nanjing',
    '西安': 'Xi\'an',
  };
  return map[location] || location;
};

const getCategoryLabel = (category: string): string => {
  const map: Record<string, string> = {
    frontend: 'Frontend',
    backend: 'Backend',
    algorithm: 'Algorithm',
    operation: 'Operations',
    product: 'Product',
    data: 'Data',
    '前端': 'Frontend',
    '后端': 'Backend',
    '算法': 'Algorithm',
    '运营': 'Operations',
    '产品': 'Product',
    '数据': 'Data',
  };
  return map[category] || category;
};

const getJobTypeLabel = (jobType: string): string => {
  const map: Record<string, string> = {
    fulltime: 'Full-time',
    internship: 'Internship',
    '全职': 'Full-time',
    '实习': 'Internship',
  };
  return map[jobType] || jobType;
};

const getEducationLabel = (education?: string): string => {
  const map: Record<string, string> = {
    '本科及以上': 'Bachelor\'s Degree+',
    '硕士及以上': 'Master\'s Degree+',
    '博士': 'PhD',
    '学历不限': 'No requirement',
    '本科及以上在读': 'Undergraduate Student',
    '硕士及以上在读': 'Graduate Student',
  };
  return education ? (map[education] || education) : '';
};

const getExperienceLabel = (experience: string): string => {
  const map: Record<string, string> = {
    '3-5年': '3-5 years',
    '2-5年': '2-5 years',
    '2-4年': '2-4 years',
    '1-3年': '1-3 years',
    '应届/在校': 'Fresh Graduate/Student',
  };
  return map[experience] || experience;
};

const translateText = (text: string): string => {
  if (!text) return '';
  
  const replacements: Record<string, string> = {
    // 工作职责
    '负责': 'Responsible for',
    '参与': 'Participate in',
    '构建': 'Building',
    '设计': 'Designing',
    '优化': 'Optimizing',
    '管理': 'Managing',
    '分析': 'Analyzing',
    '策划': 'Planning',
    '开发': 'Developing',
    '实现': 'Implementing',
    '提升': 'Improving',
    '推动': 'Driving',
    '支撑': 'Supporting',
    '打造': 'Creating',
    '探索': 'Exploring',
    '跟踪': 'Tracking',
    '撰写': 'Writing',
    '孵化': 'Nurturing',
    '赋能': 'Empowering',
    '保障': 'Ensuring',
    '验证': 'Verifying',
    '建模': 'Modeling',
    '评估': 'Evaluating',
    '落地': 'Implementing',
    
    // 名词
    '产品': 'product',
    '系统': 'system',
    '服务': 'service',
    '平台': 'platform',
    '用户': 'users',
    '业务': 'business',
    '技术': 'technology',
    '团队': 'team',
    '性能': 'performance',
    '体验': 'experience',
    '质量': 'quality',
    '效率': 'efficiency',
    '能力': 'ability',
    '岗位': 'position',
    '工作': 'work',
    '核心': 'core',
    '相关': 'related',
    '经验': 'experience',
    '要求': 'requirement',
    '需求': 'requirements',
    '指标': 'metrics',
    '增长': 'growth',
    '价值': 'value',
    '方案': 'solution',
    '规范': 'standards',
    '实践': 'practices',
    '体系': 'system',
    '专题': 'topic/feature',
    '热点': 'trending topics',
    '事件': 'events',
    '内容': 'content',
    '策略': 'strategy',
    '效果': 'results',
    '流程': 'process',
    
    // 职位要求
    '硕士及以上': 'Master\'s degree or above',
    '本科及以上': 'Bachelor\'s degree or above',
    '学历不限': 'No education requirement',
    '精通': 'Proficient in',
    '熟悉': 'Familiar with',
    '了解': 'Understanding of',
    '具有': 'Have',
    '具备': 'Possess',
    '优先': 'preferred',
    '年以上': 'years or above',
    '计算机': 'Computer Science',
    '专业': 'major',
    '良好的': 'good',
    '沟通能力': 'communication skills',
    '团队协作': 'teamwork spirit',
    '逻辑思维': 'logical thinking',
    '互联网': 'Internet',
    '大型': 'large-scale',
    '分布式': 'distributed',
    '高并发': 'high-concurrency',
    '扎实': 'solid',
    '理论基础': 'theoretical foundation',
    '具备良好': 'possess good',
    
    // 公司名称
    '字节跳动': 'ByteDance',
    '腾讯': 'Tencent',
    '阿里巴巴': 'Alibaba',
    '抖音': 'TikTok/Douyin',
    '飞书': 'Lark',
    '微信': 'WeChat',
    '淘宝': 'Taobao',
    '钉钉': 'DingTalk',
    '饿了么': 'Ele.me',
    '蚂蚁金服': 'Ant Group',
    '阿里云': 'Alibaba Cloud',
    '腾讯云': 'Tencent Cloud',
    '腾讯视频': 'Tencent Video',
    '腾讯新闻': 'Tencent News',
    '微信支付': 'WeChat Pay',
    '淘宝直播': 'Taobao Live',
    '大促': 'major sales events',
    '双十一': 'Singles Day',
    
    // 技能
    '机器学习': 'Machine Learning',
    '深度学习': 'Deep Learning',
    '推荐算法': 'Recommendation Algorithms',
    '数据分析': 'Data Analysis',
    '自然语言处理': 'NLP',
    '计算机视觉': 'Computer Vision',
    '分布式系统': 'Distributed Systems',
    '微服务': 'Microservices',
    '前端工程化': 'Frontend Engineering',
    '前端': 'Frontend',
    '后端': 'Backend',
    '算法': 'Algorithm',
    '运营': 'Operations',
    '数据': 'Data',
    '人工智能': 'AI',
    '强化学习': 'Reinforcement Learning',
    '游戏AI': 'Game AI',
    '搜索推荐': 'Search & Recommendation',
    '搜索排序': 'Search Ranking',
    '意图理解': 'Intent Recognition',
    '个性化推荐': 'Personalized Recommendation',
    '商品搜索': 'Product Search',
    '电商': 'e-commerce',
    'B端': 'B2B',
    '企业级': 'enterprise-level',
    '企业协作': 'enterprise collaboration',
    '跨端': 'cross-platform',
    
    // 工具和框架
    'TensorFlow': 'TensorFlow',
    'PyTorch': 'PyTorch',
    'Spring': 'Spring',
    'Spring Boot': 'Spring Boot',
    'Spring Cloud': 'Spring Cloud',
    'Hadoop': 'Hadoop',
    'Spark': 'Spark',
    'Flink': 'Flink',
    'Kafka': 'Kafka',
    'Redis': 'Redis',
    'MySQL': 'MySQL',
    'MongoDB': 'MongoDB',
    'Vue': 'Vue',
    'React': 'React',
    'TypeScript': 'TypeScript',
    'JavaScript': 'JavaScript',
    'HTML': 'HTML',
    'CSS': 'CSS',
    'Node.js': 'Node.js',
    'Go': 'Go',
    'Python': 'Python',
    'Java': 'Java',
    'C++': 'C++',
    'Kubernetes': 'Kubernetes',
    'Docker': 'Docker',
    'K8s': 'K8s',
    'Linux': 'Linux',
    'SQL': 'SQL',
    'NoSQL': 'NoSQL',
    'API': 'API',
    'REST': 'REST',
    'GraphQL': 'GraphQL',
    'AB测试': 'A/B Testing',
    'CI/CD': 'CI/CD',
    'DevOps': 'DevOps',
    'Git': 'Git',
    'GitHub': 'GitHub',
    'Webpack': 'Webpack',
    'Vite': 'Vite',
    'Tailwind': 'Tailwind CSS',
    'Next.js': 'Next.js',
    'Nest.js': 'Nest.js',
    
    // 其他
    '如': 'such as',
    '等': 'etc.',
    '包括': 'including',
    '尤其': 'especially',
    '研究': 'research',
    '学习': 'learning',
    '研发': 'R&D',
    '前沿': 'cutting-edge',
    '金融': 'financial',
    '金融科技': 'FinTech',
    '金融风控': 'financial risk control',
    '智能': 'intelligent',
    '客服': 'customer service',
    '风控': 'risk control',
    '科技': 'technology',
    '架构': 'architecture',
    '存储': 'storage',
    '计算': 'computing',
    '安全': 'security',
    '运维': 'operations',
    '测试': 'testing',
    '监控': 'monitoring',
    '日志': 'logging',
    '文档': 'documentation',
    '论文': 'papers',
    '分享': 'sharing',
    '实习时间': 'internship duration',
    '实习': 'internship',
    '全职': 'full-time',
    '月薪': 'monthly salary',
    '年薪': 'annual salary',
    '薪资': 'salary',
    '不低于': 'no less than',
    '月': 'month',
    '校招': 'campus recruitment',
    '社招': 'social recruitment',
    '应届': 'fresh graduate',
    '在校': 'student',
    '在读': 'enrolled',
    '本科生': 'undergraduate',
    '研究生': 'graduate student',
    '博士生': 'PhD student',
    '最短': 'minimum',
    '不少于': 'at least',
    '数学': 'mathematics',
    '统计学': 'statistics',
    '新闻传播': 'journalism and communication',
    '文字功底': 'writing skills',
    '热点敏感': 'sensitive to trends',
    '创业精神': 'entrepreneurial spirit',
    '结果导向': 'results-oriented',
    '协同': 'collaboration',
    'ROA': 'ROA',
    'OKR': 'OKR',
    'OK': 'OK',
  };

  let translated = text;
  // 按键长度降序排序，避免部分匹配问题
  const sortedKeys = Object.keys(replacements).sort((a, b) => b.length - a.length);
  
  for (const key of sortedKeys) {
    translated = translated.split(key).join(replacements[key]);
  }
  
  return translated;
};

const CATEGORY_COLORS: Record<string, string> = {
  frontend: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  backend: 'bg-green-500/10 text-green-400 border-green-500/30',
  algorithm: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  operation: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  product: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
  data: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
};

export default function EnglishJobDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [relatedJobs, setRelatedJobs] = useState<RelatedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [trackerMessage, setTrackerMessage] = useState('');
  const [fitResult, setFitResult] = useState<null | { score: number; summary: string; strengths: string[]; gaps: string[]; next_steps: string[] }>(null);
  const [actorKey, setActorKey] = useState('anonymous');
  const safeOfficialUrl = getSafeExternalUrl(job?.official_url);

  useEffect(() => {
    setActorKey(user?.id || getClientKey());
  }, [user?.id]);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${params.id}?lang=en`);
        const data = await res.json();
        if (data.success) {
          setJob(data.data);
          setRelatedJobs(data.relatedJobs || []);
        }
      } catch (error) {
        console.error('Failed to fetch job:', error);
      }
      setLoading(false);
    };
    if (params.id) {
      fetchJob();
    }
  }, [params.id]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const saveToTracker = async () => {
    if (!job) return;
    setSaving(true);
    setTrackerMessage('');
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-key': actorKey,
        },
        body: JSON.stringify({
          job_id: job.id,
          title: translateTitle(job.title),
          company: getCompanyName(job.company),
          location: translateLocation(job.location),
          source_url: safeOfficialUrl || '',
          status: 'saved',
          notes: '',
        }),
      });
      const payload = await response.json();
      setTrackerMessage(payload.success ? 'Saved to tracker.' : 'Could not save this role.');
    } catch {
      setTrackerMessage('Could not save this role.');
    } finally {
      setSaving(false);
    }
  };

  const analyzeFit = async () => {
    if (!job) return;
    setAnalyzing(true);
    try {
      const response = await fetch('/api/job-fit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-key': actorKey,
        },
        body: JSON.stringify({
          job_id: job.id,
          title: translateTitle(job.title),
          company: getCompanyName(job.company),
          location: translateLocation(job.location),
        }),
      });
      const payload = await response.json();
      setFitResult(payload.success ? payload.data : null);
    } catch {
      setFitResult(null);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#94a3b8' }}>Loading...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#94a3b8', marginBottom: '16px' }}>Position not found</p>
        <Link href="/en/jobs">
          <Button variant="outline" style={{ background: 'transparent', borderColor: '#3b82f6', color: '#3b82f6' }}>
            Back to Jobs
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        
        .page-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        .breadcrumb { display: flex; align-items: center; gap: 8px; padding: 24px 0; color: #64748b; font-size: 14px; }
        .breadcrumb a { color: #94a3b8; text-decoration: none; }
        .breadcrumb a:hover { color: #3b82f6; }
        
        .job-header {
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 24px;
        }
        
        .company-logo {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          background: #1e293b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          margin-bottom: 20px;
        }
        
        .job-title { font-size: 28px; font-weight: 800; color: white; margin-bottom: 12px; }
        .company-name { color: #94a3b8; font-size: 16px; display: flex; align-items: center; gap: 8px; margin-bottom: 24px; }
        .salary { font-size: 24px; font-weight: 700; color: #f97316; margin-bottom: 24px; }
        .job-meta { display: flex; flex-wrap: wrap; gap: 24px; }
        .meta-item { display: flex; align-items: center; gap: 8px; color: #94a3b8; }
        .meta-item svg { color: #64748b; }
        
        .content-grid { display: grid; grid-template-columns: 1fr 340px; gap: 24px; }
        .content-card {
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 28px;
          margin-bottom: 24px;
        }
        .section-title { font-size: 18px; font-weight: 700; color: white; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
        .section-content { color: #94a3b8; line-height: 1.8; font-size: 15px; }
        .section-content p { margin-bottom: 12px; }
        .section-content ul { padding-left: 20px; }
        .section-content li { margin-bottom: 8px; }
        
        .apply-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s;
          text-decoration: none;
        }
        .apply-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(59, 130, 246, 0.4);
        }
        
        .tags-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
        
        .related-card {
          background: rgba(30, 41, 59, 0.4);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 12px;
          padding: 16px;
          transition: all 0.2s;
          text-decoration: none;
        }
        .related-card:hover {
          border-color: rgba(59, 130, 246, 0.3);
          background: rgba(30, 41, 59, 0.8);
        }
        .related-title { font-size: 14px; font-weight: 600; color: white; margin-bottom: 8px; }
        .related-company { font-size: 12px; color: #64748b; }
        .related-salary { font-size: 14px; font-weight: 600; color: #f97316; margin-top: 8px; }
        
        .footer { padding: 40px; text-align: center; color: #64748b; font-size: 14px; border-top: 1px solid rgba(255,255,255,0.05); margin-top: 48px; }
        
        @media (max-width: 900px) {
          .content-grid { grid-template-columns: 1fr; }
          .job-title { font-size: 22px; }
        }
      `}</style>

      <div style={{ paddingTop: '80px' }}>
        <div className="page-container">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <Link href="/en">Home</Link>
            <ChevronRight size={14} />
            <Link href="/en/jobs">Jobs</Link>
            <ChevronRight size={14} />
            <span style={{ color: 'white' }}>{translateTitle(job.title)}</span>
          </div>

          {/* Job Header */}
          <div className="job-header">
            <div className="company-logo">
              {getCompanyEmoji(job.company)}
            </div>
            <h1 className="job-title">{translateTitle(job.title)}</h1>
            <div className="company-name">
              <Building2 size={18} />
              {getCompanyName(job.company)} · {translateLocation(job.location) || 'Not specified'}
            </div>
            {job.salary_text && <div className="salary">{job.salary_text}</div>}
            
            <div className="job-meta">
              <div className="meta-item">
                <MapPin size={16} />
                {translateLocation(job.location) || 'Not specified'}
              </div>
              <div className="meta-item">
                <Briefcase size={16} />
                {getJobTypeLabel(job.job_type)}
              </div>
              <div className="meta-item">
                <GraduationCap size={16} />
                {getEducationLabel(job.education) || 'Bachelor\'s Degree+'}
              </div>
              <div className="meta-item">
                <Clock size={16} />
                Posted {formatDate(job.publish_date)}
              </div>
              <div className="meta-item">
                <Eye size={16} />
                {job.views} views
              </div>
            </div>
          </div>

          <div className="content-grid">
            {/* Main Content */}
            <div>
              {job.description && (
                <div className="content-card">
                  <h2 className="section-title">📋 Description</h2>
                  <div className="section-content" style={{ whiteSpace: 'pre-wrap' }}>
                    {translateText(job.description)}
                  </div>
                </div>
              )}

              {job.responsibilities && (
                <div className="content-card">
                  <h2 className="section-title">🎯 Responsibilities</h2>
                  <div className="section-content" style={{ whiteSpace: 'pre-wrap' }}>
                    {translateText(job.responsibilities)}
                  </div>
                </div>
              )}

              {job.requirements && (
                <div className="content-card">
                  <h2 className="section-title">✨ Requirements</h2>
                  <div className="section-content" style={{ whiteSpace: 'pre-wrap' }}>
                    {translateText(job.requirements)}
                  </div>
                </div>
              )}

              {job.tags && (
                <div className="content-card">
                  <h2 className="section-title">🏷️ Required Skills</h2>
                  <div className="tags-list">
                    {job.tags.split(',').map((tag, i) => (
                      <Badge key={i} variant="outline" style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                        {translateText(tag.trim())}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              {safeOfficialUrl && (
                <div className="content-card">
                  <a href={safeOfficialUrl} target="_blank" rel="noopener noreferrer" className="apply-btn">
                    Apply on Official Site
                    <ExternalLink size={18} />
                  </a>
                </div>
              )}

              <div className="content-card">
                <div style={{ display: 'grid', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => void saveToTracker()}
                    disabled={saving}
                    className="apply-btn"
                    style={{ background: 'linear-gradient(135deg, #f3f4f6, #dbe4ea)', color: '#0f172a' }}
                  >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : null}
                    Save to Tracker
                  </button>
                  <button
                    type="button"
                    onClick={() => void analyzeFit()}
                    disabled={analyzing}
                    className="apply-btn"
                    style={{ background: 'linear-gradient(135deg, #0f766e, #f08c38)' }}
                  >
                    {analyzing ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                    Analyze Fit
                  </button>
                </div>
                {trackerMessage ? (
                  <div style={{ marginTop: '12px', color: '#94a3b8', fontSize: '14px' }}>{trackerMessage}</div>
                ) : null}
              </div>

              {fitResult && (
                <div className="content-card">
                  <h2 className="section-title">✨ Job Fit Score</h2>
                  <div style={{ fontSize: '32px', fontWeight: 700, color: '#f8fafc' }}>{fitResult.score}/100</div>
                  <p style={{ marginTop: '12px', color: '#94a3b8', lineHeight: 1.8 }}>{fitResult.summary}</p>
                  <div style={{ marginTop: '16px', display: 'grid', gap: '12px' }}>
                    <div>
                      <div style={{ color: '#f8fafc', fontWeight: 600, marginBottom: '6px' }}>Strengths</div>
                      <div style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.7 }}>{fitResult.strengths.join(' · ')}</div>
                    </div>
                    <div>
                      <div style={{ color: '#f8fafc', fontWeight: 600, marginBottom: '6px' }}>Gaps</div>
                      <div style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.7 }}>{fitResult.gaps.join(' · ')}</div>
                    </div>
                    <div>
                      <div style={{ color: '#f8fafc', fontWeight: 600, marginBottom: '6px' }}>Next Steps</div>
                      <div style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.7 }}>{fitResult.next_steps.join(' · ')}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="content-card">
                <h2 className="section-title">📌 Quick Info</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="meta-item">
                    <Building2 size={16} />
                    <span>{getCompanyName(job.company)}</span>
                  </div>
                  <div className="meta-item">
                    <MapPin size={16} />
                    <span>{translateLocation(job.location) || 'Not specified'}</span>
                  </div>
                  {job.salary_text && (
                    <div className="meta-item">
                      <span style={{ color: '#f97316', fontWeight: 600 }}>{job.salary_text}</span>
                    </div>
                  )}
                  <div className="meta-item">
                    <Briefcase size={16} />
                    <span>{getJobTypeLabel(job.job_type)}</span>
                  </div>
                  {job.experience && (
                    <div className="meta-item">
                      <span>Experience: {getExperienceLabel(job.experience)}</span>
                    </div>
                  )}
                  {job.education && (
                    <div className="meta-item">
                      <GraduationCap size={16} />
                      <span>{getEducationLabel(job.education)}</span>
                    </div>
                  )}
                </div>
              </div>

              {relatedJobs.length > 0 && (
                <div className="content-card">
                  <h2 className="section-title">🔗 Related Positions</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {relatedJobs.map((rj) => (
                      <Link href={`/en/jobs/${rj.id}`} key={rj.id} className="related-card">
                        <div className="related-title">{translateTitle(rj.title)}</div>
                        <div className="related-company">{getCompanyEmoji(rj.company)} {getCompanyName(rj.company)} · {translateLocation(rj.location)}</div>
                        {rj.salary_text && <div className="related-salary">{rj.salary_text}</div>}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginTop: '24px' }}>
                <Link href="/en/jobs">
                  <Button variant="outline" style={{ width: '100%', background: 'transparent', borderColor: 'rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                    <ArrowLeft size={16} style={{ marginRight: '8px' }} />
                    Back to Jobs
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="footer">
          <p>© 2025 Reachable - AI Career Assistant. Position data sourced from official company careers pages.</p>
        </div>
      </div>
    </div>
  );
}
