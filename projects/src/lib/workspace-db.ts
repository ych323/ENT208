import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { getSupabaseClient, isSupabaseConfigured } from '@/storage/database/supabase-client';

export type ForumPostRecord = {
  id: string;
  locale: 'en' | 'zh';
  author: string;
  owner_key?: string;
  title: string;
  content: string;
  category: string;
  tags: string;
  target_job: string;
  company: string;
  views: number;
  likes: number;
  comments_count: number;
  created_at: string;
};

export type ForumCommentRecord = {
  id: string;
  post_id: string;
  locale: 'en' | 'zh';
  author: string;
  owner_key?: string;
  content: string;
  likes: number;
  created_at: string;
};

export type ApplicationRecord = {
  id: string;
  user_key: string;
  job_id: string;
  title: string;
  company: string;
  location?: string;
  source_url?: string;
  status: 'saved' | 'applied' | 'interviewing' | 'offer' | 'rejected';
  notes: string;
  fit_score?: number;
  fit_summary?: string;
  fit_strengths?: string[];
  fit_gaps?: string[];
  fit_next_steps?: string[];
  status_history: Array<{
    status: 'saved' | 'applied' | 'interviewing' | 'offer' | 'rejected';
    changed_at: string;
    note?: string;
  }>;
  created_at: string;
  updated_at: string;
};

export type OnboardingRecord = {
  id: string;
  user_key: string;
  locale: 'en' | 'zh';
  skipped: boolean;
  answers: Record<string, string>;
  created_at: string;
  updated_at: string;
};

export type ResumeWorkspaceRecord = {
  id: string;
  user_key: string;
  locale: 'en' | 'zh';
  full_name: string;
  role_title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
  skills: string[];
  selected_focus: string;
  experience: Array<{
    title: string;
    company: string;
    period: string;
    bullets: string[];
  }>;
  projects: Array<{
    name: string;
    role: string;
    period: string;
    bullets: string[];
  }>;
  education: Array<{
    school: string;
    degree: string;
    period: string;
    bullets: string[];
  }>;
  certifications: string[];
  latex: string;
  updated_at: string;
  versions: Array<{
    id: string;
    saved_at: string;
    role_title: string;
    summary: string;
    latex: string;
  }>;
};

type WorkspaceDb = {
  forum_posts: ForumPostRecord[];
  forum_comments: ForumCommentRecord[];
  applications: ApplicationRecord[];
  onboarding: OnboardingRecord[];
  resume_workspaces: ResumeWorkspaceRecord[];
};

const DATA_DIR = process.env.REACHABLE_DATA_DIR || path.join(process.cwd(), '.local-data');
const DB_PATH = path.join(DATA_DIR, 'workspace-db.json');

function createEmptyDb(): WorkspaceDb {
  return {
    forum_posts: [],
    forum_comments: [],
    applications: [],
    onboarding: [],
    resume_workspaces: [],
  };
}

function normalizeApplication(record: Partial<ApplicationRecord>): ApplicationRecord | null {
  if (typeof record.id !== 'string' || typeof record.user_key !== 'string' || typeof record.job_id !== 'string') {
    return null;
  }

  return {
    id: record.id,
    user_key: record.user_key,
    job_id: record.job_id,
    title: typeof record.title === 'string' ? record.title : 'Untitled role',
    company: typeof record.company === 'string' ? record.company : 'Unknown company',
    location: typeof record.location === 'string' ? record.location : '',
    source_url: typeof record.source_url === 'string' ? record.source_url : '',
    status:
      record.status === 'applied' ||
      record.status === 'interviewing' ||
      record.status === 'offer' ||
      record.status === 'rejected'
        ? record.status
        : 'saved',
    notes: typeof record.notes === 'string' ? record.notes : '',
    fit_score: typeof record.fit_score === 'number' ? record.fit_score : undefined,
    fit_summary: typeof record.fit_summary === 'string' ? record.fit_summary : '',
    fit_strengths: Array.isArray(record.fit_strengths) ? record.fit_strengths.filter((item): item is string => typeof item === 'string') : [],
    fit_gaps: Array.isArray(record.fit_gaps) ? record.fit_gaps.filter((item): item is string => typeof item === 'string') : [],
    fit_next_steps: Array.isArray(record.fit_next_steps) ? record.fit_next_steps.filter((item): item is string => typeof item === 'string') : [],
    status_history: Array.isArray(record.status_history)
      ? record.status_history
          .filter((item) => item && typeof item === 'object')
          .map((item) => ({
            status:
              item.status === 'applied' ||
              item.status === 'interviewing' ||
              item.status === 'offer' ||
              item.status === 'rejected'
                ? item.status
                : 'saved',
            changed_at: typeof item.changed_at === 'string' ? item.changed_at : new Date().toISOString(),
            note: typeof item.note === 'string' ? item.note : '',
          }))
      : [],
    created_at: typeof record.created_at === 'string' ? record.created_at : new Date().toISOString(),
    updated_at: typeof record.updated_at === 'string' ? record.updated_at : new Date().toISOString(),
  };
}

