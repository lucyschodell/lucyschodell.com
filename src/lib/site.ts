/**
 * Site-wide configuration.
 *
 * NOTE: `origin` is used for canonical URLs, Open Graph tags and the sitemap.
 * Change it to the real domain before deploying — it is also set in
 * astro.config.mjs as `site`.
 */

export const site = {
  name: "Lucy Schodell",
  origin: "https://lucyschodell.com",
  /** Also appears in press and on LinkedIn under a former name. */
  formerName: "Lucy Scholz",
  location: "New Orleans, Louisiana",
  tagline: "I run really long distances, and I build things that I wish already existed.",
  description:
    "Ultrarunner and builder in New Orleans. Winner of The Speed Project Solo, finisher of Ultra Gobi 400K and the Moab 240, founder of Watch Women's Sports (IRL).",
  /**
   * Every profile that belongs to this person. Search engines use `sameAs` to
   * merge the two names she publishes under into a single entity, so this list
   * matters more than usual here.
   */
  sameAs: [
    "https://lucyschodell.substack.com",
    "https://instagram.com/lucyschodell",
    "https://www.linkedin.com/in/lucy-schodell/",
    "https://www.watchwomenssportsirl.com/",
    "https://www.liveoakcamp.com/our-team/",
    "https://www.ultragobiseries.com/news/lucy-schodell-i-love-seeing-the-world-on-my-own-two-feet-ultra-gobi-400km-race-report",
    "https://www.advnture.com/features/lucy-scholtz",
    "https://geauxgirlmagazine.org/lucy-scholz/",
  ],
  knowsAbout: [
    "Ultramarathon running",
    "Endurance sports",
    "The Speed Project",
    "Women's sports",
    "Outdoor education",
  ],
} as const;

export type NavItem = {
  label: string;
  href: string;
  /** Hidden from the nav when its collection is empty. */
  requiresContent?: "videos";
};

export const nav: NavItem[] = [
  { label: "Running", href: "/running/" },
  { label: "Writing", href: "/writing/" },
  { label: "Videos", href: "/videos/", requiresContent: "videos" },
  { label: "Projects", href: "/projects/" },
  { label: "About", href: "/about/" },
];

/**
 * Positioning lines considered for the hero, kept for reference so the voice
 * stays consistent if the copy is revisited:
 *
 *   1. "I run very long distances and build the things I wish existed."  ← in use
 *   2. "Runs absurd distances. Builds software. Writes it down."
 *   3. "Ultrarunner, camp director, and a person who keeps starting things."
 *   4. "300 miles across a desert, then home to ship code."
 *   5. "Go outside. Have adventures. Do hard things."  (her own Substack line)
 */
