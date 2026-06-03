import Link from "nlite/link";

import { Signature } from "@/components/signature";
import { SiteNav } from "@/components/site-nav";
import { WORK, writingList, PROJECTS, TIMELINE } from "@/lib/content";

export default async function HomePage() {
  const writings = await writingList(5);

  return (
    <>
      <div className="mb-4 mt-2 w-fit relative flex gap-3">
        <h1 className="text-[clamp(1.75rem,5vw,2.25rem)] font-bold tracking-[-0.03em]">shamil</h1>
        {/* <Signature className="block h-14 w-auto text-muted" /> */}
      </div>
      <p className="mb-4 text-[0.8125rem] text-muted [&_strong]:font-medium [&_strong]:text-fg">
        software engineer · currently <strong>looking for opportunities</strong>
      </p>
      <SiteNav className="mb-8" />

      <section className="mb-10">
        <p className="mb-4 text-base font-semibold">hi!</p>
        <p className="mb-3 text-sm">
          I build, break, and refine. love to build for developers, care about developer and ai
          experience. driven by curiosity.
        </p>
        <p className="mb-3 text-sm">
          worked across the stack, building everything from user facing applications to systems that
          power automation workflows, e - commerce and much more. now exploring what's next.
        </p>
        <p className="text-[0.8125rem] text-muted [&_a]:text-inherit [&_a]:underline [&_a]:underline-offset-2">
          i hang out on{" "}
          <a href="https://x.com/shamilkotta" target="_blank">
            x (twitter)
          </a>{" "}
          — hit me up, my dms are open.
        </p>
      </section>

      <ul className="mb-10 list-none  border-border pb-10">
        {TIMELINE.map((item, index) => (
          <li
            className="relative mb-[0.65rem] pl-4 text-[0.8125rem] before:absolute before:left-0 before:text-muted before:content-['•'] [&_em]:font-semibold [&_em]:not-italic"
            key={index}
          >
            {item}
          </li>
        ))}
      </ul>

      <section className="mb-10">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 className="text-[0.6875rem] font-normal uppercase tracking-[0.12em] text-muted">
            work
          </h2>
        </div>
        <ul className="list-none">
          {WORK.map((job) => (
            <li
              className="group flex items-baseline justify-between gap-4 border-b border-border py-[0.45rem] text-[0.8125rem] text-inherit no-underline"
              key={job.role}
            >
              <span className="min-w-0">
                <span className="text-fg">{job.role}</span>
              </span>
              <span className="shrink-0 whitespace-nowrap text-xs text-muted">{job.period}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 className="text-[0.6875rem] font-normal uppercase tracking-[0.12em] text-muted">
            projects
          </h2>
          <Link
            className="text-xs normal-case tracking-normal text-muted no-underline hover:text-fg"
            href="/projects"
          >
            more →
          </Link>
        </div>
        <ul className="list-none">
          {PROJECTS.slice(0, 3).map((project) => (
            <li key={project.name}>
              <a
                className="group flex items-baseline justify-between gap-4 border-b border-border py-[0.45rem] text-[0.8125rem] text-inherit no-underline hover:text-muted"
                href={project.href}
                target="_blank"
              >
                <span className="min-w-0">
                  <span className="text-fg group-hover:text-muted">{project.name}</span>
                  <span className="text-muted"> — </span>
                  <span className="text-muted group-hover:text-muted">{project.desc}</span>
                  {project.name == "nlite" && (
                    <a
                      href="https://github.com/shamilkotta/me"
                      target="_blank"
                      className="text-muted/70 font-bold italic hover:text-fg"
                    >
                      {" "}
                      (powers this site)
                    </a>
                  )}
                </span>
                <span className="shrink-0 whitespace-nowrap text-xs text-muted group-hover:text-muted">
                  {project.meta}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 className="text-[0.6875rem] font-normal uppercase tracking-[0.12em] text-muted">
            writing
          </h2>
          <Link
            className="text-xs normal-case tracking-normal text-muted no-underline hover:text-fg"
            href="/writing"
          >
            all →
          </Link>
        </div>
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
      </section>
    </>
  );
}
