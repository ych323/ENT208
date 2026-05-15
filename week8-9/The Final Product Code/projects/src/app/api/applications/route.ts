import { NextRequest, NextResponse } from 'next/server';
import { listApplications, upsertApplication } from '@/lib/workspace-db';

function getUserKey(request: NextRequest) {
  return request.headers.get('x-user-key') || request.headers.get('x-client-id') || 'anonymous';
}

export async function GET(request: NextRequest) {
  const data = await listApplications(getUserKey(request));
  return NextResponse.json({ success: true, data });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const record = await upsertApplication({
      id: typeof body.id === 'string' ? body.id : undefined,
      user_key: getUserKey(request),
      job_id: typeof body.job_id === 'string' ? body.job_id : `manual-${Date.now()}`,
      title: typeof body.title === 'string' ? body.title : 'Untitled role',
      company: typeof body.company === 'string' ? body.company : 'Unknown company',
      location: typeof body.location === 'string' ? body.location : '',
      source_url: typeof body.source_url === 'string' ? body.source_url : '',
      status: body.status || 'saved',
      notes: typeof body.notes === 'string' ? body.notes : '',
      fit_score: typeof body.fit_score === 'number' ? body.fit_score : undefined,
      fit_summary: typeof body.fit_summary === 'string' ? body.fit_summary : '',
      fit_strengths: Array.isArray(body.fit_strengths) ? body.fit_strengths.filter((item: unknown) => typeof item === 'string') : [],
      fit_gaps: Array.isArray(body.fit_gaps) ? body.fit_gaps.filter((item: unknown) => typeof item === 'string') : [],
      fit_next_steps: Array.isArray(body.fit_next_steps) ? body.fit_next_steps.filter((item: unknown) => typeof item === 'string') : [],
    });

    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to save application.' },
      { status: 500 },
    );
  }
}
