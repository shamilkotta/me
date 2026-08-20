import { fetchOgImage, parseAllowedHttpUrl } from "@/lib/og/web-image";

export async function GET(request: Request) {
  const parsed = parseAllowedHttpUrl(new URL(request.url).searchParams.get("url"));

  if (!parsed) {
    return Response.json({ error: "invalid url" }, { status: 400 });
  }

  try {
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
