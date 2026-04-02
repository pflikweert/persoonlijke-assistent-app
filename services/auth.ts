import type { Session } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';

import { getSupabaseBrowserClient, getSupabasePublicEnv } from '@/src/lib/supabase';

export async function getCurrentSession(): Promise<Session | null> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }

  return data.session ?? null;
}

function parseJwtIssuer(accessToken: string | null): string | null {
  if (!accessToken) {
    return null;
  }

  const parts = accessToken.split('.');
  if (parts.length < 2) {
    return null;
  }

  try {
    const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(payloadBase64);
    const parsed = JSON.parse(decoded) as { iss?: unknown };
    return typeof parsed.iss === 'string' && parsed.iss.length > 0 ? parsed.iss : null;
  } catch {
    return null;
  }
}

function getExpectedIssuerFromPublicEnv(): string | null {
  const env = getSupabasePublicEnv();

  if (!env) {
    return null;
  }

  try {
    return `${new URL(env.url).origin}/auth/v1`;
  } catch {
    return null;
  }
}

export async function ensureAuthenticatedUserSession(args: {
  flowId: string;
  source: 'process-entry' | 'generate-reflection' | 'regenerate-day-journal' | 'renormalize-entry';
}): Promise<{ userId: string }> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    throw new Error('Supabase client niet beschikbaar. Controleer je env variabelen.');
  }

  const session = await getCurrentSession();
  const accessToken = session?.access_token ?? null;
  const tokenIssuer = parseJwtIssuer(accessToken);
  const expectedIssuer = getExpectedIssuerFromPublicEnv();

  if (process.env.EXPO_PUBLIC_DEBUG_FUNCTION_AUTH === '1') {
    console.info('[function-auth:client-session]', {
      flowId: args.flowId,
      source: args.source,
      hasSession: Boolean(session),
      hasUserId: Boolean(session?.user?.id),
      hasAccessToken: Boolean(accessToken),
      tokenIssuer,
      expectedIssuer,
      issuerMatches: tokenIssuer && expectedIssuer ? tokenIssuer === expectedIssuer : null,
    });
  }

  if (!accessToken) {
    throw new Error('Je bent niet ingelogd. Vraag opnieuw een magic link aan.');
  }

  if (tokenIssuer && expectedIssuer && tokenIssuer !== expectedIssuer) {
    throw new Error('Sessie hoort bij een ander Supabase-project. Log opnieuw in.');
  }

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new Error('Je sessie is ongeldig of verlopen. Log opnieuw in.');
  }

  return { userId: data.user.id };
}

export function onAuthStateChange(callback: (session: Session | null) => void) {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    callback(null);
    return () => undefined;
  }

  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });

  return () => {
    data.subscription.unsubscribe();
  };
}

export async function sendMagicLink(email: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    throw new Error('Supabase client niet beschikbaar. Controleer je env variabelen.');
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    throw new Error('Vul eerst je e-mailadres in.');
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: normalizedEmail,
    options: {
      emailRedirectTo: Linking.createURL('/'),
    },
  });

  if (error) {
    throw error;
  }
}

export async function signOutUser(): Promise<void> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    throw new Error('Supabase client niet beschikbaar. Controleer je env variabelen.');
  }

  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}
