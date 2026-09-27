export const NLITE = {
  name: "nlite",
  tagline: "Next.js familiar React on Vite Native",
  description:
    "File-based routing, SSR, SSG, and Partial Pre-Rendering. First-party deploys to Vercel, Cloudflare, Netlify, or any Node server. Full Vite DX.",
  install: "pnpm add nlite react react-dom",
  github: "https://github.com/shamilkotta/nlite",
  npm: "https://npmx.dev/package/nlite",
  docs: "https://github.com/shamilkotta/nlite#readme",
} as const;

export const DEPLOYS = [
  {
    id: "vercel",
    name: "Vercel",
    body: "Native adapter for Vercel’s runtime. Preview and production from the same build.",
    code: `import { defineConfig } from "nlite/config";
import { vercel } from "nlite/adapters";

export default defineConfig({
  plugins: [vercel()],
});`,
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    body: "Workers-ready output via the Cloudflare adapter and Vite plugin.",
    code: `import { defineConfig } from "nlite/config";
import { cloudflare } from "nlite/adapters";

export default defineConfig({
  plugins: [cloudflare()],
});`,
  },
  {
    id: "netlify",
    name: "Netlify",
    body: "First-party Netlify adapter for Functions and edge-friendly deploys.",
    code: `import { defineConfig } from "nlite/config";
import { netlify } from "nlite/adapters";

export default defineConfig({
  plugins: [netlify()],
});`,
  },
  {
    id: "node",
    name: "Any Node server",
    body: "Run the Node build on your own machine, VPS, Docker, or platform of choice.",
    code: `import { defineConfig } from "nlite/config";
import { node } from "nlite/adapters";

export default defineConfig({
  
});`,
  },
] as const;

export const TREE = [
  { name: "app/", kind: "dir" as const, note: "/", depth: 0 },
  { name: "layout.tsx", kind: "file" as const, note: "root shell", depth: 1 },
  { name: "page.tsx", kind: "file" as const, note: "index route", depth: 1 },
  { name: "loading.tsx", kind: "file" as const, note: "segment fallback", depth: 1 },
  { name: "api/", kind: "dir" as const, note: "route handlers", depth: 1 },
  { name: "status/route.ts", kind: "file" as const, note: "GET /api/status", depth: 2 },
  { name: "blog/[slug]/page.tsx", kind: "file" as const, note: "dynamic", depth: 1 },
  { name: "nlite.config.ts", kind: "file" as const, note: "supercharged vite config", depth: 0 },
] as const;
