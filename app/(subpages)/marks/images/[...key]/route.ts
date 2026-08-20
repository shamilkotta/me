import { env } from "cloudflare:workers";

const ONE_YEAR = 31536000;

function numberParam(searchParams: URLSearchParams, key: string) {
  const value = searchParams.get(key);
  if (!value) return undefined;

  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }
  return btoa(binary);
}

const blurDataURLKey = (imageKey: string) => `blur:${imageKey}`;

async function transformImage(body: ReadableStream, searchParams: URLSearchParams) {
  return env.IMAGES.input(body)
    .transform({
      width: numberParam(searchParams, "width"),
      height: numberParam(searchParams, "height"),
      fit: searchParams.get("fit") as "contain" | "cover" | "scale-down" | undefined,
      blur: numberParam(searchParams, "blur"),
      saturation: numberParam(searchParams, "saturation"),
    })
    .output({ format: "image/webp", quality: numberParam(searchParams, "quality") });
}

export async function GET(r: Request, context: { params: Promise<{ key: string[] }> }) {
  const { key } = await context.params;
  const imageKey = key.join("/");
  const url = new URL(r.url);
  const searchParams = url.searchParams;
  const wantsBlurDataURL = searchParams.get("blurDataURL") === "1";
  const nocache = searchParams.get("nocache") === "1";
  const kvKey = blurDataURLKey(imageKey);

  if (wantsBlurDataURL) {
    if (!nocache) {
      const cached = await env.MARKS_BLUR_CACHE.get(kvKey);
      if (cached) {
        return new Response(cached, {
          headers: {
            "content-type": "text/plain;charset=utf-8",
            "cache-control": `public, max-age=${ONE_YEAR}, immutable`,
          },
        });
      }
    }

    const image = await env.MARKS_BUCKET.get(imageKey);
    if (!image) {
      return new Response("Not found", { status: 404 });
    }

    const transformed = await transformImage(image.body, searchParams);
    const response = transformed.response();
    const contentType = response.headers.get("content-type") ?? "image/webp";
    const bytes = new Uint8Array(await response.arrayBuffer());
    const blurDataURL = `data:${contentType};base64,${bytesToBase64(bytes)}`;

    await env.MARKS_BLUR_CACHE.put(kvKey, blurDataURL);

    return new Response(blurDataURL, {
      headers: {
        "content-type": "text/plain;charset=utf-8",
        "cache-control": nocache ? "no-store" : `public, max-age=${ONE_YEAR}, immutable`,
      },
    });
  }

  const image = await env.MARKS_BUCKET.get(imageKey);
  if (!image) {
    return new Response("Not found", { status: 404 });
  }

  const transformed = await transformImage(image.body, searchParams);
  const response = transformed.response();
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", `public, max-age=${ONE_YEAR}, immutable`);

  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}
