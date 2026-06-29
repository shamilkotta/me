import Link from "nlite/link";

import { SiteNav } from "@/components/site-nav";
import { writingList } from "@/lib/content";

export const metadata = {
  title: "Writing",
};

export default async function WritingPage() {
  const writings = await writingList();

  return (
    <>
      <SiteNav className="mb-10" variant="section" />
      <h1 className="mb-8 text-base font-semibold tracking-normal">writing</h1>

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
              <span className="mr-1 inline-block min-w-26 tabular-nums text-muted">
                {writing.date}
              </span>
              {writing.title}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
