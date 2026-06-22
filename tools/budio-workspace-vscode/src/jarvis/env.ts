import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_CHAT_MODEL = 'gpt-4.1-mini';
const DEFAULT_TRANSCRIPTION_MODEL = 'gpt-4o-mini-transcribe';

export interface JarvisResolvedEnv {
  chatApiKey: string;
  chatApiKeySource:
    | 'OPENAI_API_BUDIO_WORKSPACE_SERVICE_KEY'
    | 'OPENAI_API_BUDIO_WORKSPACE_KEY'
    | 'OPENAI_API_KEY'
    | null;
  chatModel: string;
  transcriptionModel: string;
  envFilePath: string | null;
  checkedEnvFiles: string[];
}

export interface JarvisResolvedEnvAvailability {
  available: boolean;
  reason: string | null;
  env: JarvisResolvedEnv;
}

export function resolveJarvisEnv(workspaceRoot: string, env: NodeJS.ProcessEnv = process.env): JarvisResolvedEnv {
  const checkedEnvFiles = candidateEnvFiles(workspaceRoot);
  const envFilePath = checkedEnvFiles.find((candidate) => fs.existsSync(candidate)) ?? null;
  const fileEnv = envFilePath ? parseDotEnvFile(envFilePath) : {};
  const combined = mergeNonEmptyEnv(fileEnv, env);

  const keySource = firstDefinedKey(combined, [
    'OPENAI_API_BUDIO_WORKSPACE_SERVICE_KEY',
    'OPENAI_API_BUDIO_WORKSPACE_KEY',
    'OPENAI_API_KEY',
  ]);

  return {
    chatApiKey: keySource ? stripQuotes(combined[keySource]) : '',
    chatApiKeySource: keySource,
    chatModel: stripQuotes(combined.BUDIO_WORKSPACE_JARVIS_MODEL) || DEFAULT_CHAT_MODEL,
    transcriptionModel: stripQuotes(combined.OPENAI_TRANSCRIPTION_MODEL) || DEFAULT_TRANSCRIPTION_MODEL,
    envFilePath,
    checkedEnvFiles,
  };
}

export function getJarvisEnvAvailability(
  workspaceRoot: string,
  env: NodeJS.ProcessEnv = process.env,
): JarvisResolvedEnvAvailability {
  const resolved = resolveJarvisEnv(workspaceRoot, env);
  if (!resolved.chatApiKey) {
    return {
      available: false,
      reason:
        `Geen Jarvis chat key gevonden. Gecheckt: ${resolved.checkedEnvFiles.map((candidate) => path.basename(candidate)).join(', ')}. Ondersteund: OPENAI_API_BUDIO_WORKSPACE_SERVICE_KEY, OPENAI_API_BUDIO_WORKSPACE_KEY, OPENAI_API_KEY.`,
      env: resolved,
    };
  }

  return {
    available: true,
    reason: null,
    env: resolved,
  };
}

export function parseDotEnvFile(filePath: string): Record<string, string> {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  const out: Record<string, string> = {};

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

function firstDefinedKey(values: Record<string, string | undefined>, keys: string[]) {
  const found = keys.find((key) => stripQuotes(values[key]).length > 0);
  return (found ?? null) as
    | 'OPENAI_API_BUDIO_WORKSPACE_SERVICE_KEY'
    | 'OPENAI_API_BUDIO_WORKSPACE_KEY'
    | 'OPENAI_API_KEY'
    | null;
}

function mergeNonEmptyEnv(
  fileEnv: Record<string, string>,
  processEnv: NodeJS.ProcessEnv,
): Record<string, string | undefined> {
  const out: Record<string, string | undefined> = { ...fileEnv };
  for (const [key, value] of Object.entries(processEnv)) {
    if (stripQuotes(value).length > 0) {
      out[key] = value;
    }
  }
  return out;
}

function candidateEnvFiles(workspaceRoot: string): string[] {
  const candidates: string[] = [];
  let current = path.resolve(workspaceRoot);

  while (true) {
    candidates.push(path.join(current, '.env.local'));
    const parent = path.dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }

  return candidates;
}

function stripQuotes(value: string | undefined) {
  const trimmed = String(value ?? '').trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}
