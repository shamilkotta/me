import { WritingPost } from "@/lib/content";
import {
  generateWritingOgSvg,
  writingOgContentHash,
  writingOgR2Key,
  writingOgResponseHeaders,
} from "@/lib/writing-og";
import { getEntry } from "nlite/mdx";
import { env } from "cloudflare:workers";

type WritingOgRouteProps = {
  params: Promise<{ slug: string }>;
};

async function renderWritingOgPng(title: string, date: Date) {
  const svg = generateWritingOgSvg(title, date);
  const transformed = await env.IMAGES.input(new Blob([svg], { type: "image/svg+xml" })).output({
    format: "image/png",
  });
  const response = transformed.response();
  return new Uint8Array(await response.arrayBuffer());
}

export async function GET(_request: Request, { params }: WritingOgRouteProps) {
  const { slug } = await params;
  const post = await getEntry<WritingPost>("writing", slug);

  if (!post?.data) {
    return new Response("Not found", { status: 404 });
  }

  const { title, date } = post.data;
  const hash = await writingOgContentHash(title, date);
  const cacheKey = writingOgR2Key(slug, hash);
  const headers = writingOgResponseHeaders(hash);

  const cached = await env.MARKS_BUCKET.get(cacheKey);
  if (cached) {
    return new Response(cached.body, { headers });
  }

  try {
    const png = await renderWritingOgPng(title, date);

    await env.MARKS_BUCKET.put(cacheKey, png, {
      httpMetadata: {
        contentType: "image/png",
        cacheControl: headers["Cache-Control"],
      },
      customMetadata: {
        slug,
        hash,
        title,
        date: date.toISOString(),
      },
    });

    return new Response(png, { headers });
  } catch {
    const svg = generateWritingOgSvg(title, date);

    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
        ETag: `"${hash}"`,
      },
    });
  }
}
