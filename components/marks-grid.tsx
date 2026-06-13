"use client";

import { useMemo, useState, useSyncExternalStore } from "react";

import { MarkCard } from "@/components/mark-card";
import { MarkLightbox } from "@/components/mark-lightbox";
import type { Mark } from "@/lib/marks";

type MarksGridProps = {
  marks: Mark[];
};

function getColumnCount() {
  if (typeof window === "undefined") return 3;
  return window.matchMedia("(min-width: 640px)").matches ? 3 : 2;
}

function subscribeToColumnCount(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia("(min-width: 640px)");
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function useColumnCount() {
  return useSyncExternalStore(subscribeToColumnCount, getColumnCount, () => 3);
}

function distributeToColumns<T>(items: T[], columnCount: number) {
  const columns: { item: T; index: number }[][] = Array.from({ length: columnCount }, () => []);

  items.forEach((item, index) => {
    columns[index % columnCount].push({ item, index });
  });

  return columns;
}

export function MarksGrid({ marks }: MarksGridProps) {
  const [selected, setSelected] = useState<Mark | null>(null);
  const columnCount = useColumnCount();
  const columns = useMemo(() => distributeToColumns(marks, columnCount), [marks, columnCount]);

  return (
    <>
      <div className="flex gap-3 [content-visibility:auto]">
        {columns.map((column, columnIndex) => (
          <div className="flex min-w-0 flex-1 flex-col gap-3" key={columnIndex}>
            {column.map(({ item: mark, index }) => (
              <MarkCard
                index={index}
                key={mark.slug}
                mark={mark}
                onSelect={() => setSelected(mark)}
              />
            ))}
          </div>
        ))}
      </div>

      {selected ? <MarkLightbox mark={selected} onClose={() => setSelected(null)} /> : null}
    </>
  );
}
