"use server";

import { execFile } from "node:child_process";
import { createRequire } from "node:module";
import { promisify } from "node:util";
import { markImageUrl } from "@/lib/mark-images";
import { sortedMarks } from "@/lib/marks";

const memoryCache = new Map<string, string>();
const blurDataURLInflight = new Map<string, Promise<string | undefined>>();

const execFileAsync = promisify(execFile);
const require = createRequire(import.meta.url);
const WRANGLER_BIN = require.resolve("wrangler/bin/wrangler.js");
const BINDING = "MARKS_BLUR_CACHE";
const EXEC_OPTIONS = { maxBuffer: 10 * 1024 * 1024 };

async function kvGetViaWrangler(key: string) {
  try {
    const { stdout } = await execFileAsync(
      process.execPath,
      [WRANGLER_BIN, "kv", "key", "get", key, "--binding", BINDING, "--remote"],
      EXEC_OPTIONS,
    );
    return stdout.trimEnd();
  } catch {
    return null;
  }
}
async function kvPutViaWrangler(key: string, value: string) {
  await execFileAsync(
    process.execPath,
    [WRANGLER_BIN, "kv", "key", "put", key, value, "--binding", BINDING, "--remote"],
    EXEC_OPTIONS,
  );
}

async function getBlurDataURLFromKv(key: string) {
  const cached = memoryCache.get(key);
  if (cached) return cached;

  const fromKv = await kvGetViaWrangler(key);
  if (fromKv) {
    memoryCache.set(key, fromKv);
    return fromKv;
  }

  return null;
}

async function putBlurDataURLInKv(key: string, value: string) {
  memoryCache.set(key, value);
  try {
    await kvPutViaWrangler(key, value);
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
