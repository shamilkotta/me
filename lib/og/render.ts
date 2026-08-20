import { env } from "cloudflare:workers";
import { tryCatch } from "../async";

export async function svgToPng(svg: string) {
  const transformed = await env.IMAGES.input(
    new Blob([svg], { type: "image/svg+xml" }).stream(),
  ).output({
    format: "image/png",
  });
  const response = transformed.response();
  return new Uint8Array(await response.arrayBuffer());
}

type ServeOgImageOptions = {
  cacheKey: string;
  headers: Record<string, string>;
  generateSvg: () => string;
  customMetadata?: Record<string, string>;
};

export async function serveOgImage({
  cacheKey,
  headers,
  generateSvg,
  customMetadata = {},
}: ServeOgImageOptions) {
  const result = await tryCatch(env.MARKS_BUCKET.get(cacheKey));
  if (result.data) {
    return new Response(result.data.body, { headers });
  }

  const svg = generateSvg();

  try {
    const png = await svgToPng(svg);

    await env.MARKS_BUCKET.put(cacheKey, png, {
      httpMetadata: {
        contentType: "image/png",
        cacheControl: headers["Cache-Control"],
      },
      customMetadata,
    });

    return new Response(png, { headers });
  } catch {
    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
        ...(headers.ETag ? { ETag: headers.ETag } : {}),
      },
    });
  }
}
