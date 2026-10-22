import { CopyUrl } from "@/components/copy-url";
import { TrackPostView } from "@/components/track-post-view";
import { formatWritingDate, WritingPost } from "@/lib/content";
import { absoluteUrl, personJsonLd, siteName, siteUrl } from "@/lib/links";
import { writingOgContentHash, writingOgImageMeta } from "@/lib/og/writing";
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

export async function generateMetadata({ params }: WritingPostPageProps) {
  const { slug } = await params;
  const post = await getEntry<WritingPost>("writing", slug);

  if (!post || !post.data) {
    return {
      title: "Post not found",
    };
  }

  const description = post.data.description;
  const title = post.data.title;
  const hash = await writingOgContentHash(title, post.data.date);
  const ogImage = writingOgImageMeta(title, slug, hash);

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(`/writing/${slug}`),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/writing/${slug}`),
      type: "article",
      publishedTime: post.data.date.toISOString(),
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}

export default async function WritingPostPage({ params }: WritingPostPageProps) {
  const { slug } = await params;
  const post = await getEntry<WritingPost>("writing", slug);

  if (!post || !post.data) {
    notFound();
  }

  const url = absoluteUrl(`/writing/${slug}`);
  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.data.title,
    description: post.data.description,
    datePublished: post.data.date.toISOString(),
    author: personJsonLd,
    publisher: personJsonLd,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <TrackPostView slug={slug} />
      <header className="mb-10">
        <h1 className="text-[clamp(1.75rem,4.5vw,2.25rem)] font-bold tracking-[-0.03em]">
          {post.data.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center text-[0.8125rem] text-muted">
          <a
            className="inline-flex items-center text-inherit no-underline transition-colors hover:text-fg"
            href={siteUrl}
          >
            <img
              alt=""
              className="mr-2 size-6 shrink-0 rounded-full object-cover ring-1 ring-fg/10"
              height={24}
              src="/shamil.jpg"
              width={24}
            />
            {siteName}
          </a>
          <span aria-hidden="true" className="mx-[0.35rem]">
            ·
          </span>
          <time className="tabular-nums" dateTime={post.data.date.toISOString()}>
            {formatWritingDate(post.data.date)}
          </time>
          <span aria-hidden="true" className="mx-[0.35rem]">
            ·
          </span>
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
