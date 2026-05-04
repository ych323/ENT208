import { createHash } from 'crypto';
import { OFFLINE_JOB_SNAPSHOT } from '@/lib/jobs-offline-snapshot';

export type JobCategory =
  | 'frontend'
  | 'backend'
  | 'algorithm'
  | 'data'
  | 'product'
  | 'operation'
  | 'design'
  | 'devops'
  | 'mobile'
  | 'qa';

export type JobRecord = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary_text?: string;
  category: JobCategory;
  tags?: string;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  job_type: 'fulltime' | 'internship';
  education?: string;
  experience?: string;
  official_url?: string;
  publish_date: string;
  views: number;
  status: 'active';
  source: 'remotive' | 'arbeitnow' | 'snapshot' | 'seed' | 'manual';
  source_label: string;
};

type RemotiveJob = {
  id?: number;
  title?: string;
  company_name?: string;
  category?: string;
  candidate_required_location?: string;
  publication_date?: string;
  salary?: string;
  tags?: string[];
  url?: string;
  description?: string;
  job_type?: string;
};

type ArbeitnowJob = {
  slug?: string;
  title?: string;
  company_name?: string;
  location?: string;
  created_at?: string | number;
  url?: string;
  tags?: readonly string[];
  description?: string;
  remote?: boolean;
  job_types?: readonly string[];
};

const CACHE_TTL_MS = 1000 * 60 * 30;

