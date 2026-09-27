import { isPageOgKey, servePageOg } from "@/lib/og/page";

type PageOgRouteProps = {
  params: Promise<{ key: string[] }>;
};

export async function GET(_request: Request, { params }: PageOgRouteProps) {
  const { key } = await params;
  const imageKey = key.filter((k) => k !== "og").join("/");

  if (!isPageOgKey(imageKey)) {
    return new Response("Not found", { status: 404 });
  }

  return servePageOg(imageKey);
}
