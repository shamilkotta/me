import geistFontBase64 from "@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?base64";
import { siteUrl } from "@/lib/links";

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export const TITLE_LEFT_PADDING = 80;
export const TITLE_RIGHT_INSET_RATIO = 0.15;
export const TITLE_MAX_LINES = 2;
export const TITLE_ELLIPSIS = "…";
export const OG_R2_PREFIX = "og";

export const domain = new URL(siteUrl).hostname;
export const geistFontFamily = "Geist";

export function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function titleFontSize(title: string) {
  if (title.length <= 42) return 64;
  if (title.length <= 72) return 52;
  if (title.length <= 110) return 44;
  return 38;
}

function titleMaxChars(fontSize: number) {
  const maxWidth = OG_WIDTH * (1 - TITLE_RIGHT_INSET_RATIO) - TITLE_LEFT_PADDING;
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

export function wrapTitle(title: string, fontSize: number) {
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

export function dotPatternBackgroundSvg(idPrefix: string) {
  return `<rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="url(#${idPrefix}-dots)" mask="url(#${idPrefix}-dot-mask)" />`;
}

export function ogSvgDefs(idPrefix: string) {
  return `
    <style>
      @font-face {
        font-family: "${geistFontFamily}";
        src: url("data:font/woff2;base64,${geistFontBase64}") format("woff2");
        font-weight: 100 900;
        font-style: normal;
      }
    </style>
    <pattern id="${idPrefix}-dots" width="16" height="16" patternUnits="userSpaceOnUse">
      <circle cx="8" cy="8" r="1.1" fill="rgba(255,255,255,0.2)" />
    </pattern>
    <linearGradient id="${idPrefix}-dot-fade" x1="0" y1="0" x2="${OG_WIDTH}" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="white" stop-opacity="0" />
      <stop offset="0.4" stop-color="white" stop-opacity="0" />
      <stop offset="0.68" stop-color="white" stop-opacity="0.45" />
      <stop offset="1" stop-color="white" stop-opacity="1" />
    </linearGradient>
    <mask id="${idPrefix}-dot-mask">
      <rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="url(#${idPrefix}-dot-fade)" />
    </mask>`;
}

export function titleLinesSvg(lines: string[], fontSize: number, startY: number) {
  const lineHeight = Math.round(fontSize * 0.96);
  return lines
    .map((line, index) => {
      const y = startY + index * lineHeight;
      return `<tspan x="${TITLE_LEFT_PADDING}" y="${y.toFixed(1)}">${escapeXml(line)}</tspan>`;
    })
    .join("");
}

export function textBlockHeight(fontSize: number, lineCount: number) {
  const lineHeight = Math.round(fontSize * 0.96);
  return (lineCount - 1) * lineHeight + fontSize;
}

const META_HEIGHT = 22;
const TITLE_DOMAIN_GAP = 16;
const TOP_LABEL_GAP = 12;

type TitleOgSvgOptions = {
  idPrefix: string;
  title: string;
  topLabel?: string;
};

export function generateTitleOgSvg({ idPrefix, title, topLabel }: TitleOgSvgOptions) {
  const fontSize = titleFontSize(title);
  const lines = wrapTitle(title, fontSize);
  const lineCount = Math.min(lines.length, TITLE_MAX_LINES);
  const blockHeight = textBlockHeight(fontSize, lineCount);
  const topSectionHeight = topLabel ? META_HEIGHT + TOP_LABEL_GAP : 0;
  const contentHeight = topSectionHeight + blockHeight + TITLE_DOMAIN_GAP + META_HEIGHT;
  const contentTop = (OG_HEIGHT - contentHeight) / 2;
  const titleStartY = contentTop + topSectionHeight + fontSize * 0.82;
  const titleLines = titleLinesSvg(lines, fontSize, titleStartY);
  const domainY =
    contentTop + topSectionHeight + blockHeight + TITLE_DOMAIN_GAP + META_HEIGHT * 0.75;

  const topLabelSvg = topLabel
    ? `<text x="${TITLE_LEFT_PADDING}" y="${(contentTop + META_HEIGHT).toFixed(1)}" fill="#737373" font-family="${geistFontFamily}, sans-serif" font-size="22" letter-spacing="-0.01em">${escapeXml(topLabel)}</text>`
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${OG_WIDTH}" height="${OG_HEIGHT}" viewBox="0 0 ${OG_WIDTH} ${OG_HEIGHT}">
  <defs>
    ${ogSvgDefs(idPrefix)}
  </defs>
  <rect width="100%" height="100%" fill="#0a0a0a" />
  ${dotPatternBackgroundSvg(idPrefix)}
  ${topLabelSvg}
  <text fill="#ffffff" font-family="${geistFontFamily}, sans-serif" font-size="${fontSize}" font-weight="600" letter-spacing="-0.03em">${titleLines}</text>
  <text x="${TITLE_LEFT_PADDING}" y="${domainY.toFixed(1)}" fill="#737373" font-family="${geistFontFamily}, sans-serif" font-size="22" letter-spacing="-0.01em">${escapeXml(domain)}</text>
</svg>`;
}

export async function ogContentHash(templateVersion: string, ...parts: string[]) {
  const payload = [templateVersion, ...parts].join("\n");
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(payload));
  return [...new Uint8Array(digest)]
    .slice(0, 8)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function ogResponseHeaders(hash: string) {
  return {
    "Cache-Control": "public, max-age=31536000, immutable",
    ETag: `"${hash}"`,
    "Content-Type": "image/png",
  };
}

export function ogR2Key(key: string) {
  return `${OG_R2_PREFIX}/${key}.png`;
}
