'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Bookmark, BriefcaseBusiness, Clock3, MapPin, Search, SlidersHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { siteContent, type SiteLocale } from '@/lib/site-content';

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary_text?: string;
  category: string;
  tags?: string;
  job_type: string;
  publish_date: string;
  views: number;
  source_label?: string;
};

const JOB_CACHE_KEY = 'reachable-job-cache';

const categoryOptions = {
  zh: [
    ['all', '全部方向'],
    ['frontend', '前端'],
    ['backend', '后端'],
    ['algorithm', '算法/AI'],
    ['data', '数据'],
    ['product', '产品'],
    ['operation', '运营/增长'],
    ['design', '设计'],
    ['devops', 'DevOps'],
    ['mobile', '移动端'],
    ['qa', '测试'],
  ],
  en: [
    ['all', 'All tracks'],
    ['frontend', 'Frontend'],
    ['backend', 'Backend'],
    ['algorithm', 'AI / ML'],
    ['data', 'Data'],
    ['product', 'Product'],
    ['operation', 'Operations'],
    ['design', 'Design'],
    ['devops', 'DevOps'],
    ['mobile', 'Mobile'],
    ['qa', 'QA'],
  ],
} as const;

const typeOptions = {
  zh: [
    ['all', '全部类型'],
    ['fulltime', '全职'],
    ['internship', '实习'],
  ],
  en: [
    ['all', 'All types'],
    ['fulltime', 'Full-time'],
    ['internship', 'Internship'],
  ],
} as const;

function bookmarkKey(locale: SiteLocale) {
  return locale === 'zh' ? 'cn_job_bookmarks' : 'en_job_bookmarks';
}

function getStoredBookmarks(locale: SiteLocale) {
  if (typeof window === 'undefined') return {} as Record<string, boolean>;
  try {
    const raw = localStorage.getItem(bookmarkKey(locale));
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

function saveBookmark(locale: SiteLocale, jobId: string, saved: boolean) {
  const next = getStoredBookmarks(locale);
  next[jobId] = saved;
  localStorage.setItem(bookmarkKey(locale), JSON.stringify(next));
}

function mergeJobCache(items: Job[]) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(JOB_CACHE_KEY);
    const current = raw ? (JSON.parse(raw) as Record<string, Job>) : {};
    for (const item of items) {
      current[item.id] = item;
    }
    localStorage.setItem(JOB_CACHE_KEY, JSON.stringify(current));
  } catch {
    // Ignore cache write failures.
  }
}

