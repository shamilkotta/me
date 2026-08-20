import type { Metadata } from "nlite";
import {
  OG_HEIGHT,
  OG_WIDTH,
  generateTitleOgSvg,
  ogR2Key,
  ogResponseHeaders,
} from "@/lib/og/shared";
import { serveOgImage } from "@/lib/og/render";

export const PAGE_OG_TEMPLATE_VERSION = "1";

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

export function generatePageOgSvg(title: string) {
  return generateTitleOgSvg({ idPrefix: "page-og", title });
}

export function pageOgImageMeta(key: PageOgKey) {
  const { title } = PAGE_OG_CONFIG[key];

  return {
    url: `/${key}/og`,
    width: OG_WIDTH,
    height: OG_HEIGHT,
    alt: title,
    type: "image/png",
  } as const;
}

export function pageOgResponseHeaders(key: PageOgKey) {
  return ogResponseHeaders(`${key}-${PAGE_OG_TEMPLATE_VERSION}`);
}

export function buildPageOgMetadata(key: PageOgKey, extra?: Pick<Metadata, "robots">): Metadata {
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

export async function servePageOg(key: PageOgKey) {
  const { title } = PAGE_OG_CONFIG[key];

  return serveOgImage({
    cacheKey: ogR2Key(key),
    headers: pageOgResponseHeaders(key),
    generateSvg: () => generatePageOgSvg(title),
    customMetadata: { key, title },
  });
}
