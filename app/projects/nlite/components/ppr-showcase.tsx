import { CdnCodeBlock } from "./cdn-code-block";
import { CodeBlock } from "./code-block";
import { GlobeImage } from "./globe-image";
import { StreamConnector } from "./stream-connector";
import { DATA } from "@/lib/data";

function OriginIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <ellipse cx="12" cy="6" rx="7" ry="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function CdnIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 17a4 4 0 0 1 .4-7.9A5.5 5.5 0 0 1 18 10a3.5 3.5 0 0 1 .2 7H7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PprShowcase() {
  return (
    <section id="ppr" className="relative scroll-mt-20 border-b border-(--nl-border)">
      {/* Full-bleed right surface + globe — clips top/bottom/center, not the viewport right edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-1/2 overflow-hidden bg-(--nl-surface) lg:block"
      >
        <div className="absolute -bottom-[48%] -left-[30%] w-[140%] max-w-[1100px]">
          <GlobeImage className="max-w-none opacity-90" />
        </div>
      </div>

      <div className="relative mx-auto grid h-dvh max-h-dvh max-w-6xl lg:grid-cols-2">
        <StreamConnector />

        {/* Left — Origin block above copy, slightly right-aligned */}
        <div className="flex flex-col border-b border-(--nl-border) px-5 pt-8 pb-20 sm:px-8 sm:pt-10 sm:pb-24 lg:border-b-0 lg:border-r lg:pt-12 lg:pb-32">
          <div className="relative z-20 mb-10 flex justify-end lg:mb-14 lg:pr-4">
            <div data-stream-from className="w-full max-w-md origin-top-right scale-[0.82]">
              <CodeBlock
                code={DATA.PPR_ORIGIN}
                filename="posts.tsx"
                className="nlite-code-float"
                badge={{
                  label: "Origin",
                  icon: <OriginIcon />,
                }}
              />
            </div>
          </div>

          <div className="max-w-lg">
            <h2 className="mb-5 text-4xl font-semibold tracking-tight sm:text-6xl">
              Partial
              <br />
              Pre-Rendering
            </h2>
            <p className="mb-3 max-w-md text-lg font-medium text-(--nl-fg) sm:text-xl">
              Make full use of your infra.
            </p>
            <p className="max-w-md text-(--nl-muted) sm:text-lg">
              Cache a static shell on the CDN. Stream dynamic regions from origin when data is
              ready. One response, edge speed and live data.
            </p>
          </div>
        </div>

        {/* Right — CDN; globe lives in the full-bleed layer on lg */}
        <div className="relative flex flex-col items-start overflow-hidden bg-(--nl-surface) px-5 py-16 sm:px-8 sm:py-20 lg:items-end lg:overflow-visible lg:bg-transparent lg:py-24 lg:pt-36 lg:pr-2">
          <div
            data-stream-to
            className="relative z-20 w-full max-w-md origin-top-right scale-[0.82] lg:translate-x-2"
          >
            <CdnCodeBlock
              className="nlite-code-float"
              badge={{
                label: "CDN",
                icon: <CdnIcon />,
              }}
            />
          </div>

          {/* Mobile stacked: clip within the column */}
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-[52%] -left-[32%] z-0 w-[190%] max-w-[900px] lg:hidden"
          >
            <GlobeImage className="max-w-none opacity-90" />
          </div>
        </div>
      </div>
    </section>
  );
}
