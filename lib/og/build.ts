import { Resvg } from "@resvg/resvg-js";
import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";
import { PAGE_OG_CONFIG, PAGE_OG_KEYS, generatePageOgSvg, pageOgImagePath } from "./page";
import { generateWritingOgSvg, writingOgContentHash, writingOgImagePath } from "./writing";

const WRITING_SOURCE = "app/**/writing/**/*.{mdx,md}";
const OG_PUBLIC_DIR = "public/og";

const GEIST_FONT_DIR = "node_modules/geist/dist/fonts/geist-sans";
const GEIST_FONT_FILES = ["Geist-Regular.ttf", "Geist-SemiBold.ttf"];

function svgToPng(svg: string, fontFiles: string[]) {
  return new Resvg(svg, {
    font: { fontFiles, loadSystemFonts: false, defaultFontFamily: "Geist" },
  })
    .render()
    .asPng();
}

async function ogImages(root: string) {
  const images: { path: string; svg: () => string }[] = PAGE_OG_KEYS.map((key) => ({
    path: pageOgImagePath(key),
    svg: () => generatePageOgSvg(PAGE_OG_CONFIG[key].title),
  }));

  for (const file of fs.globSync(WRITING_SOURCE, { cwd: root })) {
    const { data } = matter(fs.readFileSync(path.join(root, file), "utf8"));
    const title = String(data.title);
    const date = new Date(data.date);
    const hash = await writingOgContentHash(title, date);
    images.push({
      path: writingOgImagePath(data.slug, hash),
      svg: () => generateWritingOgSvg(title, date),
    });
  }

  return images;
}

export async function generateOgImages(root = process.cwd()) {
  const outDir = path.join(root, OG_PUBLIC_DIR);
  const images = await ogImages(root);
  const fontFiles = GEIST_FONT_FILES.map((file) => path.join(root, GEIST_FONT_DIR, file));
  const expected = new Set(images.map((image) => path.join(root, "public", image.path)));

  for (const file of fs.globSync("**/*.png", { cwd: outDir })) {
    const filePath = path.join(outDir, file);
    if (!expected.has(filePath)) fs.rmSync(filePath);
  }

  for (const image of images) {
    const filePath = path.join(root, "public", image.path);
    if (fs.existsSync(filePath)) continue;
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, svgToPng(image.svg(), fontFiles));
  }
}

export function ogImagesPlugin() {
  let root = process.cwd();
  let generated: Promise<void> | undefined;

  return {
    name: "og-images",
    enforce: "pre" as const,
    configResolved(config: { root: string }) {
      root = config.root;
    },
    buildStart() {
      generated ??= generateOgImages(root);
      return generated;
    },
  };
}