const FALLBACK_JOBS: JobRecord[] = [
  { id: 'seed-frontend-1', title: 'Frontend Engineer - TikTok Web', company: 'ByteDance', location: 'Beijing', salary_text: '30k-50k', category: 'frontend', tags: 'React,TypeScript,Web Performance', description: 'Build and optimize high-traffic web experiences for consumer products.', requirements: 'Strong JavaScript fundamentals, React engineering experience, and UI performance awareness.', responsibilities: 'Own product features, collaborate with design, and improve frontend quality.', job_type: 'fulltime', education: "Bachelor's Degree+", experience: '3-5 years', official_url: 'https://jobs.bytedance.com/', publish_date: '2026-04-20T08:00:00Z', views: 0, status: 'active', source: 'seed', source_label: 'Seed' },
  { id: 'seed-backend-1', title: 'Backend Engineer - WeChat Pay', company: 'Tencent', location: 'Guangzhou', salary_text: '32k-52k', category: 'backend', tags: 'Java,Distributed Systems,Payments', description: 'Develop backend services and infrastructure for payment-related products.', requirements: 'Java or Go service development experience and strong systems thinking.', responsibilities: 'Design APIs, improve reliability, and ship production features.', job_type: 'fulltime', education: "Bachelor's Degree+", experience: '3-5 years', official_url: 'https://careers.tencent.com/', publish_date: '2026-04-18T08:00:00Z', views: 0, status: 'active', source: 'seed', source_label: 'Seed' },
  { id: 'seed-algorithm-1', title: 'Machine Learning Engineer - Recommendation', company: 'Alibaba', location: 'Hangzhou', salary_text: '40k-70k', category: 'algorithm', tags: 'PyTorch,Recommendation,Ranking', description: 'Improve recommendation relevance and model serving quality for large-scale products.', requirements: 'Strong machine learning background and production experimentation experience.', responsibilities: 'Train ranking models, evaluate online performance, and iterate quickly.', job_type: 'fulltime', education: "Master's Degree+", experience: '2-5 years', official_url: 'https://talent.alibaba.com/', publish_date: '2026-04-17T08:00:00Z', views: 0, status: 'active', source: 'seed', source_label: 'Seed' },
  { id: 'seed-data-1', title: 'Data Analyst - Growth', company: 'ByteDance', location: 'Shanghai', salary_text: '25k-40k', category: 'data', tags: 'SQL,Python,Experimentation', description: 'Support product growth through metrics design, reporting, and experiment analysis.', requirements: 'Strong SQL and business analysis foundation.', responsibilities: 'Build dashboards, frame questions, and drive decisions with data.', job_type: 'fulltime', education: "Bachelor's Degree+", experience: '2-4 years', official_url: 'https://jobs.bytedance.com/', publish_date: '2026-04-16T08:00:00Z', views: 0, status: 'active', source: 'seed', source_label: 'Seed' },
  { id: 'seed-product-1', title: 'Product Manager - Collaboration Tools', company: 'Tencent', location: 'Shenzhen', salary_text: '28k-45k', category: 'product', tags: 'Product Strategy,User Research,Analytics', description: 'Drive roadmap decisions for enterprise collaboration and communication workflows.', requirements: 'Clear product thinking and strong stakeholder communication.', responsibilities: 'Prioritize roadmap, write specs, and validate outcomes.', job_type: 'fulltime', education: "Bachelor's Degree+", experience: '3-5 years', official_url: 'https://careers.tencent.com/', publish_date: '2026-04-15T08:00:00Z', views: 0, status: 'active', source: 'seed', source_label: 'Seed' },
  { id: 'seed-operation-1', title: 'Community Operations Specialist', company: 'Alibaba', location: 'Hangzhou', salary_text: '18k-28k', category: 'operation', tags: 'Growth,Community,Campaigns', description: 'Operate communities, campaigns, and creator relationships for user growth.', requirements: 'Execution strength, data awareness, and good communication.', responsibilities: 'Run campaigns, coordinate content, and improve engagement.', job_type: 'fulltime', education: "Bachelor's Degree+", experience: '1-3 years', official_url: 'https://talent.alibaba.com/', publish_date: '2026-04-14T08:00:00Z', views: 0, status: 'active', source: 'seed', source_label: 'Seed' },
  { id: 'seed-design-1', title: 'Product Designer', company: 'ByteDance', location: 'Beijing', salary_text: '25k-40k', category: 'design', tags: 'Figma,Interaction Design,Design Systems', description: 'Design user flows and polished interfaces for consumer software products.', requirements: 'A strong portfolio and good collaboration with product and engineering.', responsibilities: 'Create flows, mockups, and reusable design patterns.', job_type: 'fulltime', education: "Bachelor's Degree+", experience: '2-4 years', official_url: 'https://jobs.bytedance.com/', publish_date: '2026-04-13T08:00:00Z', views: 0, status: 'active', source: 'seed', source_label: 'Seed' },
  { id: 'seed-devops-1', title: 'DevOps Engineer', company: 'Tencent', location: 'Shenzhen', salary_text: '30k-48k', category: 'devops', tags: 'Kubernetes,CI/CD,Observability', description: 'Support continuous delivery, platform reliability, and infrastructure automation.', requirements: 'Container, CI/CD, and Linux operations experience.', responsibilities: 'Improve release pipelines and monitor production systems.', job_type: 'fulltime', education: "Bachelor's Degree+", experience: '2-5 years', official_url: 'https://careers.tencent.com/', publish_date: '2026-04-12T08:00:00Z', views: 0, status: 'active', source: 'seed', source_label: 'Seed' },
  { id: 'seed-mobile-1', title: 'Android Engineer', company: 'Alibaba', location: 'Hangzhou', salary_text: '28k-45k', category: 'mobile', tags: 'Android,Kotlin,Jetpack Compose', description: 'Build native Android experiences for commerce and productivity scenarios.', requirements: 'Native Android engineering experience with modern architecture patterns.', responsibilities: 'Ship app features, improve performance, and maintain code quality.', job_type: 'fulltime', education: "Bachelor's Degree+", experience: '2-4 years', official_url: 'https://talent.alibaba.com/', publish_date: '2026-04-11T08:00:00Z', views: 0, status: 'active', source: 'seed', source_label: 'Seed' },
  { id: 'seed-qa-1', title: 'QA Engineer', company: 'ByteDance', location: 'Singapore', salary_text: '22k-35k', category: 'qa', tags: 'Playwright,API Testing,Automation', description: 'Improve release quality through automation and coverage of end-to-end user flows.', requirements: 'Hands-on test automation and a structured debugging approach.', responsibilities: 'Write automated tests and collaborate on product quality.', job_type: 'fulltime', education: "Bachelor's Degree+", experience: '2-4 years', official_url: 'https://jobs.bytedance.com/', publish_date: '2026-04-10T08:00:00Z', views: 0, status: 'active', source: 'seed', source_label: 'Seed' },
];

let cachedJobs: JobRecord[] | null = null;
let cachedAt = 0;
let manualJobs: JobRecord[] = [];

