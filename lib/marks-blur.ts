"use server";

import { markImageUrl } from "@/lib/mark-images";
import { sortedMarks } from "@/lib/marks";
import { env } from "cloudflare:workers";

const memoryCache = new Map<string, string>();
const blurDataURLInflight = new Map<string, Promise<string | undefined>>();

async function getBlurDataURLFromKv(key: string) {
  const cached = memoryCache.get(key);
  if (cached) return cached;

  const fromKv = await env.MARKS_BLUR_CACHE.get(key);
  if (fromKv) {
    memoryCache.set(key, fromKv);
    return fromKv;
  }

  return null;
}

async function putBlurDataURLInKv(key: string, value: string) {
  memoryCache.set(key, value);
  try {
    await env.MARKS_BLUR_CACHE.put(key, value);
  } catch {}
}

const blurDataURLKey = (imageKey: string) => `blur:${imageKey}`;

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }
  return btoa(binary);
}

async function getBlurDataURL(imageKey: string, options = { cache: true }) {
  const kvKey = blurDataURLKey(imageKey);
  const cached = options.cache ? await getBlurDataURLFromKv(kvKey) : false;
  if (cached) return cached;

  const inflight = blurDataURLInflight.get(imageKey);
  if (inflight) return inflight;

  const promise = fetch(markImageUrl(imageKey, "placeholder", { grayscale: true }), {
    cache: "force-cache",
  })
    .then(async (response) => {
      if (!response.ok) return undefined;

      const contentType = response.headers.get("content-type") ?? "image/jpeg";
      const bytes = new Uint8Array(await response.arrayBuffer());
      const blurDataURL = `data:${contentType};base64,${bytesToBase64(bytes)}`;
      await putBlurDataURLInKv(kvKey, blurDataURL);
      return blurDataURL;
    })
    .catch(() => undefined)
    .finally(() => {
      blurDataURLInflight.delete(imageKey);
    });

  blurDataURLInflight.set(imageKey, promise);
  return promise;
}

export async function sortedMarksWithBlurDataURL(options = { cache: true }) {
  const marks = sortedMarks();

  return Promise.all(
    marks.map(async (mark) => ({
      ...mark,
      images: await Promise.all(
        (mark.images ?? []).map(async (image) => ({
          ...image,
          blurDataURL: await getBlurDataURL(image.key, options),
        })),
      ),
    })),
  );
}
