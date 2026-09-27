import type { Metadata } from "nlite";

import { NLITE, TREE } from "@/lib/nlite-landing";
import { absoluteUrl } from "@/lib/links";
import { CopyCommand } from "./components/copy-command";
import { GitHubCorner } from "./components/github-corner";
import { FeaturesGrid } from "./components/features-grid";
import { HeroBackdrop } from "./components/hero-backdrop";
import { PprShowcase } from "./components/ppr-showcase";
import { ViteFoundation } from "./components/vite-foundation";

export const metadata: Metadata = {
  title: "nlite — The React framework on Vite",
  description: NLITE.description,
  alternates: { canonical: absoluteUrl("/projects/nlite") },
};

const press =
  "transition-[transform,opacity,border-color,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]";
const hoverFine = "[@media(hover:hover)_and_(pointer:fine)]:hover:";

export default function NlitePage() {
  return (
    <>
      <section className="relative flex min-h-[100dvh] items-center overflow-hidden border-b border-[var(--nl-border)]">
        <GitHubCorner />
        <HeroBackdrop />
        <div className="nlite-noise absolute inset-0" />
        <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
          <div className="max-w-md">
            <p className="nlite-animate-in mb-5 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--nl-subtle)]">
              Next.js-familiar · Vite-native
            </p>

            <h1 className="nlite-animate-in nlite-animate-in-delay-1 mb-5 text-[clamp(3.5rem,10vw,5.5rem)] font-semibold leading-[0.9] tracking-[-0.06em]">
              {NLITE.name}
            </h1>

            <p className="nlite-animate-in nlite-animate-in-delay-2 mb-3 text-lg text-[var(--nl-muted)] sm:text-xl">
              {NLITE.tagline}
            </p>
            <p className="nlite-animate-in nlite-animate-in-delay-2 mb-8 text-sm text-[var(--nl-subtle)] sm:text-base">
              Partial Pre-Rendering, SSR, and SSG on a familiar{" "}
              <code className="font-mono text-[var(--nl-muted)]">app/</code> directory. First-party
              adapters for Vercel, Cloudflare, Netlify, and any JS server, with the full Vite
              developer experience.
            </p>

            <div className="nlite-animate-in nlite-animate-in-delay-3 mb-6">
              <CopyCommand command={NLITE.install} />
            </div>

            <div className="nlite-animate-in nlite-animate-in-delay-3 flex flex-wrap gap-3">
              <a
                href={NLITE.docs}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex h-10 items-center rounded-full bg-[var(--nl-fg)] px-5 text-sm font-medium !text-[var(--nl-bg)] ${press} ${hoverFine}opacity-90`}
              >
                Docs
              </a>
              <a
                href={NLITE.npm}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex h-10 items-center rounded-full border border-[var(--nl-border)] bg-[var(--nl-surface)] px-5 text-sm font-medium !text-[var(--nl-fg)] ${press} ${hoverFine}border-[var(--nl-border-strong)] ${hoverFine}bg-[var(--nl-surface-2)]`}
              >
                View on npm
              </a>
            </div>
          </div>

          <div
            className={`nlite-animate-in nlite-animate-in-delay-2 relative overflow-hidden rounded-2xl border border-[var(--nl-border)] bg-[var(--nl-surface)] p-5 transition-[border-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] sm:p-6 ${hoverFine}border-[var(--nl-border-strong)]`}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-[11px] text-[var(--nl-subtle)]">explorer</span>
              <span className="rounded border border-[var(--nl-border)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--nl-muted)]">
                nlite/
              </span>
            </div>
            <ul className="font-mono text-[13px] leading-7">
              {TREE.map((node) => (
                <li
                  key={`${node.name}-${node.note}`}
                  className={`-mx-1 flex items-baseline justify-between gap-4 rounded-md px-1 transition-colors duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] ${hoverFine}bg-[var(--nl-surface-2)]`}
                  style={{ paddingLeft: `${(node.depth ?? 0) * 14 + 4}px` }}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={
                        node.kind === "dir" ? "text-[var(--nl-fg)]" : "text-[var(--nl-muted)]"
                      }
                    >
                      {node.kind === "dir" ? "▸" : "·"}
                    </span>
                    <span className={node.kind === "dir" ? "font-medium" : ""}>{node.name}</span>
                  </span>
                  <span
                    className={`hidden truncate text-[11px] text-[var(--nl-subtle)] transition-colors duration-150 sm:inline ${hoverFine}text-[var(--nl-muted)]`}
                  >
                    {node.note}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <PprShowcase />

      <FeaturesGrid />

      <ViteFoundation />

      <div aria-hidden className="h-16 sm:h-24" />
    </>
  );
}
