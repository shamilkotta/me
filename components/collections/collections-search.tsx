"use client";

import { useSyncExternalStore, type RefObject } from "react";
import { Search } from "lucide-react";

type CollectionsSearchProps = {
  query: string;
  inputRef: RefObject<HTMLInputElement | null>;
  onQueryChange: (query: string) => void;
};

function useSearchShortcutLabel() {
  return useSyncExternalStore(
    () => () => {},
    () => (/Mac|iPhone|iPad/i.test(navigator.platform) ? "⌘K" : "Ctrl+K"),
    () => "⌘K",
  );
}

export function CollectionsSearch({ query, inputRef, onQueryChange }: CollectionsSearchProps) {
  const searchShortcut = useSearchShortcutLabel();

  return (
    <div className="relative mb-6">
      <Search
        aria-hidden
        className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted"
      />
      <input
        className="w-full border border-border bg-transparent py-2 pl-8 pr-16 text-[0.8125rem] outline-none focus:border-fg"
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="search..."
        ref={inputRef}
        value={query}
      />
      {!query ? (
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-border px-1.5 py-0.5 text-[0.6875rem] text-muted">
          {searchShortcut}
        </kbd>
      ) : null}
    </div>
  );
}
