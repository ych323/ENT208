import { randomUUID, scryptSync, timingSafeEqual } from 'crypto';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import type { AppUser } from '@/lib/auth/session';

type LocalAuthUser = {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  avatar: string;
  createdAt: string;
};

type LocalAuthSession = {
  token: string;
  userId: string;
  createdAt: string;
};

type LocalAuthStore = {
  users: LocalAuthUser[];
  sessions: LocalAuthSession[];
};

const DATA_DIR = path.join(process.cwd(), '.local-data');
const STORE_PATH = path.join(DATA_DIR, 'auth-store.json');
const PASSWORD_SALT = 'reachable-local-auth';
const AVATAR_PALETTE = ['#1e7f64', '#f08c38', '#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6'];

function hashPassword(password: string) {
  return scryptSync(password, PASSWORD_SALT, 32).toString('hex');
}

function buildLocalAppUser(user: LocalAuthUser): AppUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    createdAt: user.createdAt,
  };
}

function pickAvatarColor(seed: string) {
  const index = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[index];
}

async function ensureStore() {
  await mkdir(DATA_DIR, { recursive: true });

  try {
    const raw = await readFile(STORE_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<LocalAuthStore>;
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
    } satisfies LocalAuthStore;
  } catch {
    const initial: LocalAuthStore = { users: [], sessions: [] };
    await writeFile(STORE_PATH, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
}

async function saveStore(store: LocalAuthStore) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
}

export async function createLocalUser(input: {
  username?: string;
  email: string;
  password: string;
}) {
  const store = await ensureStore();
  const email = input.email.trim().toLowerCase();

  if (store.users.some((user) => user.email === email)) {
    return { success: false as const, error: 'This email is already registered.' };
  }

  const username = input.username?.trim() || email.split('@')[0] || 'reachable-user';
  const now = new Date().toISOString();
  const user: LocalAuthUser = {
    id: randomUUID(),
    username: username.slice(0, 40),
    email,
    passwordHash: hashPassword(input.password),
    avatar: pickAvatarColor(email),
    createdAt: now,
  };

  const session: LocalAuthSession = {
    token: randomUUID(),
    userId: user.id,
    createdAt: now,
  };

  store.users.unshift(user);
  store.sessions = store.sessions.filter((item) => item.userId !== user.id);
  store.sessions.unshift(session);
  await saveStore(store);

  return {
    success: true as const,
    token: session.token,
    user: buildLocalAppUser(user),
  };
}

export async function signInLocalUser(emailInput: string, password: string) {
  const store = await ensureStore();
  const email = emailInput.trim().toLowerCase();
  const user = store.users.find((item) => item.email === email);

  if (!user) {
    return { success: false as const, error: 'Account not found.' };
  }

  const expected = Buffer.from(user.passwordHash, 'hex');
  const actual = Buffer.from(hashPassword(password), 'hex');

  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return { success: false as const, error: 'Incorrect password.' };
  }

  const session: LocalAuthSession = {
    token: randomUUID(),
    userId: user.id,
    createdAt: new Date().toISOString(),
  };

  store.sessions = store.sessions.filter((item) => item.userId !== user.id);
  store.sessions.unshift(session);
  await saveStore(store);

  return {
    success: true as const,
    token: session.token,
    user: buildLocalAppUser(user),
  };
}

export async function getLocalUserBySession(token: string) {
  const store = await ensureStore();
  const session = store.sessions.find((item) => item.token === token);
  if (!session) {
    return null;
  }

  const user = store.users.find((item) => item.id === session.userId);
  return user ? buildLocalAppUser(user) : null;
}

export async function clearLocalSession(token: string) {
  const store = await ensureStore();
  const nextSessions = store.sessions.filter((item) => item.token !== token);

  if (nextSessions.length !== store.sessions.length) {
    store.sessions = nextSessions;
    await saveStore(store);
  }
}
