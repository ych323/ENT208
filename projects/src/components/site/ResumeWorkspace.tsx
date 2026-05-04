'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Download, ExternalLink, FileCode2, Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getClientKey } from '@/lib/client-key';

const OVERLEAF_URL = 'https://www.overleaf.com/latex/templates/awesomecv/tvmzpvdjfqxp';

type ExperienceEntry = {
  title: string;
  company: string;
  period: string;
  bullets: string;
};

type ProjectEntry = {
  name: string;
  role: string;
  period: string;
  bullets: string;
};

type EducationEntry = {
  school: string;
  degree: string;
  period: string;
  bullets: string;
};

type VersionEntry = {
  id: string;
  saved_at: string;
  role_title: string;
  summary: string;
  latex: string;
};

type ResumeDraft = {
  id?: string;
  full_name: string;
  role_title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
  selected_focus: string;
  skills: string;
  certifications: string;
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  education: EducationEntry[];
  latex: string;
  versions: VersionEntry[];
};

const emptyExperience = (): ExperienceEntry => ({ title: '', company: '', period: '', bullets: '' });
const emptyProject = (): ProjectEntry => ({ name: '', role: '', period: '', bullets: '' });
const emptyEducation = (): EducationEntry => ({ school: '', degree: '', period: '', bullets: '' });

const initialDraft: ResumeDraft = {
  full_name: '',
  role_title: '',
  email: '',
  phone: '',
  location: '',
  website: '',
  linkedin: '',
  github: '',
  summary: '',
  selected_focus: '',
  skills: '',
  certifications: '',
  experience: [emptyExperience()],
  projects: [emptyProject()],
  education: [emptyEducation()],
  latex: '',
  versions: [],
};

function joinBullets(lines?: string[]) {
  return Array.isArray(lines) ? lines.join('\n') : '';
}

