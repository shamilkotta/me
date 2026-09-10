import { writingList } from "@/lib/content";
import { absoluteUrl } from "@/lib/links";

function urlEntry(loc: string, lastmod?: string) {
  const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : "";
  return `  <url>\n    <loc>${loc}</loc>${lastmodTag}\n  </url>`;
}

export async function GET() {
  const posts = await writingList();
  const entries = [
    urlEntry(absoluteUrl("/")),
    urlEntry(absoluteUrl("/writing")),
    urlEntry(absoluteUrl("/projects")),
    ...posts.map((post) => urlEntry(absoluteUrl(`/writing/${post.slug}`))),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
