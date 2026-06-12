import { markImageUrl } from "@/lib/mark-images";
import MARKS from "../marks.json";

export type MarkImage = {
  key: string;
  blurDataURL?: string;
};

export type Mark = {
  slug: string;
  date: Date;
  caption: string;
  body?: string;
  location?: string;
  images?: MarkImage[];
};

export function formatMarkDate(date: Date) {
  return date
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    .toLowerCase();
}

export function formatMarkDateShort(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toLowerCase();
}

export function sortedMarks() {
  return [...MARKS]
    .map((mark) => ({
      ...mark,
      date: new Date(mark.date),
      images: mark.images?.map((key) => ({ key })),
    }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function markCover(mark: Mark) {
  return mark.images?.[0];
}

export function hasImages(mark: Mark) {
  return (mark.images?.length ?? 0) > 0;
}

const blurDataURLCache = new Map<string, Promise<string | undefined>>();

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }
  return btoa(binary);
}

async function getBlurDataURL(imageKey: string) {
  const cached = blurDataURLCache.get(imageKey);
  if (cached) return cached;

  const promise = fetch(markImageUrl(imageKey, "placeholder", { grayscale: true }), {
    cache: "force-cache",
  })
    .then(async (response) => {
      if (!response.ok) return undefined;

      const contentType = response.headers.get("content-type") ?? "image/jpeg";
      const bytes = new Uint8Array(await response.arrayBuffer());
      return `data:${contentType};base64,${bytesToBase64(bytes)}`;
    })
    .catch(() => undefined);

  blurDataURLCache.set(imageKey, promise);
  return promise;
}

export async function sortedMarksWithBlurDataURL() {
  const marks = sortedMarks();

  return Promise.all(
    marks.map(async (mark) => ({
      ...mark,
      images: await Promise.all(
        (mark.images ?? []).map(async (image) => ({
          ...image,
          blurDataURL: await getBlurDataURL(image.key),
        })),
      ),
    })),
  );
}
