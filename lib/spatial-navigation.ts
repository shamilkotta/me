export type SpatialEntry = {
  index: number;
  rect: DOMRect;
};

export type SpatialDirection = "left" | "right" | "up" | "down";

const ROW_TOLERANCE_PX = 8;

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

export function findSpatialTarget(
  current: DOMRect,
  entries: SpatialEntry[],
  currentIndex: number,
  direction: SpatialDirection,
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

export function findSpatialTargetFromKey(
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

export function isArrowNavigationKey(key: string) {
  return key === "ArrowLeft" || key === "ArrowRight" || key === "ArrowUp" || key === "ArrowDown";
}

export function findVisualOrderTarget(
  entries: SpatialEntry[],
  currentIndex: number,
  direction: "next" | "previous",
) {
  const ordered = [...entries].sort((a, b) => {
    const topDelta = a.rect.top - b.rect.top;
    if (Math.abs(topDelta) > ROW_TOLERANCE_PX) return topDelta;
    return a.rect.left - b.rect.left;
  });
  const currentOrderIndex = ordered.findIndex((entry) => entry.index === currentIndex);

  if (currentOrderIndex === -1) return null;

  const offset = direction === "next" ? 1 : -1;
  return ordered[currentOrderIndex + offset]?.index ?? null;
}

export function findVisualOrderEdge(entries: SpatialEntry[], edge: "first" | "last") {
  const ordered = [...entries].sort((a, b) => {
    const topDelta = a.rect.top - b.rect.top;
    if (Math.abs(topDelta) > ROW_TOLERANCE_PX) return topDelta;
    return a.rect.left - b.rect.left;
  });

  return edge === "first" ? (ordered[0]?.index ?? null) : (ordered.at(-1)?.index ?? null);
}
