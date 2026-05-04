export function getSafeExternalUrl(input?: string | null) {
  if (!input) {
    return null;
  }

  try {
    const url = new URL(input);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}
