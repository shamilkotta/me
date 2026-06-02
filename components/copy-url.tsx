"use client";

import { useCallback, useEffect, useState } from "react";

const buttonClass =
  "cursor-pointer border-0 bg-transparent p-0 font-inherit text-[0.8125rem] text-muted transition-colors hover:text-fg";

export function CopyUrl() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;

    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const handleClick = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }, []);

  return (
    <button
      aria-label={copied ? "URL copied to clipboard" : "Copy page URL"}
      className={buttonClass}
      onClick={handleClick}
      type="button"
    >
      <span className="inline-grid [&>span]:col-start-1 [&>span]:row-start-1">
        <span
          className={`transition-all duration-200 ease-out ${
            copied ? "pointer-events-none -translate-y-0.5 opacity-0" : "translate-y-0 opacity-100"
          }`}
        >
          copy url
        </span>
        <span
          className={`transition-all duration-200 ease-out ${
            copied ? "translate-y-0 text-fg opacity-100" : "translate-y-0.5 opacity-0"
          }`}
        >
          url copied
        </span>
      </span>
    </button>
  );
}
