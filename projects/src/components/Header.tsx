'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, User, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

type Locale = 'zh' | 'en';

type NavItem = {
  href: string;
  label: string;
};

function getLocale(pathname: string): Locale {
  return pathname.startsWith('/zh') ? 'zh' : 'en';
}

function buildNav(locale: Locale): NavItem[] {
  if (locale === 'zh') {
    return [
      { href: '/zh', label: '首页' },
      { href: '/zh/jobs', label: '职位' },
      { href: '/zh/practice', label: '模拟' },
      { href: '/zh/forum', label: '论坛' },
      { href: '/zh/resources', label: '资源' },
    ];
  }

  return [
    { href: '/', label: 'Home' },
    { href: '/en/jobs', label: 'Jobs' },
    { href: '/en/practice', label: 'Practice' },
    { href: '/en/forum', label: 'Forum' },
    { href: '/en/resources', label: 'Resources' },
  ];
}

function getLanguageTarget(pathname: string, locale: Locale) {
  const mapToEn: Record<string, string> = {
    '/zh': '/',
    '/zh/chat': '/en/chat',
    '/zh/practice': '/en/practice',
    '/zh/resources': '/en/resources',
    '/zh/forum': '/en/forum',
    '/zh/jobs': '/en/jobs',
    '/zh/jobs/detail': '/en/jobs/detail',
    '/zh/jobs/tracker': '/en/jobs/tracker',
    '/zh/resume-workspace': '/en/resume-workspace',
    '/profile': '/en/profile',
    '/login': '/en/login',
  };

  const mapToZh: Record<string, string> = {
    '/': '/zh',
    '/en/chat': '/zh/chat',
    '/en/practice': '/zh/practice',
    '/en/resources': '/zh/resources',
    '/en/forum': '/zh/forum',
    '/en/jobs': '/zh/jobs',
    '/en/jobs/detail': '/zh/jobs/detail',
    '/en/jobs/tracker': '/zh/jobs/tracker',
    '/en/resume-workspace': '/zh/resume-workspace',
    '/en/profile': '/profile',
    '/en/login': '/login',
  };

  if (locale === 'zh') {
    return mapToEn[pathname] ?? '/';
  }

  return mapToZh[pathname] ?? '/zh';
}

function isActive(pathname: string, href: string) {
  if (href === '/' || href === '/zh') {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const pathname = usePathname() ?? '/';
  const locale = getLocale(pathname);
  const navItems = useMemo(() => buildNav(locale), [locale]);
  const langTarget = getLanguageTarget(pathname, locale);
  const { user, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  const profileHref = isAuthenticated
    ? locale === 'zh'
      ? '/profile'
      : '/en/profile'
    : locale === 'zh'
      ? '/login'
      : '/en/login';

  const profileLabel = isAuthenticated ? user?.username ?? 'Account' : locale === 'zh' ? '登录' : 'Login';

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/78 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={locale === 'zh' ? '/zh' : '/'} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#114737,#1e7f64_45%,#f08c38)] text-sm font-semibold text-white shadow-[0_12px_40px_rgba(15,118,110,0.35)]">
            GZ
          </div>
          <div>
            <div className="font-serif text-lg font-semibold tracking-tight text-white">
              {locale === 'zh' ? '够得着' : 'Reachable'}
            </div>
            <div className="text-[11px] uppercase tracking-[0.26em] text-slate-400">AI Career Studio</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm transition ${
                isActive(pathname, item.href) ? 'bg-white/12 text-white' : 'text-slate-300 hover:bg-white/6 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href={langTarget}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-white/20 hover:text-white"
          >
            {locale === 'zh' ? 'EN' : '中文'}
          </Link>
          <Link
            href={profileHref}
            className="flex max-w-44 items-center gap-2 rounded-full bg-white/8 px-3 py-2 text-sm text-white transition hover:bg-white/12"
          >
            {isAuthenticated && user ? (
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                style={{ background: user.avatar || '#1e7f64' }}
              >
                {user.username.charAt(0).toUpperCase()}
              </div>
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                <User className="h-4 w-4" />
              </div>
            )}
            <span className="truncate">{profileLabel}</span>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-white md:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-slate-950/96 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-2xl px-4 py-3 text-sm ${isActive(pathname, item.href) ? 'bg-white/12 text-white' : 'text-slate-300'}`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link
                href={langTarget}
                className="rounded-2xl border border-white/10 px-4 py-3 text-center text-sm text-slate-300"
                onClick={() => setOpen(false)}
              >
                {locale === 'zh' ? '切换到英文' : '切换到中文'}
              </Link>
              <Link
                href={profileHref}
                className="rounded-2xl bg-white/8 px-4 py-3 text-center text-sm text-white"
                onClick={() => setOpen(false)}
              >
                {profileLabel}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
