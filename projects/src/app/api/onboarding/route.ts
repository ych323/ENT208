import { NextRequest, NextResponse } from 'next/server';
import { getOnboarding, saveOnboarding } from '@/lib/workspace-db';

function getUserKey(request: NextRequest) {
  return request.headers.get('x-user-key') || request.headers.get('x-client-id') || 'anonymous';
}

export async function GET(request: NextRequest) {
  const record = await getOnboarding(getUserKey(request));
  return NextResponse.json({ success: true, data: record });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const locale = body.locale === 'zh' ? 'zh' : 'en';
    const answers = typeof body.answers === 'object' && body.answers ? body.answers : {};
    const skipped = Boolean(body.skipped);

    const record = await saveOnboarding({
      user_key: getUserKey(request),
      locale,
      skipped,
      answers,
    });

    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to save onboarding.' },
      { status: 500 },
    );
  }
}
