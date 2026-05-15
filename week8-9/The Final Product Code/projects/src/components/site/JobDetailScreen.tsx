'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Briefcase, Building2, ExternalLink, GraduationCap, Loader2, MapPin, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { getClientKey } from '@/lib/client-key';
import { getSafeExternalUrl } from '@/lib/url';

type Locale = 'en' | 'zh';

type Job = {
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
};

type RelatedJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary_text?: string;
};

const JOB_CACHE_KEY = 'reachable-job-cache';

const companyEmoji: Record<string, string> = {
  bytedance: '🎵',
  tencent: '💬',
  alibaba: '🛒',
  ByteDance: '🎵',
  Tencent: '💬',
  Alibaba: '🛒',
};

const copy = {
  en: {
    back: 'Back to Jobs',
    notFound: 'Position not found',
    loading: 'Loading...',
    posted: 'Posted',
    views: 'views',
    apply: 'Apply on Official Site',
    save: 'Save to Tracker',
    saved: 'Saved to tracker.',
    saveError: 'Could not save this role.',
    analyze: 'Analyze Fit',
    fit: 'Job Fit Score',
    summary: 'Summary',
    strengths: 'Strengths',
    gaps: 'Gaps',
    nextSteps: 'Next Steps',
    description: 'Description',
    responsibilities: 'Responsibilities',
    requirements: 'Requirements',
    skills: 'Skills',
    quickInfo: 'Quick Info',
    related: 'Related Positions',
    location: 'Location',
    jobType: 'Type',
    education: 'Education',
    experience: 'Experience',
  },
  zh: {
    back: '返回职位列表',
    notFound: '未找到该职位',
    loading: '加载中...',
    posted: '发布时间',
    views: '浏览',
    apply: '前往官网申请',
    save: '保存到追踪器',
    saved: '已保存到追踪器。',
    saveError: '保存失败，请稍后再试。',
    analyze: '分析匹配度',
    fit: '岗位匹配分',
    summary: '总结',
    strengths: '优势',
    gaps: '差距',
    nextSteps: '下一步',
    description: '职位描述',
    responsibilities: '岗位职责',
    requirements: '任职要求',
    skills: '技能标签',
    quickInfo: '基础信息',
    related: '相关职位',
    location: '地点',
    jobType: '类型',
    education: '学历',
    experience: '经验',
  },
} as const;

function formatDate(locale: Locale, input: string) {
  return new Date(input).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function renderMultiline(text?: string) {
  if (!text) return null;
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => (
      <p key={`${line}-${index}`} className="mb-3 last:mb-0">
        {line}
      </p>
    ));
}

function getCachedJob(id: string) {
  if (typeof window === 'undefined' || !id) return null;
  try {
    const raw = localStorage.getItem(JOB_CACHE_KEY);
    if (!raw) return null;
    const map = JSON.parse(raw) as Record<string, Job>;
    return map[id] ?? null;
  } catch {
    return null;
  }
}

