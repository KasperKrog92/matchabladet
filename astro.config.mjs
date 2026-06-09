// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// Produktionsdomæne – bruges til canonical-links, sitemap og Open Graph.
const site = "https://matchabladet.dk";

export default defineConfig({
  site,
  output: "static",
  // Respekter PORT fra miljøet (bruges af preview-værktøj), ellers Astros standard.
  server: process.env.PORT ? { port: Number(process.env.PORT) } : {},
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
