import { env } from "cloudflare:workers";

const ONE_YEAR = 31536000;

function numberParam(searchParams: URLSearchParams, key: string) {
  const value = searchParams.get(key);
  if (!value) return undefined;

  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

export async function GET(r: Request, context: { params: Promise<{ key: string[] }> }) {
  const { key } = await context.params;
  const image = await env.MARKS_BUCKET.get(`${key.join("/")}`);

  if (!image) {
    return new Response("Not found", { status: 404 });
  }

  const url = new URL(r.url);
  const searchParams = url.searchParams;
  const transformed = await env.IMAGES.input(image.body)
    .transform({
      width: numberParam(searchParams, "width"),
      height: numberParam(searchParams, "height"),
      fit: searchParams.get("fit") as "contain" | "cover" | "scale-down" | undefined,
      blur: numberParam(searchParams, "blur"),
      saturation: numberParam(searchParams, "saturation"),
    })
    .output({ format: "image/webp", quality: numberParam(searchParams, "quality") });

  const response = transformed.response();
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", `public, max-age=${ONE_YEAR}, immutable`);

  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}
