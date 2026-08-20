import {
  OG_HEIGHT,
  OG_WIDTH,
  generateTitleOgSvg,
  ogContentHash,
  ogR2Key,
  ogResponseHeaders,
} from "@/lib/og/shared";
import { serveOgImage } from "@/lib/og/render";

export const WRITING_OG_TEMPLATE_VERSION = "3";

function formatOgDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export async function writingOgContentHash(title: string, date: Date) {
  return ogContentHash(WRITING_OG_TEMPLATE_VERSION, title, date.toISOString());
}

export function generateWritingOgSvg(title: string, date: Date) {
  return generateTitleOgSvg({
    idPrefix: "writing-og",
    title,
    topLabel: formatOgDate(date),
  });
}

export function writingOgImageMeta(title: string, slug: string, hash: string) {
  return {
    url: `/writing/${slug}/og?v=${hash}`,
    width: OG_WIDTH,
    height: OG_HEIGHT,
    alt: title,
    type: "image/png",
  } as const;
}

export async function serveWritingOg(slug: string, title: string, date: Date) {
  const hash = await writingOgContentHash(title, date);

  return serveOgImage({
    cacheKey: ogR2Key(`${slug}/${hash}`),
    headers: ogResponseHeaders(hash),
    generateSvg: () => generateWritingOgSvg(title, date),
    customMetadata: {
      slug,
      hash,
      title,
      date: date.toISOString(),
    },
  });
}
