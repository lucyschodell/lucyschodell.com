import { site } from "./site";
import { getPhoto, type PhotoKey } from "./photos";

/**
 * Structured data.
 *
 * The whole site is an index of work that lives elsewhere, so the job here is
 * to make one thing unambiguous to search engines: that "Lucy Schodell" and
 * "Lucy Scholz" are the same person, and that every article, film, podcast and
 * project listed is about her.
 *
 * Everything hangs off a single Person node at `{origin}/#person`. Other nodes
 * reference it by @id rather than repeating the details, which is what lets a
 * crawler join them up.
 */

export const PERSON_ID = `${site.origin}/#person`;
export const SITE_ID = `${site.origin}/#website`;

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: site.name,
    alternateName: site.formerName,
    description: site.description,
    url: site.origin,
    jobTitle: ["Ultrarunner", "Founder", "Chief Operating Officer"],
    homeLocation: {
      "@type": "Place",
      name: site.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: "New Orleans",
        addressRegion: "LA",
        addressCountry: "US",
      },
    },
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "University of Virginia" },
      { "@type": "CollegeOrUniversity", name: "Johns Hopkins University" },
    ],
    worksFor: [
      {
        "@type": "Organization",
        name: "Live Oak Camp",
        url: "https://www.liveoakcamp.com/",
      },
      {
        "@type": "Organization",
        name: "Watch Women's Sports (IRL)",
        url: "https://www.watchwomenssportsirl.com/",
      },
    ],
    knowsAbout: [...site.knowsAbout],
    sameAs: [...site.sameAs],
  };
}

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    name: site.name,
    alternateName: site.formerName,
    url: site.origin,
    description: site.description,
    inLanguage: "en",
    publisher: { "@id": PERSON_ID },
    about: { "@id": PERSON_ID },
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...crumbs].map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: new URL(c.path, site.origin).href,
    })),
  };
}

/** A page that is primarily *about* Lucy, e.g. the About page. */
export function profilePageSchema(pathname: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: new URL(pathname, site.origin).href,
    mainEntity: { "@id": PERSON_ID },
    isPartOf: { "@id": SITE_ID },
  };
}

/** A listing page. `items` become the ItemList entries. */
export function collectionPageSchema(
  pathname: string,
  name: string,
  description: string,
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    url: new URL(pathname, site.origin).href,
    name,
    description,
    isPartOf: { "@id": SITE_ID },
    about: { "@id": PERSON_ID },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        url: it.url,
      })),
    },
  };
}

/**
 * Videos.
 *
 * The content files record only what a person needs to see a video listed —
 * title, day, description, link. Google needs three more things on a
 * VideoObject before it will accept one: a thumbnail, an upload date carrying
 * a time and a timezone, and a way to actually play the video. Those are
 * derived here rather than typed into src/data/videos.json, so adding a video
 * stays a four-field job.
 */
export type VideoInput = {
  title: string;
  description: string;
  /** ISO date, no time — see uploadDateTime(). */
  date: string;
  url: string;
  youtubeId?: string;
  photo?: string;
};

/**
 * Google rejects a bare "2025-10-23": uploadDate has to be a full ISO 8601
 * timestamp with a timezone. Only the day is known, so noon UTC stands in for
 * the time — it lands on the same calendar day in every timezone, which a
 * midnight would not.
 */
function uploadDateTime(date: string): string {
  return `${date}T12:00:00+00:00`;
}

/**
 * Thumbnails come from the photo registry, which already holds 1280x720 stills
 * for every video. YouTube's own thumbnail is the fallback for an entry added
 * without one: hqdefault is the size YouTube always serves, unlike maxresdefault.
 */
function videoThumbnail(video: VideoInput): string | undefined {
  const photo = getPhoto(video.photo as PhotoKey | undefined);
  if (photo) return new URL(photo.src.src, site.origin).href;
  if (video.youtubeId) return `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;
  return undefined;
}

export function videoObjectSchema(video: VideoInput) {
  return {
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    thumbnailUrl: videoThumbnail(video),
    uploadDate: uploadDateTime(video.date),
    url: video.url,
    ...(video.youtubeId
      ? { embedUrl: `https://www.youtube.com/embed/${video.youtubeId}` }
      : {}),
    about: { "@id": PERSON_ID },
  };
}

/** The Videos page listing, newest first. */
export function videoListSchema(name: string, videos: VideoInput[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: videos.map((video, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: videoObjectSchema(video),
    })),
  };
}
