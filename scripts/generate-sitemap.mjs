import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteUrl = "https://shamilkotta.com";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const postsDir = path.join(root, "app/(subpages)/writing/[slug]");
const outFile = path.join(root, "public/sitemap.xml");

function absoluteUrl(pathname = "/") {
  if (!pathname || pathname === "/") return `${siteUrl}/`;
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${siteUrl}${normalized}`;
}

function urlEntry(loc) {
  return `  <url>\n    <loc>${loc}</loc>\n  </url>`;
}

// Leave out until intentionally re-included in the sitemap.
const excludedWritingSlugs = new Set(["dont-settle-for-less"]);

const files = await readdir(postsDir);
const slugs = files
  .filter((name) => name.endsWith(".md"))
  .map((name) => name.slice(0, -3))
  .filter((slug) => !excludedWritingSlugs.has(slug))
  .sort();

const locs = [
  absoluteUrl("/"),
  absoluteUrl("/writing"),
  absoluteUrl("/projects"),
  ...slugs.map((slug) => absoluteUrl(`/writing/${slug}`)),
];

const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${locs.map(urlEntry).join("\n")}
</urlset>
`;

await writeFile(outFile, body);
console.log(`wrote ${path.relative(root, outFile)} (${locs.length} urls)`);
