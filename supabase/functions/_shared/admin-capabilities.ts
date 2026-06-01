import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// @ts-ignore -- Deno runtime requires local import extensions.
import { getMergedAdminAllowlistFromEnv } from './admin-access.ts';

export const ADMIN_CAPABILITIES = [
  'ai_quality_studio',
  'regeneration',
  'meeting_capture',
] as const;

export type AdminCapability = (typeof ADMIN_CAPABILITIES)[number];

export type AdminCapabilityAccessMap = Record<AdminCapability, boolean>;

export type AdminAccessContext = {
  userId: string;
  isFounder: boolean;
  capabilities: AdminCapabilityAccessMap;
  canAccessAnyAdminArea: boolean;
  usedLegacyBootstrap: boolean;
};

function emptyAccessMap(): AdminCapabilityAccessMap {
  return {
    ai_quality_studio: false,
    regeneration: false,
    meeting_capture: false,
  };
}

function toAccessMap(capabilities: Iterable<string>, grantAll = false): AdminCapabilityAccessMap {
  const map = emptyAccessMap();
  if (grantAll) {
    for (const capability of ADMIN_CAPABILITIES) {
      map[capability] = true;
    }
    return map;
  }

  for (const capability of capabilities) {
    if (capability === 'ai_quality_studio' || capability === 'regeneration' || capability === 'meeting_capture') {
      map[capability] = true;
    }
  }

  return map;
}

function getServiceRoleKey(): string {
  const value =
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')?.trim() ??
    Deno.env.get('APP_SUPABASE_SERVICE_ROLE_KEY')?.trim() ??
    '';

  if (!value) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY ontbreekt.');
  }

  return value;
}

async function authenticateUser(args: {
  request: Request;
  supabaseUrl: string;
  supabaseAnonKey: string;
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

  return { userId: data.user.id };
}

async function bootstrapLegacyFounderIfNeeded(args: {
  adminClient: any;
  userId: string;
}): Promise<boolean> {
  const legacyFounderIds = getMergedAdminAllowlistFromEnv([
    'ADMIN_ACCESS_FOUNDER_ALLOWLIST_USER_IDS',
    'ADMIN_AI_QUALITY_ALLOWLIST_USER_IDS',
    'ADMIN_REGEN_ALLOWLIST_USER_IDS',
  ]);

  const { count, error: countError } = await args.adminClient
    .from('admin_founders')
    .select('user_id', { count: 'exact', head: true });

  if (countError) {
    throw new Error('Failed to read admin founder bootstrap state.');
  }

  if ((count ?? 0) > 0 || !legacyFounderIds.has(args.userId)) {
    return false;
  }

  const { error: founderError } = await args.adminClient
    .from('admin_founders')
    .upsert(
      {
        user_id: args.userId,
        created_by: args.userId,
      },
      { onConflict: 'user_id' }
    );

  if (founderError) {
    throw new Error('Failed to bootstrap founder access.');
  }

  const grantRows = ADMIN_CAPABILITIES.map((capability) => ({
    user_id: args.userId,
    capability,
    granted_by: args.userId,
  }));

  const { error: grantError } = await args.adminClient
    .from('admin_user_capabilities')
    .upsert(grantRows, { onConflict: 'user_id,capability' });

  if (grantError) {
    throw new Error('Failed to bootstrap founder capabilities.');
  }

  return true;
}

export async function loadAdminAccessContext(args: {
  request: Request;
  supabaseUrl: string;
  supabaseAnonKey: string;
}): Promise<AdminAccessContext> {
  const { userId } = await authenticateUser(args);
  const adminClient = createClient(args.supabaseUrl, getServiceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const usedLegacyBootstrap = await bootstrapLegacyFounderIfNeeded({
    adminClient,
    userId,
  });

  const [{ data: founderRow, error: founderError }, { data: capabilityRows, error: capabilityError }] =
    await Promise.all([
      adminClient.from('admin_founders').select('user_id').eq('user_id', userId).maybeSingle(),
      adminClient.from('admin_user_capabilities').select('capability').eq('user_id', userId),
    ]);

  if (founderError) {
    throw new Error('Failed to load founder access.');
  }

  if (capabilityError) {
    throw new Error('Failed to load admin capabilities.');
  }

  const isFounder = Boolean(founderRow?.user_id);
  const capabilities = isFounder
    ? toAccessMap(ADMIN_CAPABILITIES, true)
    : toAccessMap((capabilityRows ?? []).map((row: { capability: string }) => row.capability));
  const canAccessAnyAdminArea = ADMIN_CAPABILITIES.some((capability) => capabilities[capability]);

  return {
    userId,
    isFounder,
    capabilities,
    canAccessAnyAdminArea,
    usedLegacyBootstrap,
  };
}

export function hasCapabilityAccess(
  context: AdminAccessContext,
  capability: AdminCapability
): boolean {
  return context.isFounder || context.capabilities[capability] === true;
}

export function parseAdminCapability(value: unknown): AdminCapability | null {
  return value === 'ai_quality_studio' || value === 'regeneration' || value === 'meeting_capture'
    ? value
    : null;
}

export function parseAdminCapabilityList(value: unknown): AdminCapability[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const parsed = value.map((item) => parseAdminCapability(item));
  if (parsed.some((item) => item === null)) {
    return null;
  }

  return [...new Set(parsed)] as AdminCapability[];
}
