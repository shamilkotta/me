"use client";

import { useEffect, useRef, useState } from "react";

type Geom = {
  w: number;
  h: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  d: string;
};

function buildPath(x1: number, y1: number, x2: number, y2: number, stacked: boolean) {
  const dx = x2 - x1;
  const dy = y2 - y1;

  if (stacked) {
    // Right → right: bulge outward so the arc sits clear of the cards
    const bulge = Math.max(28, Math.abs(dy) * 0.22);
    return `M ${x1} ${y1} C ${x1 + bulge} ${y1 + dy * 0.25}, ${x2 + bulge} ${y2 - dy * 0.25}, ${x2} ${y2}`;
  }

  const cx1 = x1 + dx * 0.4;
  const cx2 = x1 + dx * 0.6;
  return `M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`;
}

/** Draws an animated curve between [data-stream-from] and [data-stream-to] in the parent. */
export function StreamConnector() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [geom, setGeom] = useState<Geom | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const root = svg?.parentElement;
    if (!svg || !root) return;

    function measure() {
      if (!root) return;
      const from = root.querySelector<HTMLElement>("[data-stream-from]");
      const to = root.querySelector<HTMLElement>("[data-stream-to]");
      if (!from || !to) return;

      const cr = root.getBoundingClientRect();
      const fr = from.getBoundingClientRect();
      const tr = to.getBoundingClientRect();

      const stacked = tr.top >= fr.bottom - 12;

      let x1: number;
      let y1: number;
      let x2: number;
      let y2: number;

      if (stacked) {
        // Right side of Origin → right side of CDN
        x1 = fr.right - cr.left;
        y1 = fr.top + fr.height * 0.55 - cr.top;
        x2 = tr.right - cr.left;
        y2 = tr.top + tr.height * 0.45 - cr.top;
      } else {
        // Right edge of Origin → left edge of CDN
        x1 = fr.right - cr.left;
        y1 = fr.top + fr.height * 0.4 - cr.top;
        x2 = tr.left - cr.left;
        y2 = tr.top + tr.height * 0.4 - cr.top;
      }

      setGeom({
        w: cr.width,
        h: cr.height,
        x1,
        y1,
        x2,
        y2,
        d: buildPath(x1, y1, x2, y2, stacked),
      });
    }

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    const from = root.querySelector("[data-stream-from]");
    const to = root.querySelector("[data-stream-to]");
    if (from) ro.observe(from);
    if (to) ro.observe(to);
    window.addEventListener("resize", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="pointer-events-none absolute inset-0 z-30 overflow-visible"
      width={geom?.w ?? "100%"}
      height={geom?.h ?? "100%"}
      viewBox={geom ? `0 0 ${geom.w} ${geom.h}` : undefined}
      fill="none"
      aria-hidden
    >
      {geom ? (
        <>
          <path
            d={geom.d}
            stroke="var(--nl-fg)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="6 6"
            className="nlite-arc-dash"
          />
          <circle cx={geom.x1} cy={geom.y1} r="3.5" fill="var(--nl-fg)" />
          <circle cx={geom.x2} cy={geom.y2} r="3.5" fill="var(--nl-fg)" />
        </>
      ) : null}
    </svg>
  );
}
