"use client";

import { useState } from "react";

export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="group flex w-full max-w-xl items-center gap-3 rounded-lg border border-[var(--nl-border)] bg-[var(--nl-surface)] px-4 py-3 text-left font-mono text-[13px] text-[var(--nl-fg)] transition-[transform,border-color,background-color,color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:border-[var(--nl-border-strong)] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[var(--nl-surface-2)]"
    >
      <span className="select-none text-[var(--nl-subtle)]">$</span>
      <span className="min-w-0 flex-1 truncate">{command}</span>
      <span className="shrink-0 text-[11px] uppercase tracking-wider text-[var(--nl-subtle)] transition-colors duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-[var(--nl-muted)]">
        {copied ? "copied" : "copy"}
      </span>
    </button>
  );
}
