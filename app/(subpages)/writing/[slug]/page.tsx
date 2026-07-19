import { CopyUrl } from "@/components/copy-url";
import { TrackPostView } from "@/components/track-post-view";
import { WritingPost } from "@/lib/content";
import Link from "nlite/link";
import { getEntry, getCollection } from "nlite/mdx";
import { notFound } from "nlite/navigation";
import { ComponentProps } from "react";

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
      <TrackPostView slug={slug} />
      <header className="mb-8 border-b border-border pb-8 text-center">
        <h1 className="mb-2 text-[clamp(1.375rem,4vw,1.875rem)] font-bold">{post.data.title}</h1>
        <div className="flex justify-center gap-2 items-center">
          <p className="text-xs tabular-nums text-muted">{formatDate(post.data.date)}</p>
          <span className="mr-[0.35rem] text-muted">·</span>
          <CopyUrl />
        </div>
      </header>

      <article className="writing-content prose max-w-none font-mono text-fg prose-headings:font-bold prose-headings:tracking-tight prose-a:font-normal prose-pre:p-0 prose-pre:m-0 prose-pre:bg-transparent">
        <post.Content components={{ a: MdxLink }} />
      </article>
    </>
  );
}

function MdxLink({ href, children, ...props }: ComponentProps<"a">) {
  const external = !href || href.startsWith("http://") || href.startsWith("https://");

  if (!external) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} {...props} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
