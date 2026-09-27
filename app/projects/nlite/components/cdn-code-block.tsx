import type { ReactNode } from "react";

import { highlightNlCode } from "@/lib/nlite-highlight";
import { CodeFrame } from "./code-frame";

const SKELETON_MARK = "__NLITE_SKELETON__";

const CDN_CODE = `export default function Page() {
  return (
    <main>
      <h1>Posts</h1>
      <Suspense>
        ${SKELETON_MARK}
      </Suspense>
    </main>
  );
}`;

function StreamSkeleton() {
  return (
    <div className="nlite-stream-skeleton flex items-center py-1.5" aria-hidden>
      <span className="nlite-stream-skeleton-gutter tabular-nums">6</span>
      <div className="flex w-[7.5rem] flex-col gap-1.5 pl-[8ch]">
        <span className="h-1.5 w-full rounded-sm bg-(--nl-code-line)/45" />
        <span className="h-1.5 w-[82%] rounded-sm bg-(--nl-code-line)/35" />
        <span className="h-1.5 w-[64%] rounded-sm bg-(--nl-code-line)/25" />
      </div>
    </div>
  );
}

/** Split a shiki HTML doc on the line that contains `mark`, keeping valid pre/code wrappers. */
function splitShikiAroundMark(html: string, mark: string): { top: string; bottom: string } | null {
  const preOpen = html.match(/<pre\b[^>]*>\s*<code\b[^>]*>/i)?.[0];
  if (!preOpen) return null;

  const markIdx = html.indexOf(mark);
  if (markIdx < 0) return null;

  const openIdx = html.lastIndexOf('<span class="line"', markIdx);
  if (openIdx < 0) return null;

  let i = html.indexOf(">", openIdx) + 1;
  let depth = 1;
  let closeIdx = -1;
  while (i < html.length && depth > 0) {
    const nextOpen = html.indexOf("<span", i);
    const nextClose = html.indexOf("</span>", i);
    if (nextClose < 0) break;
    if (nextOpen >= 0 && nextOpen < nextClose) {
      depth += 1;
      i = nextOpen + 5;
      continue;
    }
    depth -= 1;
    i = nextClose + 7;
    if (depth === 0) closeIdx = i;
  }
  if (closeIdx < 0) return null;

  return {
    top: `${html.slice(0, openIdx)}</code></pre>`,
    bottom: `${preOpen}${html.slice(closeIdx)}`,
  };
}

export async function CdnCodeBlock({
  className = "",
  badge,
}: {
  className?: string;
  badge?: {
    label: string;
    icon: ReactNode;
  };
}) {
  const html = await highlightNlCode(CDN_CODE);
  const parts = splitShikiAroundMark(html, SKELETON_MARK);

  if (!parts) {
    // Fallback: full block without inset
    return (
      <CodeFrame
        html={html.replaceAll(SKELETON_MARK, "<Posts />")}
        filename="page.tsx"
        className={className}
        badge={badge}
      />
    );
  }

  return (
    <CodeFrame filename="page.tsx" className={className} badge={badge}>
      <div
        className="nl-code nl-code-tight-bottom"
        dangerouslySetInnerHTML={{ __html: parts.top }}
      />
      <StreamSkeleton />
      <div
        className="nl-code nl-code-tight-top nl-code-from-6"
        dangerouslySetInnerHTML={{ __html: parts.bottom }}
      />
    </CodeFrame>
  );
}
