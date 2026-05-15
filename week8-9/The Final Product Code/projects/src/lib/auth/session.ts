import type { NextResponse } from 'next/server';
import type { Session, User } from '@supabase/supabase-js';

export const ACCESS_TOKEN_COOKIE = 'reachable-access-token';
export const REFRESH_TOKEN_COOKIE = 'reachable-refresh-token';
export const LOCAL_AUTH_COOKIE = 'reachable-local-session';

export type AppUser = {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
};

const AVATAR_PALETTE = ['#1e7f64', '#f08c38', '#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6'];

function deriveUsername(user: User) {
  const metadataUsername = typeof user.user_metadata?.username === 'string'
    ? user.user_metadata.username.trim()
    : '';

  if (metadataUsername) {
    return metadataUsername;
  }

  const emailPrefix = user.email?.split('@')[0]?.trim();
  return emailPrefix || 'reachable-user';
}

function deriveAvatar(user: User) {
  const avatarColor = typeof user.user_metadata?.avatar_color === 'string'
    ? user.user_metadata.avatar_color
    : '';

  if (avatarColor) {
    return avatarColor;
  }

  const seed = `${user.id}${user.email ?? ''}`;
  const index = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[index];
}

export function buildAppUser(user: User): AppUser {
  return {
    id: user.id,
    username: deriveUsername(user),
    email: user.email ?? '',
    avatar: deriveAvatar(user),
    createdAt: user.created_at ?? new Date().toISOString(),
  };
}

export function applySessionCookies(response: NextResponse, session: Session) {
  const maxAge = session.expires_in ?? 60 * 60 * 24 * 7;

  response.cookies.set({
    name: ACCESS_TOKEN_COOKIE,
    value: session.access_token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  });

  response.cookies.set({
    name: REFRESH_TOKEN_COOKIE,
    value: session.refresh_token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearSessionCookies(response: NextResponse) {
  response.cookies.set({
    name: ACCESS_TOKEN_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });

  response.cookies.set({
    name: REFRESH_TOKEN_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });

  response.cookies.set({
    name: LOCAL_AUTH_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}

export function applyLocalSessionCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: LOCAL_AUTH_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}
