'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { AppUser } from '@/lib/auth/session';

type AuthResult = {
  success: boolean;
  authenticated?: boolean;
  message?: string;
  error?: string;
};

type SignupInput = {
  username: string;
  email: string;
  password: string;
  locale?: 'zh' | 'en';
};

interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (input: SignupInput) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function parseAuthResponse(response: Response) {
  const payload = (await response.json().catch(() => null)) as
    | { success?: boolean; authenticated?: boolean; message?: string; error?: string; user?: AppUser | null }
    | null;

  if (!response.ok || !payload?.success) {
    return {
      ok: false,
      error: payload?.error || 'Auth request failed',
      authenticated: false,
      user: null,
      message: payload?.message,
    };
  }

  return {
    ok: true,
    error: undefined,
    authenticated: Boolean(payload.authenticated),
    user: payload.user ?? null,
    message: payload.message,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        cache: 'no-store',
      });
      const payload = await response.json().catch(() => null) as
        | { authenticated?: boolean; user?: AppUser | null }
        | null;

      if (response.ok && payload?.authenticated && payload.user) {
        setUser(payload.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch('/api/auth/sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const payload = await parseAuthResponse(response);
    if (payload.ok && payload.user) {
      setUser(payload.user);
    }

    return {
      success: payload.ok,
      authenticated: payload.authenticated,
      message: payload.message,
      error: payload.error,
    };
  }, []);

  const signup = useCallback(async (input: SignupInput) => {
    const response = await fetch('/api/auth/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    const payload = await parseAuthResponse(response);
    if (payload.ok && payload.user && payload.authenticated) {
      setUser(payload.user);
    }

    return {
      success: payload.ok,
      authenticated: payload.authenticated,
      message: payload.message,
      error: payload.error,
    };
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/sign-out', { method: 'POST' });
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      signup,
      logout,
      refreshUser,
    }),
    [isLoading, login, logout, refreshUser, signup, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
