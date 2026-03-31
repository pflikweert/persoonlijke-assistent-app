import type { Session } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';

import { getSupabaseBrowserClient } from '@/src/lib/supabase';

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
