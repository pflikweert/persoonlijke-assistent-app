import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const ENV_FILE = path.join(ROOT_DIR, ".env.local");

function stripQuotes(value) {
  const trimmed = String(value ?? "").trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseEnvFile() {
  if (!fs.existsSync(ENV_FILE)) {
    return {};
  }

  const raw = fs.readFileSync(ENV_FILE, "utf8");
  const out = {};

  for (const line of raw.split(/\r?\n/)) {
    if (!line || /^\s*#/.test(line)) {
      continue;
    }

    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) {
      continue;
    }

    const [, key, value] = match;
    out[key] = stripQuotes(value);
  }

  return out;
}

function parseSupabaseStatusEnv() {
  try {
    const output = execSync("npx supabase status -o env", {
      cwd: ROOT_DIR,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });

    const parsed = {};
    for (const line of output.split(/\r?\n/)) {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (!match) {
        continue;
      }
      parsed[match[1]] = stripQuotes(match[2]);
    }
    return parsed;
  } catch {
    return {};
  }
}

function readValue({ key, envFile, status, fallback = "" }) {
  return (
    process.env[key]?.trim() ||
    envFile[key]?.trim() ||
    status[key]?.trim() ||
    fallback
  );
}

export function resolveLocalAuthSmokeContext() {
  const envFile = parseEnvFile();
  const status = parseSupabaseStatusEnv();

  const target = readValue({
    key: "EXPO_PUBLIC_SUPABASE_TARGET",
    envFile,
    status,
    fallback: "local",
  }).toLowerCase();

  const apiUrl = readValue({
    key: "EXPO_PUBLIC_SUPABASE_LOCAL_URL",
    envFile,
    status,
    fallback: status.API_URL || "http://127.0.0.1:54321",
  });

  const publishableKey = readValue({
    key: "EXPO_PUBLIC_SUPABASE_LOCAL_PUBLISHABLE_KEY",
    envFile,
    status,
    fallback: status.PUBLISHABLE_KEY || "",
  });

  const serviceRoleKey =
    target === "local"
      ? (status.SERVICE_ROLE_KEY?.trim() ||
        envFile.APP_SUPABASE_SERVICE_ROLE_KEY?.trim() ||
        process.env.APP_SUPABASE_SERVICE_ROLE_KEY?.trim() ||
        "")
      : readValue({
        key: "APP_SUPABASE_SERVICE_ROLE_KEY",
        envFile,
        status,
        fallback: status.SERVICE_ROLE_KEY || "",
      });

  const mailpitUrl = readValue({
    key: "MAILPIT_URL",
    envFile,
    status,
    fallback: status.INBUCKET_URL || "http://127.0.0.1:54324",
  });

  const appUrl = readValue({
    key: "VERIFY_LOCAL_AUTH_EMAIL_REDIRECT_TO",
    envFile,
    status,
    fallback: "http://localhost:8081",
  });

  return {
    rootDir: ROOT_DIR,
    target,
    apiUrl,
    publishableKey,
    serviceRoleKey,
    mailpitUrl,
    appUrl,
  };
}

export function resolveSmokeEmail(profile = "default") {
  const normalized = String(profile || "default").trim().toLowerCase();
  if (normalized === "new") {
    return `smoke.new.${Date.now()}@example.com`;
  }
  if (normalized === "clean") {
    return "smoke.clean.local@example.com";
  }
  return "smoke.default.local@example.com";
}

export async function requestMagicLink({ apiUrl, publishableKey, email, redirectTo }) {
  const response = await fetch(`${apiUrl}/auth/v1/otp`, {
    method: "POST",
    headers: {
      apikey: publishableKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      create_user: true,
      email_redirect_to: redirectTo,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Magic link request failed (${response.status}): ${body}`);
  }
}

function decodeHtmlEntities(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function extractVerifyLink(raw) {
  const text = decodeHtmlEntities(raw);
  const match = text.match(/https?:\/\/[^\s"'<>]+\/auth\/v1\/verify\?[^\s"'<>]+/i);
  return match ? match[0] : null;
}

export async function waitForMagicLink({ mailpitUrl, email, timeoutMs = 15000, pollMs = 800 }) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const mailboxResponse = await fetch(`${mailpitUrl}/api/v1/messages`);
    if (!mailboxResponse.ok) {
      throw new Error(`Mailpit mailbox request failed (${mailboxResponse.status})`);
    }

    const mailbox = await mailboxResponse.json();
    const messages = Array.isArray(mailbox?.messages) ? mailbox.messages : [];
    const item = messages.find((message) =>
      Array.isArray(message?.To) &&
      message.To.some((entry) => String(entry?.Address || "").toLowerCase() === email.toLowerCase())
    );

    if (item?.ID) {
      const detailResponse = await fetch(`${mailpitUrl}/api/v1/message/${item.ID}`);
      if (!detailResponse.ok) {
        throw new Error(`Mailpit detail request failed (${detailResponse.status})`);
      }

      const detail = await detailResponse.json();
      const verifyLink =
        extractVerifyLink(detail?.Text || "") ||
        extractVerifyLink(detail?.HTML || "");

      if (!verifyLink) {
        throw new Error("Mailpit message found, but no Supabase verify link found in message body.");
      }

      return {
        messageId: item.ID,
        subject: detail?.Subject || "",
        verifyLink,
      };
    }

    await new Promise((resolve) => setTimeout(resolve, pollMs));
  }

  throw new Error(`No Mailpit message found for ${email} within ${timeoutMs}ms.`);
}

export function assertLocalTarget(context) {
  if (context.target !== "local") {
    throw new Error(
      `Local auth smoke scripts are local-only. Current EXPO_PUBLIC_SUPABASE_TARGET=${context.target}`
    );
  }
  if (!context.publishableKey) {
    throw new Error("Missing EXPO_PUBLIC_SUPABASE_LOCAL_PUBLISHABLE_KEY (or PUBLISHABLE_KEY fallback).");
  }
}
