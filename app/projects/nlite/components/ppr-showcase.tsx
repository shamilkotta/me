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

function PprCopy({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <h2 className="mb-5 text-[clamp(2.75rem,7vw,4.5rem)] font-semibold tracking-tight lg:text-6xl">
        Partial
        <br className="hidden lg:block" />
        <span className="lg:hidden"> </span>
        Pre-Rendering
      </h2>
      <p className="mb-3 text-lg font-medium text-(--nl-fg) sm:text-xl">
        Make full use of your infra.
      </p>
      <p className="mx-auto max-w-xl text-(--nl-muted) sm:text-lg lg:mx-0">
        Cache a static shell on the CDN. Stream dynamic regions from origin when data is ready. One
        response, edge speed and live data.
      </p>
    </div>
  );
}

export function PprShowcase() {
  return (
    <section id="ppr" className="relative scroll-mt-20 border-b border-(--nl-border)">
      {/* Full-bleed right surface + globe — desktop only */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-1/2 overflow-hidden bg-(--nl-surface) lg:block"
      >
        <div className="absolute -bottom-[48%] -left-[30%] w-[140%] max-w-[1100px]">
          <GlobeImage className="max-w-none opacity-90" />
        </div>
      </div>

      {/*
        Mobile (<sm): single column — Origin then CDN, staggered L/R.
        Tablet (sm–lg): side-by-side, scaled but using most of each half.
        Desktop (lg+): original two-column composition.
      */}
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-x-2 sm:grid-cols-2 sm:gap-x-3 md:gap-x-4 lg:h-dvh lg:max-h-dvh lg:grid-rows-[auto_1fr] lg:gap-x-0">
        <StreamConnector />

        {/* Origin — left-biased on mobile, fills most of left column on tablet+ */}
        <div className="relative z-10 col-start-1 row-start-1 flex justify-start px-4 pt-8 sm:justify-end sm:px-2 sm:pt-10 md:px-3 lg:border-r lg:border-(--nl-border) lg:px-8 lg:pt-12 lg:pr-4">
          <div
            data-stream-from
            className="w-[90%] max-w-md origin-top-left [transform:scale(0.95)] -mb-[5%] sm:w-full sm:max-w-none sm:origin-top-right sm:[transform:scale(0.9)] sm:-mb-[10%] md:[transform:scale(0.94)] md:-mb-[6%] lg:mb-0 lg:max-w-md lg:[transform:scale(0.82)]"
          >
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

        {/* CDN — right-biased on mobile (row 2), fills most of right column on tablet */}
        <div className="relative z-10 col-start-1 row-start-2 flex justify-end px-4 pt-3 sm:col-start-2 sm:row-start-1 sm:justify-start sm:px-2 sm:pt-10 md:px-3 lg:justify-end lg:overflow-visible lg:bg-transparent lg:px-2 lg:pt-36">
          <div
            data-stream-to
            className="w-[90%] max-w-md origin-top-right [transform:scale(0.95)] -mb-[5%] sm:w-full sm:max-w-none sm:origin-top-left sm:[transform:scale(0.9)] sm:-mb-[10%] md:[transform:scale(0.94)] md:-mb-[6%] lg:mb-0 lg:max-w-md lg:origin-top-right lg:[transform:translateX(0.5rem)_scale(0.82)]"
          >
            <CdnCodeBlock
              className="nlite-code-float"
              badge={{
                label: "CDN",
                icon: <CdnIcon />,
              }}
            />
          </div>
        </div>

        {/*
          Tablet/mobile: globe sits just below the codes (slight tuck),
          top of sphere reads clearly, bottom fades, copy sits on the fade.
          Desktop: left-column copy only — globe is the full-bleed layer above.
        */}
        <div className="relative col-span-1 row-start-3 -mt-6 overflow-hidden sm:col-span-2 sm:row-start-2 sm:-mt-10 lg:col-span-1 lg:col-start-1 lg:mt-0 lg:border-r lg:border-(--nl-border) lg:overflow-visible">
          {/* Globe just under codes (slight tuck) — pole clear, lower half fades */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[min(78vw,480px)] overflow-hidden lg:hidden"
          >
            <div className="absolute top-0 left-1/2 w-[min(175%,1040px)] -translate-x-1/2">
              <GlobeImage className="max-w-none opacity-95" />
            </div>
            {/* Keep the pole; wash out from mid-sphere down for the copy */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent from-[22%] via-(--nl-bg)/75 via-[48%] to-(--nl-bg) to-[72%]" />
          </div>

          {/* Copy sits on the washed lower half of the globe */}
          <div className="relative z-10 mx-auto max-w-3xl px-5 pt-[min(42vw,250px)] pb-16 text-center sm:px-8 sm:pb-20 lg:mx-0 lg:max-w-lg lg:px-8 lg:pt-6 lg:pb-32 lg:text-left">
            <PprCopy />
          </div>
        </div>
      </div>
    </section>
  );
}
