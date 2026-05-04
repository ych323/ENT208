'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock3, Loader2, MessageCircle, Send, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getClientKey } from '@/lib/client-key';

type Locale = 'en' | 'zh';

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

type Comment = {
  id: string;
  author: string;
  owner_key?: string;
  content: string;
  likes: number;
  created_at: string;
};

const copy = {
  en: {
    back: 'Back to forum',
    notFound: 'Post not found',
    comments: 'Comments',
    commentPlaceholder: 'Write your comment...',
    submit: 'Post comment',
    empty: 'No comments yet. Start the thread.',
    delete: 'Delete',
    loginHint: 'Reading is open. Signing in helps you keep ownership of posts and comments.',
  },
  zh: {
    back: '返回论坛',
    notFound: '帖子不存在',
    comments: '评论',
    commentPlaceholder: '写下你的评论...',
    submit: '发表评论',
    empty: '还没有评论，先发第一条吧。',
    delete: '删除',
    loginHint: '不登录也能浏览，但登录后更方便保留帖子和评论的归属。',
  },
} as const;

export function ForumDetail({ locale }: { locale: Locale }) {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [actorKey, setActorKey] = useState('anonymous');
  const text = copy[locale];
  const postId = typeof params.id === 'string' ? params.id : '';
  const forumHref = locale === 'zh' ? '/zh/forum' : '/en/forum';
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    setActorKey(user?.id || getClientKey());
  }, [user?.id]);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      try {
        const response = await fetch(`/api/forum/posts/${postId}?lang=${locale}`, { cache: 'no-store' });
        const payload = await response.json();
        if (!active) return;
        if (!payload.success) {
          setPost(null);
          setComments([]);
          return;
        }

        setPost(payload.post);
        setComments(Array.isArray(payload.comments) ? payload.comments : []);
      } finally {
        if (active) setLoading(false);
      }
    }

    if (postId) {
      void load();
    }

    return () => {
      active = false;
    };
  }, [locale, postId]);

  async function submitComment() {
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const response = await fetch('/api/forum/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-key': actorKey,
        },
        body: JSON.stringify({
          locale,
          post_id: postId,
          author: user?.username || 'Guest User',
          content: commentText.trim(),
        }),
      });
      const payload = await response.json();
      if (payload.success) {
        setComments((current) => [payload.data, ...current]);
        setCommentText('');
        setPost((current) => (current ? { ...current, comments_count: current.comments_count + 1 } : current));
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteComment(commentId: string) {
    const response = await fetch(`/api/forum/comments/${commentId}`, {
      method: 'DELETE',
      headers: { 'x-user-key': actorKey },
    });
    const payload = await response.json();
    if (payload.success) {
      setComments((current) => current.filter((item) => item.id !== commentId));
      setPost((current) => (current ? { ...current, comments_count: Math.max(0, current.comments_count - 1) } : current));
    }
  }

  async function deletePost() {
    const response = await fetch(`/api/forum/posts/${postId}?lang=${locale}`, {
      method: 'DELETE',
      headers: { 'x-user-key': actorKey },
    });
    const payload = await response.json();
    if (payload.success) {
      router.push(forumHref);
    }
  }

  if (loading) {
    return (
      <div className="page-shell py-10">
        <div className="surface-panel flex h-48 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="page-shell py-10">
        <div className="surface-panel px-8 py-14 text-center">
          <div className="text-lg font-medium text-white">{text.notFound}</div>
          <Link href={forumHref} className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm text-slate-950">
            {text.back}
          </Link>
        </div>
      </div>
    );
  }

  const canDeletePost = Boolean(post.owner_key && post.owner_key === actorKey);

  return (
    <div className="page-shell pb-20 pt-8">
      <section className="surface-panel p-7 sm:p-9">
        <Link href={forumHref} className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          {text.back}
        </Link>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">
            {post.category}
          </span>
          {post.company ? (
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">
              {post.company}
            </span>
          ) : null}
        </div>

        <h1 className="mt-5 font-serif text-3xl text-white sm:text-4xl">{post.title}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-400">
          <span>{post.author}</span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-4 w-4" />
            {new Date(post.created_at).toLocaleString(locale === 'zh' ? 'zh-CN' : 'en-US')}
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            {post.comments_count}
          </span>
          {canDeletePost ? (
            <button type="button" onClick={() => void deletePost()} className="text-rose-300 transition hover:text-rose-200">
              {text.delete}
            </button>
          ) : null}
        </div>

        <div className="mt-6 whitespace-pre-wrap text-sm leading-8 text-slate-200">{post.content}</div>
        {post.tags ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.split(',').map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                {tag.trim()}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      <section className="surface-panel mt-6 p-7 sm:p-9">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-medium text-white">
            {text.comments} ({comments.length})
          </h2>
          <div className="text-xs text-slate-400">{text.loginHint}</div>
        </div>

        <div className="mt-5 grid gap-3">
          <textarea
            rows={4}
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            placeholder={text.commentPlaceholder}
            className="rounded-[24px] border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-500"
          />
          <button
            type="button"
            onClick={() => void submitComment()}
            disabled={submitting || !commentText.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-100 disabled:opacity-60"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {text.submit}
          </button>
        </div>

        <div className="mt-8 space-y-4">
          {comments.length === 0 ? (
            <div className="rounded-[24px] border border-white/10 bg-slate-950/35 px-5 py-6 text-sm text-slate-400">
              {text.empty}
            </div>
          ) : (
            comments.map((comment) => {
              const canDelete = Boolean(comment.owner_key && comment.owner_key === actorKey);
              return (
                <div key={comment.id} className="rounded-[24px] border border-white/10 bg-slate-950/35 px-5 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-medium text-white">{comment.author}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        {new Date(comment.created_at).toLocaleString(locale === 'zh' ? 'zh-CN' : 'en-US')}
                      </div>
                    </div>
                    {canDelete ? (
                      <button
                        type="button"
                        onClick={() => void deleteComment(comment.id)}
                        className="inline-flex items-center gap-2 text-sm text-rose-300 transition hover:text-rose-200"
                      >
                        <Trash2 className="h-4 w-4" />
                        {text.delete}
                      </button>
                    ) : null}
                  </div>
                  <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-200">{comment.content}</div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
