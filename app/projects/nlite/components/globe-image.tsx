import { cn } from "cn";

/** Static COBE export — light/dark swap via html.dark / prefers-color-scheme. */
export function GlobeImage({ className = "" }: { className?: string }) {
  return (
    <div className={cn("relative aspect-square w-full max-w-[380px]", className)} aria-hidden>
      <img
        src="/projects/nlite/globe-light.png"
        alt=""
        width={2048}
        height={2048}
        className="nlite-globe-light h-full w-full"
        draggable={false}
      />
      <img
        src="/projects/nlite/globe-dark.png"
        alt=""
        width={2048}
        height={2048}
        className="nlite-globe-dark absolute inset-0 h-full w-full"
        draggable={false}
      />
    </div>
  );
}
