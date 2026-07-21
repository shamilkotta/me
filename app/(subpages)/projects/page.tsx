import Link from "nlite/link";

import { PROJECTS } from "@/lib/content";
import { SiteNav } from "@/components/site-nav";

export const metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <>
      <SiteNav className="mb-10" variant="section" />
      <h1 className="mb-8 text-base font-semibold tracking-normal">projects</h1>

      <ul className="list-none">
        {PROJECTS.map((project) => {
          const entry = (
            <>
              <span className="min-w-0">
                <span className="text-fg group-hover:text-muted">{project.name}</span>
                <span className="text-muted"> - </span>
                <span className="text-muted group-hover:text-muted">{project.desc}</span>
              </span>
              <span className="shrink-0 whitespace-nowrap text-xs text-muted group-hover:text-muted">
                {project.meta}
              </span>
            </>
          );

          const className =
            "group flex items-baseline justify-between gap-4 border-b border-border py-[0.45rem] text-[0.8125rem] text-inherit no-underline hover:text-muted";

          if (project.external) {
            return (
              <li key={project.name}>
                <a className={className} href={project.href} target="_blank">
                  {entry}
                </a>
              </li>
            );
          }

          return (
            <li key={project.name}>
              <Link className={className} href={project.href}>
                {entry}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
