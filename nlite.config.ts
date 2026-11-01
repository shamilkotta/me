import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "nlite/config";
import path from "node:path";
import { cloudflare } from "nlite/adapters";
import { markdown } from "./lib/markdown/plugin";
import { ogImagesPlugin } from "./lib/og/build";

export default defineConfig({
  plugins: [tailwindcss(), ogImagesPlugin(), cloudflare(), markdown()],
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
