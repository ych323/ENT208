import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAuthClient } from '@/lib/auth/server';
import {
  ACCESS_TOKEN_COOKIE,
  LOCAL_AUTH_COOKIE,
  REFRESH_TOKEN_COOKIE,
  applySessionCookies,
  buildAppUser,
  clearSessionCookies,
} from '@/lib/auth/session';
import { getLocalUserBySession } from '@/lib/auth/local-auth';

export async function GET(request: NextRequest) {
  const supabase = createSupabaseAuthClient();
  if (!supabase) {
    const localToken = request.cookies.get(LOCAL_AUTH_COOKIE)?.value;
    if (!localToken) {
      return NextResponse.json({ success: true, authenticated: false, user: null, configured: false });
    }

    const localUser = await getLocalUserBySession(localToken);
    return NextResponse.json({
      success: true,
      authenticated: Boolean(localUser),
      user: localUser,
      configured: false,
    });
  }

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ success: true, authenticated: false, user: null });
  }

  try {
    const sessionResult = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (sessionResult.error || !sessionResult.data.session || !sessionResult.data.user) {
      const expired = NextResponse.json({ success: true, authenticated: false, user: null });
      clearSessionCookies(expired);
      return expired;
    }

    const response = NextResponse.json({
      success: true,
      authenticated: true,
      user: buildAppUser(sessionResult.data.user),
    });

    applySessionCookies(response, sessionResult.data.session);
    return response;
  } catch (error) {
    const response = NextResponse.json(
      {
        success: false,
        authenticated: false,
        user: null,
        error: error instanceof Error ? error.message : 'Session lookup failed',
      },
      { status: 500 },
    );
    clearSessionCookies(response);
    return response;
  }
}
