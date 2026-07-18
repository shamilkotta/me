import { isValidPostSlug, trackPostView } from "@/lib/post-views";

export async function POST(request: Request) {
  let slug: unknown;

  try {
    const body = (await request.json()) as { slug?: unknown };
    slug = body.slug;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  if (typeof slug !== "string" || !isValidPostSlug(slug)) {
    return new Response("Invalid slug", { status: 400 });
  }

  await trackPostView(request, slug);

  return new Response(null, {
    status: 204,
    headers: {
      "cache-control": "no-store",
    },
  });
}
