import { writingByYear } from "@/lib/content";

export default function WritingPage() {
  return (
    <>
      <h1 className="mb-8 text-base font-semibold tracking-normal">writing</h1>

      {writingByYear.map((group) => (
        <div className="mb-8 last:mb-0" key={group.year}>
          <h2 className="mb-2 text-xs font-medium text-muted">{group.year}</h2>
          {group.posts.map((post) => (
            <a
              className="block border-b border-border py-[0.45rem] text-[0.8125rem] text-inherit no-underline first:border-t hover:text-muted"
              href="#"
              key={post.date + post.title}
            >
              <span className="mr-2 tabular-nums text-muted">{post.date}</span>
              {post.title}
            </a>
          ))}
        </div>
      ))}
    </>
  );
}
