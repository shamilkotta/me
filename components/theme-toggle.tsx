"use client";

import { useCallback, useLayoutEffect, useRef, type MouseEvent } from "react";
import { usePathname } from "nlite/navigation";

import { applyStoredTheme, getResolvedTheme, setTheme, THEME_KEY, type Theme } from "@/lib/theme";

function toggleWithCircleReveal(origin: { x: number; y: number }, next: Theme) {
  if (
    !document.startViewTransition ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    setTheme(next);
    return;
  }

  const endRadius = Math.hypot(
    Math.max(origin.x, window.innerWidth - origin.x),
    Math.max(origin.y, window.innerHeight - origin.y),
  );

  const transition = document.startViewTransition(() => {
    setTheme(next);
  });

  transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${origin.x}px ${origin.y}px)`,
          `circle(${endRadius}px at ${origin.x}px ${origin.y}px)`,
        ],
      },
      {
        duration: 450,
        easing: "ease-out",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  });
}

export function ThemeToggle() {
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    applyStoredTheme();

    const onStorage = (event: StorageEvent) => {
      if (event.key === THEME_KEY || event.key === null) applyStoredTheme();
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [pathname]);

  const onClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const next = getResolvedTheme() === "dark" ? "light" : "dark";
    const rect = buttonRef.current?.getBoundingClientRect();
    const origin = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : { x: event.clientX, y: event.clientY };

    toggleWithCircleReveal(origin, next);
  }, []);

  return (
    <button
      aria-label="Toggle theme"
      className="inline-flex cursor-pointer items-center justify-center border-0 bg-transparent p-0 align-baseline"
      onClick={onClick}
      ref={buttonRef}
      type="button"
    >
      <span className="size-2.5 rounded-full bg-fg" />
    </button>
  );
}
