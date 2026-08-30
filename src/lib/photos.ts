import type { ImageMetadata } from "astro";

/**
 * Photo registry.
 *
 * Every image on the site is registered here once, together with its alt text
 * and credit. Content files (src/data/*.json) refer to photos by key, so alt
 * text can never drift away from the image it describes, and a photo can be
 * swapped in one place.
 *
 * To add a photo: drop the file in src/assets/photos/ and add an entry below.
 */

const files = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/photos/*.{jpg,jpeg,png,webp,avif}",
  { eager: true },
);

export type Photo = {
  src: ImageMetadata;
  alt: string;
  credit?: string;
};

type PhotoDef = {
  file: string;
  alt: string;
  credit?: string;
};

/** Race photography shot by the event's official photographers. */
const GOBI_CREDIT = "Ultra Gobi 400K official race photography";

const defs = {
  "hero-atacama-highway": {
    file: "hero-atacama-highway.jpg",
    alt: "A single runner on a long curving desert highway in the Atacama at dawn, the road disappearing into pink hills.",
  },
  "portrait-atacama-joy": {
    file: "portrait-atacama-joy.jpg",
    alt: "Lucy laughing mid-race in a cap and orange sunglasses, hand raised to her visor.",
  },
  "atacama-crew": {
    file: "atacama-crew.jpg",
    alt: "Lucy sitting in a camp chair at a roadside crew stop in the Atacama while a crew member photographs her.",
  },
  "gobi-into-the-sun": {
    file: "gobi-into-the-sun.jpg",
    alt: "A runner with a race pack silhouetted against a low sun on a wide gravel track in the Gobi.",
    credit: GOBI_CREDIT,
  },
  "gobi-sunrise": {
    file: "gobi-sunrise.jpg",
    alt: "Sunrise over the Gobi desert with a lone runner on a dirt double-track in the distance.",
  },
  "gobi-mountains": {
    file: "gobi-mountains.jpg",
    alt: "Two runners moving together on a rocky trail below bare desert mountains at Ultra Gobi.",
    credit: GOBI_CREDIT,
  },
  "gobi-start-flags": {
    file: "gobi-start-flags.jpg",
    alt: "Runners at the Ultra Gobi 400K start area with red and white race flags snapping in the wind.",
    credit: GOBI_CREDIT,
  },
  "gobi-finish-capes": {
    file: "gobi-finish-capes.jpg",
    alt: "Lucy and Jack Carey at the Ultra Gobi finish at night, wrapped in red finisher capes, holding their trophies.",
    credit: GOBI_CREDIT,
  },
  "portrait-gobi-jack": {
    file: "portrait-gobi-jack.jpg",
    alt: "Studio-lit portrait of Lucy and Jack Carey after Ultra Gobi, arms around each other against a black background.",
    credit: GOBI_CREDIT,
  },
  "gobi-desert-bones": {
    file: "gobi-desert-bones.jpg",
    alt: "Animal bones bleached white on the empty gravel floor of the Gobi desert under a flat grey sky.",
  },
  "moab-bib-and-baby": {
    file: "moab-bib-and-baby.jpg",
    alt: "Lucy at the Moab 240 start holding her infant daughter, who is holding race bib number 204.",
  },
  "moab-hug": {
    file: "moab-hug.jpg",
    alt: "Lucy embracing a friend at the Moab 240, a baby in a carrier between them, red canyon walls behind.",
  },
  "women-are-elite": {
    file: "women-are-elite.jpg",
    alt: 'The back of a tie-dye shirt reading "Women are Elite" worn at a trail race.',
  },
  "moab-crew": {
    file: "moab-crew.jpg",
    alt: "Lucy's crew at the Moab 240 in matching tie-dye shirts, lined up in the sun.",
  },
  "tsp-santa-monica-arch": {
    file: "tsp-santa-monica-arch.jpg",
    alt: "Lucy alone on wet pavement beneath the neon Santa Monica Yacht Harbor sign at night, at the start of The Speed Project.",
  },
  "tsp-crew-arch": {
    file: "tsp-crew-arch.jpg",
    alt: "Lucy's crew posing under the lit Santa Monica Yacht Harbor arch before The Speed Project.",
  },
  "tsp-rainbow-highway": {
    file: "tsp-rainbow-highway.jpg",
    alt: "A full rainbow arcing over a desert highway with a runner small on the shoulder of the road.",
  },
  "tsp-crew-night": {
    file: "tsp-crew-night.jpg",
    alt: "Lucy and her crew at night outside a lit storefront during The Speed Project.",
  },
  "young-athlete-team": {
    file: "young-athlete-team.jpg",
    alt: "A youth girls' lacrosse team photo, players in white kit holding sticks.",
  },
  "young-athlete-clinic": {
    file: "young-athlete-clinic.jpg",
    alt: "An old print photograph of a youth sports clinic team posed on a grass field with their coach.",
  },
  "video-moab-240-rad": {
    file: "video-moab-240-rad.jpg",
    alt: "Video thumbnail: Lucy running the Moab 240, from R.A.D's film about her race.",
    credit: "R.A.D\u00ae",
  },
  "video-tsp-atacama-rad": {
    file: "video-tsp-atacama-rad.jpg",
    alt: "Video thumbnail: The Speed Project Atacama, from R.A.D.",
    credit: "R.A.D\u00ae",
  },
  "pitch-night-check": {
    file: "pitch-night-check.jpg",
    alt: "Lucy on stage at Idea Village Pitch Night holding an oversized cheque made out to Watch Women's Sports IRL for $1,500, speaking into a microphone with CONGRATULATIONS! on the screen behind her.",
  },
  "pitch-night-group": {
    file: "pitch-night-group.jpg",
    alt: "Lucy and the other Idea Village Pitch Night finalists and judges lined up on stage behind the winning cheque, under a PITCH NIGHT screen.",
  },
  "pitch-night-pitching": {
    file: "pitch-night-pitching.jpg",
    alt: "Lucy mid-pitch, microphone in hand, in front of a screen showing the Watch Women's Sports IRL slide and a wall of league logos.",
  },
  "video-this-is-your-mile": {
    file: "video-this-is-your-mile.jpg",
    alt: "Video thumbnail: This Is Your Mile, a MAKE RUNNING film by Ashley Stewart.",
    credit: "MAKE RUNNING",
  },
  "video-lalv-2025-ep2": {
    file: "video-lalv-2025-ep2.jpg",
    alt: "Video thumbnail: Episode 2 of MAKE RUNNING's LALV 2025 solo coverage.",
    credit: "MAKE RUNNING",
  },
  "pod-in-her-nature": {
    file: "pod-in-her-nature.jpg",
    alt: "Cover art for the In Her Nature podcast.",
  },
  "pod-on-the-hour": {
    file: "pod-on-the-hour.jpg",
    alt: "Cover art for the ON THE HOUR, EVERY HOUR podcast from MAKE RUNNING.",
  },
  "pod-chasing-three-hours": {
    file: "pod-chasing-three-hours.jpg",
    alt: "Cover art for the Chasing Three Hours podcast.",
  },
  "pod-rad-desert": {
    file: "pod-rad-desert.jpg",
    alt: "Cover art for the R.A.D podcast episode about running across the desert.",
  },
} as const satisfies Record<string, PhotoDef>;

export type PhotoKey = keyof typeof defs;

function resolve(def: PhotoDef): Photo {
  const mod = files[`../assets/photos/${def.file}`];
  if (!mod) {
    throw new Error(
      `Photo "${def.file}" is registered in src/lib/photos.ts but missing from src/assets/photos/`,
    );
  }
  return { src: mod.default, alt: def.alt, credit: def.credit };
}

export const photos = Object.fromEntries(
  Object.entries(defs).map(([key, def]) => [key, resolve(def)]),
) as Record<PhotoKey, Photo>;

export function getPhoto(key: PhotoKey | undefined | null): Photo | undefined {
  if (!key) return undefined;
  return photos[key];
}
