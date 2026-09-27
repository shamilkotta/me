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

function buildPath(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
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

      // Right edge of Origin → left edge of CDN (mid-upper on each card)
      const x1 = fr.right - cr.left;
      const y1 = fr.top + fr.height * 0.4 - cr.top;
      const x2 = tr.left - cr.left;
      const y2 = tr.top + tr.height * 0.4 - cr.top;

      setGeom({
        w: cr.width,
        h: cr.height,
        x1,
        y1,
        x2,
        y2,
        d: buildPath(x1, y1, x2, y2),
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
      className="pointer-events-none absolute inset-0 z-10 hidden overflow-visible lg:block"
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
