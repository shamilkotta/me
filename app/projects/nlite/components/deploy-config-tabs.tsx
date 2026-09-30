"use client";

import { useState } from "react";
import { cn } from "cn";

export function DeployConfigTabs({
  tabs,
}: {
  tabs: {
    id: string;
    label: string;
    html: string;
  }[];
}) {
  const [active, setActive] = useState(tabs[0]!.id);
  const current = tabs.find((tab) => tab.id === active) ?? tabs[0]!;

  return (
    <div className="flex min-w-0 flex-col">
      <div
        role="tablist"
        aria-label="Deploy targets"
        className="flex w-full min-w-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden border-b border-(--nl-border) bg-(--nl-surface) sm:w-[calc((100%-1px)/2)]"
      >
        {tabs.map((tab, index) => {
          const isActive = tab.id === active;
          const isLast = index === tabs.length - 1;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(tab.id)}
              className={cn(
                "relative shrink-0 whitespace-nowrap px-3.5 py-2 text-center text-sm transition-colors duration-150 sm:px-4",
                index > 0 && "border-l border-(--nl-border)",
                isLast && "border-r border-(--nl-border)",
                isActive
                  ? "font-medium text-(--nl-fg)"
                  : "text-(--nl-muted) [@media(hover:hover)_and_(pointer:fine)]:hover:text-(--nl-fg)",
              )}
            >
              {tab.label}
              {isActive ? (
                <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-(--nl-fg)" />
              ) : null}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        className="nl-code nl-code-compact min-w-0 overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: current.html }}
      />
    </div>
  );
}
