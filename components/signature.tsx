"use client";

import { useEffect, useRef, useState } from "react";

import { SIGN_PATHS, SIGN_VIEW_BOX } from "@/lib/sign-paths";
import { usePathname } from "nlite/navigation";

const STROKE_MS = 16;
const INTRO_DELAY_MS = 600;

function sleep(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timeout);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

function cancelPathAnimations(path: SVGPathElement) {
  for (const animation of path.getAnimations()) {
    animation.cancel();
  }
}

function hidePath(path: SVGPathElement) {
  cancelPathAnimations(path);
  const length = path.getTotalLength();
  path.style.strokeDasharray = `${length}`;
  path.style.strokeDashoffset = `${length}`;
}

function hideAll(paths: SVGPathElement[]) {
  for (const path of paths) {
    hidePath(path);
  }
}

function nextFrame() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

async function drawPath(path: SVGPathElement, durationMs: number, signal: AbortSignal) {
  hidePath(path);
  await nextFrame();

  const length = path.getTotalLength();
  const animation = path.animate([{ strokeDashoffset: `${length}` }, { strokeDashoffset: "0" }], {
    duration: durationMs,
    easing: "ease-in-out",
    fill: "none",
  });

  signal.addEventListener("abort", () => animation.cancel(), { once: true });

  try {
    await animation.finished;
    path.style.strokeDashoffset = "0";
  } catch {
    hidePath(path);
  }
}

type SignatureProps = {
  className?: string;
};

export function SignatureImpl({ className = "" }: SignatureProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const paths = [...svg.querySelectorAll<SVGPathElement>("path")];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const controller = new AbortController();
    const { signal } = controller;

    hideAll(paths);

    const startAnimation = () => {
      if (reducedMotion) {
        for (const path of paths) {
          cancelPathAnimations(path);
          path.style.strokeDasharray = "none";
          path.style.strokeDashoffset = "0";
        }
        setReady(true);
        return;
      }

      hideAll(paths);
      setReady(true);

      void (async () => {
        try {
          await sleep(INTRO_DELAY_MS, signal);
          if (signal.aborted) return;

          hideAll(paths);
          await nextFrame();

          for (const path of paths) {
            if (signal.aborted) return;
            await drawPath(path, STROKE_MS, signal);
          }
        } catch {
          // Aborted during unmount or delay.
        }
      })();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 1) {
          observer.disconnect();
          startAnimation();
        }
      },
      { threshold: 1 },
    );

    observer.observe(svg);

    return () => {
      controller.abort();
      observer.disconnect();
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox={SIGN_VIEW_BOX}
      role="img"
      aria-label="Shamil signature"
      className={`${className}${ready ? "" : " opacity-0"}`}
    >
      {SIGN_PATHS.map((segment, index) => (
        <path
          key={index}
          d={segment.d}
          fill="none"
          stroke="currentColor"
          strokeWidth={segment.strokeWidth}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

export function Signature({ className = "" }: SignatureProps) {
  const pathname = usePathname();

  if (pathname !== "/") {
    return null;
  }

  return <SignatureImpl className={className} />;
}
