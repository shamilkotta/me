import { CopyUrl } from "@/components/copy-url";
import { WritingPost } from "@/lib/content";
import { getEntry, getCollection } from "nlite/mdx";

type WritingPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return (await getCollection<WritingPost>("writing")).map((post) => ({ slug: post.slug }));
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function WritingPostPage({ params }: WritingPostPageProps) {
  const { slug } = await params;
  const post = await getEntry<WritingPost>("writing", slug);

  if (!post || !post.data) {
    return (
      <>
        <p className="mb-4 text-sm text-muted">post not found.</p>
      </>
    );
  }

  return (
    <>
      <header className="mb-8 border-b border-border pb-8 text-center">
        <h1 className="mb-2 text-[clamp(1.375rem,4vw,1.875rem)] font-bold">{post.data.title}</h1>
        <div className="flex justify-center gap-2 items-center">
          <p className="text-xs tabular-nums text-muted">{formatDate(post.data.date)}</p>
          <span className="mr-[0.35rem] text-muted">·</span>
          <CopyUrl />
        </div>
      </header>

      <article className="writing-content">
        <post.Content />
      </article>
    </>
  );
}