function toId(input: string) {
  return createHash('sha1').update(input).digest('hex').slice(0, 16);
}

function stripHtml(input?: string) {
  if (!input) return '';
  return input
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<li>/gi, '\n- ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function clampText(input?: string, maxLength = 2200) {
  const text = stripHtml(input);
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

function inferCategory(payload: string): JobCategory {
  const text = payload.toLowerCase();
  if (/(android|ios|swift|kotlin|react native|flutter|mobile)/.test(text)) return 'mobile';
  if (/(devops|sre|platform|kubernetes|terraform|infrastructure|cloud engineer)/.test(text)) return 'devops';
  if (/(qa|quality assurance|test engineer|automation test|sdet)/.test(text)) return 'qa';
  if (/(designer|ux|ui|visual design|product design)/.test(text)) return 'design';
  if (/(machine learning|artificial intelligence|ml engineer|data scientist|nlp|deep learning|computer vision|\bai\b)/.test(text)) return 'algorithm';
  if (/(data analyst|analytics|business intelligence|data engineer|etl|warehouse|sql|bi\b)/.test(text)) return 'data';
  if (/(product manager|product owner|product ops)/.test(text)) return 'product';
  if (/(marketing|growth|seo|content|community|operations|ops specialist|campaign|creator)/.test(text)) return 'operation';
  if (/(frontend|front-end|react|vue|web ui|javascript|typescript|next\.js|ui engineer)/.test(text)) return 'frontend';
  return 'backend';
}

function inferJobType(payload: string): 'fulltime' | 'internship' {
  return /(intern|internship|graduate intern|summer)/i.test(payload) ? 'internship' : 'fulltime';
}

function safeDate(value?: string) {
  const date = value ? new Date(value) : null;
  return !date || Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function safeUnixDate(value?: string | number) {
  if (typeof value === 'number') {
    return new Date(value * 1000).toISOString();
  }

  return safeDate(value);
}

async function fetchJson<T>(url: string) {
  const response = await fetch(url, { headers: { Accept: 'application/json' }, next: { revalidate: 1800 } });
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
  return (await response.json()) as T;
}

function normalizeRemotiveJob(job: RemotiveJob): JobRecord | null {
  if (!job.title || !job.company_name || !job.url) return null;
  const description = clampText(job.description);
  const tags = Array.isArray(job.tags) ? job.tags.join(',') : '';
  return {
    id: toId(`remotive:${job.id ?? job.url}`),
    title: job.title.trim(),
    company: job.company_name.trim(),
    location: job.candidate_required_location?.trim() || 'Remote',
    salary_text: job.salary?.trim() || undefined,
    category: inferCategory(`${job.title} ${job.category ?? ''} ${tags} ${description}`),
    tags: tags || undefined,
    description,
    requirements: description,
    responsibilities: undefined,
    job_type: inferJobType(`${job.title} ${job.job_type ?? ''}`),
    education: undefined,
    experience: undefined,
    official_url: job.url,
    publish_date: safeDate(job.publication_date),
    views: 0,
    status: 'active',
    source: 'remotive',
    source_label: 'Remotive',
  };
}

function normalizeArbeitnowJob(job: ArbeitnowJob): JobRecord | null {
  if (!job.title || !job.company_name || !job.url) return null;
  const description = clampText(job.description);
  const tags = Array.isArray(job.tags) ? job.tags.join(',') : '';
  const jobTypes = Array.isArray(job.job_types) ? job.job_types.join(' ') : '';
  return {
    id: toId(`arbeitnow:${job.slug ?? job.url}`),
    title: job.title.trim(),
    company: job.company_name.trim(),
    location: job.remote ? 'Remote' : job.location?.trim() || 'Europe',
    salary_text: undefined,
    category: inferCategory(`${job.title} ${tags} ${jobTypes} ${description}`),
    tags: tags || undefined,
    description,
    requirements: description,
    responsibilities: undefined,
    job_type: inferJobType(`${job.title} ${jobTypes}`),
    education: undefined,
    experience: undefined,
    official_url: job.url,
    publish_date: safeUnixDate(job.created_at),
    views: 0,
    status: 'active',
    source: 'arbeitnow',
    source_label: 'Arbeitnow',
  };
}

function dedupeJobs(jobs: JobRecord[]) {
  const seen = new Set<string>();
  const result: JobRecord[] = [];
  for (const job of jobs) {
    const key = `${job.official_url ?? ''}|${job.title.toLowerCase()}|${job.company.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(job);
  }
  return result.sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime());
}

async function loadRemotiveJobs() {
  const payload = await fetchJson<{ jobs?: RemotiveJob[] }>('https://remotive.com/api/remote-jobs');
  return (payload.jobs ?? []).map(normalizeRemotiveJob).filter((job): job is JobRecord => Boolean(job)).slice(0, 140);
}

async function loadArbeitnowJobs() {
  const pages = [1, 2, 3, 4];
  const responses = await Promise.allSettled(pages.map((page) => fetchJson<{ data?: ArbeitnowJob[] }>(`https://www.arbeitnow.com/api/job-board-api?page=${page}`)));
  return responses
    .flatMap((result) => (result.status === 'fulfilled' ? result.value.data ?? [] : []))
    .map(normalizeArbeitnowJob)
    .filter((job): job is JobRecord => Boolean(job))
    .slice(0, 140);
}

function loadOfflineSnapshotJobs() {
  return OFFLINE_JOB_SNAPSHOT
    .map((job) => normalizeArbeitnowJob(job))
    .filter((job): job is JobRecord => Boolean(job))
    .map((job) => ({
      ...job,
      id: toId(`snapshot:${job.official_url ?? job.title}`),
      source: 'snapshot' as const,
      source_label: 'Offline Snapshot',
    }));
}

function ensureCatalog(jobs: JobRecord[]) {
  return dedupeJobs([...jobs, ...FALLBACK_JOBS]);
}

export async function getJobCatalog() {
  if (cachedJobs && Date.now() - cachedAt < CACHE_TTL_MS) return cachedJobs;
  const offlineSnapshotJobs = loadOfflineSnapshotJobs();
  try {
    const [remotiveJobs, arbeitnowJobs] = await Promise.all([loadRemotiveJobs(), loadArbeitnowJobs()]);
    const merged = ensureCatalog([...manualJobs, ...remotiveJobs, ...arbeitnowJobs, ...offlineSnapshotJobs]).slice(0, 220);
    cachedJobs = merged;
    cachedAt = Date.now();
    return merged;
  } catch {
    const fallback = ensureCatalog([...manualJobs, ...offlineSnapshotJobs]);
    cachedJobs = fallback;
    cachedAt = Date.now();
    return fallback;
  }
}

export async function findJobById(id: string) {
  const jobs = await getJobCatalog();
  return jobs.find((job) => job.id === id) ?? null;
}

export async function searchRelevantJobs(query: string, limit = 6) {
  const tokens = query.toLowerCase().split(/[^a-z0-9+#.]+/i).map((token) => token.trim()).filter((token) => token.length >= 2);
  if (tokens.length === 0) return [];
  const jobs = await getJobCatalog();
  return jobs
    .map((job) => {
      const haystack = `${job.title} ${job.company} ${job.category} ${job.tags ?? ''} ${job.description ?? ''}`.toLowerCase();
      const score = tokens.reduce((acc, token) => acc + (haystack.includes(token) ? 1 : 0), 0);
      return { job, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.job);
}

export function addManualJob(input: Partial<JobRecord>) {
  const title = input.title?.trim();
  const company = input.company?.trim();
  if (!title || !company) throw new Error('title and company are required');
  const job: JobRecord = {
    id: input.id ?? `manual-${toId(`${title}-${company}-${Date.now()}`)}`,
    title,
    company,
    location: input.location?.trim() || 'Remote',
    salary_text: input.salary_text?.trim() || undefined,
    category: input.category ?? 'backend',
    tags: input.tags?.trim() || undefined,
    description: input.description?.trim() || '',
    requirements: input.requirements?.trim() || '',
    responsibilities: input.responsibilities?.trim() || '',
    job_type: input.job_type ?? inferJobType(title),
    education: input.education?.trim() || undefined,
    experience: input.experience?.trim() || undefined,
    official_url: input.official_url?.trim() || undefined,
    publish_date: input.publish_date ?? new Date().toISOString(),
    views: 0,
    status: 'active',
    source: 'manual',
    source_label: 'Manual',
  };
  manualJobs = [job, ...manualJobs];
  cachedAt = 0;
  return job;
}
