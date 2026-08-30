import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getMedia } from "../lib/content";
import { site } from "../lib/site";

/**
 * One feed covering everything: essays, press, podcasts and films.
 *
 * Each item links out to wherever the work actually lives, which is the point
 * of the site. Dates are ISO strings in the data, parsed as UTC noon so the
 * published date can't slip a day either way depending on the reader.
 */
export async function GET(context: APIContext) {
  const media = await getMedia();

  const kindLabel: Record<string, string> = {
    writing: "Essay",
    press: "Press",
    podcast: "Podcast",
    video: "Video",
  };

  return rss({
    title: `${site.name}: writing, films and appearances`,
    description: site.description,
    site: context.site ?? site.origin,
    trailingSlash: false,
    items: media.map((item) => ({
      title: item.title,
      link: item.url,
      pubDate: new Date(`${item.date}T12:00:00Z`),
      description: item.excerpt,
      categories: [kindLabel[item.kind] ?? item.kind, item.category],
      author: site.name,
      customData: `<source url="${site.origin}/rss.xml">${item.source}</source>`,
    })),
    customData: [
      "<language>en-us</language>",
      `<managingEditor>${site.name}</managingEditor>`,
    ].join(""),
  });
}
