# Amazon Associates — application prep

Chris applies to this himself. It ends in a signed Operating Agreement and a W-9 tax
certification made under penalty of perjury, plus the ranch EIN and bank details —
not things to hand off.

This file is the prep work: what to have ready, draft answers for the free-text
questions, and the order to do it in.

---

## Do not apply yet

Two reasons, both material:

1. **Amazon reviews the site at application.** `jicoranch.com` currently carries
   `<meta name="robots" content="noindex, nofollow">` and `/kit.html` is unlinked with
   two draft entries. That reads as a site under construction and is a likely rejection.
2. **The 180-day clock starts at acceptance.** Three qualifying sales within 180 days
   or the account closes and you reapply from scratch. Starting that clock against a
   site search engines are told to ignore wastes the window.

**Apply after:** the kit page has real entries, the `noindex` line is gone from every
page, and the page is linked from the Garden and Animals sections so it is reachable.

---

## Have ready

- **Legal entity name** for the ranch, exactly as registered
- **EIN** for that entity
- **Business address and phone**
- **Bank account** for direct deposit
- **Preferred tracking ID** — ask for `jicoranch-20`. This is the only thing from the
  whole process that touches the code: it goes in `AFFILIATE.amazonTag` in
  `assets/js/kit.js`, and every link on the page builds itself from it.

Apply at **affiliate-program.amazon.com**. Register as the business (EIN), not as an
individual, so commission and the 1099 land with the ranch.

---

## Draft answers for the application

The application asks a set of free-text questions. These are honest answers to give
once the page is live — adjust the traffic figure to whatever is true on the day.

**What are your websites or apps about?**
> JICO Ranch is a 145-acre working ranch and market garden in Loris, South Carolina.
> The site covers the animals, the garden, visitor experiences, and a running record of
> what we actually use to run the place — feed, supplements, fencing and tools — with
> what we paid, how often we use it, and how it has held up.

**Which topics best describe your site?**
> Home & Garden; Pets; Grocery & Gourmet Food

**What types of Amazon items do you intend to list?**
> Livestock and poultry feed and supplements, fencing and water hardware, garden and
> orchard supplies, and hand tools. Only products we have bought and use on the ranch.

**What are your site's primary traffic sources?**
> Organic search from people in the region looking for local farm and gardening
> information, plus our Instagram and YouTube.

**How do you drive traffic to your site?**
> Original local content — a Horry County planting-date tool built on Clemson
> Extension's coastal chart, a monthly harvest write-up, and the equipment and feed
> records described above. Plus social posts as the build progresses.

**How do you utilise your websites to generate income?**
> Primarily by selling our own produce, eggs and honey, bookings for on-farm
> experiences, and animal sponsorships. Affiliate links are a minor secondary element
> on a single page.

**How do you usually build links?**
> Manually, by hand, within written articles about products we have used.

**How many visitors does your site get monthly?**
> [Give the real figure on the day. Do not inflate it.]

---

## Rules that bind the kit page once you are in

- **Disclosure must be present.** It is, above the list, and it hides itself when there
  is nothing to disclose.
- **Never publish Amazon's current price.** Their pricing may only be shown if pulled
  from the Product Advertising API and refreshed every 24 hours, so a hand-typed price
  violates the agreement the day it goes stale. Use what *we* paid with a date, or a
  cost-per-use figure.
- **No affiliate links in email, PDFs, or anything offline.** The monthly note cannot
  carry them — link to the page instead.
- **Only recommend what we actually use.** This is the house rule rather than Amazon's,
  and it is the one that matters: the commission is rounding error next to being the
  farm people believe.

---

## Two other Amazon things, often confused with this one

- **Amazon Influencer Program** — the one that gives you an `amazon.com/shop/<name>`
  storefront. Separate application, needs a qualifying social following. Optional, and
  possibly worth it later given the ranch Instagram and YouTube.
- **Amazon Business** — unrelated to affiliates entirely. It is an account for *buying*
  as a business, with tax exemption and bulk pricing. Probably worth having on its own
  merits if feed is going on the card every month.
