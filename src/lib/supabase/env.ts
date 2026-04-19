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

type SupabaseTarget = 'local' | 'cloud';

function getSupabaseTarget(): SupabaseTarget {
  const rawTarget = process.env.EXPO_PUBLIC_SUPABASE_TARGET?.trim().toLowerCase() ?? 'local';
  return rawTarget === 'local' ? 'local' : 'cloud';
}

function hasExplicitTarget(): boolean {
  return (process.env.EXPO_PUBLIC_SUPABASE_TARGET?.trim().length ?? 0) > 0;
}

function getLegacyPublicValues(): {
  url: string;
  publishableKey: string;
} {
  return {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() ?? '',
    publishableKey: process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ?? '',
  };
}

function getTargetedPublicValues(target: SupabaseTarget): {
  url: string;
  publishableKey: string;
  expectedNames: string[];
} {
  if (target === 'local') {
    return {
      url: process.env.EXPO_PUBLIC_SUPABASE_LOCAL_URL?.trim() ?? '',
      publishableKey: process.env.EXPO_PUBLIC_SUPABASE_LOCAL_PUBLISHABLE_KEY?.trim() ?? '',
      expectedNames: [
        'EXPO_PUBLIC_SUPABASE_LOCAL_URL',
        'EXPO_PUBLIC_SUPABASE_LOCAL_PUBLISHABLE_KEY',
      ],
    };
  }

  return {
    url: process.env.EXPO_PUBLIC_SUPABASE_CLOUD_URL?.trim() ?? '',
    publishableKey: process.env.EXPO_PUBLIC_SUPABASE_CLOUD_PUBLISHABLE_KEY?.trim() ?? '',
    expectedNames: [
      'EXPO_PUBLIC_SUPABASE_CLOUD_URL',
      'EXPO_PUBLIC_SUPABASE_CLOUD_PUBLISHABLE_KEY',
    ],
  };
}

export function getSupabasePublicEnv(): PublicSupabaseEnv | null {
  const target = getSupabaseTarget();
  const targeted = getTargetedPublicValues(target);
  const legacy = getLegacyPublicValues();
  const allowLegacyFallback = !hasExplicitTarget() && target !== 'local';

  const url = targeted.url || (allowLegacyFallback ? legacy.url : '');
  const publishableKey =
    targeted.publishableKey || (allowLegacyFallback ? legacy.publishableKey : '');

  const missing: string[] = [];
  if (!url) {
    missing.push(...targeted.expectedNames);
  }
  if (!publishableKey) {
    missing.push(...targeted.expectedNames.slice(1));
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
  const secretKey = process.env.APP_SUPABASE_SERVICE_ROLE_KEY?.trim() ?? '';
  const target = getSupabaseTarget();
  const targeted = getTargetedPublicValues(target);
  const legacy = getLegacyPublicValues();
  const allowLegacyFallback = !hasExplicitTarget() && target !== 'local';

  if (!publicEnv || !secretKey) {
    const missing: string[] = [];
    if (!publicEnv) {
      if (!(targeted.url || (allowLegacyFallback ? legacy.url : ''))) {
        missing.push(targeted.expectedNames[0]);
      }
      if (!(targeted.publishableKey || (allowLegacyFallback ? legacy.publishableKey : ''))) {
        missing.push(targeted.expectedNames[1]);
      }
    }
    if (!secretKey) {
      missing.push('APP_SUPABASE_SERVICE_ROLE_KEY');
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
