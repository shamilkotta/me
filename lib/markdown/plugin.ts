import rehypeShiki from "@shikijs/rehype";
import matter from "gray-matter";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { z } from "zod";

const schema = z.object({
  title: z.string(),
  slug: z.string(),
  date: z.coerce.date(),
  description: z.string().optional(),
});

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeShiki, {
    themes: { light: "vitesse-light", dark: "vitesse-dark" },
    defaultColor: false,
  });

export function markdown() {
  return {
    name: "markdown-hast",
    enforce: "pre" as const,
    async transform(this: { error(message: string): never }, code: string, id: string) {
      if (!id.split("?")[0].endsWith(".md")) return;
      const { data, content } = matter(code);
      const result = schema.safeParse(data);
      if (!result.success) {
        return this.error(`Invalid frontmatter in ${id}: ${result.error.message}`);
      }
      const fm = result.data;
      const hast = await processor.run(processor.parse(content));
      return {
        code: `export default ${JSON.stringify({
          data: { ...fm, date: fm.date.toISOString() },
          hast,
        })};`,
        map: null,
      };
    },
  };
}
