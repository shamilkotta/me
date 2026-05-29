export type Post = { date: string; title: string };

export type YearGroup = { year: string; posts: Post[] };

export type Talk = { date: string; title: string };

export type Project = {
  href: string;
  name: string;
  desc: string;
  meta: string;
  external?: boolean;
};

export const writingByYear: YearGroup[] = [
  {
    year: "2026",
    posts: [
      { date: "03-14", title: "why logging still sucks in 2026" },
      { date: "02-10", title: "how i use claude code for side projects" },
      { date: "01-22", title: "notes on building a cli people actually use" },
    ],
  },
  {
    year: "2025",
    posts: [
      { date: "12-21", title: "logging sucks (a follow-up)" },
      { date: "11-04", title: "what even are distributed traces?" },
      { date: "09-07", title: "observability wide events 101" },
      {
        date: "06-22",
        title: "context engineering is what makes ai useful",
      },
      {
        date: "03-05",
        title: "optimizing hot paths with low-level memory tricks",
      },
    ],
  },
  {
    year: "2024",
    posts: [
      { date: "12-31", title: "2024 year in review" },
      {
        date: "08-19",
        title: "became an open source maintainer — here's what i learned",
      },
      { date: "04-06", title: "graduated with a cs degree" },
    ],
  },
];

export const talks: Talk[] = [
  { date: "nov 26, 2025", title: "observing serverless applications" },
  { date: "jun 18, 2025", title: "lessons from self-hosting clickhouse" },
  { date: "mar 1, 2025", title: "building devtools people actually want" },
  {
    date: "nov 21, 2024",
    title: "exploring javascript runtimes on aws lambda",
  },
  { date: "may 16, 2024", title: "serverless transactional outbox pattern" },
];

export const projects: Project[] = [
  {
    href: "https://github.com/example/trace-view",
    name: "trace-view",
    desc: "lightweight distributed tracing ui",
    meta: "★ 340",
    external: true,
  },
  {
    href: "https://github.com/example/devtools-cli",
    name: "devtools-cli",
    desc: "scaffolding for side projects",
    meta: "★ 1.2k",
    external: true,
  },
  {
    href: "https://github.com/example/config-sync",
    name: "config-sync",
    desc: "dotfile sync across machines",
    meta: "sunsetted",
    external: true,
  },
  {
    href: "https://github.com/example/queue-kit",
    name: "queue-kit",
    desc: "minimal job queue for node.js",
    meta: "★ 89",
    external: true,
  },
  {
    href: "/",
    name: "this site",
    desc: "built with nlite and a little bit of magic",
    meta: "—",
  },
];

export function writingPreview(yearCount = 2, postsPerYear = 3): YearGroup[] {
  return writingByYear.slice(0, yearCount).map((group) => ({
    year: group.year,
    posts: group.posts.slice(0, postsPerYear),
  }));
}

export function talksPreview(count = 3): Talk[] {
  return talks.slice(0, count);
}

export function projectsPreview(count = 3): Project[] {
  return projects.slice(0, count);
}
