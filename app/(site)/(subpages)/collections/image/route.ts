import { env } from "cloudflare:workers";

import { tryCatch } from "@/lib/async";
import { parseAllowedHttpUrl } from "@/lib/og/web-image";

const ONE_YEAR = 31536000;
const R2_PREFIX = "collections";

async function collectionImageR2Key(imageUrl: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(imageUrl));
  const hash = [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return `${R2_PREFIX}/${hash}`;
}

function imageResponseHeaders(contentType: string, nocache = false) {
  return {
    "Content-Type": contentType,
    "Cache-Control": nocache ? "no-store" : `public, max-age=${ONE_YEAR}, immutable`,
    "X-Robots-Tag": "noindex, nofollow",
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = parseAllowedHttpUrl(url.searchParams.get("url"));

  if (!parsed) {
    return new Response("invalid url", { status: 400 });
  }

  const imageUrl = parsed.toString();
  const nocache = url.searchParams.get("nocache") === "1";
  const cacheKey = await collectionImageR2Key(imageUrl);

  if (!nocache) {
    const cached = await tryCatch(env.MARKS_BUCKET.get(cacheKey));
    if (cached.data) {
      const contentType = cached.data.httpMetadata?.contentType ?? "application/octet-stream";
      return new Response(cached.data.body, {
        headers: imageResponseHeaders(contentType),
      });
    }
  }

  try {
    const response = await fetch(imageUrl, {
      headers: {
        Accept: "image/*",
        "User-Agent": "Mozilla/5.0 (compatible; CollectionsBot/1.0)",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      return new Response("failed to fetch image", { status: 502 });
    }

    const contentType = response.headers.get("content-type") ?? "application/octet-stream";
    if (!contentType.startsWith("image/")) {
      return new Response("not an image", { status: 415 });
    }

    const bytes = new Uint8Array(await response.arrayBuffer());

    await env.MARKS_BUCKET.put(cacheKey, bytes, {
      httpMetadata: {
        contentType,
        cacheControl: `public, max-age=${ONE_YEAR}, immutable`,
      },
      customMetadata: { sourceUrl: imageUrl },
    });

    return new Response(bytes, {
      headers: imageResponseHeaders(contentType, nocache),
    });
  } catch {
    return new Response("failed to fetch image", { status: 502 });
  }
}
