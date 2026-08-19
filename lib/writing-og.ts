import geistFontBase64 from "@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?base64";
import { siteUrl } from "@/lib/links";

export const WRITING_OG_WIDTH = 1200;
export const WRITING_OG_HEIGHT = 630;
export const WRITING_OG_R2_PREFIX = "writing-og";
export const WRITING_OG_TEMPLATE_VERSION = "3";

const domain = new URL(siteUrl).hostname;
const geistFontFamily = "Geist";
const TITLE_LEFT_PADDING = 80;
const TITLE_RIGHT_INSET_RATIO = 0.15;
const TITLE_MAX_LINES = 2;
const TITLE_ELLIPSIS = "…";

function formatOgDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function titleFontSize(title: string) {
  if (title.length <= 42) return 64;
  if (title.length <= 72) return 52;
  if (title.length <= 110) return 44;
  return 38;
}

function titleMaxChars(fontSize: number) {
  const maxWidth = WRITING_OG_WIDTH * (1 - TITLE_RIGHT_INSET_RATIO) - TITLE_LEFT_PADDING;
  const approxCharWidth = fontSize * 0.52;
  return Math.max(12, Math.floor(maxWidth / approxCharWidth));
}

function truncateWithEllipsis(text: string, maxChars: number) {
  if (text.length <= maxChars) return text;

  const limit = maxChars - TITLE_ELLIPSIS.length;
  if (limit <= 0) return TITLE_ELLIPSIS;

  let trimmed = text.slice(0, limit).trimEnd();
  const lastSpace = trimmed.lastIndexOf(" ");
  if (lastSpace > limit * 0.5) {
    trimmed = trimmed.slice(0, lastSpace);
  }

  return `${trimmed}${TITLE_ELLIPSIS}`;
}

function wrapTitle(title: string, fontSize: number) {
  const maxChars = titleMaxChars(fontSize);
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];

  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) {
    lines.push(current);
  }

  if (lines.length <= TITLE_MAX_LINES) {
    return lines.map((line) =>
      line.length > maxChars ? truncateWithEllipsis(line, maxChars) : line,
    );
  }

  return [lines[0], truncateWithEllipsis(lines.slice(1).join(" "), maxChars)];
}

function dotPatternBackgroundSvg() {
  return `<rect width="${WRITING_OG_WIDTH}" height="${WRITING_OG_HEIGHT}" fill="url(#writing-og-dots)" mask="url(#writing-og-dot-mask)" />`;
}

export async function writingOgContentHash(title: string, date: Date) {
  const payload = `${WRITING_OG_TEMPLATE_VERSION}\n${title}\n${date.toISOString()}`;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(payload));
  return [...new Uint8Array(digest)]
    .slice(0, 8)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function writingOgR2Key(slug: string, hash: string) {
  return `${WRITING_OG_R2_PREFIX}/${slug}/${hash}.png`;
}

export function generateWritingOgSvg(title: string, date: Date) {
  const fontSize = titleFontSize(title);
  const lines = wrapTitle(title, fontSize);
  const lineHeight = Math.round(fontSize * 0.96);
  const lineCount = Math.min(lines.length, TITLE_MAX_LINES);
  const textBlockHeight = (lineCount - 1) * lineHeight + fontSize;
  const metaHeight = 22;
  const dateTitleGap = 12;
  const titleDomainGap = 16;
  const contentHeight = metaHeight + dateTitleGap + textBlockHeight + titleDomainGap + metaHeight;
  const contentTop = (WRITING_OG_HEIGHT - contentHeight) / 2;
  const titleStartY = contentTop + metaHeight + dateTitleGap + fontSize * 0.82;
  const titleLines = lines
    .map((line, index) => {
      const y = titleStartY + index * lineHeight;
      return `<tspan x="80" y="${y.toFixed(1)}">${escapeXml(line)}</tspan>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WRITING_OG_WIDTH}" height="${WRITING_OG_HEIGHT}" viewBox="0 0 ${WRITING_OG_WIDTH} ${WRITING_OG_HEIGHT}">
  <defs>
    <style>
      @font-face {
        font-family: "${geistFontFamily}";
        src: url("data:font/woff2;base64,${geistFontBase64}") format("woff2");
        font-weight: 100 900;
        font-style: normal;
      }
    </style>
    <pattern id="writing-og-dots" width="16" height="16" patternUnits="userSpaceOnUse">
      <circle cx="8" cy="8" r="1.1" fill="rgba(255,255,255,0.2)" />
    </pattern>
    <linearGradient id="writing-og-dot-fade" x1="0" y1="0" x2="${WRITING_OG_WIDTH}" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="white" stop-opacity="0" />
      <stop offset="0.4" stop-color="white" stop-opacity="0" />
      <stop offset="0.68" stop-color="white" stop-opacity="0.45" />
      <stop offset="1" stop-color="white" stop-opacity="1" />
    </linearGradient>
    <mask id="writing-og-dot-mask">
      <rect width="${WRITING_OG_WIDTH}" height="${WRITING_OG_HEIGHT}" fill="url(#writing-og-dot-fade)" />
    </mask>
  </defs>
  <rect width="100%" height="100%" fill="#0a0a0a" />
  ${dotPatternBackgroundSvg()}
  <text x="80" y="${(contentTop + metaHeight).toFixed(1)}" fill="#737373" font-family="${geistFontFamily}, sans-serif" font-size="22" letter-spacing="-0.01em">${escapeXml(formatOgDate(date))}</text>
  <text fill="#ffffff" font-family="${geistFontFamily}, sans-serif" font-size="${fontSize}" font-weight="600" letter-spacing="-0.03em">${titleLines}</text>
  <text x="80" y="${(contentTop + metaHeight + dateTitleGap + textBlockHeight + titleDomainGap + metaHeight * 0.75).toFixed(1)}" fill="#737373" font-family="${geistFontFamily}, sans-serif" font-size="22" letter-spacing="-0.01em">${escapeXml(domain)}</text>
</svg>`;
}

export function writingOgImageMeta(title: string, slug: string, hash: string) {
  return {
    url: `/writing/${slug}/og?v=${hash}`,
    width: WRITING_OG_WIDTH,
    height: WRITING_OG_HEIGHT,
    alt: title,
    type: "image/png",
  } as const;
}

export function writingOgResponseHeaders(hash: string) {
  return {
    "Cache-Control": "public, max-age=31536000, immutable",
    ETag: `"${hash}"`,
    "Content-Type": "image/png",
  };
}
