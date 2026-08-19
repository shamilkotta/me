import {
  OG_HEIGHT,
  OG_WIDTH,
  TITLE_LEFT_PADDING,
  TITLE_MAX_LINES,
  domain,
  dotPatternBackgroundSvg,
  escapeXml,
  geistFontFamily,
  ogContentHash,
  ogResponseHeaders,
  ogSvgDefs,
  textBlockHeight,
  titleFontSize,
  titleLinesSvg,
  wrapTitle,
} from "@/lib/og-shared";

export const WRITING_OG_WIDTH = OG_WIDTH;
export const WRITING_OG_HEIGHT = OG_HEIGHT;
export const WRITING_OG_R2_PREFIX = "writing-og";
export const WRITING_OG_TEMPLATE_VERSION = "3";

const WRITING_OG_ID_PREFIX = "writing-og";

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

export function writingOgR2Key(slug: string, hash: string) {
  return `${WRITING_OG_R2_PREFIX}/${slug}/${hash}.png`;
}

export function generateWritingOgSvg(title: string, date: Date) {
  const fontSize = titleFontSize(title);
  const lines = wrapTitle(title, fontSize);
  const lineCount = Math.min(lines.length, TITLE_MAX_LINES);
  const blockHeight = textBlockHeight(fontSize, lineCount);
  const metaHeight = 22;
  const dateTitleGap = 12;
  const titleDomainGap = 16;
  const contentHeight = metaHeight + dateTitleGap + blockHeight + titleDomainGap + metaHeight;
  const contentTop = (OG_HEIGHT - contentHeight) / 2;
  const titleStartY = contentTop + metaHeight + dateTitleGap + fontSize * 0.82;
  const titleLines = titleLinesSvg(lines, fontSize, titleStartY);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${OG_WIDTH}" height="${OG_HEIGHT}" viewBox="0 0 ${OG_WIDTH} ${OG_HEIGHT}">
  <defs>
    ${ogSvgDefs(WRITING_OG_ID_PREFIX)}
  </defs>
  <rect width="100%" height="100%" fill="#0a0a0a" />
  ${dotPatternBackgroundSvg(WRITING_OG_ID_PREFIX)}
  <text x="${TITLE_LEFT_PADDING}" y="${(contentTop + metaHeight).toFixed(1)}" fill="#737373" font-family="${geistFontFamily}, sans-serif" font-size="22" letter-spacing="-0.01em">${escapeXml(formatOgDate(date))}</text>
  <text fill="#ffffff" font-family="${geistFontFamily}, sans-serif" font-size="${fontSize}" font-weight="600" letter-spacing="-0.03em">${titleLines}</text>
  <text x="${TITLE_LEFT_PADDING}" y="${(contentTop + metaHeight + dateTitleGap + blockHeight + titleDomainGap + metaHeight * 0.75).toFixed(1)}" fill="#737373" font-family="${geistFontFamily}, sans-serif" font-size="22" letter-spacing="-0.01em">${escapeXml(domain)}</text>
</svg>`;
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

export function writingOgResponseHeaders(hash: string) {
  return ogResponseHeaders(hash);
}
