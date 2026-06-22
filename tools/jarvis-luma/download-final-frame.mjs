#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  downloadOutput,
  getDreamMachineGeneration,
  getGeneration,
  listDreamMachineGenerations,
  listGenerations,
  LumaApiError,
} from './luma-client.mjs';

const TOOL_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(TOOL_DIR, '../..');
const DEFAULT_MANIFEST_PATH = path.join(TOOL_DIR, 'final-frame.seed.json');
const DEFAULT_DEST = path.join(REPO_ROOT, 'assets', 'jarvis', 'final-frame');
const DEFAULT_ENV_LOCAL_PATH = path.join(REPO_ROOT, '.env.local');

export function parseArgs(argv) {
  const options = {
    api: 'auto',
    manifest: DEFAULT_MANIFEST_PATH,
    dest: DEFAULT_DEST,
    dryRun: false,
    refresh: false,
    only: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    switch (arg) {
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--refresh':
        options.refresh = true;
        break;
      case '--api':
        options.api = requireValue(arg, next);
        index += 1;
        break;
      case '--manifest':
        options.manifest = path.resolve(process.cwd(), requireValue(arg, next));
        index += 1;
        break;
      case '--dest':
        options.dest = path.resolve(process.cwd(), requireValue(arg, next));
        index += 1;
        break;
      case '--only':
        options.only = requireValue(arg, next);
        index += 1;
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!['auto', 'agents', 'dream-machine'].includes(options.api)) {
    throw new Error('--api must be auto, agents, or dream-machine');
  }

  return options;
}

function requireValue(arg, value) {
  if (!value || value.startsWith('--')) {
    throw new Error(`${arg} requires a value`);
  }
  return value;
}

export function normalizeApiKeyFamily(apiKey) {
  if (!apiKey) {
    return { family: 'missing', valid: false, reason: 'Geen Luma API-key beschikbaar.' };
  }
  if (apiKey.startsWith('Bearer ')) {
    return { family: 'invalid', valid: false, reason: 'Gebruik de ruwe key zonder "Bearer " prefix.' };
  }
  if (apiKey.startsWith('luma-api-')) {
    return { family: 'agents', valid: true, reason: null };
  }
  if (apiKey.startsWith('luma-')) {
    return { family: 'dream-machine', valid: true, reason: null };
  }
  return { family: 'invalid', valid: false, reason: 'Onbekende key-family voor Luma.' };
}

function pickAvailableKeys() {
  const dreamMachineKey = process.env.LUMA_AGENTS_API_KEY?.trim() ?? '';
  const agentsKey = process.env.LUMA_AGENTS_API_UNI_KEY?.trim() ?? '';

  return {
    dreamMachineKey,
    agentsKey,
    dreamMachineInfo: normalizeApiKeyFamily(dreamMachineKey),
    agentsInfo: normalizeApiKeyFamily(agentsKey),
  };
}

export function resolveApiMode(requestedApi, apiKey) {
  const family = normalizeApiKeyFamily(apiKey);
  if (requestedApi === 'agents' || requestedApi === 'dream-machine') {
    return requestedApi;
  }
  if (family.family === 'agents') {
    return 'agents';
  }
  if (family.family === 'dream-machine') {
    return 'dream-machine';
  }
  return 'agents';
}

function resolveApiSelection(requestedApi) {
  const available = pickAvailableKeys();

  if (requestedApi === 'agents') {
    return {
      apiMode: 'agents',
      apiKey: available.agentsKey,
      keyInfo: available.agentsInfo,
      keySource: 'LUMA_AGENTS_API_UNI_KEY',
    };
  }

  if (requestedApi === 'dream-machine') {
    return {
      apiMode: 'dream-machine',
      apiKey: available.dreamMachineKey,
      keyInfo: available.dreamMachineInfo,
      keySource: 'LUMA_AGENTS_API_KEY',
    };
  }

  if (available.agentsInfo.valid) {
    return {
      apiMode: 'agents',
      apiKey: available.agentsKey,
      keyInfo: available.agentsInfo,
      keySource: 'LUMA_AGENTS_API_UNI_KEY',
    };
  }

  if (available.dreamMachineInfo.valid) {
    return {
      apiMode: 'dream-machine',
      apiKey: available.dreamMachineKey,
      keyInfo: available.dreamMachineInfo,
      keySource: 'LUMA_AGENTS_API_KEY',
    };
  }

  return {
    apiMode: 'agents',
    apiKey: '',
    keyInfo: available.agentsInfo.valid ? available.agentsInfo : available.dreamMachineInfo,
    keySource: null,
  };
}

function usage() {
  return `Usage:
  node tools/jarvis-luma/download-final-frame.mjs [options]

Options:
  --dry-run                Print the planned result without writing files
  --api <mode>             auto, agents, or dream-machine (default: auto)
  --manifest <path>        Seed manifest path (default: tools/jarvis-luma/final-frame.seed.json)
  --dest <path>            Output directory (default: assets/jarvis/final-frame)
  --only <logical-id>      Process a single logical asset id
  --refresh                Re-download or re-copy existing outputs
  --help                   Show help
`;
}

async function loadLocalEnv(envPath) {
  let content;
  try {
    content = await readFile(envPath, 'utf8');
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return;
    }
    throw error;
  }

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const normalizedLine = line.startsWith('export ') ? line.slice('export '.length).trim() : line;
    const separatorIndex = normalizedLine.indexOf('=');
    if (separatorIndex <= 0) {
      continue;
    }

    const key = normalizedLine.slice(0, separatorIndex).trim();
    let value = normalizedLine.slice(separatorIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

async function ensureDir(directoryPath) {
  await mkdir(directoryPath, { recursive: true });
}

async function fileExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

async function sha256ForBuffer(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

async function sha256ForFile(filePath) {
  const buffer = await readFile(filePath);
  return sha256ForBuffer(buffer);
}

function toRelativeRepoPath(filePath) {
  return path.relative(REPO_ROOT, filePath).split(path.sep).join('/');
}

function isUuidLike(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function summarizeAssets(assets) {
  const summary = {
    total: assets.length,
    ready: 0,
    downloaded: 0,
    manual_source_required: 0,
    seeded_text: 0,
    error: 0,
    cached: 0,
  };

  for (const asset of assets) {
    if (asset.status === 'ready') {
      summary.ready += 1;
    } else if (asset.status === 'downloaded') {
      summary.downloaded += 1;
    } else if (asset.status === 'manual_source_required') {
      summary.manual_source_required += 1;
    } else if (asset.status === 'seeded_text') {
      summary.seeded_text += 1;
    } else if (asset.status === 'cached') {
      summary.cached += 1;
    } else if (asset.status === 'error') {
      summary.error += 1;
    }
  }

  return summary;
}

function deriveOverallStatus({ assets, keyInfo }) {
  const hasError = assets.some((asset) => asset.status === 'error');
  const hasManual = assets.some((asset) => asset.status === 'manual_source_required');
  const hasResolvedBinary = assets.some(
    (asset) =>
      (asset.kind === 'image' || asset.kind === 'video') &&
      (asset.status === 'downloaded' || asset.status === 'ready' || asset.status === 'cached'),
  );
  const hasBinaryNeedingKey = assets.some(
    (asset) =>
      (asset.kind === 'image' || asset.kind === 'video') &&
      (asset.status === 'manual_source_required' || asset.status === 'error'),
  );

  if (!keyInfo.valid && hasBinaryNeedingKey) {
    return 'missing_key';
  }
  if (hasError) {
    return hasResolvedBinary ? 'partial' : 'error';
  }
  if (hasManual) {
    return hasResolvedBinary ? 'partial' : 'partial';
  }
  return 'ready';
}

function trimPreview(content) {
  return content.length <= 1200 ? content : `${content.slice(0, 1200)}\n...`;
}

async function resolveBinaryAsset({ asset, apiKey, apiMode }) {
  if (!apiKey) {
    return {
      resolvedApi: apiMode,
      resolvedUrl: null,
      failureReason: 'Geen LUMA_AGENTS_API_KEY beschikbaar voor binaire asset-resolving.',
      resolutionSource: 'missing_key',
    };
  }

  if (!isUuidLike(asset.seedAssetId)) {
    return {
      resolvedApi: apiMode,
      resolvedUrl: null,
      failureReason: 'Short seed ID is geen gedocumenteerde generation UUID; handmatige mapping of export nodig.',
      resolutionSource: 'seed_short_id',
    };
  }

  try {
    const generation =
      apiMode === 'dream-machine'
        ? await getDreamMachineGeneration(apiKey, asset.seedAssetId)
        : await getGeneration(apiKey, asset.seedAssetId);
    const resolvedUrl = extractGenerationOutputUrl(generation, asset.kind);
    if (!resolvedUrl) {
      return {
        resolvedApi: apiMode,
        resolvedUrl: null,
        failureReason: 'Generation gevonden, maar geen download-URL in response.',
        resolutionSource: 'generation_without_url',
      };
    }
    return {
      resolvedApi: apiMode,
      resolvedUrl,
      failureReason: null,
      resolutionSource: 'generation_get',
    };
  } catch (error) {
    if (!(error instanceof LumaApiError)) {
      throw error;
    }

    if (error.status === 404 && apiMode === 'agents') {
      await listGenerations(apiKey, { limit: 1, offset: 0 }).catch(() => null);
    }
    if (error.status === 404 && apiMode === 'dream-machine') {
      await listDreamMachineGenerations(apiKey, { limit: 1, offset: 0 }).catch(() => null);
    }

    return {
      resolvedApi: apiMode,
      resolvedUrl: null,
      failureReason: error.detail ? String(error.detail) : error.message,
      resolutionSource: 'api_error',
    };
  }
}

function extractGenerationOutputUrl(generation, kind) {
  if (!generation || typeof generation !== 'object') {
    return null;
  }

  const candidates = [];

  if (kind === 'image') {
    candidates.push(
      generation.assets?.image,
      generation.assets?.images?.[0]?.url,
      generation.images?.[0]?.url,
      generation.output?.[0]?.url,
      generation.output?.url,
    );
  }

  if (kind === 'video') {
    candidates.push(
      generation.assets?.video,
      generation.assets?.videos?.[0]?.url,
      generation.video?.url,
      generation.output?.[0]?.url,
      generation.output?.url,
    );
  }

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.startsWith('http')) {
      return candidate;
    }
  }

  return null;
}

async function materializeAsset({ asset, options, apiKey, apiMode, nowIso }) {
  const expectedPath = path.join(options.dest, asset.expectedFilename);
  const expectedRelativePath = toRelativeRepoPath(expectedPath);

  if (asset.kind === 'text') {
    const fallbackSourcePath = asset.fallbackSourcePath
      ? path.resolve(REPO_ROOT, asset.fallbackSourcePath)
      : null;
    const sourceContent = fallbackSourcePath ? await readFile(fallbackSourcePath, 'utf8') : '';
    if (!options.dryRun) {
      await ensureDir(path.dirname(expectedPath));
      if (options.refresh || !(await fileExists(expectedPath))) {
        await writeFile(expectedPath, sourceContent, 'utf8');
      }
    }

    return {
      seedAssetId: asset.seedAssetId,
      logicalId: asset.logicalId,
      role: asset.role,
      kind: asset.kind,
      expectedFilename: asset.expectedFilename,
      preferredMime: asset.preferredMime ?? 'text/plain',
      status: 'seeded_text',
      resolvedApi: 'seed',
      resolvedUrl: null,
      localPath: expectedRelativePath,
      checksum: options.dryRun ? await sha256ForBuffer(Buffer.from(sourceContent, 'utf8')) : await sha256ForFile(expectedPath),
      downloadedAt: nowIso,
      failureReason: null,
      previewText: trimPreview(sourceContent),
      notes: asset.notes ?? null,
    };
  }

  const hasExistingFile = await fileExists(expectedPath);
  if (hasExistingFile && !options.refresh) {
    return {
      seedAssetId: asset.seedAssetId,
      logicalId: asset.logicalId,
      role: asset.role,
      kind: asset.kind,
      expectedFilename: asset.expectedFilename,
      preferredMime: asset.preferredMime ?? null,
      status: 'ready',
      resolvedApi: 'local',
      resolvedUrl: null,
      localPath: expectedRelativePath,
      checksum: await sha256ForFile(expectedPath),
      downloadedAt: nowIso,
      failureReason: null,
      previewText: null,
      notes: asset.notes ?? null,
    };
  }

  const resolution = await resolveBinaryAsset({ asset, apiKey, apiMode });
  if (!resolution.resolvedUrl) {
    return {
      seedAssetId: asset.seedAssetId,
      logicalId: asset.logicalId,
      role: asset.role,
      kind: asset.kind,
      expectedFilename: asset.expectedFilename,
      preferredMime: asset.preferredMime ?? null,
      status: 'manual_source_required',
      resolvedApi: resolution.resolvedApi,
      resolvedUrl: null,
      localPath: hasExistingFile ? expectedRelativePath : null,
      checksum: hasExistingFile ? await sha256ForFile(expectedPath) : null,
      downloadedAt: hasExistingFile ? nowIso : null,
      failureReason: resolution.failureReason,
      previewText: null,
      notes: asset.notes ?? null,
    };
  }

  if (options.dryRun) {
    return {
      seedAssetId: asset.seedAssetId,
      logicalId: asset.logicalId,
      role: asset.role,
      kind: asset.kind,
      expectedFilename: asset.expectedFilename,
      preferredMime: asset.preferredMime ?? null,
      status: 'downloaded',
      resolvedApi: resolution.resolvedApi,
      resolvedUrl: resolution.resolvedUrl,
      localPath: expectedRelativePath,
      checksum: null,
      downloadedAt: nowIso,
      failureReason: null,
      previewText: null,
      notes: asset.notes ?? null,
    };
  }

  await ensureDir(path.dirname(expectedPath));
  const buffer = await downloadOutput(resolution.resolvedUrl);
  await writeFile(expectedPath, buffer);
  return {
    seedAssetId: asset.seedAssetId,
    logicalId: asset.logicalId,
    role: asset.role,
    kind: asset.kind,
    expectedFilename: asset.expectedFilename,
    preferredMime: asset.preferredMime ?? null,
    status: 'downloaded',
    resolvedApi: resolution.resolvedApi,
    resolvedUrl: resolution.resolvedUrl,
    localPath: expectedRelativePath,
    checksum: await sha256ForBuffer(buffer),
    downloadedAt: nowIso,
    failureReason: null,
    previewText: null,
    notes: asset.notes ?? null,
  };
}

export async function runWithOptions(options) {
  await loadLocalEnv(DEFAULT_ENV_LOCAL_PATH);

  const seed = await readJson(options.manifest);
  const selection = resolveApiSelection(options.api);
  const apiKey = selection.apiKey;
  const keyInfo = selection.keyInfo;
  const apiMode = selection.apiMode;
  const nowIso = new Date().toISOString();
  const seedAssets = options.only
    ? seed.assets.filter((asset) => asset.logicalId === options.only)
    : seed.assets;

  if (options.only && seedAssets.length === 0) {
    throw new Error(`Unknown logical asset id: ${options.only}`);
  }

  const assets = [];
  for (const asset of seedAssets) {
    try {
      const result = await materializeAsset({ asset, options, apiKey, apiMode, nowIso });
      assets.push(result);
    } catch (error) {
      assets.push({
        seedAssetId: asset.seedAssetId,
        logicalId: asset.logicalId,
        role: asset.role,
        kind: asset.kind,
        expectedFilename: asset.expectedFilename,
        preferredMime: asset.preferredMime ?? null,
        status: 'error',
        resolvedApi: apiMode,
        resolvedUrl: null,
        localPath: null,
        checksum: null,
        downloadedAt: null,
        failureReason: error instanceof Error ? error.message : 'Onbekende fout',
        previewText: null,
        notes: asset.notes ?? null,
      });
    }
  }

  const summary = summarizeAssets(assets);
  const overallStatus = deriveOverallStatus({ assets, keyInfo });
  const manifest = {
    version: 1,
    title: seed.title,
    generatedAt: nowIso,
    overallStatus,
    apiMode,
    keyFamily: keyInfo.family,
    keySource: selection.keySource,
    seedManifestPath: toRelativeRepoPath(options.manifest),
    assetsRoot: toRelativeRepoPath(options.dest),
    sourceDocument: seed.sourceDocument,
    commandRoom: seed.commandRoom,
    designTokens: seed.designTokens,
    summary,
    assets,
  };

  const report = {
    generatedAt: nowIso,
    dryRun: options.dryRun,
    apiMode,
    keyFamily: keyInfo.family,
    keySource: selection.keySource,
    keyValid: keyInfo.valid,
    keyReason: keyInfo.reason,
    overallStatus,
    summary,
    assets: assets.map((asset) => ({
      logicalId: asset.logicalId,
      status: asset.status,
      failureReason: asset.failureReason,
      localPath: asset.localPath,
      resolvedApi: asset.resolvedApi,
      resolvedUrl: asset.resolvedUrl,
    })),
  };

  if (!options.dryRun) {
    await ensureDir(options.dest);
    await writeFile(path.join(options.dest, 'jarvis-assets-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
    await writeFile(path.join(options.dest, 'download-report.json'), `${JSON.stringify(report, null, 2)}\n`);
  }

  return { manifest, report };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }

  const { report } = await runWithOptions(options);
  console.log(JSON.stringify(report, null, 2));
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMain) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
