# JICO Ranch — website

A working family ranch and market garden in Loris, South Carolina (northern Horry
County): livestock,
a market garden, a farm stand, and the gate open to the public.

Static site — no build step, no dependencies. Open `index.html` and it runs.

Palette taken from the branding-iron logo: forged ink `#1A1714` on warm cream `#EDE3D4`,
with pasture green `#6E8259` (garden side) and ember rust `#A6472E` (animal side).
Type: **Fraunces** (display serif) + **Jost** (geometric sans, matches the JICO wordmark).

## Structure
```
index.html                  single page, all sections
assets/css/styles.css       full style system
assets/js/main.js           data block + all behavior
assets/img/                 logo (real artwork, PNG), favicon, stand-in photos (JPG)
                            + PHOTO-CREDITS.md listing every photo's source
assets/video/               hero clips go here (empty for now)
```

## Layout notes
The page borrows the structure the big legacy ranch sites use, adapted for agritourism:

- **Split headline** (`.dual`) — small serif lead-in over a large all-caps line. Used for
  the hero and every section head. This is the signature move; keep it consistent.
- **Full-bleed bands** (`.band`) — the Animals and Garden pillars each get a full-height
  image/video section with a big ghosted number. Swap the `<img>` for a `<video>` when
  you have footage.
- **Today at the ranch** — the live status strip under the hero. Nothing on a ranch site
  gets read more than "are you open and what can I pick." This is the piece the big ranch
  sites don't have and the agritourism sites win on.
- **Season calendar** — month-by-month crop availability, current month auto-highlighted.
- **Hero montage** — the headline sits over crossfading photos with a slow drift. Real
  footage takes over the moment `HERO_CLIPS` has anything in it.
- **The land ribbon** (`.ribbon`) — a full-bleed three-up photo strip, no headline.

## Editing the things that change
Open `assets/js/main.js`. Everything you'll touch is in the marked block at the very top:

| What | Where |
|---|---|
| What's ripe / what's at the stand | `RANCH.picking`, `RANCH.stand` |
| Force a CLOSED banner (weather, private event) | `RANCH.notice` |
| Open hours per day | `RANCH.hours` |
| Hero video clips | `HERO_CLIPS` (filenames in `assets/video/`) — wins over the stills |
| Hero crossfade photos | `HERO_STILLS` (filenames in `assets/img/`) |
| Weather grid cell | `WEATHER` — two National Weather Service URLs |
| Animal roster | `ANIMALS` |
| Event calendar | `EVENTS` (past dates drop off automatically) |
| Harvest of the month | `HARVESTS` — newest FIRST, empty is fine |
| Season calendar | `SEASON` — 12 numbers per crop, Jan→Dec, `0` none `1` available `2` peak |

Experience cards and their pricing are plain HTML in `index.html` under
`<!-- ============ EXPERIENCES ============ -->`.

## Weather
The status strip shows live conditions for the ranch from the **National Weather
Service** — public-domain US government data, no API key, no account, no usage limit,
nothing to renew. `WEATHER` in `main.js` holds two URLs for grid cell `ILM 56,63`, the
~2.5km square covering 2407 Highway 66, so it is the ranch's forecast and not a city
twenty miles away. To move it, open `https://api.weather.gov/points/<lat>,<lon>` and
copy the two URLs out of the response.

It fails silently and the item simply never appears, which is the right behaviour: a
live-looking widget showing a stale number is worse than no widget. Results cache in
`sessionStorage` for 15 minutes.

## Harvest of the Month

Lives at the foot of the Garden section and runs off the `HARVESTS` array at the top of
`assets/js/main.js`. Newest entry **first**. Each one needs `month`, `crop`, `variety`,
`img`, `body`, `timeline` (`sown`, optional `planted`, `firstPick` as `YYYY-MM-DD`),
`yield`, `window`, `grown` and `use`.

**Days to harvest is calculated**, never typed — the timeline measures `sown` to
`firstPick` and places each marker at its true proportional position, so a 54-day radish
and a 110-day melon visibly differ. Leave `planted` out for anything direct-sown.

While `HARVESTS` is empty the section shows a "harvest of the month starts with the first
crop" panel; adding an entry hides it automatically. A filled-in example sits at the
bottom of `main.js` as `HARVEST_EXAMPLE` — copy it to the top of `HARVESTS` and delete
the comment block.

## Cache busting
`index.html` loads `styles.css?v=YYYYMMDD` and `main.js?v=YYYYMMDD`. **Bump that date
whenever you edit either file.** Without it a returning visitor keeps their cached copy
of `main.js`, and a stale copy can point at image filenames that no longer exist -- the
animal roster renders from that file, so it goes to broken-image icons and you would
never see it yourself on a fresh browser.

