import { parseAllowedHttpUrl } from "@/lib/og/web-image";

export async function GET(request: Request) {
  const parsed = parseAllowedHttpUrl(new URL(request.url).searchParams.get("url"));

  if (!parsed) {
    return new Response("invalid url", { status: 400 });
  }

  try {
    const response = await fetch(parsed.toString(), {
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

    return new Response(response.body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new Response("failed to fetch image", { status: 502 });
  }
}
