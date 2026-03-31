import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type { Database } from './database.types';
import { getSupabasePublicEnv } from './env';

let cachedClient: SupabaseClient<Database> | null = null;

export function createSupabaseBrowserClient(): SupabaseClient<Database> | null {
  const env = getSupabasePublicEnv();

  if (!env) {
    return null;
  }

  return createClient<Database>(env.url, env.publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
}

export function getSupabaseBrowserClient(): SupabaseClient<Database> | null {
  if (cachedClient) {
    return cachedClient;
  }

  cachedClient = createSupabaseBrowserClient();
  return cachedClient;
}
