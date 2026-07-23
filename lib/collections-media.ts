import type { CollectionItem, CollectionType } from "@/lib/collections";

const IMAGE_EXTENSIONS = /\.(avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i;

const OG_FETCH_TYPES: CollectionType[] = ["website", "article", "library", "component"];

function isDirectImageUrl(url: string) {
  try {
    return IMAGE_EXTENSIONS.test(new URL(url).pathname);
  } catch {
    return false;
  }
}

export function resolveItemImageUrl(item: CollectionItem) {
  if (item.imageUrl) return item.imageUrl;
  if (item.type === "image" && item.url) return item.url;
  if (item.url && isDirectImageUrl(item.url)) return item.url;
  return null;
}

export function shouldFetchOgImage(item: CollectionItem) {
  if (resolveItemImageUrl(item)) return false;
  if (!item.url) return false;
  if (isDirectImageUrl(item.url)) return false;
  return OG_FETCH_TYPES.includes(item.type) || item.type === "other";
}

const ogImageCache = new Map<string, string | null>();
const ogImageRequests = new Map<string, Promise<string | null>>();

export function getCachedOgImage(url: string) {
  return ogImageCache.get(url);
}

export async function fetchOgImageForItem(url: string) {
  if (ogImageCache.has(url)) {
    return ogImageCache.get(url) ?? null;
  }

  const pending = ogImageRequests.get(url);
  if (pending) return pending;

  const request = (async () => {
    const response = await fetch(`/collections/og?url=${encodeURIComponent(url)}`);
    if (!response.ok) return null;

    const data = (await response.json()) as { imageUrl?: string | null };
    const imageUrl = data.imageUrl ?? null;
    ogImageCache.set(url, imageUrl);
    return imageUrl;
  })().finally(() => {
    ogImageRequests.delete(url);
  });

  ogImageRequests.set(url, request);
  return request;
}
