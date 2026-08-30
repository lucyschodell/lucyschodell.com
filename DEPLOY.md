# Deploying

Host: **Netlify**. Registrar and DNS: **Porkbun**. Source: **GitHub**.

Once set up, deploying is just `git push`. Netlify rebuilds and publishes on
every push to `main`.

---

## 1. Connect Netlify to the repo

1. Go to [app.netlify.com](https://app.netlify.com) and sign in **with GitHub**.
2. **Add new site → Import an existing project → GitHub**.
3. Authorise Netlify, then pick `lucyschodell/lucyschodell.com`.
4. Leave the build settings alone. `netlify.toml` in this repo already sets the
   build command (`npm run build`), the publish directory (`dist`) and Node 22.
5. **Deploy**. First build takes a couple of minutes, mostly image optimisation.

You'll get a temporary address like `graceful-otter-a1b2c3.netlify.app`. Check
the site works there before touching DNS. Note that subdomain down, you need it
in step 3.

## 2. Claim the domain in Netlify

In the site's **Domain management → Add a domain**, enter `lucyschodell.com`.

Netlify will say DNS isn't configured yet. Expected. It also automatically
registers `www.lucyschodell.com` alongside the apex, which is why step 3 adds
two records rather than one.

## 3. Point Porkbun at Netlify

In Porkbun: **Account → Domain Management → lucyschodell.com → DNS**.

**Delete the default parking records first.** Porkbun pre-fills an ALIAS on the
root and a CNAME on `www`, both aimed at its own parking page. If you leave them
in place they win and the site never appears.

Then add:

| Type  | Host    | Answer                          |
| ----- | ------- | ------------------------------- |
| ALIAS | *empty* | `apex-loadbalancer.netlify.com` |
| CNAME | `www`   | `your-site.netlify.app`         |

ALIAS is the right record for the apex. A plain CNAME is not legal there, and
Porkbun's ALIAS resolves to whatever IPs Netlify is using at the time, so it
keeps working if Netlify changes them. (The A-record fallback, `75.2.60.5`, is
only for registrars without ALIAS support. Porkbun has it, so don't use that.)

## 4. Wait, then turn on HTTPS

DNS usually propagates in minutes, but allow up to 24 hours. When Netlify's
domain panel shows the domain verified, it provisions a free Let's Encrypt
certificate automatically. If the button is greyed out, DNS hasn't propagated
yet; check back rather than changing anything.

Confirm both work:

- `https://lucyschodell.com`
- `https://www.lucyschodell.com` (should redirect to the apex)

## 5. Tell search engines

1. [Google Search Console](https://search.google.com/search-console) → add
   `lucyschodell.com` as a **Domain** property. It gives you a TXT record to add
   at Porkbun. Then submit `https://lucyschodell.com/sitemap-index.xml`.
2. [Bing Webmaster Tools](https://www.bing.com/webmasters) → import from Google
   Search Console, which saves doing it twice.
3. Check the markup with the
   [Rich Results Test](https://search.google.com/test/rich-results). You should
   see one `Person` with `alternateName: Lucy Scholz`.
4. Add the link to your Substack, Instagram and LinkedIn profiles. Those inbound
   links are what actually merge your two names into one entity in Google's
   index; the structured data only declares the relationship.

---

## Changing the domain later

It lives in two places and they must match, or canonical tags point at a host
the sitemap never lists:

- `SITE` in `astro.config.mjs`
- `origin` in `src/lib/site.ts`

A production build fails with a clear error if they drift. `robots.txt` and
`rss.xml` are generated from the same value.
