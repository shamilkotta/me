import type { Root } from "hast";
import { toJsxRuntime, type Components } from "hast-util-to-jsx-runtime";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import type { WritingPost } from "@/lib/content";

type CompiledPost = {
  data: Omit<WritingPost, "date"> & { date: string };
  hast: Root;
};

const modules = import.meta.glob<CompiledPost>("/app/**/writing/**/*.md", {
  eager: true,
  import: "default",
});

const posts = Object.values(modules).map(({ data, hast }) => ({
  slug: data.slug,
  data: { ...data, date: new Date(data.date) } as WritingPost,
  Content: ({ components }: { components?: Partial<Components> }) =>
    toJsxRuntime(hast, { Fragment, jsx, jsxs, components, passKeys: false }),
}));

export type WritingEntry = (typeof posts)[number];

export async function getCollection() {
  return posts;
}

export async function getEntry(slug: string) {
  return posts.find((post) => post.slug === slug);
}
