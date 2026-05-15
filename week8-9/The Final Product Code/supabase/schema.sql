create table if not exists public.reachable_forum_posts (
  id text primary key default gen_random_uuid()::text,
  locale text not null default 'en' check (locale in ('en', 'zh')),
  author text not null default 'Guest User',
  owner_key text,
  title text not null,
  content text not null,
  category text not null default 'Job Discussion',
  tags text not null default '',
  target_job text not null default '',
  company text not null default '',
  views integer not null default 0,
  likes integer not null default 0,
  comments_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists reachable_forum_posts_locale_created_idx
  on public.reachable_forum_posts(locale, created_at desc);

create table if not exists public.reachable_forum_comments (
  id text primary key default gen_random_uuid()::text,
  post_id text not null references public.reachable_forum_posts(id) on delete cascade,
  locale text not null default 'en' check (locale in ('en', 'zh')),
  author text not null default 'Guest User',
  owner_key text,
  content text not null,
  likes integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists reachable_forum_comments_post_created_idx
  on public.reachable_forum_comments(post_id, created_at asc);

create table if not exists public.reachable_applications (
  id text primary key default gen_random_uuid()::text,
  user_key text not null,
  job_id text not null,
  title text not null default 'Untitled role',
  company text not null default 'Unknown company',
  location text not null default '',
  source_url text not null default '',
  status text not null default 'saved' check (status in ('saved', 'applied', 'interviewing', 'offer', 'rejected')),
  notes text not null default '',
  fit_score integer,
  fit_summary text not null default '',
  fit_strengths text[] not null default '{}',
  fit_gaps text[] not null default '{}',
  fit_next_steps text[] not null default '{}',
  status_history jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_key, job_id)
);

create index if not exists reachable_applications_user_updated_idx
  on public.reachable_applications(user_key, updated_at desc);

create table if not exists public.reachable_onboarding (
  id text primary key default gen_random_uuid()::text,
  user_key text not null unique,
  locale text not null default 'en' check (locale in ('en', 'zh')),
  skipped boolean not null default false,
  answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reachable_resume_workspaces (
  id text primary key default gen_random_uuid()::text,
  user_key text not null unique,
  locale text not null default 'en' check (locale in ('en', 'zh')),
  full_name text not null default '',
  role_title text not null default '',
  email text not null default '',
  phone text not null default '',
  location text not null default '',
  website text not null default '',
  linkedin text not null default '',
  github text not null default '',
  summary text not null default '',
  skills text[] not null default '{}',
  selected_focus text not null default '',
  experience jsonb not null default '[]'::jsonb,
  projects jsonb not null default '[]'::jsonb,
  education jsonb not null default '[]'::jsonb,
  certifications text[] not null default '{}',
  latex text not null default '',
  versions jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.reachable_forum_posts enable row level security;
alter table public.reachable_forum_comments enable row level security;
alter table public.reachable_applications enable row level security;
alter table public.reachable_onboarding enable row level security;
alter table public.reachable_resume_workspaces enable row level security;

create policy "service role can manage reachable forum posts"
  on public.reachable_forum_posts for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "service role can manage reachable forum comments"
  on public.reachable_forum_comments for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "service role can manage reachable applications"
  on public.reachable_applications for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "service role can manage reachable onboarding"
  on public.reachable_onboarding for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "service role can manage reachable resume workspaces"
  on public.reachable_resume_workspaces for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
