import type { JarvisAssetEntry, JarvisWorkspaceState } from './types';

export interface JarvisAssetAvailability {
  total: number;
  available: number;
  ready: number;
  downloaded: number;
  seededText: number;
  manualRequired: number;
  error: number;
  issues: string[];
}

export function summarizeJarvisAssetAvailability(
  workspaceState: Pick<JarvisWorkspaceState, 'summary' | 'assets' | 'issues'>,
): JarvisAssetAvailability {
  const total = workspaceState.summary.total || workspaceState.assets.length;
  const ready = workspaceState.summary.ready;
  const downloaded = workspaceState.summary.downloaded;
  const seededText = workspaceState.summary.seeded_text;
  const manualRequired = workspaceState.summary.manual_source_required;
  const error = workspaceState.summary.error;

  return {
    total,
    available: ready + downloaded + seededText,
    ready,
    downloaded,
    seededText,
    manualRequired,
    error,
    issues: realJarvisAssetIssues(workspaceState.assets, workspaceState.issues),
  };
}

export function realJarvisAssetIssues(assets: JarvisAssetEntry[], fallbackIssues: string[] = []): string[] {
  const assetIssues = assets
    .filter((asset) => asset.status === 'manual_source_required' || asset.status === 'error')
    .map((asset) => asset.failureReason ? `${asset.logicalId}: ${asset.failureReason}` : `${asset.logicalId}: ${asset.status}`);

  return [...new Set([...assetIssues, ...fallbackIssues.filter(isRealAssetIssue)])];
}

function isRealAssetIssue(issue: string) {
  const normalized = issue.toLowerCase();
  return (
    normalized.includes('manual_source_required') ||
    normalized.includes('error') ||
    normalized.includes('ontbreekt') ||
    normalized.includes('niet gevonden') ||
    normalized.includes('kon seed-manifest') ||
    normalized.includes('nog geen lokaal jarvis manifest')
  );
}
