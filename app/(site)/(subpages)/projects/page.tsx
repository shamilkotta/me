import { ViewTransition } from "react";
import { PROJECTS } from "@/lib/content";
import { ProjectRow } from "@/components/project-row";
import { SiteNav } from "@/components/site-nav";
import { sharedName } from "@/lib/view-transition";
import { buildPageOgMetadata } from "@/lib/og/page";

export const metadata = buildPageOgMetadata("projects");

export default function ProjectsPage() {
  return (
    <>
      <SiteNav className="mb-10" variant="section" />
      <ViewTransition name={sharedName("heading", "projects")}>
        <h1 className="mb-8 w-fit text-base font-semibold tracking-normal">projects</h1>
      </ViewTransition>

      <ul className="list-none">
        {PROJECTS.map((project) => (
          <ProjectRow key={project.name} project={project} />
        ))}
      </ul>
    </>
  );
}
