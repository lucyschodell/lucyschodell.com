import { site } from "./site";

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
