import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export function parseAdminAllowlist(rawValue: string | undefined): Set<string> {
  const source = rawValue?.trim() ?? '';
  if (!source) {
    return new Set();
  }

  const items = source
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  return new Set(items);
}

export function getAdminAllowlistFromEnv(args: {
  primaryEnvKey: string;
  fallbackEnvKey?: string;
}): Set<string> {
  const primary = Deno.env.get(args.primaryEnvKey);
  if (primary && primary.trim().length > 0) {
    return parseAdminAllowlist(primary);
  }

  if (args.fallbackEnvKey) {
    return parseAdminAllowlist(Deno.env.get(args.fallbackEnvKey));
  }

  return new Set();
}

export function getInternalTokenFromEnv(args: {
  primaryEnvKey: string;
  fallbackEnvKey?: string;
}): string {
  const primary = Deno.env.get(args.primaryEnvKey)?.trim() ?? '';
  if (primary.length > 0) {
    return primary;
  }

  if (args.fallbackEnvKey) {
    return Deno.env.get(args.fallbackEnvKey)?.trim() ?? '';
  }

  return '';
}

export async function authenticateAllowlistedAdmin(args: {
  request: Request;
  supabaseUrl: string;
  supabaseAnonKey: string;
  allowlist: Set<string>;
}): Promise<{ userId: string }> {
  const authHeader = args.request.headers.get('Authorization');
  if (!authHeader) {
    throw new Error('Missing Authorization header');
  }

  const supabase = createClient(args.supabaseUrl, args.supabaseAnonKey, {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  });

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw new Error('Unauthorized');
  }

  if (args.allowlist.size === 0 || !args.allowlist.has(data.user.id)) {
    throw new Error('Forbidden');
  }

  return { userId: data.user.id };
}