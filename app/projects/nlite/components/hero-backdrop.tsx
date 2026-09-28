/**
 * Ambient hero field — large dotted grid and secondary orbits.
 * Full-bleed behind content (not a content frame).
 * Large orbit around the explorer lives on the page, not here.
 */
export function HeroBackdrop() {
  return (
    <div
      aria-hidden
      className="nlite-hero-backdrop pointer-events-none absolute inset-0 overflow-hidden text-[var(--nl-fg)]"
    >
      <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="nl-hero-grid"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
            patternTransform="translate(0.5 0.5)"
          >
            <path
              className="nlite-hero-grid-stroke"
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke="currentColor"
              strokeDasharray="2 6"
              strokeWidth="1"
            />
          </pattern>
          <radialGradient id="nl-hero-grid-fade" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="55%" stopColor="white" stopOpacity="0.55" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="nl-hero-grid-mask">
            <rect width="100%" height="100%" fill="url(#nl-hero-grid-fade)" />
          </mask>
        </defs>

        <rect width="100%" height="100%" fill="url(#nl-hero-grid)" mask="url(#nl-hero-grid-mask)" />

        {/* Mid orbit — top-left bleed */}
        {/* <circle
          className="nlite-hero-orbit nlite-hero-orbit-b"
          cx="8%"
          cy="12%"
          fill="none"
          r="32%"
          stroke="currentColor"
          strokeDasharray="2 7"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        /> */}
        {/* Tight orbit — bottom */}
        {/* <circle
          className="nlite-hero-orbit nlite-hero-orbit-c"
          cx="48%"
          cy="108%"
          fill="none"
          r="22%"
          stroke="currentColor"
          strokeDasharray="2 6"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        /> */}
      </svg>
    </div>
  );
}
