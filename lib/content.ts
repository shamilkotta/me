import { getCollection } from "nlite/mdx";

export type Project = {
  href: string;
  name: string;
  desc: string;
  meta: string;
  external?: boolean;
};

export const PROJECTS: Project[] = [
  {
    href: "https://npmx.dev/package/nlite",
    name: "nlite",
    desc: "a attempt to create a lite react 19 framework",
    meta: "",
    external: true,
  },
  {
    href: "https://dotlet.app",
    name: "dotlet",
    desc: "make your environment portable",
    meta: "",
    external: true,
  },
  {
    href: "https://github.com/shamilkotta/git-sync",
    name: "git-sync",
    desc: "obsidian plugin for syncing the vault with git",
    meta: "",
    external: true,
  },
  {
    href: "https://rlist.app",
    name: "rlist",
    desc: "your digital library, simplified",
    meta: "",
    external: true,
  },
  {
    href: "https://npmx.dev/package/zshi",
    name: "zshi",
    desc: "light intelligence in your zsh",
    meta: "",
    external: true,
  },
  {
    href: "https://npmx.dev/package/@shamilkotta/rn-drag-resize",
    name: "rn-drag-resize",
    desc: "draggable, resizable component for react native",
    meta: "",
    external: true,
  },
  {
    href: "https://github.com/shamilkotta/quick-switch",
    name: "quick-switch",
    desc: "quick tab search extension for Chrome",
    meta: "",
    external: true,
  },
  {
    href: "https://npmx.dev/package/@shamilkotta/ghcp",
    name: "ghcp",
    desc: "download a file or subdirectory from a private/public github link.",
    meta: "",
    external: true,
  },
];

export const WORK = [
  { role: "software engineer — 75way technologies", period: "jan, 24 — feb, 26" },
  {
    role: "intern — 75way technologies",
    period: "jun, 23 — jan, 24",
  },
  { role: "freelance software engineer — self", period: "nov, 22 - jun, 23" },
];

export type WritingPost = {
  title: string;
  slug: string;
  date: Date;
  description: string;
};

export function formatWritingDate(date: Date) {
  return date
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    .toLowerCase();
}

export async function writingList(count?: number) {
  const writings = await getCollection<WritingPost>("writing");

  return writings
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .slice(0, count ?? writings.length)
    .map((writing) => ({
      title: writing.data.title,
      slug: writing.slug,
      date: formatWritingDate(new Date(writing.data.date)),
      description: writing.data.description ?? "",
    }));

  // const grouped = writings
  //   .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  //   .slice(0, count ?? writings.length)
  //   .reduce((acc: Record<string, WritingPost[]>, writing) => {
  //     const year = writing.data.date.getFullYear().toString();
  //     if (!acc[year]) acc[year] = [];
  //     acc[year].push(writing.data);
  //     return acc;
  //   }, {});

  // const groupedArray = Object.entries(grouped).map(([year, posts]) => ({
  //   year,
  //   posts: posts.map((post) => ({
  //     title: post.title,
  //     slug: post.slug,
  //     date: formatWritingDate(new Date(post.date)),
  //     description: post.description ?? "",
  //   })),
  // }));

  // return groupedArray;
}
