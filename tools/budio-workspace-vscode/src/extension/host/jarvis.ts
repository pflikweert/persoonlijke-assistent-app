import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import * as vscode from 'vscode';
import type { JarvisAssetEntry, JarvisCommandRoomContent, JarvisSyncStatus, JarvisWorkspaceState } from '../../jarvis/types';
import { realJarvisAssetIssues } from '../../jarvis/assets';

interface WorkspaceJarvisSettings {
  jarvisAssetsRoot: string;
  jarvisSeedManifest: string;
}

interface SeedAsset {
  seedAssetId: string;
  logicalId: string;
  role: string;
  kind: 'image' | 'video' | 'text';
  expectedFilename: string;
  preferredMime?: string;
  fallbackSourcePath?: string;
  notes?: string;
}

interface SeedManifest {
  title?: string;
  designTokens?: Record<string, string>;
  commandRoom?: JarvisCommandRoomContent;
  assets?: SeedAsset[];
}

interface JarvisDiskManifest {
  title?: string;
  generatedAt?: string;
  overallStatus?: JarvisSyncStatus;
  apiMode?: string;
  keyFamily?: string;
  assetsRoot?: string;
  summary?: JarvisWorkspaceState['summary'];
  designTokens?: Record<string, string>;
  commandRoom?: JarvisCommandRoomContent;
  assets?: JarvisAssetEntry[];
}

const DEFAULT_COMMAND_ROOM: JarvisCommandRoomContent = {
  leftRail: {
    eyebrow: '',
    progressLabel: '',
    items: [],
  },
  rightRail: {
    eyebrow: '',
    items: [],
  },
  speakingSurface: '',
  commandBar: {
    placeholder: 'Vraag Jarvis wat nu aandacht nodig heeft...',
    contextChip: '',
  },
};

const DEFAULT_SUMMARY = {
  total: 0,
  ready: 0,
  downloaded: 0,
  manual_source_required: 0,
  seeded_text: 0,
  error: 0,
  cached: 0,
};

export async function loadJarvisWorkspaceState(args: {
  workspaceRoot: string;
  settings: WorkspaceJarvisSettings;
  webview: vscode.Webview;
  overrideStatus?: JarvisSyncStatus | null;
}): Promise<JarvisWorkspaceState> {
  const seedManifestAbsolute = path.resolve(args.workspaceRoot, args.settings.jarvisSeedManifest);
  const assetsRootAbsolute = path.resolve(args.workspaceRoot, args.settings.jarvisAssetsRoot);
  const manifestAbsolute = path.resolve(assetsRootAbsolute, 'jarvis-assets-manifest.json');
  const reportAbsolute = path.resolve(assetsRootAbsolute, 'download-report.json');

  const issues: string[] = [];
  const seed = await readJson<SeedManifest>(seedManifestAbsolute).catch((error) => {
    issues.push(error instanceof Error ? error.message : 'Kon seed-manifest niet lezen.');
    return null;
  });
  const diskManifest = await readJson<JarvisDiskManifest>(manifestAbsolute).catch(() => null);

  const mergedAssets = await Promise.all((seed?.assets ?? []).map(async (seedAsset) => {
    const manifestAsset = diskManifest?.assets?.find((asset) => asset.logicalId === seedAsset.logicalId) ?? null;
    const mergedAsset = buildMergedAsset({
      workspaceRoot: args.workspaceRoot,
      assetsRootAbsolute,
      webview: args.webview,
      seedAsset,
      manifestAsset,
    });
    return ensureLocalAssetExists(args.workspaceRoot, mergedAsset);
  }));

  if (!diskManifest) {
    issues.push('Nog geen lokaal Jarvis manifest gevonden. Start eerst een sync of dry-run.');
  }

  issues.push(...realJarvisAssetIssues(mergedAssets));

  const computedStatus = computeStatus({
    overrideStatus: args.overrideStatus ?? null,
    diskStatus: diskManifest?.overallStatus ?? null,
    hasManifest: Boolean(diskManifest),
    assets: mergedAssets,
  });

  return {
    status: computedStatus,
    title: diskManifest?.title ?? seed?.title ?? 'Jarvis Final Frame',
    generatedAt: diskManifest?.generatedAt ?? null,
    assetsRoot: args.settings.jarvisAssetsRoot,
    seedManifestPath: args.settings.jarvisSeedManifest,
    manifestPath: diskManifest ? toWorkspaceRelative(args.workspaceRoot, manifestAbsolute) : null,
    reportPath: diskManifest ? toWorkspaceRelative(args.workspaceRoot, reportAbsolute) : null,
    keyFamily: diskManifest?.keyFamily ?? null,
    apiMode: diskManifest?.apiMode ?? null,
    summary: summarizeAssets(mergedAssets),
    designTokens: diskManifest?.designTokens ?? seed?.designTokens ?? {},
    commandRoom: diskManifest?.commandRoom ?? seed?.commandRoom ?? DEFAULT_COMMAND_ROOM,
    assets: mergedAssets,
    issues: uniqueStrings(issues).slice(0, 8),
  };
}

