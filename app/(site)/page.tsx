import { ViewTransition } from "react";
import type { Metadata } from "nlite";
import Link from "nlite/link";

import { SiteNav } from "@/components/site-nav";
import { ProjectRow } from "@/components/project-row";
import { ThemeToggle } from "@/components/theme-toggle";
import { WORK, writingList, PROJECTS, TIMELINE } from "@/lib/content";
import { sharedName } from "@/lib/view-transition";
import { githubUrl, homeTitle, siteDescription, siteUrl, xUrl } from "@/lib/links";

export const metadata: Metadata = {
  title: { absolute: homeTitle },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "shamil",
  url: `${siteUrl}/`,
  image: `${siteUrl}/shamil.jpg`,
  jobTitle: "software engineer",
  description: siteDescription,
  sameAs: [githubUrl, xUrl],
};

export default async function HomePage() {
  const writings = await writingList(5);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <div className="mb-4 mt-2 w-fit relative ">
        <h1 className="text-[clamp(1.75rem,5vw,2.25rem)] font-bold tracking-[-0.03em]">
          shamil
          <span className="ml-1.5">
            <ThemeToggle />
          </span>
        </h1>
        <p className="mb-4 text-[0.8125rem] -mt-1 text-muted [&_strong]:font-medium [&_strong]:text-fg">
          software engineer · currently <strong>looking for opportunities</strong>
        </p>
      </div>
      <SiteNav className="mb-8" />

      <section className="mb-10">
        <p className="mb-4 text-base font-semibold">hi!</p>
        <p className="mb-3 text-sm">
          i build, break, and refine. love to build for developers, care about developer and ai
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
                <span className="text-muted"> — </span>
                <span className="text-muted">{job.company}</span>
              </span>
              <span className="shrink-0 whitespace-nowrap text-xs text-muted">{job.period}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <ViewTransition name={sharedName("heading", "projects")}>
            <h2 className="text-[0.6875rem] font-normal uppercase tracking-[0.12em] text-muted">
              projects
            </h2>
          </ViewTransition>
          <Link
            className="text-xs normal-case tracking-normal text-muted no-underline hover:text-fg"
            href="/projects"
          >
            more →
          </Link>
        </div>
        <ul className="list-none">
          {PROJECTS.slice(0, 4).map((project) => (
            <ProjectRow key={project.name} project={project} separator=" — " />
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <ViewTransition name={sharedName("heading", "writing")}>
            <h2 className="text-[0.6875rem] font-normal uppercase tracking-[0.12em] text-muted">
              writing
            </h2>
          </ViewTransition>
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
      </section>
    </>
  );
}
