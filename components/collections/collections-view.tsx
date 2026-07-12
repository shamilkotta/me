"use client";

import { Masonry } from "masonic";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type FocusEvent,
} from "react";

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
const COLUMN_WIDTH = 220;

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function CollectionsView({ items }: CollectionsViewProps) {
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const lastTabDirectionRef = useRef<"forwards" | "backwards" | null>(null);
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

  const getSpatialEntries = useCallback(() => {
    return cardRefs.current
      .map((element, index) => (element ? { index, rect: element.getBoundingClientRect() } : null))
      .filter((entry): entry is SpatialEntry => entry !== null);
  }, []);

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
    cardRefs.current = cardRefs.current.slice(0, filtered.length);
  }, [filtered.length]);

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
