'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LockKeyhole, Mail, Sparkles, UserRound } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type Locale = 'zh' | 'en';
type Mode = 'sign-in' | 'sign-up';

const copy = {
  zh: {
    badge: '真实账号体系',
    title: '登录你的求职工作台',
    subtitle: '用真实账户保存收藏、论坛互动和后续能力定位记录。',
    signIn: '登录',
    signUp: '注册',
    username: '用户名',
    email: '邮箱',
    password: '密码',
    usernamePlaceholder: '例如：qian同学',
    emailPlaceholder: 'name@example.com',
    passwordPlaceholder: '至少 8 位密码',
    submitSignIn: '登录账户',
    submitSignUp: '创建账户',
    switchToSignIn: '已经有账号了？去登录',
    switchToSignUp: '还没有账号？去注册',
    homeLabel: '返回首页',
    helper: '未配置云端账号服务时，会自动使用本地账号存储；配置后可无缝切换到正式认证。',
  },
  en: {
    badge: 'Real account system',
    title: 'Access your career workspace',
    subtitle: 'Use a real account to save jobs, join forum discussions, and keep your positioning history.',
    signIn: 'Sign in',
    signUp: 'Sign up',
    username: 'Username',
    email: 'Email',
    password: 'Password',
    usernamePlaceholder: 'For example: reachable-user',
    emailPlaceholder: 'name@example.com',
    passwordPlaceholder: 'At least 8 characters',
    submitSignIn: 'Sign in',
    submitSignUp: 'Create account',
    switchToSignIn: 'Already have an account? Sign in',
    switchToSignUp: 'No account yet? Create one',
    homeLabel: 'Back to home',
    helper: 'If cloud auth is not configured yet, the app falls back to local account storage and secure cookies.',
  },
} as const;

export function AuthScreen({ locale }: { locale: Locale }) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, login, signup } = useAuth();
  const [mode, setMode] = useState<Mode>('sign-in');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const text = copy[locale];

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      router.replace(locale === 'zh' ? '/profile' : '/en/profile');
    }
  }, [isAuthenticated, isLoading, locale, router, user]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');

    const result = mode === 'sign-in'
      ? await login(email, password)
      : await signup({ username, email, password, locale });

    if (result.success) {
      if (result.message) {
        setMessage(result.message);
      }

      if (mode === 'sign-in' || result.authenticated) {
        router.push(locale === 'zh' ? '/profile' : '/en/profile');
      }
    } else {
      setError(result.error || 'Request failed');
    }

    setSubmitting(false);
  }

  return (
    <div className="page-shell flex min-h-[78vh] items-center py-10">
      <div className="grid w-full gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="surface-panel relative overflow-hidden p-7 sm:p-9">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(31,149,118,0.22),transparent_35%)]" />
          <div className="relative space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-emerald-100">
              <Sparkles className="h-4 w-4" />
              {text.badge}
            </div>
            <h1 className="max-w-xl font-serif text-3xl text-white sm:text-4xl">{text.title}</h1>
            <p className="max-w-xl text-sm leading-7 text-slate-300 sm:text-base">{text.subtitle}</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                locale === 'zh' ? '论坛互动记录' : 'Forum history',
                locale === 'zh' ? '岗位与资源收藏' : 'Saved jobs and resources',
                locale === 'zh' ? '安全 Cookie 会话' : 'Secure cookie sessions',
              ].map((item) => (
                <div key={item} className="rounded-[24px] border border-white/10 bg-slate-950/40 px-4 py-4 text-sm text-slate-300">
                  {item}
                </div>
              ))}
            </div>
            <p className="text-xs leading-6 text-slate-400">{text.helper}</p>
            <Link
              href={locale === 'zh' ? '/zh' : '/'}
              className="inline-flex rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/8"
            >
              {text.homeLabel}
            </Link>
          </div>
        </section>

        <section className="surface-panel p-7 sm:p-9">
          <div className="mb-6 flex rounded-full bg-white/6 p-1">
            {(['sign-in', 'sign-up'] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setMode(value);
                  setError('');
                  setMessage('');
                }}
                className={`flex-1 rounded-full px-4 py-2 text-sm transition ${
                  mode === value ? 'bg-white text-slate-950' : 'text-slate-300'
                }`}
              >
                {value === 'sign-in' ? text.signIn : text.signUp}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'sign-up' && (
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                  <UserRound className="h-4 w-4" />
                  {text.username}
                </span>
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder={text.usernamePlaceholder}
                  className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-300/30 focus:outline-none"
                />
              </label>
            )}

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                <Mail className="h-4 w-4" />
                {text.email}
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={text.emailPlaceholder}
                className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-300/30 focus:outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                <LockKeyhole className="h-4 w-4" />
                {text.password}
              </span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={text.passwordPlaceholder}
                className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-300/30 focus:outline-none"
              />
            </label>

            {error ? (
              <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            ) : null}

            {message ? (
              <div className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">
                {message}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#1d8f70,#f08c38)] px-6 py-3 text-sm font-medium text-slate-950 shadow-[0_16px_60px_rgba(240,140,56,0.22)] transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {mode === 'sign-in' ? text.submitSignIn : text.submitSignUp}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode((current) => (current === 'sign-in' ? 'sign-up' : 'sign-in'));
              setError('');
              setMessage('');
            }}
            className="mt-4 text-sm text-slate-300 transition hover:text-white"
          >
            {mode === 'sign-in' ? text.switchToSignUp : text.switchToSignIn}
          </button>
        </section>
      </div>
    </div>
  );
}
