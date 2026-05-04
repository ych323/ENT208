'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  Compass,
  GraduationCap,
  MessagesSquare,
  Orbit,
  Sparkles,
} from 'lucide-react';
import { ParticleField } from '@/components/site/ParticleField';
import type { SiteLocale } from '@/lib/site-content';

type Props = {
  locale: SiteLocale;
};

const pillarIcons = [Compass, BriefcaseBusiness, GraduationCap, MessagesSquare];

const content = {
  en: {
    badge: 'Career Intelligence Layer',
    title: 'Know Your Worth.\nFind Your Path.',
    description:
      'Reachable turns vague job anxiety into a sharper positioning read, a tighter role target, and a concrete preparation path. It is designed to feel calm, precise, and usable.',
    primaryCta: 'Start Positioning',
    secondaryCta: 'View Job Library',
    proof: [
      { value: '100+', label: 'offline-safe real jobs' },
      { value: '64', label: 'curated resources' },
      { value: '1', label: 'unified workspace' },
    ],
    radarTitle: 'Positioning radar',
    radarBody:
      'Measure current signal, role fit, and missing evidence without dropping into generic advice.',
    radarPoints: [
      'Ability profile from projects, skills, and internships',
      'Role matching against a broader real job pool',
      'Action guidance with resources and next applications',
    ],
    pillars: [
      {
        title: 'Assessment',
        description: 'Turn fragmented background details into a tighter picture of actual employability.',
      },
      {
        title: 'Job Matching',
        description: 'Use real openings to calibrate what is realistic now, later, and not worth chasing yet.',
      },
      {
        title: 'Learning System',
        description: 'Move from role gap to resource selection without switching mental context.',
      },
      {
        title: 'Peer Context',
        description: 'Keep notes, questions, and examples visible so preparation does not happen in isolation.',
      },
    ],
    strips: [
      'Minimal interface, stronger signal',
      'Subtle motion, no visual noise',
      'Built for focused career decisions',
    ],
    ctaTitle: 'Start with one honest input. The system can narrow the rest.',
    ctaBody:
      'You do not need a polished story to begin. A major, a project, or a rough target role is enough to start building a clearer route.',
    forumLabel: 'See peer discussion',
    utilityLinks: [
      { href: '/en/practice', label: 'Open Practice Studio' },
      { href: '/en/jobs/tracker', label: 'Open Application Tracker' },
      { href: '/en/resume-workspace', label: 'Open Resume Workspace' },
    ],
  },
  zh: {
    badge: 'Career Intelligence Layer',
    title: '先把自己放到更准确的位置，再决定投向哪里。',
    description:
      'Reachable 把模糊的求职焦虑收束成更清晰的能力判断、岗位方向和准备路径。界面会更安静，信息会更克制，重点是帮你做决定。',
    primaryCta: '开始能力定位',
    secondaryCta: '查看职位库',
    proof: [
      { value: '100+', label: '断网可看的真实岗位' },
      { value: '64', label: '精选资源条目' },
      { value: '1', label: '统一求职工作台' },
    ],
    radarTitle: '定位雷达',
    radarBody:
      '从项目、技能、实习和目标岗位里提取信号，帮助你判断现在该冲什么、补什么、暂缓什么。',
    radarPoints: [
      '基于经历生成能力画像',
      '用真实岗位校准匹配度',
      '把差距收束成下一步动作',
    ],
    pillars: [
      {
        title: '能力定位',
        description: '把零散经历整理成更可信的求职起点，而不是停留在抽象自我介绍。',
      },
      {
        title: '岗位匹配',
        description: '用真实岗位判断哪些方向现在能投，哪些只是表面感兴趣。',
      },
      {
        title: '资源系统',
        description: '从岗位差距直接过渡到资源补课，不再来回切换页面和思路。',
      },
      {
        title: '同路人语境',
        description: '把问题、经验和面经放在同一处，减少孤立准备带来的误判。',
      },
    ],
    strips: [
      '更少装饰，更强判断',
      '动态克制，不喧宾夺主',
      '围绕真实求职动作设计',
    ],
    ctaTitle: '你只要先给出一个真实输入，后面的路径可以一起收窄。',
    ctaBody:
      '不需要一开始就讲得很完整。一个专业、一个项目，或者一个模糊目标岗位，就已经足够开始。',
    forumLabel: '看看同路人在讨论什么',
    utilityLinks: [
      { href: '/zh/practice', label: '查看模拟练习' },
      { href: '/zh/jobs/tracker', label: '查看投递追踪' },
      { href: '/zh/resume-workspace', label: '查看简历工作台' },
    ],
  },
} as const;

