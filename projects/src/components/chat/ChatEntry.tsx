'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Compass, SkipForward } from 'lucide-react';
import { Chat } from '@/components/chat/Chat';
import { useAuth } from '@/context/AuthContext';
import { getClientKey } from '@/lib/client-key';

type OnboardingAnswers = {
  stage: string;
  targetRole: string;
  strongestSignal: string;
  biggestBlocker: string;
};

const defaultAnswers: OnboardingAnswers = {
  stage: '',
  targetRole: '',
  strongestSignal: '',
  biggestBlocker: '',
};

const questions = [
  {
    key: 'stage' as const,
    label: 'Where are you in your job search right now?',
    placeholder: 'For example: sophomore exploring, senior applying, recent graduate, switching track',
  },
  {
    key: 'targetRole' as const,
    label: 'What role are you currently leaning toward?',
    placeholder: 'For example: frontend engineer, product manager, data analyst, still unsure',
  },
  {
    key: 'strongestSignal' as const,
    label: 'What is the strongest signal you already have?',
    placeholder: 'For example: one internship, one strong project, competition result, research',
  },
  {
    key: 'biggestBlocker' as const,
    label: 'What feels like the biggest blocker?',
    placeholder: 'For example: weak resume, no interviews, role confusion, no project depth',
  },
];

export function ChatEntry({ locale = 'en' }: { locale?: 'en' | 'zh' }) {
  const { user } = useAuth();
  const [actorKey, setActorKey] = useState('anonymous');
  const [ready, setReady] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [saving, setSaving] = useState(false);
  const [answers, setAnswers] = useState<OnboardingAnswers>(defaultAnswers);
  const copy = locale === 'zh'
    ? {
        badge: '引导开始',
        title: '先回答四个很短的问题，让第一次对话从更清晰的信号开始。',
        desc: '不到一分钟，也可以直接跳过。回答后，AI 会更容易判断你的岗位方向、能力证据和下一步动作。',
        points: [
          '第一次回复会更聚焦',
          '岗位、追踪和练习会更贴近你的目标',
          '答案会保存在工作区里，后面不用重复解释',
        ],
        continue: '继续进入对话',
        skip: '先跳过',
      }
    : {
        badge: 'Guided start',
        title: 'Answer four quick questions so the first chat starts from signal, not guesswork.',
        desc: 'This takes less than a minute. You can skip it, but answering it gives the AI a much cleaner starting point for role fit, job matching, and next-step advice.',
        points: [
          'Sharper first reply from the AI career coach',
          'Cleaner role targeting for jobs, tracker, and practice',
          'Saved to your workspace so you do not repeat yourself later',
        ],
        continue: 'Continue to chat',
        skip: 'Skip for now',
      };

  useEffect(() => {
    setActorKey(user?.id || getClientKey());
  }, [user?.id]);

  useEffect(() => {
    let active = true;

    async function loadOnboarding() {
      try {
        const response = await fetch('/api/onboarding', {
          headers: { 'x-user-key': actorKey },
          cache: 'no-store',
        });
        const payload = await response.json();

        if (!active) return;

        if (payload.success && payload.data) {
          setShowChat(true);
          setAnswers({
            stage: payload.data.answers?.stage || '',
            targetRole: payload.data.answers?.targetRole || '',
            strongestSignal: payload.data.answers?.strongestSignal || '',
            biggestBlocker: payload.data.answers?.biggestBlocker || '',
          });
        }
      } catch {
        // fall through to onboarding form
      } finally {
        if (active) {
          setReady(true);
        }
      }
    }

    void loadOnboarding();
    return () => {
      active = false;
    };
  }, [actorKey]);

  async function saveOnboarding(skipped: boolean) {
    setSaving(true);
    try {
      await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-key': actorKey,
        },
        body: JSON.stringify({
          locale,
          skipped,
          answers: skipped ? {} : answers,
        }),
      });
      setShowChat(true);
    } finally {
      setSaving(false);
    }
  }

  if (!ready) {
    return (
      <div className="page-shell py-12">
        <div className="surface-panel animate-pulse p-10">
          <div className="h-8 w-56 rounded-full bg-white/10" />
          <div className="mt-6 h-24 rounded-[28px] bg-white/6" />
          <div className="mt-4 h-24 rounded-[28px] bg-white/6" />
        </div>
      </div>
    );
  }

  if (showChat) {
    return <Chat onBack={() => window.history.back()} />;
  }

  return (
    <div className="page-shell py-10">
      <div className="surface-panel overflow-hidden p-7 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-300">
              <Compass className="h-4 w-4" />
              {copy.badge}
            </div>
            <h1 className="max-w-xl font-serif text-3xl text-white sm:text-4xl">
              {copy.title}
            </h1>
            <p className="max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              {copy.desc}
            </p>
            <div className="grid gap-3">
              {copy.points.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-200" />
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            {questions.map((question) => (
              <label key={question.key} className="block">
                <span className="mb-2 block text-sm text-slate-200">{question.label}</span>
                <textarea
                  rows={3}
                  value={answers[question.key]}
                  onChange={(event) =>
                    setAnswers((current) => ({ ...current, [question.key]: event.target.value }))
                  }
                  placeholder={question.placeholder}
                  className="w-full rounded-[24px] border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-500"
                />
              </label>
            ))}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={() => void saveOnboarding(false)}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-100 disabled:opacity-70"
              >
                {copy.continue}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => void saveOnboarding(true)}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm text-slate-300 transition hover:bg-white/8 disabled:opacity-70"
              >
                <SkipForward className="h-4 w-4" />
                {copy.skip}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
