import type { ReactNode } from "react";
import { cn } from "cn";

export function CodeFrame({
  html,
  filename,
  className = "",
  badge,
  children,
}: {
  html?: string;
  filename?: string;
  className?: string;
  badge?: {
    label: string;
    icon: ReactNode;
  };
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative overflow-visible rounded-xl border border-(--nl-code-border) bg-(--nl-code-bg) text-(--nl-code-fg)",
        className,
      )}
    >
      {filename ? (
        <div className="flex items-center gap-2 border-b border-(--nl-code-border) px-4 py-2.5">
          <span className="flex gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-(--nl-code-line)" />
            <span className="size-2.5 rounded-full bg-(--nl-code-line)" />
            <span className="size-2.5 rounded-full bg-(--nl-code-line)" />
          </span>
          <span className="ml-2 font-mono text-[11px] text-(--nl-code-line)">{filename}</span>
        </div>
      ) : null}
      {badge ? (
        <div className="absolute -top-3 -right-2 z-10">
          <div className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-(--nl-border) bg-(--nl-surface) py-0.5 pr-2.5 pl-0.5 text-(--nl-fg) shadow-[0_1px_2px_rgb(0_0_0/0.06)]">
            <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-(--nl-border) bg-(--nl-surface-2) text-(--nl-muted)">
              {badge.icon}
            </span>
            <span className="truncate text-[11px] leading-none font-medium">{badge.label}</span>
          </div>
        </div>
      ) : null}
      {children ??
        (html ? <div className="nl-code" dangerouslySetInnerHTML={{ __html: html }} /> : null)}
    </div>
  );
}