export function ResumeWorkspace({ locale = 'en' }: { locale?: 'en' | 'zh' }) {
  const { user } = useAuth();
  const [actorKey, setActorKey] = useState('anonymous');
  const [draft, setDraft] = useState<ResumeDraft>(initialDraft);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState('');
  const copy = locale === 'zh'
    ? {
        badge: '简历工作台',
        title: '用更结构化的字段、版本历史和导出能力来做岗位定制简历。',
        desc: '先在这里整理内容，再把生成的 LaTeX 带到 Overleaf。你可以保存快照、恢复版本，或者直接导出。',
        openTemplate: '打开 AwesomeCV 模板',
        exportLatex: '导出 LaTeX',
        exportJson: '导出 JSON',
        focus: '目标聚焦，例如前端性能、后端稳定性、增长分析',
        summary: '个人摘要',
        skills: '技能，逗号分隔',
        certifications: '证书或奖项，逗号分隔',
        experience: '经历',
        addExperience: '新增经历',
        projects: '项目',
        addProject: '新增项目',
        education: '教育',
        addEducation: '新增教育',
        remove: '删除',
        save: '保存工作台',
        saveBlock: '保存与版本历史',
        noSave: '还没有保存',
        noVersions: '还没有历史版本。',
        restore: '恢复到预览',
        generated: '生成的 LaTeX',
        generatedPlaceholder: '先保存一次，系统会生成 AwesomeCV LaTeX 草稿。',
      }
    : {
        badge: 'Resume workspace',
        title: 'Build a stronger role-specific resume with structured sections, version history, and exports.',
        desc: 'Use this as the working layer before Overleaf. Save snapshots, shape the role focus, and export either LaTeX or the raw workspace data.',
        openTemplate: 'Open AwesomeCV template',
        exportLatex: 'Export LaTeX',
        exportJson: 'Export JSON',
        focus: 'Target focus, e.g. frontend performance, backend reliability, growth analytics',
        summary: 'Profile summary',
        skills: 'Skills, comma separated',
        certifications: 'Certificates or awards, comma separated',
        experience: 'Experience',
        addExperience: 'Add experience',
        projects: 'Projects',
        addProject: 'Add project',
        education: 'Education',
        addEducation: 'Add education',
        remove: 'Remove',
        save: 'Save workspace',
        saveBlock: 'Save and version history',
        noSave: 'Not saved yet',
        noVersions: 'No saved versions yet.',
        restore: 'Restore preview',
        generated: 'Generated LaTeX',
        generatedPlaceholder: 'Save the workspace once to generate your Awesome CV LaTeX draft.',
      };

  useEffect(() => {
    setActorKey(user?.id || getClientKey());
  }, [user?.id]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await fetch('/api/resume-workspace', {
          headers: { 'x-user-key': actorKey },
          cache: 'no-store',
        });
        const payload = await response.json();
        if (!active || !payload.success || !payload.data) return;

        const record = payload.data;
        setDraft({
          id: record.id,
          full_name: record.full_name || '',
          role_title: record.role_title || '',
          email: record.email || '',
          phone: record.phone || '',
          location: record.location || '',
          website: record.website || '',
          linkedin: record.linkedin || '',
          github: record.github || '',
          summary: record.summary || '',
          selected_focus: record.selected_focus || '',
          skills: Array.isArray(record.skills) ? record.skills.join(', ') : '',
          certifications: Array.isArray(record.certifications) ? record.certifications.join(', ') : '',
          experience: Array.isArray(record.experience) && record.experience.length
            ? record.experience.map((item: ExperienceEntry & { bullets?: string[] }) => ({
                title: item.title || '',
                company: item.company || '',
                period: item.period || '',
                bullets: joinBullets(item.bullets),
              }))
            : [emptyExperience()],
          projects: Array.isArray(record.projects) && record.projects.length
            ? record.projects.map((item: ProjectEntry & { bullets?: string[] }) => ({
                name: item.name || '',
                role: item.role || '',
                period: item.period || '',
                bullets: joinBullets(item.bullets),
              }))
            : [emptyProject()],
          education: Array.isArray(record.education) && record.education.length
            ? record.education.map((item: EducationEntry & { bullets?: string[] }) => ({
                school: item.school || '',
                degree: item.degree || '',
                period: item.period || '',
                bullets: joinBullets(item.bullets),
              }))
            : [emptyEducation()],
          latex: record.latex || '',
          versions: Array.isArray(record.versions) ? record.versions : [],
        });
        setSavedAt(record.updated_at || '');
      } catch {
        // keep local defaults
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [actorKey]);

  function exportLatex() {
    const blob = new Blob([draft.latex || ''], { type: 'text/x-tex;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'reachable-awesome-cv.tex';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'reachable-resume-workspace.json';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function save() {
    setSaving(true);
    try {
      const response = await fetch('/api/resume-workspace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-key': actorKey,
        },
        body: JSON.stringify({
          id: draft.id,
          locale: 'en',
          full_name: draft.full_name,
          role_title: draft.role_title,
          email: draft.email,
          phone: draft.phone,
          location: draft.location,
          website: draft.website,
          linkedin: draft.linkedin,
          github: draft.github,
          summary: draft.summary,
          selected_focus: draft.selected_focus,
          skills: draft.skills.split(',').map((item) => item.trim()).filter(Boolean),
          certifications: draft.certifications.split(',').map((item) => item.trim()).filter(Boolean),
          experience: draft.experience.map((item) => ({
            title: item.title,
            company: item.company,
            period: item.period,
            bullets: item.bullets.split('\n').map((line) => line.trim()).filter(Boolean),
          })),
          projects: draft.projects.map((item) => ({
            name: item.name,
            role: item.role,
            period: item.period,
            bullets: item.bullets.split('\n').map((line) => line.trim()).filter(Boolean),
          })),
          education: draft.education.map((item) => ({
            school: item.school,
            degree: item.degree,
            period: item.period,
            bullets: item.bullets.split('\n').map((line) => line.trim()).filter(Boolean),
          })),
        }),
      });
      const payload = await response.json();
      if (!payload.success) return;

      setDraft((current) => ({
        ...current,
        id: payload.data.id,
        latex: payload.data.latex,
        versions: Array.isArray(payload.data.versions) ? payload.data.versions : current.versions,
      }));
      setSavedAt(payload.data.updated_at || new Date().toISOString());
    } finally {
      setSaving(false);
    }
  }

  function updateListItem<T extends keyof Pick<ResumeDraft, 'experience' | 'projects' | 'education'>>(
    key: T,
    index: number,
    field: keyof ResumeDraft[T][number],
    value: string,
  ) {
    setDraft((current) => ({
      ...current,
      [key]: current[key].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  }

  function addRow(type: 'experience' | 'projects' | 'education') {
    setDraft((current) => ({
      ...current,
      [type]:
        type === 'experience'
          ? [...current.experience, emptyExperience()]
          : type === 'projects'
            ? [...current.projects, emptyProject()]
            : [...current.education, emptyEducation()],
    }));
  }

  function removeRow(type: 'experience' | 'projects' | 'education', index: number) {
    setDraft((current) => {
      const next = current[type].filter((_, itemIndex) => itemIndex !== index);
      return {
        ...current,
        [type]: next.length
          ? next
          : type === 'experience'
            ? [emptyExperience()]
            : type === 'projects'
              ? [emptyProject()]
              : [emptyEducation()],
      };
    });
  }

  function restoreVersion(version: VersionEntry) {
    setDraft((current) => ({ ...current, latex: version.latex, role_title: version.role_title, summary: version.summary }));
  }

  if (loading) {
    return (
      <div className="page-shell py-10">
        <div className="surface-panel h-80 animate-pulse bg-white/5" />
      </div>
    );
  }

  return (
    <div className="page-shell pb-20 pt-8">
      <section className="surface-panel p-7 sm:p-9">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
              <FileCode2 className="h-4 w-4" />
              {copy.badge}
            </div>
            <h1 className="font-serif text-3xl text-white sm:text-4xl">
              {copy.title}
            </h1>
            <p className="text-sm leading-7 text-slate-300 sm:text-base">
              {copy.desc}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={OVERLEAF_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/8"
              >
                {copy.openTemplate}
                <ExternalLink className="h-4 w-4" />
              </Link>
              <button type="button" onClick={exportLatex} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/8">
                <Download className="h-4 w-4" />
                {copy.exportLatex}
              </button>
              <button type="button" onClick={exportJson} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/8">
                <Download className="h-4 w-4" />
                {copy.exportJson}
              </button>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['full_name', 'Full name'],
                ['role_title', 'Target role title'],
                ['email', 'Email'],
                ['phone', 'Phone'],
                ['location', 'Location'],
                ['website', 'Website / portfolio'],
                ['linkedin', 'LinkedIn'],
                ['github', 'GitHub'],
              ].map(([key, label]) => (
                <input
                  key={key}
                  value={draft[key as keyof ResumeDraft] as string}
                  onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.value }))}
                  placeholder={label}
                  className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-500"
                />
              ))}
            </div>
            <input
              value={draft.selected_focus}
              onChange={(event) => setDraft((current) => ({ ...current, selected_focus: event.target.value }))}
              placeholder={copy.focus}
              className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-500"
            />
            <textarea rows={4} value={draft.summary} onChange={(event) => setDraft((current) => ({ ...current, summary: event.target.value }))} placeholder={copy.summary} className="rounded-[24px] border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-500" />
            <input value={draft.skills} onChange={(event) => setDraft((current) => ({ ...current, skills: event.target.value }))} placeholder={copy.skills} className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-500" />
            <input value={draft.certifications} onChange={(event) => setDraft((current) => ({ ...current, certifications: event.target.value }))} placeholder={copy.certifications} className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-500" />
          </div>
        </div>
      </section>

      <section className="surface-panel mt-6 p-7 sm:p-9">
        <div className="flex items-center justify-between">
          <div className="text-lg font-medium text-white">{copy.experience}</div>
          <button type="button" onClick={() => addRow('experience')} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300">
            <Plus className="h-4 w-4" />
            {copy.addExperience}
          </button>
        </div>
        <div className="mt-4 grid gap-4">
          {draft.experience.map((entry, index) => (
            <div key={`experience-${index}`} className="rounded-[28px] border border-white/10 bg-slate-950/35 p-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <input value={entry.title} onChange={(event) => updateListItem('experience', index, 'title', event.target.value)} placeholder="Role" className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-500" />
                <input value={entry.company} onChange={(event) => updateListItem('experience', index, 'company', event.target.value)} placeholder="Company" className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-500" />
                <input value={entry.period} onChange={(event) => updateListItem('experience', index, 'period', event.target.value)} placeholder="Period" className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-500" />
              </div>
              <textarea rows={4} value={entry.bullets} onChange={(event) => updateListItem('experience', index, 'bullets', event.target.value)} placeholder="One bullet per line" className="mt-3 w-full rounded-[24px] border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-500" />
              <button type="button" onClick={() => removeRow('experience', index)} className="mt-3 inline-flex items-center gap-2 text-sm text-rose-300">
                <Trash2 className="h-4 w-4" />
                {copy.remove}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="surface-panel mt-6 p-7 sm:p-9">
        <div className="flex items-center justify-between">
          <div className="text-lg font-medium text-white">{copy.projects}</div>
          <button type="button" onClick={() => addRow('projects')} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300">
            <Plus className="h-4 w-4" />
            {copy.addProject}
          </button>
        </div>
        <div className="mt-4 grid gap-4">
          {draft.projects.map((entry, index) => (
            <div key={`project-${index}`} className="rounded-[28px] border border-white/10 bg-slate-950/35 p-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <input value={entry.name} onChange={(event) => updateListItem('projects', index, 'name', event.target.value)} placeholder="Project name" className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-500" />
                <input value={entry.role} onChange={(event) => updateListItem('projects', index, 'role', event.target.value)} placeholder="Your role" className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-500" />
                <input value={entry.period} onChange={(event) => updateListItem('projects', index, 'period', event.target.value)} placeholder="Period" className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-500" />
              </div>
              <textarea rows={4} value={entry.bullets} onChange={(event) => updateListItem('projects', index, 'bullets', event.target.value)} placeholder="One bullet per line" className="mt-3 w-full rounded-[24px] border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-500" />
              <button type="button" onClick={() => removeRow('projects', index)} className="mt-3 inline-flex items-center gap-2 text-sm text-rose-300">
                <Trash2 className="h-4 w-4" />
                {copy.remove}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="surface-panel mt-6 p-7 sm:p-9">
        <div className="flex items-center justify-between">
          <div className="text-lg font-medium text-white">{copy.education}</div>
          <button type="button" onClick={() => addRow('education')} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300">
            <Plus className="h-4 w-4" />
            {copy.addEducation}
          </button>
        </div>
        <div className="mt-4 grid gap-4">
          {draft.education.map((entry, index) => (
            <div key={`education-${index}`} className="rounded-[28px] border border-white/10 bg-slate-950/35 p-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <input value={entry.school} onChange={(event) => updateListItem('education', index, 'school', event.target.value)} placeholder="School" className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-500" />
                <input value={entry.degree} onChange={(event) => updateListItem('education', index, 'degree', event.target.value)} placeholder="Degree" className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-500" />
                <input value={entry.period} onChange={(event) => updateListItem('education', index, 'period', event.target.value)} placeholder="Period" className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-500" />
              </div>
              <textarea rows={3} value={entry.bullets} onChange={(event) => updateListItem('education', index, 'bullets', event.target.value)} placeholder="One bullet per line" className="mt-3 w-full rounded-[24px] border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-500" />
              <button type="button" onClick={() => removeRow('education', index)} className="mt-3 inline-flex items-center gap-2 text-sm text-rose-300">
                <Trash2 className="h-4 w-4" />
                {copy.remove}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="surface-panel mt-6 p-7 sm:p-9">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-lg font-medium text-white">{copy.saveBlock}</div>
            <div className="mt-1 text-sm text-slate-400">
              {savedAt ? `Last saved ${new Date(savedAt).toLocaleString('en-US')}` : copy.noSave}
            </div>
          </div>
          <button
            type="button"
            onClick={() => void save()}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-100"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {copy.save}
          </button>
        </div>

        <div className="mt-5 grid gap-3">
          {draft.versions.length === 0 ? (
            <div className="rounded-[24px] border border-white/10 bg-slate-950/35 px-4 py-4 text-sm text-slate-400">
              {copy.noVersions}
            </div>
          ) : (
            draft.versions.slice(0, 8).map((version) => (
              <div key={version.id} className="rounded-[24px] border border-white/10 bg-slate-950/35 px-4 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="text-sm font-medium text-white">{version.role_title || 'Untitled role version'}</div>
                    <div className="mt-1 text-xs text-slate-500">{new Date(version.saved_at).toLocaleString('en-US')}</div>
                    <div className="mt-2 text-sm leading-7 text-slate-300">{version.summary || 'No summary captured in this version.'}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => restoreVersion(version)}
                    className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/8"
                  >
                    {copy.restore}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="surface-panel mt-6 p-7 sm:p-9">
        <div className="text-sm uppercase tracking-[0.24em] text-slate-400">{copy.generated}</div>
        <textarea readOnly value={draft.latex || copy.generatedPlaceholder} className="mt-4 h-[32rem] w-full rounded-[28px] border border-white/10 bg-slate-950/45 px-4 py-4 font-mono text-xs leading-6 text-slate-200" />
      </section>
    </div>
  );
}
