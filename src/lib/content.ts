import { getCollection, type CollectionEntry } from "astro:content";
import type { PhotoKey } from "./photos";
import videosRaw from "../data/videos.json";

/**
 * Content helpers.
 *
 * Everything is sorted newest-first. `getMedia()` merges writing, press,
 * podcasts and videos into one timeline so the Running page and the homepage's
 * "Selected" feed can show mixed content with a consistent card shape.
 */

const byDateDesc = (a: { data: { date: string } }, b: { data: { date: string } }) =>
  b.data.date.localeCompare(a.data.date);

export type MediaKind = "writing" | "press" | "podcast" | "video";

export type MediaItem = {
  id: string;
  kind: MediaKind;
  /** What to show as the eyebrow: publication, show name, etc. */
  source: string;
  title: string;
  excerpt: string;
  date: string;
  url: string;
  category: string;
  photo?: PhotoKey;
  featured: boolean;
  /** Verb for the call to action, e.g. "Read", "Listen", "Watch". */
  action: string;
  meta?: string;
};

export async function getWriting() {
  return (await getCollection("writing")).sort(byDateDesc);
}

export async function getPress() {
  return (await getCollection("press")).sort(byDateDesc);
}

export async function getPodcasts() {
  return (await getCollection("podcasts")).sort(byDateDesc);
}

/**
 * Astro logs a warning on every read of an empty collection, so skip the read
 * when src/data/videos.json is empty. Everything downstream — the Videos page
 * and its nav link — keys off whether this returns anything.
 */
export async function getVideos(): Promise<CollectionEntry<"videos">[]> {
  if ((videosRaw as unknown[]).length === 0) return [];
  return (await getCollection("videos")).sort(byDateDesc);
}

export async function getRaces() {
  return (await getCollection("races")).sort(byDateDesc);
}

export async function getProjects() {
  return (await getCollection("projects")).sort(
    (a, b) => a.data.order - b.data.order,
  );
}

export async function getLinks() {
  return (await getCollection("links")).sort((a, b) => a.data.order - b.data.order);
}

/** Unified, newest-first feed across every media type. */
export async function getMedia(): Promise<MediaItem[]> {
  const [writing, press, podcasts, videos] = await Promise.all([
    getWriting(),
    getPress(),
    getPodcasts(),
    getVideos(),
  ]);

  const items: MediaItem[] = [
    ...writing.map((e) => ({
      id: e.id,
      kind: "writing" as const,
      source: e.data.source,
      title: e.data.title,
      excerpt: e.data.excerpt,
      date: e.data.date,
      url: e.data.url,
      category: e.data.category,
      photo: e.data.photo as PhotoKey | undefined,
      featured: e.data.featured,
      action: "Read",
      meta: e.data.subtitle,
    })),
    ...press.map((e) => ({
      id: e.id,
      kind: "press" as const,
      source: e.data.outlet,
      title: e.data.title,
      excerpt: e.data.excerpt,
      date: e.data.date,
      url: e.data.url,
      category: e.data.category,
      photo: e.data.photo as PhotoKey | undefined,
      featured: e.data.featured,
      action: "Read",
      meta: e.data.author ? `by ${e.data.author}` : undefined,
    })),
    ...podcasts.map((e) => ({
      id: e.id,
      kind: "podcast" as const,
      source: e.data.show,
      title: e.data.episode,
      excerpt: e.data.description,
      date: e.data.date,
      url: e.data.url,
      category: e.data.topic,
      photo: e.data.photo as PhotoKey | undefined,
      featured: e.data.featured,
      action: "Listen",
      meta: e.data.host ? `with ${e.data.host}` : undefined,
    })),
    ...videos.map((e) => ({
      id: e.id,
      kind: "video" as const,
      source: e.data.channel ?? "YouTube",
      title: e.data.title,
      excerpt: e.data.description,
      date: e.data.date,
      url: e.data.url,
      category: e.data.category,
      photo: e.data.photo as PhotoKey | undefined,
      featured: e.data.featured,
      action: "Watch",
    })),
  ];

  return items.sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Featured selection for the homepage.
 *
 * Deliberately curated rather than "the newest N": items opt in with
 * `featured: true`. If fewer than `min` are marked, the most recent
 * unfeatured items backfill so the homepage never looks thin.
 */
export function pickFeatured<T extends { featured: boolean }>(
  items: T[],
  limit: number,
  min = limit,
): T[] {
  const featured = items.filter((i) => i.featured);
  if (featured.length >= limit) return featured.slice(0, limit);
  const rest = items.filter((i) => !i.featured);
  return [...featured, ...rest].slice(0, Math.max(min, featured.length));
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "2025-11-14" → "November 2025". Parsed manually to avoid timezone drift. */
export function formatDate(iso: string, withDay = false): string {
  const [y, m, d] = iso.split("-").map(Number);
  const month = MONTHS[m - 1];
  return withDay ? `${month} ${d}, ${y}` : `${month} ${y}`;
}

export function formatYear(iso: string): string {
  return iso.slice(0, 4);
}
