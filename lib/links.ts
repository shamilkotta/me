export type NavLink = {
  href: string;
  label: string;
  external?: boolean;
};

export const pageLinks: NavLink[] = [
  { href: "/writing", label: "writing" },
  { href: "/talks", label: "talks" },
  { href: "/projects", label: "projects" },
];

export const contactEmail = "hello@shamilkotta.com";

export const socialLinks: NavLink[] = [
  { href: "https://github.com/shamilkotta", label: "github", external: true },
  { href: "https://x.com/shamilkotta", label: "twitter", external: true },
  { href: "https://linkedin.com/in/shamilkotta", label: "linkedin", external: true },
];