function buildMergedAsset(args: {
  workspaceRoot: string;
  assetsRootAbsolute: string;
  webview: vscode.Webview;
  seedAsset: SeedAsset;
  manifestAsset: JarvisAssetEntry | null;
}): JarvisAssetEntry {
  const localRelativePath = args.manifestAsset?.localPath ?? null;
  const localAbsolutePath = localRelativePath ? path.resolve(args.workspaceRoot, localRelativePath) : null;
  const webviewUri =
    localAbsolutePath && shouldExposeMedia(args.seedAsset.kind)
      ? args.webview.asWebviewUri(vscode.Uri.file(localAbsolutePath)).toString()
      : null;

  return {
    seedAssetId: args.manifestAsset?.seedAssetId ?? args.seedAsset.seedAssetId,
    logicalId: args.seedAsset.logicalId,
    role: args.manifestAsset?.role ?? args.seedAsset.role,
    kind: args.seedAsset.kind,
    expectedFilename: args.seedAsset.expectedFilename,
    preferredMime: args.manifestAsset?.preferredMime ?? args.seedAsset.preferredMime ?? null,
    status: args.manifestAsset?.status ?? (args.seedAsset.kind === 'text' ? 'seeded_text' : 'manual_source_required'),
    resolvedApi: args.manifestAsset?.resolvedApi ?? null,
    resolvedUrl: args.manifestAsset?.resolvedUrl ?? null,
    localPath: localRelativePath,
    checksum: args.manifestAsset?.checksum ?? null,
    downloadedAt: args.manifestAsset?.downloadedAt ?? null,
    failureReason: args.manifestAsset?.failureReason ?? defaultFailureReason(args.seedAsset.kind, args.seedAsset.seedAssetId),
    previewText: args.manifestAsset?.previewText ?? null,
    notes: args.manifestAsset?.notes ?? args.seedAsset.notes ?? null,
    webviewUri,
  };
}

function shouldExposeMedia(kind: JarvisAssetEntry['kind']) {
  return kind === 'image' || kind === 'video';
}

function defaultFailureReason(kind: SeedAsset['kind'], seedAssetId: string) {
  if (kind === 'text') {
    return null;
  }
  return `Asset ${seedAssetId} vereist nog een handmatige mapping of Luma export.`;
}

function computeStatus(args: {
  overrideStatus: JarvisSyncStatus | null;
  diskStatus: JarvisSyncStatus | null;
  hasManifest: boolean;
  assets: JarvisAssetEntry[];
}): JarvisSyncStatus {
  if (args.overrideStatus === 'syncing') {
    return 'syncing';
  }
  if (!args.hasManifest) {
    return 'missing_manifest';
  }
  if (args.diskStatus && args.diskStatus !== 'idle') {
    return args.diskStatus;
  }

  const hasError = args.assets.some((asset) => asset.status === 'error');
  const hasManual = args.assets.some((asset) => asset.status === 'manual_source_required');
  if (hasError) {
    return 'error';
  }
  if (hasManual) {
    return 'partial';
  }
  return 'ready';
}

function summarizeAssets(assets: JarvisAssetEntry[]) {
  return assets.reduce(
    (summary, asset) => {
      summary.total += 1;
      if (asset.status === 'ready') {
        summary.ready += 1;
      } else if (asset.status === 'downloaded') {
        summary.downloaded += 1;
      } else if (asset.status === 'manual_source_required') {
        summary.manual_source_required += 1;
      } else if (asset.status === 'seeded_text') {
        summary.seeded_text += 1;
      } else if (asset.status === 'error') {
        summary.error += 1;
      }
      return summary;
    },
    { ...DEFAULT_SUMMARY },
  );
}

async function readJson<T>(filePath: string): Promise<T> {
  return JSON.parse(await readFile(filePath, 'utf8')) as T;
}

async function ensureLocalAssetExists(workspaceRoot: string, asset: JarvisAssetEntry): Promise<JarvisAssetEntry> {
  if (!asset.localPath || asset.status === 'manual_source_required' || asset.status === 'error') {
    return asset;
  }

  try {
    await stat(path.resolve(workspaceRoot, asset.localPath));
    return asset;
  } catch {
    return {
      ...asset,
      status: 'error',
      failureReason: `Lokaal bestand ontbreekt: ${asset.localPath}`,
      webviewUri: null,
    };
  }
}

function uniqueStrings(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function toWorkspaceRelative(workspaceRoot: string, absolutePath: string) {
  return path.relative(workspaceRoot, absolutePath).split(path.sep).join('/');
}
