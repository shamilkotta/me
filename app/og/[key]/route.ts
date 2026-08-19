import { env } from "cloudflare:workers";
import {
  PAGE_OG_CONFIG,
  generatePageOgSvg,
  isPageOgKey,
  pageOgR2Key,
  pageOgResponseHeaders,
} from "@/lib/page-og";

type PageOgRouteProps = {
  params: Promise<{ key: string }>;
};

async function renderPageOgPng(title: string) {
  const svg = generatePageOgSvg(title);
  const transformed = await env.IMAGES.input(new Blob([svg], { type: "image/svg+xml" })).output({
    format: "image/png",
  });
  const response = transformed.response();
  return new Uint8Array(await response.arrayBuffer());
}

export async function GET(_request: Request, { params }: PageOgRouteProps) {
  const { key } = await params;

  if (!isPageOgKey(key)) {
    return new Response("Not found", { status: 404 });
  }

  const { title } = PAGE_OG_CONFIG[key];
  const cacheKey = pageOgR2Key(key);
  const headers = pageOgResponseHeaders(key);

  const cached = await env.MARKS_BUCKET.get(cacheKey);
  if (cached) {
    return new Response(cached.body, { headers });
  }

  try {
    const png = await renderPageOgPng(title);

    await env.MARKS_BUCKET.put(cacheKey, png, {
      httpMetadata: {
        contentType: "image/png",
        cacheControl: headers["Cache-Control"],
      },
      customMetadata: {
        key,
        title,
      },
    });

    return new Response(png, { headers });
  } catch {
    const svg = generatePageOgSvg(title);

    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
        ETag: headers.ETag,
      },
    });
  }
}
