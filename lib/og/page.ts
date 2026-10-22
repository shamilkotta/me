import type { Metadata } from "nlite";
import { OG_HEIGHT, OG_WIDTH, generateTitleOgSvg } from "./shared";
import { absoluteUrl } from "../links";

export const PAGE_OG_TEMPLATE_VERSION = "1";

export const PAGE_OG_KEYS = ["writing", "projects", "marks", "collections"] as const;
export type PageOgKey = (typeof PAGE_OG_KEYS)[number];

export const PAGE_OG_CONFIG: Record<
  PageOgKey,
  { title: string; path: `/${string}`; description: string }
> = {
  writing: {
    title: "Writing",
    path: "/writing",
    description: "Writing by shamil, a software engineer building for developers.",
  },
  projects: {
    title: "Projects",
    path: "/projects",
    description:
      "Projects by shamil: nlite, a React 19 framework on Vite, plus developer tools, npm packages, and apps.",
  },
  marks: {
    title: "Marks",
    path: "/marks",
    description: "Marks: photos and places collected by shamil.",
  },
  collections: {
    title: "Collections",
    path: "/collections",
    description: "Collections: design and developer resources curated by shamil.",
  },
};

export function isPageOgKey(key: string): key is PageOgKey {
  return PAGE_OG_KEYS.includes(key as PageOgKey);
}

export function generatePageOgSvg(title: string) {
  return generateTitleOgSvg({ idPrefix: "page-og", title });
}

export function pageOgImagePath(key: PageOgKey) {
  return `/og/${key}-v${PAGE_OG_TEMPLATE_VERSION}.png` as const;
}

export function pageOgImageMeta(key: PageOgKey) {
  const { title } = PAGE_OG_CONFIG[key];

  return {
    url: pageOgImagePath(key),
    width: OG_WIDTH,
    height: OG_HEIGHT,
    alt: title,
    type: "image/png",
  } as const;
}

export function buildPageOgMetadata(key: PageOgKey, extra?: Pick<Metadata, "robots">): Metadata {
  const { title, path, description } = PAGE_OG_CONFIG[key];
  const image = pageOgImageMeta(key);

  return {
    title,
    description,
    ...extra,
    alternates: {
      canonical: absoluteUrl(path),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}
