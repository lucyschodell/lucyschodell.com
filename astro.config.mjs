// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { readFileSync } from "node:fs";

// Change this to the real domain before deploying.
// Keep it in sync with `origin` in src/lib/site.ts.
const SITE = "https://lucyschodell.com";

const read = (name) =>
  JSON.parse(readFileSync(new URL(`./src/data/${name}.json`, import.meta.url), "utf8"));

const newest = (...sets) => {
  const dates = sets.flat().map((x) => x.date).filter(Boolean).sort();
  return dates.length ? dates[dates.length - 1] : undefined;
};

const writing = read("writing");
const press = read("press");
const podcasts = read("podcasts");
const videos = read("videos");
const races = read("races");

// Real last-modified dates, taken from the newest item each page lists. A
// sitemap with invented lastmod values is worse than one with none.
const lastmod = {
  "/": newest(writing, press, podcasts, videos, races),
  "/running/": newest(races, writing, press, podcasts, videos),
  "/writing/": newest(writing, press),
  "/videos/": newest(videos),
  "/projects/": newest(press.filter((p) => p.category === "Building")),
};

const priority = {
  "/": 1.0,
  "/running/": 0.9,
  "/projects/": 0.9,
  "/writing/": 0.8,
  "/about/": 0.7,
  "/videos/": 0.6,
};

// https://astro.build/config
export default defineConfig({
  site: SITE,
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/404"),
      serialize(item) {
        const path = new URL(item.url).pathname;
        const mod = lastmod[path];
        if (mod) item.lastmod = `${mod}T12:00:00+00:00`;
        item.priority = priority[path] ?? 0.5;
        item.changefreq = path === "/" ? "weekly" : "monthly";
        return item;
      },
    }),
  ],
  image: {
    // Generous cap so the large Substack originals downscale cleanly.
    layout: "constrained",
    responsiveStyles: true,
  },
  build: {
    inlineStylesheets: "auto",
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
});
