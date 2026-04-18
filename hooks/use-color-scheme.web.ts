import { useEffect, useState } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";

type Scheme = "light" | "dark";

function readBrowserScheme(): Scheme {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Web fallback: some environments do not reliably surface an RN Appearance value.
 * We keep a matchMedia fallback so dark/light tokens remain mode-consistent.
 */
export function useColorScheme(): Scheme {
  const rnScheme = useRNColorScheme();
  const [browserScheme, setBrowserScheme] = useState<Scheme>(() =>
    readBrowserScheme(),
  );

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => setBrowserScheme(media.matches ? "dark" : "light");
    apply();

    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  if (rnScheme === "dark" || rnScheme === "light") {
    return rnScheme;
  }

  return browserScheme;
}
