import type { ReactNode } from "react";
import type { BundledLanguage } from "shiki";

import { highlightNlCode, langFromFilename } from "@/lib/nlite-highlight";
import { CodeFrame } from "./code-frame";

export async function CodeBlock({
  code,
  filename,
  lang,
  className = "",
  badge,
}: {
  code: string;
  filename?: string;
  lang?: BundledLanguage;
  className?: string;
  badge?: {
    label: string;
    icon: ReactNode;
  };
}) {
  const html = await highlightNlCode(code, lang ?? langFromFilename(filename));
  return <CodeFrame html={html} filename={filename} className={className} badge={badge} />;
}
