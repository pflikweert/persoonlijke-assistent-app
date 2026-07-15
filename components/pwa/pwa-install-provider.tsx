import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Platform } from "react-native";

import {
  clearPwaInstallDismissal,
  isPwaInstallDismissed,
  isStandalonePwa,
  rememberPwaInstallDismissal,
  shouldRememberPwaPromptOutcome,
  type PwaStorage,
} from "@/src/lib/pwa-install";
import {
  PwaInstallModal,
  type PwaInstallModalMode,
} from "./pwa-install-modal";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<{
    outcome: "accepted" | "dismissed";
    platform?: string;
  }>;
};

type NavigatorWithStandalone = Navigator & {
  standalone?: boolean;
};

type PwaInstallContextValue = {
  isSettingsEntryVisible: boolean;
  openInstallOptions: () => void;
};

const PwaInstallContext = createContext<PwaInstallContextValue | null>(null);

function getLocalStorageSafe(): PwaStorage | null {
  if (Platform.OS !== "web" || typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readStandaloneState(): boolean {
  if (Platform.OS !== "web" || typeof window === "undefined") {
    return false;
  }

  return isStandalonePwa({
    displayModeStandalone: window.matchMedia("(display-mode: standalone)").matches,
    navigatorStandalone:
      typeof navigator !== "undefined"
        ? (navigator as NavigatorWithStandalone).standalone
        : false,
  });
}

export function PwaInstallProvider({
  userId,
  children,
}: {
  userId: string | null;
  children: ReactNode;
}) {
  const storageRef = useRef<PwaStorage | null>(null);
  const sessionDismissedUsersRef = useRef(new Set<string>());
  const autoShownUsersRef = useRef(new Set<string>());
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(readStandaloneState);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [modalMode, setModalMode] =
    useState<PwaInstallModalMode>("closed");
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    storageRef.current = getLocalStorageSafe();
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") {
      return;
    }

    const displayMode = window.matchMedia("(display-mode: standalone)");
    const updateStandalone = () => setIsStandalone(readStandaloneState());
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => {
      setDeferredPrompt(null);
      setModalMode("closed");
      setInstalling(false);
      setIsInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);
    displayMode.addEventListener?.("change", updateStandalone);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleInstalled);
      displayMode.removeEventListener?.("change", updateStandalone);
    };
  }, []);

  useEffect(() => {
    setModalMode("closed");
    setInstalling(false);

    if (!userId) {
      setIsDismissed(false);
      return;
    }

    setIsDismissed(
      sessionDismissedUsersRef.current.has(userId) ||
        isPwaInstallDismissed(storageRef.current, userId),
    );
  }, [userId]);

  useEffect(() => {
    if (
      !userId ||
      !deferredPrompt ||
      isStandalone ||
      isInstalled ||
      isDismissed ||
      autoShownUsersRef.current.has(userId)
    ) {
      return;
    }

    autoShownUsersRef.current.add(userId);
    setModalMode("install");
  }, [deferredPrompt, isDismissed, isInstalled, isStandalone, userId]);

  const rememberDismissal = useCallback(() => {
    if (!userId) {
      return;
    }

    sessionDismissedUsersRef.current.add(userId);
    rememberPwaInstallDismissal(storageRef.current, userId);
    setIsDismissed(true);
  }, [userId]);

  const handleLater = useCallback(() => {
    rememberDismissal();
    setModalMode("closed");
  }, [rememberDismissal]);

  const handleInstall = useCallback(async () => {
    const prompt = deferredPrompt;
    if (!prompt) {
      setModalMode("guidance");
      return;
    }

    setInstalling(true);
    setDeferredPrompt(null);

    try {
      const result = await prompt.prompt();
      if (shouldRememberPwaPromptOutcome(result.outcome)) {
        rememberDismissal();
      }
      setModalMode("closed");
    } catch {
      setModalMode("guidance");
    } finally {
      setInstalling(false);
    }
  }, [deferredPrompt, rememberDismissal]);

  const openInstallOptions = useCallback(() => {
    if (!userId || isStandalone || isInstalled) {
      return;
    }

    sessionDismissedUsersRef.current.delete(userId);
    clearPwaInstallDismissal(storageRef.current, userId);
    setIsDismissed(false);
    setModalMode(deferredPrompt ? "install" : "guidance");
  }, [deferredPrompt, isInstalled, isStandalone, userId]);

  const contextValue = useMemo<PwaInstallContextValue>(
    () => ({
      isSettingsEntryVisible:
        Platform.OS === "web" && Boolean(userId) && !isStandalone && !isInstalled,
      openInstallOptions,
    }),
    [isInstalled, isStandalone, openInstallOptions, userId],
  );

  return (
    <PwaInstallContext.Provider value={contextValue}>
      {children}
      <PwaInstallModal
        mode={modalMode}
        installing={installing}
        onInstall={() => void handleInstall()}
        onLater={handleLater}
        onCloseGuidance={() => setModalMode("closed")}
      />
    </PwaInstallContext.Provider>
  );
}

export function usePwaInstall(): PwaInstallContextValue {
  const value = useContext(PwaInstallContext);
  if (!value) {
    throw new Error("usePwaInstall must be used within PwaInstallProvider.");
  }
  return value;
}
