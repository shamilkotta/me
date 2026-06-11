import rehypeShiki from "@shikijs/rehype";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "nlite/config";
import path from "node:path";
import { cloudflare } from "nlite/adapters";
import { defineCollection, mdx } from "nlite/mdx";
import remarkGfm from "remark-gfm";
import { z } from "zod";

export default defineConfig({
  plugins: [
    tailwindcss(),
    cloudflare(),
    mdx({
      collections: {
        writing: defineCollection({
          source: "app/**/writing/**/*.{mdx,md}",
          schema: z.object({
            title: z.string(),
            slug: z.string(),
            date: z.coerce.date(),
            description: z.string().optional(),
          }),
        }),
      },
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          [
            rehypeShiki,
            {
              themes: {
                light: "vitesse-light",
                dark: "vitesse-dark",
              },
              defaultColor: false,
            },
          ],
        ],
      },
    }),
  ],
  staleTimes: {
    static: 600,
  },
  vite: {
    resolve: {
      alias: {
        "@": path.resolve(process.cwd()),
      },
    },
  },
});
