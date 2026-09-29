import { NLITE } from "@/lib/nlite-landing";
import { CopyCommand } from "./copy-command";

const press =
  "transition-[transform,opacity,border-color,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]";
const hoverFine = "[@media(hover:hover)_and_(pointer:fine)]:hover:";

export function FinalCta() {
  return (
    <section id="get-started" className="scroll-mt-20 " aria-labelledby="nlite-final-cta-heading">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-5 py-24 text-center sm:px-8 sm:py-32">
        <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.22em] text-(--nl-subtle)">
          Get started
        </p>
        <h2
          id="nlite-final-cta-heading"
          className="mb-10 max-w-2xl text-[clamp(2.5rem,6vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.045em]"
        >
          Ship on Vite.
          <br />
          Keep the{" "}
          <code className="mx-0.5 inline-flex items-center rounded-xl border border-(--nl-border) bg-(--nl-surface) px-[0.35em] py-[0.08em] font-mono text-[0.72em] font-medium tracking-normal text-(--nl-fg)">
            app/
          </code>{" "}
          you know.
        </h2>

        <div className="flex w-full max-w-xl flex-col items-center gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-3">
          <div className="w-full sm:w-auto sm:min-w-[22rem] sm:max-w-md">
            <CopyCommand command={NLITE.install} />
          </div>
          <div className="flex shrink-0 flex-wrap justify-center gap-3">
            <a
              href={NLITE.docs}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex h-10 items-center rounded-full bg-(--nl-fg) px-5 text-sm font-medium text-(--nl-bg)! ${press} ${hoverFine}opacity-90`}
            >
              Docs
            </a>
            <a
              href={NLITE.github}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex h-10 items-center rounded-full border border-(--nl-border) bg-(--nl-surface) px-5 text-sm font-medium text-(--nl-fg)! ${press} ${hoverFine}border-(--nl-border-strong) ${hoverFine}bg-(--nl-surface-2)`}
            >
              GitHub
              <span aria-hidden className="ml-1.5">
                ↗
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
