import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAuthClient } from '@/lib/auth/server';
import {
  ACCESS_TOKEN_COOKIE,
  LOCAL_AUTH_COOKIE,
  REFRESH_TOKEN_COOKIE,
  clearSessionCookies,
} from '@/lib/auth/session';
import { clearLocalSession } from '@/lib/auth/local-auth';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });

  try {
    const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
    const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

    if (accessToken && refreshToken) {
      const supabase = createSupabaseAuthClient();
      if (supabase) {
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        await supabase.auth.signOut();
      }
    }

    const localToken = request.cookies.get(LOCAL_AUTH_COOKIE)?.value;
    if (localToken) {
      await clearLocalSession(localToken);
    }
  } catch {
    // Ignore upstream sign out errors and clear local cookies anyway.
  }

  clearSessionCookies(response);
  return response;
}
