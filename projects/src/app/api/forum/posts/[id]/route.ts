import { NextRequest, NextResponse } from 'next/server';
import { forumSeedComments, forumSeedPosts } from '@/lib/forum-seed';
import { deleteWorkspacePost, getWorkspacePost, incrementWorkspacePostViews } from '@/lib/workspace-db';

function normalizeLocale(value?: string | null) {
  return value === 'zh' || value === 'cn' ? 'zh' : 'en';
}

function getOwnerKey(request: NextRequest) {
  return request.headers.get('x-user-key') || request.headers.get('x-client-id') || 'anonymous';
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const locale = normalizeLocale(new URL(request.url).searchParams.get('lang'));
  const seededPost = forumSeedPosts.find((post) => post.id === id && post.locale === locale) || null;

  if (seededPost) {
    const comments = forumSeedComments.filter((comment) => comment.post_id === id && comment.locale === locale);
    return NextResponse.json({ success: true, post: seededPost, comments });
  }

  await incrementWorkspacePostViews(id);
  const { post, comments } = await getWorkspacePost(id);

  if (!post) {
    return NextResponse.json({ success: false, error: 'Post not found.' }, { status: 404 });
  }

  return NextResponse.json({ success: true, post, comments });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const deleted = await deleteWorkspacePost(id, getOwnerKey(request));

  if (!deleted) {
    return NextResponse.json({ success: false, error: 'Post not found or cannot be deleted.' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
