/**
 * Ambient hero field — soft glow, large dotted grid, overlapping orbits.
 * Full-bleed behind content (not a content frame).
 */
export function HeroBackdrop() {
  return (
    <div
      aria-hidden
      className="nlite-hero-backdrop pointer-events-none absolute inset-0 overflow-hidden text-[var(--nl-fg)]"
    >
      <div className="nlite-hero-glow" />

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

        {/* Large orbit — right / behind explorer */}
        <circle
          className="nlite-hero-orbit nlite-hero-orbit-a"
          cx="78%"
          cy="48%"
          fill="none"
          r="38%"
          stroke="currentColor"
          strokeDasharray="3 8"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
        />
        {/* Mid orbit — top-left bleed */}
        <circle
          className="nlite-hero-orbit nlite-hero-orbit-b"
          cx="8%"
          cy="12%"
          fill="none"
          r="32%"
          stroke="currentColor"
          strokeDasharray="2 7"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        {/* Tight orbit — bottom */}
        <circle
          className="nlite-hero-orbit nlite-hero-orbit-c"
          cx="48%"
          cy="108%"
          fill="none"
          r="22%"
          stroke="currentColor"
          strokeDasharray="2 6"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />

        {/* Crosshair at large orbit center */}
        <g className="nlite-hero-cross" stroke="currentColor" strokeWidth="1">
          <line x1="78%" x2="78%" y1="44%" y2="52%" />
          <line x1="75.2%" x2="80.8%" y1="48%" y2="48%" />
        </g>
      </svg>
    </div>
  );
}
