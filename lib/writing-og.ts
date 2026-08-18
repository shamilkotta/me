import geistFontBase64 from "@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?base64";
import { siteUrl } from "@/lib/links";

export const WRITING_OG_WIDTH = 1200;
export const WRITING_OG_HEIGHT = 630;

const domain = new URL(siteUrl).hostname;

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

function wrapTitle(title: string, fontSize: number) {
  const maxWidth = WRITING_OG_WIDTH - 80 - 360;
  const approxCharWidth = fontSize * 0.52;
  const maxChars = Math.max(12, Math.floor(maxWidth / approxCharWidth));
  const words = title.split(/\s+/);
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

  return lines;
}

function dotPatternSvg() {
  const columns = 14;
  const rows = 20;
  const dotSize = 3;
  const gap = 22;
  const originX = WRITING_OG_WIDTH - 72 - (columns * dotSize + (columns - 1) * gap);
  const originY = 96;
  const dots: string[] = [];

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const fade = 0.08 + (column / columns) * 0.14 + (row / rows) * 0.06;
      const cx = originX + column * (dotSize + gap) + dotSize / 2;
      const cy = originY + row * (dotSize + gap) + dotSize / 2;
      dots.push(
        `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(dotSize / 2).toFixed(1)}" fill="rgba(255,255,255,${fade.toFixed(2)})" />`,
      );
    }
  }

  return dots.join("");
}

export function generateWritingOgSvg(title: string, date: Date) {
  const fontSize = titleFontSize(title);
  const lines = wrapTitle(title, fontSize);
  const lineHeight = Math.round(fontSize * 1.08);
  const textBlockHeight = lines.length * lineHeight;
  const metaHeight = 22;
  const metaGap = 20;
  const domainGap = 28;
  const contentHeight = metaHeight + metaGap + textBlockHeight + domainGap + metaHeight;
  const contentTop = (WRITING_OG_HEIGHT - contentHeight) / 2;
  const titleStartY = contentTop + metaHeight + metaGap + fontSize * 0.82;
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
        font-family: "Geist";
        src: url("data:font/woff2;base64,${geistFontBase64}") format("woff2");
        font-weight: 100 900;
        font-style: normal;
      }
    </style>
  </defs>
  <rect width="100%" height="100%" fill="#0a0a0a" />
  ${dotPatternSvg()}
  <text x="80" y="${(contentTop + metaHeight).toFixed(1)}" fill="#737373" font-family="Geist, sans-serif" font-size="22" letter-spacing="-0.01em">${escapeXml(formatOgDate(date))}</text>
  <text fill="#ffffff" font-family="Geist, sans-serif" font-size="${fontSize}" font-weight="600" letter-spacing="-0.03em">${titleLines}</text>
  <text x="80" y="${(contentTop + metaHeight + metaGap + textBlockHeight + domainGap + metaHeight * 0.75).toFixed(1)}" fill="#737373" font-family="Geist, sans-serif" font-size="22" letter-spacing="-0.01em">${escapeXml(domain)}</text>
</svg>`;
}

export function writingOgImageMeta(title: string, slug: string) {
  return {
    url: `/writing/${slug}/og`,
    width: WRITING_OG_WIDTH,
    height: WRITING_OG_HEIGHT,
    alt: title,
    type: "image/png",
  } as const;
}

export function writingOgResponseHeaders() {
  return {
    "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
  };
}
