import { OG_HEIGHT, OG_WIDTH, generateTitleOgSvg, ogContentHash } from "./shared";

export const WRITING_OG_TEMPLATE_VERSION = "3";

function formatOgDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
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

export function writingOgImagePath(slug: string, hash: string) {
  return `/og/writing/${slug}-${hash}.png` as const;
}

export function writingOgImageMeta(title: string, slug: string, hash: string) {
  return {
    url: writingOgImagePath(slug, hash),
    width: OG_WIDTH,
    height: OG_HEIGHT,
    alt: title,
    type: "image/png",
  } as const;
}
