import Link from "nlite/link";

import { projectsPreview, talksPreview, writingPreview } from "@/lib/content";

const timeline = [
  <>
    shipped first production app at <em>16</em>
  </>,
  <>
    built an open-source cli with <em>10k+ downloads</em> at <em>19</em>
  </>,
  <>
    led backend for <em>50k concurrent users</em> at <em>22</em>
  </>,
  <>
    contributed to <em>3 major oss projects</em> in devtools
  </>,
  <>
    deep-diving into <em>systems programming</em> and <em>ai infra</em>
  </>,
];

const work = [
  { role: "senior software engineer — acme corp", period: "2024 — now" },
  { role: "software engineer — startup inc", period: "2021 — 2024" },
  { role: "intern — big tech co", period: "2020" },
];

export default function HomePage() {
  const writingByYear = writingPreview();
  const talks = talksPreview();
  const projects = projectsPreview();

  return (
    <div className="mx-auto max-w-[640px] px-6 pb-16 pt-12 text-fg">
      <h1 className="mb-2 text-[clamp(1.75rem,5vw,2.25rem)] font-bold tracking-[-0.03em]">
        shamil
      </h1>
      <p className="mb-8 text-[0.8125rem] text-muted [&_strong]:font-medium [&_strong]:text-fg">
        software engineer · currently <strong>@ acme corp</strong>
      </p>

      <section className="mb-10">
        <p className="mb-4 text-base font-semibold">hi !</p>
        <p className="mb-3 text-sm">
          i build software — mostly developer tools and backend systems. the unglamorous parts that
          make everything else fast.
        </p>
        <p className="mb-3 text-sm">
          i used to lead infra at a series b startup. before that, an internship at big tech got me
          hooked on distributed systems.
        </p>
        <p className="text-[0.8125rem] text-muted [&_a]:text-inherit [&_a]:underline [&_a]:underline-offset-2">
          i hang out on <a href="#">x (twitter)</a> — hit me up, my dms are open.
        </p>
      </section>

      <ul className="mb-10 list-none border-b border-border pb-10">
        {timeline.map((item, index) => (
          <li
            className="relative mb-[0.65rem] pl-4 text-[0.8125rem] before:absolute before:left-0 before:text-muted before:content-['•'] [&_em]:font-semibold [&_em]:not-italic"
            key={index}
          >
            {item}
          </li>
        ))}
      </ul>

      <section className="mb-10">
        <h2 className="text-[0.6875rem] font-normal uppercase tracking-[0.12em] text-muted">
          work
        </h2>
        <ul className="list-none">
          {work.map((job) => (
            <li
              className="flex justify-between gap-4 border-b border-border py-2 text-[0.8125rem] first:border-t"
              key={job.role}
            >
              <span>{job.role}</span>
              <span className="shrink-0 whitespace-nowrap text-xs text-muted">{job.period}</span>
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
        {writingByYear.map((group) => (
          <div className="mb-6 last:mb-0" key={group.year}>
            <h3 className="mb-2 text-xs font-medium text-muted">{group.year}</h3>
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
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 className="text-[0.6875rem] font-normal uppercase tracking-[0.12em] text-muted">
            talks
          </h2>
          <Link
            className="text-xs normal-case tracking-normal text-muted no-underline hover:text-fg"
            href="/talks"
          >
            all →
          </Link>
        </div>
        {talks.map((talk) => (
          <a
            className="block border-b border-border py-[0.45rem] text-[0.8125rem] text-inherit no-underline first:border-t hover:text-muted"
            href="#"
            key={talk.date}
          >
            <span className="mr-1 inline-block min-w-[6.5rem] tabular-nums text-muted">
              {talk.date}
            </span>
            {talk.title}
          </a>
        ))}
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
            all →
          </Link>
        </div>
        {projects.map((project) => (
          <a
            className="group flex items-baseline justify-between gap-4 border-b border-border py-[0.45rem] text-[0.8125rem] text-inherit no-underline first:border-t hover:text-muted"
            href={project.href}
            key={project.name}
          >
            <span className="min-w-0">
              <span className="text-fg group-hover:text-muted">{project.name}</span>
              <span className="text-muted before:content-['—\u00a0'] group-hover:text-muted">
                {project.desc}
              </span>
            </span>
            <span className="shrink-0 whitespace-nowrap text-xs text-muted group-hover:text-muted">
              {project.meta}
            </span>
          </a>
        ))}
      </section>

      <footer className="mt-12 flex flex-wrap justify-between gap-4 border-t border-border pt-8 text-xs text-muted [&_a]:text-muted [&_a]:no-underline [&_a]:hover:text-fg">
        <span>© 2026 shamil kotta</span>
        <span>
          <a href="#">github</a> · <a href="#">twitter</a> · <a href="#">email</a>
        </span>
      </footer>
    </div>
  );
}
