import { NextRequest, NextResponse } from 'next/server';
import { forumSeedPosts } from '@/lib/forum-seed';
import { createWorkspacePost, listWorkspacePosts } from '@/lib/workspace-db';

const categoryMap = {
  interview: 'Interview Experience',
  jobs: 'Job Discussion',
  study: 'Study Check-in',
  help: 'Job Help',
} as const;

function normalizeLocale(value?: string | null) {
  return value === 'zh' || value === 'cn' ? 'zh' : 'en';
}

function normalizeCategory(value?: string | null) {
  if (!value) return '';
  const lowered = value.toLowerCase();
  if (lowered === 'all' || lowered === '全部') return '';
  if (lowered in categoryMap) return categoryMap[lowered as keyof typeof categoryMap];
  if (value === 'Interview Experience' || value === 'Job Discussion' || value === 'Study Check-in' || value === 'Job Help') {
    return value;
  }
  return value;
}

function getOwnerKey(request: NextRequest) {
  return request.headers.get('x-user-key') || request.headers.get('x-client-id') || 'anonymous';
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locale = normalizeLocale(searchParams.get('lang'));
  const category = normalizeCategory(searchParams.get('category'));
  const sort = searchParams.get('sort') || 'latest';
  const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1);
  const pageSize = Math.max(parseInt(searchParams.get('pageSize') || '10', 10), 1);

  const dbPosts = await listWorkspacePosts(locale);
  let posts = [...forumSeedPosts.filter((post) => post.locale === locale), ...dbPosts];

  if (category) {
    posts = posts.filter((post) => post.category === category);
  }

  if (sort === 'hot') {
    posts.sort((a, b) => b.views - a.views);
  } else if (sort === 'top') {
    posts.sort((a, b) => b.likes - a.likes);
  } else {
    posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  const total = posts.length;
  const offset = (page - 1) * pageSize;
  const data = posts.slice(offset, offset + pageSize);

  return NextResponse.json({
    success: true,
    data,
    total,
    page,
    pageSize,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const locale = normalizeLocale(body.locale);
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const content = typeof body.content === 'string' ? body.content.trim() : '';

    if (!title || !content) {
      return NextResponse.json({ success: false, error: 'Title and content are required.' }, { status: 400 });
    }

    const post = await createWorkspacePost({
      locale,
      owner_key: getOwnerKey(request),
      author: typeof body.author === 'string' && body.author.trim() ? body.author.trim() : 'Guest User',
      title,
      content,
      category: normalizeCategory(body.category) || 'Job Discussion',
      tags: typeof body.tags === 'string' ? body.tags.trim() : '',
      target_job: typeof body.target_job === 'string' ? body.target_job.trim() : '',
      company: typeof body.company === 'string' ? body.company.trim() : '',
    });

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to create post.' },
      { status: 500 },
    );
  }
}