function normalizeResumeWorkspace(record: Partial<ResumeWorkspaceRecord>): ResumeWorkspaceRecord | null {
  if (typeof record.id !== 'string' || typeof record.user_key !== 'string') {
    return null;
  }

  return {
    id: record.id,
    user_key: record.user_key,
    locale: record.locale === 'zh' ? 'zh' : 'en',
    full_name: typeof record.full_name === 'string' ? record.full_name : '',
    role_title: typeof record.role_title === 'string' ? record.role_title : '',
    email: typeof record.email === 'string' ? record.email : '',
    phone: typeof record.phone === 'string' ? record.phone : '',
    location: typeof record.location === 'string' ? record.location : '',
    website: typeof record.website === 'string' ? record.website : '',
    linkedin: typeof record.linkedin === 'string' ? record.linkedin : '',
    github: typeof record.github === 'string' ? record.github : '',
    summary: typeof record.summary === 'string' ? record.summary : '',
    skills: Array.isArray(record.skills) ? record.skills.filter((item): item is string => typeof item === 'string') : [],
    selected_focus: typeof record.selected_focus === 'string' ? record.selected_focus : '',
    experience: Array.isArray(record.experience) ? record.experience : [],
    projects: Array.isArray(record.projects) ? record.projects : [],
    education: Array.isArray(record.education) ? record.education : [],
    certifications: Array.isArray(record.certifications) ? record.certifications.filter((item): item is string => typeof item === 'string') : [],
    latex: typeof record.latex === 'string' ? record.latex : '',
    updated_at: typeof record.updated_at === 'string' ? record.updated_at : new Date().toISOString(),
    versions: Array.isArray(record.versions)
      ? record.versions
          .filter((item) => item && typeof item === 'object')
          .map((item) => ({
            id: typeof item.id === 'string' ? item.id : `version-${randomUUID()}`,
            saved_at: typeof item.saved_at === 'string' ? item.saved_at : new Date().toISOString(),
            role_title: typeof item.role_title === 'string' ? item.role_title : '',
            summary: typeof item.summary === 'string' ? item.summary : '',
            latex: typeof item.latex === 'string' ? item.latex : '',
          }))
      : [],
  };
}

