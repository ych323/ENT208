'use client';

import { useEffect, useMemo, useState } from 'react';
import { Download, Filter, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getClientKey } from '@/lib/client-key';

type Application = {
  id: string;
  job_id: string;
  title: string;
  company: string;
  location?: string;
  source_url?: string;
  status: 'saved' | 'applied' | 'interviewing' | 'offer' | 'rejected';
  notes: string;
  fit_score?: number;
  fit_summary?: string;
  fit_strengths?: string[];
  fit_gaps?: string[];
  fit_next_steps?: string[];
  status_history?: Array<{
    status: 'saved' | 'applied' | 'interviewing' | 'offer' | 'rejected';
    changed_at: string;
    note?: string;
  }>;
  updated_at: string;
};

const statuses: Application['status'][] = ['saved', 'applied', 'interviewing', 'offer', 'rejected'];

function formatStatus(status: Application['status']) {
  if (status === 'saved') return 'Saved';
  if (status === 'applied') return 'Applied';
  if (status === 'interviewing') return 'Interviewing';
  if (status === 'offer') return 'Offer';
  return 'Rejected';
}

export function ApplicationTracker({ locale = 'en' }: { locale?: 'en' | 'zh' }) {
  const { user } = useAuth();
  const [actorKey, setActorKey] = useState('anonymous');
  const [items, setItems] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Application['status']>('all');
  const [search, setSearch] = useState('');
  const copy = locale === 'zh'
    ? {
        badge: '投递追踪',
        title: '用状态筛选、匹配度分析和历史记录管理你的投递流程。',
        desc: '从职位详情保存岗位，在这里更新进度，并用匹配度判断下一步该把时间花在哪里。',
        export: '导出追踪数据',
        all: '全部状态',
        filterPlaceholder: '按职位、公司或地点筛选',
        emptyTitle: '当前筛选下还没有投递记录',
        emptyDesc: '先从职位详情页保存岗位，或者切换状态筛选。',
        fitNone: '暂无匹配度',
        fitSummary: '匹配总结',
        strengths: '优势',
        gaps: '差距',
        nextSteps: '下一步',
        history: '状态历史',
        notes: '备注、投递时间线、卡点',
        analyze: '分析匹配度',
        open: '打开职位来源',
      }
    : {
        badge: 'Application tracker',
        title: 'Manage your pipeline with status filters, fit evidence, and a usable history trail.',
        desc: 'Save roles from the job detail page, update what changed, and use fit analysis to decide where to spend limited application energy.',
        export: 'Export tracker',
        all: 'All statuses',
        filterPlaceholder: 'Filter by title, company, or location',
        emptyTitle: 'No applications match this filter yet',
        emptyDesc: 'Save a role from the job detail page or switch the status filter.',
        fitNone: 'No fit score',
        fitSummary: 'Fit summary',
        strengths: 'Strengths',
        gaps: 'Gaps',
        nextSteps: 'Next steps',
        history: 'Status history',
        notes: 'Notes, outreach, timeline, blockers',
        analyze: 'Analyze fit',
        open: 'Open listing',
      };

  useEffect(() => {
    setActorKey(user?.id || getClientKey());
  }, [user?.id]);

  async function load() {
    setLoading(true);
    try {
      const response = await fetch('/api/applications', {
        headers: { 'x-user-key': actorKey },
        cache: 'no-store',
      });
      const payload = await response.json();
      setItems(payload.success ? payload.data : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [actorKey]);

  async function save(item: Application, updates: Partial<Application>) {
    setBusyId(item.id);
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-key': actorKey,
        },
        body: JSON.stringify({ ...item, ...updates }),
      });
      const payload = await response.json();
      if (payload.success) {
        setItems((current) => current.map((entry) => (entry.id === item.id ? payload.data : entry)));
      }
    } finally {
      setBusyId('');
    }
  }

  async function analyzeFit(item: Application) {
    setBusyId(item.id);
    try {
      const response = await fetch('/api/job-fit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-key': actorKey,
        },
        body: JSON.stringify({
          job_id: item.job_id,
          title: item.title,
          company: item.company,
          location: item.location,
          notes: item.notes,
        }),
      });
      const payload = await response.json();
      if (!payload.success) return;
      await save(item, {
        fit_score: payload.data.score,
        fit_summary: payload.data.summary,
        fit_strengths: payload.data.strengths,
        fit_gaps: payload.data.gaps,
        fit_next_steps: payload.data.next_steps,
      });
    } finally {
      setBusyId('');
    }
  }

  function exportTracker() {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'reachable-application-tracker.json';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const normalizedSearch = search.trim().toLowerCase();
      const matchesSearch =
        !normalizedSearch ||
        `${item.title} ${item.company} ${item.location || ''}`.toLowerCase().includes(normalizedSearch);
      return matchesStatus && matchesSearch;
    });
  }, [items, search, statusFilter]);

  const counts = useMemo(() => {
    return statuses.reduce<Record<Application['status'], number>>((acc, status) => {
      acc[status] = items.filter((item) => item.status === status).length;
      return acc;
    }, { saved: 0, applied: 0, interviewing: 0, offer: 0, rejected: 0 });
  }, [items]);

  return (
    <div className="page-shell pb-20 pt-8">
      <section className="surface-panel p-7 sm:p-9">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
              <Sparkles className="h-4 w-4" />
              {copy.badge}
            </div>
            <h1 className="mt-4 font-serif text-3xl text-white sm:text-4xl">
              {copy.title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              {copy.desc}
            </p>
          </div>
          <button
            type="button"
            onClick={exportTracker}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/8"
          >
            <Download className="h-4 w-4" />
            {copy.export}
          </button>
        </div>
      </section>

      <section className="surface-panel mt-6 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid gap-3 sm:grid-cols-5">
            {statuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-[22px] border px-4 py-4 text-left transition ${
                  statusFilter === status
                    ? 'border-white/20 bg-white/10 text-white'
                    : 'border-white/10 bg-slate-950/35 text-slate-300'
                }`}
              >
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">{formatStatus(status)}</div>
                <div className="mt-2 text-2xl font-semibold">{counts[status]}</div>
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                statusFilter === 'all' ? 'bg-white text-slate-950' : 'bg-white/6 text-slate-300'
              }`}
              >
                <Filter className="h-4 w-4" />
                {copy.all}
              </button>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={copy.filterPlaceholder}
              className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white placeholder:text-slate-500"
            />
          </div>
        </div>
      </section>

      {loading ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="surface-panel h-56 animate-pulse bg-white/5" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <section className="surface-panel mt-6 px-8 py-14 text-center">
          <div className="text-lg font-medium text-white">{copy.emptyTitle}</div>
          <p className="mt-2 text-sm text-slate-400">{copy.emptyDesc}</p>
        </section>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {filteredItems.map((item) => (
            <section key={item.id} className="surface-panel p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-medium text-white">{item.title}</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    {item.company}{item.location ? ` · ${item.location}` : ''}
                  </p>
                </div>
                <div className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">
                  {item.fit_score ? `${item.fit_score} fit` : copy.fitNone}
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                <select
                  value={item.status}
                  onChange={(event) => void save(item, { status: event.target.value as Application['status'] })}
                  className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {formatStatus(status)}
                    </option>
                  ))}
                </select>
                <textarea
                  rows={4}
                  value={item.notes}
                  onChange={(event) =>
                    setItems((current) =>
                      current.map((entry) => (entry.id === item.id ? { ...entry, notes: event.target.value } : entry)),
                    )
                  }
                  onBlur={() => void save(item, { notes: item.notes })}
                  placeholder={copy.notes}
                  className="rounded-[24px] border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-500"
                />
              </div>

              {item.fit_summary ? (
                <div className="mt-4 rounded-[24px] border border-emerald-300/20 bg-emerald-300/10 px-4 py-4 text-sm leading-7 text-emerald-50">
                  <div className="font-medium text-white">{copy.fitSummary}</div>
                  <div className="mt-2">{item.fit_summary}</div>
                </div>
              ) : null}

              {item.fit_strengths?.length ? (
                <div className="mt-4 grid gap-3">
                  <div className="rounded-[24px] border border-white/10 bg-slate-950/35 px-4 py-4">
                    <div className="text-sm font-medium text-white">{copy.strengths}</div>
                    <div className="mt-2 text-sm leading-7 text-slate-300">{item.fit_strengths.join(' · ')}</div>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-slate-950/35 px-4 py-4">
                    <div className="text-sm font-medium text-white">{copy.gaps}</div>
                    <div className="mt-2 text-sm leading-7 text-slate-300">{item.fit_gaps?.join(' · ') || 'No gaps yet.'}</div>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-slate-950/35 px-4 py-4">
                    <div className="text-sm font-medium text-white">{copy.nextSteps}</div>
                    <div className="mt-2 text-sm leading-7 text-slate-300">{item.fit_next_steps?.join(' · ') || 'No next steps yet.'}</div>
                  </div>
                </div>
              ) : null}

              {item.status_history?.length ? (
                <div className="mt-4 rounded-[24px] border border-white/10 bg-slate-950/35 px-4 py-4">
                  <div className="text-sm font-medium text-white">{copy.history}</div>
                  <div className="mt-3 space-y-2">
                    {item.status_history.slice(0, 6).map((entry, index) => (
                      <div key={`${entry.changed_at}-${index}`} className="text-sm text-slate-300">
                        <span className="font-medium text-white">{formatStatus(entry.status)}</span>
                        <span className="text-slate-500"> · {new Date(entry.changed_at).toLocaleString('en-US')}</span>
                        {entry.note ? <span className="text-slate-400"> · {entry.note}</span> : null}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => void analyzeFit(item)}
                  disabled={busyId === item.id}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-950"
                >
                  {busyId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {copy.analyze}
                </button>
                {item.source_url ? (
                  <a
                    href={item.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/8"
                  >
                    {copy.open}
                  </a>
                ) : null}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
