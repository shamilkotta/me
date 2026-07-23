"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

const COLUMN_BREAKPOINTS = [
  { query: "(min-width:1500px)", columns: 5 },
  { query: "(min-width:1000px)", columns: 4 },
  { query: "(min-width:600px)", columns: 3 },
  { query: "(min-width:400px)", columns: 2 },
] as const;

function getColumnCount() {
  if (typeof window === "undefined") return 1;

  for (const { query, columns } of COLUMN_BREAKPOINTS) {
    if (matchMedia(query).matches) return columns;
  }

  return 1;
}

function useColumnCount() {
  const [columns, setColumns] = useState(getColumnCount);

  useEffect(() => {
    const handler = () => setColumns(getColumnCount());
    const mediaQueries = COLUMN_BREAKPOINTS.map(({ query }) => matchMedia(query));

    mediaQueries.forEach((mq) => mq.addEventListener("change", handler));
    return () => mediaQueries.forEach((mq) => mq.removeEventListener("change", handler));
  }, []);

  return columns;
}

function useContainerWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, width] as const;
}

type MasonryItemProps = {
  id: string;
  x: number;
  y: number;
  width: number;
  gutter: number;
  onHeightChange: (id: string, height: number) => void;
  children: ReactNode;
};

function MasonryItem({ id, x, y, width, gutter, onHeightChange, children }: MasonryItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(([entry]) => {
      onHeightChange(id, entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height);
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [id, onHeightChange]);

  return (
    <div
      className="absolute top-0 left-0"
      ref={ref}
      style={{
        padding: gutter / 2,
        transform: `translate(${x}px, ${y}px)`,
        width,
      }}
    >
      {children}
    </div>
  );
}

export type MasonryProps<T> = {
  items: T[];
  itemKey: (item: T) => string;
  render: (props: { item: T; width: number }) => ReactNode;
  gutter?: number;
};

export function Masonry<T>({ items, itemKey, render, gutter = 12 }: MasonryProps<T>) {
  const columns = useColumnCount();
  const [containerRef, width] = useContainerWidth();
  const [heights, setHeights] = useState<Record<string, number>>({});

  const onHeightChange = useCallback((id: string, height: number) => {
    setHeights((current) => {
      if (current[id] === height) return current;
      return { ...current, [id]: height };
    });
  }, []);

  useEffect(() => {
    const ids = new Set(items.map(itemKey));

    setHeights((current) => {
      const next = Object.fromEntries(
        Object.entries(current).filter(([id]) => ids.has(id)),
      );

      return Object.keys(next).length === Object.keys(current).length ? current : next;
    });
  }, [itemKey, items]);

  const layout = useMemo(() => {
    if (!width) return { positions: [] as MasonryPosition<T>[], containerHeight: 0 };

    const columnWidth = width / columns;
    const colHeights = Array.from({ length: columns }, () => 0);
    const positions: MasonryPosition<T>[] = [];

    for (const item of items) {
      const id = itemKey(item);
      const column = colHeights.indexOf(Math.min(...colHeights));
      const x = columnWidth * column;
      const y = colHeights[column];
      const itemHeight = heights[id] ?? 0;

      positions.push({
        id,
        item,
        x,
        y,
        width: columnWidth,
        contentWidth: columnWidth - gutter,
      });

      colHeights[column] += itemHeight;
    }

    return {
      positions,
      containerHeight: Math.max(...colHeights, 0),
    };
  }, [columns, gutter, heights, itemKey, items, width]);

  return (
    <div className="relative w-full" ref={containerRef} style={{ height: layout.containerHeight }}>
      {layout.positions.map(({ id, item, x, y, width: itemWidth, contentWidth }) => (
        <MasonryItem
          gutter={gutter}
          id={id}
          key={id}
          onHeightChange={onHeightChange}
          width={itemWidth}
          x={x}
          y={y}
        >
          {render({ item, width: contentWidth })}
        </MasonryItem>
      ))}
    </div>
  );
}

type MasonryPosition<T> = {
  id: string;
  item: T;
  x: number;
  y: number;
  width: number;
  contentWidth: number;
};
