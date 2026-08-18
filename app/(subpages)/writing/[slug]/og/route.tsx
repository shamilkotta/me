import { WritingPost } from "@/lib/content";
import { generateWritingOgSvg, writingOgResponseHeaders } from "@/lib/writing-og";
import { getEntry } from "nlite/mdx";
import { env } from "cloudflare:workers";

type WritingOgRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: WritingOgRouteProps) {
  const { slug } = await params;
  const post = await getEntry<WritingPost>("writing", slug);

  if (!post?.data) {
    return new Response("Not found", { status: 404 });
  }

  const svg = generateWritingOgSvg(post.data.title, post.data.date);

  try {
    const transformed = await env.IMAGES.input(new Blob([svg], { type: "image/svg+xml" })).output({
      format: "image/png",
    });
    const response = transformed.response();
    const headers = new Headers(response.headers);
    headers.set("Cache-Control", writingOgResponseHeaders()["Cache-Control"]);

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch {
    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        ...writingOgResponseHeaders(),
      },
    });
  }
}
