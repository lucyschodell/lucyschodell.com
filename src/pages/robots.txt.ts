import type { APIContext } from "astro";
import { site } from "../lib/site";

/**
 * Generated rather than kept in public/, so the sitemap URL can never drift
 * from the configured domain.
 */
export function GET(context: APIContext) {
  const origin = (context.site ?? new URL(site.origin)).origin;

  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${origin}/sitemap-index.xml`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
