const VITE_FEATURES = [
  {
    title: "Instant server start",
    body: "Native ESM on demand with fast dependency pre-bundling. Cold starts in milliseconds.",
  },
  {
    title: "Lightning-fast HMR",
    body: "Edits land instantly at any app size. Keep scroll, focus, and local state.",
  },
  {
    title: "Rich out of the box",
    body: "TypeScript, JSX, CSS, workers, Wasm, and the Vite plugin ecosystem via defineConfig.",
  },
  {
    title: "Optimized builds",
    body: "Rollup-powered production output with code splitting, tree-shaking, and asset hashing built in.",
  },
] as const;

export function ViteFoundation() {
  return (
    <section id="vite" className="scroll-mt-20">
      <div className="nlite-vite-panel mx-auto max-w-6xl overflow-hidden">
        {/* Top: title | blank */}
        <div className="grid lg:grid-cols-2">
          <div className="nlite-vite-cell nlite-vite-cell-br flex flex-col justify-center px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-(--nl-subtle)">
              Powered by Vite
            </p>
            <h2 className="mb-4 max-w-md text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
              Framework rails. Vite speed.
            </h2>
            <p className="mb-8 max-w-md text-(--nl-muted) sm:text-lg">
              nlite is a React framework on Vite. You get framework conventions and the same DX Vite
              is known for.
            </p>
            <div>
              <a
                href="https://vite.dev"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center rounded-full border border-(--nl-border) bg-(--nl-surface) px-5 text-sm font-medium !text-(--nl-fg) transition-[border-color,background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:border-(--nl-border-strong) [@media(hover:hover)_and_(pointer:fine)]:hover:bg-(--nl-surface-2)"
              >
                Explore Vite
                <span aria-hidden className="ml-1.5">
                  ↗
                </span>
              </a>
            </div>
          </div>

          <div className="nlite-vite-cell nlite-vite-cell-b relative flex min-h-[16rem] items-center justify-center p-6 sm:min-h-[18rem] sm:p-8 lg:min-h-0 lg:p-10">
            <div className="relative aspect-square w-full max-w-[28rem] lg:max-w-none" aria-hidden>
              <img
                src="/projects/nlite/vite-isometric-light.png"
                alt=""
                width={2048}
                height={2048}
                className="nlite-globe-light h-full w-full object-contain"
                draggable={false}
              />
              <img
                src="/projects/nlite/vite-isometric-dark.png"
                alt=""
                width={2048}
                height={2048}
                className="nlite-globe-dark absolute inset-0 h-full w-full object-contain"
                draggable={false}
              />
            </div>
          </div>
        </div>

        {/* Bottom: 4 feature columns */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4">
          {VITE_FEATURES.map((feature, index) => (
            <article
              key={feature.title}
              className={[
                "nlite-vite-cell px-5 py-10 sm:px-6 sm:py-12",
                index < 3 ? "nlite-vite-cell-r-lg" : "",
                index < 2 ? "nlite-vite-cell-b-sm" : "",
                index % 2 === 0 ? "nlite-vite-cell-r-sm" : "",
                index < 3 ? "nlite-vite-cell-b-mobile" : "",
              ].join(" ")}
            >
              <h3 className="mb-2 text-base font-semibold tracking-tight text-(--nl-fg)">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-(--nl-muted)">{feature.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
