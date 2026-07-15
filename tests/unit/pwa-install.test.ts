import { describe, expect, it } from "vitest";

import {
  clearPwaInstallDismissal,
  getPwaDismissStorageKey,
  isPwaInstallDismissed,
  isStandalonePwa,
  rememberPwaInstallDismissal,
  shouldRememberPwaPromptOutcome,
  type PwaStorage,
} from "@/src/lib/pwa-install";

function createStorage(): PwaStorage {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

function createThrowingStorage(): PwaStorage {
  return {
    getItem: () => {
      throw new Error("blocked");
    },
    setItem: () => {
      throw new Error("blocked");
    },
    removeItem: () => {
      throw new Error("blocked");
    },
  };
}

describe("PWA install helpers", () => {
  it("scopes dismissal keys per user", () => {
    expect(getPwaDismissStorageKey("user-a")).toBe(
      "budio.pwa-install.dismissed.v1:user-a",
    );
  });

  it("remembers and clears a dismissal without affecting another user", () => {
    const storage = createStorage();

    expect(rememberPwaInstallDismissal(storage, "user-a")).toBe(true);
    expect(isPwaInstallDismissed(storage, "user-a")).toBe(true);
    expect(isPwaInstallDismissed(storage, "user-b")).toBe(false);

    expect(clearPwaInstallDismissal(storage, "user-a")).toBe(true);
    expect(isPwaInstallDismissed(storage, "user-a")).toBe(false);
  });

  it("fails safely when storage is missing or blocked", () => {
    expect(isPwaInstallDismissed(null, "user-a")).toBe(false);
    expect(rememberPwaInstallDismissal(null, "user-a")).toBe(false);
    expect(clearPwaInstallDismissal(null, "user-a")).toBe(false);

    const storage = createThrowingStorage();
    expect(isPwaInstallDismissed(storage, "user-a")).toBe(false);
    expect(rememberPwaInstallDismissal(storage, "user-a")).toBe(false);
    expect(clearPwaInstallDismissal(storage, "user-a")).toBe(false);
  });

  it("requires a user id for persistence", () => {
    const storage = createStorage();
    expect(isPwaInstallDismissed(storage, null)).toBe(false);
    expect(rememberPwaInstallDismissal(storage, null)).toBe(false);
    expect(clearPwaInstallDismissal(storage, null)).toBe(false);
  });

  it("detects standalone display mode on standard and iOS browsers", () => {
    expect(
      isStandalonePwa({
        displayModeStandalone: true,
        navigatorStandalone: false,
      }),
    ).toBe(true);
    expect(
      isStandalonePwa({
        displayModeStandalone: false,
        navigatorStandalone: true,
      }),
    ).toBe(true);
    expect(
      isStandalonePwa({
        displayModeStandalone: false,
        navigatorStandalone: false,
      }),
    ).toBe(false);
  });

  it("only persists a dismissed browser prompt", () => {
    expect(shouldRememberPwaPromptOutcome("dismissed")).toBe(true);
    expect(shouldRememberPwaPromptOutcome("accepted")).toBe(false);
  });
});
