import { NextRequest, NextResponse } from 'next/server';
import { deleteWorkspaceComment } from '@/lib/workspace-db';

function getOwnerKey(request: NextRequest) {
  return request.headers.get('x-user-key') || request.headers.get('x-client-id') || 'anonymous';
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const deleted = await deleteWorkspaceComment(id, getOwnerKey(request));

  if (!deleted) {
    return NextResponse.json({ success: false, error: 'Comment not found or cannot be deleted.' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
