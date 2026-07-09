export type NavLink = {
  href: string;
  label: string;
  external?: boolean;
};

export type SiteNavVariant = "home" | "section" | "writing-post";

export const pageLinks: NavLink[] = [
  { href: "/writing", label: "writing" },
  // { href: "/talks", label: "talks" },
  { href: "/projects", label: "projects" },
  { href: "/marks", label: "marks" },
];

export const sectionNavLinks: NavLink[] = [{ href: "/", label: "home" }, ...pageLinks];

export const writingPostNavLinks: NavLink[] = [
  pageLinks[0],
  { href: "/", label: "home" },
  ...pageLinks.slice(1),
];

export const contactEmail = "hello@shamilkotta.com";

export const socialLinks: NavLink[] = [
  { href: "https://github.com/shamilkotta", label: "github", external: true },
  { href: "https://x.com/shamilkotta", label: "twitter", external: true },
  { href: "https://linkedin.com/in/shamilkotta", label: "linkedin", external: true },
  { href: "/marks", label: "marks" },
];

export function navLinksForVariant(variant: SiteNavVariant): NavLink[] {
  switch (variant) {
    case "section":
      return sectionNavLinks;
    case "writing-post":
      return writingPostNavLinks;
    default:
      return socialLinks;
  }
}

export function navLinkWithArrow(variant: SiteNavVariant): string | null {
  switch (variant) {
    case "section":
      return "home";
    case "writing-post":
      return "writing";
    default:
      return null;
  }
}