## Replacing the stand-in photos
Every photo in `assets/img/` is a real photograph of **somebody else's** farm, pulled
from Unsplash under the [Unsplash License](https://unsplash.com/license) — free for
commercial use, no attribution required. They are there so the site reads as a working
ranch instead of a wireframe while we wait on our own photography.

`assets/img/PHOTO-CREDITS.md` lists every file, what it shows and which Unsplash photo
it came from. `tools/fetch-photos.py` holds the manifest and re-downloads the lot
(`--force`); it crops server-side, re-encodes locally at quality 78 and strips camera
metadata, so nothing ships oversized.

**To swap in a real JICO Ranch photo:** drop a file with the same name into
`assets/img/` and delete its row from `PHOTO-CREDITS.md`. Nothing in the markup
changes. Sizes the manifest uses: bands 2000x1125, the land ribbon 1400x933, cards
1200x800, gallery tiles 900x900. The hero is `hero-ranch.jpg`, referenced inline in
the `.hero__bg` style rather than as an `<img>`.

**The logo** is the real JICO Ranch artwork. Everything in `assets/img/logo-*.png` and
`favicon.png` is derived from the original file by keying the tan background out on
luminance, so the mark keeps its cast-iron texture and bevel on a transparent background.

| File | Use |
|---|---|
| `logo-lockup-h.png` | horizontal lockup, dark — header |
| `logo-lockup-h-cream.png` | horizontal lockup, cream — footer / dark grounds |
| `logo-lockup.png` / `-cream.png` | the original stacked lockup |
| `logo-mark.png` / `-cream.png` | the JR mark on its own |
| `favicon.png` | cream mark on a rounded ink tile |
| `og-card.png` | 1200x630 social preview card |

To regenerate them all from a new source file, rerun the build script with the new path —
it re-measures the three bands (mark, JICO, RANCH) rather than assuming fixed crops.

The horizontal lockup is composed from the original artwork: the stacked version is too
tall for an 82px header, so the mark sits left of the wordmark. The stacked original is
kept in `logo-lockup.png` if you ever want it.

## TODO before launch
- [ ] **Remove the search-engine gate.** `index.html` has
      `<meta name="robots" content="noindex, nofollow">` near the top so Google won't index
      placeholder hours and prices. Delete that one line when the real details are in —
      the site is otherwise fully live and shareable.
- [ ] Confirm the phone number — currently the JICO line `301-542-2542`. Give the ranch its own if it has one.
- [ ] Confirm the public email — `jicoranch@gmail.com` is a placeholder, in `index.html` and in `main.js` (`EMAIL`).
- [ ] Fill in the real town/county, address and directions (`#visit`, "Where we are") and the JSON-LD `address` block.
- [ ] Set the four stat numbers in the `#about` stats block — they're `data-count="0"` and render as `00` until you do.
- [ ] Confirm hours, admission price, and every experience price. All currently plausible placeholders.
- [ ] Real photos throughout — every `.jpg` in `assets/img/` is somebody else's farm.
      See `assets/img/PHOTO-CREDITS.md`. **Do not fabricate reviews or testimonials**
      if you add a proof section.
- [ ] Contact + signup forms: create a free Formspree form and paste the endpoint into both
      `<form id="contactForm" action="">` and `<form id="signupForm" action="">`. Until then
      they fall back to opening an email.
- [ ] Real Facebook / Instagram URLs in the footer (`href="#"` right now), and add them to `sameAs` in the JSON-LD.
- [ ] Update `og:url`, `canonical` and the JSON-LD `url` if the domain isn't `jicoranch.com`.

## Deploy (GitHub Pages) — domain: jicoranch.com

`CNAME` in this folder already contains `jicoranch.com`; GitHub Pages reads it automatically.

1. Create a repo on github.com (e.g. `jico-ranch`), then from this folder:
   `git init && git add -A && git commit -m "JICO Ranch site" && git branch -M main`
   `git remote add origin https://github.com/chriswjones6/jico-ranch.git && git push -u origin main`
2. Repo → **Settings → Pages** → Source: *Deploy from a branch*, Branch: `main` / `/ (root)`.
3. Same page, **Custom domain**: `jicoranch.com` → Save. Tick **Enforce HTTPS** once the
   certificate finishes provisioning (can take up to an hour after DNS resolves).

### GoDaddy DNS — jicoranch.com
GoDaddy → **My Products → jicoranch.com → DNS → Manage Zones**.

Replace the existing parked `A` record on `@`, and add the other three:

| Type | Name | Value | TTL |
|---|---|---|---|
| A | @ | 185.199.108.153 | 1 hour |
| A | @ | 185.199.109.153 | 1 hour |
| A | @ | 185.199.110.153 | 1 hour |
| A | @ | 185.199.111.153 | 1 hour |
| CNAME | www | chriswjones6.github.io | 1 hour |

Optional IPv6 (`AAAA` on `@`): `2606:50c0:8000::153`, `:8001::153`, `:8002::153`, `:8003::153`.

**Do not change:**
- **Nameservers** — leave them on GoDaddy.
- **MX records** — changing these breaks email on the domain.
- **TXT / SPF / DKIM** records — same reason.

Also check **Domain Forwarding is off** (GoDaddy → Domain Settings). A leftover forward
will override the A records and the site won't resolve.

DNS usually propagates in 10–60 minutes. Check with `nslookup jicoranch.com` — you want
the 185.199.x.153 addresses back, not a GoDaddy parking IP.

## Removed, not deleted
Three sections came off the page on 2026-11-28 to cut its length: the capability grid
("everything else"), the photo gallery ("around the place") and the monthly build log
("from the ground up"). Harvest of the Month survived and moved into the Garden section.

Their CSS is deliberately still in `styles.css` and the eight `gallery-*.jpg` files are
still in `assets/img/`, because the gallery was taken out *for now* — putting it back is
a block of markup, not a rebuild. `store-eggs/honey/meat/flowers/preserves.jpg` are also
on disk unused, held for a farm-stand gallery that does not exist yet.
