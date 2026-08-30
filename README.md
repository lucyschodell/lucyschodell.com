# lucyschodell.com

A personal archive: running, writing, projects, and the media around them.
Built with [Astro](https://astro.build). Static, no backend, no database.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # -> dist/
npm run preview  # serve the built site
```

---

## Adding content

**Everything on this site is data.** To add an article, race, podcast, video or
project, add an object to the matching file in `src/data/` — no page or component
needs to change. The build validates every field, so a typo fails the build rather
than showing up broken on the site.

| File | What it holds | Appears on |
|---|---|---|
| `src/data/writing.json` | Lucy's own posts (Substack) | Writing, Running, Home |
| `src/data/press.json` | Articles written *about* Lucy | Writing, Running, Home |
| `src/data/podcasts.json` | Podcast appearances | Running, Home |
| `src/data/videos.json` | Films and race coverage | Videos, Running, Home |
| `src/data/races.json` | The race record | Running, Home |
| `src/data/projects.json` | Projects | Projects, Home |
| `src/data/links.json` | Social / elsewhere links | Footer, About |

The exact fields for each are defined — with comments — in `src/content.config.ts`.

### Two conventions worth knowing

**`featured: true`** puts an item in the homepage's curated selection. The homepage
is deliberately *not* "the newest five things" — items opt in. If fewer than six are
marked, the most recent ones backfill so it never looks thin.

**`photo`** is a key from the photo registry, not a file path.

### The Videos page appears automatically

`src/data/videos.json` drives both the page and its nav link. Empty the file and the
Videos link disappears from the navigation; add an entry and it comes back. Same
pattern is available for any future section.

---

## Adding photos

1. Drop the file in `src/assets/photos/`
2. Register it in `src/lib/photos.ts` with alt text and, if needed, a credit
3. Reference it from a data file by its key

Alt text and credit live *with* the image rather than at each usage, so they can't
drift apart, and a photo can be swapped everywhere in one edit. Registering a key
whose file is missing fails the build.

Images are optimised at build time (resized, converted to WebP, lazy-loaded below the
fold). Drop in the largest version you have — originals are downscaled automatically.

---

## Before deploying

The domain is set to `https://lucyschodell.com` in two places, and they must match:

- `SITE` in `astro.config.mjs` (drives the sitemap)
- `origin` in `src/lib/site.ts` (drives canonical and Open Graph URLs)

A production build fails with a clear error if they ever drift. `robots.txt` and
`rss.xml` are generated from the same value, so there is nothing else to update.

### After it is live

1. Add the site to [Google Search Console](https://search.google.com/search-console)
   and [Bing Webmaster Tools](https://www.bing.com/webmasters), then submit
   `/sitemap-index.xml`.
2. Check the Person markup with the
   [Rich Results Test](https://search.google.com/test/rich-results). It should show
   one Person with `alternateName: Lucy Scholz`.
3. Where you can edit a profile that already ranks (Substack, LinkedIn, Instagram),
   link back to the site. Those inbound links are what let Google merge the two
   names into one entity.

The output in `dist/` is plain static files — deploy to Netlify, Vercel, Cloudflare
Pages, or any static host. No server needed.

---

## Notes on accuracy

Race distances and times come from Lucy's own race reports, which sometimes differ
from the rounder numbers used in press coverage. Where they conflict, the Substack
figures win. `PERSONAL_SITE_CONTENT.md` records the conflicts and what was
deliberately left out.
