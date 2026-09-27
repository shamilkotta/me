---
title: Vite and React are all you need
description: What's easy to miss is that React already ships the fundamentals full stack frameworks are built on. This walks through streaming SSR, static generation, hydration, and Server Components and why Vite is the only collaborator left once you see past the packaging.
slug: vite-and-react-are-all-you-need
date: 2026-06-02
---

React is the UI library most developers and AI assistants reach for as their go-to web solution. With React 19, the story got bigger. Server Components push data fetching and heavy work to the server instead of the browser. Next.js is built entirely around this model.

What's easy to miss is that React already ships the fundamental APIs behind most of what full-stack frameworks offer. SSR? `renderToReadableStream` from `react-dom/server`. SSG? `prerender` from `react-dom/static`. Client hydration? `hydrateRoot` from `react-dom/client`. Let's see what they actually do.

The most basic thing any web app needs is server-side rendering. Whether that HTML is produced on each request or ahead of time doesn't really matter, as long as the user gets markup. React covers both. For on-demand rendering, `renderToReadableStream` takes your component tree and returns a stream of HTML as React walks it.

```ts
import { renderToReadableStream } from "react-dom/server";

const stream = await renderToReadableStream(<App />, {
  onError: (err) => console.error(err),
});
```

Pipe that stream straight into a `Response` and the browser starts receiving HTML before React has finished rendering the full tree. Any runtime that speaks Web Streams can do this, whether it's Workers, Node, Deno, or something else, without anyone in the middle.

When the tree can be fully resolved ahead of time and doesn't need to wait on a request, there's `prerender`.

```ts
import { prerender } from "react-dom/static";

const { prelude } = await prerender(<App />, {
  onError: (err) => console.error(err),
});
```

Same component tree, different strategy. `renderToReadableStream` emits HTML incrementally. `prerender` resolves the whole thing and gives you a prelude you can write to disk. Streaming SSR and static generation, both from `react-dom`.

Once that HTML reaches the browser, the client picks up where the server left off. `hydrateRoot` revives the same tree and wires up the event handlers you lost during server rendering.

```ts
import { hydrateRoot } from "react-dom/client";

hydrateRoot(document, <App />);
```

That's the SSR surface. Stream or prerender on the server, hydrate on the client. For a traditional web app, `react-dom` alone gets you most of the way.

Server Components are where it branches. The APIs above know how to turn a React tree into HTML, but they don't know what to do with server-only logic that never ships to the client, data fetching that stays on the server, or client boundaries marked with `'use client'`. RSC adds a serialization step before HTML enters the picture. The server doesn't render to markup first. It produces a Flight payload, a serialized React tree that can reference client code without embedding it.

