import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAuthClient } from '@/lib/auth/server';
import { applyLocalSessionCookie, applySessionCookies, buildAppUser } from '@/lib/auth/session';
import { createLocalUser } from '@/lib/auth/local-auth';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function pickAvatarColor() {
  const palette = ['#1e7f64', '#f08c38', '#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6'];
  return palette[Math.floor(Math.random() * palette.length)];
}

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, locale } = await request.json();

    if (!email || !EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ success: false, error: '请输入有效邮箱。' }, { status: 400 });
    }

    if (!password || password.length < 8) {
      return NextResponse.json({ success: false, error: '密码至少需要 8 位。' }, { status: 400 });
    }

    const normalizedUsername = typeof username === 'string' && username.trim()
      ? username.trim().slice(0, 40)
      : email.split('@')[0];

    const supabase = createSupabaseAuthClient();
    if (!supabase) {
      const localResult = await createLocalUser({
        username: normalizedUsername,
        email,
        password,
      });

      if (!localResult.success) {
        return NextResponse.json({ success: false, error: localResult.error }, { status: 400 });
      }

      const response = NextResponse.json({
        success: true,
        authenticated: true,
        message: 'Account created with local storage. You can use it immediately.',
        user: localResult.user,
      });
      applyLocalSessionCookie(response, localResult.token);
      return response;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: normalizedUsername,
          locale: locale === 'en' ? 'en' : 'zh',
          avatar_color: pickAvatarColor(),
        },
      },
    });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    const response = NextResponse.json({
      success: true,
      authenticated: Boolean(data.session && data.user),
      message: data.session
        ? undefined
        : '注册成功。如果你的 Supabase 项目开启了邮箱确认，请先完成邮箱验证再登录。',
      user: data.user ? buildAppUser(data.user) : null,
    });

    if (data.session) {
      applySessionCookies(response, data.session);
    }

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Sign up failed',
      },
      { status: 500 },
    );
  }
}