export function JobDetailScreen({ locale }: { locale: Locale }) {
  const searchParams = useSearchParams();
  const jobId = searchParams.get('id') ?? '';
  const { user } = useAuth();
  const text = copy[locale];
  const [job, setJob] = useState<Job | null>(null);
  const [relatedJobs, setRelatedJobs] = useState<RelatedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [trackerMessage, setTrackerMessage] = useState('');
  const [actorKey, setActorKey] = useState('anonymous');
  const [fitResult, setFitResult] = useState<null | { score: number; summary: string; strengths: string[]; gaps: string[]; next_steps: string[] }>(null);

  useEffect(() => {
    setActorKey(user?.id || getClientKey());
  }, [user?.id]);

  useEffect(() => {
    let active = true;

    async function loadJob() {
      if (!jobId) {
        if (active) {
          setJob(null);
          setRelatedJobs([]);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/jobs/${jobId}?lang=${locale}`, { cache: 'no-store' });
        const payload = await response.json();
        if (active && payload.success) {
          setJob(payload.data);
          setRelatedJobs(payload.relatedJobs || []);
        } else if (active) {
          setJob(getCachedJob(jobId));
          setRelatedJobs([]);
        }
      } catch {
        if (active) {
          setJob(getCachedJob(jobId));
          setRelatedJobs([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadJob();
    return () => {
      active = false;
    };
  }, [jobId, locale]);

  const safeOfficialUrl = getSafeExternalUrl(job?.official_url);
  const jobListHref = locale === 'zh' ? '/zh/jobs' : '/en/jobs';
  const trackerHref = locale === 'zh' ? '/zh/jobs/tracker' : '/en/jobs/tracker';

  const meta = useMemo(
    () =>
      job
        ? [
            { label: text.location, value: job.location || '-' },
            { label: text.jobType, value: job.job_type || '-' },
            { label: text.education, value: job.education || '-' },
            { label: text.experience, value: job.experience || '-' },
          ]
        : [],
    [job, text.education, text.experience, text.jobType, text.location],
  );

  async function saveToTracker() {
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
          title: job.title,
          company: job.company,
          location: job.location,
          source_url: safeOfficialUrl || '',
          status: 'saved',
          notes: '',
        }),
      });
      const payload = await response.json();
      setTrackerMessage(payload.success ? text.saved : text.saveError);
    } catch {
      setTrackerMessage(text.saveError);
    } finally {
      setSaving(false);
    }
  }

  async function analyzeFit() {
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
          title: job.title,
          company: job.company,
          location: job.location,
        }),
      });
      const payload = await response.json();
      setFitResult(payload.success ? payload.data : null);
    } catch {
      setFitResult(null);
    } finally {
      setAnalyzing(false);
    }
  }

  if (loading) {
    return (
      <div className="page-shell flex min-h-[70vh] items-center justify-center">
        <div className="surface-panel px-6 py-5 text-sm text-slate-300">{text.loading}</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="page-shell flex min-h-[70vh] flex-col items-center justify-center gap-4">
        <div className="surface-panel px-6 py-5 text-sm text-slate-300">{text.notFound}</div>
        <Link href={jobListHref}>
          <Button variant="outline">{text.back}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="page-shell pb-20 pt-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link href={jobListHref} className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          {text.back}
        </Link>
        <Link href={trackerHref} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/8 hover:text-white">
          Tracker
        </Link>
      </div>

      <section className="surface-panel overflow-hidden p-7 sm:p-9">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-[22px] border border-white/10 bg-white/6 text-3xl">
              {companyEmoji[job.company] ?? '💼'}
            </div>
            <div>
              <div className="text-sm uppercase tracking-[0.22em] text-slate-400">{job.company}</div>
              <h1 className="mt-3 font-serif text-3xl text-white sm:text-4xl">{job.title}</h1>
            </div>
            {job.salary_text ? <div className="text-2xl font-semibold text-amber-300">{job.salary_text}</div> : null}
            <div className="flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-500" />{job.location || '-'}</span>
              <span className="inline-flex items-center gap-2"><Briefcase className="h-4 w-4 text-slate-500" />{job.job_type || '-'}</span>
              <span className="inline-flex items-center gap-2"><GraduationCap className="h-4 w-4 text-slate-500" />{job.education || '-'}</span>
              <span className="inline-flex items-center gap-2"><Building2 className="h-4 w-4 text-slate-500" />{text.posted} {formatDate(locale, job.publish_date)}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="rounded-full bg-white/10 px-3 py-1 text-slate-100">{job.category}</Badge>
              {job.tags?.split(',').map((tag) => (
                <Badge key={tag} variant="outline" className="rounded-full border-white/10 px-3 py-1 text-slate-300">
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-950/35 p-5">
            <div className="grid gap-3">
              {safeOfficialUrl ? (
                <a
                  href={safeOfficialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-medium text-slate-950"
                >
                  {text.apply}
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : null}
              <button
                type="button"
                onClick={() => void saveToTracker()}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/8 disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {text.save}
              </button>
              <button
                type="button"
                onClick={() => void analyzeFit()}
                disabled={analyzing}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-300/90 px-4 py-3 text-sm font-medium text-slate-950 disabled:opacity-60"
              >
                {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {text.analyze}
              </button>
            </div>

            {trackerMessage ? <div className="mt-4 text-sm text-slate-300">{trackerMessage}</div> : null}

            <div className="mt-6 grid gap-3">
              {meta.map((item) => (
                <div key={item.label} className="rounded-[22px] border border-white/10 bg-white/6 px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{item.label}</div>
                  <div className="mt-2 text-sm text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {fitResult ? (
        <section className="surface-panel mt-6 p-6">
          <div className="text-sm uppercase tracking-[0.2em] text-slate-400">{text.fit}</div>
          <div className="mt-3 text-4xl font-semibold text-white">{fitResult.score}/100</div>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <div className="rounded-[24px] border border-white/10 bg-slate-950/35 px-4 py-4">
              <div className="text-sm font-medium text-white">{text.summary}</div>
              <div className="mt-2 text-sm leading-7 text-slate-300">{fitResult.summary}</div>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-slate-950/35 px-4 py-4">
              <div className="text-sm font-medium text-white">{text.strengths}</div>
              <div className="mt-2 text-sm leading-7 text-slate-300">{fitResult.strengths.join(' · ')}</div>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-slate-950/35 px-4 py-4">
              <div className="text-sm font-medium text-white">{text.gaps}</div>
              <div className="mt-2 text-sm leading-7 text-slate-300">{fitResult.gaps.join(' · ')}</div>
            </div>
          </div>
          <div className="mt-4 rounded-[24px] border border-white/10 bg-slate-950/35 px-4 py-4">
            <div className="text-sm font-medium text-white">{text.nextSteps}</div>
            <div className="mt-2 text-sm leading-7 text-slate-300">{fitResult.next_steps.join(' · ')}</div>
          </div>
        </section>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {job.description ? (
            <section className="surface-panel p-6">
              <h2 className="text-lg font-medium text-white">{text.description}</h2>
              <div className="mt-4 text-sm leading-7 text-slate-300">{renderMultiline(job.description)}</div>
            </section>
          ) : null}
          {job.responsibilities ? (
            <section className="surface-panel p-6">
              <h2 className="text-lg font-medium text-white">{text.responsibilities}</h2>
              <div className="mt-4 text-sm leading-7 text-slate-300">{renderMultiline(job.responsibilities)}</div>
            </section>
          ) : null}
          {job.requirements ? (
            <section className="surface-panel p-6">
              <h2 className="text-lg font-medium text-white">{text.requirements}</h2>
              <div className="mt-4 text-sm leading-7 text-slate-300">{renderMultiline(job.requirements)}</div>
            </section>
          ) : null}
        </div>

        <aside className="space-y-6">
          <section className="surface-panel p-6">
            <h2 className="text-lg font-medium text-white">{text.quickInfo}</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div>{text.location}: {job.location || '-'}</div>
              <div>{text.jobType}: {job.job_type || '-'}</div>
              <div>{text.education}: {job.education || '-'}</div>
              <div>{text.experience}: {job.experience || '-'}</div>
              <div>{text.views}: {job.views}</div>
            </div>
          </section>

          {relatedJobs.length ? (
            <section className="surface-panel p-6">
              <h2 className="text-lg font-medium text-white">{text.related}</h2>
              <div className="mt-4 space-y-3">
                {relatedJobs.map((item) => (
                  <Link
                    key={item.id}
                    href={`${locale === 'zh' ? '/zh/jobs/detail' : '/en/jobs/detail'}?id=${item.id}`}
                    className="block rounded-[22px] border border-white/10 bg-white/6 px-4 py-4 transition hover:bg-white/9"
                  >
                    <div className="text-sm font-medium text-white">{item.title}</div>
                    <div className="mt-1 text-xs text-slate-400">
                      {item.company} · {item.location}
                    </div>
                    {item.salary_text ? <div className="mt-2 text-sm font-medium text-amber-300">{item.salary_text}</div> : null}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
