import Link from "nlite/link";
import { ViewTransition } from "react";

import { sharedName } from "@/lib/view-transition";
import type { Project } from "@/lib/content";

function hasLink(href: string) {
  return href.length > 0 && href !== "#";
}

export function ProjectRow({
  project,
  separator = " - ",
}: {
  project: Project;
  separator?: string;
}) {
  const linked = hasLink(project.href);

  const entry = (
    <>
      <span className="min-w-0">
        <ViewTransition name={sharedName("project", project.name, "name")}>
          <span className={linked ? "text-fg group-hover:text-muted" : "text-fg"}>
            {project.name}
          </span>
        </ViewTransition>
        <span className="text-muted">{separator}</span>
        <span className={linked ? "text-muted group-hover:text-muted" : "text-muted"}>
          {project.desc}
        </span>
      </span>
      {project.meta ? (
        <span
          className={
            linked
              ? "shrink-0 whitespace-nowrap text-xs text-muted group-hover:text-muted"
              : "shrink-0 whitespace-nowrap text-xs text-muted"
          }
        >
          {project.meta}
        </span>
      ) : null}
    </>
  );

  const linkedClassName =
    "group flex items-baseline justify-between gap-4 border-b border-border py-[0.45rem] text-[0.8125rem] text-inherit no-underline hover:text-muted";
  const staticClassName =
    "flex items-baseline justify-between gap-4 border-b border-border py-[0.45rem] text-[0.8125rem] text-inherit";

  if (!linked) {
    return (
      <ViewTransition name={sharedName("project", project.name)}>
        <li className={staticClassName}>{entry}</li>
      </ViewTransition>
    );
  }

  if (project.external) {
    return (
      <ViewTransition name={sharedName("project", project.name)}>
        <li>
          <a className={linkedClassName} href={project.href} rel="noreferrer" target="_blank">
            {entry}
          </a>
        </li>
      </ViewTransition>
    );
  }

  return (
    <ViewTransition name={sharedName("project", project.name)}>
      <li>
        <Link className={linkedClassName} href={project.href}>
          {entry}
        </Link>
      </li>
    </ViewTransition>
  );
}
