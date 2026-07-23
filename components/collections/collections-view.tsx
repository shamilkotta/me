"use client";

import { Masonry } from "@/components/masonry";
import { useCallback, useEffect, useMemo, useRef, useState, type FocusEvent } from "react";

import { CollectionCard } from "@/components/collections/collection-card";
import { CollectionsSearch } from "@/components/collections/collections-search";
import { isImageOnlyItem, matchesQuery, type CollectionItem } from "@/lib/collections";
import {
  findSpatialTargetFromKey,
  findVisualOrderEdge,
  findVisualOrderTarget,
  isArrowNavigationKey,
  type SpatialEntry,
} from "@/lib/spatial-navigation";

type CollectionsViewProps = {
  items: CollectionItem[];
};

const COLUMN_GUTTER = 12;

export function CollectionsView({ items }: CollectionsViewProps) {
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const lastTabDirectionRef = useRef<"forwards" | "backwards" | null>(null);

  const trimmedQuery = query.trim();
  const visibleIds = useMemo(() => {
    if (!trimmedQuery) return null;
    return new Set(items.filter((item) => matchesQuery(item, trimmedQuery)).map((item) => item.id));
  }, [items, trimmedQuery]);

  const visibleItems = useMemo(
    () => (visibleIds === null ? items : items.filter((item) => visibleIds.has(item.id))),
    [items, visibleIds],
  );

  const hasMatches = visibleIds === null || visibleIds.size > 0;

  const isItemVisible = useCallback(
    (item: CollectionItem) => visibleIds === null || visibleIds.has(item.id),
    [visibleIds],
  );

  const itemIndexById = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach((item, index) => map.set(item.id, index));
    return map;
  }, [items]);

  const setCardRef = useCallback(
    (itemId: string) => {
      const index = itemIndexById.get(itemId);
      if (index === undefined) return () => {};

      return (element: HTMLElement | null) => {
        cardRefs.current[index] = element;
      };
    },
    [itemIndexById],
  );

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

  const getSpatialEntries = useCallback(() => {
    return cardRefs.current
      .map((element, index) => {
        if (!element) return null;

        const item = items[index];
        if (!item || !isItemVisible(item)) return null;

        return { index, rect: element.getBoundingClientRect() };
      })
      .filter((entry): entry is SpatialEntry => entry !== null);
  }, [isItemVisible, items]);

  const navigateCardsSpatial = useCallback(
    (key: string) => {
      const currentIndex = getFocusedCardIndex();
      if (currentIndex === -1) return false;

      const currentElement = cardRefs.current[currentIndex];
      if (!currentElement) return false;

      const nextIndex = findSpatialTargetFromKey(
        key,
        currentElement.getBoundingClientRect(),
        getSpatialEntries(),
        currentIndex,
      );

      if (nextIndex === null) return false;

      focusCard(nextIndex);
      return true;
    },
    [focusCard, getFocusedCardIndex, getSpatialEntries],
  );

  const navigateCardsInVisualOrder = useCallback(
    (backwards: boolean) => {
      const currentIndex = getFocusedCardIndex();
      if (currentIndex === -1) return false;

      const nextIndex = findVisualOrderTarget(
        getSpatialEntries(),
        currentIndex,
        backwards ? "previous" : "next",
      );

      if (nextIndex === null) return false;

      focusCard(nextIndex);
      return true;
    },
    [focusCard, getFocusedCardIndex, getSpatialEntries],
  );

  const handleGridFocus = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      if (!lastTabDirectionRef.current) return;
      if (
        event.relatedTarget instanceof Node &&
        event.currentTarget.contains(event.relatedTarget)
      ) {
        return;
      }

      const edge = lastTabDirectionRef.current === "backwards" ? "last" : "first";
      const nextIndex = findVisualOrderEdge(getSpatialEntries(), edge);
      if (nextIndex !== null) focusCard(nextIndex);
    },
    [focusCard, getSpatialEntries],
  );

  const activateItem = useCallback((item: CollectionItem) => {
    if (item.url && !isImageOnlyItem(item)) {
      window.open(item.url, "_blank", "noopener,noreferrer");
    }
  }, []);

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, items.length);
  }, [items.length]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Tab") {
        lastTabDirectionRef.current = event.shiftKey ? "backwards" : "forwards";
        window.setTimeout(() => {
          lastTabDirectionRef.current = null;
        }, 0);
      }

      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
        return;
      }

      if (!gridRef.current?.contains(document.activeElement)) return;

      if (event.key === "Tab") {
        if (navigateCardsInVisualOrder(event.shiftKey)) event.preventDefault();
        return;
      }

      if (isArrowNavigationKey(event.key)) {
        if (navigateCardsSpatial(event.key)) event.preventDefault();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigateCardsInVisualOrder, navigateCardsSpatial]);

  return (
    <>
      <CollectionsSearch inputRef={searchRef} onQueryChange={setQuery} query={query} />

      <div
        aria-label="Collections"
        className="relative left-1/2 ml-[-50vw] w-screen px-2"
        onFocusCapture={handleGridFocus}
        ref={gridRef}
        role="list"
      >
        {items.length > 0 ? (
          <Masonry
            gutter={COLUMN_GUTTER}
            itemKey={(item) => item.id}
            items={visibleItems}
            render={({ item, width }) => (
              <div role="listitem" style={{ width }}>
                <CollectionCard
                  cardRef={setCardRef(item.id)}
                  item={item}
                  onActivate={() => activateItem(item)}
                />
              </div>
            )}
          />
        ) : null}

        {trimmedQuery && !hasMatches ? (
          <p className="py-8 text-center text-[0.8125rem] text-muted">no matches</p>
        ) : null}
      </div>
    </>
  );
}
