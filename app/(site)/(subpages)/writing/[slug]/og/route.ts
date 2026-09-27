import { WritingPost } from "@/lib/content";
import { serveWritingOg } from "@/lib/og/writing";
import { getEntry } from "nlite/mdx";

type WritingOgRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: WritingOgRouteProps) {
  const { slug } = await params;
  const post = await getEntry<WritingPost>("writing", slug);

  if (!post?.data) {
    return new Response("Not found", { status: 404 });
  }

  const { title, date } = post.data;
  return serveWritingOg(slug, title, date);
}
