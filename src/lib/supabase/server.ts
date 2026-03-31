import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type { Database } from './database.types';
import { getSupabaseServerEnv } from './env';

/**
 * Placeholder for server-side usage.
 * Do not import this file in client-rendered Expo UI code.
 */
export function createSupabaseServerClient(): SupabaseClient<Database> | null {
  const env = getSupabaseServerEnv();

  if (!env) {
    return null;
  }

  return createClient<Database>(env.url, env.secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
