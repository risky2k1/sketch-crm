"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type ThemeMode = "light" | "dark" | "system";
type FontMode = "jetbrains-mono" | "geist" | "ibm-plex";

type UIPreferencesContextValue = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  font: FontMode;
  setFont: (font: FontMode) => void;
};

const THEME_KEY = "sketch_crm_theme";
const FONT_KEY = "sketch_crm_font";

const UIPreferencesContext = createContext<UIPreferencesContextValue | null>(null);

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "system";
  const storedTheme = localStorage.getItem(THEME_KEY);
  return storedTheme === "light" || storedTheme === "dark" || storedTheme === "system" ? storedTheme : "system";
}

function getInitialFont(): FontMode {
  if (typeof window === "undefined") return "jetbrains-mono";
  const storedFont = localStorage.getItem(FONT_KEY);
  return storedFont === "jetbrains-mono" || storedFont === "geist" || storedFont === "ibm-plex" ? storedFont : "jetbrains-mono";
}

function applyTheme(theme: ThemeMode) {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const shouldUseDark = theme === "dark" || (theme === "system" && prefersDark);
  root.classList.toggle("dark", shouldUseDark);
}

function applyFont(font: FontMode) {
  if (typeof window === "undefined") return;
  document.documentElement.dataset.font = font;
}

export function UIPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(getInitialTheme);
  const [font, setFontState] = useState<FontMode>(getInitialFont);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);

    if (theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => applyTheme("system");
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [theme]);

  useEffect(() => {
    applyFont(font);
    localStorage.setItem(FONT_KEY, font);
  }, [font]);

  const value = useMemo(
    () => ({
      theme,
      setTheme: setThemeState,
      font,
      setFont: setFontState,
    }),
    [theme, font],
  );

  return <UIPreferencesContext.Provider value={value}>{children}</UIPreferencesContext.Provider>;
}

export function useUIPreferences() {
  const context = useContext(UIPreferencesContext);
  if (!context) {
    throw new Error("useUIPreferences must be used within UIPreferencesProvider.");
  }
  return context;
}
