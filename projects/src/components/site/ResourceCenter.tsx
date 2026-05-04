'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, BookOpenText, Bookmark, Layers3, PlayCircle, Target } from 'lucide-react';
import { siteContent, type SiteLocale } from '@/lib/site-content';
import type { ResourceRecord, ResourceTrack, ResourceType } from '@/lib/resource-catalog';
import { getSafeExternalUrl } from '@/lib/url';

const trackLabels = {
  zh: {
    all: '全部',
    frontend: '前端',
    backend: '后端',
    algorithm: '算法 / AI',
    data: '数据',
    product: '产品',
    operation: '运营',
    design: '设计',
    devops: 'DevOps',
    mobile: '移动端',
    qa: '测试',
  },
  en: {
    all: 'All',
    frontend: 'Frontend',
    backend: 'Backend',
    algorithm: 'AI / ML',
    data: 'Data',
    product: 'Product',
    operation: 'Operations',
    design: 'Design',
    devops: 'DevOps',
    mobile: 'Mobile',
    qa: 'QA',
  },
} as const;

function bookmarkStorageKey(locale: SiteLocale) {
  return locale === 'zh' ? 'cn_resource_bookmarks' : 'en_resource_bookmarks';
}

function bookmarkDataKey(locale: SiteLocale) {
  return locale === 'zh' ? 'cn_bookmarked_resources_data' : 'en_bookmarked_resources_data';
}

function getStoredBookmarks(locale: SiteLocale) {
  try {
    const raw = localStorage.getItem(bookmarkStorageKey(locale));
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

function getStoredBookmarkedData(locale: SiteLocale) {
  try {
    const raw = localStorage.getItem(bookmarkDataKey(locale));
    return raw ? (JSON.parse(raw) as ResourceRecord[]) : [];
  } catch {
    return [];
  }
}

function persistBookmark(locale: SiteLocale, resource: ResourceRecord, saved: boolean) {
  const bookmarkMap = getStoredBookmarks(locale);
  bookmarkMap[resource.id] = saved;
  localStorage.setItem(bookmarkStorageKey(locale), JSON.stringify(bookmarkMap));

  const savedData = getStoredBookmarkedData(locale);
  const nextData = saved
    ? savedData.some((item) => item.id === resource.id)
      ? savedData
      : [resource, ...savedData]
    : savedData.filter((item) => item.id !== resource.id);

  localStorage.setItem(bookmarkDataKey(locale), JSON.stringify(nextData));
}

export function ResourceCenter({ locale }: { locale: SiteLocale }) {
  const content = siteContent[locale].resources;
  const isZh = locale === 'zh';
  const [activeTrack, setActiveTrack] = useState<ResourceTrack | 'all'>('all');
  const [activeType, setActiveType] = useState<ResourceType>('books');
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});
  const [resources, setResources] = useState<ResourceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBookmarks(getStoredBookmarks(locale));
  }, [locale]);

  useEffect(() => {
    let active = true;

    async function loadResources() {
      setLoading(true);
      try {
        const response = await fetch('/api/resources', { cache: 'no-store' });
        const data = await response.json();
        if (active && data.success) {
          setResources(data.data);
        }
      } catch {
        if (active) {
          setResources([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadResources();
    return () => {
      active = false;
    };
  }, []);

  const filteredResources = useMemo(
    () =>
      resources.filter((item) => {
        const matchType = item.type === activeType;
        const matchTrack = activeTrack === 'all' || item.tracks.includes(activeTrack);
        return matchType && matchTrack;
      }),
    [activeTrack, activeType, resources],
  );

  const trackCount = useMemo(() => new Set(resources.flatMap((item) => item.tracks)).size, [resources]);

  const stats = useMemo(
    () => [
      { label: isZh ? '资源类型' : 'types', value: '3' },
      { label: isZh ? '岗位方向' : 'tracks', value: String(trackCount) },
      { label: isZh ? '当前条目' : 'items', value: String(filteredResources.length) },
    ],
    [filteredResources.length, isZh, trackCount],
  );

  return (
    <div className="page-shell pb-20 pt-8">
      <section className="surface-panel overflow-hidden p-7 sm:p-9">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
              <BookOpenText className="h-4 w-4" />
              Resource System
            </div>
            <h1 className="font-serif text-3xl text-white sm:text-4xl">{content.heroTitle}</h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">{content.heroDescription}</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-slate-950/35 px-4 py-4">
                  <div className="text-2xl font-semibold text-white">{item.value}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-950/35 p-5">
            <div className="mb-4 flex items-center gap-2 text-sm text-slate-300">
              <Layers3 className="h-4 w-4" />
              {isZh ? '筛选结构' : 'Filter structure'}
            </div>

            <div className="flex flex-wrap gap-2">
              {([
                ['books', content.books],
                ['courses', content.courses],
                ['practice', content.practice],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setActiveType(value)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    activeType === value ? 'bg-white text-slate-950' : 'bg-white/6 text-slate-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {Object.entries(trackLabels[locale]).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setActiveTrack(value as ResourceTrack | 'all')}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    activeTrack === value
                      ? 'border-emerald-300/30 bg-emerald-300/12 text-emerald-100'
                      : 'border-white/10 bg-white/6 text-slate-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="surface-panel h-72 animate-pulse bg-white/5" />
          ))}
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="surface-panel mt-8 px-8 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/8 text-slate-200">
            <Target className="h-6 w-6" />
          </div>
          <div className="mt-4 text-lg font-medium text-white">{content.emptyTitle}</div>
          <p className="mt-2 text-sm text-slate-400">{content.emptyDescription}</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredResources.map((resource) => {
            const saved = Boolean(bookmarks[resource.id]);
            const safeUrl = getSafeExternalUrl(resource.url);
            const icon =
              resource.type === 'books'
                ? <BookOpenText className="h-5 w-5" />
                : resource.type === 'courses'
                  ? <PlayCircle className="h-5 w-5" />
                  : <Target className="h-5 w-5" />;

            return (
              <div
                key={resource.id}
                className="surface-panel group flex h-full flex-col p-5 transition hover:-translate-y-1 hover:bg-white/9"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-2xl bg-emerald-300/12 p-3 text-emerald-100">{icon}</div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !saved;
                      persistBookmark(locale, resource, next);
                      setBookmarks((current) => ({ ...current, [resource.id]: next }));
                    }}
                    className={`rounded-full border px-3 py-1 text-xs transition ${
                      saved
                        ? 'border-emerald-300/30 bg-emerald-300/15 text-emerald-100'
                        : 'border-white/15 bg-slate-950/25 text-white'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1">
                      <Bookmark className="h-3.5 w-3.5" />
                      {saved ? (isZh ? '已收藏' : 'Saved') : isZh ? '收藏' : 'Save'}
                    </span>
                  </button>
                </div>

                <div className="mt-5 flex-1">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{resource.provider}</div>
                  <h2 className="mt-3 text-xl font-medium text-white">{resource.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{resource.description}</p>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {resource.tracks.slice(0, 3).map((track) => (
                    <span key={track} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                      {trackLabels[locale][track]}
                    </span>
                  ))}
                  <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-white">{resource.level}</span>
                </div>

                {safeUrl ? (
                  <a
                    href={safeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-2 text-sm text-white/90 transition group-hover:text-white"
                  >
                    {isZh ? '打开资源' : 'Open resource'}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                ) : (
                  <div className="mt-5 inline-flex items-center gap-2 text-sm text-slate-500">
                    {isZh ? '链接暂时不可用' : 'Link unavailable'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
