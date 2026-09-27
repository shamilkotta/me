import { DEPLOYS } from "@/lib/nlite-landing";
import { highlightNlCode } from "@/lib/nlite-highlight";
import { DeployConfigTabs } from "./deploy-config-tabs";

type Feature = {
  title: string;
  body: string;
  soon?: boolean;
};

const FEATURES: Feature[] = [
  {
    title: "React Server Components",
    body: "Async components on the server by default. Ship less JavaScript, keep data close to the source.",
  },
  {
    title: "Streaming HTML",
    body: "Progressive rendering as the tree resolves. Users see the shell while dynamic work finishes.",
  },
  {
    title: "Vite-native DX",
    body: "Instant server, HMR, and the Vite plugin graph. Wire it with defineConfig. No parallel toolchains.",
  },
  {
    title: "File-based routing",
    body: "Familiar app/ conventions: page, layout, loading, error, and nested segments.",
  },
  {
    title: "SSR & SSG",
    body: "Stream on request or prerender at build. Choose per route, or blend both with PPR.",
  },
  {
    title: "Loading & error UI",
    body: "Per-segment loading.tsx and error.tsx. Instant fallbacks while the rest of the tree streams.",
  },
  {
    title: "Server Actions",
    body: "Call server mutations from components without hand-rolled API routes.",
    soon: true,
  },
  {
    title: "Route Handlers",
    body: "HTTP endpoints beside your UI in app/api — same tree, same deploy.",
  },
  {
    title: "Nested layouts",
    body: "Share chrome across segments. Soft navigation keeps layout state where it belongs.",
  },
];

const DEPLOY_FEATURE = {
  title: "First-party deploys",
  body: "Adapters for Vercel, Cloudflare, Netlify, and any JS server ship with the framework.",
};

/** Tab order: JS server first, then hosted adapters. */
const DEPLOY_TAB_ORDER = [
  { id: "node", label: "JS Server" },
  { id: "vercel", label: "Vercel" },
  { id: "cloudflare", label: "Cloudflare" },
  { id: "netlify", label: "Netlify" },
] as const;

export async function FeaturesGrid() {
  const tabs = await Promise.all(
    DEPLOY_TAB_ORDER.map(async (tab) => {
      const deploy = DEPLOYS.find((d) => d.id === tab.id);
      if (!deploy) throw new Error(`Missing deploy config for ${tab.id}`);
      return {
        id: tab.id,
        label: tab.label,
        html: await highlightNlCode(deploy.code, "typescript"),
      };
    }),
  );

  return (
    <section id="features" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <h2 className="mb-10 max-w-xl text-3xl font-semibold tracking-tight sm:mb-12 sm:text-4xl">
          Everything you need to get started
        </h2>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-(--nl-border) bg-(--nl-border) sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const isSoon = Boolean(feature.soon);

            return (
              <article
                key={feature.title}
                className={[
                  "relative flex flex-col p-6 sm:p-7",
                  isSoon ? "bg-(--nl-surface)" : "bg-(--nl-bg)",
                ].join(" ")}
              >
                {isSoon ? (
                  <span className="mb-3 inline-flex w-fit items-center rounded-full border border-(--nl-border) bg-(--nl-bg) px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-(--nl-subtle)">
                    Coming soon
                  </span>
                ) : null}

                <h3
                  className={[
                    "mb-2 text-lg font-semibold tracking-tight",
                    isSoon ? "text-(--nl-subtle)" : "text-(--nl-fg)",
                  ].join(" ")}
                >
                  {feature.title}
                </h3>

                <p
                  className={[
                    "text-sm leading-relaxed",
                    isSoon ? "text-(--nl-subtle)" : "text-(--nl-muted)",
                  ].join(" ")}
                >
                  {feature.body}
                </p>
              </article>
            );
          })}

          <article className="relative flex flex-col justify-center bg-(--nl-bg) p-6 sm:p-7">
            <h3 className="mb-2 text-lg font-semibold tracking-tight text-(--nl-fg)">
              {DEPLOY_FEATURE.title}
            </h3>
            <p className="text-sm leading-relaxed text-(--nl-muted)">{DEPLOY_FEATURE.body}</p>
          </article>

          <div className="bg-(--nl-bg) sm:col-span-2 self-stretch">
            <DeployConfigTabs tabs={tabs} />
          </div>
        </div>
      </div>
    </section>
  );
}
