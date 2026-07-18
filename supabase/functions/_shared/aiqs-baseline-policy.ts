export type AiqsBaselineEnsureDisposition = 'create' | 'already_ok' | 'preserved';

export function classifyAiqsBaselineEnsureDisposition(args: {
  exists: false;
  matchesBaseline: boolean;
}): 'create';
export function classifyAiqsBaselineEnsureDisposition(args: {
  exists: true;
  matchesBaseline: boolean;
}): 'already_ok' | 'preserved';
export function classifyAiqsBaselineEnsureDisposition(args: {
  exists: boolean;
  matchesBaseline: boolean;
}): AiqsBaselineEnsureDisposition {
  if (!args.exists) return 'create';
  return args.matchesBaseline ? 'already_ok' : 'preserved';
}

export function removeAiqsRuntimeBaselineOwnership(
  configJson: Record<string, unknown> | null | undefined,
): Record<string, unknown> {
  const next = { ...(configJson ?? {}) };
  delete next.baseline_import;
  return next;
}