And that's where a bundler becomes unavoidable. RSC doesn't just send data across the wire, it sends module references, something like `chunk-abc.js#Counter` instead of the component's source code. A bundler binding finds `'use client'` files, builds the client chunks, and teaches React how to emit and load those references on both sides. Without that, you'd either ship raw code as strings or load modules one at a time in a waterfall. Dan Abramov explains this well in [Why Does RSC Integrate with a Bundler?](https://overreacted.io/why-does-rsc-integrate-with-a-bundler/).

React ships bundler-specific packages for this. `react-server-dom-webpack` for webpack, `react-server-dom-parcel` for Parcel, and so on. Vite doesn't have a first-party `react-server-dom-vite` package yet, but that doesn't mean Vite is left out. The webpack bindings aren't really about webpack the bundler. They're about module IDs, chunk manifests, and client loading. What Vite needed was something to map its own module graph onto that interface, and that's what `@vitejs/plugin-rsc` does. It wires Vite's environment API to `react-server-dom-webpack` so you get the same RSC serialization and deserialization, built for Vite's dev server and build pipeline.

Once you have a bundler binding in place, the RSC APIs mirror what you already saw with `react-dom`. Instead of HTML, the server produces a Flight stream.

For on-demand rendering, you call `renderToReadableStream` on the RSC server with webpack bindings.

```ts
import { renderToReadableStream } from "react-server-dom-webpack/server";

const rscStream = renderToReadableStream(<App />, webpackMap, {
  onError: (err) => console.error(err),
});
```

`webpackMap` is the manifest your bundler builds at compile time, a lookup table from module IDs to the client chunks that actually exist on disk. When the serializer hits a `'use client'` component, it doesn't embed source code. It writes a reference into the Flight stream, and the map is how both sides know what that reference points to.

You can send this Flight stream over the network, cache it, or store it. What you do next depends on who's receiving it.

If the client is a browser doing a client-side navigation, it can consume the Flight stream directly. `createFromReadableStream` revives the flight payload into a React tree, and `hydrateRoot` attaches it to the DOM.

```ts
import { createFromReadableStream } from "react-server-dom-webpack/client";
import { hydrateRoot } from "react-dom/client";

const tree = await createFromReadableStream(rscStream);
hydrateRoot(document, tree);
```

That's a complete RSC round trip on its own. The browser deserializes the Flight stream and renders it client-side.

When you need HTML, a document the browser can paint on first load, `react-dom` enters the picture. You deserialize the same Flight stream on the server, wrap it in a shell, and pass that tree to the APIs you already know.

```ts
import { createFromReadableStream } from "react-server-dom-webpack/client";
import { renderToReadableStream } from "react-dom/server";

function HtmlShell() {
  const payload = React.use(createFromReadableStream(rscStream));
  return <Document>{payload}</Document>;
}

const htmlStream = await renderToReadableStream(<HtmlShell />);
```

`createFromReadableStream` revives the Flight payload into a real tree. `React.use()` suspends while the stream resolves. Then `renderToReadableStream` turns that tree into HTML, the same API as before, just fed by a deserialized RSC payload instead of JSX you authored directly on the server.

For static generation, RSC has its own `prerender` too, with `webpackMap`.

```ts
import { prerender } from "react-server-dom-webpack/static";

const { prelude } = await prerender(<App />, webpackMap, {
  onError: (err) => console.error(err),
});
```

You can freeze the Flight payload at build time, or freeze the HTML. Same pairing on both layers. Deserialize the static Flight prelude, pass the resulting tree to `react-dom`'s `prerender`, and you have a fully static page.

```ts
const { prelude: rscPrelude } = await prerender(<App />, webpackMap);
const { prelude: htmlPrelude } = await prerender(<HtmlShell />);
```

Four calls across two packages, but really two ideas repeated. Serialize a tree to flight payload, deserialize back to a tree. The Flight stream is the shared artifact. The browser can consume it directly for client navigations, or you can run it through `react-dom` when you need HTML for the initial document. Same payload, two destinations.

> On Vite, `@vitejs/plugin-rsc` exposes these same APIs through its own entry points, `@vitejs/plugin-rsc/rsc`, `@vitejs/plugin-rsc/ssr`, and `@vitejs/plugin-rsc/browser`. Under the hood, it's still `react-server-dom-webpack`. The plugin wires Vite's module graph to the webpack bindings and handles the manifest for you.

So where does this leave you? The APIs are React's. Streaming, prerendering, hydrating, serializing Flight payloads. The bundler bindings are React's too, adapted to whatever tool builds your module graph. What's left is developer experience, and that's where Vite earns its place in the title.

Vite's environment API is what makes the split feel natural. An RSC server, an SSR server, and a browser client aren't three separate projects. They're three environments in one config, each with its own entry point and build target. `@vitejs/plugin-rsc` sets up the RSC and SSR environments for you.

From there, you get everything Vite is already known for, fast startup times, quick rebuilds, HMR, and a plugin ecosystem that makes it easy to build higher-level abstractions.

If you want to see these pieces wired together, file-based routing, layouts, API routes, streaming SSR, static generation, all on Vite, I put together [nlite](https://npmx.dev/package/nlite), a small library I built while learning how this stack fits. It's not trying to be a full framework. It's a lighter starting point with React 19, Server Components, and the basics you'd expect from a modern app, with very little abstraction beyond the APIs discussed here. Use it to read the [source](https://github.com/shamilkotta/nlite), break things, or ship something small.
