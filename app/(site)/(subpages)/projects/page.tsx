import { PROJECTS } from "@/lib/content";
import { ProjectRow } from "@/components/project-row";
import { SiteNav } from "@/components/site-nav";
import { buildPageOgMetadata } from "@/lib/og/page";

export const metadata = buildPageOgMetadata("projects");

export default function ProjectsPage() {
  return (
    <>
      <SiteNav className="mb-10" variant="section" />
      <h1 className="mb-8 text-base font-semibold tracking-normal">projects</h1>

      <ul className="list-none">
        {PROJECTS.map((project) => (
          <ProjectRow key={project.name} project={project} />
        ))}
      </ul>
    </>
  );
}
