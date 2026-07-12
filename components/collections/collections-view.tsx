"use client";

import { Masonry } from "masonic";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

import { CollectionCard } from "@/components/collections/collection-card";
import { CollectionsSearch } from "@/components/collections/collections-search";
import { isImageOnlyItem, matchesQuery, type CollectionItem } from "@/lib/collections";

type CollectionsViewProps = {
  items: CollectionItem[];
};

type SpatialEntry = {
  index: number;
  rect: DOMRect;
};

const COLUMN_GUTTER = 12;
const COLUMN_WIDTH = 220;

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function overlaps(a: DOMRect, b: DOMRect, axis: "x" | "y") {
  if (axis === "x") return a.left < b.right && a.right > b.left;
  return a.top < b.bottom && a.bottom > b.top;
}

function center(rect: DOMRect) {
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

function findSpatialTarget(
  current: DOMRect,
  entries: SpatialEntry[],
  currentIndex: number,
  direction: "left" | "right" | "up" | "down",
) {
  const currentCenter = center(current);
  let bestIndex: number | null = null;
  let bestScore = Infinity;

  for (const entry of entries) {
    if (entry.index === currentIndex) continue;

    const targetCenter = center(entry.rect);
    const dx = targetCenter.x - currentCenter.x;
    const dy = targetCenter.y - currentCenter.y;

    let valid = false;
    let primary = 0;
    let secondary = 0;

    switch (direction) {
      case "right":
        valid =
          dx > 0 && (overlaps(current, entry.rect, "y") || Math.abs(dy) < current.height * 0.75);
        primary = dx;
        secondary = Math.abs(dy);
        break;
      case "left":
        valid =
          dx < 0 && (overlaps(current, entry.rect, "y") || Math.abs(dy) < current.height * 0.75);
        primary = -dx;
        secondary = Math.abs(dy);
        break;
      case "down":
        valid =
          dy > 0 && (overlaps(current, entry.rect, "x") || Math.abs(dx) < current.width * 0.75);
        primary = dy;
        secondary = Math.abs(dx);
        break;
      case "up":
        valid =
          dy < 0 && (overlaps(current, entry.rect, "x") || Math.abs(dx) < current.width * 0.75);
        primary = -dy;
        secondary = Math.abs(dx);
        break;
    }

    if (!valid) continue;

    const score = primary + secondary * 0.5;
    if (score < bestScore) {
      bestScore = score;
      bestIndex = entry.index;
    }
  }

  return bestIndex;
}

function findSpatialTargetFromKey(
  key: string,
  current: DOMRect,
  entries: SpatialEntry[],
  currentIndex: number,
) {
  const direction =
    key === "ArrowLeft"
      ? "left"
      : key === "ArrowRight"
        ? "right"
        : key === "ArrowUp"
          ? "up"
          : key === "ArrowDown"
            ? "down"
            : null;

  if (!direction) return null;
  return findSpatialTarget(current, entries, currentIndex, direction);
}

export function CollectionsView({ items }: CollectionsViewProps) {
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const isClient = useIsClient();

  const filtered = useMemo(() => items.filter((item) => matchesQuery(item, query)), [items, query]);

  const setCardRef = useCallback((index: number) => {
    return (element: HTMLElement | null) => {
      cardRefs.current[index] = element;
    };
  }, []);

  const focusCard = useCallback((index: number) => {
    const element = cardRefs.current[index];
    element?.focus();
    element?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, []);

  const getFocusedCardIndex = useCallback(() => {
    const active = document.activeElement;
    return cardRefs.current.findIndex(
      (element) => element && (element === active || element.contains(active)),
    );
  }, []);

  const navigateCardsSpatial = useCallback(
    (key: string) => {
      const currentIndex = getFocusedCardIndex();
      if (currentIndex === -1) return false;

      const currentElement = cardRefs.current[currentIndex];
      if (!currentElement) return false;

      const entries = cardRefs.current
        .map((element, index) =>
          element ? { index, rect: element.getBoundingClientRect() } : null,
        )
        .filter((entry): entry is SpatialEntry => entry !== null);

      const nextIndex = findSpatialTargetFromKey(
        key,
        currentElement.getBoundingClientRect(),
        entries,
        currentIndex,
      );

      if (nextIndex === null) return false;

      focusCard(nextIndex);
      return true;
    },
    [focusCard, getFocusedCardIndex],
  );

  const activateItem = useCallback((item: CollectionItem) => {
    if (item.url && !isImageOnlyItem(item)) {
      window.open(item.url, "_blank", "noopener,noreferrer");
    }
  }, []);

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, filtered.length);
  }, [filtered.length]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
        return;
      }

      if (!gridRef.current?.contains(document.activeElement)) return;

      if (
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight" ||
        event.key === "ArrowUp" ||
        event.key === "ArrowDown"
      ) {
        if (navigateCardsSpatial(event.key)) event.preventDefault();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigateCardsSpatial]);

  return (
    <>
      <CollectionsSearch inputRef={searchRef} onQueryChange={setQuery} query={query} />

      <div
        aria-label="Collections"
        className="relative left-1/2 ml-[-50vw] w-screen px-2"
        ref={gridRef}
        role="list"
      >
        {isClient && filtered.length > 0 ? (
          <Masonry
            columnGutter={COLUMN_GUTTER}
            columnWidth={COLUMN_WIDTH}
            itemKey={(item) => item.id}
            items={filtered}
            overscanBy={5}
            render={({ data: item, index, width }) => (
              <div role="listitem" style={{ width }}>
                <CollectionCard
                  cardRef={setCardRef(index)}
                  item={item}
                  onActivate={() => activateItem(item)}
                />
              </div>
            )}
          />
        ) : null}

        {filtered.length === 0 ? (
          <p className="py-8 text-center text-[0.8125rem] text-muted">no matches</p>
        ) : null}
      </div>
    </>
  );
}
