# nlite

> nlite is a lightweight React 19 framework on Vite with Next.js-style `app/` routing. It is built by shamil.

- Project page: https://shamilkotta.com/projects/nlite
- Source: https://github.com/shamilkotta/nlite
- npm: https://www.npmjs.com/package/nlite
- License: MIT

## What it is

nlite gives you layouts, loading and error UI, route handlers, streaming SSR, static site generation, and Partial Prerendering (PPR) on React 19 and Vite 8. It is a lite alternative to Next.js, not a drop-in replacement.

## Who it's for

People who like the Next.js `app` directory conventions and want them on Vite, with React Server Components, SSR, SSG, and PPR in a small codebase.

## Quickstart

Requires Node.js `^20.19.0` or `>=22.12.0` and React `^19.2.5`.

```bash
pnpm add nlite react react-dom
```

Add scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "nlite dev",
    "build": "nlite build",
    "preview": "nlite preview"
  }
}
```

Create `nlite.config.ts`:

```ts
import { defineConfig } from "nlite/config";

export default defineConfig({});
```

Create `app/layout.tsx` and `app/page.tsx`:

```tsx
// app/layout.tsx
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

```tsx
// app/page.tsx
export default function HomePage() {
  return <h1>Hello from nlite</h1>;
}
```

Run `pnpm dev`.

## Features

- App-directory routing: `layout`, `page`, `loading`, `error`, `not-found`, and `route` files, with dynamic `[id]`, catch-all `[...slug]`, and `(group)` segments
- React Server Components and streaming SSR
- Static generation by default, `generateStaticParams` for dynamic routes, and request-time SSR
- Partial Prerendering with `ppr: true`
- `"use cache"` for build-time cached server work
- Route handlers for `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, and `OPTIONS`
- `cookies()` and `headers()` from `nlite/headers`
- Client navigation with `Link` and router hooks from `nlite/navigation`, plus server `redirect()` and `notFound()`
- Metadata API (`metadata` and `generateMetadata`)
- MDX content collections from `nlite/mdx`

## CLI

```bash
nlite dev       # start the development server
nlite build     # create a production build in .nlite
nlite preview   # serve the production build
nlite start     # alias for preview
```

## Adapters

Without an adapter, `nlite build` writes to `.nlite` and `nlite start` serves it. Add an adapter from `nlite/adapters` to build for a platform, then deploy with that platform's own CLI.

- `vercel()`: Vercel
- `cloudflare()`: Cloudflare Workers
- `netlify()`: Netlify

```ts
import { cloudflare } from "nlite/adapters";
import { defineConfig } from "nlite/config";

export default defineConfig({
  plugins: [cloudflare()],
});
```

## Status

- Version 0.10.0 (see `packages/nlite/package.json`)
- Experimental. Usable for side projects and small sites. Public APIs may change between releases.
- Not yet supported: Server Actions (`"use server"`), middleware, image and font optimization, ISR and on-demand revalidation.
