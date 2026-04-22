#!/usr/bin/env node
import { resolveLocalAuthSmokeContext } from "./_shared/local-auth-smoke-utils.mjs";

const SMOKE_EMAIL_PATTERNS = [
  "smoke.default.local@example.com",
  "smoke.clean.local@example.com",
  "smoke.new.%@example.com",
  "verify.magic-link.%@example.com",
  "verify.%@example.com",
];

async function listAuthUsers(context) {
  const response = await fetch(`${context.apiUrl}/auth/v1/admin/users?page=1&per_page=1000`, {
    headers: {
      apikey: context.serviceRoleKey,
      Authorization: `Bearer ${context.serviceRoleKey}`,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`admin users list failed (${response.status}): ${body}`);
  }

  const data = await response.json();
  return Array.isArray(data?.users) ? data.users : [];
}

function toRegexPattern(pattern) {
  const escaped = pattern
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/%/g, ".*");
  return new RegExp(`^${escaped}$`, "i");
}

function matchesSmokeEmail(email) {
  const value = String(email || "").toLowerCase();
  return SMOKE_EMAIL_PATTERNS.some((pattern) => toRegexPattern(pattern).test(value));
}

async function deleteAuthUser(context, userId) {
  const response = await fetch(`${context.apiUrl}/auth/v1/admin/users/${userId}`, {
    method: "DELETE",
    headers: {
      apikey: context.serviceRoleKey,
      Authorization: `Bearer ${context.serviceRoleKey}`,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`admin delete user ${userId} failed (${response.status}): ${body}`);
  }
}

async function main() {
  const context = resolveLocalAuthSmokeContext();
  if (context.target !== "local") {
    throw new Error(
      `cleanup-local-smoke-users is local-only. Current EXPO_PUBLIC_SUPABASE_TARGET=${context.target}`
    );
  }
  if (!context.serviceRoleKey) {
    throw new Error("Missing APP_SUPABASE_SERVICE_ROLE_KEY required for local cleanup.");
  }

  const dryRun = process.argv.includes("--dry") || process.argv.includes("--dry-run");
  const force = process.argv.includes("--force");

  if (!dryRun && !force) {
    throw new Error("Refusing destructive cleanup without --force. Use --dry first.");
  }

  const users = (await listAuthUsers(context))
    .map((user) => ({
      id: String(user?.id || ""),
      email: String(user?.email || ""),
    }))
    .filter((user) => user.id && user.email && matchesSmokeEmail(user.email));

  if (users.length === 0) {
    console.log("PASS cleanup-local-smoke-users no-matching-users");
    return;
  }

  if (dryRun) {
    console.log("DRY cleanup-local-smoke-users matched:");
    for (const user of users) {
      console.log(`- ${user.email} (${user.id})`);
    }
    return;
  }

  const removedList = [];
  for (const user of users) {
    await deleteAuthUser(context, user.id);
    removedList.push(user);
  }

  console.log(`PASS cleanup-local-smoke-users removed=${removedList.length}`);
  for (const user of removedList) {
    console.log(`- ${user.email} (${user.id})`);
  }
}

main().catch((error) => {
  console.error("FAIL cleanup-local-smoke-users:", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