async function ensureDb() {
  await mkdir(DATA_DIR, { recursive: true });

  try {
    const raw = await readFile(DB_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<WorkspaceDb>;
    return {
      forum_posts: Array.isArray(parsed.forum_posts) ? parsed.forum_posts : [],
      forum_comments: Array.isArray(parsed.forum_comments) ? parsed.forum_comments : [],
      applications: Array.isArray(parsed.applications)
        ? parsed.applications.map((item) => normalizeApplication(item)).filter((item): item is ApplicationRecord => Boolean(item))
        : [],
      onboarding: Array.isArray(parsed.onboarding) ? parsed.onboarding : [],
      resume_workspaces: Array.isArray(parsed.resume_workspaces)
        ? parsed.resume_workspaces.map((item) => normalizeResumeWorkspace(item)).filter((item): item is ResumeWorkspaceRecord => Boolean(item))
        : [],
    } satisfies WorkspaceDb;
  } catch {
    const empty = createEmptyDb();
    await writeFile(DB_PATH, JSON.stringify(empty, null, 2), 'utf-8');
    return empty;
  }
}

async function saveDb(db: WorkspaceDb) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

async function trySupabase<T>(operation: () => Promise<T>) {
  if (!isSupabaseConfigured()) return null;

  try {
    return await operation();
  } catch (error) {
    console.warn('Supabase workspace storage failed, falling back to local storage:', error);
    return null;
  }
}

function sb() {
  return getSupabaseClient();
}

function normalizePost(record: Partial<ForumPostRecord>): ForumPostRecord {
  return {
    id: typeof record.id === 'string' ? record.id : `db-post-${randomUUID()}`,
    locale: record.locale === 'zh' ? 'zh' : 'en',
    author: typeof record.author === 'string' ? record.author : 'Guest User',
    owner_key: typeof record.owner_key === 'string' ? record.owner_key : '',
    title: typeof record.title === 'string' ? record.title : '',
    content: typeof record.content === 'string' ? record.content : '',
    category: typeof record.category === 'string' ? record.category : 'Job Discussion',
    tags: typeof record.tags === 'string' ? record.tags : '',
    target_job: typeof record.target_job === 'string' ? record.target_job : '',
    company: typeof record.company === 'string' ? record.company : '',
    views: typeof record.views === 'number' ? record.views : 0,
    likes: typeof record.likes === 'number' ? record.likes : 0,
    comments_count: typeof record.comments_count === 'number' ? record.comments_count : 0,
    created_at: typeof record.created_at === 'string' ? record.created_at : new Date().toISOString(),
  };
}

function normalizeComment(record: Partial<ForumCommentRecord>): ForumCommentRecord {
  return {
    id: typeof record.id === 'string' ? record.id : `db-comment-${randomUUID()}`,
    post_id: typeof record.post_id === 'string' ? record.post_id : '',
    locale: record.locale === 'zh' ? 'zh' : 'en',
    author: typeof record.author === 'string' ? record.author : 'Guest User',
    owner_key: typeof record.owner_key === 'string' ? record.owner_key : '',
    content: typeof record.content === 'string' ? record.content : '',
    likes: typeof record.likes === 'number' ? record.likes : 0,
    created_at: typeof record.created_at === 'string' ? record.created_at : new Date().toISOString(),
  };
}

export async function listWorkspacePosts(locale: 'en' | 'zh') {
  const remote = await trySupabase(async () => {
    const { data, error } = await sb()
      .from('reachable_forum_posts')
      .select('*')
      .eq('locale', locale)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []).map((item) => normalizePost(item));
  });
  if (remote) return remote;

  const db = await ensureDb();
  return db.forum_posts.filter((post) => post.locale === locale);
}

export async function createWorkspacePost(
  input: Omit<ForumPostRecord, 'id' | 'views' | 'likes' | 'comments_count' | 'created_at'>,
) {
  const remote = await trySupabase(async () => {
    const { data, error } = await sb()
      .from('reachable_forum_posts')
      .insert({
        ...input,
        views: 0,
        likes: 0,
        comments_count: 0,
      })
      .select('*')
      .single();

    if (error) throw error;
    return normalizePost(data);
  });
  if (remote) return remote;

  const db = await ensureDb();
  const post: ForumPostRecord = {
    id: `db-post-${randomUUID()}`,
    views: 0,
    likes: 0,
    comments_count: 0,
    created_at: new Date().toISOString(),
    ...input,
  };

  db.forum_posts.unshift(post);
  await saveDb(db);
  return post;
}

