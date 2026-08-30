import { defineCollection } from "astro:content";
import { z } from "zod";
import { file } from "astro/loaders";

/**
 * Content architecture.
 *
 * Everything on this site is data. To add an article, race, podcast, video or
 * project, add an object to the matching file in src/data/ — no page or
 * component needs to change.
 *
 * Shared conventions across collections:
 *   featured  — surfaces the item on the homepage (see src/lib/content.ts)
 *   photo     — a key from the photo registry in src/lib/photos.ts
 *   date      — ISO YYYY-MM-DD. Sorting is newest-first everywhere.
 */

/** Keys must exist in src/lib/photos.ts; validated at build time on use. */
const photoKey = z.string().min(1);

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use an ISO date, e.g. 2025-11-14");

const writing = defineCollection({
  loader: file("src/data/writing.json"),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    excerpt: z.string(),
    date: isoDate,
    url: z.string().url(),
    source: z.string(),
    category: z.enum([
      "Running",
      "Endurance",
      "Personal",
      "Building",
      "Women's sports",
    ]),
    photo: photoKey.optional(),
    featured: z.boolean().default(false),
  }),
});

const races = defineCollection({
  loader: file("src/data/races.json"),
  schema: z.object({
    name: z.string(),
    year: z.number().int(),
    date: isoDate,
    location: z.string(),
    /** As reported in Lucy's own race write-ups. */
    distance: z.string(),
    time: z.string().optional(),
    result: z.string().optional(),
    elevation: z.string().optional(),
    blurb: z.string(),
    reportUrl: z.string().url().optional(),
    photo: photoKey.optional(),
    featured: z.boolean().default(false),
  }),
});

const press = defineCollection({
  loader: file("src/data/press.json"),
  schema: z.object({
    title: z.string(),
    outlet: z.string(),
    author: z.string().optional(),
    date: isoDate,
    url: z.string().url(),
    excerpt: z.string(),
    category: z.enum(["Running", "Building", "Women's sports", "Profile"]),
    photo: photoKey.optional(),
    featured: z.boolean().default(false),
  }),
});

const podcasts = defineCollection({
  loader: file("src/data/podcasts.json"),
  schema: z.object({
    show: z.string(),
    episode: z.string(),
    host: z.string().optional(),
    date: isoDate,
    url: z.string().url(),
    /** Optional second listen link, e.g. a YouTube version. */
    altUrl: z.string().url().optional(),
    altLabel: z.string().optional(),
    description: z.string(),
    topic: z.string(),
    photo: photoKey.optional(),
    featured: z.boolean().default(false),
  }),
});

/**
 * Videos. Lucy has no channel of her own — these are films and race coverage
 * published by others. The Videos page and its nav link appear automatically
 * whenever this collection is non-empty (see src/lib/site.ts).
 */
const videos = defineCollection({
  loader: file("src/data/videos.json"),
  schema: z.object({
    title: z.string(),
    /** The channel that published it — often not Lucy's own. */
    channel: z.string().optional(),
    date: isoDate,
    url: z.string().url(),
    description: z.string(),
    category: z.enum([
      "Running",
      "Racing",
      "Training",
      "Adventures",
      "Projects",
      "Other",
    ]),
    /** YouTube video id — used to build the thumbnail URL. */
    youtubeId: z.string().optional(),
    photo: photoKey.optional(),
    featured: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: file("src/data/projects.json"),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    year: z.string().optional(),
    status: z.enum(["Active", "Building", "Archived"]),
    role: z.string(),
    /** Paragraphs. First is used as the summary in listings. */
    body: z.array(z.string()).min(1),
    why: z.string().optional(),
    url: z.string().url().optional(),
    links: z
      .array(z.object({ label: z.string(), url: z.string().url() }))
      .default([]),
    photo: photoKey.optional(),
    gallery: z.array(photoKey).default([]),
    /** Slugs from the writing collection that relate to this project. */
    relatedWriting: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    order: z.number().int().default(99),
  }),
});

const links = defineCollection({
  loader: file("src/data/links.json"),
  schema: z.object({
    label: z.string(),
    handle: z.string().optional(),
    url: z.string().url(),
    icon: z.enum([
      "instagram",
      "substack",
      "linkedin",
      "x",
      "youtube",
      "globe",
      "mail",
    ]),
    note: z.string().optional(),
    order: z.number().int().default(99),
  }),
});

export const collections = {
  writing,
  races,
  press,
  podcasts,
  videos,
  projects,
  links,
};
