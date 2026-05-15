'use client';

export function getClientKey() {
  const storageKey = 'reachable-client-key';
  const existing = localStorage.getItem(storageKey);
  if (existing) {
    return existing;
  }

  const next = `client-${crypto.randomUUID()}`;
  localStorage.setItem(storageKey, next);
  return next;
}
