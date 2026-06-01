import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// @ts-ignore -- Deno runtime requires local import extensions.
import { getFunctionRuntimeEnv } from '../_shared/env.ts';
// @ts-ignore -- Deno runtime requires local import extensions.
import { loadAdminAccessContext, parseAdminCapabilityList, type AdminCapability } from '../_shared/admin-capabilities.ts';
// @ts-ignore -- Deno runtime requires local import extensions.
import { createFlowError } from '../_shared/error-contract.ts';

const FLOW = 'admin-access-control' as const;

const CORS_BASE_HEADERS = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-flow-id',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

type RequestBody = {
  action?: unknown;
  userId?: unknown;
  capabilities?: unknown;
};

type ManagedUserRow = {
  user_id: string;
  email: string | null;
  display_name: string | null;
  is_founder: boolean;
  capabilities: string[] | null;
  created_at: string | null;
  last_sign_in_at: string | null;
};

function buildCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('origin') ?? '*';
  return {
    ...CORS_BASE_HEADERS,
    'Access-Control-Allow-Origin': origin,
    Vary: 'Origin',
  };
}

function jsonResponse(request: Request, status: number, payload: unknown) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...buildCorsHeaders(request),
      'Content-Type': 'application/json',
    },
  });
}

function errorResponse(input: {
  request: Request;
  httpStatus: number;
  requestId: string;
  flowId: string;
  step: string;
  code: Parameters<typeof createFlowError>[0]['code'];
  message: string;
  details?: Record<string, unknown>;
}) {
  return jsonResponse(
    input.request,
    input.httpStatus,
    createFlowError({
      flow: FLOW,
      requestId: input.requestId,
      flowId: input.flowId,
      step: input.step,
      code: input.code,
      message: input.message,
      ...(input.details ? { details: input.details } : {}),
    })
  );
}

function parseFlowId(request: Request, requestId: string): string {
  const flowId = request.headers.get('x-flow-id')?.trim() ?? '';
  return flowId.length > 0 ? flowId : requestId;
}

function getServiceRoleKey(): string {
  const serviceRoleKey =
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')?.trim() ??
    Deno.env.get('APP_SUPABASE_SERVICE_ROLE_KEY')?.trim() ??
    '';

  if (!serviceRoleKey) {
    throw new Error('Missing required env var: SUPABASE_SERVICE_ROLE_KEY');
  }

  return serviceRoleKey;
}

