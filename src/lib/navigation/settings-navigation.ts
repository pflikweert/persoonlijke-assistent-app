const SETTINGS_HOME = "/settings" as const;

export type SettingsNavigationTarget =
  | typeof SETTINGS_HOME
  | "/(tabs)"
  | "/meeting-capture"
  | "/settings-ai-quality-studio"
  | `/settings-ai-quality-studio/${string}`;

const FIRST_LEVEL_SETTINGS_ROUTES = new Set([
  "/settings-audio",
  "/settings-export",
  "/settings-import",
  "/settings-obsidian",
  "/settings-admin-access",
  "/settings-regeneration",
  "/settings-ai-quality-studio",
  "/meeting-capture",
]);

export function normalizeAppPath(path: string | null | undefined): string {
  const rawPath = typeof path === "string" ? path.trim() : "";

  if (!rawPath) {
    return "/";
  }

  const withoutHash = rawPath.split("#")[0] ?? rawPath;
  const withoutQuery = withoutHash.split("?")[0] ?? withoutHash;
  const withLeadingSlash = withoutQuery.startsWith("/") ? withoutQuery : `/${withoutQuery}`;
  const collapsed = withLeadingSlash.replace(/\/{2,}/g, "/");
  const withoutTrailingSlash = collapsed.length > 1 ? collapsed.replace(/\/+$/, "") : collapsed;

  return withoutTrailingSlash || "/";
}

export function getSettingsMenuTarget(currentPath: string | null | undefined): typeof SETTINGS_HOME | null {
  return normalizeAppPath(currentPath) === SETTINGS_HOME ? null : SETTINGS_HOME;
}

export function getSettingsBackTarget(currentPath: string | null | undefined): SettingsNavigationTarget {
  const path = normalizeAppPath(currentPath);

  if (path === SETTINGS_HOME) {
    return "/(tabs)";
  }

  if (FIRST_LEVEL_SETTINGS_ROUTES.has(path)) {
    return SETTINGS_HOME;
  }

  if (path.startsWith("/meeting-capture/")) {
    return "/meeting-capture";
  }

  const aiqsDetailMatch = path.match(/^\/settings-ai-quality-studio\/([^/]+)$/);
  if (aiqsDetailMatch?.[1]) {
    return "/settings-ai-quality-studio";
  }

  const aiqsDeepMatch = path.match(/^\/settings-ai-quality-studio\/([^/]+)\/(draft|test|validate)\/[^/]+$/);
  if (aiqsDeepMatch?.[1]) {
    return `/settings-ai-quality-studio/${aiqsDeepMatch[1]}`;
  }

  if (path.startsWith("/settings-ai-quality-studio/group/")) {
    return "/settings-ai-quality-studio";
  }

  return SETTINGS_HOME;
}
