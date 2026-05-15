'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Bookmark, Heart, LogOut, MessageSquare, PanelsTopLeft, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { siteContent, type SiteLocale } from '@/lib/site-content';
import { getSafeExternalUrl } from '@/lib/url';

type ForumStats = {
  postsCount: number;
  commentsCount: number;
  likesCount: number;
};

type SavedJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary_text?: string;
};

const JOB_CACHE_KEY = 'reachable-job-cache';

type SavedResource = {
  id: string;
  title: string;
  description: string;
  url: string;
};

type PostRecord = {
  id: string;
  title: string;
  created_at: string;
};

type CommentRecord = {
  id: string;
  post_title?: string;
  content: string;
  created_at: string;
};

function statsKey(locale: SiteLocale) {
  return locale === 'zh' ? 'forum_user_stats_cn' : 'forum_user_stats_en';
}

function postsKey(locale: SiteLocale) {
  return locale === 'zh' ? 'forum_user_posts_cn' : 'forum_user_posts_en';
}

function commentsKey(locale: SiteLocale) {
  return locale === 'zh' ? 'forum_user_comments_cn' : 'forum_user_comments_en';
}

function resourcesKey(locale: SiteLocale) {
  return locale === 'zh' ? 'cn_bookmarked_resources_data' : 'en_bookmarked_resources_data';
}

function jobsKey(locale: SiteLocale) {
  return locale === 'zh' ? 'cn_job_bookmarks' : 'en_job_bookmarks';
}

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function mergeJobCache(items: SavedJob[]) {
  try {
    const raw = localStorage.getItem(JOB_CACHE_KEY);
    const current = raw ? (JSON.parse(raw) as Record<string, SavedJob>) : {};
    for (const item of items) {
      current[item.id] = item;
    }
    localStorage.setItem(JOB_CACHE_KEY, JSON.stringify(current));
  } catch {
    // Ignore cache write failures.
  }
}