function parseUserId(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

function toCapabilityMap(capabilities: string[] | null, isFounder: boolean): Record<AdminCapability, boolean> {
  const capabilitySet = new Set(capabilities ?? []);
  return {
    ai_quality_studio: isFounder || capabilitySet.has('ai_quality_studio'),
    regeneration: isFounder || capabilitySet.has('regeneration'),
    meeting_capture: isFounder || capabilitySet.has('meeting_capture'),
  };
}

Deno.serve(async (request) => {
  const requestId = crypto.randomUUID();
  const flowId = parseFlowId(request, requestId);

  if (request.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: buildCorsHeaders(request) });
  }

  if (request.method !== 'POST') {
    return errorResponse({
      request,
      httpStatus: 405,
      requestId,
      flowId,
      step: 'received',
      code: 'INPUT_INVALID',
      message: 'Method not allowed.',
    });
  }

  try {
    const body = (await request.json()) as RequestBody;
    const action = typeof body.action === 'string' ? body.action.trim() : '';

    if (!action) {
      return errorResponse({
        request,
        httpStatus: 400,
        requestId,
        flowId,
        step: 'validated',
        code: 'INPUT_INVALID',
        message: 'Unsupported action.',
      });
    }

    const env = getFunctionRuntimeEnv();
    const adminClient = createClient(env.supabaseUrl, getServiceRoleKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    let accessContext;
    try {
      accessContext = await loadAdminAccessContext({
        request,
        supabaseUrl: env.supabaseUrl,
        supabaseAnonKey: env.supabaseAnonKey,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unauthorized';
      const code = message === 'Missing Authorization header' ? 'AUTH_MISSING' : 'AUTH_UNAUTHORIZED';
      return errorResponse({
        request,
        httpStatus: code === 'AUTH_MISSING' ? 401 : 403,
        requestId,
        flowId,
        step: 'authenticated',
        code,
        message,
      });
    }

    if (action === 'my_access') {
      return jsonResponse(request, 200, {
        status: 'ok',
        flow: FLOW,
        requestId,
        flowId,
        access: {
          userId: accessContext.userId,
          isFounder: accessContext.isFounder,
          canAccessAdminMenu: accessContext.canAccessAnyAdminArea,
          usedLegacyBootstrap: accessContext.usedLegacyBootstrap,
          capabilities: accessContext.capabilities,
        },
      });
    }

    if (!accessContext.isFounder) {
      return errorResponse({
        request,
        httpStatus: 403,
        requestId,
        flowId,
        step: 'authorized',
        code: 'AUTH_UNAUTHORIZED',
        message: 'Alleen founders mogen adminrechten beheren.',
      });
    }

    if (action === 'list_users') {
      const { data, error } = await adminClient.rpc('admin_list_users_with_capabilities');
      if (error) {
        return errorResponse({
          request,
          httpStatus: 500,
          requestId,
          flowId,
          step: 'list_users',
          code: 'DB_READ_FAILED',
          message: 'Kon admingebruikers niet laden.',
        });
      }

      const users = ((data ?? []) as ManagedUserRow[]).map((row) => ({
        userId: row.user_id,
        email: row.email,
        displayName: row.display_name,
        isFounder: row.is_founder === true,
        createdAt: row.created_at,
        lastSignInAt: row.last_sign_in_at,
        capabilities: toCapabilityMap(row.capabilities, row.is_founder === true),
      }));

      return jsonResponse(request, 200, {
        status: 'ok',
        flow: FLOW,
        requestId,
        flowId,
        users,
      });
    }

    if (action === 'set_capabilities') {
      const targetUserId = parseUserId(body.userId);
      const capabilities = parseAdminCapabilityList(body.capabilities);

      if (!targetUserId || !capabilities) {
        return errorResponse({
          request,
          httpStatus: 400,
          requestId,
          flowId,
          step: 'validated',
          code: 'INPUT_INVALID',
          message: 'userId of capabilities is ongeldig.',
        });
      }

      const { error } = await adminClient.rpc('admin_replace_user_capabilities', {
        p_target_user_id: targetUserId,
        p_capabilities: capabilities,
        p_actor_user_id: accessContext.userId,
      });

      if (error) {
        const message = typeof error.message === 'string' ? error.message : 'Kon adminrechten niet opslaan.';
        return errorResponse({
          request,
          httpStatus: message.includes('Founder-rechten') ? 403 : 500,
          requestId,
          flowId,
          step: 'set_capabilities',
          code: message.includes('Founder-rechten') ? 'AUTH_UNAUTHORIZED' : 'DB_WRITE_FAILED',
          message,
        });
      }

      const { data: usersData, error: usersError } = await adminClient.rpc('admin_list_users_with_capabilities');
      if (usersError) {
        return errorResponse({
          request,
          httpStatus: 500,
          requestId,
          flowId,
          step: 'reload_users',
          code: 'DB_READ_FAILED',
          message: 'Rechten opgeslagen, maar gebruikerstoestand kon niet worden herladen.',
        });
      }

      const users = ((usersData ?? []) as ManagedUserRow[]).map((row) => ({
        userId: row.user_id,
        email: row.email,
        displayName: row.display_name,
        isFounder: row.is_founder === true,
        createdAt: row.created_at,
        lastSignInAt: row.last_sign_in_at,
        capabilities: toCapabilityMap(row.capabilities, row.is_founder === true),
      }));

      return jsonResponse(request, 200, {
        status: 'ok',
        flow: FLOW,
        requestId,
        flowId,
        users,
      });
    }

    return errorResponse({
      request,
      httpStatus: 400,
      requestId,
      flowId,
      step: 'validated',
      code: 'INPUT_INVALID',
      message: 'Unsupported action.',
    });
  } catch {
    return errorResponse({
      request,
      httpStatus: 500,
      requestId,
      flowId,
      step: 'unexpected',
      code: 'INTERNAL_UNEXPECTED',
      message: 'Onverwachte fout in admin-access-control.',
    });
  }
});
