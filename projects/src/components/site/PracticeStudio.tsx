'use client';

import { useState } from 'react';
import { BrainCircuit, Loader2, Sparkles } from 'lucide-react';

const modes = [
  { value: 'interview', label: 'Mock interview' },
  { value: 'written', label: 'Written test' },
] as const;

export function PracticeStudio() {
  return <PracticeStudioContent locale="en" />;
}

export function PracticeStudioContent({ locale }: { locale: 'en' | 'zh' }) {
  const [mode, setMode] = useState<(typeof modes)[number]['value']>('interview');
  const [role, setRole] = useState('Frontend Engineer');
  const [company, setCompany] = useState('');
  const [level, setLevel] = useState('Intern');
  const [focus, setFocus] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const copy = locale === 'zh'
    ? {
        badge: '模拟练习',
        title: '一键生成更贴近岗位的面试题和笔试题。',
        desc: '选择目标岗位、公司风格和重点方向，后端会调用同一个大模型生成练习内容。',
        questions: '核心题目',
        engine: '统一模型',
        prompts: '岗位定制',
        role: '目标岗位',
        company: '目标公司或公司风格',
        level: '层级，例如实习 / 校招',
        focus: '重点方向，例如 React 性能 / SQL 案例',
        generate: '生成练习内容',
        output: '生成结果',
        placeholder: '这里会显示生成的面试题或笔试题。',
        error: '当前无法生成练习内容。',
      }
    : {
        badge: 'Practice studio',
        title: 'Generate role-specific interview and written-test sets in one step.',
        desc: 'Pick a target role, company flavor, and focus area. The same model behind the chat will create a realistic mock set you can use immediately.',
        questions: 'core questions',
        engine: 'shared AI engine',
        prompts: 'Role-specific',
        role: 'Target role',
        company: 'Target company or company style',
        level: 'Level, e.g. intern or new grad',
        focus: 'Focus, e.g. React performance or SQL case',
        generate: 'Generate practice set',
        output: 'Generated output',
        placeholder: 'Your generated interview or written-test set will appear here.',
        error: 'Could not generate a practice set right now.',
      };

  async function generate() {
    setLoading(true);
    try {
      const response = await fetch('/api/practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, role, company, level, focus }),
      });
      const payload = await response.json();
      setResult(payload.success ? payload.data.content : copy.error);
    } catch {
      setResult(copy.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-shell pb-20 pt-8">
      <section className="surface-panel p-7 sm:p-9">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
              <BrainCircuit className="h-4 w-4" />
              {copy.badge}
            </div>
            <h1 className="font-serif text-3xl text-white sm:text-4xl">
              {copy.title}
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              {copy.desc}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ['5', copy.questions],
                ['1', copy.engine],
                [locale === 'zh' ? '岗位定制' : 'Role-specific', copy.prompts],
              ].map(([value, label]) => (
                <div key={label} className="rounded-[24px] border border-white/10 bg-slate-950/35 px-4 py-4">
                  <div className="text-2xl font-semibold text-white">{value}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-slate-950/35 p-5">
            <div className="flex gap-2">
              {modes.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setMode(item.value)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    mode === item.value ? 'bg-white text-slate-950' : 'bg-white/6 text-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-3">
              <input
                value={role}
                onChange={(event) => setRole(event.target.value)}
                placeholder={copy.role}
                className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-500"
              />
              <input
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                placeholder={copy.company}
                className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-500"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={level}
                  onChange={(event) => setLevel(event.target.value)}
                  placeholder={copy.level}
                  className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-500"
                />
                <input
                  value={focus}
                  onChange={(event) => setFocus(event.target.value)}
                  placeholder={copy.focus}
                  className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-500"
                />
              </div>
              <button
                type="button"
                onClick={() => void generate()}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#1d8f70,#f08c38)] px-5 py-3 text-sm font-medium text-slate-950"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {copy.generate}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="surface-panel mt-6 p-7 sm:p-9">
        <div className="text-sm uppercase tracking-[0.24em] text-slate-400">{copy.output}</div>
        <div className="mt-4 whitespace-pre-wrap text-sm leading-8 text-slate-200">
          {result || copy.placeholder}
        </div>
      </section>
    </div>
  );
}