export async function getWorkspacePost(postId: string) {
  const remote = await trySupabase(async () => {
    const { data: postData, error: postError } = await sb()
      .from('reachable_forum_posts')
      .select('*')
      .eq('id', postId)
      .maybeSingle();
    if (postError) throw postError;

    const { data: commentData, error: commentError } = await sb()
      .from('reachable_forum_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    if (commentError) throw commentError;

    return {
      post: postData ? normalizePost(postData) : null,
      comments: (commentData ?? []).map((item) => normalizeComment(item)),
    };
  });
  if (remote) return remote;

  const db = await ensureDb();
  const post = db.forum_posts.find((item) => item.id === postId) || null;
  const comments = db.forum_comments
    .filter((item) => item.post_id === postId)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  return { post, comments };
}

export async function incrementWorkspacePostViews(postId: string) {
  const remote = await trySupabase(async () => {
    const { data, error: selectError } = await sb()
      .from('reachable_forum_posts')
      .select('views')
      .eq('id', postId)
      .maybeSingle();
    if (selectError) throw selectError;
    if (!data) return true;

    const { error: updateError } = await sb()
      .from('reachable_forum_posts')
      .update({ views: (typeof data.views === 'number' ? data.views : 0) + 1 })
      .eq('id', postId);
    if (updateError) throw updateError;
    return true;
  });
  if (remote) return;

  const db = await ensureDb();
  const post = db.forum_posts.find((item) => item.id === postId);
  if (!post) return;
  post.views += 1;
  await saveDb(db);
}

export async function deleteWorkspacePost(postId: string, ownerKey?: string) {
  const remote = await trySupabase(async () => {
    const query = sb().from('reachable_forum_posts').delete().eq('id', postId);
    const { error } = ownerKey && ownerKey !== 'anonymous'
      ? await query.eq('owner_key', ownerKey)
      : await query;
    if (error) throw error;
    return true;
  });
  if (remote !== null) return remote;

  const db = await ensureDb();
  const post = db.forum_posts.find((item) => item.id === postId);
  if (!post) return false;
  if (post.owner_key && ownerKey && ownerKey !== 'anonymous' && post.owner_key !== ownerKey) return false;

  db.forum_posts = db.forum_posts.filter((item) => item.id !== postId);
  db.forum_comments = db.forum_comments.filter((item) => item.post_id !== postId);
  await saveDb(db);
  return true;
}

export async function createWorkspaceComment(
  input: Omit<ForumCommentRecord, 'id' | 'likes' | 'created_at'>,
) {
  const remote = await trySupabase(async () => {
    const { data, error } = await sb()
      .from('reachable_forum_comments')
      .insert({ ...input, likes: 0 })
      .select('*')
      .single();
    if (error) throw error;

    const { data: postData, error: postSelectError } = await sb()
      .from('reachable_forum_posts')
      .select('comments_count')
      .eq('id', input.post_id)
      .maybeSingle();
    if (postSelectError) throw postSelectError;

    if (postData) {
      const { error: postUpdateError } = await sb()
        .from('reachable_forum_posts')
        .update({ comments_count: (typeof postData.comments_count === 'number' ? postData.comments_count : 0) + 1 })
        .eq('id', input.post_id);
      if (postUpdateError) throw postUpdateError;
    }

    return normalizeComment(data);
  });
  if (remote) return remote;

  const db = await ensureDb();
  const comment: ForumCommentRecord = {
    id: `db-comment-${randomUUID()}`,
    likes: 0,
    created_at: new Date().toISOString(),
    ...input,
  };

  db.forum_comments.unshift(comment);
  const post = db.forum_posts.find((item) => item.id === input.post_id);
  if (post) {
    post.comments_count += 1;
  }
  await saveDb(db);
  return comment;
}

export async function deleteWorkspaceComment(commentId: string, ownerKey?: string) {
  const remote = await trySupabase(async () => {
    const { data: comment, error: selectError } = await sb()
      .from('reachable_forum_comments')
      .select('*')
      .eq('id', commentId)
      .maybeSingle();
    if (selectError) throw selectError;
    if (!comment) return false;
    if (comment.owner_key && ownerKey && ownerKey !== 'anonymous' && comment.owner_key !== ownerKey) return false;

    const { error: deleteError } = await sb().from('reachable_forum_comments').delete().eq('id', commentId);
    if (deleteError) throw deleteError;

    const { data: post, error: postSelectError } = await sb()
      .from('reachable_forum_posts')
      .select('comments_count')
      .eq('id', comment.post_id)
      .maybeSingle();
    if (postSelectError) throw postSelectError;

    if (post) {
      const { error: postUpdateError } = await sb()
        .from('reachable_forum_posts')
        .update({ comments_count: Math.max(0, (typeof post.comments_count === 'number' ? post.comments_count : 0) - 1) })
        .eq('id', comment.post_id);
      if (postUpdateError) throw postUpdateError;
    }

    return true;
  });
  if (remote !== null) return remote;

  const db = await ensureDb();
  const comment = db.forum_comments.find((item) => item.id === commentId);
  if (!comment) return false;
  if (comment.owner_key && ownerKey && ownerKey !== 'anonymous' && comment.owner_key !== ownerKey) return false;

  db.forum_comments = db.forum_comments.filter((item) => item.id !== commentId);
  const post = db.forum_posts.find((item) => item.id === comment.post_id);
  if (post) {
    post.comments_count = Math.max(0, post.comments_count - 1);
  }
  await saveDb(db);
  return true;
}

export async function listApplications(userKey: string) {
  const remote = await trySupabase(async () => {
    const { data, error } = await sb()
      .from('reachable_applications')
      .select('*')
      .eq('user_key', userKey)
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map((item) => normalizeApplication(item)).filter((item): item is ApplicationRecord => Boolean(item));
  });
  if (remote) return remote;

  const db = await ensureDb();
  return db.applications
    .filter((item) => item.user_key === userKey)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
}

export async function upsertApplication(
  input: Omit<ApplicationRecord, 'id' | 'created_at' | 'updated_at' | 'status_history'> & { id?: string },
) {
  const remote = await trySupabase(async () => {
    const existingQuery = input.id
      ? sb().from('reachable_applications').select('*').eq('id', input.id)
      : sb().from('reachable_applications').select('*').eq('user_key', input.user_key).eq('job_id', input.job_id);
    const { data: existing, error: existingError } = await existingQuery.maybeSingle();
    if (existingError) throw existingError;

    const now = new Date().toISOString();
    const previous = existing ? normalizeApplication(existing) : null;
    const statusHistory = previous
      ? previous.status === input.status
        ? previous.status_history
        : [{ status: input.status, changed_at: now, note: input.notes }, ...previous.status_history].slice(0, 20)
      : [{ status: input.status, changed_at: now, note: input.notes }];

    const payload = {
      ...input,
      status_history: statusHistory,
      updated_at: now,
      created_at: previous?.created_at ?? now,
    };

    const { data, error } = await sb()
      .from('reachable_applications')
      .upsert(payload, { onConflict: input.id ? 'id' : 'user_key,job_id' })
      .select('*')
      .single();
    if (error) throw error;
    const normalized = normalizeApplication(data);
    if (!normalized) throw new Error('Invalid application returned from Supabase');
    return normalized;
  });
  if (remote) return remote;

  const db = await ensureDb();
  const now = new Date().toISOString();
  const existing = input.id ? db.applications.find((item) => item.id === input.id) : db.applications.find(
    (item) => item.user_key === input.user_key && item.job_id === input.job_id,
  );

  if (existing) {
    const previousStatus = existing.status;
    Object.assign(existing, input, { updated_at: now });
    if (previousStatus !== input.status) {
      existing.status_history = [
        {
          status: input.status,
          changed_at: now,
          note: input.notes,
        },
        ...(existing.status_history || []),
      ].slice(0, 20);
    }
    await saveDb(db);
    return existing;
  }

  const record: ApplicationRecord = {
    ...input,
    id: `app-${randomUUID()}`,
    created_at: now,
    updated_at: now,
    status_history: [
      {
        status: input.status,
        changed_at: now,
        note: input.notes,
      },
    ],
  };

  db.applications.unshift(record);
  await saveDb(db);
  return record;
}

export async function saveOnboarding(input: Omit<OnboardingRecord, 'id' | 'created_at' | 'updated_at'>) {
  const remote = await trySupabase(async () => {
    const now = new Date().toISOString();
    const { data: existing, error: existingError } = await sb()
      .from('reachable_onboarding')
      .select('created_at')
      .eq('user_key', input.user_key)
      .maybeSingle();
    if (existingError) throw existingError;

    const { data, error } = await sb()
      .from('reachable_onboarding')
      .upsert({
        ...input,
        created_at: existing?.created_at ?? now,
        updated_at: now,
      }, { onConflict: 'user_key' })
      .select('*')
      .single();
    if (error) throw error;
    return data as OnboardingRecord;
  });
  if (remote) return remote;

  const db = await ensureDb();
  const now = new Date().toISOString();
  const existing = db.onboarding.find((item) => item.user_key === input.user_key);

  if (existing) {
    Object.assign(existing, input, { updated_at: now });
    await saveDb(db);
    return existing;
  }

  const record: OnboardingRecord = {
    id: `onboard-${randomUUID()}`,
    created_at: now,
    updated_at: now,
    ...input,
  };

  db.onboarding.unshift(record);
  await saveDb(db);
  return record;
}

export async function getOnboarding(userKey: string) {
  const remote = await trySupabase(async () => {
    const { data, error } = await sb()
      .from('reachable_onboarding')
      .select('*')
      .eq('user_key', userKey)
      .maybeSingle();
    if (error) throw error;
    return (data as OnboardingRecord | null) ?? null;
  });
  if (remote !== null) return remote;

  const db = await ensureDb();
  return db.onboarding.find((item) => item.user_key === userKey) || null;
}

export async function upsertResumeWorkspace(
  input: Omit<ResumeWorkspaceRecord, 'id' | 'updated_at' | 'versions'> & { id?: string },
) {
  const remote = await trySupabase(async () => {
    const now = new Date().toISOString();
    const { data: existing, error: existingError } = await sb()
      .from('reachable_resume_workspaces')
      .select('*')
      .eq('user_key', input.user_key)
      .maybeSingle();
    if (existingError) throw existingError;

    const previous = existing ? normalizeResumeWorkspace(existing) : null;
    const versionEntry = {
      id: `resume-version-${randomUUID()}`,
      saved_at: now,
      role_title: input.role_title,
      summary: input.summary,
      latex: input.latex,
    };

    const { data, error } = await sb()
      .from('reachable_resume_workspaces')
      .upsert({
        ...input,
        versions: [versionEntry, ...(previous?.versions || [])].slice(0, 12),
        updated_at: now,
      }, { onConflict: 'user_key' })
      .select('*')
      .single();
    if (error) throw error;
    const normalized = normalizeResumeWorkspace(data);
    if (!normalized) throw new Error('Invalid resume workspace returned from Supabase');
    return normalized;
  });
  if (remote) return remote;

  const db = await ensureDb();
  const now = new Date().toISOString();
  const existing = db.resume_workspaces.find((item) => item.user_key === input.user_key);
  const versionEntry = {
    id: `resume-version-${randomUUID()}`,
    saved_at: now,
    role_title: input.role_title,
    summary: input.summary,
    latex: input.latex,
  };

  if (existing) {
    Object.assign(existing, input, {
      updated_at: now,
      versions: [versionEntry, ...(existing.versions || [])].slice(0, 12),
    });
    await saveDb(db);
    return existing;
  }

  const record: ResumeWorkspaceRecord = {
    ...input,
    id: `resume-${randomUUID()}`,
    updated_at: now,
    versions: [versionEntry],
  };

  db.resume_workspaces.unshift(record);
  await saveDb(db);
  return record;
}

export async function getResumeWorkspace(userKey: string) {
  const remote = await trySupabase(async () => {
    const { data, error } = await sb()
      .from('reachable_resume_workspaces')
      .select('*')
      .eq('user_key', userKey)
      .maybeSingle();
    if (error) throw error;
    return data ? normalizeResumeWorkspace(data) : null;
  });
  if (remote !== null) return remote;

  const db = await ensureDb();
  return db.resume_workspaces.find((item) => item.user_key === userKey) || null;
}
