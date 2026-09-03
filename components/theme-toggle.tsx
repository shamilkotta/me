"use client";

import { useCallback, useLayoutEffect } from "react";
import { usePathname } from "nlite/navigation";

import { applyStoredTheme, getResolvedTheme, setTheme, THEME_KEY } from "@/lib/theme";

export function ThemeToggle() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    applyStoredTheme();

    const onStorage = (event: StorageEvent) => {
      if (event.key === THEME_KEY || event.key === null) applyStoredTheme();
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [pathname]);

  const onClick = useCallback(() => {
    setTheme(getResolvedTheme() === "dark" ? "light" : "dark");
  }, []);

  return (
    <button
      aria-label="Toggle theme"
      className="inline-flex cursor-pointer items-center justify-center border-0 bg-transparent p-0 align-baseline"
      onClick={onClick}
      type="button"
    >
      <span className="size-2.5 rounded-full bg-fg" />
    </button>
  );
}
