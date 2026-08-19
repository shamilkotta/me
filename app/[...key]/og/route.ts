import { isPageOgKey } from "@/lib/page-og";
import { servePageOg } from "@/lib/page-og-handler";

type PageOgRouteProps = {
  params: Promise<{ key: string[] }>;
};

export async function GET(_request: Request, { params }: PageOgRouteProps) {
  const { key } = await params;

  if (key.length !== 1 || !isPageOgKey(key[0])) {
    return new Response("Not found", { status: 404 });
  }

  return servePageOg(key[0]);
}
