# JICO Ranch — website

A working family ranch and market garden in the South Carolina Lowcountry: livestock,
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
assets/img/                 logo, favicon, placeholder photos (SVG)
assets/video/               hero clips go here (empty for now)
```

## Layout notes
The page borrows the structure the big legacy ranch sites use, adapted for agritourism:

- **Split headline** (`.dual`) — small serif lead-in over a large all-caps line. Used for
  the hero and every section head. This is the signature move; keep it consistent.
- **Full-bleed bands** (`.band`) — the Animals and Garden pillars each get a full-height
  image/video section with a big ghosted number. Swap the `<img>` for a `<video>` when
  you have footage.
- **Capability grid** (`.caps`) — the plain text "everything else we offer" grid.
- **Today at the ranch** — the live status strip under the hero. Nothing on a ranch site
  gets read more than "are you open and what can I pick." This is the piece the big ranch
  sites don't have and the agritourism sites win on.
- **Season calendar** — month-by-month crop availability, current month auto-highlighted.

## Editing the things that change
Open `assets/js/main.js`. Everything you'll touch is in the marked block at the very top:

| What | Where |
|---|---|
| What's ripe / what's at the stand | `RANCH.picking`, `RANCH.stand` |
| Force a CLOSED banner (weather, private event) | `RANCH.notice` |
| Open hours per day | `RANCH.hours` |
| Hero video clips | `HERO_CLIPS` (filenames in `assets/video/`) |
| Animal roster | `ANIMALS` |
| Event calendar | `EVENTS` (past dates drop off automatically) |
| Season calendar | `SEASON` — 12 numbers per crop, Jan→Dec, `0` none `1` available `2` peak |

Experience cards and their pricing are plain HTML in `index.html` under
`<!-- ============ EXPERIENCES ============ -->`. The "everything else" grid is right
below it under `#more`.

## Replacing the placeholders
Every image in `assets/img/` is a generated SVG placeholder. Drop a real photo in with
the **same filename** (`.jpg` is fine — update the `src` extension) and it appears. The
hero still is `hero-ranch.svg`, referenced inline in the `.hero__bg` style.

**The logo** is a hand-built recreation of the JR branding-iron mark, not the original
artwork. To use the real thing, overwrite `assets/img/logo-mark-ink.svg` and
`logo-mark-cream.svg` (dark version for light backgrounds, cream version for dark) — or
drop in PNGs and change the two `src` attributes in `index.html` (header + footer).
The "JICO / RANCH" wordmark next to the mark is live HTML text, so it stays crisp.

## TODO before launch
- [ ] **Replace the logo files with the original artwork.**
- [ ] Confirm the phone number — currently the JICO line `301-542-2542`. Give the ranch its own if it has one.
- [ ] Confirm the public email — `info@jicoranch.com` is a placeholder, in `index.html` and in `main.js` (`EMAIL`).
- [ ] Fill in the real town/county, address and directions (`#visit`, "Where we are") and the JSON-LD `address` block.
- [ ] Set the four stat numbers in the `#about` stats block — they're `data-count="0"` and render as `00` until you do.
- [ ] Confirm hours, admission price, and every experience price. All currently plausible placeholders.
- [ ] Prune the "everything else" grid down to what the ranch actually offers.
- [ ] Real photos throughout — **do not fabricate reviews or testimonials** if you add a proof section.
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
