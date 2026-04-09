import { getSupabaseBrowserClient } from '@/src/lib/supabase';

import { ensureAuthenticatedUserSession } from './auth';
import { createClientFlowId } from './function-error';

async function deleteRowsForUser(args: {
  tableName: 'period_reflections' | 'day_journals' | 'entries_normalized' | 'entries_raw';
  userId: string;
}): Promise<void> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    throw new Error('Supabase client niet beschikbaar. Controleer je env variabelen.');
  }

  const { error } = await supabase.from(args.tableName).delete().eq('user_id', args.userId);

  if (error) {
    throw error;
  }
}

export async function resetAllUserData(): Promise<void> {
  const flowId = createClientFlowId('export-archive');
  const { userId } = await ensureAuthenticatedUserSession({
    flowId,
    source: 'export-archive',
  });

  await deleteRowsForUser({ tableName: 'period_reflections', userId });
  await deleteRowsForUser({ tableName: 'day_journals', userId });
  await deleteRowsForUser({ tableName: 'entries_normalized', userId });
  await deleteRowsForUser({ tableName: 'entries_raw', userId });
}
