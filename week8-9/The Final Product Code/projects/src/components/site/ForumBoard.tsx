'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Clock3, Eye, Flame, MessageCircle, PencilLine } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getClientKey } from '@/lib/client-key';
import type { SiteLocale } from '@/lib/site-content';

type Post = {
  id: string;
  author: string;
  owner_key?: string;
  title: string;
  content: string;
  category: string;
  tags: string;
  company: string;
  views: number;
  likes: number;
  comments_count: number;
  created_at: string;
};

const categories = {
  zh: [
    ['全部', '全部'],
    ['面试经验', '面试经验'],
    ['岗位讨论', '岗位讨论'],
    ['学习打卡', '学习打卡'],
    ['求职互助', '求职互助'],
  ],
  en: [
    ['全部', 'All'],
    ['Interview Experience', 'Interview'],
    ['Job Discussion', 'Jobs'],
    ['Study Check-in', 'Study'],
    ['Job Help', 'Help'],
  ],
} as const;

const copy = {
  zh: {
    heroTitle: '把面经、岗位判断和求职互助放到同一个讨论场。',
    heroDescription: '帖子会直接走后端存储。登录后，你发布的内容会保留归属，方便之后继续追踪和删除。',
    createButton: '发帖',
    createTitle: '新帖子',
    titleLabel: '标题',
    companyLabel: '公司或方向',
    contentLabel: '正文',
    tagsLabel: '标签，逗号分隔',
    submitButton: '发布帖子',
    emptyTitle: '还没有帖子',
    emptyDescription: '先发第一篇，把真实问题抛出来。',
    latest: '最新',
    hot: '最热',
    top: '最高赞',
    myPost: '我的帖子',
    delete: '删除',
  },
  en: {
    heroTitle: 'Keep interview notes, job judgment, and peer help in one discussion layer.',
    heroDescription: 'Posts now go through backend storage. When you sign in, your content keeps clear ownership so it is easier to revisit or remove later.',
    createButton: 'Create post',
    createTitle: 'New post',
    titleLabel: 'Title',
    companyLabel: 'Company or role track',
    contentLabel: 'Write the post body',
    tagsLabel: 'Tags, separated by commas',
    submitButton: 'Publish post',
    emptyTitle: 'No posts yet',
    emptyDescription: 'Start the board with a real question or takeaway.',
    latest: 'Latest',
    hot: 'Hot',
    top: 'Top',
    myPost: 'My post',
    delete: 'Delete',
  },
} as const;