function formatDate(locale: SiteLocale, value: string) {
  const date = new Date(value);
  return date.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function ProfileDashboard({ locale }: { locale: SiteLocale }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const content = siteContent[locale].profile;
  const [stats, setStats] = useState<ForumStats>({ postsCount: 0, commentsCount: 0, likesCount: 0 });
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [savedResources, setSavedResources] = useState<SavedResource[]>([]);
  const [posts, setPosts] = useState<PostRecord[]>([]);
  const [comments, setComments] = useState<CommentRecord[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(locale === 'zh' ? '/login' : '/en/login');
    }
  }, [isLoading, locale, router, user]);

  useEffect(() => {
    if (!user) return;

    const currentStats = safeRead<ForumStats>(statsKey(locale), {
      postsCount: 0,
      commentsCount: 0,
      likesCount: 0,
    });
    const currentPosts = safeRead<PostRecord[]>(postsKey(locale), []);
    const currentComments = safeRead<CommentRecord[]>(commentsKey(locale), []);
    const currentResources = safeRead<SavedResource[]>(resourcesKey(locale), []);
    const bookmarkedJobMap = safeRead<Record<string, boolean>>(jobsKey(locale), {});

    setStats(currentStats);
    setPosts(currentPosts);
    setComments(currentComments);
    setSavedResources(currentResources);

    const bookmarkedIds = Object.keys(bookmarkedJobMap).filter((id) => bookmarkedJobMap[id]);
    if (bookmarkedIds.length === 0) {
      setSavedJobs([]);
      return;
    }

    let active = true;
    fetch('/api/jobs/list?page=1&pageSize=200')
      .then((response) => response.json())
      .then((data) => {
        if (!active || !data.success) return;
        const allJobs = data.data as SavedJob[];
        mergeJobCache(allJobs);
        const matched = allJobs.filter((job) => bookmarkedIds.includes(job.id));
        setSavedJobs(matched);
      })
      .catch(() => {
        if (active) setSavedJobs([]);
      });

    return () => {
      active = false;
    };
  }, [locale, user]);

  const cards = useMemo(
    () => [
      { label: content.stats.posts, value: stats.postsCount, icon: <PanelsTopLeft className="h-5 w-5" /> },
      { label: content.stats.comments, value: stats.commentsCount, icon: <MessageSquare className="h-5 w-5" /> },
      { label: content.stats.likes, value: stats.likesCount, icon: <Heart className="h-5 w-5" /> },
      { label: content.sections.resources, value: savedResources.length, icon: <Bookmark className="h-5 w-5" /> },
    ],
    [content.sections.resources, content.stats.comments, content.stats.likes, content.stats.posts, savedResources.length, stats.commentsCount, stats.likesCount, stats.postsCount],
  );

  if (isLoading || !user) {
    return (
      <div className="page-shell flex min-h-[60vh] items-center justify-center">
        <div className="surface-panel px-6 py-5 text-sm text-slate-300">{locale === 'zh' ? '加载中...' : 'Loading...'}</div>
      </div>
    );
  }

  return (
    <div className="page-shell pb-20 pt-8">
      <section className="surface-panel overflow-hidden p-7 sm:p-9">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
              <Sparkles className="h-4 w-4" />
              Workspace
            </div>
            <h1 className="font-serif text-3xl text-white sm:text-4xl">{content.heroTitle}</h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">{content.heroDescription}</p>
            <div className="flex items-center gap-4 rounded-[28px] border border-white/10 bg-slate-950/35 p-5">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full text-2xl font-semibold text-slate-950"
                style={{ background: user.avatar || '#f0c85a' }}
              >
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xl font-medium text-white">{user.username}</div>
                <div className="mt-1 truncate text-sm text-slate-400">{user.email}</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  void logout();
                  router.push(locale === 'zh' ? '/zh' : '/');
                }}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/8"
              >
                <LogOut className="h-4 w-4" />
                {content.signOut}
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {cards.map((card) => (
              <div key={card.label} className="rounded-[28px] border border-white/10 bg-slate-950/35 p-5">
                <div className="flex items-center justify-between text-slate-300">
                  <span>{card.icon}</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-500">{card.label}</span>
                </div>
                <div className="mt-6 text-3xl font-semibold text-white">{card.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <section className="surface-panel p-6">
          <div className="text-lg font-medium text-white">{content.sections.posts}</div>
          <div className="mt-4 space-y-3">
            {posts.length === 0 ? (
              <div className="text-sm text-slate-400">{content.empty}</div>
            ) : (
              posts.slice(0, 5).map((post) => (
                <Link
                  key={post.id}
                  href={locale === 'zh' ? `/forum/${post.id}` : `/en/forum/${post.id}`}
                  className="block rounded-2xl border border-white/10 bg-white/6 px-4 py-3 transition hover:bg-white/9"
                >
                  <div className="text-sm font-medium text-white">{post.title}</div>
                  <div className="mt-1 text-xs text-slate-400">{formatDate(locale, post.created_at)}</div>
                </Link>
              ))
            )}
          </div>
        </section>

        <section className="surface-panel p-6">
          <div className="text-lg font-medium text-white">{content.sections.comments}</div>
          <div className="mt-4 space-y-3">
            {comments.length === 0 ? (
              <div className="text-sm text-slate-400">{content.empty}</div>
            ) : (
              comments.slice(0, 5).map((comment) => (
                <div key={comment.id} className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
                  <div className="text-sm text-white">{comment.content}</div>
                  <div className="mt-1 text-xs text-slate-400">
                    {(comment.post_title || (locale === 'zh' ? '帖子评论' : 'Post comment'))} · {formatDate(locale, comment.created_at)}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="surface-panel p-6">
          <div className="text-lg font-medium text-white">{content.sections.jobs}</div>
          <div className="mt-4 space-y-3">
            {savedJobs.length === 0 ? (
              <div className="text-sm text-slate-400">{content.empty}</div>
            ) : (
              savedJobs.slice(0, 5).map((job) => (
                <Link
                  key={job.id}
                  href={locale === 'zh' ? `/zh/jobs/detail?id=${job.id}` : `/en/jobs/detail?id=${job.id}`}
                  className="block rounded-2xl border border-white/10 bg-white/6 px-4 py-3 transition hover:bg-white/9"
                >
                  <div className="text-sm font-medium text-white">{job.title}</div>
                  <div className="mt-1 text-xs text-slate-400">
                    {job.company} · {job.location}
                    {job.salary_text ? ` · ${job.salary_text}` : ''}
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        <section className="surface-panel p-6">
          <div className="text-lg font-medium text-white">{content.sections.resources}</div>
          <div className="mt-4 space-y-3">
            {savedResources.length === 0 ? (
              <div className="text-sm text-slate-400">{content.empty}</div>
            ) : (
              savedResources.slice(0, 5).map((resource) => {
                const safeUrl = getSafeExternalUrl(resource.url);

                return safeUrl ? (
                  <a
                    key={resource.id}
                    href={safeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-2xl border border-white/10 bg-white/6 px-4 py-3 transition hover:bg-white/9"
                  >
                    <div className="text-sm font-medium text-white">{resource.title}</div>
                    <div className="mt-1 line-clamp-2 text-xs leading-6 text-slate-400">{resource.description}</div>
                  </a>
                ) : (
                  <div key={resource.id} className="block rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-slate-500">
                    <div className="text-sm font-medium text-white">{resource.title}</div>
                    <div className="mt-1 line-clamp-2 text-xs leading-6">{resource.description}</div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