export function HomePage({ locale }: Props) {
  const copy = content[locale];
  const jobsHref = locale === 'zh' ? '/zh/jobs' : '/en/jobs';
  const forumHref = locale === 'zh' ? '/zh/forum' : '/en/forum';
  const chatHref = '/en/chat';

  return (
    <div className="relative isolate overflow-hidden">
      <div className="absolute inset-0 bg-[#071116]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.09),transparent_34%),radial-gradient(circle_at_15%_18%,rgba(16,185,129,0.12),transparent_22%),radial-gradient(circle_at_82%_20%,rgba(96,165,250,0.10),transparent_20%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_24%,transparent_76%,rgba(255,255,255,0.03))]" />
      <ParticleField />
      <div className="absolute inset-0 hero-grain opacity-60" />

      <section className="page-shell relative pb-20 pt-10 sm:pb-24 sm:pt-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="hero-rise space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-slate-300">
              <Sparkles className="h-4 w-4 text-emerald-200" />
              {copy.badge}
            </div>

            <div className="space-y-5">
              <h1 className="max-w-4xl font-serif text-4xl leading-[1.02] tracking-[-0.045em] text-white sm:text-5xl xl:text-[4.1rem]">
                {copy.title.split('\n').map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                {copy.description}
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href={chatHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                {copy.primaryCta}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={jobsHref}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white transition hover:bg-white/[0.08]"
              >
                {copy.secondaryCta}
              </Link>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-slate-300">
              {copy.utilityLinks.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-full border border-white/10 px-4 py-2 transition hover:bg-white/8 hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {copy.proof.map((item, index) => (
                <div
                  key={item.label}
                  className="hero-rise rounded-[26px] border border-white/10 bg-white/[0.045] px-5 py-5 backdrop-blur-xl"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <div className="text-3xl font-semibold tracking-[-0.03em] text-white">{item.value}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-400">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-rise relative" style={{ animationDelay: '140ms' }}>
            <div className="absolute inset-0 rounded-[36px] bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_28%)] blur-2xl" />
            <div className="relative rounded-[36px] border border-white/10 bg-white/[0.045] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:p-7">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 rounded-full bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-300">
                  <Orbit className="h-4 w-4 text-emerald-200" />
                  {copy.radarTitle}
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.8)]" />
              </div>

              <div className="mt-6 rounded-[28px] border border-white/10 bg-black/20 p-5">
                <div className="text-sm uppercase tracking-[0.26em] text-slate-500">Signal Surface</div>
                <p className="mt-4 text-lg leading-8 text-slate-100">{copy.radarBody}</p>
              </div>

              <div className="mt-5 space-y-3">
                {copy.radarPoints.map((point, index) => (
                  <div
                    key={point}
                    className="hero-rise flex items-start gap-3 rounded-[24px] border border-white/8 bg-white/[0.03] px-4 py-4"
                    style={{ animationDelay: `${220 + index * 100}ms` }}
                  >
                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-slate-200/90" />
                    <div className="text-sm leading-7 text-slate-300">{point}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell relative pb-16 sm:pb-20">
        <div className="grid gap-4 lg:grid-cols-3">
          {copy.strips.map((item, index) => (
            <div
              key={item}
              className="hero-rise rounded-[26px] border border-white/10 bg-white/[0.03] px-5 py-5 text-sm tracking-[0.02em] text-slate-300 backdrop-blur-xl"
              style={{ animationDelay: `${320 + index * 80}ms` }}
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="page-shell relative pb-16 sm:pb-20">
        <div className="grid gap-4 lg:grid-cols-4">
          {copy.pillars.map((item, index) => {
            const Icon = pillarIcons[index];

            return (
              <div
                key={item.title}
                className="hero-rise rounded-[30px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
                style={{ animationDelay: `${420 + index * 90}ms` }}
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-100">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-medium tracking-[-0.02em] text-white">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-400">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="page-shell relative pb-20">
        <div className="hero-rise rounded-[34px] border border-white/10 bg-white/[0.045] p-8 backdrop-blur-2xl sm:p-10" style={{ animationDelay: '560ms' }}>
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-300">
                <Bot className="h-4 w-4 text-emerald-200" />
                Guided Start
              </div>
              <h2 className="mt-5 font-serif text-3xl leading-tight tracking-[-0.035em] text-white sm:text-4xl">
                {copy.ctaTitle}
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-300">{copy.ctaBody}</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href={chatHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-100"
              >
                {copy.primaryCta}
              </Link>
              <Link
                href={forumHref}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white transition hover:bg-white/[0.08]"
              >
                {copy.forumLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