function formatDate(locale: SiteLocale, input: string) {
  const date = new Date(input);
  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (locale === 'zh') {
    if (days < 1) return '今天';
    if (days < 7) return `${days} 天前`;
    if (days < 30) return `${Math.floor(days / 7)} 周前`;
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  }
  if (days < 1) return 'Today';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const companyEmoji: Record<string, string> = {
  ByteDance: '🎵',
  Tencent: '💬',
  Alibaba: '🛒',
};

export function JobsExplorer({ locale }: { locale: SiteLocale }) {
  const content = siteContent[locale].jobs;
  const isZh = locale === 'zh';
  const [jobs, setJobs] = useState<Job[]>([]);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('all');
  const [jobType, setJobType] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});
  const pageSize = 12;
  const detailPrefix = isZh ? '/zh/jobs/detail?id=' : '/en/jobs/detail?id=';

  useEffect(() => {
    setBookmarks(getStoredBookmarks(locale));
  }, [locale]);

  useEffect(() => {
    let active = true;

    async function fetchJobs() {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });

      if (keyword.trim()) params.set('keyword', keyword.trim());
      if (location.trim()) params.set('location', location.trim());
      if (category !== 'all') params.set('category', category);
      if (jobType !== 'all') params.set('jobType', jobType);

      try {
        const response = await fetch(`/api/jobs/list?${params.toString()}`, { cache: 'no-store' });
        const data = await response.json();
        if (active && data.success) {
          setJobs(data.data);
          setTotal(data.pagination.total);
          mergeJobCache(data.data as Job[]);
        }
      } catch {
        if (active) {
          setJobs([]);
          setTotal(0);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void fetchJobs();
    return () => {
      active = false;
    };
  }, [category, jobType, keyword, location, page]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const headlineStats = useMemo(
    () => [
      { label: isZh ? '筛选维度' : 'filters', value: '4' },
      { label: isZh ? '在线职位' : 'live jobs', value: String(total) },
      { label: isZh ? '覆盖方向' : 'coverage', value: '10' },
    ],
    [isZh, total],
  );

  return (
    <div className="page-shell pb-20 pt-8">
      <section className="surface-panel overflow-hidden p-7 sm:p-9">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
              <BriefcaseBusiness className="h-4 w-4" />
              {isZh ? '真实岗位聚合' : 'Live job aggregation'}
            </div>
            <h1 className="font-serif text-3xl text-white sm:text-4xl">{content.heroTitle}</h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">{content.heroDescription}</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {headlineStats.map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-slate-950/35 px-4 py-4">
                  <div className="text-2xl font-semibold text-white">{item.value}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-950/35 p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2 text-sm text-slate-300">
              <SlidersHorizontal className="h-4 w-4" />
              {isZh ? '筛选条件' : 'Filters'}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="relative md:col-span-2">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  value={keyword}
                  onChange={(event) => {
                    setPage(1);
                    setKeyword(event.target.value);
                  }}
                  placeholder={content.searchPlaceholder}
                  className="w-full rounded-2xl border border-white/10 bg-white/6 py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-500"
                />
              </label>

              <input
                value={location}
                onChange={(event) => {
                  setPage(1);
                  setLocation(event.target.value);
                }}
                placeholder={isZh ? '按地点搜索，例如 Remote / Singapore' : 'Filter by location, e.g. Remote / Singapore'}
                className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-500"
              />

              <select
                value={category}
                onChange={(event) => {
                  setPage(1);
                  setCategory(event.target.value);
                }}
                className="rounded-2xl border border-emerald-300/30 bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/20"
              >
                {categoryOptions[locale].map(([value, label]) => (
                  <option key={value} value={value} className="bg-slate-900 text-white">
                    {label}
                  </option>
                ))}
              </select>

              <select
                value={jobType}
                onChange={(event) => {
                  setPage(1);
                  setJobType(event.target.value);
                }}
                className="rounded-2xl border border-amber-300/30 bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition focus:border-amber-300/60 focus:ring-2 focus:ring-amber-300/20"
              >
                {typeOptions[locale].map(([value, label]) => (
                  <option key={value} value={value} className="bg-slate-900 text-white">
                    {label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => {
                  setKeyword('');
                  setLocation('');
                  setCategory('all');
                  setJobType('all');
                  setPage(1);
                }}
                className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/8"
              >
                {isZh ? '重置筛选' : 'Reset filters'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-5 flex items-center justify-between text-sm text-slate-400">
        <div>
          {content.totalLabel}: <span className="font-medium text-white">{total}</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href={isZh ? '/zh/jobs/tracker' : '/en/jobs/tracker'}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/8 hover:text-white"
          >
            {isZh ? '查看投递追踪' : 'Open Tracker'}
          </Link>
          <div>
            {isZh ? '第 ' : 'Page '}<span className="font-medium text-white">{page}</span>
            {isZh ? ` / ${totalPages} 页` : ` of ${totalPages}`}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="surface-panel h-72 animate-pulse bg-white/5" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="surface-panel mt-8 px-8 py-14 text-center">
          <div className="text-lg font-medium text-white">{content.emptyTitle}</div>
          <p className="mt-2 text-sm text-slate-400">{content.emptyDescription}</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => {
            const saved = Boolean(bookmarks[job.id]);
            return (
              <Link
                key={job.id}
                href={`${detailPrefix}${job.id}`}
                className="surface-panel group overflow-hidden p-5 transition hover:-translate-y-1 hover:bg-white/9"
              >
                <div className="mb-5 rounded-[22px] bg-gradient-to-br from-emerald-500/18 via-slate-900 to-amber-300/12 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="text-2xl">{companyEmoji[job.company] ?? '💼'}</div>
                      <div className="text-sm uppercase tracking-[0.22em] text-slate-200/70">
                        {job.company}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        const next = !saved;
                        saveBookmark(locale, job.id, next);
                        setBookmarks((current) => ({ ...current, [job.id]: next }));
                      }}
                      className={`rounded-full border px-3 py-1 text-xs transition ${
                        saved
                          ? 'border-emerald-300/30 bg-emerald-300/15 text-emerald-100'
                          : 'border-white/15 bg-slate-950/25 text-white'
                      }`}
                    >
                      <span className="inline-flex items-center gap-1">
                        <Bookmark className="h-3.5 w-3.5" />
                        {saved ? content.saved : content.save}
                      </span>
                    </button>
                  </div>
                  <div className="mt-6 text-xl font-medium text-white">{job.title}</div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge className="rounded-full bg-white/10 px-3 py-1 text-slate-100">{job.category}</Badge>
                    <Badge className="rounded-full bg-white/10 px-3 py-1 text-slate-100">{job.job_type}</Badge>
                    {job.source_label ? (
                      <Badge className="rounded-full bg-emerald-300/12 px-3 py-1 text-emerald-100">{job.source_label}</Badge>
                    ) : null}
                  </div>

                  <div className="space-y-2 text-sm text-slate-300">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-slate-500" />
                      {formatDate(locale, job.publish_date)}
                    </div>
                  </div>

                  {job.salary_text ? (
                    <div className="text-lg font-semibold text-amber-300">{job.salary_text}</div>
                  ) : null}

                  <div className="flex flex-wrap gap-2">
                    {job.tags?.split(',').slice(0, 4).map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>

                  <div className="pt-1 text-sm text-white/90 transition group-hover:text-white">
                    {content.detailLabel} →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setPage((current) => Math.max(1, current - 1))}
          disabled={page === 1}
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 disabled:opacity-40"
        >
          {isZh ? '上一页' : 'Previous'}
        </button>
        <button
          type="button"
          onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
          disabled={page === totalPages}
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 disabled:opacity-40"
        >
          {isZh ? '下一页' : 'Next'}
        </button>
      </div>
    </div>
  );
}
