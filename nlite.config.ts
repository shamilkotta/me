import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "nlite/config";
import path from "node:path";

export default defineConfig({
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd()),
    },
  },
});
