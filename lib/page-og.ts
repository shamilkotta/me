import type { Metadata } from "nlite";
import {
  OG_HEIGHT,
  OG_WIDTH,
  TITLE_LEFT_PADDING,
  TITLE_MAX_LINES,
  domain,
  dotPatternBackgroundSvg,
  escapeXml,
  geistFontFamily,
  ogResponseHeaders,
  ogSvgDefs,
  textBlockHeight,
  titleFontSize,
  titleLinesSvg,
  wrapTitle,
} from "@/lib/og-shared";

export const PAGE_OG_R2_PREFIX = "page-og";
export const PAGE_OG_TEMPLATE_VERSION = "1";

const PAGE_OG_ID_PREFIX = "page-og";

export const PAGE_OG_KEYS = ["writing", "projects", "marks", "collections"] as const;
export type PageOgKey = (typeof PAGE_OG_KEYS)[number];

export const PAGE_OG_CONFIG: Record<PageOgKey, { title: string; path: `/${string}` }> = {
  writing: { title: "Writing", path: "/writing" },
  projects: { title: "Projects", path: "/projects" },
  marks: { title: "Marks", path: "/marks" },
  collections: { title: "Collections", path: "/collections" },
};

export function isPageOgKey(key: string): key is PageOgKey {
  return PAGE_OG_KEYS.includes(key as PageOgKey);
}

export function pageOgR2Key(key: PageOgKey) {
  return `${PAGE_OG_R2_PREFIX}/${key}.png`;
}

export function generatePageOgSvg(title: string) {
  const fontSize = titleFontSize(title);
  const lines = wrapTitle(title, fontSize);
  const lineCount = Math.min(lines.length, TITLE_MAX_LINES);
  const blockHeight = textBlockHeight(fontSize, lineCount);
  const metaHeight = 22;
  const titleDomainGap = 16;
  const contentHeight = blockHeight + titleDomainGap + metaHeight;
  const contentTop = (OG_HEIGHT - contentHeight) / 2;
  const titleStartY = contentTop + fontSize * 0.82;
  const titleLines = titleLinesSvg(lines, fontSize, titleStartY);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${OG_WIDTH}" height="${OG_HEIGHT}" viewBox="0 0 ${OG_WIDTH} ${OG_HEIGHT}">
  <defs>
    ${ogSvgDefs(PAGE_OG_ID_PREFIX)}
  </defs>
  <rect width="100%" height="100%" fill="#0a0a0a" />
  ${dotPatternBackgroundSvg(PAGE_OG_ID_PREFIX)}
  <text fill="#ffffff" font-family="${geistFontFamily}, sans-serif" font-size="${fontSize}" font-weight="600" letter-spacing="-0.03em">${titleLines}</text>
  <text x="${TITLE_LEFT_PADDING}" y="${(contentTop + blockHeight + titleDomainGap + metaHeight * 0.75).toFixed(1)}" fill="#737373" font-family="${geistFontFamily}, sans-serif" font-size="22" letter-spacing="-0.01em">${escapeXml(domain)}</text>
</svg>`;
}

export function pageOgImageMeta(key: PageOgKey) {
  const { title } = PAGE_OG_CONFIG[key];

  return {
    url: `/og/${key}`,
    width: OG_WIDTH,
    height: OG_HEIGHT,
    alt: title,
    type: "image/png",
  } as const;
}

export function pageOgResponseHeaders(key: PageOgKey) {
  return ogResponseHeaders(`${key}-${PAGE_OG_TEMPLATE_VERSION}`);
}

export function buildPageOgMetadata(
  key: PageOgKey,
  extra?: Pick<Metadata, "robots">,
): Metadata {
  const { title, path } = PAGE_OG_CONFIG[key];
  const image = pageOgImageMeta(key);

  return {
    title,
    ...extra,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      url: path,
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      images: [image.url],
    },
  };
}
