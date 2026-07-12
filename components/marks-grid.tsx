"use client";

import { Masonry } from "masonic";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FocusEvent,
} from "react";

import { MarkCard } from "@/components/mark-card";
import { MarkLightbox } from "@/components/mark-lightbox";
import type { Mark } from "@/lib/marks";
import {
  findSpatialTargetFromKey,
  findVisualOrderEdge,
  findVisualOrderTarget,
  isArrowNavigationKey,
  type SpatialEntry,
} from "@/lib/spatial-navigation";

type MarksGridProps = {
  marks: Mark[];
};

const COLUMN_GUTTER = 12;
const COLUMN_WIDTH = 180;

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function MarksGrid({ marks }: MarksGridProps) {
  const [selected, setSelected] = useState<Mark | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const lastTabDirectionRef = useRef<"forwards" | "backwards" | null>(null);
  const isClient = useIsClient();

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

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, marks.length);
  }, [marks.length]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Tab") {
        lastTabDirectionRef.current = event.shiftKey ? "backwards" : "forwards";
        window.setTimeout(() => {
          lastTabDirectionRef.current = null;
        }, 0);
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
      <div
        aria-label="Marks"
        className="[content-visibility:auto]"
        onFocusCapture={handleGridFocus}
        ref={gridRef}
        role="list"
      >
        {isClient && marks.length > 0 ? (
          <Masonry
            columnGutter={COLUMN_GUTTER}
            columnWidth={COLUMN_WIDTH}
            itemStyle={{ overflow: "visible" }}
            itemKey={(mark) => mark.slug}
            items={marks}
            overscanBy={5}
            render={({ data: mark, index, width }) => (
              <div className="p-1" role="listitem" style={{ width }}>
                <MarkCard
                  cardRef={setCardRef(index)}
                  index={index}
                  mark={mark}
                  onSelect={() => setSelected(mark)}
                />
              </div>
            )}
          />
        ) : null}
      </div>

      {selected ? <MarkLightbox mark={selected} onClose={() => setSelected(null)} /> : null}
    </>
  );
}
