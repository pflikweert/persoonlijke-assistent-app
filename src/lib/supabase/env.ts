type PublicSupabaseEnv = {
  url: string;
  publishableKey: string;
};

type ServerSupabaseEnv = {
  url: string;
  secretKey: string;
};

const warnedMessages = new Set<string>();

function warnOnce(message: string) {
  if (warnedMessages.has(message)) {
    return;
  }

  warnedMessages.add(message);
  console.error(message);
}

function formatMissingMessage(scope: 'public' | 'server', missingKeys: string[]) {
  return [
    `[supabase:${scope}-env] Missing required env var(s): ${missingKeys.join(', ')}`,
    'Set these in your local env file before using the Supabase client.',
  ].join(' ');
}

export function getSupabasePublicEnv(): PublicSupabaseEnv | null {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() ?? '';
  const publishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ?? '';

  const missing: string[] = [];
  if (!url) {
    missing.push('EXPO_PUBLIC_SUPABASE_URL');
  }
  if (!publishableKey) {
    missing.push('EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
  }

  if (missing.length > 0) {
    warnOnce(formatMissingMessage('public', missing));
    return null;
  }

  return {
    url,
    publishableKey,
  };
}

export function getSupabaseServerEnv(): ServerSupabaseEnv | null {
  const publicEnv = getSupabasePublicEnv();
  const secretKey = process.env.SUPABASE_SECRET_KEY?.trim() ?? '';

  if (!publicEnv || !secretKey) {
    const missing: string[] = [];
    if (!publicEnv) {
      if (!process.env.EXPO_PUBLIC_SUPABASE_URL?.trim()) {
        missing.push('EXPO_PUBLIC_SUPABASE_URL');
      }
      if (!process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim()) {
        missing.push('EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
      }
    }
    if (!secretKey) {
      missing.push('SUPABASE_SECRET_KEY');
    }

    warnOnce(formatMissingMessage('server', missing));
    return null;
  }

  return {
    url: publicEnv.url,
    secretKey,
  };
}

export type { PublicSupabaseEnv, ServerSupabaseEnv };
