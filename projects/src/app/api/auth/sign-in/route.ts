import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAuthClient } from '@/lib/auth/server';
import { applyLocalSessionCookie, applySessionCookies, buildAppUser } from '@/lib/auth/session';
import { signInLocalUser } from '@/lib/auth/local-auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: '邮箱和密码不能为空。' }, { status: 400 });
    }

    const supabase = createSupabaseAuthClient();
    if (!supabase) {
      const localResult = await signInLocalUser(email, password);
      if (!localResult.success) {
        return NextResponse.json({ success: false, error: localResult.error }, { status: 401 });
      }

      const response = NextResponse.json({
        success: true,
        authenticated: true,
        user: localResult.user,
        message: 'Signed in with local account storage.',
      });
      applyLocalSessionCookie(response, localResult.token);
      return response;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.session || !data.user) {
      return NextResponse.json(
        { success: false, error: error?.message || '登录失败，请检查账号和密码。' },
        { status: 401 },
      );
    }

    const response = NextResponse.json({
      success: true,
      authenticated: true,
      user: buildAppUser(data.user),
    });

    applySessionCookies(response, data.session);
    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Sign in failed',
      },
      { status: 500 },
    );
  }
}
