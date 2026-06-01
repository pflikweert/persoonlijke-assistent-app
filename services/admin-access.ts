import type {
  AdminAccessState,
  AdminManagedUserSummary,
  UpdateAdminUserCapabilitiesPayload,
} from "@/types";

import { getSupabaseBrowserClient } from "@/src/lib/supabase";
import { ensureAuthenticatedUserSession } from "@/services/auth";
import {
  createClientFlowId,
  FunctionFlowError,
  isFunctionErrorPayload,
} from "@/services/function-error";

type AccessResponse = {
  status: "ok";
  flow: "admin-access-control";
  requestId: string;
  flowId: string;
  access: AdminAccessState;
};

type ListUsersResponse = {
  status: "ok";
  flow: "admin-access-control";
  requestId: string;
  flowId: string;
  users: AdminManagedUserSummary[];
};

function parseFunctionMessage(parsed: unknown): string | null {
  if (!parsed || typeof parsed !== "object") {
    return null;
  }

  const message = (parsed as { error?: unknown; message?: unknown }).error;
  if (typeof message === "string" && message.length > 0) {
    return message;
  }

  const alt = (parsed as { message?: unknown }).message;
  return typeof alt === "string" && alt.length > 0 ? alt : null;
}

async function parseFunctionInvokeError(error: unknown): Promise<never> {
  const fallback =
    error instanceof Error ? error.message : "Adminrechten konden niet geladen worden.";

  if (!error || typeof error !== "object") {
    throw new Error(fallback);
  }

  const maybeContext = (error as { context?: unknown }).context;
  if (!(maybeContext instanceof Response)) {
    throw new Error(fallback);
  }

  const text = await maybeContext.text();
  if (!text) {
    throw new Error(fallback);
  }

  try {
    const parsed = JSON.parse(text) as unknown;
    if (isFunctionErrorPayload(parsed)) {
      throw new FunctionFlowError(parsed);
    }

    throw new Error(parseFunctionMessage(parsed) ?? text);
  } catch (nextError) {
    if (nextError instanceof FunctionFlowError || nextError instanceof Error) {
      throw nextError;
    }

    throw new Error(text);
  }
}

async function invokeAction<T>(input: {
  flowId: string;
  body: Record<string, unknown>;
}): Promise<T> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    throw new Error("Supabase client niet beschikbaar. Controleer je env variabelen.");
  }

  const { data, error } = await supabase.functions.invoke<T>("admin-access-control", {
    headers: {
      "x-flow-id": input.flowId,
    },
    body: input.body,
  });

  if (error) {
    await parseFunctionInvokeError(error);
  }

  if (!data) {
    throw new Error("Lege response van admin-access-control.");
  }

  return data;
}

export async function fetchMyAdminAccess(): Promise<AdminAccessState> {
  const flowId = createClientFlowId("admin-access");
  await ensureAuthenticatedUserSession({ flowId, source: "admin-access-control" });

  const data = await invokeAction<AccessResponse>({
    flowId,
    body: {
      action: "my_access",
    },
  });

  if (
    data.status !== "ok" ||
    data.flow !== "admin-access-control" ||
    !data.requestId ||
    !data.access
  ) {
    throw new Error("Ongeldige response van admin-access-control my_access.");
  }

  return data.access;
}

export async function hasAdminCapabilityAccess(
  capability: keyof AdminAccessState["capabilities"]
): Promise<boolean> {
  try {
    const access = await fetchMyAdminAccess();
    return access.isFounder || access.capabilities[capability] === true;
  } catch (error) {
    if (error instanceof FunctionFlowError) {
      if (error.payload.code === "AUTH_UNAUTHORIZED" || error.payload.code === "AUTH_MISSING") {
        return false;
      }
    }

    throw error;
  }
}

export async function hasAnyAdminAccess(): Promise<boolean> {
  const access = await fetchMyAdminAccess();
  return access.canAccessAdminMenu;
}

export async function listAdminManagedUsers(): Promise<AdminManagedUserSummary[]> {
  const flowId = createClientFlowId("admin-access");
  await ensureAuthenticatedUserSession({ flowId, source: "admin-access-control" });

  const data = await invokeAction<ListUsersResponse>({
    flowId,
    body: {
      action: "list_users",
    },
  });

  if (
    data.status !== "ok" ||
    data.flow !== "admin-access-control" ||
    !data.requestId ||
    !Array.isArray(data.users)
  ) {
    throw new Error("Ongeldige response van admin-access-control list_users.");
  }

  return data.users;
}

export async function updateAdminUserCapabilities(
  payload: UpdateAdminUserCapabilitiesPayload
): Promise<AdminManagedUserSummary[]> {
  const flowId = createClientFlowId("admin-access");
  await ensureAuthenticatedUserSession({ flowId, source: "admin-access-control" });

  const data = await invokeAction<ListUsersResponse>({
    flowId,
    body: {
      action: "set_capabilities",
      userId: payload.userId,
      capabilities: payload.capabilities,
    },
  });

  if (
    data.status !== "ok" ||
    data.flow !== "admin-access-control" ||
    !data.requestId ||
    !Array.isArray(data.users)
  ) {
    throw new Error("Ongeldige response van admin-access-control set_capabilities.");
  }

  return data.users;
}
