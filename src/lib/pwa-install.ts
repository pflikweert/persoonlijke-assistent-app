export const PWA_DISMISS_STORAGE_PREFIX =
  "budio.pwa-install.dismissed.v1:";

export type PwaStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function getPwaDismissStorageKey(userId: string): string {
  return `${PWA_DISMISS_STORAGE_PREFIX}${userId}`;
}

export function isPwaInstallDismissed(
  storage: PwaStorage | null,
  userId: string | null,
): boolean {
  if (!storage || !userId) {
    return false;
  }

  try {
    return storage.getItem(getPwaDismissStorageKey(userId)) === "1";
  } catch {
    return false;
  }
}

export function rememberPwaInstallDismissal(
  storage: PwaStorage | null,
  userId: string | null,
): boolean {
  if (!storage || !userId) {
    return false;
  }

  try {
    storage.setItem(getPwaDismissStorageKey(userId), "1");
    return true;
  } catch {
    return false;
  }
}

export function clearPwaInstallDismissal(
  storage: PwaStorage | null,
  userId: string | null,
): boolean {
  if (!storage || !userId) {
    return false;
  }

  try {
    storage.removeItem(getPwaDismissStorageKey(userId));
    return true;
  } catch {
    return false;
  }
}

export function isStandalonePwa(input: {
  displayModeStandalone: boolean;
  navigatorStandalone?: boolean;
}): boolean {
  return input.displayModeStandalone || input.navigatorStandalone === true;
}

export function shouldRememberPwaPromptOutcome(
  outcome: "accepted" | "dismissed",
): boolean {
  return outcome === "dismissed";
}