function formatTime(locale: SiteLocale, input: string) {
  const date = new Date(input);
  const diff = Date.now() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (locale === 'zh') {
    if (hours < 1) return '刚刚';
    if (hours < 24) return `${hours} 小时前`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} 天前`;
    return date.toLocaleDateString('zh-CN');
  }

  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US');
}

export function ForumBoard({ locale }: { locale: SiteLocale }) {
  const { user } = useAuth();
  const [actorKey, setActorKey] = useState('anonymous');
  const text = copy[locale];
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(locale === 'zh' ? '全部' : 'All');
  const [sort, setSort] = useState<'latest' | 'hot' | 'top'>('latest');
  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState({
    title: '',
    company: '',
    content: '',
    tags: '',
    category: locale === 'zh' ? '面试经验' : 'Interview Experience',
  });

  useEffect(() => {
    setActorKey(user?.id || getClientKey());
  }, [user?.id]);

  useEffect(() => {
    setCategory(locale === 'zh' ? '全部' : 'All');
    setDraft({
      title: '',
      company: '',
      content: '',
      tags: '',
      category: locale === 'zh' ? '面试经验' : 'Interview Experience',
    });
  }, [locale]);

  useEffect(() => {
    let active = true;

    async function fetchPosts() {
      setLoading(true);
      const params = new URLSearchParams({ sort });
      if (locale === 'en') params.set('lang', 'en');
      if (category !== '全部' && category !== 'All') params.set('category', category);

      try {
        const response = await fetch(`/api/forum/posts?${params.toString()}`, { cache: 'no-store' });
        const data = await response.json();
        if (!active) return;
        setPosts(data.success ? data.data : []);
      } finally {
        if (active) setLoading(false);
      }
    }

    void fetchPosts();
    return () => {
      active = false;
    };
  }, [category, locale, sort]);

  async function publishPost() {
    if (!draft.title.trim() || !draft.content.trim()) return;

    const response = await fetch('/api/forum/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-key': actorKey,
      },
      body: JSON.stringify({
        locale,
        author: user?.username || (locale === 'zh' ? '访客用户' : 'Guest User'),
        title: draft.title,
        content: draft.content,
        company: draft.company,
        tags: draft.tags,
        category: draft.category,
      }),
    });

    const payload = await response.json();
    if (!payload.success) return;

    setPosts((current) => [payload.data, ...current]);
    setDraft({
      title: '',
      company: '',
      content: '',
      tags: '',
      category: locale === 'zh' ? '面试经验' : 'Interview Experience',
    });
    setComposerOpen(false);
  }

  async function deletePost(postId: string) {
    const response = await fetch(`/api/forum/posts/${postId}?lang=${locale}`, {
      method: 'DELETE',
      headers: { 'x-user-key': actorKey },
    });
    const payload = await response.json();
    if (payload.success) {
      setPosts((current) => current.filter((item) => item.id !== postId));
    }
  }

  const detailPrefix = locale === 'zh' ? '/forum/' : '/en/forum/';

  return (
    <div className="page-shell pb-20 pt-8">
      <section className="surface-panel p-7 sm:p-9">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
              <Flame className="h-4 w-4" />
              Community
            </div>
            <h1 className="mt-4 font-serif text-3xl text-white sm:text-4xl">{text.heroTitle}</h1>
            <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">{text.heroDescription}</p>
          </div>
          <button
            type="button"
            onClick={() => setComposerOpen((value) => !value)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-100"
          >
            <PencilLine className="h-4 w-4" />
            {text.createButton}
          </button>
        </div>

        {composerOpen ? (
          <div className="mt-6 grid gap-3 rounded-[28px] border border-white/10 bg-slate-950/35 p-5">
            <h2 className="text-lg font-medium text-white">{text.createTitle}</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <input
                value={draft.title}
                onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                placeholder={text.titleLabel}
                className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-500"
              />
              <input
                value={draft.company}
                onChange={(event) => setDraft((current) => ({ ...current, company: event.target.value }))}
                placeholder={text.companyLabel}
                className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-500"
              />
            </div>
            <select
              value={draft.category}
              onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}
              className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white"
            >
              {categories[locale].filter(([value]) => value !== '全部').map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <textarea
              rows={6}
              value={draft.content}
              onChange={(event) => setDraft((current) => ({ ...current, content: event.target.value }))}
              placeholder={text.contentLabel}
              className="rounded-[24px] border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-500"
            />
            <input
              value={draft.tags}
              onChange={(event) => setDraft((current) => ({ ...current, tags: event.target.value }))}
              placeholder={text.tagsLabel}
              className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-500"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => void publishPost()}
                className="rounded-full bg-[linear-gradient(135deg,#1d8f70,#f08c38)] px-5 py-3 text-sm font-medium text-slate-950"
              >
                {text.submitButton}
              </button>
            </div>
          </div>
        ) : null}
      </section>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories[locale].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setCategory(value)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                category === value ? 'bg-white text-slate-950' : 'bg-white/6 text-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {([
            ['latest', text.latest],
            ['hot', text.hot],
            ['top', text.top],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setSort(value)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                sort === value ? 'bg-white text-slate-950' : 'bg-white/6 text-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="surface-panel h-36 animate-pulse bg-white/5" />
          ))
        ) : posts.length === 0 ? (
          <div className="surface-panel px-8 py-14 text-center">
            <div className="text-lg font-medium text-white">{text.emptyTitle}</div>
            <p className="mt-2 text-sm text-slate-400">{text.emptyDescription}</p>
          </div>
        ) : (
          posts.map((post) => {
            const own = Boolean(post.owner_key && post.owner_key === actorKey);
            return (
              <div key={post.id} className="surface-panel border border-white/10 bg-white/6 p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-emerald-300/12 p-3 text-emerald-100">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-100">{post.category}</span>
                      {post.company ? (
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-100">{post.company}</span>
                      ) : null}
                      {own ? (
                        <span className="rounded-full bg-emerald-300/12 px-3 py-1 text-xs text-emerald-100">{text.myPost}</span>
                      ) : null}
                    </div>
                    <Link href={`${detailPrefix}${post.id}`} className="text-xl font-medium text-white transition hover:text-slate-200">
                      {post.title}
                    </Link>
                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-300">{post.content}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                      <span>{post.author}</span>
                      <span className="inline-flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {post.views}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {post.comments_count}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="h-4 w-4" />
                        {formatTime(locale, post.created_at)}
                      </span>
                      {own ? (
                        <button type="button" onClick={() => void deletePost(post.id)} className="text-rose-300">
                          {text.delete}
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
