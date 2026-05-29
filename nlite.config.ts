import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "nlite/config";
import path from "node:path";
import {cloudflare} from "nlite/adapters"

export default defineConfig({
  plugins: [tailwindcss(), cloudflare()],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd()),
    },
  },
});
