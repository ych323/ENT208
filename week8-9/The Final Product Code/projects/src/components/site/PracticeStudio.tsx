'use client';

import { useState } from 'react';
import { BrainCircuit, Loader2, Sparkles } from 'lucide-react';

type Locale = 'en' | 'zh';
type PracticeMode = 'interview' | 'written';

const modeOptions: Record<Locale, Array<{ value: PracticeMode; label: string }>> = {
  en: [
    { value: 'interview', label: 'Mock interview' },
    { value: 'written', label: 'Written test' },
  ],
  zh: [
    { value: 'interview', label: '模拟面试' },
    { value: 'written', label: '笔试题' },
  ],
};

const rolePresets = [
  'Frontend Engineer',
  'Backend Engineer',
  'Data Analyst',
  'Machine Learning Engineer',
  'Product Manager',
  'Operations Specialist',
  'UX Designer',
  'QA Engineer',
];

const focusPresets = [
  'React performance and state management',
  'System design and API reliability',
  'SQL analytics and business case',
  'Machine learning project deep dive',
  'Product sense and metric design',
  'Behavioral interview with project evidence',
  'Algorithm and data structures',
  'Resume project defense',
];

const companyPresets = ['Big Tech', 'Startup', 'Fintech', 'E-commerce', 'AI Lab', 'SaaS'];
const levelPresets = ['Intern', 'New Grad', 'Junior', 'Mid-level'];
const difficultyPresets = ['Foundational', 'Realistic', 'Challenging'];

const copy = {
  en: {
    badge: 'Practice studio',
    title: 'Generate custom interview and written-test sets from the same AI model.',
    desc: 'Choose a role, scenario, difficulty, and focus area. The generator will create a tailored set with questions, expected signals, and review criteria.',
    questions: 'questions',
    engine: 'shared AI engine',
    prompts: 'preset scenarios',
    role: 'Target role',
    company: 'Company style',
    level: 'Level',
    difficulty: 'Difficulty',
    count: 'Question count',
    focus: 'Focus area',
    scenario: 'Interview or test scenario',
    generate: 'Generate practice set',
    output: 'Generated output',
    placeholder: 'Your custom mock interview or written-test set will appear here.',
    error: 'Could not generate a practice set right now.',
    presets: 'Presets',
    custom: 'Custom details',
  },
  zh: {
    badge: '模拟练习',
    title: '用同一个大模型生成定制化面试题和笔试题。',
    desc: '选择岗位、场景、难度和重点方向，系统会生成贴近真实招聘流程的题目、考察信号和评分标准。',
    questions: '题目',
    engine: '统一模型',
    prompts: '预设场景',
    role: '目标岗位',
    company: '公司风格',
    level: '层级',
    difficulty: '难度',
    count: '题目数量',
    focus: '重点方向',
    scenario: '面试或笔试场景',
    generate: '生成练习内容',
    output: '生成结果',
    placeholder: '这里会显示定制化的模拟面试题或笔试题。',
    error: '当前无法生成练习内容。',
    presets: '预设选项',
    custom: '自定义细节',
  },
} as const;

function scenarioDefault(mode: PracticeMode) {
  return mode === 'written'
    ? 'Timed written assessment with practical case questions and one deeper reasoning task'
    : 'One hour hiring loop with resume deep dive, role-specific questions, and follow-up probes';
}

export function PracticeStudio() {
  return <PracticeStudioContent locale="en" />;
}

export function PracticeStudioContent({ locale }: { locale: Locale }) {
  const text = copy[locale];
  const [mode, setMode] = useState<PracticeMode>('interview');
  const [role, setRole] = useState('Frontend Engineer');
  const [company, setCompany] = useState('Big Tech');
  const [level, setLevel] = useState('Intern');
  const [difficulty, setDifficulty] = useState('Realistic');
  const [questionCount, setQuestionCount] = useState(6);
  const [focus, setFocus] = useState('React performance and state management');
  const [scenario, setScenario] = useState(scenarioDefault('interview'));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  function updateMode(nextMode: PracticeMode) {
    setMode(nextMode);
    setScenario(scenarioDefault(nextMode));
  }

  async function generate() {
    setLoading(true);
    try {
      const response = await fetch('/api/practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          role,
          company,
          level,
          difficulty,
          questionCount,
          focus,
          scenario,
          locale,
        }),
      });
      const payload = await response.json();
      setResult(payload.success ? payload.data.content : text.error);
    } catch {
      setResult(text.error);
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
              {text.badge}
            </div>
            <h1 className="font-serif text-3xl text-white sm:text-4xl">{text.title}</h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">{text.desc}</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                [String(questionCount), text.questions],
                ['1', text.engine],
                ['8+', text.prompts],
              ].map(([value, label]) => (
                <div key={label} className="rounded-[24px] border border-white/10 bg-slate-950/35 px-4 py-4">
                  <div className="text-2xl font-semibold text-white">{value}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-slate-950/35 p-5">
            <div className="flex flex-wrap gap-2">
              {modeOptions[locale].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => updateMode(item.value)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    mode === item.value ? 'bg-white text-slate-950' : 'bg-white/6 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <div className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500">{text.presets}</div>
                <div className="flex flex-wrap gap-2">
                  {rolePresets.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setRole(item)}
                      className={`rounded-full border px-3 py-1.5 text-xs transition ${
                        role === item ? 'border-emerald-300/40 bg-emerald-300/15 text-emerald-100' : 'border-white/10 bg-white/5 text-slate-300'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label>
                  <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">{text.company}</span>
                  <select
                    value={company}
                    onChange={(event) => setCompany(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white"
                  >
                    {companyPresets.map((item) => (
                      <option key={item} value={item} className="bg-slate-900 text-white">
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">{text.level}</span>
                  <select
                    value={level}
                    onChange={(event) => setLevel(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white"
                  >
                    {levelPresets.map((item) => (
                      <option key={item} value={item} className="bg-slate-900 text-white">
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">{text.difficulty}</span>
                  <select
                    value={difficulty}
                    onChange={(event) => setDifficulty(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white"
                  >
                    {difficultyPresets.map((item) => (
                      <option key={item} value={item} className="bg-slate-900 text-white">
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">{text.count}</span>
                  <input
                    type="number"
                    min={4}
                    max={10}
                    value={questionCount}
                    onChange={(event) => setQuestionCount(Math.min(10, Math.max(4, Number(event.target.value) || 6)))}
                    className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">{text.focus}</span>
                <select
                  value={focus}
                  onChange={(event) => setFocus(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white"
                >
                  {focusPresets.map((item) => (
                    <option key={item} value={item} className="bg-slate-900 text-white">
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <div>
                <div className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500">{text.custom}</div>
                <div className="grid gap-3">
                  <input
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                    placeholder={text.role}
                    className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-500"
                  />
                  <textarea
                    rows={3}
                    value={scenario}
                    onChange={(event) => setScenario(event.target.value)}
                    placeholder={text.scenario}
                    className="rounded-[24px] border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => void generate()}
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#1d8f70,#f08c38)] px-5 py-3 text-sm font-medium text-slate-950 transition hover:brightness-110 disabled:opacity-70"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {text.generate}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="surface-panel mt-6 p-7 sm:p-9">
        <div className="text-sm uppercase tracking-[0.24em] text-slate-400">{text.output}</div>
        <div className="mt-4 whitespace-pre-wrap text-sm leading-8 text-slate-200">
          {result || text.placeholder}
        </div>
      </section>
    </div>
  );
}
