"use client";

import { Check } from "lucide-react";

import { useUIPreferences } from "@/components/layout/ui-preferences-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const themes = [
  { key: "light", label: "Light" },
  { key: "dark", label: "Dark" },
  { key: "system", label: "System" },
] as const;

const fonts = [
  { key: "jetbrains-mono", label: "JetBrains Mono (Default)" },
  { key: "geist", label: "Geist" },
  { key: "ibm-plex", label: "IBM Plex Sans" },
] as const;

export function AppearanceSettings() {
  const { theme, setTheme, font, setFont } = useUIPreferences();

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-sm font-semibold">Theme</h2>
        <p className="mt-1 text-sm text-muted-foreground">Choose the app color mode.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {themes.map((item) => (
            <Button
              key={item.key}
              variant={theme === item.key ? "default" : "outline"}
              onClick={() => setTheme(item.key)}
              className={cn("gap-2", theme === item.key ? "shadow-sm" : "")}
            >
              {theme === item.key ? <Check className="size-4" /> : null}
              {item.label}
            </Button>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-sm font-semibold">Font</h2>
        <p className="mt-1 text-sm text-muted-foreground">Choose the primary UI font family.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {fonts.map((item) => (
            <Button
              key={item.key}
              variant={font === item.key ? "default" : "outline"}
              onClick={() => setFont(item.key)}
              className={cn("gap-2", font === item.key ? "shadow-sm" : "")}
            >
              {font === item.key ? <Check className="size-4" /> : null}
              {item.label}
            </Button>
          ))}
        </div>
      </section>
    </div>
  );
}
