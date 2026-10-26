import { ViewTransition } from "react";
import Link from "nlite/link";

import { SiteNav } from "@/components/site-nav";
import { writingList } from "@/lib/content";
import { sharedName } from "@/lib/view-transition";
import { buildPageOgMetadata } from "@/lib/og/page";

export const metadata = buildPageOgMetadata("writing");

export default async function WritingPage() {
  const writings = await writingList();

  return (
    <>
      <SiteNav className="mb-10" variant="section" />
      <ViewTransition name={sharedName("heading", "writing")}>
        <h1 className="mb-8 w-fit text-base font-semibold tracking-normal">writing</h1>
      </ViewTransition>

      {/* <ul className="list-none">
        {writings.map((group) => (
          <li className="mb-8 last:mb-0" key={group.year}>
            <h2 className="mb-2 text-xs font-medium text-muted">{group.year}</h2>
            <ul className="list-none">
              {group.posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    className="block border-b border-border py-[0.45rem] text-[0.8125rem] text-inherit no-underline hover:text-muted"
                    href={`/writing/${post.slug}`}
                  >
                    <span className="mr-2 tabular-nums text-muted">{post.date}</span>
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul> */}

      <ul className="list-none">
        {writings.map((writing) => (
          <li key={writing.slug}>
            <Link
              className="block border-b border-border py-[0.45rem] text-[0.8125rem] text-inherit no-underline hover:text-muted"
              href={`/writing/${writing.slug}`}
            >
              <ViewTransition name={sharedName("post-date", writing.slug)}>
                <span className="mr-1 inline-block min-w-26 tabular-nums text-muted">
                  {writing.date}
                </span>
              </ViewTransition>
              <ViewTransition name={sharedName("post-title", writing.slug)}>
                <span className="inline-block">{writing.title}</span>
              </ViewTransition>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
