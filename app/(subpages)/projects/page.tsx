import Link from "nlite/link";

import { projects } from "@/lib/content";

export default function ProjectsPage() {
  return (
    <>
      <h1 className="mb-8 text-base font-semibold tracking-normal">projects</h1>

      {projects.map((project) => {
        const entry = (
          <>
            <span className="min-w-0">
              <span className="text-fg group-hover:text-muted">{project.name}</span>
              <span className="text-muted before:content-['—\u00a0'] group-hover:text-muted">
                {project.desc}
              </span>
            </span>
            <span className="shrink-0 whitespace-nowrap text-xs text-muted group-hover:text-muted">
              {project.meta}
            </span>
          </>
        );

        const className =
          "group flex items-baseline justify-between gap-4 border-b border-border py-[0.45rem] text-[0.8125rem] text-inherit no-underline first:border-t hover:text-muted";

        if (project.external) {
          return (
            <a className={className} href={project.href} key={project.name}>
              {entry}
            </a>
          );
        }

        return (
          <Link className={className} href={project.href} key={project.name}>
            {entry}
          </Link>
        );
      })}
    </>
  );
}
