import { fetchOgImage } from "@/lib/og-image";

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url");

  if (!url) {
    return Response.json({ error: "missing url" }, { status: 400 });
  }

  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return Response.json({ error: "invalid url" }, { status: 400 });
    }

    const imageUrl = await fetchOgImage(parsed.toString());

    return Response.json(
      { imageUrl },
      {
        headers: {
          "Cache-Control": "public, max-age=86400",
        },
      },
    );
  } catch {
    return Response.json({ imageUrl: null });
  }
}
