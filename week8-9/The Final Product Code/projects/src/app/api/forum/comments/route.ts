import { NextRequest, NextResponse } from 'next/server';
import { createWorkspaceComment } from '@/lib/workspace-db';

function normalizeLocale(value?: string | null) {
  return value === 'zh' || value === 'cn' ? 'zh' : 'en';
}

function getOwnerKey(request: NextRequest) {
  return request.headers.get('x-user-key') || request.headers.get('x-client-id') || 'anonymous';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const postId = typeof body.post_id === 'string' ? body.post_id : '';
    const content = typeof body.content === 'string' ? body.content.trim() : '';

    if (!postId || !content) {
      return NextResponse.json({ success: false, error: 'Post id and content are required.' }, { status: 400 });
    }

    const comment = await createWorkspaceComment({
      post_id: postId,
      locale: normalizeLocale(body.locale),
      owner_key: getOwnerKey(request),
      author: typeof body.author === 'string' && body.author.trim() ? body.author.trim() : 'Guest User',
      content,
    });

    return NextResponse.json({ success: true, data: comment });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to create comment.' },
      { status: 500 },
    );
  }
}
