import { CopyUrl } from "@/components/copy-url";
import { WritingPost } from "@/lib/content";
import { getEntry, getCollection } from "nlite/mdx";
import { notFound } from "nlite/navigation";

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

export async function generateMetadata({ params }: WritingPostPageProps) {
  const { slug } = await params;
  const post = await getEntry<WritingPost>("writing", slug);

  if (!post || !post.data) {
    return {
      title: "Post not found",
    };
  }

  return {
    title: post.data.title,
    description: post.data.description,
  };
}

export default async function WritingPostPage({ params }: WritingPostPageProps) {
  const { slug } = await params;
  const post = await getEntry<WritingPost>("writing", slug);

  if (!post || !post.data) {
    return notFound();
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

      <article className="writing-content prose max-w-none font-mono text-fg prose-headings:font-bold prose-headings:tracking-tight prose-a:font-normal prose-pre:p-0 prose-pre:m-0 prose-pre:bg-transparent">
        <post.Content />
      </article>
    </>
  );
}
