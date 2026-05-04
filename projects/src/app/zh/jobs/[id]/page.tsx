'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getSafeExternalUrl } from '@/lib/url';
import {
  ArrowLeft,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  GraduationCap,
  Users,
  ExternalLink,
  ChevronRight,
  Eye,
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  company_logo?: string;
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

const COMPANY_NAMES: Record<string, string> = {
  bytedance: '字节跳动',
  tencent: '腾讯',
  alibaba: '阿里巴巴',
};

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

const CATEGORY_LABELS: Record<string, string> = {
  frontend: '前端',
  backend: '后端',
  algorithm: '算法',
  operation: '运营',
  product: '产品',
  data: '数据',
};

const CATEGORY_COLORS: Record<string, string> = {
  frontend: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  backend: 'bg-green-500/10 text-green-400 border-green-500/30',
  algorithm: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  operation: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  product: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
  data: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
};

export default function ChineseJobDetailPage() {
  const params = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [relatedJobs, setRelatedJobs] = useState<RelatedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const safeOfficialUrl = getSafeExternalUrl(job?.official_url);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setJob(data.data);
          setRelatedJobs(data.relatedJobs || []);
        }
      } catch (error) {
        console.error('获取岗位详情失败:', error);
      }
      setLoading(false);
    };
    if (params.id) {
      fetchJob();
    }
  }, [params.id]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#94a3b8' }}>加载中...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#94a3b8', marginBottom: '16px' }}>岗位不存在</p>
        <Link href="/zh/jobs">
          <Button variant="outline" style={{ background: 'transparent', borderColor: '#ef4444', color: '#ef4444' }}>
            返回岗位列表
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif; }
        
        .page-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 24px 0;
          color: #64748b;
          font-size: 14px;
        }
        
        .breadcrumb a { color: #94a3b8; text-decoration: none; }
        .breadcrumb a:hover { color: #ef4444; }
        
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
          background: linear-gradient(135deg, #ef4444, #f97316);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: bold;
          color: white;
          margin-bottom: 20px;
        }
        
        .job-title { font-size: 28px; font-weight: 800; color: white; margin-bottom: 12px; }
        
        .company-name { color: #94a3b8; font-size: 16px; display: flex; align-items: center; gap: 8px; margin-bottom: 24px; }
        
        .salary { font-size: 24px; font-weight: 700; color: #f97316; margin-bottom: 24px; }
        
        .job-meta { display: flex; flex-wrap: wrap; gap: 24px; }
        
        .meta-item { display: flex; align-items: center; gap: 8px; color: #94a3b8; }
        
        .meta-item svg { color: #64748b; }
        
        .content-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 24px;
        }
        
        .content-card {
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 28px;
          margin-bottom: 24px;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: white;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .section-content { color: #94a3b8; line-height: 1.8; font-size: 15px; }
        
        .section-content p { margin-bottom: 12px; }
        .section-content ul { padding-left: 20px; }
        .section-content li { margin-bottom: 8px; }
        
        .apply-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #ef4444, #f97316);
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
          box-shadow: 0 8px 30px rgba(239, 68, 68, 0.4);
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
          border-color: rgba(239, 68, 68, 0.3);
          background: rgba(30, 41, 59, 0.8);
        }
        
        .related-title { font-size: 14px; font-weight: 600; color: white; margin-bottom: 8px; }
        .related-company { font-size: 12px; color: #64748b; }
        .related-salary { font-size: 14px; font-weight: 600; color: #f97316; margin-top: 8px; }
        
        .footer {
          padding: 40px;
          text-align: center;
          color: #64748b;
          font-size: 14px;
          border-top: 1px solid rgba(255,255,255,0.05);
          margin-top: 48px;
        }
        
        @media (max-width: 900px) {
          .content-grid { grid-template-columns: 1fr; }
          .job-title { font-size: 22px; }
        }
      `}</style>

      <div style={{ paddingTop: '80px' }}>
        <div className="page-container">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <Link href="/zh">首页</Link>
            <ChevronRight size={14} />
            <Link href="/zh/jobs">岗位</Link>
            <ChevronRight size={14} />
            <span style={{ color: 'white' }}>{job.title}</span>
          </div>

          {/* Job Header */}
          <div className="job-header">
            <div className="company-logo">
              <span style={{ fontSize: '36px' }}>{getCompanyEmoji(job.company)}</span>
            </div>
            <h1 className="job-title">{job.title}</h1>
            <div className="company-name">
              <Building2 size={18} />
              {COMPANY_NAMES[job.company.toLowerCase()] || job.company} · {job.location || '未指定'}
            </div>
            {job.salary_text && <div className="salary">{job.salary_text}</div>}
            
            <div className="job-meta">
              <div className="meta-item">
                <MapPin size={16} />
                {job.location || '未指定'}
              </div>
              <div className="meta-item">
                <Briefcase size={16} />
                {job.job_type === 'internship' ? '实习' : '全职'}
              </div>
              <div className="meta-item">
                <GraduationCap size={16} />
                {job.education || '本科及以上'}
              </div>
              <div className="meta-item">
                <Clock size={16} />
                发布于 {formatDate(job.publish_date)}
              </div>
              <div className="meta-item">
                <Eye size={16} />
                {job.views} 次浏览
              </div>
            </div>
          </div>

          <div className="content-grid">
            {/* Main Content */}
            <div>
              {job.description && (
                <div className="content-card">
                  <h2 className="section-title">📋 职位描述</h2>
                  <div className="section-content" style={{ whiteSpace: 'pre-wrap' }}>
                    {job.description}
                  </div>
                </div>
              )}

              {job.responsibilities && (
                <div className="content-card">
                  <h2 className="section-title">🎯 岗位职责</h2>
                  <div className="section-content" style={{ whiteSpace: 'pre-wrap' }}>
                    {job.responsibilities}
                  </div>
                </div>
              )}

              {job.requirements && (
                <div className="content-card">
                  <h2 className="section-title">✨ 任职要求</h2>
                  <div className="section-content" style={{ whiteSpace: 'pre-wrap' }}>
                    {job.requirements}
                  </div>
                </div>
              )}

              {job.tags && (
                <div className="content-card">
                  <h2 className="section-title">🏷️ 技能要求</h2>
                  <div className="tags-list">
                    {job.tags.split(',').map((tag, i) => (
                      <Badge key={i} variant="outline" style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                        {tag.trim()}
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
                    去官网申请
                    <ExternalLink size={18} />
                  </a>
                </div>
              )}

              <div className="content-card">
                <h2 className="section-title">📌 基本信息</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="meta-item">
                    <Building2 size={16} />
                    <span>{COMPANY_NAMES[job.company.toLowerCase()] || job.company}</span>
                  </div>
                  <div className="meta-item">
                    <MapPin size={16} />
                    <span>{job.location || '未指定'}</span>
                  </div>
                  {job.salary_text && (
                    <div className="meta-item">
                      <DollarSign size={16} />
                      <span style={{ color: '#f97316', fontWeight: 600 }}>{job.salary_text}</span>
                    </div>
                  )}
                  <div className="meta-item">
                    <Briefcase size={16} />
                    <span>{job.job_type === 'internship' ? '实习' : '全职'}</span>
                  </div>
                  {job.experience && (
                    <div className="meta-item">
                      <Users size={16} />
                      <span>{job.experience}</span>
                    </div>
                  )}
                  {job.education && (
                    <div className="meta-item">
                      <GraduationCap size={16} />
                      <span>{job.education}</span>
                    </div>
                  )}
                </div>
              </div>

              {relatedJobs.length > 0 && (
                <div className="content-card">
                  <h2 className="section-title">🔗 相关岗位</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {relatedJobs.map((rj) => (
                      <Link href={`/zh/jobs/${rj.id}`} key={rj.id} className="related-card">
                        <div className="related-title">{rj.title}</div>
                        <div className="related-company">{COMPANY_NAMES[rj.company.toLowerCase()] || rj.company} · {rj.location}</div>
                        {rj.salary_text && <div className="related-salary">{rj.salary_text}</div>}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginTop: '24px' }}>
                <Link href="/zh/jobs">
                  <Button variant="outline" style={{ width: '100%', background: 'transparent', borderColor: 'rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                    <ArrowLeft size={16} style={{ marginRight: '8px' }} />
                    返回岗位列表
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="footer">
          <p>© 2025 Reachable - AI求职能力定位器。岗位信息来源于各公司官方网站。</p>
        </div>
      </div>
    </div>
  );
}
