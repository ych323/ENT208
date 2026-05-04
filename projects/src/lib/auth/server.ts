import { createClient } from '@supabase/supabase-js';
import { getSupabaseCredentials, isSupabaseConfigured } from '@/storage/database/supabase-client';

export function createSupabaseAuthClient(accessToken?: string) {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const { url, anonKey } = getSupabaseCredentials();

  return createClient(url, anonKey, {
    global: accessToken
      ? {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      : undefined,
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
