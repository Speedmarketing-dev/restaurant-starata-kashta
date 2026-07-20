// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  // 1. Set your custom domain or GitHub pages domain (without subfolders)
  site: "https://speedmarketing-dev.github.io",

  // 2. Set the exact name of your GitHub repository (with leading slash)
  base: "/restaurant-starata-kashta",
  vite: {
    plugins: [tailwindcss()],
  },
});
